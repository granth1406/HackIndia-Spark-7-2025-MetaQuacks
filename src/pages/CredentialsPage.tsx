import React, { useState, useEffect } from 'react';
import { Plus, Filter, Search, ArrowUpDown } from 'lucide-react';
import CredentialCard from '../components/credentials/CredentialCard';
import { Credential, CredentialStatus, CredentialType } from '../types';
import { useWeb3 } from '../contexts/Web3Context';
import { blockchainVerificationService } from '../services/BlockchainVerificationService';

const CredentialsPage: React.FC = () => {
  const [credentials, setCredentials] = useState<Credential[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<CredentialType | 'all'>('all');
  const [selectedStatus, setSelectedStatus] = useState<CredentialStatus | 'all'>('all');
  const { isConnected, connect } = useWeb3();

  // Add a second useEffect to force refresh when localStorage changes
  useEffect(() => {
    const loadCredentials = () => {
      try {
        const savedCredentials = JSON.parse(localStorage.getItem('credentials') || '[]');
        setCredentials(savedCredentials);
      } catch (error) {
        console.error('Error loading credentials from localStorage:', error);
        setCredentials([]);
      }
    };

    // Load credentials initially
    loadCredentials();

    // Set up event listener for storage changes
    window.addEventListener('storage', loadCredentials);

    // Clean up event listener
    return () => {
      window.removeEventListener('storage', loadCredentials);
    };
  }, []);

  const handleAddCredential = async () => {
    if (!isConnected) {
      await connect();
      return;
    }
    // Implementation for adding new credentials
  };
  
  const handleDeleteCredential = (credentialId: string) => {
    console.log('Deleting credential with ID:', credentialId);
    
    // Filter out the credential with the matching ID
    const updatedCredentials = credentials.filter(cred => cred.id !== credentialId);
    
    // Update state
    setCredentials(updatedCredentials);
    
    try {
      // Update localStorage
      localStorage.setItem('credentials', JSON.stringify(updatedCredentials));
      
      // Dispatch a storage event to update other tabs
      window.dispatchEvent(new Event('storage'));
      
      console.log('Credential deleted successfully');
    } catch (error) {
      console.error('Error saving updated credentials to localStorage:', error);
    }
  };

  const filteredCredentials = credentials.filter(credential => {
    const matchesSearch = credential.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         credential.issuer.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = selectedType === 'all' || credential.type === selectedType;
    const matchesStatus = selectedStatus === 'all' || credential.status === selectedStatus;
    
    return matchesSearch && matchesType && matchesStatus;
  });

  return (
    <div className="min-h-screen pt-20 pb-12">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">My Credentials</h1>
            <p className="text-gray-400">
              Manage and organize your verified credentials
            </p>
          </div>
          <button
            onClick={handleAddCredential}
            className="btn bg-gradient-to-r from-neon-blue to-neon-purple text-dark-900 font-medium hover:shadow-neon transition-all duration-300 mt-4 md:mt-0"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add New Credential
          </button>
        </div>

        {/* Filters and Search */}
        <div className="glass-panel p-4 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search credentials..."
                className="input pl-10 w-full"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <select
                className="input pl-10 w-full appearance-none"
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value as CredentialType | 'all')}
              >
                <option value="all">All Types</option>
                {Object.values(CredentialType).map(type => (
                  <option key={type} value={type}>{type.charAt(0).toUpperCase() + type.slice(1)}</option>
                ))}
              </select>
              <ArrowUpDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            </div>
            
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <select
                className="input pl-10 w-full appearance-none"
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value as CredentialStatus | 'all')}
              >
                <option value="all">All Statuses</option>
                {Object.values(CredentialStatus).map(status => (
                  <option key={status} value={status}>{status.charAt(0).toUpperCase() + status.slice(1)}</option>
                ))}
              </select>
              <ArrowUpDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            </div>
          </div>
        </div>

        {/* Credentials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCredentials.map((credential) => (
            <CredentialCard
              key={credential.id}
              credential={credential}
              onDelete={handleDeleteCredential}
            />
          ))}
          
          {filteredCredentials.length === 0 && (
            <div className="col-span-full text-center py-12">
              <p className="text-gray-400">No credentials found matching your filters.</p>
              {credentials.length > 0 && (
                <p className="text-gray-500 mt-2">Try adjusting your search criteria.</p>
              )}
              {credentials.length === 0 && (
                <p className="text-gray-500 mt-2">You don't have any credentials yet. Add one to get started.</p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CredentialsPage;