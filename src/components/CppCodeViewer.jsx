import React, { useState } from 'react';
import { Code2, Copy, Check, Terminal, FileCode2 } from 'lucide-react';

const CPP_CODE = `#include <iostream>
#include <vector>
#include <unordered_map>
#include <list>
#include <algorithm>
#include <climits>
#include <iomanip>

using namespace std;

struct StepSnapshot {
    int stepIndex;
    int pageRequested;
    bool isFault;
    int evictedPage;
    vector<int> frameState;
};

struct SimulationTrace {
    string algorithmName;
    int accesses;
    int faults;
    int hits;
    vector<StepSnapshot> steps;
};

// FIFO Page Replacement Implementation
SimulationTrace simulateFIFOTrace(const vector<int>& referenceString, int frameCapacity) {
    SimulationTrace trace; trace.algorithmName = "FIFO";
    int n = referenceString.size();
    trace.accesses = n;
    
    vector<int> frames(frameCapacity, -1);
    unordered_map<int,int> pageIndex;
    int fifoPointer = 0;

    for (int i = 0; i < n; ++i) {
        int page = referenceString[i];
        bool hit = (pageIndex.find(page) != pageIndex.end());
        int evicted = -1;

        if (!hit) {
            trace.faults++;
            if (pageIndex.size() < frameCapacity) {
                for (int j = 0; j < frameCapacity; ++j) {
                    if (frames[j] == -1) {
                        frames[j] = page;
                        pageIndex[page] = j;
                        break;
                    }
                }
            } else {
                evicted = frames[fifoPointer];
                pageIndex.erase(evicted);
                frames[fifoPointer] = page;
                pageIndex[page] = fifoPointer;
                fifoPointer = (fifoPointer + 1) % frameCapacity;
            }
        }
        trace.steps.push_back({i, page, !hit, evicted, frames});
    }

    trace.hits = trace.accesses - trace.faults;
    return trace;
}

// Optimal Page Replacement Implementation
SimulationTrace simulateOptimalTrace(const vector<int>& referenceString, int frameCapacity) {
    SimulationTrace trace; trace.algorithmName = "Optimal";
    int n = referenceString.size();
    trace.accesses = n;
    
    vector<int> frames(frameCapacity, -1);
    unordered_map<int,int> pageIndex;

    for (int i = 0; i < n; ++i) {
        int page = referenceString[i];
        bool hit = (pageIndex.find(page) != pageIndex.end());
        int evicted = -1;

        if (!hit) {
            trace.faults++;
            if (pageIndex.size() < frameCapacity) {
                for (int j = 0; j < frameCapacity; ++j) {
                    if (frames[j] == -1) {
                        frames[j] = page;
                        pageIndex[page] = j;
                        break;
                    }
                }
            } else {
                int victimIdx = -1;
                int farthest = -1;
                for (int j = 0; j < frameCapacity; ++j) {
                    int p = frames[j];
                    int nextUse = INT_MAX;
                    for (int k = i + 1; k < n; ++k) {
                        if (referenceString[k] == p) {
                            nextUse = k;
                            break;
                        }
                    }
                    if (nextUse > farthest) {
                        farthest = nextUse;
                        victimIdx = j;
                    }
                }
                evicted = frames[victimIdx];
                pageIndex.erase(evicted);
                frames[victimIdx] = page;
                pageIndex[page] = victimIdx;
            }
        }
        trace.steps.push_back({i, page, !hit, evicted, frames});
    }

    trace.hits = trace.accesses - trace.faults;
    return trace;
}

// LRU Page Replacement Implementation
SimulationTrace simulateLRUTrace(const vector<int>& referenceString, int frameCapacity) {
    SimulationTrace trace; trace.algorithmName = "LRU";
    int n = referenceString.size();
    trace.accesses = n;
    
    vector<int> frames(frameCapacity, -1);
    unordered_map<int,int> pageIndex;
    list<int> recentList;
    unordered_map<int, list<int>::iterator> iterMap;

    for (int i = 0; i < n; ++i) {
        int page = referenceString[i];
        bool hit = (pageIndex.find(page) != pageIndex.end());
        int evicted = -1;

        if (hit) {
            recentList.erase(iterMap[page]);
            recentList.push_front(page);
            iterMap[page] = recentList.begin();
        } else {
            trace.faults++;
            if (pageIndex.size() < frameCapacity) {
                for (int j = 0; j < frameCapacity; ++j) {
                    if (frames[j] == -1) {
                        frames[j] = page;
                        pageIndex[page] = j;
                        recentList.push_front(page);
                        iterMap[page] = recentList.begin();
                        break;
                    }
                }
            } else {
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

int main() {
    vector<int> referenceString = {7, 0, 1, 2, 0, 3, 0, 4, 2, 3, 0, 3, 2, 1, 2, 0, 1, 7, 0, 1};
    int frameCapacity = 3;

    SimulationTrace trace = simulateFIFOTrace(referenceString, frameCapacity);
    cout << "FIFO Hits: " << trace.hits << ", Faults: " << trace.faults << endl;
    return 0;
}`;

const CppCodeViewer = () => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(CPP_CODE);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-[#1e1735]/90 border border-pink-500/20 rounded-3xl overflow-hidden shadow-2xl backdrop-blur-lg">
      {/* Code Header Bar */}
      <div className="px-6 py-4 bg-[#16102b] border-b border-pink-500/20 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-lg bg-pink-600/30 border border-pink-500/30 flex items-center justify-center">
            <FileCode2 className="w-4 h-4 text-pink-400" />
          </div>
          <div>
            <h3 className="font-bold text-white text-sm">cpp_Implementation.cpp</h3>
            <p className="text-[11px] text-gray-400">Reference C++ Implementation for OS Algorithms</p>
          </div>
        </div>

        <button
          onClick={handleCopy}
          className="px-3.5 py-1.5 rounded-xl bg-pink-600/20 hover:bg-pink-600/40 border border-pink-500/30 text-pink-300 text-xs font-semibold flex items-center gap-1.5 transition-all"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-emerald-300">Copied!</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5" />
              <span>Copy C++ Code</span>
            </>
          )}
        </button>
      </div>

      {/* Code Body */}
      <div className="p-6 overflow-x-auto max-h-[500px] bg-[#120e24] font-mono text-xs text-gray-300 leading-relaxed scrollbar-thin scrollbar-thumb-pink-500/30">
        <pre className="whitespace-pre">
          {CPP_CODE}
        </pre>
      </div>
    </div>
  );
};

export default CppCodeViewer;
