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
  const n = referenceString.length;
  const capacity = Math.max(1, parseInt(frameCapacity, 10) || 1);
  
  const frames = new Array(capacity).fill(null);
  const steps = [];
  let fifoPointer = 0; // Tracks the oldest inserted frame index
  let totalHits = 0;
  let totalFaults = 0;

  for (let i = 0; i < n; i++) {
    const page = referenceString[i];
    const isHit = frames.includes(page);
    let replacedPage = null;

    if (isHit) {
      totalHits++;
    } else {
      totalFaults++;
      // Check for empty slot
      const emptySlotIndex = frames.indexOf(null);
      if (emptySlotIndex !== -1) {
        frames[emptySlotIndex] = page;
      } else {
        // Evict page at pointer index
        replacedPage = frames[fifoPointer];
        frames[fifoPointer] = page;
        fifoPointer = (fifoPointer + 1) % capacity;
      }
    }

    steps.push({
      step: i + 1,
      page: page,
      frames: [...frames],
      status: isHit ? 'Hit' : 'Page Fault',
      replacedPage: replacedPage
    });
  }

  const hitRatioVal = n > 0 ? (totalHits / n) * 100 : 0;
  const faultRatioVal = n > 0 ? (totalFaults / n) * 100 : 0;

  return {
    algorithmName: 'FIFO',
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
