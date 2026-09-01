// ============================================================
// components/ResultsTable.jsx - Step-by-Step Frame Matrix Table
// ============================================================
// Displays the detailed simulation trace as a table where each
// row represents one page request step.
//
// Columns: Step # | Requested Page | Frame1 | Frame2 | ... | Status
//
// Color coding in frame cells:
//   - RED (rose)   → newly inserted page (page fault, eviction occurred)
//   - GREEN (emerald) → page that was hit (already in memory)
//   - GRAY/dash    → empty frame slot (no page loaded yet)
//   - Normal       → page present in memory but not the one accessed this step
// ============================================================

import React from 'react';
import { Layers, CheckCircle2, AlertTriangle } from 'lucide-react'; // Icons for header and status badge

// ResultsTable component
// Props:
//   history    - Array of step objects from the simulation (each step = one page request)
//   frameCount - Number of memory frames (used to generate the correct number of frame columns)
const ResultsTable = ({ history = [], frameCount = 3 }) => {
  // Generate column headers for each frame slot: ["Frame 1", "Frame 2", ...]
  // Array.from({ length: frameCount }) creates an array of size frameCount
  // (_, i) gives us each index i (0, 1, 2...) for constructing "Frame 1", "Frame 2"...
  const headers = Array.from({ length: frameCount }, (_, i) => `Frame ${i + 1}`);

  return (
    // Outer container with rounded border, dark background, shadow
    <div className="mt-8 overflow-hidden rounded-2xl border border-pink-500/20 shadow-2xl bg-[#1e1735]/80 backdrop-blur-lg">
      
      {/* TABLE HEADER CARD - Title and subtitle */}
      <div className="p-4 sm:p-6 border-b border-pink-500/20 bg-[#251d42]/80 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          {/* Icon box */}
          <div className="w-9 h-9 rounded-xl bg-pink-600/30 border border-pink-500/30 flex items-center justify-center">
            <Layers className="w-5 h-5 text-pink-400" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white">Step-by-Step Frame Matrix</h3>
            <p className="text-xs text-gray-400">Snapshot of physical memory contents at each page request step</p>
          </div>
        </div>
      </div>

      {/* SCROLLABLE TABLE CONTAINER - overflow-x-auto enables horizontal scroll on small screens */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-center text-gray-200">
          
          {/* TABLE HEADER ROW */}
          <thead className="text-xs uppercase bg-[#16102b] text-gray-300 border-b border-pink-500/20">
            <tr>
              {/* Step number column */}
              <th scope="col" className="py-3.5 px-4 sm:px-6 border-r border-pink-500/20 font-bold">Step</th>
              
              {/* Requested page column */}
              <th scope="col" className="py-3.5 px-4 sm:px-6 border-r border-pink-500/20 font-bold">Requested Page</th>
              
              {/* Dynamic frame columns: one header per frame slot */}
              {headers.map(header => (
                <th key={header} scope="col" className="py-3.5 px-4 sm:px-6 border-r border-pink-500/20 font-semibold text-pink-300">
                  {header}
                </th>
              ))}
              
              {/* Status result column */}
              <th scope="col" className="py-3.5 px-4 sm:px-6 font-bold">Status Result</th>
            </tr>
          </thead>

          {/* TABLE BODY - One row per step in the simulation history */}
          <tbody className="divide-y divide-pink-500/10">
            {history.map((stepItem, index) => {
              // Determine if this step was a Hit or Page Fault
              const isHit = stepItem.status === 'Hit' || stepItem.hit === true;
              
              // Get the frames array for this step (which pages are in memory)
              const currentFrames = stepItem.frames || [];
              
              // The page that was requested at this step
              const pageVal = stepItem.page;

              // --- FIND WHICH FRAME SLOT CHANGED THIS STEP ---
              // We compare this step's frames with the previous step's frames to
              // identify which slot was newly filled (so we can highlight it in red)
              const prevFrames = index > 0 ? history[index - 1].frames : Array(frameCount).fill(null);
              
              // changedFrameIndex is the index of the frame that just got a new page
              // Only calculated for page faults (on hits, no frame changes)
              const changedFrameIndex = !isHit 
                ? currentFrames.findIndex((frame, idx) => {
                    const prev = prevFrames ? prevFrames[idx] : null;
                    // A frame "changed" if its content differs from previous step AND the new value is the requested page
                    return frame !== prev && frame === pageVal;
                  })
                : -1; // -1 means no frame changed (it was a hit)

              return (
                // Alternating row background colors for readability (zebra striping)
                <tr 
                  key={index} 
                  className={`transition-colors duration-150 ${
                    index % 2 === 0 ? 'bg-[#1b1433]/60' : 'bg-[#231a40]/60'
                  } hover:bg-pink-600/10`}
                >
                  {/* Step Number Cell - displays "#1", "#2", etc. */}
                  <td className="py-3 px-4 sm:px-6 font-mono text-xs text-gray-400 border-r border-pink-500/10">
                    #{stepItem.step || index + 1}
                  </td>

                  {/* Requested Page Cell - shows the page number in a pill/badge */}
                  <td className="py-3 px-4 sm:px-6 font-bold text-base whitespace-nowrap bg-[#16102b]/40 border-r border-pink-500/10">
                    <span className="inline-flex items-center justify-center px-3 py-1 rounded-lg bg-pink-500/20 text-pink-300 border border-pink-500/30">
                      P{pageVal} {/* "P" prefix + page number, e.g. "P7" */}
                    </span>
                  </td>

                  {/* FRAME CELLS - One cell per frame slot */}
                  {currentFrames.map((frame, fIndex) => {
                    // Highlight the frame that just received a new page (page fault → eviction)
                    const isNewlyInserted = fIndex === changedFrameIndex;
                    
                    // Highlight the frame that was hit (page already in memory)
                    const isAccessedOnHit = isHit && frame === pageVal;

                    // Build the CSS class string dynamically based on the frame's state
                    let cellStyle = "py-3 px-4 sm:px-6 font-mono text-base border-r border-pink-500/10 transition-all duration-200";
                    
                    if (isNewlyInserted) {
                      // RED background = this page was just loaded due to a page fault
                      cellStyle += " bg-rose-600/80 text-white font-extrabold shadow-inner";
                    } else if (isAccessedOnHit) {
                      // GREEN background = this page was the one that was hit (already in memory)
                      cellStyle += " bg-emerald-600/80 text-white font-extrabold shadow-inner";
                    } else if (frame === null || frame === -1) {
                      // EMPTY frame - shown as a dash "—"
                      cellStyle += " text-gray-600 font-normal italic";
                    } else {
                      // Regular occupied frame - just gray text
                      cellStyle += " text-gray-200";
                    }

                    return (
                      <td key={fIndex} className={cellStyle}>
                        {/* Show "—" for empty frames (null or -1 from C++ impl), or the page number */}
                        {frame === null || frame === -1 ? '—' : frame}
                      </td>
                    );
                  })}

                  {/* STATUS BADGE CELL - shows "Hit" (green) or "Fault" (red) */}
                  <td className="py-3 px-4 sm:px-6">
                    {isHit ? (
                      // Green badge for hit
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-xs font-bold uppercase tracking-wider">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Hit
                      </span>
                    ) : (
                      // Red badge for page fault
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
