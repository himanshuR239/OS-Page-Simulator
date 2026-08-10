import React from 'react';
import { PlayCircle } from 'lucide-react';

const SimulatorPage = () => {
  return (
    <div className="py-8 space-y-6">
      <div className="flex items-center space-x-3">
        <PlayCircle className="w-8 h-8 text-pink-500" />
        <h1 className="text-3xl font-bold text-white">Page Replacement Simulator</h1>
      </div>
      <p className="text-gray-400">
        Phase 1 Foundation Ready: Configure reference sequence and memory frames to execute algorithm simulations.
      </p>
    </div>
  );
};

export default SimulatorPage;
