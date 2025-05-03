import React, { useState } from 'react';
import ThreeScene from '../components/three/ThreeScene';
import CredentialCard from '../components/credentials/CredentialCard';
import { Credential, CredentialStatus, CredentialType } from '../types';
import { Layers, QrCode, Upload, PlusCircle } from 'lucide-react';
import QRScanner from '../components/qr/QRScanner';
import { useWeb3 } from '../contexts/Web3Context';

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

// Sample documents for demonstration
const sampleDocuments: Credential[] = [
  {
    id: 'doc-1',
    name: 'Passport',
    issuer: 'Department of State',
    issuedAt: '2021-03-15',
    expiresAt: '2031-03-15',
    type: CredentialType.IDENTITY,
    status: CredentialStatus.ACTIVE,
    metadata: {
      description: 'Official passport document',
      documentType: 'International travel document',
      documentNumber: 'X1234567',
    },
    proofUrl: 'https://example.com/proof/passport',
  },
  {
    id: 'doc-2',
    name: 'Property Deed',
    issuer: 'County Recorder\'s Office',
    issuedAt: '2024-01-10',
    expiresAt: null,
    type: CredentialType.IDENTITY,
    status: CredentialStatus.ACTIVE,
    metadata: {
      description: 'Official property ownership record',
      propertyAddress: '123 Main St, Anytown, USA',
      recordNumber: 'R2023-56789',
    },
    proofUrl: 'https://example.com/proof/deed',
  },
  {
    id: 'doc-3',
    name: 'Birth Certificate',
    issuer: 'Department of Health',
    issuedAt: '1985-06-23',
    expiresAt: null,
    type: CredentialType.IDENTITY,
    status: CredentialStatus.ACTIVE,
    metadata: {
      description: 'Official birth record',
      certificateNumber: 'BC-98765432',
    },
    proofUrl: 'https://example.com/proof/birth',
  },
];

const DashboardPage: React.FC = () => {
  const [credentials, setCredentials] = useState<Credential[]>(sampleCredentials);
  const [selectedCredential, setSelectedCredential] = useState<Credential | null>(null);
  const [showQRScanner, setShowQRScanner] = useState(false);
  const { isConnected, connect } = useWeb3();

  const handleCredentialSelect = (credential: Credential) => {
    setSelectedCredential(credential);
  };

  const handleAddCredential = async () => {
    if (!isConnected) {
      await connect();
      return;
    }
    
    // This would open a modal for adding credentials in a real app
    console.log('Add credential');
  };

  const handleScanQR = () => {
    setShowQRScanner(true);
  };

  const handleQRScanned = (data: any) => {
    console.log('QR Scanned:', data);
    setShowQRScanner(false);
    
    // In a real app, we would verify the QR data and add the credential
    // For demonstration, we'll show an alert
    alert(`QR code scanned for credential ID: ${data.credentialId}`);
  };

  return (
    <div className="min-h-screen pt-20 pb-12">
      <div className="container mx-auto px-4">
        {/* Dashboard Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Credential Dashboard</h1>
          <p className="text-gray-400">
            View, manage, and verify your digital credentials
          </p>
        </div>
        
        {/* Action Buttons */}
        <div className="flex flex-wrap gap-4 mb-8">
          <button 
            onClick={handleAddCredential}
            className="btn btn-primary"
          >
            <PlusCircle className="w-4 h-4 mr-2" />
            Add Credential
          </button>
          <button 
            onClick={handleScanQR}
            className="btn btn-secondary"
          >
            <QrCode className="w-4 h-4 mr-2" />
            Scan QR Code
          </button>
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
          <div className="glass-panel p-2">
            <ThreeScene 
              credentials={credentials} 
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
          <div className="mb-12">
            <h2 className="text-xl font-semibold mb-4">Selected Credential</h2>
            <div className="max-w-2xl">
              <CredentialCard credential={selectedCredential} />
            </div>
          </div>
        )}
        
        {/* Credential List */}
        <div>
          <div className="flex items-center mb-4">
            <Layers className="w-5 h-5 text-primary-400 mr-2" />
            <h2 className="text-xl font-semibold">My Credentials</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {credentials.map((credential) => (
              <CredentialCard 
                key={credential.id} 
                credential={credential} 
                onClick={() => handleCredentialSelect(credential)}
              />
            ))}
          </div>
        </div>
      </div>
      
      {/* QR Scanner Modal */}
      {showQRScanner && (
        <QRScanner 
          onScan={handleQRScanned} 
          onClose={() => setShowQRScanner(false)} 
        />
      )}
    </div>
  );
};

export default DashboardPage;