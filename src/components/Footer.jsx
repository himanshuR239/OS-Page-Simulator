// ============================================================
// components/Footer.jsx - App Footer Component
// ============================================================
// Renders the footer bar shown at the bottom of every page.
// Contains:
//   - Project name and tagline (left side)
//   - GitHub repository link (center)
//   - Tech stack credits (right side)
// ============================================================

import React from 'react';
import { Github, Code2, Heart } from 'lucide-react'; // Icon components from the lucide library

// Footer component - No props needed; entirely static content
const Footer = () => {
  return (
    // <footer> semantic HTML tag - gives the browser/screen-readers context that this is a footer
    // Styled with dark background, top border, and padding
    <footer className="bg-[#1a142e] border-t border-pink-500/20 text-gray-400 py-8 mt-auto">
      
      {/* Container: max width + centered horizontally with responsive horizontal padding */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Inner row: stacks vertically on mobile, horizontal on md+ screens */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          
          {/* LEFT SECTION: Project logo icon + name and tagline */}
          <div className="flex items-center space-x-3">
            {/* Small rounded icon box with Code2 icon */}
            <div className="w-8 h-8 rounded-lg bg-pink-600/30 flex items-center justify-center border border-pink-500/30">
              <Code2 className="w-4 h-4 text-pink-400" />
            </div>
            <div>
              {/* Project full name */}
              <p className="text-white font-medium text-sm">
                OS Page Replacement Algorithm Simulator
              </p>
              {/* Short tagline / subtitle */}
              <p className="text-xs text-gray-400">
                Interactive Memory Management Visualization Tool
              </p>
            </div>
          </div>

          {/* CENTER SECTION: GitHub repository link */}
          <div className="flex items-center space-x-6 text-sm text-gray-400">
            <a
              href="https://github.com/himanshuR239/OS-Page-Simulator"
              target="_blank"          // Opens in a new tab
              rel="noopener noreferrer" // Security: prevents the new tab from accessing window.opener
              className="flex items-center gap-2 hover:text-pink-400 transition-colors"
            >
              <Github className="w-4 h-4" />
              <span>GitHub Repository</span>
            </a>
          </div>

          {/* RIGHT SECTION: "Built with ❤ using React, Vite & Tailwind CSS" */}
          <div className="text-xs text-gray-400 flex items-center gap-1">
            <span>Built with</span>
            {/* Heart icon filled with pink color */}
            <Heart className="w-3.5 h-3.5 text-pink-500 fill-pink-500" />
            <span>using React, Vite &amp; Tailwind CSS</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
