import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { ethers } from 'ethers';
import { Web3State } from '../types';

const initialState: Web3State = {
  isConnected: false,
  address: null,
  chainId: null,
  provider: null,
  connect: async () => {},
  disconnect: () => {},
};

const Web3Context = createContext<Web3State>(initialState);

export const useWeb3 = () => useContext(Web3Context);

interface Web3ProviderProps {
  children: ReactNode;
}

export const Web3Provider: React.FC<Web3ProviderProps> = ({ children }) => {
  const [isConnected, setIsConnected] = useState(false);
  const [address, setAddress] = useState<string | null>(null);
  const [chainId, setChainId] = useState<number | null>(null);
  const [provider, setProvider] = useState<any | null>(null);

  // Check if MetaMask is installed
  const isMetaMaskInstalled = () => {
    return typeof window !== 'undefined' && window.ethereum !== undefined;
  };

  // Initialize provider and listen for account changes
  useEffect(() => {
    if (!isMetaMaskInstalled()) return;

    const ethereum = window.ethereum;
    const ethersProvider = new ethers.BrowserProvider(ethereum);
    setProvider(ethersProvider);

    // Check if already connected
    const checkConnection = async () => {
      try {
        const accounts = await ethereum.request({ method: 'eth_accounts' });
        if (accounts.length > 0) {
          setAddress(accounts[0]);
          setIsConnected(true);
          
          const network = await ethersProvider.getNetwork();
          setChainId(Number(network.chainId));
        }
      } catch (error) {
        console.error('Error checking connection:', error);
      }
    };

    checkConnection();

    // Listen for account changes
    const handleAccountsChanged = (accounts: string[]) => {
      if (accounts.length === 0) {
        // User disconnected
        setIsConnected(false);
        setAddress(null);
      } else {
        // Account changed
        setAddress(accounts[0]);
        setIsConnected(true);
      }
    };

    // Listen for chain changes
    const handleChainChanged = (chainIdHex: string) => {
      setChainId(parseInt(chainIdHex, 16));
    };

    ethereum.on('accountsChanged', handleAccountsChanged);
    ethereum.on('chainChanged', handleChainChanged);

    return () => {
      ethereum.removeListener('accountsChanged', handleAccountsChanged);
      ethereum.removeListener('chainChanged', handleChainChanged);
    };
  }, []);

  // Connect wallet
  const connect = async () => {
    if (!isMetaMaskInstalled()) {
      window.open('https://metamask.io/download/', '_blank');
      return;
    }

    try {
      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts',
      });
      
      setAddress(accounts[0]);
      setIsConnected(true);
      
      const network = await provider.getNetwork();
      setChainId(Number(network.chainId));
    } catch (error) {
      console.error('Error connecting wallet:', error);
    }
  };

  // Disconnect wallet (for UI purposes only)
  const disconnect = () => {
    setIsConnected(false);
    setAddress(null);
    setChainId(null);
  };

  const value = {
    isConnected,
    address,
    chainId,
    provider,
    connect,
    disconnect,
  };

  return <Web3Context.Provider value={value}>{children}</Web3Context.Provider>;
};