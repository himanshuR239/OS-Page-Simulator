import React from 'react';
import { Link } from 'react-router-dom';
import { PlayCircle, BookOpen, Cpu, Sparkles, Layers, ArrowRight, Code2 } from 'lucide-react';
import CppCodeViewer from '../components/CppCodeViewer';

const InfoCard = ({ title, children, icon: Icon }) => (
  <div className="bg-[#1e1735]/90 p-6 rounded-2xl border border-pink-500/20 hover:border-pink-500/50 transition-all duration-300 shadow-xl backdrop-blur-lg group hover:-translate-y-1">
    <div className="w-10 h-10 rounded-xl bg-pink-600/20 border border-pink-500/30 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
      <Icon className="w-5 h-5 text-pink-400" />
    </div>
    <h3 className="font-bold text-xl mb-2 text-white group-hover:text-pink-300 transition-colors">{title}</h3>
    <p className="text-gray-300 text-sm leading-relaxed">{children}</p>
  </div>
);

const AlgorithmCard = ({ abbr, name, color }) => (
  <div className="bg-[#1e1735]/90 p-8 rounded-3xl border border-pink-500/20 shadow-xl hover:border-pink-500/50 hover:shadow-pink-600/20 transform transition-all duration-300 hover:-translate-y-2 cursor-pointer flex flex-col justify-between">
    <div>
      <span className="text-xs font-semibold uppercase tracking-wider text-pink-400 px-3 py-1 rounded-full bg-pink-500/10 border border-pink-500/20">
        Algorithm
      </span>
      <h3 className="font-extrabold text-5xl text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-purple-400 my-4">
        {abbr}
      </h3>
    </div>
    <p className="text-gray-300 text-sm font-semibold">{name}</p>
  </div>
);

const LandingPage = () => {
  const algorithms = [
    { abbr: 'FIFO', name: 'First-In First-Out' },
    { abbr: 'OPT', name: 'Optimal Replacement' },
    { abbr: 'LRU', name: 'Least Recently Used' },
    { abbr: 'LFU', name: 'Least Frequently Used' },
    { abbr: 'MFU', name: 'Most Frequently Used' },
  ];

  return (
    <div className="space-y-20 pb-16">
      {/* Hero Section */}
      <header className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center pt-4">
        <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-pink-600/20 border border-pink-500/30 text-pink-300 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Senior OS Engineering Project</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-extrabold text-white tracking-tight leading-tight">
            Visualize Page Replacement <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-purple-400 to-indigo-400">Algorithms</span>
          </h1>

          <p className="text-gray-300 text-base sm:text-lg leading-relaxed max-w-2xl">
            An interactive web simulator designed to help computer science students and engineers understand how OS paging algorithms manage physical memory frames in real time.
          </p>

          <p className="text-gray-400 text-sm leading-relaxed max-w-2xl">
            When a page fault occurs, the requested virtual page must be retrieved from secondary storage (disk). If all physical memory frames are occupied, the OS page replacement policy selects a victim frame to replace.
          </p>

          <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-2">
            <Link
              to="/simulator"
              className="px-8 py-4 rounded-2xl bg-pink-600 hover:bg-pink-500 text-white font-bold flex items-center gap-2 shadow-xl shadow-pink-600/40 hover:scale-105 transition-all text-base"
            >
              <PlayCircle className="w-5 h-5" />
              <span>Go to Simulator</span>
              <ArrowRight className="w-4 h-4 ml-1" />
            </Link>

            <Link
              to="/algorithms"
              className="px-8 py-4 rounded-2xl bg-[#2d234a] hover:bg-[#392d5c] border border-pink-500/30 text-white font-bold flex items-center gap-2 hover:scale-105 transition-all text-base"
            >
              <BookOpen className="w-5 h-5" />
              <span>Explore Theory</span>
            </Link>
          </div>
        </div>

        {/* Architecture Image Showcase */}
        <div className="lg:col-span-5 flex justify-center">
          <div className="bg-[#1e1735] p-4 sm:p-6 rounded-3xl border border-pink-500/30 shadow-2xl backdrop-blur-lg hover:border-pink-500/60 transition-all duration-300">
            <div className="flex items-center space-x-2 mb-4 text-xs font-semibold text-pink-400">
              <Cpu className="w-4 h-4" />
              <span>Virtual Memory Paging Diagram</span>
            </div>
            <img
              src="/pageReplacement1.png"
              alt="Paging Architecture Diagram"
              className="rounded-2xl border border-pink-500/20 max-w-full h-auto shadow-lg hover:scale-105 transition-transform duration-300"
            />
          </div>
        </div>
      </header>

      {/* Core OS Concepts Section */}
      <section className="space-y-8">
        <div className="text-center space-y-2">
          <h2 className="text-3xl font-extrabold text-white">Core Memory Management Concepts</h2>
          <p className="text-gray-400 text-sm max-w-xl mx-auto">
            Fundamental building blocks of operating system virtual memory and demand paging architectures.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
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

      {/* Algorithms Overview Section */}
      <section className="space-y-10 text-center">
        <div className="space-y-2">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
            Supported Page Replacement Algorithms
          </h2>
          <p className="text-gray-400 text-sm max-w-xl mx-auto">
            Interactive, step-by-step simulations supported for all 5 classical replacement policies.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
          {algorithms.map((algo) => (
            <AlgorithmCard key={algo.abbr} abbr={algo.abbr} name={algo.name} />
          ))}
        </div>

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

      {/* C++ Implementation Reference Code Section */}
      <section className="space-y-6">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-pink-600/30 border border-pink-500/40 flex items-center justify-center">
            <Code2 className="w-5 h-5 text-pink-400" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white">C++ Source Code Reference</h2>
            <p className="text-xs text-gray-400">Complete C++ implementation of the simulation trace engine</p>
          </div>
        </div>

        <CppCodeViewer />
      </section>
    </div>
  );
};

export default LandingPage;
