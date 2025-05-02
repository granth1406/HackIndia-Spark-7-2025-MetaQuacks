import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { WagmiConfig } from 'wagmi';
import { RainbowKitProvider } from '@rainbow-me/rainbowkit';
import '@rainbow-me/rainbowkit/styles.css';

import { wagmiConfig, chains } from './lib/wagmi';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import HomePage from './pages/HomePage';
import DashboardPage from './pages/DashboardPage';
import VerifyPage from './pages/VerifyPage';
import IssuePage from './pages/IssuePage';
import ProfilePage from './pages/ProfilePage';
import BackgroundScene from './components/three/BackgroundScene';
import { Web3StorageProvider } from './contexts/Web3StorageContext';

function App() {
  return (
    <WagmiConfig config={wagmiConfig}>
      <RainbowKitProvider chains={chains}>
        <Web3StorageProvider>
          <Router>
            <div className="flex flex-col min-h-screen">
              <BackgroundScene />
              <Header />
              <main className="flex-grow">
                <Routes>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/dashboard" element={<DashboardPage />} />
                  <Route path="/verify" element={<VerifyPage />} />
                  <Route path="/issue" element={<IssuePage />} />
                  <Route path="/profile" element={<ProfilePage />} />
                </Routes>
              </main>
              <Footer />
            </div>
          </Router>
        </Web3StorageProvider>
      </RainbowKitProvider>
    </WagmiConfig>
  );
}

export default App;