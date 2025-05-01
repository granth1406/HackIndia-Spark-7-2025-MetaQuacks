import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, Lock, Database, Scan, CheckCircle } from 'lucide-react';
import { useWeb3 } from '../contexts/Web3Context';

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const { connect, isConnected } = useWeb3();
  
  const handleGetStarted = async () => {
    if (!isConnected) {
      await connect();
    }
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative pt-20 pb-16 md:pt-32 md:pb-24">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-gradient-radial from-neon-blue/20 to-transparent"></div>
          <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-gradient-radial from-neon-purple/10 to-transparent"></div>
        </div>
        
        <div className="screen-overlay"></div>
        <div className="grain-overlay"></div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-dark-800/80 backdrop-blur-sm border border-dark-700 mb-6">
              <span className="h-2 w-2 rounded-full bg-success-500 mr-2"></span>
              <span className="text-sm font-medium text-gray-300">Decentralized Credential Verification</span>
            </div>
            
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6">
              <span className="bg-gradient-to-r from-neon-blue via-neon-purple to-neon-pink bg-clip-text text-transparent">
                ProofPass
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-300 mb-10 max-w-3xl mx-auto">
              Transform credential verification with 3D holographic cards secured on the blockchain
            </p>
            
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <button 
                onClick={handleGetStarted} 
                className="btn bg-gradient-to-r from-neon-blue to-neon-purple text-dark-900 font-medium hover:shadow-neon transition-all duration-300"
              >
                Get Started
              </button>
              <button 
                onClick={() => navigate('/about')} 
                className="btn btn-ghost"
              >
                Learn More
              </button>
            </div>
          </div>
        </div>
      </section>
      
      {/* Features Section */}
      <section className="py-16 md:py-24 bg-dark-800/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Revolutionizing Verification
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              ProofPass combines cutting-edge blockchain technology with immersive 3D visualization to create a secure, portable credential system.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Feature 1 */}
            <div className="card hover:border-neon-blue/30 hover:shadow-neon transition-all duration-300">
              <Shield className="w-12 h-12 text-neon-blue mb-4" />
              <h3 className="text-xl font-semibold mb-2">Holographic Credentials</h3>
              <p className="text-gray-400">
                Visualize your verified credentials as interactive 3D holographic cards
              </p>
            </div>
            
            {/* Feature 2 */}
            <div className="card hover:border-neon-purple/30 hover:shadow-neon transition-all duration-300">
              <Lock className="w-12 h-12 text-neon-purple mb-4" />
              <h3 className="text-xl font-semibold mb-2">Verifiable Proofs</h3>
              <p className="text-gray-400">
                Connect to real-world sources via Reclaim Protocol to generate cryptographic proofs
              </p>
            </div>
            
            {/* Feature 3 */}
            <div className="card hover:border-neon-pink/30 hover:shadow-neon transition-all duration-300">
              <Database className="w-12 h-12 text-neon-pink mb-4" />
              <h3 className="text-xl font-semibold mb-2">Web3 Integration</h3>
              <p className="text-gray-400">
                Connect MetaMask or any Ethereum-compatible wallet for seamless blockchain interaction
              </p>
            </div>
            
            {/* Feature 4 */}
            <div className="card hover:border-accent-500/30 hover:shadow-neon transition-all duration-300">
              <Scan className="w-12 h-12 text-accent-500 mb-4" />
              <h3 className="text-xl font-semibold mb-2">QR Verification</h3>
              <p className="text-gray-400">
                Scan or generate QR codes for instant credential verification
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Use Cases Section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Use Cases
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              ProofPass transforms verification across multiple industries and use cases.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Use Case 1 */}
            <div className="glass-panel p-6 hover:border-neon-blue/30 hover:shadow-neon transition-all duration-300">
              <h3 className="text-xl font-semibold mb-4">Hiring & Resume Verification</h3>
              <p className="text-gray-400 mb-4">
                Enable instant verification of employment history, education credentials, and certifications for employers and candidates.
              </p>
              <div className="flex items-center text-sm text-neon-blue">
                <CheckCircle className="w-4 h-4 mr-2" />
                <span>Eliminate credential fraud</span>
              </div>
            </div>
            
            {/* Use Case 2 */}
            <div className="glass-panel p-6 hover:border-neon-purple/30 hover:shadow-neon transition-all duration-300">
              <h3 className="text-xl font-semibold mb-4">Event Access Control</h3>
              <p className="text-gray-400 mb-4">
                Create tamper-proof digital passes for conferences, concerts, and exclusive events with QR verification.
              </p>
              <div className="flex items-center text-sm text-neon-purple">
                <CheckCircle className="w-4 h-4 mr-2" />
                <span>Prevent counterfeit tickets</span>
              </div>
            </div>
            
            {/* Use Case 3 */}
            <div className="glass-panel p-6 hover:border-neon-pink/30 hover:shadow-neon transition-all duration-300">
              <h3 className="text-xl font-semibold mb-4">Educational Certificates</h3>
              <p className="text-gray-400 mb-4">
                Issue and verify diplomas, certifications, and course completions with blockchain-backed security.
              </p>
              <div className="flex items-center text-sm text-neon-pink">
                <CheckCircle className="w-4 h-4 mr-2" />
                <span>Lifelong credential access</span>
              </div>
            </div>
            
            {/* Use Case 4 */}
            <div className="glass-panel p-6 hover:border-accent-500/30 hover:shadow-neon transition-all duration-300">
              <h3 className="text-xl font-semibold mb-4">DAO Contributor Proof</h3>
              <p className="text-gray-400 mb-4">
                Validate contributions, governance participation, and reputation in decentralized organizations.
              </p>
              <div className="flex items-center text-sm text-accent-500">
                <CheckCircle className="w-4 h-4 mr-2" />
                <span>Transparent contribution tracking</span>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-16 md:py-24 bg-dark-800/50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Ready to transform credential verification?
            </h2>
            <p className="text-xl text-gray-300 mb-10 max-w-3xl mx-auto">
              Join the decentralized credential revolution today.
            </p>
            
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <button 
                onClick={handleGetStarted} 
                className="btn bg-gradient-to-r from-neon-blue to-neon-purple text-dark-900 font-medium hover:shadow-neon transition-all duration-300"
              >
                Get Started
              </button>
              <button 
                onClick={() => navigate('/about')} 
                className="btn btn-ghost"
              >
                Learn More
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;