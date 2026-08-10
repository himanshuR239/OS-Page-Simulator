import React from 'react';
import { BookOpen } from 'lucide-react';

const AlgorithmsPage = () => {
  return (
    <div className="py-8 space-y-6">
      <div className="flex items-center space-x-3">
        <BookOpen className="w-8 h-8 text-pink-500" />
        <h1 className="text-3xl font-bold text-white">Algorithm Documentation</h1>
      </div>
      <p className="text-gray-400">
        Phase 1 Foundation Ready: Explore theoretical concepts, formulas, and visual diagrams for FIFO, LRU, Optimal, LFU, and MFU algorithms.
      </p>
    </div>
  );
};

export default AlgorithmsPage;
