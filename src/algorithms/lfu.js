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

    // Increment overall frequency count for this page
    const currentFreq = (frequency.get(page) || 0) + 1;
    frequency.set(page, currentFreq);
    lastUsed.set(page, i);

    if (isHit) {
      totalHits++;
    } else {
      totalFaults++;
      const emptySlotIndex = frames.indexOf(null);

      if (emptySlotIndex !== -1) {
        frames[emptySlotIndex] = page;
      } else {
        // Find page in frames with minimum frequency (tie breaker: smallest lastUsed)
        let victimIndex = 0;
        let minFreq = Infinity;
        let oldestTime = Infinity;

        for (let f = 0; f < capacity; f++) {
          const currentP = frames[f];
          const freq = frequency.get(currentP) || 0;
          const time = lastUsed.has(currentP) ? lastUsed.get(currentP) : 0;

          if (freq < minFreq || (freq === minFreq && time < oldestTime)) {
            minFreq = freq;
            oldestTime = time;
            victimIndex = f;
          }
        }

        replacedPage = frames[victimIndex];
        frames[victimIndex] = page;
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
