import React from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Activity, CheckCircle2, AlertTriangle, Percent, Cpu } from 'lucide-react';

ChartJS.register(ArcElement, Tooltip, Legend);

const Summary = ({ result, frameCount, pageSequence }) => {
  if (!result) return null;

  const hits = result.totalHits !== undefined ? result.totalHits : (result.hits || 0);
  const faults = result.totalFaults !== undefined ? result.totalFaults : (result.faults || 0);
  const name = result.algorithmName || result.name || 'Algorithm';

  const pagesArray = typeof pageSequence === 'string'
    ? pageSequence.trim().split(/[\s,]+/).map(Number).filter(n => !isNaN(n))
    : (Array.isArray(pageSequence) ? pageSequence : []);
  
  const totalPages = pagesArray.length;
  const hitRatio = result.hitRatio || (totalPages > 0 ? `${((hits / totalPages) * 100).toFixed(2)}%` : '0.00%');
  const faultRatio = result.faultRatio || (totalPages > 0 ? `${((faults / totalPages) * 100).toFixed(2)}%` : '0.00%');

  const chartData = {
    labels: ['Page Hits', 'Page Faults'],
    datasets: [
      {
        data: [hits, faults],
        backgroundColor: ['#22c55e', '#e11d48'], // Emerald green & Rose red
        borderColor: ['#1e1735', '#1e1735'],
        borderWidth: 3,
        hoverOffset: 6
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          color: '#e2e8f0',
          font: {
            family: 'sans-serif',
            size: 12,
            weight: 'bold'
          },
          padding: 16,
          usePointStyle: true,
        },
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            const label = context.label || '';
            const value = context.raw || 0;
            const percentage = totalPages > 0 ? ((value / totalPages) * 100).toFixed(1) : 0;
            return ` ${label}: ${value} (${percentage}%)`;
          }
        }
      }
    },
  };

  return (
    <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Metric Cards Grid (Spans 2 cols) */}
      <div className="lg:col-span-2 space-y-4">
        <div className="bg-[#1e1735]/90 border border-pink-500/20 p-6 rounded-2xl shadow-xl backdrop-blur-lg">
          <div className="flex items-center space-x-3 mb-6 pb-4 border-b border-pink-500/20">
            <div className="w-9 h-9 rounded-xl bg-pink-600/30 border border-pink-500/30 flex items-center justify-center">
              <Activity className="w-5 h-5 text-pink-400" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white">Execution Summary</h3>
              <p className="text-xs text-gray-400">Statistical breakdown for {name} algorithm</p>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {/* Total Requests Card */}
            <div className="p-4 rounded-xl bg-[#251d42]/60 border border-pink-500/10">
              <div className="flex items-center space-x-2 text-gray-400 text-xs font-semibold mb-1">
                <Cpu className="w-3.5 h-3.5 text-pink-400" />
                <span>Total Requests</span>
              </div>
              <p className="text-2xl font-extrabold text-white">{totalPages}</p>
              <p className="text-[10px] text-gray-400 mt-1">Frames: {frameCount}</p>
            </div>

            {/* Page Hits Card */}
            <div className="p-4 rounded-xl bg-emerald-950/40 border border-emerald-500/20">
              <div className="flex items-center space-x-2 text-emerald-400 text-xs font-semibold mb-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Page Hits</span>
              </div>
              <p className="text-2xl font-extrabold text-emerald-400">{hits}</p>
              <p className="text-[10px] text-emerald-300/80 mt-1">Hit Ratio: {hitRatio}</p>
            </div>

            {/* Page Faults Card */}
            <div className="p-4 rounded-xl bg-rose-950/40 border border-rose-500/20">
              <div className="flex items-center space-x-2 text-rose-400 text-xs font-semibold mb-1">
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>Page Faults</span>
              </div>
              <p className="text-2xl font-extrabold text-rose-400">{faults}</p>
              <p className="text-[10px] text-rose-300/80 mt-1">Fault Ratio: {faultRatio}</p>
            </div>

            {/* Efficiency Ratio Card */}
            <div className="p-4 rounded-xl bg-[#251d42]/60 border border-pink-500/10">
              <div className="flex items-center space-x-2 text-gray-400 text-xs font-semibold mb-1">
                <Percent className="w-3.5 h-3.5 text-purple-400" />
                <span>Hit Percentage</span>
              </div>
              <p className="text-2xl font-extrabold text-purple-300">{hitRatio}</p>
              <p className="text-[10px] text-gray-400 mt-1">Fault: {faultRatio}</p>
            </div>
          </div>

          {/* Reference String Display */}
          <div className="mt-6 pt-4 border-t border-pink-500/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs">
            <span className="text-gray-400 font-medium">Page Reference Sequence:</span>
            <span className="font-mono bg-[#16102b] px-3 py-1.5 rounded-lg border border-pink-500/20 text-pink-300 max-w-full overflow-x-auto">
              {typeof pageSequence === 'string' ? pageSequence : pagesArray.join(', ')}
            </span>
          </div>
        </div>
      </div>

      {/* Pie Chart Card (Spans 1 col) */}
      <div className="bg-[#1e1735]/90 border border-pink-500/20 p-6 rounded-2xl shadow-xl backdrop-blur-lg flex flex-col items-center justify-center">
        <h3 className="text-lg font-bold text-white mb-4 text-center">Hit vs. Fault Ratio</h3>
        <div className="w-full h-56 relative flex items-center justify-center">
          <Pie data={chartData} options={chartOptions} />
        </div>
      </div>
    </div>
  );
};

export default Summary;
