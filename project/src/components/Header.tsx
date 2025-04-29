import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Menu, X, ShieldCheck } from 'lucide-react';

const Header: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const navVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? 'py-3 backdrop-blur-lg bg-dark-900/80 shadow-lg' 
          : 'py-5 bg-transparent'
      }`}
    >
      <div className="container-custom">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <ShieldCheck className="h-8 w-8 text-primary-500 mr-2" />
            <span className="text-2xl font-display font-bold">ProofPass</span>
          </div>

          {/* Desktop Navigation */}
          <motion.nav 
            className="hidden md:flex items-center space-x-8"
            variants={navVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.a href="#features" className="text-white/80 hover:text-white transition-colors" variants={itemVariants}>Features</motion.a>
            <motion.a href="#how-it-works" className="text-white/80 hover:text-white transition-colors" variants={itemVariants}>How It Works</motion.a>
            <motion.a href="#testimonials" className="text-white/80 hover:text-white transition-colors" variants={itemVariants}>Testimonials</motion.a>
            <motion.div variants={itemVariants}>
              <a href="#get-started" className="btn btn-primary ml-4">Get Started</a>
            </motion.div>
          </motion.nav>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              className="text-white focus:outline-none"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <motion.div 
        className={`md:hidden ${isMenuOpen ? 'block' : 'hidden'}`}
        initial={{ height: 0, opacity: 0 }}
        animate={isMenuOpen ? { height: 'auto', opacity: 1 } : { height: 0, opacity: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="container-custom py-4 glass-card mt-2 flex flex-col space-y-4">
          <a 
            href="#features" 
            className="px-4 py-2 text-white/80 hover:text-white hover:bg-surface-heavy rounded-lg transition-colors"
            onClick={() => setIsMenuOpen(false)}
          >
            Features
          </a>
          <a 
            href="#how-it-works" 
            className="px-4 py-2 text-white/80 hover:text-white hover:bg-surface-heavy rounded-lg transition-colors"
            onClick={() => setIsMenuOpen(false)}
          >
            How It Works
          </a>
          <a 
            href="#testimonials" 
            className="px-4 py-2 text-white/80 hover:text-white hover:bg-surface-heavy rounded-lg transition-colors"
            onClick={() => setIsMenuOpen(false)}
          >
            Testimonials
          </a>
          <a 
            href="#get-started" 
            className="btn btn-primary"
            onClick={() => setIsMenuOpen(false)}
          >
            Get Started
          </a>
        </div>
      </motion.div>
    </header>
  );
};

export default Header;