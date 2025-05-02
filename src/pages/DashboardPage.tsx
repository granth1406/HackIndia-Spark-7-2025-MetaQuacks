import React, { useState, useEffect } from 'react';
import ThreeScene from '../components/three/ThreeScene';
import CredentialCard from '../components/credentials/CredentialCard';
import { Credential, CredentialStatus, CredentialType } from '../types';
import { Layers, QrCode, PlusCircle, X, Check, FileText, Search } from 'lucide-react';
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
  const [documents, setDocuments] = useState<Credential[]>(sampleDocuments);
  const [selectedCredential, setSelectedCredential] = useState<Credential | null>(null);
  const [showQRScanner, setShowQRScanner] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showAddDocumentModal, setShowAddDocumentModal] = useState(false);
  const [documentSearchTerm, setDocumentSearchTerm] = useState('');
  const [newCredential, setNewCredential] = useState<Partial<Credential>>({
    name: '',
    issuer: '',
    type: CredentialType.CERTIFICATION,
    issuedAt: new Date().toISOString().split('T')[0],
    status: CredentialStatus.ACTIVE
  });
  const [newDocument, setNewDocument] = useState<Partial<Credential>>({
    name: '',
    issuer: '',
    type: CredentialType.IDENTITY,
    issuedAt: new Date().toISOString().split('T')[0],
    status: CredentialStatus.ACTIVE
  });
  const { isConnected, connect } = useWeb3();

  // Load any stored credentials and documents from localStorage on component mount
  useEffect(() => {
    // Load credentials
    const storedCredentials = localStorage.getItem('credentials');
    if (storedCredentials) {
      try {
        const parsedCredentials = JSON.parse(storedCredentials);
        setCredentials([...sampleCredentials, ...parsedCredentials]);
      } catch (error) {
        console.error('Error parsing stored credentials:', error);
      }
    }

    // Load documents
    const storedDocuments = localStorage.getItem('documents');
    if (storedDocuments) {
      try {
        const parsedDocuments = JSON.parse(storedDocuments);
        setDocuments([...sampleDocuments, ...parsedDocuments]);
      } catch (error) {
        console.error('Error parsing stored documents:', error);
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

  const handleAddDocument = async () => {
    if (!isConnected) {
      await connect();
      return;
    }
    
    // Open the modal for adding a new document
    setShowAddDocumentModal(true);
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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>, isDocument = false) => {
    const { name, value } = e.target;
    if (isDocument) {
      setNewDocument(prev => ({ ...prev, [name]: value }));
    } else {
      setNewCredential(prev => ({ ...prev, [name]: value }));
    }
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

  const handleDocumentSubmit = () => {
    // Generate a new document object
    const document: Credential = {
      id: `doc-${Date.now()}`,
      name: newDocument.name || 'Unnamed Document',
      issuer: newDocument.issuer || 'Unknown Issuer',
      issuedAt: newDocument.issuedAt || new Date().toISOString(),
      expiresAt: newDocument.expiresAt || null,
      type: newDocument.type || CredentialType.IDENTITY,
      status: newDocument.status || CredentialStatus.ACTIVE,
      metadata: {
        description: newDocument.metadata?.description || 'No description provided',
        documentType: newDocument.metadata?.documentType || 'Official document'
      },
      proofUrl: newDocument.proofUrl || 'https://example.com/proof/doc-new'
    };

    // Add to documents list
    const updatedDocuments = [...documents, document];
    setDocuments(updatedDocuments);

    // Store in localStorage
    try {
      // Get existing stored documents
      const storedDocuments = JSON.parse(localStorage.getItem('documents') || '[]');
      const updatedStoredDocuments = [...storedDocuments, document];
      localStorage.setItem('documents', JSON.stringify(updatedStoredDocuments));
    } catch (error) {
      console.error('Error saving document to localStorage:', error);
    }

    // Reset form and close modal
    setNewDocument({
      name: '',
      issuer: '',
      type: CredentialType.IDENTITY,
      issuedAt: new Date().toISOString().split('T')[0],
      status: CredentialStatus.ACTIVE
    });
    setShowAddDocumentModal(false);
  };

  // Filter documents based on search term
  const filteredDocuments = documents.filter(doc => 
    doc.name.toLowerCase().includes(documentSearchTerm.toLowerCase()) || 
    doc.issuer.toLowerCase().includes(documentSearchTerm.toLowerCase()) ||
    doc.metadata?.description?.toLowerCase().includes(documentSearchTerm.toLowerCase())
  );

  const handleDeleteDocument = (documentId: string) => {
    // Filter out the document with the matching ID
    const updatedDocuments = documents.filter(doc => doc.id !== documentId);
    
    // Update state
    setDocuments(updatedDocuments);
    
    try {
      // Update localStorage
      localStorage.setItem('documents', JSON.stringify(updatedDocuments));
      
      // If the deleted document was selected, clear the selection
      if (selectedCredential && selectedCredential.id === documentId) {
        setSelectedCredential(null);
      }
      
      console.log('Document deleted successfully');
    } catch (error) {
      console.error('Error saving updated documents to localStorage:', error);
    }
  };

  return (
    <div className="min-h-screen pt-20 pb-12">
      <div className="container mx-auto px-4">
        {/* Dashboard Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Credential Dashboard</h1>
          <p className="text-gray-400">
            View, manage, and verify your digital credentials and documents
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
            onClick={handleAddDocument}
            className="btn btn-secondary"
          >
            <FileText className="w-4 h-4 mr-2" />
            Add Document
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
              credentials={[...credentials, ...documents]} 
              onSelectCredential={handleCredentialSelect} 
            />
          </div>
        </div>
        
        {/* Selected Credential Detail */}
        {selectedCredential && (
          <div className="mb-12">
            <h2 className="text-xl font-semibold mb-4">Selected Item</h2>
            <div className="max-w-2xl">
              <CredentialCard credential={selectedCredential} />
            </div>
          </div>
        )}
        
        {/* Credential List */}
        <div className="mb-12">
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
                onDelete={(credId) => {
                  // Filter out the credential with the matching ID
                  const updatedCredentials = credentials.filter(cred => cred.id !== credId);
                  
                  // Update state
                  setCredentials(updatedCredentials);
                  
                  // Update localStorage
                  localStorage.setItem('credentials', JSON.stringify(updatedCredentials));
                  
                  // If the deleted credential was selected, clear the selection
                  if (selectedCredential && selectedCredential.id === credId) {
                    setSelectedCredential(null);
                  }
                }}
              />
            ))}
          </div>
        </div>
        
        {/* Documents Section */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <FileText className="w-5 h-5 text-neon-pink mr-2" />
              <h2 className="text-xl font-semibold">My Documents</h2>
            </div>
            
            {/* Document Search */}
            <div className="relative max-w-md w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search documents..."
                className="input pl-10 w-full"
                value={documentSearchTerm}
                onChange={(e) => setDocumentSearchTerm(e.target.value)}
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDocuments.map((document) => (
              <CredentialCard 
                key={document.id} 
                credential={document} 
                onClick={() => handleCredentialSelect(document)}
                onDelete={handleDeleteDocument}
              />
            ))}
            
            {filteredDocuments.length === 0 && (
              <div className="col-span-full text-center py-12">
                <p className="text-gray-400">No documents found matching your search criteria.</p>
                {documents.length > 0 && documentSearchTerm && (
                  <p className="text-gray-500 mt-2">Try adjusting your search term.</p>
                )}
                {documents.length === 0 && (
                  <p className="text-gray-500 mt-2">You don't have any documents yet. Add one to get started.</p>
                )}
              </div>
            )}
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
      
      {/* Add Document Modal */}
      {showAddDocumentModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-dark-900/90 backdrop-blur-sm p-4">
          <div className="relative w-full max-w-2xl bg-dark-800 rounded-lg shadow-xl overflow-hidden">
            <div className="p-4 border-b border-dark-700 flex justify-between items-center">
              <h3 className="text-lg font-medium text-white flex items-center">
                <FileText className="h-5 w-5 text-neon-pink mr-2" />
                Add New Document
              </h3>
              <button
                onClick={() => setShowAddDocumentModal(false)}
                className="text-gray-400 hover:text-white"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            
            <div className="p-6">
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Document Name */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Document Name</label>
                    <input
                      type="text"
                      name="name"
                      value={newDocument.name || ''}
                      onChange={(e) => handleInputChange(e, true)}
                      className="input w-full"
                      placeholder="e.g. Passport"
                    />
                  </div>
                  
                  {/* Issuer */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Issuing Authority</label>
                    <input
                      type="text"
                      name="issuer"
                      value={newDocument.issuer || ''}
                      onChange={(e) => handleInputChange(e, true)}
                      className="input w-full"
                      placeholder="e.g. Department of State"
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Type */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Document Type</label>
                    <select
                      name="type"
                      value={newDocument.type}
                      onChange={(e) => handleInputChange(e, true)}
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
                      value={newDocument.status}
                      onChange={(e) => handleInputChange(e, true)}
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
                      value={newDocument.issuedAt?.toString().split('T')[0] || ''}
                      onChange={(e) => handleInputChange(e, true)}
                      className="input w-full"
                    />
                  </div>
                  
                  {/* Expiry Date (Optional) */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Expiry Date (Optional)</label>
                    <input
                      type="date"
                      name="expiresAt"
                      value={newDocument.expiresAt?.toString().split('T')[0] || ''}
                      onChange={(e) => handleInputChange(e, true)}
                      className="input w-full"
                    />
                  </div>
                </div>
                
                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Description</label>
                  <textarea
                    name="metadata.description"
                    value={newDocument.metadata?.description || ''}
                    onChange={(e) => setNewDocument(prev => ({ 
                      ...prev, 
                      metadata: { ...prev.metadata, description: e.target.value } 
                    }))}
                    className="input w-full h-24"
                    placeholder="Add a description of this document"
                  ></textarea>
                </div>
                
                {/* Document Number */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Document Number (Optional)</label>
                  <input
                    type="text"
                    name="documentNumber"
                    value={newDocument.metadata?.documentNumber || ''}
                    onChange={(e) => setNewDocument(prev => ({ 
                      ...prev, 
                      metadata: { ...prev.metadata, documentNumber: e.target.value } 
                    }))}
                    className="input w-full"
                    placeholder="e.g. X1234567"
                  />
                </div>
                
                {/* Document Type Details */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Document Type Details (Optional)</label>
                  <input
                    type="text"
                    name="documentType"
                    value={newDocument.metadata?.documentType || ''}
                    onChange={(e) => setNewDocument(prev => ({ 
                      ...prev, 
                      metadata: { ...prev.metadata, documentType: e.target.value } 
                    }))}
                    className="input w-full"
                    placeholder="e.g. International travel document"
                  />
                </div>
                
                {/* Proof URL */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Proof URL (Optional)</label>
                  <input
                    type="text"
                    name="proofUrl"
                    value={newDocument.proofUrl || ''}
                    onChange={(e) => handleInputChange(e, true)}
                    className="input w-full"
                    placeholder="https://example.com/proof/doc-123"
                  />
                </div>
              </div>
            </div>
            
            <div className="p-4 border-t border-dark-700 flex justify-end">
              <button
                onClick={() => setShowAddDocumentModal(false)}
                className="btn btn-ghost mr-2"
              >
                Cancel
              </button>
              <button
                onClick={handleDocumentSubmit}
                className="btn btn-primary"
              >
                <Check className="w-4 h-4 mr-2" />
                Add Document
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardPage;