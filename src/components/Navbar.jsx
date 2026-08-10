import React, { useState } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { Cpu, Menu, X, BookOpen, PlayCircle, Home } from 'lucide-react';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const navLinkClasses = ({ isActive }) =>
    `px-4 py-2 rounded-lg font-medium transition-all duration-200 flex items-center gap-2 ${
      isActive
        ? 'bg-pink-600 text-white shadow-lg shadow-pink-600/30'
        : 'text-gray-300 hover:bg-pink-600/20 hover:text-white'
    }`;

  return (
    <nav className="bg-[#2d234a] border-b border-pink-500/20 sticky top-0 z-50 shadow-xl backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo */}
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="w-10 h-10 rounded-xl bg-pink-600 flex items-center justify-center shadow-lg shadow-pink-600/40 group-hover:scale-105 transition-transform duration-200">
              <img src="/logo1.png" alt="Logo" className="w-7 h-7 object-contain" />
            </div>
            <div>
              <span className="font-bold text-lg text-white tracking-wide group-hover:text-pink-400 transition-colors">
                OS Simulator
              </span>
              <span className="hidden sm:inline-block text-xs block text-pink-400 font-mono">
                Page Replacement
              </span>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center space-x-2">
            <NavLink to="/" className={navLinkClasses} end>
              <Home className="w-4 h-4" />
              <span>Home</span>
            </NavLink>

            <NavLink to="/simulator" className={navLinkClasses}>
              <PlayCircle className="w-4 h-4" />
              <span>Simulator</span>
            </NavLink>

            <NavLink to="/algorithms" className={navLinkClasses}>
              <BookOpen className="w-4 h-4" />
              <span>Algorithms</span>
            </NavLink>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-lg text-gray-300 hover:text-white hover:bg-pink-600/20 focus:outline-none"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {isOpen && (
        <div className="md:hidden bg-[#241a3d] border-b border-pink-500/20 px-4 pt-2 pb-4 space-y-2">
          <NavLink
            to="/"
            onClick={() => setIsOpen(false)}
            className={navLinkClasses}
            end
          >
            <Home className="w-4 h-4" />
            <span>Home</span>
          </NavLink>
          <NavLink
            to="/simulator"
            onClick={() => setIsOpen(false)}
            className={navLinkClasses}
          >
            <PlayCircle className="w-4 h-4" />
            <span>Simulator</span>
          </NavLink>
          <NavLink
            to="/algorithms"
            onClick={() => setIsOpen(false)}
            className={navLinkClasses}
          >
            <BookOpen className="w-4 h-4" />
            <span>Algorithms</span>
          </NavLink>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
