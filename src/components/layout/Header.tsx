import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { Menu, X, FileCheck, Home, QrCode, User, Plus } from 'lucide-react';

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();

  // Listen for scroll events
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  const navItems = [
    { path: '/', label: 'Home', icon: <Home size={20} /> },
    { path: '/dashboard', label: 'My Credentials', icon: <FileCheck size={20} /> },
    { path: '/verify', label: 'Verify', icon: <QrCode size={20} /> },
    { path: '/issue', label: 'Issue', icon: <Plus size={20} /> },
    { path: '/profile', label: 'Profile', icon: <User size={20} /> },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className={`navbar transition-all duration-300 ${isScrolled ? 'shadow-md' : ''}`}>
      <div className="flex items-center">
        <Link to="/" className="flex items-center space-x-2">
          <FileCheck className="h-8 w-8 text-primary-500" />
          <span className="text-xl font-display font-bold text-white">ProofPass</span>
        </Link>
      </div>
      
      {/* Desktop Navigation */}
      <nav className="hidden md:flex items-center space-x-8">
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`flex items-center space-x-1 py-2 px-1 border-b-2 transition-colors ${
              isActive(item.path)
                ? 'border-primary-500 text-primary-400'
                : 'border-transparent text-gray-300 hover:text-white hover:border-gray-500'
            }`}
          >
            {item.icon}
            <span>{item.label}</span>
          </Link>
        ))}
      </nav>
      
      <div className="flex items-center space-x-4">
        <ConnectButton accountStatus="address" chainStatus="icon" showBalance={false} />
        
        {/* Mobile menu button */}
        <button
          onClick={toggleMenu}
          className="md:hidden text-white focus:outline-none"
          aria-label="Toggle menu"
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>
      
      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-dark-surface/95 backdrop-blur-md border-b border-dark-border z-50">
          <nav className="flex flex-col py-4">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center space-x-2 px-6 py-3 ${
                  isActive(item.path)
                    ? 'bg-primary-900/20 text-primary-400'
                    : 'text-gray-300 hover:bg-dark-card hover:text-white'
                }`}
                onClick={closeMenu}
              >
                {item.icon}
                <span>{item.label}</span>
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;