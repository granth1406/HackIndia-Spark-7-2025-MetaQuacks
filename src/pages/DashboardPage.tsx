import React, { useState } from 'react';
import { useAccount } from 'wagmi';
import { FileText, Edit, Trash2, Filter, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';
import CredentialsScene from '../components/three/CredentialsScene';
import CredentialDetails from '../components/credential/CredentialDetails';

// Sample credential data
const SAMPLE_CREDENTIALS = [
  {
    id: 'cred-123',
    title: 'Bachelor of Computer Science',
    issuer: 'Stanford University',
    issuerAddress: '0x1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b',
    holder: 'John Doe',
    holderAddress: '0xabcdef1234567890abcdef1234567890abcdef12',
    issuedAt: '2023-06-15T10:00:00Z',
    expiresAt: '2033-06-15T10:00:00Z',
    metadataCID: 'QmWVLnZhqUhJgBvKYMWfJAY3xJaQLGrfcvLrpYJhSHBKRp',
    documentCID: 'QmYbTcvxMZvvmEQzJRrxuMDkqfMQJxC3ZcwUrLxYdNbRwY',
    verified: true,
    status: 'valid' as const,
    type: 'degree',
    color: '#4f46e5'
  },
  {
    id: 'cred-456',
    title: 'AWS Certified Solutions Architect',
    issuer: 'Amazon Web Services',
    issuerAddress: '0x2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c',
    holder: 'John Doe',
    holderAddress: '0xabcdef1234567890abcdef1234567890abcdef12',
    issuedAt: '2024-01-10T14:30:00Z',
    expiresAt: '2027-01-10T14:30:00Z',
    metadataCID: 'QmSzTh4FzYqYbWKQvssJ3HNxCLRLPpUjcVxdbLyRdU2JjW',
    documentCID: 'QmUNLLsPACCz1vLxQVkXqqLX5R1X345qqfHbsf67hvA3Nn',
    verified: true,
    status: 'valid' as const,
    type: 'certificate',
    color: '#0891b2'
  },
  {
    id: 'cred-789',
    title: 'ETHDenver 2025 Attendance',
    issuer: 'ETHDenver',
    issuerAddress: '0x3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d',
    holder: 'John Doe',
    holderAddress: '0xabcdef1234567890abcdef1234567890abcdef12',
    issuedAt: '2025-02-28T09:00:00Z',
    metadataCID: 'QmWJHzKQKEy2Tjpd1MjJgT7CruouFBJV6wEpQsQiuXpfLM',
    documentCID: 'QmVQKhSxAeG1gH1YTVn9N4qkXQrNNCZZnDdSLbMTTvRwXw',
    verified: true,
    status: 'valid' as const,
    type: 'event',
    color: '#a855f7'
  }
];

const DashboardPage: React.FC = () => {
  const { isConnected } = useAccount();
  const [viewMode, setViewMode] = useState<'3d' | 'list'>('3d');
  const [selectedCredential, setSelectedCredential] = useState<typeof SAMPLE_CREDENTIALS[0] | null>(null);
  const [filterType, setFilterType] = useState<string | null>(null);

  const filteredCredentials = filterType 
    ? SAMPLE_CREDENTIALS.filter(cred => cred.type === filterType)
    : SAMPLE_CREDENTIALS;

  // Prepare credentials for 3D view
  const credentialsFor3D = filteredCredentials.map(cred => ({
    id: cred.id,
    title: cred.title,
    issuer: cred.issuer,
    color: cred.color
  }));

  const handleCredentialSelect = (credential: { id: string }) => {
    const fullCredential = SAMPLE_CREDENTIALS.find(c => c.id === credential.id);
    if (fullCredential) {
      setSelectedCredential(fullCredential);
    }
  };

  if (!isConnected) {
    return (
      <div className="page-container flex items-center justify-center min-h-[70vh]">
        <div className="glass-panel p-8 text-center max-w-md">
          <FileText size={48} className="text-primary-500 mx-auto mb-4" />
          <h2 className="text-2xl font-display font-bold mb-4">Connect Your Wallet</h2>
          <p className="text-gray-300 mb-6">
            You need to connect your wallet to view and manage your credentials.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div>
          <h1 className="section-title mb-2">My Credentials</h1>
          <p className="text-gray-300">
            View and manage your verified credentials.
          </p>
        </div>
        
        <div className="flex flex-wrap gap-4 mt-4 md:mt-0">
          <Link to="/issue" className="btn btn-primary">
            <Plus size={18} className="mr-2" />
            Issue New
          </Link>
          
          <div className="flex">
            <button 
              onClick={() => setViewMode('3d')} 
              className={`px-4 py-2 rounded-l-xl transition-colors ${
                viewMode === '3d' 
                  ? 'bg-primary-600 text-white' 
                  : 'bg-dark-card text-gray-300 hover:bg-dark-border'
              }`}
            >
              3D View
            </button>
            <button 
              onClick={() => setViewMode('list')} 
              className={`px-4 py-2 rounded-r-xl transition-colors ${
                viewMode === 'list' 
                  ? 'bg-primary-600 text-white' 
                  : 'bg-dark-card text-gray-300 hover:bg-dark-border'
              }`}
            >
              List View
            </button>
          </div>
        </div>
      </div>
      
      <div className="flex flex-col-reverse lg:flex-row gap-8">
        <div className={`w-full ${selectedCredential ? 'lg:w-2/3' : 'lg:w-full'}`}>
          {/* Filters */}
          <div className="glass-panel p-4 mb-6 flex items-center overflow-x-auto">
            <Filter size={18} className="text-gray-400 mr-2 shrink-0" />
            <span className="text-gray-300 mr-4 shrink-0">Filter:</span>
            
            <div className="flex gap-2">
              <button 
                onClick={() => setFilterType(null)} 
                className={`px-3 py-1 rounded-lg text-sm transition-colors whitespace-nowrap ${
                  filterType === null 
                    ? 'bg-primary-600 text-white' 
                    : 'bg-dark-card text-gray-300 hover:bg-dark-border'
                }`}
              >
                All
              </button>
              <button 
                onClick={() => setFilterType('degree')} 
                className={`px-3 py-1 rounded-lg text-sm transition-colors whitespace-nowrap ${
                  filterType === 'degree' 
                    ? 'bg-primary-600 text-white' 
                    : 'bg-dark-card text-gray-300 hover:bg-dark-border'
                }`}
              >
                Academic Degrees
              </button>
              <button 
                onClick={() => setFilterType('certificate')} 
                className={`px-3 py-1 rounded-lg text-sm transition-colors whitespace-nowrap ${
                  filterType === 'certificate' 
                    ? 'bg-primary-600 text-white' 
                    : 'bg-dark-card text-gray-300 hover:bg-dark-border'
                }`}
              >
                Certificates
              </button>
              <button 
                onClick={() => setFilterType('event')} 
                className={`px-3 py-1 rounded-lg text-sm transition-colors whitespace-nowrap ${
                  filterType === 'event' 
                    ? 'bg-primary-600 text-white' 
                    : 'bg-dark-card text-gray-300 hover:bg-dark-border'
                }`}
              >
                Event Passes
              </button>
            </div>
          </div>
          
          {/* Credentials Display */}
          {viewMode === '3d' ? (
            <CredentialsScene 
              credentials={credentialsFor3D} 
              onSelectCredential={handleCredentialSelect}
            />
          ) : (
            <div className="glass-panel p-6">
              {filteredCredentials.length > 0 ? (
                <div className="grid grid-cols-1 gap-4">
                  {filteredCredentials.map((credential) => (
                    <div
                      key={credential.id}
                      className={`p-4 border rounded-xl transition-colors cursor-pointer group ${
                        selectedCredential?.id === credential.id 
                          ? 'border-primary-500 bg-primary-900/10' 
                          : 'border-dark-border hover:border-dark-surface hover:bg-dark-card'
                      }`}
                      onClick={() => setSelectedCredential(credential)}
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="text-lg font-semibold">{credential.title}</h3>
                          <div className="text-gray-300 mb-2">Issued by: {credential.issuer}</div>
                          <div className="flex items-center text-sm">
                            <span className="text-gray-400">Issued: </span>
                            <span className="text-gray-300 ml-1">
                              {new Date(credential.issuedAt).toLocaleDateString()}
                            </span>
                            
                            {credential.expiresAt && (
                              <>
                                <span className="mx-2 text-gray-500">•</span>
                                <span className="text-gray-400">Expires: </span>
                                <span className="text-gray-300 ml-1">
                                  {new Date(credential.expiresAt).toLocaleDateString()}
                                </span>
                              </>
                            )}
                          </div>
                        </div>
                        
                        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button className="p-2 rounded-lg bg-dark-background hover:bg-primary-900 text-gray-300 hover:text-primary-500">
                            <Edit size={16} />
                          </button>
                          <button className="p-2 rounded-lg bg-dark-background hover:bg-error-900 text-gray-300 hover:text-error-500">
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <FileText size={48} className="text-gray-500 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-2">No credentials found</h3>
                  <p className="text-gray-400 mb-6">
                    {filterType 
                      ? `You don't have any credentials of type: ${filterType}` 
                      : "You don't have any credentials yet"}
                  </p>
                  <Link to="/issue" className="btn btn-primary">
                    Issue New Credential
                  </Link>
                </div>
              )}
            </div>
          )}
        </div>
        
        {/* Credential Details */}
        {selectedCredential && (
          <div className="w-full lg:w-1/3 lg:sticky lg:top-24 self-start">
            <CredentialDetails credential={selectedCredential} />
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardPage;