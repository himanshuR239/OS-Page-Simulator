// ============================================================
// components/Summary.jsx - Simulation Statistics Summary Panel
// ============================================================
// Displays the statistical summary after a simulation runs.
// Shows two sections side-by-side:
//   LEFT (2/3 width): Metric cards grid + reference string display
//     - Total Requests card
//     - Page Hits card (with hit ratio)
//     - Page Faults card (with fault ratio)
//     - Hit Percentage card
//   RIGHT (1/3 width): Pie chart (Hit vs Fault visual breakdown)
// ============================================================

import React from 'react';
import { Pie } from 'react-chartjs-2'; // Chart.js pie chart component wrapper for React
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js'; // Chart.js core modules
import { Activity, CheckCircle2, AlertTriangle, Percent, Cpu } from 'lucide-react'; // Icons

// Register the Chart.js components we need.
// ArcElement = the pie slices, Tooltip = hover tooltips, Legend = the color legend below chart
ChartJS.register(ArcElement, Tooltip, Legend);

// Summary component
// Props:
//   result      - The simulation result object returned by the algorithm (contains hits, faults, etc.)
//   frameCount  - Number of memory frames used in the simulation (for display)
//   pageSequence - The raw page reference string input (string or array)
const Summary = ({ result, frameCount, pageSequence }) => {
  // If no result yet (simulation hasn't run), render nothing
  if (!result) return null;

  // --- Extract hits and faults from the result object ---
  // The result object may use either 'totalHits'/'totalFaults' or 'hits'/'faults' naming
  // We handle both for compatibility
  const hits = result.totalHits !== undefined ? result.totalHits : (result.hits || 0);
  const faults = result.totalFaults !== undefined ? result.totalFaults : (result.faults || 0);

  // Algorithm name to display in the subtitle
  const name = result.algorithmName || result.name || 'Algorithm';

  // --- Parse pageSequence into a proper numeric array ---
  // pageSequence may arrive as a raw string (e.g. "7, 0, 1, 2") or already an array
  const pagesArray = typeof pageSequence === 'string'
    ? pageSequence.trim().split(/[\s,]+/).map(Number).filter(n => !isNaN(n)) // Split by spaces/commas, convert to numbers, remove NaN
    : (Array.isArray(pageSequence) ? pageSequence : []); // If already array, use as-is; else empty
  
  const totalPages = pagesArray.length; // Total number of page requests

  // --- Calculate hit and fault ratios ---
  // Use pre-calculated ratios from the result if available, otherwise calculate here
  const hitRatio = result.hitRatio || (totalPages > 0 ? `${((hits / totalPages) * 100).toFixed(2)}%` : '0.00%');
  const faultRatio = result.faultRatio || (totalPages > 0 ? `${((faults / totalPages) * 100).toFixed(2)}%` : '0.00%');

  // --- PIE CHART DATA CONFIGURATION ---
  const chartData = {
    labels: ['Page Hits', 'Page Faults'], // Labels shown in chart legend
    datasets: [
      {
        data: [hits, faults],                      // Actual data values for each slice
        backgroundColor: ['#22c55e', '#e11d48'],   // Slice fill colors: green (hits), red (faults)
        borderColor: ['#1e1735', '#1e1735'],        // Slice border color (matches card background for a gap effect)
        borderWidth: 3,                            // Gap between slices
        hoverOffset: 6                             // Slice pops out 6px on hover
      },
    ],
  };

  // --- PIE CHART OPTIONS CONFIGURATION ---
  const chartOptions = {
    responsive: true,            // Chart resizes with its container
    maintainAspectRatio: false,  // Allows height to be controlled by the container div
    plugins: {
      legend: {
        position: 'bottom',      // Legend labels appear below the chart
        labels: {
          color: '#e2e8f0',      // Light gray label text color
          font: {
            family: 'sans-serif',
            size: 12,
            weight: 'bold'
          },
          padding: 16,           // Space between legend items
          usePointStyle: true,   // Use circle dots instead of square boxes in legend
        },
      },
      tooltip: {
        // Custom tooltip content: show the count and percentage on hover
        callbacks: {
          label: function(context) {
            const label = context.label || '';             // e.g. "Page Hits"
            const value = context.raw || 0;               // e.g. 5 (raw count)
            const percentage = totalPages > 0 ? ((value / totalPages) * 100).toFixed(1) : 0;
            return ` ${label}: ${value} (${percentage}%)`; // e.g. " Page Hits: 5 (25.0%)"
          }
        }
      }
    },
  };

  return (
    // Outer grid: 1 column on mobile, 3 columns on large screens
    <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
      
      {/* ===== LEFT SECTION: Metric Cards (spans 2 of 3 columns on large screens) ===== */}
      <div className="lg:col-span-2 space-y-4">
        {/* Card container */}
        <div className="bg-[#1e1735]/90 border border-pink-500/20 p-6 rounded-2xl shadow-xl backdrop-blur-lg">
          
          {/* Card header: icon + title */}
          <div className="flex items-center space-x-3 mb-6 pb-4 border-b border-pink-500/20">
            <div className="w-9 h-9 rounded-xl bg-pink-600/30 border border-pink-500/30 flex items-center justify-center">
              <Activity className="w-5 h-5 text-pink-400" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white">Execution Summary</h3>
              {/* Dynamic subtitle shows which algorithm this summary is for */}
              <p className="text-xs text-gray-400">Statistical breakdown for {name} algorithm</p>
            </div>
          </div>

          {/* 4-column grid of metric cards (2 columns on mobile, 4 on sm+) */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            
            {/* CARD 1: Total Requests - Total pages in the reference string */}
            <div className="p-4 rounded-xl bg-[#251d42]/60 border border-pink-500/10">
              <div className="flex items-center space-x-2 text-gray-400 text-xs font-semibold mb-1">
                <Cpu className="w-3.5 h-3.5 text-pink-400" />
                <span>Total Requests</span>
              </div>
              <p className="text-2xl font-extrabold text-white">{totalPages}</p>
              <p className="text-[10px] text-gray-400 mt-1">Frames: {frameCount}</p>
            </div>

            {/* CARD 2: Page Hits - Count of times requested page was already in memory */}
            <div className="p-4 rounded-xl bg-emerald-950/40 border border-emerald-500/20">
              <div className="flex items-center space-x-2 text-emerald-400 text-xs font-semibold mb-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Page Hits</span>
              </div>
              <p className="text-2xl font-extrabold text-emerald-400">{hits}</p>
              <p className="text-[10px] text-emerald-300/80 mt-1">Hit Ratio: {hitRatio}</p>
            </div>

            {/* CARD 3: Page Faults - Count of times page was NOT in memory (required disk load) */}
            <div className="p-4 rounded-xl bg-rose-950/40 border border-rose-500/20">
              <div className="flex items-center space-x-2 text-rose-400 text-xs font-semibold mb-1">
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>Page Faults</span>
              </div>
              <p className="text-2xl font-extrabold text-rose-400">{faults}</p>
              <p className="text-[10px] text-rose-300/80 mt-1">Fault Ratio: {faultRatio}</p>
            </div>

            {/* CARD 4: Hit Percentage - The hit ratio shown as a percentage */}
            <div className="p-4 rounded-xl bg-[#251d42]/60 border border-pink-500/10">
              <div className="flex items-center space-x-2 text-gray-400 text-xs font-semibold mb-1">
                <Percent className="w-3.5 h-3.5 text-purple-400" />
                <span>Hit Percentage</span>
              </div>
              <p className="text-2xl font-extrabold text-purple-300">{hitRatio}</p>
              <p className="text-[10px] text-gray-400 mt-1">Fault: {faultRatio}</p>
            </div>
          </div>

          {/* PAGE REFERENCE SEQUENCE DISPLAY - Shows the original input page sequence */}
          <div className="mt-6 pt-4 border-t border-pink-500/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs">
            <span className="text-gray-400 font-medium">Page Reference Sequence:</span>
            {/* Monospace, scrollable display of the page sequence */}
            <span className="font-mono bg-[#16102b] px-3 py-1.5 rounded-lg border border-pink-500/20 text-pink-300 max-w-full overflow-x-auto">
              {/* If pageSequence is a raw string, display it directly; otherwise join the array with commas */}
              {typeof pageSequence === 'string' ? pageSequence : pagesArray.join(', ')}
            </span>
          </div>
        </div>
      </div>

      {/* ===== RIGHT SECTION: Pie Chart (spans 1 of 3 columns on large screens) ===== */}
      <div className="bg-[#1e1735]/90 border border-pink-500/20 p-6 rounded-2xl shadow-xl backdrop-blur-lg flex flex-col items-center justify-center">
        <h3 className="text-lg font-bold text-white mb-4 text-center">Hit vs. Fault Ratio</h3>
        {/* Fixed height container for the chart so it doesn't grow too large */}
        <div className="w-full h-56 relative flex items-center justify-center">
          {/* Pie chart using chart.js, data and options defined above */}
          <Pie data={chartData} options={chartOptions} />
        </div>
      </div>
    </div>
  );
};

export default Summary;
