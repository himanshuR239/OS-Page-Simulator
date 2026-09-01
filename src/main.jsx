// ============================================================
// main.jsx - Application Entry Point
// ============================================================
// This is the very first file that runs when the app starts.
// It mounts the React application into the HTML element
// with id="root" (defined in index.html).
// ============================================================

import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom'; // Enables client-side routing (URL changes without full page reload)
import App from './App.jsx';  // Root component that holds all pages
import './index.css';         // Global CSS styles applied across the whole app

// ReactDOM.createRoot - Creates a React root attached to the <div id="root"> in index.html
// .render() - Renders the entire React component tree inside that root
ReactDOM.createRoot(document.getElementById('root')).render(
  // React.StrictMode - Development helper that warns about potential problems in the app
  // It does NOT affect production; it only runs extra checks during development
  <React.StrictMode>
    {/* BrowserRouter - Wraps the whole app so any component can use routing (useNavigate, Link, etc.) */}
    <BrowserRouter>
      {/* App is the root component - everything else is rendered inside it */}
      <App />
    </BrowserRouter>
  </React.StrictMode>
);
