// ============================================================
// algorithms/lru.js - LRU Page Replacement Algorithm
// ============================================================
// LRU = Least Recently Used
// The page that has NOT been used for the LONGEST time in
// the past is replaced when a new page needs to be loaded.
// It relies on the principle of Temporal Locality:
// recently used pages are likely to be used again soon.
// ============================================================

/**
 * LRU (Least Recently Used) Page Replacement Algorithm
 * 
 * Replaces the page that has not been used for the longest period of time.
 * 
 * @param {Array<number|string>} referenceString - Sequence of page numbers requested
 * @param {number} frameCapacity - Number of available physical memory frames
 * @returns {Object} Simulation trace output containing step snapshots and statistics
 */
export function simulateLRU(referenceString, frameCapacity) {
  // Total number of page requests in the reference string
  const n = referenceString.length;

  // Ensure capacity is at least 1, and parse it as an integer
  const capacity = Math.max(1, parseInt(frameCapacity, 10) || 1);
  
  // frames[] - Represents the physical memory slots.
  // Initially all are null (empty), meaning no pages are loaded yet.
  const frames = new Array(capacity).fill(null);

  // lastUsed - A Map that tracks the most recent step index at which each page was accessed.
  // Key: page number | Value: step index (i) when it was last used
  // Example: { 7: 0, 2: 4 } means page 7 was last used at step 0, page 2 at step 4
  const lastUsed = new Map();

  // steps[] - Will store a snapshot of memory state at every page request step
  const steps = [];

  // Counters for tracking hits and faults
  let totalHits = 0;
  let totalFaults = 0;

  // Loop through each page request in the reference string
  for (let i = 0; i < n; i++) {
    const page = referenceString[i]; // Current page being requested
    
    // Check if this page already exists in any of the frames (Page Hit)
    const isHit = frames.includes(page);

    // replacedPage tracks which page was evicted this step
    let replacedPage = null;

    if (isHit) {
      // --- PAGE HIT ---
      // Page is already in memory → just update its "last used" timestamp
      totalHits++;
      lastUsed.set(page, i); // Record that this page was used at step i
    } else {
      // --- PAGE FAULT ---
      // Page is NOT in memory, we need to load it
      totalFaults++;

      // Check for an empty slot first
      const emptySlotIndex = frames.indexOf(null);

      if (emptySlotIndex !== -1) {
        // There IS an empty slot → place the page there, no eviction needed
        frames[emptySlotIndex] = page;
        lastUsed.set(page, i); // Record its first use timestamp
      } else {
        // Frames are FULL → we must evict the Least Recently Used page

        // Find the frame whose page has the SMALLEST lastUsed value
        // (smallest = accessed longest ago = Least Recently Used)
        let lruPageIndex = 0;    // Index in frames[] of the LRU page (to be replaced)
        let oldestTime = Infinity; // Will track the minimum "last used" time found so far

        for (let f = 0; f < capacity; f++) {
          const currentP = frames[f]; // Page currently in this frame slot

          // Get when this page was last used. If not in map, treat as -1 (very old).
          const time = lastUsed.has(currentP) ? lastUsed.get(currentP) : -1;

          // If this page was used less recently than our current oldest, update our tracking
          if (time < oldestTime) {
            oldestTime = time;
            lruPageIndex = f; // This frame slot holds the LRU victim
          }
        }

        // Evict the LRU page
        replacedPage = frames[lruPageIndex];
        lastUsed.delete(replacedPage); // Remove its usage record since it's leaving memory

        // Load the new page into the freed slot
        frames[lruPageIndex] = page;
        lastUsed.set(page, i); // Record when the new page was first used
      }
    }

    // Save a snapshot of the current frame state and step info
    steps.push({
      step: i + 1,             // Step number (1-indexed)
      page: page,              // Which page was requested
      frames: [...frames],     // Snapshot of frames at this moment (copy to prevent mutation)
      status: isHit ? 'Hit' : 'Page Fault',
      replacedPage: replacedPage
    });
  }

  // Calculate hit and fault ratios as percentages
  const hitRatioVal = n > 0 ? (totalHits / n) * 100 : 0;
  const faultRatioVal = n > 0 ? (totalFaults / n) * 100 : 0;

  // Return the complete simulation result object
  return {
    algorithmName: 'LRU',
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
