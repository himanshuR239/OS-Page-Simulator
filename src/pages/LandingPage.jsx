import React from 'react';
import { PlayCircle, BookOpen, Cpu, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

const LandingPage = () => {
  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <div className="text-center py-12 px-4 bg-gradient-to-b from-[#2d234a]/60 to-transparent rounded-3xl border border-pink-500/20 shadow-2xl">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-pink-600/20 border border-pink-500/30 text-pink-300 text-xs font-semibold mb-6">
          <Sparkles className="w-4 h-4" />
          <span>Interactive Operating Systems Tool</span>
        </div>
        
        <h1 className="text-4xl sm:text-6xl font-extrabold text-white tracking-tight leading-tight max-w-4xl mx-auto">
          Page Replacement Algorithm <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-400">Simulator</span>
        </h1>
        
        <p className="mt-6 text-lg sm:text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed">
          Visualize and understand how FIFO, LRU, Optimal, LFU, and MFU algorithms manage physical memory frames in operating systems.
        </p>

        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <Link
            to="/simulator"
            className="px-8 py-3.5 rounded-xl bg-pink-600 hover:bg-pink-500 text-white font-semibold flex items-center gap-2 shadow-lg shadow-pink-600/40 hover:scale-105 transition-all"
          >
            <PlayCircle className="w-5 h-5" />
            <span>Launch Simulator</span>
          </Link>
          
          <Link
            to="/algorithms"
            className="px-8 py-3.5 rounded-xl bg-[#2d234a] hover:bg-[#392d5c] border border-pink-500/30 text-white font-semibold flex items-center gap-2 hover:scale-105 transition-all"
          >
            <BookOpen className="w-5 h-5" />
            <span>Learn Algorithms</span>
          </Link>
        </div>
      </div>

      {/* Overview Illustration Card */}
      <div className="p-8 bg-[#1e1735] rounded-2xl border border-pink-500/20 shadow-xl text-center space-y-6">
        <h2 className="text-2xl font-bold text-white flex items-center justify-center gap-2">
          <Cpu className="w-6 h-6 text-pink-400" />
          <span>Virtual Memory & Page Replacement</span>
        </h2>
        <div className="flex justify-center">
          <img
            src="/pageReplacement1.png"
            alt="Page Replacement Architecture"
            className="max-w-full h-auto rounded-xl border border-pink-500/30 shadow-lg"
          />
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
