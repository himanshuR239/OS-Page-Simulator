import React from 'react';
import { Layers, CheckCircle2, AlertTriangle } from 'lucide-react';

const ResultsTable = ({ history = [], frameCount = 3 }) => {
  const headers = Array.from({ length: frameCount }, (_, i) => `Frame ${i + 1}`);

  return (
    <div className="mt-8 overflow-hidden rounded-2xl border border-pink-500/20 shadow-2xl bg-[#1e1735]/80 backdrop-blur-lg">
      <div className="p-4 sm:p-6 border-b border-pink-500/20 bg-[#251d42]/80 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 rounded-xl bg-pink-600/30 border border-pink-500/30 flex items-center justify-center">
            <Layers className="w-5 h-5 text-pink-400" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white">Step-by-Step Frame Matrix</h3>
            <p className="text-xs text-gray-400">Snapshot of physical memory contents at each page request step</p>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm text-center text-gray-200">
          <thead className="text-xs uppercase bg-[#16102b] text-gray-300 border-b border-pink-500/20">
            <tr>
              <th scope="col" className="py-3.5 px-4 sm:px-6 border-r border-pink-500/20 font-bold">Step</th>
              <th scope="col" className="py-3.5 px-4 sm:px-6 border-r border-pink-500/20 font-bold">Requested Page</th>
              {headers.map(header => (
                <th key={header} scope="col" className="py-3.5 px-4 sm:px-6 border-r border-pink-500/20 font-semibold text-pink-300">
                  {header}
                </th>
              ))}
              <th scope="col" className="py-3.5 px-4 sm:px-6 font-bold">Status Result</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-pink-500/10">
            {history.map((stepItem, index) => {
              const isHit = stepItem.status === 'Hit' || stepItem.hit === true;
              const currentFrames = stepItem.frames || [];
              const pageVal = stepItem.page;

              // Identify index of updated frame slot on page fault
              const prevFrames = index > 0 ? history[index - 1].frames : Array(frameCount).fill(null);
              const changedFrameIndex = !isHit 
                ? currentFrames.findIndex((frame, idx) => {
                    const prev = prevFrames ? prevFrames[idx] : null;
                    return frame !== prev && frame === pageVal;
                  })
                : -1;

              return (
                <tr 
                  key={index} 
                  className={`transition-colors duration-150 ${
                    index % 2 === 0 ? 'bg-[#1b1433]/60' : 'bg-[#231a40]/60'
                  } hover:bg-pink-600/10`}
                >
                  {/* Step Number */}
                  <td className="py-3 px-4 sm:px-6 font-mono text-xs text-gray-400 border-r border-pink-500/10">
                    #{stepItem.step || index + 1}
                  </td>

                  {/* Requested Page */}
                  <td className="py-3 px-4 sm:px-6 font-bold text-base whitespace-nowrap bg-[#16102b]/40 border-r border-pink-500/10">
                    <span className="inline-flex items-center justify-center px-3 py-1 rounded-lg bg-pink-500/20 text-pink-300 border border-pink-500/30">
                      P{pageVal}
                    </span>
                  </td>

                  {/* Frame Columns */}
                  {currentFrames.map((frame, fIndex) => {
                    const isNewlyInserted = fIndex === changedFrameIndex;
                    const isAccessedOnHit = isHit && frame === pageVal;

                    let cellStyle = "py-3 px-4 sm:px-6 font-mono text-base border-r border-pink-500/10 transition-all duration-200";
                    
                    if (isNewlyInserted) {
                      cellStyle += " bg-rose-600/80 text-white font-extrabold shadow-inner";
                    } else if (isAccessedOnHit) {
                      cellStyle += " bg-emerald-600/80 text-white font-extrabold shadow-inner";
                    } else if (frame === null || frame === -1) {
                      cellStyle += " text-gray-600 font-normal italic";
                    } else {
                      cellStyle += " text-gray-200";
                    }

                    return (
                      <td key={fIndex} className={cellStyle}>
                        {frame === null || frame === -1 ? '—' : frame}
                      </td>
                    );
                  })}

                  {/* Status Badge Column */}
                  <td className="py-3 px-4 sm:px-6">
                    {isHit ? (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-xs font-bold uppercase tracking-wider">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Hit
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/40 text-xs font-bold uppercase tracking-wider">
                        <AlertTriangle className="w-3.5 h-3.5" />
                        Fault
                      </span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ResultsTable;
