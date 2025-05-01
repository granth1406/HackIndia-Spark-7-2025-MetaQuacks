import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Web3Provider } from './contexts/Web3Context';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import HomePage from './pages/HomePage';
import DashboardPage from './pages/DashboardPage';
import VerifyPage from './pages/VerifyPage';
import AboutPage from './pages/AboutPage';
import CredentialsPage from './pages/CredentialsPage';

function App() {
  return (
    <Web3Provider>
      <Router>
        <div className="flex flex-col min-h-screen">
          <Navbar />
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/credentials" element={<CredentialsPage />} />
              <Route path="/verify" element={<VerifyPage />} />
              <Route path="/about" element={<AboutPage />} />
            </Routes>
          </main>
          <Footer />
          
          {/* Screen and Grain overlays for cyberpunk effect */}
          <div className="screen-overlay"></div>
          <div className="grain-overlay"></div>
        </div>
      </Router>
    </Web3Provider>
  );
}

export default App;