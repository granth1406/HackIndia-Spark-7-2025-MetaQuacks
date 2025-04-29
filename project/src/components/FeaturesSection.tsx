import React from 'react';
import { motion } from 'framer-motion';
import { 
  ShieldCheck, 
  Lock, 
  Database, 
  Share2, 
  Fingerprint,
  Clock,
} from 'lucide-react';
import DigitalVault from './3d/DigitalVault';

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  delay: number;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ icon, title, description, delay }) => {
  return (
    <motion.div 
      className="glass-card p-6 md:p-8"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: delay * 0.1 }}
      viewport={{ once: true }}
      whileHover={{ y: -5, transition: { duration: 0.2 } }}
    >
      <div className="w-12 h-12 rounded-xl bg-surface-heavy flex items-center justify-center mb-4">
        {icon}
      </div>
      <h3 className="text-xl font-semibold mb-3">{title}</h3>
      <p className="text-white/70">{description}</p>
    </motion.div>
  );
};

const FeaturesSection: React.FC = () => {
  const features = [
    {
      icon: <ShieldCheck className="h-6 w-6 text-primary-400" />,
      title: "Tamper-Proof Credentials",
      description: "Credentials are stored on the blockchain, making them impossible to forge or alter without detection."
    },
    {
      icon: <Lock className="h-6 w-6 text-primary-400" />,
      title: "Secure Storage",
      description: "Your credentials are encrypted and securely stored with military-grade security protocols."
    },
    {
      icon: <Database className="h-6 w-6 text-accent-400" />,
      title: "Decentralized Verification",
      description: "Verification happens across a distributed network, eliminating single points of failure."
    },
    {
      icon: <Share2 className="h-6 w-6 text-accent-400" />,
      title: "Selective Disclosure",
      description: "Share only the credentials you choose, maintaining privacy while proving your qualifications."
    },
    {
      icon: <Fingerprint className="h-6 w-6 text-highlight-400" />,
      title: "Biometric Authentication",
      description: "Add an extra layer of security with optional biometric verification for access."
    },
    {
      icon: <Clock className="h-6 w-6 text-highlight-400" />,
      title: "Instant Verification",
      description: "Credentials can be verified in seconds, eliminating lengthy background check processes."
    }
  ];

  return (
    <section id="features" className="section relative">
      <div className="absolute top-0 right-0 w-full h-full bg-radial-gradient pointer-events-none"></div>
      <div className="container-custom relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.h2 
            className="mb-6"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            Secure Your <span className="gradient-text">Digital Identity</span>
          </motion.h2>
          <motion.p 
            className="text-lg text-white/80"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            viewport={{ once: true }}
          >
            ProofPass leverages blockchain technology to create tamper-proof, verifiable credentials
            that you own and control.
          </motion.p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mb-16">
          {features.map((feature, index) => (
            <FeatureCard 
              key={index}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
              delay={index}
            />
          ))}
        </div>
        
        <div className="mt-20 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
            viewport={{ once: true }}
            className="order-2 lg:order-1"
          >
            <h3 className="text-2xl md:text-3xl font-bold mb-6">Your Credentials in a <span className="gradient-text">Secure Digital Vault</span></h3>
            <p className="text-white/80 mb-6">
              ProofPass stores your credentials in a secure digital vault that only you can access.
              Share them securely with employers, educational institutions, or anyone who needs to
              verify your qualifications.
            </p>
            <ul className="space-y-4">
              {[
                "Encrypted storage with zero-knowledge proofs",
                "Multi-factor authentication for maximum security",
                "Granular control over who can access what information",
                "Automated verification without exposing sensitive data"
              ].map((item, index) => (
                <li key={index} className="flex items-start">
                  <div className="mr-3 mt-1 text-accent-400">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <span className="text-white/80">{item}</span>
                </li>
              ))}
            </ul>
          </motion.div>
          
          <div className="order-1 lg:order-2 h-[400px] md:h-[500px]">
            <DigitalVault />
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;