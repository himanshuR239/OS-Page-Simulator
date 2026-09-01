// ============================================================
// algorithms/index.js - Algorithms Central Export Hub
// ============================================================
// This file serves as the single entry point for all
// page replacement algorithm functions.
//
// Instead of importing from individual files like:
//   import { simulateFIFO } from './algorithms/fifo.js'
//   import { simulateLRU } from './algorithms/lru.js'
//
// Other components can simply import from this one file:
//   import { simulateFIFO, simulateLRU } from '../algorithms'
// ============================================================

// Import each algorithm's simulation function from their respective files
import { simulateFIFO } from './fifo.js';
import { simulateLRU } from './lru.js';
import { simulateOptimal } from './optimal.js';
import { simulateLFU } from './lfu.js';
import { simulateMFU } from './mfu.js';

// Re-export all algorithm functions so other files can import them from here
export {
  simulateFIFO,
  simulateLRU,
  simulateOptimal,
  simulateLFU,
  simulateMFU
};

/**
 * ALGORITHM_MAP - A lookup table that maps algorithm name strings to their functions.
 * 
 * This is used so we can dynamically call an algorithm by name (a string key).
 * Example: ALGORITHM_MAP['LRU'] gives us the simulateLRU function.
 * This avoids writing a big if/else or switch statement.
 */
export const ALGORITHM_MAP = {
  FIFO: simulateFIFO,       // "FIFO" key → runs First-In First-Out simulation
  LRU: simulateLRU,         // "LRU" key → runs Least Recently Used simulation
  Optimal: simulateOptimal, // "Optimal" key → runs Optimal/Belady's simulation
  LFU: simulateLFU,         // "LFU" key → runs Least Frequently Used simulation
  MFU: simulateMFU          // "MFU" key → runs Most Frequently Used simulation
};

/**
 * runAlgorithm - Runs a single specified algorithm by key name.
 * 
 * @param {string} key - Algorithm name: 'FIFO' | 'LRU' | 'Optimal' | 'LFU' | 'MFU'
 * @param {Array<number|string>} referenceString - Array of page numbers to simulate
 * @param {number} frameCapacity - Number of memory frames available (>= 1)
 * @returns {Object} The simulation result object from the chosen algorithm
 */
export function runAlgorithm(key, referenceString, frameCapacity) {
  // Look up the algorithm function by key; fall back to FIFO if key is invalid
  const algoFn = ALGORITHM_MAP[key] || simulateFIFO;
  // Call the found function with the reference string and frame count, return its result
  return algoFn(referenceString, frameCapacity);
}

/**
 * compareAllAlgorithms - Runs ALL 5 algorithms on the same input and returns all results.
 * 
 * Used by the "Compare All Algorithms" feature in the SimulatorPage.
 * This lets us display a side-by-side performance comparison table.
 * 
 * @param {Array<number|string>} referenceString - Array of page numbers to simulate
 * @param {number} frameCapacity - Number of memory frames available (>= 1)
 * @returns {Array<Object>} Array of 5 result objects, one for each algorithm
 */
export function compareAllAlgorithms(referenceString, frameCapacity) {
  // Object.keys(ALGORITHM_MAP) gives ['FIFO', 'LRU', 'Optimal', 'LFU', 'MFU']
  // .map() calls runAlgorithm for each key, collecting all 5 result objects into an array
  return Object.keys(ALGORITHM_MAP).map(key => runAlgorithm(key, referenceString, frameCapacity));
}
