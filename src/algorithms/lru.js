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
  const n = referenceString.length;
  const capacity = Math.max(1, parseInt(frameCapacity, 10) || 1);
  
  const frames = new Array(capacity).fill(null);
  const lastUsed = new Map(); // Maps page -> last step index used
  const steps = [];
  let totalHits = 0;
  let totalFaults = 0;

  for (let i = 0; i < n; i++) {
    const page = referenceString[i];
    const isHit = frames.includes(page);
    let replacedPage = null;

    if (isHit) {
      totalHits++;
      lastUsed.set(page, i);
    } else {
      totalFaults++;
      const emptySlotIndex = frames.indexOf(null);

      if (emptySlotIndex !== -1) {
        frames[emptySlotIndex] = page;
        lastUsed.set(page, i);
      } else {
        // Find frame holding the page with the minimum lastUsed value
        let lruPageIndex = 0;
        let oldestTime = Infinity;

        for (let f = 0; f < capacity; f++) {
          const currentP = frames[f];
          const time = lastUsed.has(currentP) ? lastUsed.get(currentP) : -1;
          if (time < oldestTime) {
            oldestTime = time;
            lruPageIndex = f;
          }
        }

        replacedPage = frames[lruPageIndex];
        lastUsed.delete(replacedPage);
        frames[lruPageIndex] = page;
        lastUsed.set(page, i);
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
