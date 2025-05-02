import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, FileCheck, QrCode, Shield, Lock, Globe, Server, Layers } from 'lucide-react';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import CredentialsScene from '../components/three/CredentialsScene';

const DEMO_CREDENTIALS = [
  { id: '1', title: 'University Degree', issuer: 'MIT University', color: '#4f46e5' },
  { id: '2', title: 'Professional Certificate', issuer: 'Google', color: '#0891b2' },
  { id: '3', title: 'Event Pass', issuer: 'ETH Global', color: '#a855f7' },
  { id: '4', title: 'Contributor Badge', issuer: 'GitHub', color: '#10b981' },
];

const HomePage: React.FC = () => {
  const [selectedCredential, setSelectedCredential] = useState<typeof DEMO_CREDENTIALS[0] | null>(null);

  return (
    <div>
      {/* Hero Section */}
      <section className="py-16 md:py-32 relative overflow-hidden">
        <div className="container mx-auto px-4 md:px-8 relative z-10">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold mb-6 bg-gradient-to-r from-primary-400 to-accent-400 text-transparent bg-clip-text">
              Decentralized Credential Verification in 3D
            </h1>
            <p className="text-lg md:text-xl text-gray-300 mb-8">
              ProofPass transforms your credentials into interactive 3D holograms, 
              secured by blockchain technology and verifiable anywhere.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/dashboard" className="btn btn-primary text-lg px-8 py-3">
                Get Started
              </Link>
              <ConnectButton accountStatus="address" chainStatus="none" showBalance={false} />
            </div>
          </div>
          
          <div className="mt-16 relative">
            <CredentialsScene 
              credentials={DEMO_CREDENTIALS}
              onSelectCredential={setSelectedCredential}
            />
            
            {selectedCredential && (
              <div className="absolute bottom-4 left-0 right-0 mx-auto max-w-md bg-dark-surface/90 backdrop-blur-sm p-4 rounded-xl border border-dark-border">
                <h3 className="text-lg font-semibold">{selectedCredential.title}</h3>
                <p className="text-gray-300">Issued by: {selectedCredential.issuer}</p>
              </div>
            )}
          </div>
        </div>
      </section>
      
      {/* Features Section */}
      <section className="py-16 bg-dark-surface">
        <div className="container mx-auto px-4 md:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">Core Features</h2>
            <p className="text-gray-300 max-w-2xl mx-auto">
              ProofPass combines cutting-edge technology to create a secure, 
              decentralized credential verification system with stunning visualizations.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: <Shield className="w-10 h-10 text-primary-500" />,
                title: '3D Credential Holograms',
                description: 'Visualize your verified credentials as stunning 3D holographic cards that can be rotated and viewed from any angle.'
              },
              {
                icon: <Lock className="w-10 h-10 text-secondary-500" />,
                title: 'Blockchain Security',
                description: 'All credentials are secured using blockchain technology, making them tamper-proof and permanently verifiable.'
              },
              {
                icon: <QrCode className="w-10 h-10 text-accent-500" />,
                title: 'QR Verification',
                description: 'Scan a QR code to instantly verify credentials, perfect for events, hiring, or identity validation.'
              },
              {
                icon: <Server className="w-10 h-10 text-success-500" />,
                title: 'Decentralized Storage',
                description: 'Credential documents are stored on IPFS, ensuring they remain accessible and cannot be altered.'
              },
              {
                icon: <Globe className="w-10 h-10 text-warning-500" />,
                title: 'Reclaim Protocol Integration',
                description: 'Connect to real-world sources to fetch and verify claims without compromising privacy.'
              },
              {
                icon: <Layers className="w-10 h-10 text-error-500" />,
                title: 'Multi-Chain Support',
                description: 'ProofPass works across multiple blockchain networks, giving you flexibility and future-proofing.'
              }
            ].map((feature, index) => (
              <div key={index} className="glass-panel p-6 group">
                <div className="card-highlight"></div>
                <div className="mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-300">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Use Cases Section */}
      <section className="py-16">
        <div className="container mx-auto px-4 md:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">Use Cases</h2>
            <p className="text-gray-300 max-w-2xl mx-auto">
              ProofPass can revolutionize how credentials are verified across multiple industries and contexts.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              {
                title: 'Education & Academia',
                description: 'Universities and educational institutions can issue tamper-proof degrees, certificates, and academic credentials that can be instantly verified worldwide.',
                link: '/use-cases/education'
              },
              {
                title: 'Professional Licensing',
                description: 'Professional bodies can issue licenses and certifications that are always up-to-date and can be verified immediately by employers or clients.',
                link: '/use-cases/licensing'
              },
              {
                title: 'Event Management',
                description: 'Create secure, non-transferable event passes and tickets that can be verified with a quick QR scan, eliminating fraud and unauthorized access.',
                link: '/use-cases/events'
              },
              {
                title: 'Corporate Identity',
                description: 'Companies can issue verifiable employee credentials that prove employment status while maintaining privacy and security.',
                link: '/use-cases/corporate'
              }
            ].map((useCase, index) => (
              <div key={index} className="glass-panel p-6 group">
                <div className="card-highlight"></div>
                <h3 className="text-xl font-semibold mb-2">{useCase.title}</h3>
                <p className="text-gray-300 mb-4">{useCase.description}</p>
                <Link to={useCase.link} className="text-primary-400 hover:text-primary-300 inline-flex items-center">
                  Learn more <ChevronRight size={16} className="ml-1" />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-primary-900 to-secondary-900">
        <div className="container mx-auto px-4 md:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-display font-bold mb-6">
            Ready to Transform Your Credentials?
          </h2>
          <p className="text-lg text-gray-200 mb-8 max-w-2xl mx-auto">
            Join the decentralized credential revolution today. Start issuing, sharing, 
            and verifying credentials in a secure, immutable, and visually stunning way.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/dashboard" className="btn bg-white text-primary-900 hover:bg-gray-100 text-lg px-8 py-3">
              Get Started
            </Link>
            <Link to="/verify" className="btn btn-outline border-white text-white hover:bg-white/10 text-lg px-8 py-3">
              Verify a Credential
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;