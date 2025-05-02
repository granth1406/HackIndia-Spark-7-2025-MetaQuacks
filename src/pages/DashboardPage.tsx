import React, { useState, useEffect } from 'react';
import ThreeScene from '../components/three/ThreeScene';
import CredentialCard from '../components/credentials/CredentialCard';
import { Credential, CredentialStatus, CredentialType } from '../types';
import { Layers, QrCode, PlusCircle, X, Check } from 'lucide-react';
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
  const [showAddModal, setShowAddModal] = useState(false);
  const [newCredential, setNewCredential] = useState<Partial<Credential>>({
    name: '',
    issuer: '',
    type: CredentialType.CERTIFICATION,
    issuedAt: new Date().toISOString().split('T')[0],
    status: CredentialStatus.ACTIVE
  });
  const { isConnected, connect } = useWeb3();

  // Load any stored credentials from localStorage on component mount
  useEffect(() => {
    const storedCredentials = localStorage.getItem('credentials');
    if (storedCredentials) {
      try {
        const parsedCredentials = JSON.parse(storedCredentials);
        setCredentials([...sampleCredentials, ...parsedCredentials]);
      } catch (error) {
        console.error('Error parsing stored credentials:', error);
      }
    }
  }, []);

  const handleCredentialSelect = (credential: Credential) => {
    setSelectedCredential(credential);
  };

  const handleAddCredential = async () => {
    if (!isConnected) {
      await connect();
      return;
    }
    
    // Open the modal for adding a new credential
    setShowAddModal(true);
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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewCredential(prev => ({ ...prev, [name]: value }));
  };

  const handleCredentialSubmit = () => {
    // Generate a new credential object
    const credential: Credential = {
      id: `cred-${Date.now()}`,
      name: newCredential.name || 'Unnamed Credential',
      issuer: newCredential.issuer || 'Unknown Issuer',
      issuedAt: newCredential.issuedAt || new Date().toISOString(),
      expiresAt: newCredential.expiresAt || null,
      type: newCredential.type || CredentialType.CERTIFICATION,
      status: newCredential.status || CredentialStatus.ACTIVE,
      metadata: {
        description: newCredential.metadata?.description || 'No description provided'
      },
      proofUrl: newCredential.proofUrl || 'https://example.com/proof/new'
    };

    // Add to credentials list
    const updatedCredentials = [...credentials, credential];
    setCredentials(updatedCredentials);

    // Store in localStorage
    try {
      // Get existing stored credentials
      const storedCredentials = JSON.parse(localStorage.getItem('credentials') || '[]');
      const updatedStoredCredentials = [...storedCredentials, credential];
      localStorage.setItem('credentials', JSON.stringify(updatedStoredCredentials));
    } catch (error) {
      console.error('Error saving credential to localStorage:', error);
    }

    // Reset form and close modal
    setNewCredential({
      name: '',
      issuer: '',
      type: CredentialType.CERTIFICATION,
      issuedAt: new Date().toISOString().split('T')[0],
      status: CredentialStatus.ACTIVE
    });
    setShowAddModal(false);
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

      {/* Add Credential Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-dark-900/90 backdrop-blur-sm p-4">
          <div className="relative w-full max-w-2xl bg-dark-800 rounded-lg shadow-xl overflow-hidden">
            <div className="p-4 border-b border-dark-700 flex justify-between items-center">
              <h3 className="text-lg font-medium text-white">Add New Credential</h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-gray-400 hover:text-white"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            
            <div className="p-6">
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Credential Name */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Credential Name</label>
                    <input
                      type="text"
                      name="name"
                      value={newCredential.name || ''}
                      onChange={handleInputChange}
                      className="input w-full"
                      placeholder="e.g. Microsoft Certification"
                    />
                  </div>
                  
                  {/* Issuer */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Issuer</label>
                    <input
                      type="text"
                      name="issuer"
                      value={newCredential.issuer || ''}
                      onChange={handleInputChange}
                      className="input w-full"
                      placeholder="e.g. Microsoft"
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Type */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Type</label>
                    <select
                      name="type"
                      value={newCredential.type}
                      onChange={handleInputChange}
                      className="input w-full"
                    >
                      {Object.values(CredentialType).map(type => (
                        <option key={type} value={type}>
                          {type.charAt(0).toUpperCase() + type.slice(1)}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  {/* Status */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Status</label>
                    <select
                      name="status"
                      value={newCredential.status}
                      onChange={handleInputChange}
                      className="input w-full"
                    >
                      {Object.values(CredentialStatus).map(status => (
                        <option key={status} value={status}>
                          {status.charAt(0).toUpperCase() + status.slice(1)}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Issue Date */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Issue Date</label>
                    <input
                      type="date"
                      name="issuedAt"
                      value={newCredential.issuedAt?.toString().split('T')[0] || ''}
                      onChange={handleInputChange}
                      className="input w-full"
                    />
                  </div>
                  
                  {/* Expiry Date (Optional) */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Expiry Date (Optional)</label>
                    <input
                      type="date"
                      name="expiresAt"
                      value={newCredential.expiresAt?.toString().split('T')[0] || ''}
                      onChange={handleInputChange}
                      className="input w-full"
                    />
                  </div>
                </div>
                
                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Description</label>
                  <textarea
                    name="metadata.description"
                    value={newCredential.metadata?.description || ''}
                    onChange={(e) => setNewCredential(prev => ({ 
                      ...prev, 
                      metadata: { ...prev.metadata, description: e.target.value } 
                    }))}
                    className="input w-full h-24"
                    placeholder="Add a description of this credential"
                  ></textarea>
                </div>
                
                {/* Proof URL */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Proof URL (Optional)</label>
                  <input
                    type="text"
                    name="proofUrl"
                    value={newCredential.proofUrl || ''}
                    onChange={handleInputChange}
                    className="input w-full"
                    placeholder="https://example.com/proof/123"
                  />
                </div>
              </div>
            </div>
            
            <div className="p-4 border-t border-dark-700 flex justify-end">
              <button
                onClick={() => setShowAddModal(false)}
                className="btn btn-ghost mr-2"
              >
                Cancel
              </button>
              <button
                onClick={handleCredentialSubmit}
                className="btn btn-primary"
              >
                <Check className="w-4 h-4 mr-2" />
                Add Credential
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardPage;