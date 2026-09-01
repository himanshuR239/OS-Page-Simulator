// ============================================================
// App.jsx - Root Application Component
// ============================================================
// This component acts as the layout shell for the entire app.
// It renders the Navbar at the top, the Footer at the bottom,
// and uses React Router's <Routes> to decide which page to
// display in the middle based on the current URL path.
// ============================================================

import React from 'react';
import { Routes, Route } from 'react-router-dom'; // Routes = container for all routes; Route = a single route definition
import Navbar from './components/Navbar';          // Top navigation bar shown on every page
import Footer from './components/Footer';          // Bottom footer shown on every page
import LandingPage from './pages/LandingPage';     // Home page ("/")
import SimulatorPage from './pages/SimulatorPage'; // Simulator page ("/simulator")
import AlgorithmsPage from './pages/AlgorithmsPage'; // Algorithms theory page ("/algorithms")

function App() {
  return (
    // Outer wrapper: full-screen dark background, white text, vertical flex layout
    <div className="min-h-screen bg-[#121212] text-white flex flex-col font-sans">
      
      {/* Navbar - always visible at the top, sticky, contains links to all pages */}
      <Navbar />

      {/* Main content area - grows to fill available vertical space between Navbar and Footer */}
      {/* max-w-7xl + mx-auto = centered, with horizontal padding for responsive layout */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Routes - checks the current URL and renders the matching page component */}
        <Routes>
          {/* "/" → Home / Landing page */}
          <Route path="/" element={<LandingPage />} />
          
          {/* "/simulator" → Interactive simulation page */}
          <Route path="/simulator" element={<SimulatorPage />} />
          
          {/* "/algorithms" → Educational page explaining all algorithms */}
          <Route path="/algorithms" element={<AlgorithmsPage />} />
        </Routes>
      </main>

      {/* Footer - always visible at the bottom with credits and links */}
      <Footer />
    </div>
  );
}

export default App;
