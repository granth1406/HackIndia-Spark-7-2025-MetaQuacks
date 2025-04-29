import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import CredentialCard from './3d/CredentialCard';

const HeroSection: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <section className="relative pt-32 pb-20 md:pt-40 md:pb-32 overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-6xl">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-primary-500/20 rounded-full blur-[100px]"></div>
        <div className="absolute top-2/3 right-1/4 w-64 h-64 bg-highlight-500/20 rounded-full blur-[80px]"></div>
        <div className="absolute bottom-1/4 left-1/4 w-80 h-80 bg-accent-500/20 rounded-full blur-[90px]"></div>
      </div>
      
      <div className="container-custom relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center" ref={containerRef}>
        <div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="mb-6">
              <span className="gradient-text">Secure</span> Your Digital Identity with Blockchain Credentials
            </h1>
            <p className="text-lg md:text-xl text-white/80 mb-8 max-w-xl">
              ProofPass creates tamper-proof, verifiable credentials using blockchain technology. 
              Own your data, prove your credentials, and control your digital identity.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <a href="#get-started" className="btn btn-primary">
                Get Started
                <ArrowRight className="ml-2 h-5 w-5" />
              </a>
              <a href="#how-it-works" className="btn btn-outline">
                How It Works
              </a>
            </div>
            
            <div className="mt-12 flex items-center space-x-6">
              <div className="flex -space-x-2">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="w-10 h-10 rounded-full border-2 border-white bg-surface-medium overflow-hidden">
                    <img 
                      src={`https://i.pravatar.cc/100?img=${i + 10}`} 
                      alt="User" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
              <div className="text-sm">
                <p className="font-semibold">Trusted by 10,000+ users</p>
                <div className="flex items-center mt-1">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <svg key={i} className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                  <span className="ml-1 text-white/80">4.9/5</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
        
        <div className="relative flex justify-center lg:justify-end">
          <div className="w-full max-w-md h-[500px] relative">
            <CredentialCard />
          </div>
        </div>
      </div>
      
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-dark-900 to-transparent"></div>
    </section>
  );
};

export default HeroSection;