import React from 'react';
import { motion } from 'framer-motion';
import NetworkGraph from './3d/NetworkGraph';

interface StepProps {
  number: number;
  title: string;
  description: string;
  delay: number;
}

const Step: React.FC<StepProps> = ({ number, title, description, delay }) => {
  return (
    <motion.div 
      className="flex mb-8 relative"
      initial={{ opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay: delay * 0.1 }}
      viewport={{ once: true }}
    >
      <div className="mr-6 relative">
        <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary-500 text-white font-bold shadow-glow-primary relative z-10">
          {number}
        </div>
        {number < 4 && (
          <div className="absolute top-10 left-5 w-0.5 h-full bg-gradient-to-b from-primary-500 to-transparent z-0"></div>
        )}
      </div>
      
      <div className="glass-card p-6 flex-1">
        <h3 className="text-xl font-semibold mb-2">{title}</h3>
        <p className="text-white/70">{description}</p>
      </div>
    </motion.div>
  );
};

const HowItWorksSection: React.FC = () => {
  const steps = [
    {
      title: "Create Your Account",
      description: "Sign up for ProofPass and set up your secure digital identity with multi-factor authentication."
    },
    {
      title: "Upload Your Credentials",
      description: "Securely upload your diplomas, certificates, licenses, and other credentials to your digital vault."
    },
    {
      title: "Verification Process",
      description: "Our system verifies your credentials with the issuing authorities and creates tamper-proof blockchain records."
    },
    {
      title: "Share With Confidence",
      description: "Control who sees what by generating secure, time-limited links to your verified credentials."
    }
  ];

  return (
    <section id="how-it-works" className="section relative grid-bg">
      <div className="container-custom relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <motion.h2 
              className="mb-6"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              How <span className="gradient-text">ProofPass</span> Works
            </motion.h2>
            <motion.p 
              className="text-lg text-white/80 mb-10"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              viewport={{ once: true }}
            >
              Our decentralized verification system ensures your credentials are secure,
              verifiable, and always under your control.
            </motion.p>
            
            <div>
              {steps.map((step, index) => (
                <Step 
                  key={index}
                  number={index + 1}
                  title={step.title}
                  description={step.description}
                  delay={index}
                />
              ))}
            </div>
          </div>
          
          <div className="h-[500px] lg:h-[600px]">
            <NetworkGraph />
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;