// ============================================================
// algorithms/fifo.js - FIFO Page Replacement Algorithm
// ============================================================
// FIFO = First-In, First-Out
// The oldest page in memory (the one that was loaded first)
// is replaced when a new page needs to be brought in.
// Think of it like a queue: first item in = first item out.
// ============================================================

/**
 * FIFO (First-In, First-Out) Page Replacement Algorithm
 * 
 * Replaces the page that has been in memory the longest (oldest entry).
 * 
 * @param {Array<number|string>} referenceString - Sequence of page numbers requested
 * @param {number} frameCapacity - Number of available physical memory frames
 * @returns {Object} Simulation trace output containing step snapshots and statistics
 */
export function simulateFIFO(referenceString, frameCapacity) {
  // Total number of page requests in the reference string
  const n = referenceString.length;

  // Ensure capacity is at least 1, and parse it as an integer
  // Math.max(1, ...) guards against 0 or negative frame count
  const capacity = Math.max(1, parseInt(frameCapacity, 10) || 1);
  
  // frames[] - Represents the physical memory slots.
  // Initially all are null (empty), meaning no pages are loaded yet.
  const frames = new Array(capacity).fill(null);

  // steps[] - Will store a snapshot of memory state at every page request step
  const steps = [];

  // fifoPointer - Points to the index of the oldest page in frames[].
  // When we need to evict a page, we evict the one at this index.
  // After eviction, we move the pointer forward in a circular manner.
  let fifoPointer = 0;

  // Counters for tracking how many times a page was found (hit) or not found (fault)
  let totalHits = 0;
  let totalFaults = 0;

  // Loop through each page request in the reference string
  for (let i = 0; i < n; i++) {
    const page = referenceString[i]; // Current page being requested
    
    // Check if this page already exists in any of the frames (Page Hit)
    const isHit = frames.includes(page);
    
    // replacedPage tracks which page was evicted this step (null if no eviction happened)
    let replacedPage = null;

    if (isHit) {
      // --- PAGE HIT ---
      // The page is already in memory, no action needed, just count it
      totalHits++;
    } else {
      // --- PAGE FAULT ---
      // The page is NOT in memory, we need to load it
      totalFaults++;

      // First check if there's an empty slot in the frames array
      // indexOf(null) returns the index of the first empty slot, or -1 if frames are full
      const emptySlotIndex = frames.indexOf(null);

      if (emptySlotIndex !== -1) {
        // There IS an empty slot → simply place the page there (no eviction needed)
        frames[emptySlotIndex] = page;
      } else {
        // Frames are FULL → we must evict the oldest page (the one at fifoPointer)
        replacedPage = frames[fifoPointer]; // Remember which page is being removed
        frames[fifoPointer] = page;         // Replace it with the newly requested page

        // Move the pointer forward circularly so next eviction removes the next oldest page
        // Using modulo (%) ensures the pointer wraps around when it reaches the end
        fifoPointer = (fifoPointer + 1) % capacity;
      }
    }

    // Save a snapshot of the current frame state and step info for display in the results table
    steps.push({
      step: i + 1,             // Step number (1-indexed for display)
      page: page,              // Which page was requested this step
      frames: [...frames],     // Copy of the current frames array (spread to avoid reference issues)
      status: isHit ? 'Hit' : 'Page Fault', // Display label for the result
      replacedPage: replacedPage // Which page was evicted (null if no eviction)
    });
  }

  // Calculate hit and fault ratios as percentages
  const hitRatioVal = n > 0 ? (totalHits / n) * 100 : 0;
  const faultRatioVal = n > 0 ? (totalFaults / n) * 100 : 0;

  // Return the complete simulation result object
  return {
    algorithmName: 'FIFO',                   // Algorithm identifier
    referenceString: [...referenceString],   // Copy of the original page request sequence
    framesCount: capacity,                   // How many frames were used
    steps: steps,                            // All step-by-step snapshots
    totalHits: totalHits,                    // Total number of page hits
    totalFaults: totalFaults,                // Total number of page faults
    hitRatio: `${hitRatioVal.toFixed(2)}%`,  // Hit ratio as formatted string e.g. "35.00%"
    faultRatio: `${faultRatioVal.toFixed(2)}%`, // Fault ratio as formatted string
    rawHitRatio: hitRatioVal,                // Raw numeric hit ratio (for charts/comparisons)
    rawFaultRatio: faultRatioVal             // Raw numeric fault ratio
  };
}
