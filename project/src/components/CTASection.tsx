import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, CheckCircle } from 'lucide-react';

const CTASection: React.FC = () => {
  return (
    <section id="get-started" className="section relative">
      <div className="absolute inset-0 bg-gradient-to-b from-primary-900/20 to-dark-900 pointer-events-none"></div>
      
      <div className="container-custom relative z-10">
        <motion.div 
          className="glass-card p-8 md:p-12 backdrop-blur-lg border border-primary-500/20 overflow-hidden relative"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
        >
          {/* Decorative elements */}
          <div className="absolute -top-20 -right-20 w-80 h-80 bg-primary-500/20 rounded-full blur-[80px]"></div>
          <div className="absolute bottom-10 -left-20 w-60 h-60 bg-highlight-500/20 rounded-full blur-[60px]"></div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <motion.h2 
                className="mb-6"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
              >
                Take Control of Your <span className="gradient-text">Digital Identity</span>
              </motion.h2>
              <motion.p 
                className="text-lg text-white/80 mb-8"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                viewport={{ once: true }}
              >
                Join thousands of professionals who trust ProofPass to secure and verify their credentials. 
                Start building your blockchain-verified digital identity today.
              </motion.p>
              
              <div className="space-y-4 mb-8">
                {[
                  "Free account setup in under 2 minutes",
                  "10 credential verifications included",
                  "Secure blockchain storage",
                  "Premium features available for professionals"
                ].map((item, index) => (
                  <motion.div 
                    key={index} 
                    className="flex items-start"
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: 0.1 * index }}
                    viewport={{ once: true }}
                  >
                    <CheckCircle className="h-5 w-5 text-accent-400 mt-0.5 mr-3 flex-shrink-0" />
                    <span>{item}</span>
                  </motion.div>
                ))}
              </div>
              
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                viewport={{ once: true }}
              >
                <a href="#" className="btn btn-accent text-base">
                  Create Your Free Account
                  <ArrowRight className="ml-2 h-5 w-5" />
                </a>
                <p className="mt-3 text-white/60 text-sm">No credit card required. Cancel anytime.</p>
              </motion.div>
            </div>
            
            <div className="space-y-6">
              <div className="glass-card p-6 bg-surface-heavy border border-white/5">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-semibold">Personal</h3>
                  <span className="text-accent-400 font-bold">Free</span>
                </div>
                <ul className="space-y-3 mb-6">
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-accent-400 mt-0.5 mr-3 flex-shrink-0" />
                    <span className="text-white/80">Store up to 10 credentials</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-accent-400 mt-0.5 mr-3 flex-shrink-0" />
                    <span className="text-white/80">Basic verification</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-accent-400 mt-0.5 mr-3 flex-shrink-0" />
                    <span className="text-white/80">Share via secure links</span>
                  </li>
                </ul>
                <a href="#" className="btn btn-outline w-full">Get Started</a>
              </div>
              
              <div className="glass-card p-6 bg-surface-heavy border border-primary-500/30 relative overflow-hidden">
                <div className="absolute -top-4 -right-4 w-24 h-24 bg-primary-500/30 rounded-full blur-[30px]"></div>
                <div className="absolute -bottom-10 -right-4 w-24 h-24 bg-highlight-500/20 rounded-full blur-[20px]"></div>
                
                <div className="flex justify-between items-center mb-1">
                  <h3 className="text-xl font-semibold">Professional</h3>
                  <span className="text-accent-400 font-bold">$12 <span className="text-sm font-normal text-white/60">/month</span></span>
                </div>
                <p className="text-white/60 text-sm mb-4">Perfect for professionals and job seekers</p>
                <ul className="space-y-3 mb-6">
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-accent-400 mt-0.5 mr-3 flex-shrink-0" />
                    <span className="text-white/80">Unlimited credentials</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-accent-400 mt-0.5 mr-3 flex-shrink-0" />
                    <span className="text-white/80">Premium blockchain verification</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-accent-400 mt-0.5 mr-3 flex-shrink-0" />
                    <span className="text-white/80">Credential analytics</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-accent-400 mt-0.5 mr-3 flex-shrink-0" />
                    <span className="text-white/80">API access</span>
                  </li>
                </ul>
                <a href="#" className="btn btn-primary w-full">Upgrade Now</a>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default CTASection;