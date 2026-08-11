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
  const n = referenceString.length;
  const capacity = Math.max(1, parseInt(frameCapacity, 10) || 1);
  
  const frames = new Array(capacity).fill(null);
  const steps = [];
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
      const emptySlotIndex = frames.indexOf(null);

      if (emptySlotIndex !== -1) {
        frames[emptySlotIndex] = page;
      } else {
        // Look ahead in future reference string to find victim
        let victimIndex = 0;
        let farthestIndex = -1;

        for (let f = 0; f < capacity; f++) {
          const currentP = frames[f];
          let nextUseIndex = -1;

          for (let j = i + 1; j < n; j++) {
            if (referenceString[j] === currentP) {
              nextUseIndex = j;
              break;
            }
          }

          if (nextUseIndex === -1) {
            // Page is never used again in the future - ideal victim
            victimIndex = f;
            farthestIndex = Infinity;
            break;
          } else if (nextUseIndex > farthestIndex) {
            farthestIndex = nextUseIndex;
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
