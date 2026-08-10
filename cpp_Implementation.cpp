#include <iostream>
#include <vector>
#include <queue>
#include <unordered_set>
#include <unordered_map>
#include <list>
#include <string>
#include <algorithm>
#include <climits>
#include <iomanip>

using namespace std;

struct Step {
    int timeIndex;
    int page;
    bool isFault;
    int evictedPage;            // -1 if none
    vector<int> framesSnapshot; // -1 for empty slots
};

struct SimulationTrace {
    string algorithmName;
    vector<Step> steps;
    int faults = 0;
    int hits = 0;
    int accesses = 0;
};

static string framesToString(const vector<int>& frames) {
    string out = "[";
    for (size_t i = 0; i < frames.size(); ++i) {
        if (i) out += " ";
        if (frames[i] == -1) out += "-";
        else out += to_string(frames[i]);
    }
    out += "]";
    return out;
}

static void printTrace(const SimulationTrace& trace) {
    cout << "=== " << trace.algorithmName << " ===\n";
    cout << left << setw(6) << "Step" << setw(8) << "Page" << setw(10) << "Result" << setw(14) << "Evicted" << "Frames\n";
    cout << string(70, '-') << "\n";
    for (const Step &s : trace.steps) {
        cout << setw(6) << s.timeIndex
             << setw(8) << s.page
             << setw(10) << (s.isFault ? "Fault" : "Hit")
             << setw(14) << (s.evictedPage == -1 ? "-" : to_string(s.evictedPage))
             << framesToString(s.framesSnapshot) << "\n";
    }
    cout << string(70, '-') << "\n";
    cout << "Accesses: " << trace.accesses << "\n";
    cout << "Faults  : " << trace.faults << "\n";
    cout << "Hits    : " << trace.hits << "\n";
    double hitRate = (trace.accesses > 0) ? (100.0 * trace.hits / trace.accesses) : 0.0;
    cout << fixed << setprecision(2) << "Hit %   : " << hitRate << "%\n\n";
}

// FIFO trace
SimulationTrace simulateFIFOTrace(const vector<int>& referenceString, int frameCapacity) {
    SimulationTrace trace; trace.algorithmName = "FIFO";
    int n = referenceString.size();
    trace.accesses = n;
    if (frameCapacity <= 0) {
        trace.faults = n;
        trace.hits = 0;
        for (int i = 0; i < n; ++i) {
            Step s{i, referenceString[i], true, -1, {}};
            trace.steps.push_back(s);
        }
        return trace;
    }

    vector<int> frames(frameCapacity, -1);
    unordered_map<int,int> pageIndex; // page -> index in frames
    queue<int> fifoOrder;             // pages in FIFO order

    for (int i = 0; i < n; ++i) {
        int page = referenceString[i];
        bool hit = (pageIndex.find(page) != pageIndex.end());
        int evicted = -1;

        if (hit) {
            // nothing to change in frames
        } else {
            trace.faults++;
            // empty slot?
            bool inserted = false;
            for (int j = 0; j < frameCapacity; ++j) {
                if (frames[j] == -1) {
                    frames[j] = page;
                    pageIndex[page] = j;
                    fifoOrder.push(page);
                    inserted = true;
                    break;
                }
            }
            if (!inserted) {
                int oldest = fifoOrder.front();
                fifoOrder.pop();
                int idx = pageIndex[oldest];
                evicted = oldest;
                pageIndex.erase(oldest);
                frames[idx] = page;
                pageIndex[page] = idx;
                fifoOrder.push(page);
            }
        }

        trace.steps.push_back({i, page, !hit, evicted, frames});
    }

    trace.hits = trace.accesses - trace.faults;
    return trace;
}

// OPTIMAL trace
SimulationTrace simulateOptimalTrace(const vector<int>& referenceString, int frameCapacity) {
    SimulationTrace trace; trace.algorithmName = "Optimal";
    int n = referenceString.size();
    trace.accesses = n;
    if (frameCapacity <= 0) {
        trace.faults = n;
        trace.hits = 0;
        for (int i = 0; i < n; ++i) trace.steps.push_back({i, referenceString[i], true, -1, {}});
        return trace;
    }

    vector<int> frames(frameCapacity, -1);
    unordered_map<int,int> pageIndex;

    for (int i = 0; i < n; ++i) {
        int page = referenceString[i];
        bool hit = (pageIndex.find(page) != pageIndex.end());
        int evicted = -1;

        if (!hit) {
            trace.faults++;
            bool inserted = false;
            for (int j = 0; j < frameCapacity; ++j) {
                if (frames[j] == -1) {
                    frames[j] = page;
                    pageIndex[page] = j;
                    inserted = true;
                    break;
                }
            }
            if (!inserted) {
                int victimIdx = -1;
                int farthestNext = -1;
                for (int j = 0; j < frameCapacity; ++j) {
                    int curPage = frames[j];
                    int nextPos = INT_MAX;
                    for (int k = i + 1; k < n; ++k) {
                        if (referenceString[k] == curPage) {
                            nextPos = k;
                            break;
                        }
                    }
                    if (nextPos == INT_MAX) { // not used again -> best candidate
                        victimIdx = j;
                        break;
                    }
                    if (nextPos > farthestNext) {
                        farthestNext = nextPos;
                        victimIdx = j;
                    }
                }
                evicted = frames[victimIdx];
                pageIndex.erase(evicted);
                frames[victimIdx] = page;
                pageIndex[page] = victimIdx;
            }
        }
        trace.steps.push_back({i, page, hit, evicted, frames});
    }

    trace.hits = trace.accesses - trace.faults;
    return trace;
}

// LRU trace
SimulationTrace simulateLRUTrace(const vector<int>& referenceString, int frameCapacity) {
    SimulationTrace trace; trace.algorithmName = "LRU";
    int n = referenceString.size();
    trace.accesses = n;
    if (frameCapacity <= 0) {
        trace.faults = n;
        trace.hits = 0;
        for (int i = 0; i < n; ++i) trace.steps.push_back({i, referenceString[i], true, -1, {}});
        return trace;
    }

    vector<int> frames(frameCapacity, -1);
    unordered_map<int,int> pageIndex;
    list<int> recentList; // front = most recent, back = least recent
    unordered_map<int, list<int>::iterator> iterMap;

    for (int i = 0; i < n; ++i) {
        int page = referenceString[i];
        bool hit = (pageIndex.find(page) != pageIndex.end());
        int evicted = -1;

        if (hit) {
            auto it = iterMap[page];
            recentList.erase(it);
            recentList.push_front(page);
            iterMap[page] = recentList.begin();
        } else {
            trace.faults++;
            bool inserted = false;
            for (int j = 0; j < frameCapacity; ++j) {
                if (frames[j] == -1) {
                    frames[j] = page;
                    pageIndex[page] = j;
                    recentList.push_front(page);
                    iterMap[page] = recentList.begin();
                    inserted = true;
                    break;
                }
            }
            if (!inserted) {
                int lruPage = recentList.back();
                recentList.pop_back();
                iterMap.erase(lruPage);
                int victimIdx = pageIndex[lruPage];
                evicted = lruPage;
                pageIndex.erase(lruPage);
                frames[victimIdx] = page;
                pageIndex[page] = victimIdx;
                recentList.push_front(page);
                iterMap[page] = recentList.begin();
            }
        }
        trace.steps.push_back({i, page, !hit, evicted, frames});
    }

    trace.hits = trace.accesses - trace.faults;
    return trace;
}

// LFU trace (tie-breaker: older lastUsed)
SimulationTrace simulateLFUTrace(const vector<int>& referenceString, int frameCapacity) {
    SimulationTrace trace; trace.algorithmName = "LFU";
    int n = referenceString.size();
    trace.accesses = n;
    if (frameCapacity <= 0) {
        trace.faults = n;
        trace.hits = 0;
        for (int i = 0; i < n; ++i) trace.steps.push_back({i, referenceString[i], true, -1, {}});
        return trace;
    }

    vector<int> frames(frameCapacity, -1);
    unordered_map<int,int> pageIndex;
    unordered_map<int,int> frequency;
    unordered_map<int,int> lastUsed; // timestamp
    int timestamp = 0;

    for (int i = 0; i < n; ++i) {
        timestamp++;
        int page = referenceString[i];
        bool hit = (pageIndex.find(page) != pageIndex.end());
        int evicted = -1;

        if (hit) {
            frequency[page]++;
            lastUsed[page] = timestamp;
        } else {
            trace.faults++;
            bool inserted = false;
            for (int j = 0; j < frameCapacity; ++j) {
                if (frames[j] == -1) {
                    frames[j] = page;
                    pageIndex[page] = j;
                    frequency[page]++; // count this access
                    lastUsed[page] = timestamp;
                    inserted = true;
                    break;
                }
            }
            if (!inserted) {
                int victimIdx = -1;
                int minFreq = INT_MAX;
                int oldestTime = INT_MAX;
                for (int j = 0; j < frameCapacity; ++j) {
                    int p = frames[j];
                    int freq = frequency[p];
                    int lu = (lastUsed.count(p) ? lastUsed[p] : 0);
                    if (freq < minFreq || (freq == minFreq && lu < oldestTime)) {
                        minFreq = freq;
                        oldestTime = lu;
                        victimIdx = j;
                    }
                }
                evicted = frames[victimIdx];
                pageIndex.erase(evicted);
                frames[victimIdx] = page;
                pageIndex[page] = victimIdx;
                frequency[page]++; // include this access
                lastUsed[page] = timestamp;
            }
        }
        trace.steps.push_back({i, page, !hit, evicted, frames});
    }

    trace.hits = trace.accesses - trace.faults;
    return trace;
}

// MFU trace (tie-breaker: older lastUsed)
SimulationTrace simulateMFUTrace(const vector<int>& referenceString, int frameCapacity) {
    SimulationTrace trace; trace.algorithmName = "MFU";
    int n = referenceString.size();
    trace.accesses = n;
    if (frameCapacity <= 0) {
        trace.faults = n;
        trace.hits = 0;
        for (int i = 0; i < n; ++i) trace.steps.push_back({i, referenceString[i], true, -1, {}});
        return trace;
    }

    vector<int> frames(frameCapacity, -1);
    unordered_map<int,int> pageIndex;
    unordered_map<int,int> frequency;
    unordered_map<int,int> lastUsed;
    int timestamp = 0;

    for (int i = 0; i < n; ++i) {
        timestamp++;
        int page = referenceString[i];
        bool hit = (pageIndex.find(page) != pageIndex.end());
        int evicted = -1;

        if (hit) {
            frequency[page]++;
            lastUsed[page] = timestamp;
        } else {
            trace.faults++;
            bool inserted = false;
            for (int j = 0; j < frameCapacity; ++j) {
                if (frames[j] == -1) {
                    frames[j] = page;
                    pageIndex[page] = j;
                    frequency[page] = 1; // <-- FIX: Frequency of a new page is 1
                    lastUsed[page] = timestamp;
                    inserted = true;
                    break;
                }
            }
            if (!inserted) {
                int victimIdx = -1;
                int maxFreq = -1;
                int oldestTime = INT_MAX;
                for (int j = 0; j < frameCapacity; ++j) {
                    int p = frames[j];
                    int freq = frequency[p];
                    int lu = (lastUsed.count(p) ? lastUsed[p] : 0);
                    if (freq > maxFreq || (freq == maxFreq && lu < oldestTime)) {
                        maxFreq = freq;
                        oldestTime = lu;
                        victimIdx = j;
                    }
                }
                evicted = frames[victimIdx];
                pageIndex.erase(evicted);
                frames[victimIdx] = page;
                pageIndex[page] = victimIdx;
                frequency[page] = 1; 
                lastUsed[page] = timestamp;
            }
        }
        trace.steps.push_back({i, page, !hit, evicted, frames});
    }

    trace.hits = trace.accesses - trace.faults;
    return trace;
}

int main() {
    int size;
    cout << "Enter Referencing String Size: ";
    if (!(cin >> size) || size < 0) return 0;

    vector<int> referenceString(size);
    cout << "Enter Reference String (space separated): ";
    for (int i = 0; i < size; ++i) cin >> referenceString[i];

    int frameCapacity;
    cout << "Enter No. of Frames: ";
    cin >> frameCapacity;
    cout << "\n";

    cout << "Reference String: ";
    for (int p : referenceString) cout << p << " ";
    cout << "\nFrames: " << frameCapacity << "\n\n";

    SimulationTrace fifoTrace = simulateFIFOTrace(referenceString, frameCapacity);
    SimulationTrace optimalTrace = simulateOptimalTrace(referenceString, frameCapacity);
    SimulationTrace lruTrace = simulateLRUTrace(referenceString, frameCapacity);
    SimulationTrace lfuTrace = simulateLFUTrace(referenceString, frameCapacity);
    SimulationTrace mfuTrace = simulateMFUTrace(referenceString, frameCapacity);

    printTrace(fifoTrace);
    printTrace(optimalTrace);
    printTrace(lruTrace);
    printTrace(lfuTrace);
    printTrace(mfuTrace);

    return 0;
}
