import React, { useState } from 'react';
import { useWeb3 } from '../../contexts/Web3Context';
import { Wallet, LogOut, ChevronDown, ChevronsUpDown } from 'lucide-react';

const ConnectWalletButton: React.FC = () => {
  const { isConnected, address, connect, disconnect } = useWeb3();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleConnect = async () => {
    await connect();
  };

  const handleDisconnect = () => {
    disconnect();
    setIsDropdownOpen(false);
  };

  const formatAddress = (address: string) => {
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
  };

  if (!isConnected) {
    return (
      <button
        onClick={handleConnect}
        className="btn bg-gradient-to-r from-neon-blue to-neon-purple text-dark-900 font-medium hover:shadow-neon transition-all duration-300"
      >
        <Wallet className="w-4 h-4 mr-2" />
        Connect Wallet
      </button>
    );
  }

  return (
    <div className="relative">
      <button
        onClick={toggleDropdown}
        className="flex items-center space-x-2 px-4 py-2 text-sm rounded-lg bg-dark-800 border border-dark-700 hover:bg-dark-700 transition-colors"
      >
        <span className="h-2 w-2 rounded-full bg-success-500 animate-pulse"></span>
        <span>{address ? formatAddress(address) : 'Connected'}</span>
        <ChevronsUpDown className="h-4 w-4 text-gray-400" />
      </button>

      {isDropdownOpen && (
        <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-dark-800 border border-dark-700 ring-1 ring-black ring-opacity-5 z-10">
          <button
            onClick={handleDisconnect}
            className="block w-full text-left px-4 py-2 text-sm text-white hover:bg-dark-700"
          >
            <div className="flex items-center">
              <LogOut className="h-4 w-4 mr-2" />
              Disconnect
            </div>
          </button>
        </div>
      )}
    </div>
  );
};

export default ConnectWalletButton;