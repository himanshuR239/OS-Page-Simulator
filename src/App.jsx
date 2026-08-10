import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import LandingPage from './pages/LandingPage';
import SimulatorPage from './pages/SimulatorPage';
import AlgorithmsPage from './pages/AlgorithmsPage';

function App() {
  return (
    <div className="min-h-screen bg-[#121212] text-white flex flex-col font-sans">
      <Navbar />
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/simulator" element={<SimulatorPage />} />
          <Route path="/algorithms" element={<AlgorithmsPage />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;
