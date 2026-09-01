// ============================================================
// algorithms/lfu.js - LFU Page Replacement Algorithm
// ============================================================
// LFU = Least Frequently Used
// The page with the LOWEST access frequency count is replaced
// when a new page needs to be loaded.
// If two pages have the same frequency, the one that was
// used LEAST RECENTLY (oldest timestamp) is chosen (tie-breaker).
// ============================================================

/**
 * LFU (Least Frequently Used) Page Replacement Algorithm
 * 
 * Replaces the page with the smallest access frequency count.
 * Uses last-access timestamp as tie-breaker for pages with identical frequency counts.
 * 
 * @param {Array<number|string>} referenceString - Sequence of page numbers requested
 * @param {number} frameCapacity - Number of available physical memory frames
 * @returns {Object} Simulation trace output containing step snapshots and statistics
 */
export function simulateLFU(referenceString, frameCapacity) {
  // Total number of page requests
  const n = referenceString.length;

  // Ensure frame capacity is at least 1
  const capacity = Math.max(1, parseInt(frameCapacity, 10) || 1);
  
  // frames[] - Physical memory slots, all initially empty (null)
  const frames = new Array(capacity).fill(null);

  // frequency - Tracks how many times each page has been accessed across ALL steps
  // Key: page number | Value: total access count
  // Important: frequency is accumulated even for hits AND new page loads
  const frequency = new Map();

  // lastUsed - Tracks the last step index at which each page was accessed
  // Used as a tie-breaker when two pages have the same frequency
  // Key: page number | Value: step index of last access
  const lastUsed = new Map();

  // steps[] - Snapshots of memory state at each step (for the results table)
  const steps = [];

  // Counters
  let totalHits = 0;
  let totalFaults = 0;

  // Process each page request one by one
  for (let i = 0; i < n; i++) {
    const page = referenceString[i]; // Current page being requested
    
    // Check if the page is already in memory (Page Hit)
    const isHit = frames.includes(page);

    let replacedPage = null;

    // --- Always increment frequency for this page, whether hit or fault ---
    // This is a key difference from MFU/LRU: frequency counts ALL accesses globally
    const currentFreq = (frequency.get(page) || 0) + 1;
    frequency.set(page, currentFreq);
    lastUsed.set(page, i); // Update the last used timestamp too

    if (isHit) {
      // --- PAGE HIT ---
      // Page is already in memory, frequency already updated above
      totalHits++;
    } else {
      // --- PAGE FAULT ---
      // Page is not in memory; need to load it
      totalFaults++;

      // Check for an empty slot first
      const emptySlotIndex = frames.indexOf(null);

      if (emptySlotIndex !== -1) {
        // Empty slot available → load the page here (no eviction needed)
        frames[emptySlotIndex] = page;
      } else {
        // Frames are FULL → must evict the Least Frequently Used page

        // Scan all frames to find the page with the minimum access frequency
        let victimIndex = 0;      // Index of the page to evict
        let minFreq = Infinity;   // Smallest frequency seen so far
        let oldestTime = Infinity; // For tie-breaking: oldest last-use time

        for (let f = 0; f < capacity; f++) {
          const currentP = frames[f]; // Page in this frame slot
          const freq = frequency.get(currentP) || 0;        // Its total frequency
          const time = lastUsed.has(currentP) ? lastUsed.get(currentP) : 0; // Its last use time

          // Choose this page as victim if:
          // 1. Its frequency is LOWER than current minimum (fewer uses = evict first)
          // 2. OR frequency is EQUAL but it was used LESS RECENTLY (tie-breaker)
          if (freq < minFreq || (freq === minFreq && time < oldestTime)) {
            minFreq = freq;
            oldestTime = time;
            victimIndex = f;
          }
        }

        // Evict the selected victim and load the new page
        replacedPage = frames[victimIndex];
        frames[victimIndex] = page;
        // Note: frequency for the new page was already set above (before the if/else block)
      }
    }

    // Record a snapshot of this step's result
    steps.push({
      step: i + 1,
      page: page,
      frames: [...frames],  // Snapshot copy of frames
      status: isHit ? 'Hit' : 'Page Fault',
      replacedPage: replacedPage
    });
  }

  // Calculate hit and fault ratios
  const hitRatioVal = n > 0 ? (totalHits / n) * 100 : 0;
  const faultRatioVal = n > 0 ? (totalFaults / n) * 100 : 0;

  // Return the full result
  return {
    algorithmName: 'LFU',
    referenceString: [...referenceString],
    framesCount: capacity,
    steps: steps,
    totalHits: totalHits,
    totalFaults: totalFaults,
    hitRatio: `${hitRatioVal.toFixed(2)}%`,
    faultRatio: `${faultRatioVal.toFixed(2)}%`,
    rawHitRatio: hitRatioVal,
    rawFaultRatio: faultRatioVal
  };
}
