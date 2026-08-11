import { simulateFIFO } from './fifo.js';
import { simulateLRU } from './lru.js';
import { simulateOptimal } from './optimal.js';
import { simulateLFU } from './lfu.js';
import { simulateMFU } from './mfu.js';

export {
  simulateFIFO,
  simulateLRU,
  simulateOptimal,
  simulateLFU,
  simulateMFU
};

/**
 * Map of algorithm keys to simulation functions
 */
export const ALGORITHM_MAP = {
  FIFO: simulateFIFO,
  LRU: simulateLRU,
  Optimal: simulateOptimal,
  LFU: simulateLFU,
  MFU: simulateMFU
};

/**
 * Execute simulation for a specified algorithm key
 * 
 * @param {string} key - 'FIFO' | 'LRU' | 'Optimal' | 'LFU' | 'MFU'
 * @param {Array<number|string>} referenceString - Array of requested page numbers
 * @param {number} frameCapacity - Frame count (>= 1)
 * @returns {Object} Simulation result trace
 */
export function runAlgorithm(key, referenceString, frameCapacity) {
  const algoFn = ALGORITHM_MAP[key] || simulateFIFO;
  return algoFn(referenceString, frameCapacity);
}

/**
 * Execute all 5 algorithms on the same reference string and frame count for comparison
 * 
 * @param {Array<number|string>} referenceString - Array of requested page numbers
 * @param {number} frameCapacity - Frame count (>= 1)
 * @returns {Array<Object>} List of simulation results for each algorithm
 */
export function compareAllAlgorithms(referenceString, frameCapacity) {
  return Object.keys(ALGORITHM_MAP).map(key => runAlgorithm(key, referenceString, frameCapacity));
}
