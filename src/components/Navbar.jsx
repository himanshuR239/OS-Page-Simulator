// ============================================================
// components/Navbar.jsx - Navigation Bar Component
// ============================================================
// Renders the sticky top navigation bar shown on every page.
// Features:
//   - Brand logo + app name on the left
//   - Desktop navigation links (Home, Simulator, Algorithms)
//   - A hamburger menu button for mobile screens
//   - A dropdown menu that slides in on mobile when hamburger is clicked
// ============================================================

import React, { useState } from 'react';
import { NavLink, Link } from 'react-router-dom'; // NavLink = knows if it's the active route; Link = regular routing link
import { Cpu, Menu, X, BookOpen, PlayCircle, Home } from 'lucide-react'; // Icons from lucide-react

const Navbar = () => {
  // isOpen - State that tracks whether the mobile menu drawer is open or closed
  // false = menu hidden (default), true = menu visible
  const [isOpen, setIsOpen] = useState(false);

  // navLinkClasses - A function that returns the correct CSS class string for a NavLink
  // React Router calls this function and passes { isActive: true/false } automatically
  // isActive is true when the link's URL matches the current page URL
  const navLinkClasses = ({ isActive }) =>
    `px-4 py-2 rounded-lg font-medium transition-all duration-200 flex items-center gap-2 ${
      isActive
        ? 'bg-pink-600 text-white shadow-lg shadow-pink-600/30'   // Active link: pink background
        : 'text-gray-300 hover:bg-pink-600/20 hover:text-white'   // Inactive link: gray, hover highlights
    }`;

  return (
    // <nav> semantic HTML tag - sticky (stays at top while scrolling), high z-index (stays above other elements)
    <nav className="bg-[#2d234a] border-b border-pink-500/20 sticky top-0 z-50 shadow-xl backdrop-blur-md">
      
      {/* Centered container with responsive horizontal padding */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main navbar row: logo on left, nav links on right, fixed height of 64px (h-16) */}
        <div className="flex items-center justify-between h-16">
          
          {/* BRAND LOGO - Clicking it navigates to the home page "/" */}
          {/* 'group' enables the group-hover utility on child elements */}
          <Link to="/" className="flex items-center space-x-3 group">
            {/* Logo icon box: scales up slightly on hover */}
            <div className="w-10 h-10 rounded-xl bg-pink-600 flex items-center justify-center shadow-lg shadow-pink-600/40 group-hover:scale-105 transition-transform duration-200">
              <img src="/logo1.png" alt="Logo" className="w-7 h-7 object-contain" />
            </div>
            <div>
              {/* Main app name - turns pink on hover */}
              <span className="font-bold text-lg text-white tracking-wide group-hover:text-pink-400 transition-colors">
                OS Simulator
              </span>
              {/* Subtitle shown only on sm+ screen sizes */}
              <span className="hidden sm:inline-block text-xs block text-pink-400 font-mono">
                Page Replacement
              </span>
            </div>
          </Link>

          {/* DESKTOP NAVIGATION LINKS - hidden on mobile (hidden md:flex) */}
          <div className="hidden md:flex items-center space-x-2">
            {/* Home link - "end" prop means it only matches exactly "/" not "/simulator" etc. */}
            <NavLink to="/" className={navLinkClasses} end>
              <Home className="w-4 h-4" />
              <span>Home</span>
            </NavLink>

            {/* Simulator page link */}
            <NavLink to="/simulator" className={navLinkClasses}>
              <PlayCircle className="w-4 h-4" />
              <span>Simulator</span>
            </NavLink>

            {/* Algorithms theory page link */}
            <NavLink to="/algorithms" className={navLinkClasses}>
              <BookOpen className="w-4 h-4" />
              <span>Algorithms</span>
            </NavLink>
          </div>

          {/* MOBILE HAMBURGER BUTTON - only visible on mobile (md:hidden) */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)} // Toggle the mobile menu open/closed
              className="p-2 rounded-lg text-gray-300 hover:text-white hover:bg-pink-600/20 focus:outline-none"
            >
              {/* Show X (close) icon when menu is open, Menu (hamburger) icon when closed */}
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* MOBILE DROPDOWN MENU - only renders when isOpen is true */}
      {/* Conditionally rendered: {isOpen && <div>...} = shows only when isOpen is true */}
      {isOpen && (
        <div className="md:hidden bg-[#241a3d] border-b border-pink-500/20 px-4 pt-2 pb-4 space-y-2">
          
          {/* Each NavLink closes the menu when clicked (setIsOpen(false)) */}
          <NavLink
            to="/"
            onClick={() => setIsOpen(false)} // Close drawer after navigating
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
