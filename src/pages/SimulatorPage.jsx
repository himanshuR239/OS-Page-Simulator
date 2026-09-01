// ============================================================
// pages/SimulatorPage.jsx - Interactive Simulation Page
// ============================================================
// This is the main page where users can:
//   1. Set the number of memory frames (1–10 via slider or input)
//   2. Enter or randomize a page reference string
//   3. Pick a preset example (Standard, Belady's Anomaly, High Locality)
//   4. Simulate any single algorithm (FIFO, Optimal, LRU, LFU, MFU)
//   5. Compare all 5 algorithms side-by-side in one click
//
// After simulation, results are shown using:
//   - ResultsTable: step-by-step frame matrix
//   - Summary: stats cards + pie chart
//   - Comparison table (when "Compare All" mode is active)
// ============================================================

import React, { useState } from 'react';
import { PlayCircle, RotateCcw, Sliders, Dices, BarChart3, Trophy, ArrowRight, Layers } from 'lucide-react'; // Icons
import { 
  simulateFIFO, 
  simulateLRU, 
  simulateOptimal, 
  simulateLFU, 
  simulateMFU, 
  compareAllAlgorithms  // Runs all 5 algorithms and returns array of results
} from '../algorithms';
import ResultsTable from '../components/ResultsTable'; // Step-by-step frame matrix table
import Summary from '../components/Summary';           // Stats cards + pie chart

// PRESETS - Predefined example inputs to quickly demonstrate interesting scenarios
// Each preset has a label (display name), frame count, and a page sequence string
const PRESETS = [
  {
    label: "Standard OS Example",       // Classic textbook example
    frames: 3,
    sequence: "7, 0, 1, 2, 0, 3, 0, 4, 2, 3, 0, 3, 2, 1, 2, 0, 1, 7, 0, 1"
  },
  {
    label: "Belady's Anomaly Case",     // Shows FIFO performing WORSE with more frames
    frames: 3,
    sequence: "1, 2, 3, 4, 1, 2, 5, 1, 2, 3, 4, 5"
  },
  {
    label: "High Locality Case",        // Demonstrates temporal locality - LRU should do well
    frames: 4,
    sequence: "2, 3, 2, 1, 5, 2, 4, 5, 3, 2, 5, 2"
  }
];

// ALGORITHMS - Configuration array for all 5 supported algorithms
// Each entry has:
//   name - Key string used as tab label and to identify which algo to run
//   func - The simulation function imported from algorithms/
//   desc - Short human-readable description (shown in tooltips if needed)
const ALGORITHMS = [
  { name: 'FIFO',    func: simulateFIFO,    desc: 'First-In First-Out' },
  { name: 'Optimal', func: simulateOptimal, desc: 'Optimal Lookahead' },
  { name: 'LRU',     func: simulateLRU,     desc: 'Least Recently Used' },
  { name: 'LFU',     func: simulateLFU,     desc: 'Least Frequently Used' },
  { name: 'MFU',     func: simulateMFU,     desc: 'Most Frequently Used' },
];

// ============================================================
// SimulatorPage Component
// ============================================================
const SimulatorPage = () => {
  // --- STATE VARIABLES ---

  // frameCount - Number of memory frames the user sets (stored as string for input binding)
  const [frameCount, setFrameCount] = useState('3');

  // pageSequence - The raw text input for the page reference string (comma/space separated)
  const [pageSequence, setPageSequence] = useState('7, 0, 1, 2, 0, 3, 0, 4, 2, 3, 0, 3, 2, 1, 2, 0, 1, 7, 0, 1');

  // activeTab - Which algorithm button is currently "active"/selected (for button highlight)
  const [activeTab, setActiveTab] = useState('FIFO');

  // error - Error message string shown to the user if input validation fails
  const [error, setError] = useState('');

  // singleResult - Result object from running a single algorithm simulation
  // null = no result yet
  const [singleResult, setSingleResult] = useState(null);

  // comparisonResults - Array of result objects when comparing all 5 algorithms
  // null = comparison not run yet
  const [comparisonResults, setComparisonResults] = useState(null);

  // mode - Controls which results view to show:
  //   'single'  → shows ResultsTable + Summary for the selected algorithm
  //   'compare' → shows the comparison table for all 5 algorithms
  const [mode, setMode] = useState('single');

  // --- HELPER FUNCTIONS ---

  /**
   * parseInputs - Validates the user's frame count and page sequence inputs.
   * Returns parsed values if valid, or null + sets an error message if invalid.
   */
  const parseInputs = () => {
    // Parse frame count as a whole number
    const frames = parseInt(frameCount, 10);

    // Validation: must be a number between 1 and 10
    if (isNaN(frames) || frames <= 0 || frames > 10) {
      setError('Number of frames must be an integer between 1 and 10.');
      return null;
    }

    // Parse the page sequence: split by whitespace or commas, convert to numbers, remove NaN
    const pages = pageSequence
      .trim()                     // Remove leading/trailing whitespace
      .split(/[\s,]+/)            // Split on any whitespace or commas (one or more)
      .map(Number)                // Convert each token to a number
      .filter(n => !isNaN(n));   // Keep only valid numbers (discard empty strings / garbage)

    // Validation: must have at least one valid page number
    if (pages.length === 0) {
      setError('Please provide a valid page reference sequence separated by spaces or commas.');
      return null;
    }

    // Clear any previous error message
    setError('');
    return { frames, pages }; // Return the parsed, validated values
  };

  /**
   * handleSimulateSingle - Runs a simulation for a single selected algorithm.
   * @param {string} algoName - Name of the algorithm to run (e.g. 'LRU')
   */
  const handleSimulateSingle = (algoName) => {
    const parsed = parseInputs();
    if (!parsed) return; // Stop if input validation failed

    // Find the algorithm object by name; fall back to FIFO if not found
    const algo = ALGORITHMS.find(a => a.name === algoName) || ALGORITHMS[0];
    setActiveTab(algo.name);     // Highlight this algorithm's button as active
    setMode('single');           // Switch to single-algorithm result view
    setComparisonResults(null);  // Clear any previous comparison results

    // Run the simulation and store the result
    const res = algo.func(parsed.pages, parsed.frames);
    setSingleResult(res);
  };

  /**
   * handleCompareAll - Runs all 5 algorithms and shows the comparison table.
   */
  const handleCompareAll = () => {
    const parsed = parseInputs();
    if (!parsed) return; // Stop if input validation failed

    setMode('compare');      // Switch to comparison view
    setSingleResult(null);   // Clear any previous single result

    // compareAllAlgorithms returns an array of 5 result objects (one per algorithm)
    const resList = compareAllAlgorithms(parsed.pages, parsed.frames);
    setComparisonResults(resList);
  };

  /**
   * handleReset - Clears all simulation results and error messages.
   * Does NOT reset the frame count or page sequence inputs.
   */
  const handleReset = () => {
    setSingleResult(null);
    setComparisonResults(null);
    setError('');
  };

  /**
   * handleRandomSequence - Generates a random page reference string of 15 pages
   * (page numbers from 0 to 7) and sets it as the current input.
   */
  const handleRandomSequence = () => {
    const length = 15;
    // Array.from({length}) creates an array of 15 undefined slots
    // () => Math.floor(Math.random() * 8) fills each slot with a random int 0–7
    const randPages = Array.from({ length }, () => Math.floor(Math.random() * 8));
    setPageSequence(randPages.join(', ')); // Join with ", " to make a readable string
    setSingleResult(null);        // Clear old results since input changed
    setComparisonResults(null);
  };

  /**
   * handleApplyPreset - Applies a preset's frame count and page sequence to the inputs.
   * @param {Object} preset - One of the PRESETS objects
   */
  const handleApplyPreset = (preset) => {
    setFrameCount(preset.frames.toString()); // Frame count stored as string for controlled input
    setPageSequence(preset.sequence);
    setSingleResult(null);
    setComparisonResults(null);
    setError('');
  };

  // ============================================================
  // RENDER
  // ============================================================
  return (
    // Outer spacing container
    <div className="space-y-8 pb-12">
      
      {/* ===== PAGE HEADER ===== */}
      {/* Contains title, subtitle, and the Reset button */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-[#1e1735]/80 p-6 rounded-2xl border border-pink-500/20 shadow-xl backdrop-blur-lg">
        <div>
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-pink-600/30 border border-pink-500/40 flex items-center justify-center">
              <PlayCircle className="w-6 h-6 text-pink-400" />
            </div>
            <h1 className="text-3xl font-extrabold text-white tracking-tight">Interactive OS Simulator</h1>
          </div>
          <p className="text-sm text-gray-400 mt-1">
            Simulate and evaluate page replacement behavior with real-time frame snapshot visualization.
          </p>
        </div>

        {/* Reset Button - clears results without changing inputs */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleReset}
            className="px-4 py-2 rounded-xl bg-[#2d234a] hover:bg-[#392d5c] border border-pink-500/30 text-gray-300 hover:text-white text-sm font-semibold flex items-center gap-2 transition-all"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Reset</span>
          </button>
        </div>
      </div>

      {/* ===== CONTROL PANEL CARD ===== */}
      {/* Contains all user inputs and action buttons */}
      <div className="bg-[#1e1735]/90 border border-pink-500/20 p-6 md:p-8 rounded-2xl shadow-xl backdrop-blur-lg space-y-6">
        
        {/* Panel label */}
        <div className="flex items-center space-x-2 text-pink-400 text-sm font-bold uppercase tracking-wider">
          <Sliders className="w-4 h-4" />
          <span>Simulation Settings &amp; Inputs</span>
        </div>

        {/* Inputs row: frame count (1/3) + page sequence (2/3) on large screens */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* FRAME COUNT INPUT */}
          {/* Dual control: a range slider for dragging AND a number input for typing */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-200">
              Number of Memory Frames: <span className="text-pink-400 font-mono text-base">{frameCount}</span>
            </label>
            <div className="flex items-center gap-4">
              {/* Range slider: min=1, max=10, value synced to frameCount state */}
              <input
                type="range"
                min="1"
                max="10"
                value={frameCount}
                onChange={(e) => {
                  setFrameCount(e.target.value);    // Update state
                  setSingleResult(null);             // Clear results since input changed
                  setComparisonResults(null);
                }}
                className="w-full accent-pink-500 cursor-pointer"
              />
              {/* Number text input - synced to the same frameCount state */}
              <input
                type="number"
                min="1"
                max="10"
                value={frameCount}
                onChange={(e) => {
                  setFrameCount(e.target.value);
                  setSingleResult(null);
                  setComparisonResults(null);
                }}
                className="w-20 px-3 py-2 rounded-xl bg-[#16102b] border border-pink-500/30 text-white font-mono text-center focus:outline-none focus:border-pink-500"
              />
            </div>
          </div>

          {/* PAGE REFERENCE STRING INPUT (spans 2 columns on lg+) */}
          <div className="lg:col-span-2 space-y-2">
            <div className="flex items-center justify-between">
              <label className="block text-sm font-semibold text-gray-200">
                Page Reference String <span className="text-xs text-gray-400 font-normal">(comma or space separated)</span>
              </label>
              {/* Randomize button - generates a random sequence of 15 pages */}
              <button
                onClick={handleRandomSequence}
                className="text-xs text-pink-400 hover:text-pink-300 flex items-center gap-1 font-medium hover:underline"
              >
                <Dices className="w-3.5 h-3.5" />
                <span>Randomize</span>
              </button>
            </div>
            {/* Text input for the page reference sequence */}
            <input
              type="text"
              value={pageSequence}
              onChange={(e) => {
                setPageSequence(e.target.value);
                setSingleResult(null);        // Clear results when input changes
                setComparisonResults(null);
              }}
              placeholder="e.g. 7, 0, 1, 2, 0, 3, 0, 4"
              className="w-full px-4 py-2.5 rounded-xl bg-[#16102b] border border-pink-500/30 text-white font-mono text-sm focus:outline-none focus:border-pink-500 transition-colors"
            />
          </div>
        </div>

        {/* QUICK PRESET BUTTONS - Clicking a preset fills the inputs with example data */}
        <div className="pt-4 border-t border-pink-500/10 flex flex-wrap items-center gap-2">
          <span className="text-xs font-semibold text-gray-400 mr-2">Quick Presets:</span>
          {PRESETS.map((preset, idx) => (
            <button
              key={idx}
              onClick={() => handleApplyPreset(preset)} // Apply this preset's values to inputs
              className="px-3 py-1.5 rounded-lg bg-[#251d42] hover:bg-pink-600/20 border border-pink-500/20 text-xs text-gray-300 hover:text-white transition-all"
            >
              {preset.label}
            </button>
          ))}
        </div>

        {/* ERROR ALERT - Only renders when there is a validation error message */}
        {error && (
          <div className="p-4 rounded-xl bg-rose-950/60 border border-rose-500/40 text-rose-300 text-sm font-medium">
            ⚠️ {error}
          </div>
        )}

        {/* ACTION BUTTONS - Run a single algorithm or compare all */}
        <div className="pt-2 flex flex-wrap items-center justify-center sm:justify-start gap-3">
          <span className="text-xs text-gray-400 font-medium mr-2 w-full sm:w-auto">Simulate Algorithm:</span>
          
          {/* Individual algorithm buttons: one per algorithm in the ALGORITHMS array */}
          {ALGORITHMS.map(algo => (
            <button
              key={algo.name}
              onClick={() => handleSimulateSingle(algo.name)} // Run this specific algorithm
              // Highlight the button if it's the currently active algorithm with a result
              className={`px-5 py-2.5 rounded-xl font-semibold text-sm transition-all duration-200 shadow-md ${
                mode === 'single' && activeTab === algo.name && singleResult
                  ? 'bg-pink-600 text-white shadow-pink-600/40 scale-105 ring-2 ring-pink-400' // Active state
                  : 'bg-[#251d42] hover:bg-pink-600/30 text-gray-200 hover:text-white border border-pink-500/20' // Default state
              }`}
            >
              {algo.name}
            </button>
          ))}

          {/* Compare All button - runs all 5 algorithms at once and shows comparison table */}
          <button
            onClick={handleCompareAll}
            className={`px-6 py-2.5 rounded-xl font-bold text-sm flex items-center gap-2 transition-all shadow-lg ${
              mode === 'compare' && comparisonResults
                ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white ring-2 ring-purple-400 scale-105' // Active state
                : 'bg-[#2d234a] hover:bg-purple-600/40 border border-purple-500/40 text-purple-300 hover:text-white' // Default state
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            <span>Compare All Algorithms</span>
          </button>
        </div>
      </div>

      {/* ===== SINGLE ALGORITHM RESULTS VIEW ===== */}
      {/* Only shown when mode is 'single' AND a result exists */}
      {mode === 'single' && singleResult && (
        <div className="space-y-6 animate-fade-in">
          {/* Result heading: algorithm name + frame count badge */}
          <div className="flex items-center space-x-3 bg-[#1e1735] p-4 rounded-xl border border-pink-500/20">
            <span className="text-xl font-bold text-pink-400">{singleResult.algorithmName} Algorithm Results</span>
            <span className="text-xs px-3 py-1 rounded-full bg-pink-500/20 border border-pink-500/30 text-pink-300">
              Frames: {singleResult.framesCount}
            </span>
          </div>

          {/* ResultsTable: shows every step as a row with frame states */}
          <ResultsTable history={singleResult.steps} frameCount={singleResult.framesCount} />

          {/* Summary: shows stat cards and pie chart */}
          <Summary result={singleResult} frameCount={frameCount} pageSequence={pageSequence} />
        </div>
      )}

      {/* ===== COMPARE ALL ALGORITHMS RESULTS VIEW ===== */}
      {/* Only shown when mode is 'compare' AND comparison results exist */}
      {mode === 'compare' && comparisonResults && (
        <div className="space-y-6 animate-fade-in">
          <div className="bg-[#1e1735]/90 border border-pink-500/20 p-6 rounded-2xl shadow-xl backdrop-blur-lg">
            {/* Comparison table header */}
            <div className="flex items-center space-x-3 mb-6 pb-4 border-b border-pink-500/20">
              <div className="w-9 h-9 rounded-xl bg-purple-600/30 border border-purple-500/30 flex items-center justify-center">
                <Trophy className="w-5 h-5 text-purple-400" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">Comparative Performance Analysis</h3>
                <p className="text-xs text-gray-400">Comparing all 5 page replacement algorithms on the current input dataset</p>
              </div>
            </div>

            {/* Comparison Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-center text-gray-200">
                <thead className="text-xs uppercase bg-[#16102b] text-gray-300 border-b border-pink-500/20">
                  <tr>
                    <th scope="col" className="py-3.5 px-6 text-left">Algorithm</th>
                    <th scope="col" className="py-3.5 px-6">Total Hits</th>
                    <th scope="col" className="py-3.5 px-6">Total Page Faults</th>
                    <th scope="col" className="py-3.5 px-6">Hit Ratio (%)</th>
                    <th scope="col" className="py-3.5 px-6">Fault Ratio (%)</th>
                    <th scope="col" className="py-3.5 px-6">Performance Rank</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-pink-500/10">
                  {/* IIFE (Immediately Invoked Function Expression) used here so we can
                      compute minFaults once, then use it inside the .map() below */}
                  {(() => {
                    // Find the algorithm with the fewest page faults (best performer)
                    const minFaults = Math.min(...comparisonResults.map(r => r.totalFaults));

                    return comparisonResults.map((res, idx) => {
                      // isBest = true if this algorithm ties for the lowest fault count
                      const isBest = res.totalFaults === minFaults;

                      return (
                        // Highlight the best algorithm row with a green tint
                        <tr key={idx} className={`transition-colors ${isBest ? 'bg-emerald-950/30 font-semibold' : 'hover:bg-pink-600/10'}`}>
                          
                          {/* Algorithm name + "BEST" badge if it has the fewest faults */}
                          <td className="py-4 px-6 text-left font-bold text-base text-white flex items-center space-x-2">
                            <span>{res.algorithmName}</span>
                            {isBest && (
                              <span className="px-2 py-0.5 rounded text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                                BEST
                              </span>
                            )}
                          </td>

                          {/* Total hits count (green) */}
                          <td className="py-4 px-6 text-emerald-400 font-bold">{res.totalHits}</td>
                          
                          {/* Total page faults count (red) */}
                          <td className="py-4 px-6 text-rose-400 font-bold">{res.totalFaults}</td>
                          
                          {/* Hit ratio percentage string */}
                          <td className="py-4 px-6 text-emerald-300">{res.hitRatio}</td>
                          
                          {/* Fault ratio percentage string */}
                          <td className="py-4 px-6 text-rose-300">{res.faultRatio}</td>
                          
                          {/* Performance rank: Trophy icon for best, "Standard" for others */}
                          <td className="py-4 px-6">
                            {isBest ? (
                              <span className="inline-flex items-center gap-1 text-emerald-400 font-bold text-xs">
                                <Trophy className="w-4 h-4 fill-emerald-400" />
                                Optimal
                              </span>
                            ) : (
                              <span className="text-gray-400 text-xs">Standard</span>
                            )}
                          </td>
                        </tr>
                      );
                    });
                  })()}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SimulatorPage;
