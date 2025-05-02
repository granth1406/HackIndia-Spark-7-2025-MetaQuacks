import React from 'react';
import { Shield, Users, Lock, Cpu, Code, Globe } from 'lucide-react';

const AboutPage: React.FC = () => {
  return (
    <div className="min-h-screen pt-20 pb-12">
      <div className="container mx-auto px-4">
        {/* Hero Section */}
        <div className="max-w-4xl mx-auto text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            About <span className="bg-gradient-to-r from-neon-blue to-neon-purple bg-clip-text text-transparent">ProofPass</span>
          </h1>
          <p className="text-xl text-gray-300">
            Revolutionizing credential verification through blockchain technology and immersive 3D visualization
          </p>
        </div>

        {/* Mission Section */}
        <div className="glass-panel p-8 mb-16">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl font-bold mb-6">Our Mission</h2>
            <p className="text-gray-300 mb-6">
              ProofPass aims to transform how credentials are verified, stored, and shared in the digital age. By combining blockchain technology with immersive 3D visualization, we're creating a more secure, transparent, and user-centric credential ecosystem.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex items-start">
                <Lock className="w-6 h-6 text-neon-blue mr-4 mt-1" />
                <div>
                  <h3 className="font-semibold mb-2">Security First</h3>
                  <p className="text-gray-400">
                    Blockchain-powered verification ensures tamper-proof credential storage and sharing
                  </p>
                </div>
              </div>
              <div className="flex items-start">
                <Users className="w-6 h-6 text-neon-purple mr-4 mt-1" />
                <div>
                  <h3 className="font-semibold mb-2">User Control</h3>
                  <p className="text-gray-400">
                    Full ownership and control over your credentials and how they're shared
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Technology Stack */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold mb-8 text-center">Technology Stack</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="glass-panel p-6 hover:border-neon-blue/30 hover:shadow-neon transition-all duration-300">
              <Cpu className="w-10 h-10 text-neon-blue mb-4" />
              <h3 className="text-xl font-semibold mb-2">Blockchain Core</h3>
              <p className="text-gray-400">
                Built on Ethereum for secure, decentralized credential verification
              </p>
            </div>
            <div className="glass-panel p-6 hover:border-neon-purple/30 hover:shadow-neon transition-all duration-300">
              <Code className="w-10 h-10 text-neon-purple mb-4" />
              <h3 className="text-xl font-semibold mb-2">Modern Frontend</h3>
              <p className="text-gray-400">
                React with Three.js for immersive 3D credential visualization
              </p>
            </div>
            <div className="glass-panel p-6 hover:border-neon-pink/30 hover:shadow-neon transition-all duration-300">
              <Globe className="w-10 h-10 text-neon-pink mb-4" />
              <h3 className="text-xl font-semibold mb-2">Global Network</h3>
              <p className="text-gray-400">
                Decentralized infrastructure for worldwide credential verification
              </p>
            </div>
          </div>
        </div>

        {/* Team Section */}
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold mb-8 text-center">Our Team</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="glass-panel p-6 text-center">
              <div className="w-24 h-24 rounded-full bg-gradient-to-r from-neon-blue to-neon-purple mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-1">Granth</h3>
              <p className="text-gray-400 text-sm mb-3">Blockchain Developer</p>
              
            </div>
            <div className="glass-panel p-6 text-center">
              <div className="w-24 h-24 rounded-full bg-gradient-to-r from-neon-blue to-neon-purple mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-1">Vanshika</h3>
              <p className="text-gray-400 text-sm mb-3">Frontend Developer</p>
              
            </div>
            <div className="glass-panel p-6 text-center">
              <div className="w-24 h-24 rounded-full bg-gradient-to-r from-neon-blue to-neon-purple mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-1">Pratham</h3>
              <p className="text-gray-400 text-sm mb-3">Backend Developer</p>
              
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;