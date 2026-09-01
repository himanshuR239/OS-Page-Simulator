// ============================================================
// pages/AlgorithmsPage.jsx - Educational Algorithms Theory Page
// ============================================================
// Displays in-depth educational content about each of the
// 5 page replacement algorithms.
//
// Layout:
//   - Page header (title + subtitle)
//   - Tab bar to switch between algorithms (FIFO, Optimal, LRU, LFU, MFU)
//   - Main content card for the selected algorithm:
//       * Name, time/space complexity badges, "Simulate" shortcut link
//       * Working principle description
//       * Strengths (green) + Weaknesses (red) grid
//       * Step-by-step diagram illustration image
//   - Math formulas section at the bottom (hit ratio + fault ratio)
//
// All algorithm content (text, complexity, images) comes from
// constants.jsx as the single source of truth.
// ============================================================

import React, { useState } from 'react';
import { Link } from 'react-router-dom'; // Link for navigating to /simulator page
import { BookOpen, CheckCircle2, AlertTriangle, Clock, HardDrive, PlayCircle, Calculator, Sparkles, Image as ImageIcon } from 'lucide-react'; // Icons
import { algorithmsData } from '../components/constants'; // All algorithm content data

// AlgorithmsPage - Main educational page component
const AlgorithmsPage = () => {
  // activeTab - Tracks which algorithm tab is selected
  // Default: 'FIFO' (first tab selected on load)
  const [activeTab, setActiveTab] = useState('FIFO');

  // activeAlgo - Finds the data object for the currently selected tab
  // .find() returns the first match; falls back to algorithmsData[0] if not found
  const activeAlgo = algorithmsData.find(algo => algo.id === activeTab) || algorithmsData[0];

  return (
    // Page outer container with vertical spacing between sections
    <div className="space-y-10 pb-12">
      
      {/* ===== PAGE HEADER ===== */}
      <div className="text-center space-y-4 max-w-3xl mx-auto py-6">
        {/* Small "Educational Documentation" badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-pink-600/20 border border-pink-500/30 text-pink-300 text-xs font-semibold">
          <BookOpen className="w-3.5 h-3.5" />
          <span>Educational Documentation</span>
        </div>

        {/* Page main heading */}
        <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight">
          Page Replacement <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-400">Techniques</span>
        </h1>

        {/* Page subtitle */}
        <p className="text-gray-300 text-base sm:text-lg leading-relaxed">
          Master how operating system virtual memory managers decide which physical memory frames to evict upon page faults.
        </p>
      </div>

      {/* ===== ALGORITHM NAVIGATION TABS ===== */}
      {/* Horizontally scrollable tab bar for algorithm selection */}
      <div className="flex justify-center overflow-x-auto pb-2 scrollbar-none">
        {/* Tab pill container */}
        <div className="bg-[#1e1735]/90 border border-pink-500/20 p-1.5 rounded-2xl flex items-center gap-1 shadow-xl backdrop-blur-lg">
          {/* Render one tab button per algorithm in algorithmsData */}
          {algorithmsData.map(algo => (
            <button
              key={algo.id}
              onClick={() => setActiveTab(algo.id)} // Switch the active tab
              // Conditional styling: active tab gets pink highlight, inactive gets subtle hover
              className={`px-5 py-2.5 rounded-xl font-bold text-sm transition-all duration-200 whitespace-nowrap ${
                activeTab === algo.id
                  ? 'bg-pink-600 text-white shadow-lg shadow-pink-600/40 ring-2 ring-pink-400 scale-105' // Active tab
                  : 'text-gray-300 hover:text-white hover:bg-pink-600/20' // Inactive tab
              }`}
            >
              {algo.id} {/* Tab label: "FIFO", "Optimal", "LRU", "LFU", "MFU" */}
            </button>
          ))}
        </div>
      </div>

      {/* ===== MAIN CONTENT CARD ===== */}
      {/* Only renders when activeAlgo is found (should always be true) */}
      {activeAlgo && (
        <div className="bg-[#1e1735]/90 border border-pink-500/20 p-6 sm:p-8 rounded-3xl shadow-2xl backdrop-blur-lg space-y-8 animate-fade-in">
          
          {/* ---- HEADER ROW: Algorithm name + complexity badges + Simulate button ---- */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-pink-500/20">
            <div>
              {/* Full algorithm name (e.g. "LRU (Least Recently Used)") */}
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white">{activeAlgo.name}</h2>
              <p className="text-sm text-pink-400 font-medium mt-1">Virtual Memory Eviction Strategy</p>
            </div>

            {/* Complexity badges + Simulate link */}
            <div className="flex flex-wrap items-center gap-2">
              {/* Time Complexity badge */}
              <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-purple-950/60 border border-purple-500/30 text-purple-300 text-xs font-semibold">
                <Clock className="w-3.5 h-3.5 text-purple-400" />
                {activeAlgo.timeComplexity} {/* e.g. "O(1) per request" */}
              </span>
              {/* Space Complexity badge */}
              <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-indigo-950/60 border border-indigo-500/30 text-indigo-300 text-xs font-semibold">
                <HardDrive className="w-3.5 h-3.5 text-indigo-400" />
                {activeAlgo.spaceComplexity} {/* e.g. "O(M) where M is frame count" */}
              </span>
              {/* Link to Simulator page - pre-selects this algorithm */}
              <Link
                to="/simulator"
                className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-pink-600 hover:bg-pink-500 text-white text-xs font-bold shadow-md hover:scale-105 transition-all ml-auto"
              >
                <PlayCircle className="w-4 h-4" />
                Simulate {activeAlgo.id}
              </Link>
            </div>
          </div>

          {/* ---- DESCRIPTION / WORKING PRINCIPLE ---- */}
          <div className="space-y-3">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-pink-400" />
              <span>Working Principle</span>
            </h3>
            {/* Long description paragraph explaining how this algorithm works */}
            <p className="text-gray-300 leading-relaxed text-base bg-[#16102b]/60 p-5 rounded-2xl border border-pink-500/10">
              {activeAlgo.description}
            </p>
          </div>

          {/* ---- STRENGTHS & WEAKNESSES GRID ---- */}
          {/* Side-by-side green (strengths) and red (weaknesses) panels */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* STRENGTHS panel (green) */}
            <div className="bg-emerald-950/30 border border-emerald-500/30 p-6 rounded-2xl space-y-4">
              <h4 className="font-bold text-lg text-emerald-400 flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                <span>Advantages &amp; Strengths</span>
              </h4>
              {/* List of strength bullet points from the algorithm data */}
              <ul className="space-y-2.5">
                {activeAlgo.strengths.map((point, index) => (
                  <li key={index} className="flex items-start gap-2.5 text-sm text-gray-200">
                    {/* Green dot bullet */}
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-2 shrink-0"></span>
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* WEAKNESSES panel (red) */}
            <div className="bg-rose-950/30 border border-rose-500/30 p-6 rounded-2xl space-y-4">
              <h4 className="font-bold text-lg text-rose-400 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-rose-400" />
                <span>Disadvantages &amp; Trade-offs</span>
              </h4>
              {/* List of weakness bullet points from the algorithm data */}
              <ul className="space-y-2.5">
                {activeAlgo.weaknesses.map((point, index) => (
                  <li key={index} className="flex items-start gap-2.5 text-sm text-gray-200">
                    {/* Red dot bullet */}
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-400 mt-2 shrink-0"></span>
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* ---- STEP ILLUSTRATION IMAGE ---- */}
          {/* Shows a visual diagram of how this algorithm handles page requests */}
          <div className="pt-6 border-t border-pink-500/20 space-y-4">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <ImageIcon className="w-5 h-5 text-pink-400" />
              <span>Execution Snapshot Illustration</span>
            </h3>
            {/* Dark box container for the image */}
            <div className="flex justify-center bg-[#16102b] p-4 sm:p-6 rounded-2xl border border-pink-500/20 shadow-inner">
              {/* Diagram image for the active algorithm (path comes from constants.jsx) */}
              <img
                src={activeAlgo.exampleImage}           // e.g. "/fifo.jpg"
                alt={`${activeAlgo.name} Step Illustration`}
                className="rounded-xl border border-pink-500/30 max-w-full h-auto shadow-2xl object-contain hover:scale-[1.02] transition-transform duration-300"
              />
            </div>
          </div>
        </div>
      )}

      {/* ===== MATHEMATICAL FORMULAS SECTION ===== */}
      {/* Always shown at the bottom regardless of active tab */}
      <div className="bg-[#1e1735]/90 border border-pink-500/20 p-6 sm:p-8 rounded-3xl shadow-xl backdrop-blur-lg space-y-6">
        {/* Section header */}
        <div className="flex items-center space-x-3 pb-4 border-b border-pink-500/20">
          <div className="w-9 h-9 rounded-xl bg-pink-600/30 border border-pink-500/30 flex items-center justify-center">
            <Calculator className="w-5 h-5 text-pink-400" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white">Mathematical Formulas</h3>
            <p className="text-xs text-gray-400">Standard metrics for page replacement efficiency evaluation</p>
          </div>
        </div>

        {/* Two formula cards side by side (stacked on mobile) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* HIT RATIO formula card (green) */}
          <div className="bg-[#251d42]/70 border border-emerald-500/30 p-5 rounded-2xl space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="font-bold text-emerald-400 text-base">Hit Ratio Percentage</h4>
              {/* Badge indicating that higher value is better */}
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-mono">
                Higher is better
              </span>
            </div>
            {/* Formula displayed in monospace font inside a dark box */}
            <div className="bg-[#16102b] p-4 rounded-xl text-center font-mono text-emerald-300 text-sm border border-emerald-500/20">
              Hit Ratio (%) = ( Total Page Hits / Total Requests ) × 100
            </div>
            {/* Explanation of what hit ratio means */}
            <p className="text-xs text-gray-300">
              Measures the proportion of requested pages that were already present in physical memory frames.
            </p>
          </div>

          {/* FAULT RATIO formula card (red) */}
          <div className="bg-[#251d42]/70 border border-rose-500/30 p-5 rounded-2xl space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="font-bold text-rose-400 text-base">Fault Ratio Percentage</h4>
              {/* Badge indicating that lower value is better */}
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-rose-500/20 text-rose-300 font-mono">
                Lower is better
              </span>
            </div>
            {/* Formula displayed in monospace font */}
            <div className="bg-[#16102b] p-4 rounded-xl text-center font-mono text-rose-300 text-sm border border-rose-500/20">
              Fault Ratio (%) = ( Total Page Faults / Total Requests ) × 100
            </div>
            {/* Explanation of what fault ratio means */}
            <p className="text-xs text-gray-300">
              Measures the proportion of page requests that required disk I/O to load the page into memory.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AlgorithmsPage;
