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
  const n = referenceString.length;
  const capacity = Math.max(1, parseInt(frameCapacity, 10) || 1);
  
  const frames = new Array(capacity).fill(null);
  const frequency = new Map();  // page -> frequency count
  const lastUsed = new Map();   // page -> last step timestamp
  const steps = [];
  let totalHits = 0;
  let totalFaults = 0;

  for (let i = 0; i < n; i++) {
    const page = referenceString[i];
    const isHit = frames.includes(page);
    let replacedPage = null;

    if (isHit) {
      totalHits++;
      frequency.set(page, (frequency.get(page) || 0) + 1);
      lastUsed.set(page, i);
    } else {
      totalFaults++;
      const emptySlotIndex = frames.indexOf(null);

      if (emptySlotIndex !== -1) {
        frames[emptySlotIndex] = page;
        frequency.set(page, 1);
        lastUsed.set(page, i);
      } else {
        // Find page in frames with maximum frequency (tie breaker: smallest lastUsed)
        let victimIndex = 0;
        let maxFreq = -1;
        let oldestTime = Infinity;

        for (let f = 0; f < capacity; f++) {
          const currentP = frames[f];
          const freq = frequency.get(currentP) || 0;
          const time = lastUsed.has(currentP) ? lastUsed.get(currentP) : 0;

          if (freq > maxFreq || (freq === maxFreq && time < oldestTime)) {
            maxFreq = freq;
            oldestTime = time;
            victimIndex = f;
          }
        }

        replacedPage = frames[victimIndex];
        frames[victimIndex] = page;
        frequency.set(page, 1);
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
