import React, { useState } from 'react';
import { PlayCircle, RotateCcw, Sliders, Dices, BarChart3, Trophy, ArrowRight, Layers } from 'lucide-react';
import { 
  simulateFIFO, 
  simulateLRU, 
  simulateOptimal, 
  simulateLFU, 
  simulateMFU, 
  compareAllAlgorithms 
} from '../algorithms';
import ResultsTable from '../components/ResultsTable';
import Summary from '../components/Summary';

const PRESETS = [
  {
    label: "Standard OS Example",
    frames: 3,
    sequence: "7, 0, 1, 2, 0, 3, 0, 4, 2, 3, 0, 3, 2, 1, 2, 0, 1, 7, 0, 1"
  },
  {
    label: "Belady's Anomaly Case",
    frames: 3,
    sequence: "1, 2, 3, 4, 1, 2, 5, 1, 2, 3, 4, 5"
  },
  {
    label: "High Locality Case",
    frames: 4,
    sequence: "2, 3, 2, 1, 5, 2, 4, 5, 3, 2, 5, 2"
  }
];

const ALGORITHMS = [
  { name: 'FIFO', func: simulateFIFO, desc: 'First-In First-Out' },
  { name: 'Optimal', func: simulateOptimal, desc: 'Optimal Lookahead' },
  { name: 'LRU', func: simulateLRU, desc: 'Least Recently Used' },
  { name: 'LFU', func: simulateLFU, desc: 'Least Frequently Used' },
  { name: 'MFU', func: simulateMFU, desc: 'Most Frequently Used' },
];

const SimulatorPage = () => {
  const [frameCount, setFrameCount] = useState('3');
  const [pageSequence, setPageSequence] = useState('7, 0, 1, 2, 0, 3, 0, 4, 2, 3, 0, 3, 2, 1, 2, 0, 1, 7, 0, 1');
  const [activeTab, setActiveTab] = useState('FIFO');
  const [error, setError] = useState('');
  const [singleResult, setSingleResult] = useState(null);
  const [comparisonResults, setComparisonResults] = useState(null);
  const [mode, setMode] = useState('single'); // 'single' | 'compare'

  // Validate inputs and parse reference sequence
  const parseInputs = () => {
    const frames = parseInt(frameCount, 10);
    if (isNaN(frames) || frames <= 0 || frames > 10) {
      setError('Number of frames must be an integer between 1 and 10.');
      return null;
    }

    const pages = pageSequence
      .trim()
      .split(/[\s,]+/)
      .map(Number)
      .filter(n => !isNaN(n));

    if (pages.length === 0) {
      setError('Please provide a valid page reference sequence separated by spaces or commas.');
      return null;
    }

    setError('');
    return { frames, pages };
  };

  const handleSimulateSingle = (algoName) => {
    const parsed = parseInputs();
    if (!parsed) return;

    const algo = ALGORITHMS.find(a => a.name === algoName) || ALGORITHMS[0];
    setActiveTab(algo.name);
    setMode('single');
    setComparisonResults(null);

    const res = algo.func(parsed.pages, parsed.frames);
    setSingleResult(res);
  };

  const handleCompareAll = () => {
    const parsed = parseInputs();
    if (!parsed) return;

    setMode('compare');
    setSingleResult(null);

    const resList = compareAllAlgorithms(parsed.pages, parsed.frames);
    setComparisonResults(resList);
  };

  const handleReset = () => {
    setSingleResult(null);
    setComparisonResults(null);
    setError('');
  };

  const handleRandomSequence = () => {
    const length = 15;
    const randPages = Array.from({ length }, () => Math.floor(Math.random() * 8));
    setPageSequence(randPages.join(', '));
    setSingleResult(null);
    setComparisonResults(null);
  };

  const handleApplyPreset = (preset) => {
    setFrameCount(preset.frames.toString());
    setPageSequence(preset.sequence);
    setSingleResult(null);
    setComparisonResults(null);
    setError('');
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
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

      {/* Control Panel Card */}
      <div className="bg-[#1e1735]/90 border border-pink-500/20 p-6 md:p-8 rounded-2xl shadow-xl backdrop-blur-lg space-y-6">
        <div className="flex items-center space-x-2 text-pink-400 text-sm font-bold uppercase tracking-wider">
          <Sliders className="w-4 h-4" />
          <span>Simulation Settings & Inputs</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Frame Count Input */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-200">
              Number of Memory Frames: <span className="text-pink-400 font-mono text-base">{frameCount}</span>
            </label>
            <div className="flex items-center gap-4">
              <input
                type="range"
                min="1"
                max="10"
                value={frameCount}
                onChange={(e) => {
                  setFrameCount(e.target.value);
                  setSingleResult(null);
                  setComparisonResults(null);
                }}
                className="w-full accent-pink-500 cursor-pointer"
              />
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

          {/* Reference String Input (Spans 2 cols on lg) */}
          <div className="lg:col-span-2 space-y-2">
            <div className="flex items-center justify-between">
              <label className="block text-sm font-semibold text-gray-200">
                Page Reference String <span className="text-xs text-gray-400 font-normal">(comma or space separated)</span>
              </label>
              <button
                onClick={handleRandomSequence}
                className="text-xs text-pink-400 hover:text-pink-300 flex items-center gap-1 font-medium hover:underline"
              >
                <Dices className="w-3.5 h-3.5" />
                <span>Randomize</span>
              </button>
            </div>
            <input
              type="text"
              value={pageSequence}
              onChange={(e) => {
                setPageSequence(e.target.value);
                setSingleResult(null);
                setComparisonResults(null);
              }}
              placeholder="e.g. 7, 0, 1, 2, 0, 3, 0, 4"
              className="w-full px-4 py-2.5 rounded-xl bg-[#16102b] border border-pink-500/30 text-white font-mono text-sm focus:outline-none focus:border-pink-500 transition-colors"
            />
          </div>
        </div>

        {/* Quick Presets */}
        <div className="pt-4 border-t border-pink-500/10 flex flex-wrap items-center gap-2">
          <span className="text-xs font-semibold text-gray-400 mr-2">Quick Presets:</span>
          {PRESETS.map((preset, idx) => (
            <button
              key={idx}
              onClick={() => handleApplyPreset(preset)}
              className="px-3 py-1.5 rounded-lg bg-[#251d42] hover:bg-pink-600/20 border border-pink-500/20 text-xs text-gray-300 hover:text-white transition-all"
            >
              {preset.label}
            </button>
          ))}
        </div>

        {/* Error Alert */}
        {error && (
          <div className="p-4 rounded-xl bg-rose-950/60 border border-rose-500/40 text-rose-300 text-sm font-medium">
            ⚠️ {error}
          </div>
        )}

        {/* Action Buttons */}
        <div className="pt-2 flex flex-wrap items-center justify-center sm:justify-start gap-3">
          <span className="text-xs text-gray-400 font-medium mr-2 w-full sm:w-auto">Simulate Algorithm:</span>
          {ALGORITHMS.map(algo => (
            <button
              key={algo.name}
              onClick={() => handleSimulateSingle(algo.name)}
              className={`px-5 py-2.5 rounded-xl font-semibold text-sm transition-all duration-200 shadow-md ${
                mode === 'single' && activeTab === algo.name && singleResult
                  ? 'bg-pink-600 text-white shadow-pink-600/40 scale-105 ring-2 ring-pink-400'
                  : 'bg-[#251d42] hover:bg-pink-600/30 text-gray-200 hover:text-white border border-pink-500/20'
              }`}
            >
              {algo.name}
            </button>
          ))}

          <button
            onClick={handleCompareAll}
            className={`px-6 py-2.5 rounded-xl font-bold text-sm flex items-center gap-2 transition-all shadow-lg ${
              mode === 'compare' && comparisonResults
                ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white ring-2 ring-purple-400 scale-105'
                : 'bg-[#2d234a] hover:bg-purple-600/40 border border-purple-500/40 text-purple-300 hover:text-white'
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            <span>Compare All Algorithms</span>
          </button>
        </div>
      </div>

      {/* Results View - Single Algorithm */}
      {mode === 'single' && singleResult && (
        <div className="space-y-6 animate-fade-in">
          <div className="flex items-center space-x-3 bg-[#1e1735] p-4 rounded-xl border border-pink-500/20">
            <span className="text-xl font-bold text-pink-400">{singleResult.algorithmName} Algorithm Results</span>
            <span className="text-xs px-3 py-1 rounded-full bg-pink-500/20 border border-pink-500/30 text-pink-300">
              Frames: {singleResult.framesCount}
            </span>
          </div>

          <ResultsTable history={singleResult.steps} frameCount={singleResult.framesCount} />
          <Summary result={singleResult} frameCount={frameCount} pageSequence={pageSequence} />
        </div>
      )}

      {/* Results View - Compare All Algorithms */}
      {mode === 'compare' && comparisonResults && (
        <div className="space-y-6 animate-fade-in">
          <div className="bg-[#1e1735]/90 border border-pink-500/20 p-6 rounded-2xl shadow-xl backdrop-blur-lg">
            <div className="flex items-center space-x-3 mb-6 pb-4 border-b border-pink-500/20">
              <div className="w-9 h-9 rounded-xl bg-purple-600/30 border border-purple-500/30 flex items-center justify-center">
                <Trophy className="w-5 h-5 text-purple-400" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">Comparative Performance Analysis</h3>
                <p className="text-xs text-gray-400">Comparing all 5 page replacement algorithms on the current input dataset</p>
              </div>
            </div>

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
                  {(() => {
                    const minFaults = Math.min(...comparisonResults.map(r => r.totalFaults));

                    return comparisonResults.map((res, idx) => {
                      const isBest = res.totalFaults === minFaults;

                      return (
                        <tr key={idx} className={`transition-colors ${isBest ? 'bg-emerald-950/30 font-semibold' : 'hover:bg-pink-600/10'}`}>
                          <td className="py-4 px-6 text-left font-bold text-base text-white flex items-center space-x-2">
                            <span>{res.algorithmName}</span>
                            {isBest && (
                              <span className="px-2 py-0.5 rounded text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                                BEST
                              </span>
                            )}
                          </td>
                          <td className="py-4 px-6 text-emerald-400 font-bold">{res.totalHits}</td>
                          <td className="py-4 px-6 text-rose-400 font-bold">{res.totalFaults}</td>
                          <td className="py-4 px-6 text-emerald-300">{res.hitRatio}</td>
                          <td className="py-4 px-6 text-rose-300">{res.faultRatio}</td>
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
