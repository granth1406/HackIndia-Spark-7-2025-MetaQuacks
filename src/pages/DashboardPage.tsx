import React, { useState } from 'react';
import ThreeScene from '../components/three/ThreeScene';
import CredentialCard from '../components/credentials/CredentialCard';
import { Credential, CredentialStatus, CredentialType } from '../types';
import { Layers, QrCode, Upload, PlusCircle } from 'lucide-react';
import QRScanner from '../components/qr/QRScanner';
import { useWeb3 } from '../contexts/Web3Context';

// Sample data for demonstration
const sampleCredentials: Credential[] = [
  {
    id: '1',
    name: 'University Degree',
    issuer: 'Stanford University',
    issuedAt: '2023-05-15',
    expiresAt: null,
    type: CredentialType.EDUCATION,
    status: CredentialStatus.ACTIVE,
    metadata: {
      description: 'Bachelor of Science in Computer Science',
      degree: 'BSc',
      gpa: '3.8',
    },
    proofUrl: 'https://example.com/proof/123',
  },
  {
    id: '2',
    name: 'Software Engineer',
    issuer: 'Tech Corp Inc.',
    issuedAt: '2023-01-10',
    expiresAt: '2025-01-10',
    type: CredentialType.EMPLOYMENT,
    status: CredentialStatus.ACTIVE,
    metadata: {
      description: 'Senior Software Engineer position verification',
      position: 'Senior Software Engineer',
      department: 'Engineering',
    },
    proofUrl: 'https://example.com/proof/456',
  },
  {
    id: '3',
    name: 'Blockchain Certification',
    issuer: 'Blockchain Academy',
    issuedAt: '2022-11-05',
    expiresAt: '2024-11-05',
    type: CredentialType.CERTIFICATION,
    status: CredentialStatus.ACTIVE,
    metadata: {
      description: 'Advanced Blockchain Developer Certification',
      level: 'Advanced',
      score: '92%',
    },
    proofUrl: 'https://example.com/proof/789',
  },
  {
    id: '4',
    name: 'Identity Verification',
    issuer: 'National ID Authority',
    issuedAt: '2022-03-20',
    expiresAt: '2032-03-20',
    type: CredentialType.IDENTITY,
    status: CredentialStatus.ACTIVE,
    metadata: {
      description: 'Verified government-issued ID',
      idType: 'National ID',
    },
    proofUrl: 'https://example.com/proof/101',
  },
  {
    id: '5',
    name: 'Tech Conference Pass',
    issuer: 'DevCon 2023',
    issuedAt: '2023-09-01',
    expiresAt: '2023-09-05',
    type: CredentialType.ACCESS,
    status: CredentialStatus.EXPIRED,
    metadata: {
      description: 'VIP access to DevCon 2023',
      accessLevel: 'VIP',
      location: 'San Francisco, CA',
    },
    proofUrl: 'https://example.com/proof/202',
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
        
        {/* 3D Credentials Visualization */}
        <div className="mb-12">
          <div className="flex items-center mb-4">
            <Layers className="w-5 h-5 text-primary-400 mr-2" />
            <h2 className="text-xl font-semibold">3D Credentials View</h2>
          </div>
          <div className="glass-panel p-2">
            <ThreeScene 
              credentials={credentials} 
              onSelectCredential={handleCredentialSelect} 
            />
          </div>
        </div>
        
        {/* Selected Credential Detail */}
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