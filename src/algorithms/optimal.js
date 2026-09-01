// ============================================================
// algorithms/optimal.js - Optimal Page Replacement Algorithm
// ============================================================
// Also called OPT or Belady's Algorithm.
// The page that will NOT be used for the LONGEST time in the
// FUTURE is replaced when a new page fault occurs.
// This gives the theoretical minimum number of page faults,
// but it's impossible to implement in real OS because you
// can't know future page requests in advance.
// It's used here as a benchmark to compare other algorithms.
// ============================================================

/**
 * Optimal Page Replacement Algorithm
 * 
 * Replaces the page that will not be used for the longest period of time in the future.
 * 
 * @param {Array<number|string>} referenceString - Sequence of page numbers requested
 * @param {number} frameCapacity - Number of available physical memory frames
 * @returns {Object} Simulation trace output containing step snapshots and statistics
 */
export function simulateOptimal(referenceString, frameCapacity) {
  // Total number of page requests in the reference string
  const n = referenceString.length;

  // Ensure capacity is at least 1
  const capacity = Math.max(1, parseInt(frameCapacity, 10) || 1);
  
  // frames[] - Represents the physical memory slots, all initially empty (null)
  const frames = new Array(capacity).fill(null);

  // steps[] - Snapshot of frame state at each step, used to render the results table
  const steps = [];

  // Counters for hits and faults
  let totalHits = 0;
  let totalFaults = 0;

  // Loop through each page request
  for (let i = 0; i < n; i++) {
    const page = referenceString[i]; // Current page being requested
    
    // Check if this page is already in one of the frames (Page Hit)
    const isHit = frames.includes(page);

    let replacedPage = null;

    if (isHit) {
      // --- PAGE HIT ---
      // The page is already loaded in memory, nothing to do
      totalHits++;
    } else {
      // --- PAGE FAULT ---
      // The page is not in memory, we need to load it
      totalFaults++;

      // Check for an empty slot first (early stages when memory isn't full yet)
      const emptySlotIndex = frames.indexOf(null);

      if (emptySlotIndex !== -1) {
        // Empty slot available → just load the page there
        frames[emptySlotIndex] = page;
      } else {
        // Frames are FULL → we must choose a victim to evict using future knowledge

        // Look ahead in the reference string (from i+1 onwards) to find
        // which currently-loaded page will be needed farthest in the future
        let victimIndex = 0;      // Index in frames[] of the page we will evict
        let farthestIndex = -1;   // The farthest next-use index found so far

        for (let f = 0; f < capacity; f++) {
          const currentP = frames[f]; // Page currently in this frame slot
          let nextUseIndex = -1;      // Will store the next time this page is requested

          // Scan FORWARD in the reference string to find when currentP is next used
          for (let j = i + 1; j < n; j++) {
            if (referenceString[j] === currentP) {
              nextUseIndex = j; // Found the next occurrence of this page
              break;
            }
          }

          if (nextUseIndex === -1) {
            // This page is NEVER used again in the future → perfect victim to evict!
            // No need to look further; this is the optimal choice.
            victimIndex = f;
            farthestIndex = Infinity; // Treat "never used" as infinitely far in the future
            break;
          } else if (nextUseIndex > farthestIndex) {
            // This page is used farther in the future than any we've checked so far
            // → makes it the better candidate to evict (we won't need it soon)
            farthestIndex = nextUseIndex;
            victimIndex = f;
          }
        }

        // Evict the victim page (the one used farthest in the future)
        replacedPage = frames[victimIndex];
        frames[victimIndex] = page; // Load the new page into the freed slot
      }
    }

    // Save a snapshot of the current frame state and step info
    steps.push({
      step: i + 1,
      page: page,
      frames: [...frames],  // Spread creates a copy (prevents mutation of the snapshot)
      status: isHit ? 'Hit' : 'Page Fault',
      replacedPage: replacedPage
    });
  }

  // Calculate percentages
  const hitRatioVal = n > 0 ? (totalHits / n) * 100 : 0;
  const faultRatioVal = n > 0 ? (totalFaults / n) * 100 : 0;

  // Return the full result object
  return {
    algorithmName: 'Optimal',
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
