// ============================================================
// pages/LandingPage.jsx - Home / Landing Page
// ============================================================
// This is the first page users see when they visit the app ("/").
// Sections:
//   1. Hero Section   - Big headline, description, CTA buttons, paging diagram image
//   2. Concepts       - 4 info cards explaining: Page, Frame, Paging, Page Fault
//   3. Algorithms     - Grid of 5 algorithm cards (FIFO, OPT, LRU, LFU, MFU)
//   4. C++ Code       - Embedded reference C++ implementation viewer
//
// Two local sub-components are defined here for reuse within this file:
//   - InfoCard      : A reusable info box with icon, title, and description
//   - AlgorithmCard : A stylized card displaying an algorithm's abbreviation and name
// ============================================================

import React from 'react';
import { Link } from 'react-router-dom'; // Link component for internal navigation (no page reload)
import { PlayCircle, BookOpen, Cpu, Sparkles, Layers, ArrowRight, Code2 } from 'lucide-react'; // Icons
import CppCodeViewer from '../components/CppCodeViewer'; // Component that renders the C++ code block

// ============================================================
// InfoCard - Reusable info box component (used in the Concepts section)
// Props:
//   title    - Card heading text
//   children - Card body text (passed between opening and closing tags)
//   icon     - A lucide icon component (passed as a prop and rendered as <Icon />)
// ============================================================
const InfoCard = ({ title, children, icon: Icon }) => (
  // Card container: dark background, rounded, border, hover effects (lift + border highlight)
  <div className="bg-[#1e1735]/90 p-6 rounded-2xl border border-pink-500/20 hover:border-pink-500/50 transition-all duration-300 shadow-xl backdrop-blur-lg group hover:-translate-y-1">
    {/* Icon box: scales up on hover via group-hover */}
    <div className="w-10 h-10 rounded-xl bg-pink-600/20 border border-pink-500/30 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
      <Icon className="w-5 h-5 text-pink-400" />
    </div>
    {/* Card title: turns pink on hover */}
    <h3 className="font-bold text-xl mb-2 text-white group-hover:text-pink-300 transition-colors">{title}</h3>
    {/* Card body text */}
    <p className="text-gray-300 text-sm leading-relaxed">{children}</p>
  </div>
);

// ============================================================
// AlgorithmCard - Stylized card for algorithm display (used in the Algorithms section)
// Props:
//   abbr  - Short abbreviation like "FIFO", "LRU", etc.
//   name  - Full name like "First-In First-Out"
//   color - (optional) Not currently used but available for future color customization
// ============================================================
const AlgorithmCard = ({ abbr, name, color }) => (
  // Card container: lifts and expands on hover
  <div className="bg-[#1e1735]/90 p-8 rounded-3xl border border-pink-500/20 shadow-xl hover:border-pink-500/50 hover:shadow-pink-600/20 transform transition-all duration-300 hover:-translate-y-2 cursor-pointer flex flex-col justify-between">
    <div>
      {/* "Algorithm" tag badge */}
      <span className="text-xs font-semibold uppercase tracking-wider text-pink-400 px-3 py-1 rounded-full bg-pink-500/10 border border-pink-500/20">
        Algorithm
      </span>
      {/* Large gradient abbreviation text (e.g. "LRU" in huge pink-to-purple gradient) */}
      <h3 className="font-extrabold text-5xl text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-purple-400 my-4">
        {abbr}
      </h3>
    </div>
    {/* Full algorithm name below the abbreviation */}
    <p className="text-gray-300 text-sm font-semibold">{name}</p>
  </div>
);

// ============================================================
// LandingPage - Main component
// ============================================================
const LandingPage = () => {
  // algorithms - Data for the 5 algorithm cards shown in the Algorithms section
  const algorithms = [
    { abbr: 'FIFO', name: 'First-In First-Out' },
    { abbr: 'OPT',  name: 'Optimal Replacement' },
    { abbr: 'LRU',  name: 'Least Recently Used' },
    { abbr: 'LFU',  name: 'Least Frequently Used' },
    { abbr: 'MFU',  name: 'Most Frequently Used' },
  ];

  return (
    // Outer container: vertical sections with spacing, bottom padding
    <div className="space-y-20 pb-16">
      
      {/* ===== SECTION 1: HERO ===== */}
      {/* Two-column layout: text on left (7 cols), image on right (5 cols) */}
      <header className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center pt-4">
        
        {/* LEFT: Headline, description, CTA buttons */}
        <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
          {/* Small "Senior OS Engineering Project" badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-pink-600/20 border border-pink-500/30 text-pink-300 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Senior OS Engineering Project</span>
          </div>

          {/* Main headline with gradient highlight on "Algorithms" */}
          <h1 className="text-4xl sm:text-6xl font-extrabold text-white tracking-tight leading-tight">
            Visualize Page Replacement <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-purple-400 to-indigo-400">Algorithms</span>
          </h1>

          {/* Short description of what the app does */}
          <p className="text-gray-300 text-base sm:text-lg leading-relaxed max-w-2xl">
            An interactive web simulator designed to help computer science students and engineers understand how OS paging algorithms manage physical memory frames in real time.
          </p>

          {/* Longer educational note about page faults */}
          <p className="text-gray-400 text-sm leading-relaxed max-w-2xl">
            When a page fault occurs, the requested virtual page must be retrieved from secondary storage (disk). If all physical memory frames are occupied, the OS page replacement policy selects a victim frame to replace.
          </p>

          {/* CTA BUTTONS: "Go to Simulator" (primary) + "Explore Theory" (secondary) */}
          <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-2">
            {/* Primary CTA: Navigates to /simulator */}
            <Link
              to="/simulator"
              className="px-8 py-4 rounded-2xl bg-pink-600 hover:bg-pink-500 text-white font-bold flex items-center gap-2 shadow-xl shadow-pink-600/40 hover:scale-105 transition-all text-base"
            >
              <PlayCircle className="w-5 h-5" />
              <span>Go to Simulator</span>
              <ArrowRight className="w-4 h-4 ml-1" />
            </Link>

            {/* Secondary CTA: Navigates to /algorithms (theory page) */}
            <Link
              to="/algorithms"
              className="px-8 py-4 rounded-2xl bg-[#2d234a] hover:bg-[#392d5c] border border-pink-500/30 text-white font-bold flex items-center gap-2 hover:scale-105 transition-all text-base"
            >
              <BookOpen className="w-5 h-5" />
              <span>Explore Theory</span>
            </Link>
          </div>
        </div>

        {/* RIGHT: Paging architecture diagram image */}
        <div className="lg:col-span-5 flex justify-center">
          <div className="bg-[#1e1735] p-4 sm:p-6 rounded-3xl border border-pink-500/30 shadow-2xl backdrop-blur-lg hover:border-pink-500/60 transition-all duration-300">
            <div className="flex items-center space-x-2 mb-4 text-xs font-semibold text-pink-400">
              <Cpu className="w-4 h-4" />
              <span>Virtual Memory Paging Diagram</span>
            </div>
            {/* Paging architecture diagram (image stored in /public folder) */}
            <img
              src="/pageReplacement1.png"
              alt="Paging Architecture Diagram"
              className="rounded-2xl border border-pink-500/20 max-w-full h-auto shadow-lg hover:scale-105 transition-transform duration-300"
            />
          </div>
        </div>
      </header>

      {/* ===== SECTION 2: CORE OS CONCEPTS ===== */}
      {/* 4 InfoCards explaining fundamental OS memory concepts */}
      <section className="space-y-8">
        <div className="text-center space-y-2">
          <h2 className="text-3xl font-extrabold text-white">Core Memory Management Concepts</h2>
          <p className="text-gray-400 text-sm max-w-xl mx-auto">
            Fundamental building blocks of operating system virtual memory and demand paging architectures.
          </p>
        </div>

        {/* 4-column responsive grid of info cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Each InfoCard explains one concept; children = the description text */}
          <InfoCard title="What is a Page?" icon={Layers}>
            The logical address space of a process is divided into fixed-size contiguous memory blocks called pages.
          </InfoCard>
          <InfoCard title="What is a Frame?" icon={Cpu}>
            Physical RAM is partitioned into fixed-size blocks called frames, designed to hold exactly one virtual page.
          </InfoCard>
          <InfoCard title="What is Paging?" icon={Sparkles}>
            A memory management scheme that allows process address space to be non-contiguous, solving external fragmentation.
          </InfoCard>
          <InfoCard title="What is a Page Fault?" icon={BookOpen}>
            A hardware trap triggered when a CPU accesses a page not currently residing in physical RAM, requiring disk I/O.
          </InfoCard>
        </div>
      </section>

      {/* ===== SECTION 3: ALGORITHMS OVERVIEW ===== */}
      {/* Grid of 5 algorithm cards + link to learn more */}
      <section className="space-y-10 text-center">
        <div className="space-y-2">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
            Supported Page Replacement Algorithms
          </h2>
          <p className="text-gray-400 text-sm max-w-xl mx-auto">
            Interactive, step-by-step simulations supported for all 5 classical replacement policies.
          </p>
        </div>

        {/* 5-column responsive grid on large screens */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
          {/* Map over algorithms array to render an AlgorithmCard for each */}
          {algorithms.map((algo) => (
            <AlgorithmCard key={algo.abbr} abbr={algo.abbr} name={algo.name} />
          ))}
        </div>

        {/* Link to the full Algorithms theory page */}
        <div>
          <Link
            to="/algorithms"
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-2xl bg-pink-600 hover:bg-pink-500 text-white font-bold shadow-lg shadow-pink-600/30 hover:scale-105 transition-all text-sm uppercase tracking-wider"
          >
            <span>Learn More About Algorithms</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* ===== SECTION 4: C++ IMPLEMENTATION REFERENCE ===== */}
      {/* Shows the C++ source code of the simulation engine */}
      <section className="space-y-6">
        {/* Section header with icon */}
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-pink-600/30 border border-pink-500/40 flex items-center justify-center">
            <Code2 className="w-5 h-5 text-pink-400" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white">C++ Source Code Reference</h2>
            <p className="text-xs text-gray-400">Complete C++ implementation of the simulation trace engine</p>
          </div>
        </div>

        {/* CppCodeViewer component renders the code block with copy button */}
        <CppCodeViewer />
      </section>
    </div>
  );
};

export default LandingPage;
