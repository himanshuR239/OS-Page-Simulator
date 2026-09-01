// ============================================================
// algorithms/mfu.js - MFU Page Replacement Algorithm
// ============================================================
// MFU = Most Frequently Used
// The page with the HIGHEST access frequency count is replaced
// when a new page needs to be loaded.
// The logic here is opposite to LFU: assumes that a heavily
// used page has "finished" its usefulness and can be evicted.
// Tie-breaker: if two pages have the same frequency, the one
// used LEAST RECENTLY is evicted.
// ============================================================

/**
 * MFU (Most Frequently Used) Page Replacement Algorithm
 * 
 * Replaces the page with the highest access frequency count.
 * Uses last-access timestamp as tie-breaker for pages with identical frequency counts.
 * 
 * @param {Array<number|string>} referenceString - Sequence of page numbers requested
 * @param {number} frameCapacity - Number of available physical memory frames
 * @returns {Object} Simulation trace output containing step snapshots and statistics
 */
export function simulateMFU(referenceString, frameCapacity) {
  // Total number of page requests
  const n = referenceString.length;

  // Ensure frame capacity is at least 1
  const capacity = Math.max(1, parseInt(frameCapacity, 10) || 1);
  
  // frames[] - Physical memory slots, all initially empty (null)
  const frames = new Array(capacity).fill(null);

  // frequency - Tracks how many times each page in MEMORY has been accessed
  // Key: page number | Value: access count
  // Note: Unlike LFU, here we only update frequency when a page is in memory (hit)
  // and set it to 1 when a new page is first loaded
  const frequency = new Map();

  // lastUsed - Tracks the last step index at which each page was accessed
  // Used as a tie-breaker when two pages have the same frequency
  const lastUsed = new Map();

  // steps[] - Snapshots of memory state at each step
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

    if (isHit) {
      // --- PAGE HIT ---
      // The page is already in memory → increment its frequency counter
      totalHits++;
      frequency.set(page, (frequency.get(page) || 0) + 1); // Increase use count by 1
      lastUsed.set(page, i); // Update the last access timestamp
    } else {
      // --- PAGE FAULT ---
      // Page is not in memory; need to load it
      totalFaults++;

      // Check for an empty slot first
      const emptySlotIndex = frames.indexOf(null);

      if (emptySlotIndex !== -1) {
        // Empty slot available → load the page there
        frames[emptySlotIndex] = page;
        frequency.set(page, 1);  // Newly loaded page starts with frequency = 1
        lastUsed.set(page, i);   // Set its first access timestamp
      } else {
        // Frames are FULL → must evict the Most Frequently Used page

        // Scan all frames to find the page with the MAXIMUM access frequency
        let victimIndex = 0;    // Index of the page to evict
        let maxFreq = -1;       // Largest frequency seen so far
        let oldestTime = Infinity; // For tie-breaking: oldest last-use time

        for (let f = 0; f < capacity; f++) {
          const currentP = frames[f]; // Page in this frame slot
          const freq = frequency.get(currentP) || 0;         // Its frequency
          const time = lastUsed.has(currentP) ? lastUsed.get(currentP) : 0; // Its last use time

          // Choose this page as victim if:
          // 1. Its frequency is HIGHER than current maximum (more uses = evict first)
          // 2. OR frequency is EQUAL but it was used LESS RECENTLY (tie-breaker)
          if (freq > maxFreq || (freq === maxFreq && time < oldestTime)) {
            maxFreq = freq;
            oldestTime = time;
            victimIndex = f;
          }
        }

        // Evict the most frequently used page and load the new one
        replacedPage = frames[victimIndex];
        frames[victimIndex] = page;
        frequency.set(page, 1);  // New page starts with frequency = 1
        lastUsed.set(page, i);   // Set its first access timestamp
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
    algorithmName: 'MFU',
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
