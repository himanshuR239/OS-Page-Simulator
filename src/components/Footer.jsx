import React from 'react';
import { Github, Code2, Heart } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-[#1a142e] border-t border-pink-500/20 text-gray-400 py-8 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-lg bg-pink-600/30 flex items-center justify-center border border-pink-500/30">
              <Code2 className="w-4 h-4 text-pink-400" />
            </div>
            <div>
              <p className="text-white font-medium text-sm">
                OS Page Replacement Algorithm Simulator
              </p>
              <p className="text-xs text-gray-400">
                Interactive Memory Management Visualization Tool
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-6 text-sm text-gray-400">
            <a
              href="https://github.com/himanshuR239/OS-Page-Simulator"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 hover:text-pink-400 transition-colors"
            >
              <Github className="w-4 h-4" />
              <span>GitHub Repository</span>
            </a>
          </div>

          <div className="text-xs text-gray-400 flex items-center gap-1">
            <span>Built with</span>
            <Heart className="w-3.5 h-3.5 text-pink-500 fill-pink-500" />
            <span>using React, Vite & Tailwind CSS</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
