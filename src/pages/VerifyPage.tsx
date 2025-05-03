import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import QRScanner from '../components/qr/QRScanner';
import DocumentVerifier from '../components/verification/DocumentVerifier';
import { QRCodeData, Credential, CredentialStatus, CredentialType } from '../types';
import { QrCode, Upload, Shield, ClipboardCheck, XCircle, Blocks } from 'lucide-react';
import { VerificationResult } from '../services/BlockchainVerificationService';

enum VerificationStatus {
  INITIAL = 'initial',
  SCANNING = 'scanning',
  VERIFYING = 'verifying',
  SUCCESS = 'success',
  ERROR = 'error',
}

enum VerificationMethod {
  NONE = 'none',
  QR = 'qr',
  FILE = 'file',
  BLOCKCHAIN = 'blockchain'
}

const VerifyPage: React.FC = () => {
  const navigate = useNavigate();
  const [status, setStatus] = useState<VerificationStatus>(VerificationStatus.INITIAL);
  const [method, setMethod] = useState<VerificationMethod>(VerificationMethod.NONE);
  const [showQRScanner, setShowQRScanner] = useState(false);
  const [verifiedCredential, setVerifiedCredential] = useState<Credential | null>(null);
  const [verificationResult, setVerificationResult] = useState<VerificationResult | null>(null);
  const [errorMessage, setErrorMessage] = useState<string>('');

  const saveCredential = (credential: Credential) => {
    // Get existing credentials from localStorage
    const existingCredentials = JSON.parse(localStorage.getItem('credentials') || '[]');
    
    // Add new credential
    const updatedCredentials = [...existingCredentials, credential];
    
    // Save back to localStorage
    localStorage.setItem('credentials', JSON.stringify(updatedCredentials));
  };

  const handleScanClick = () => {
    setShowQRScanner(true);
    setStatus(VerificationStatus.SCANNING);
    setMethod(VerificationMethod.QR);
  };

  const handleQRScanned = (data: QRCodeData) => {
    setShowQRScanner(false);
    setStatus(VerificationStatus.VERIFYING);
    
    // Simulate verification process
    setTimeout(() => {
      if (data.credentialId) {
        // Mock successful verification
        const mockCredential: Credential = {
          id: data.credentialId,
          name: 'Verified Credential',
          issuer: 'ProofPass Authority',
          issuedAt: new Date().toISOString(),
          expiresAt: null,
          type: CredentialType.CERTIFICATION,
          status: CredentialStatus.ACTIVE,
          metadata: {
            description: 'This credential has been verified successfully',
          },
          proofUrl: 'https://example.com/proof/123',
        };
        
        setVerifiedCredential(mockCredential);
        setStatus(VerificationStatus.SUCCESS);
        saveCredential(mockCredential); // Save the verified credential
      } else {
        setErrorMessage('Invalid credential data');
        setStatus(VerificationStatus.ERROR);
      }
    }, 2000); // Simulate verification delay
  };

  const handleReset = () => {
    setStatus(VerificationStatus.INITIAL);
    setMethod(VerificationMethod.NONE);
    setVerifiedCredential(null);
    setVerificationResult(null);
    setErrorMessage('');
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) {
      setErrorMessage('No file selected');
      setStatus(VerificationStatus.ERROR);
      return;
    }

    // Set verifying status while we process the file
    setStatus(VerificationStatus.VERIFYING);
    setMethod(VerificationMethod.FILE);

    // In a real application, you would process the file here
    // For now, we'll simulate the verification process
    setTimeout(() => {
      const mockCredential: Credential = {
        id: 'FILE-' + Math.random().toString(36).substr(2, 9),
        name: 'File Verified Credential',
        issuer: 'ProofPass Authority',
        issuedAt: new Date().toISOString(),
        expiresAt: null,
        type: CredentialType.CERTIFICATION,
        status: CredentialStatus.ACTIVE,
        metadata: {
          description: 'This credential has been verified successfully from file',
        },
        proofUrl: 'https://example.com/proof/123',
      };
      
      setVerifiedCredential(mockCredential);
      setStatus(VerificationStatus.SUCCESS);
      saveCredential(mockCredential); // Save the verified credential
    }, 2000);
  };

  const handleBlockchainVerification = () => {
    setMethod(VerificationMethod.BLOCKCHAIN);
  };

  const handleBlockchainVerificationComplete = (result: {credential: Credential | null, verification: VerificationResult}) => {
    if (result.credential && result.verification.isValid) {
      setVerifiedCredential(result.credential);
      setVerificationResult(result.verification);
      setStatus(VerificationStatus.SUCCESS);
      saveCredential(result.credential);
    } else {
      setErrorMessage(result.verification.errorMessage || 'Verification failed');
      setStatus(VerificationStatus.ERROR);
    }
  };

  const handleViewCredentials = () => {
    navigate('/credentials');
  };

  return (
    <div className="min-h-screen pt-20 pb-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Verify Credentials</h1>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Scan a QR code, upload a credential file, or use blockchain verification to authenticate credentials
          </p>
        </div>
        
        <div className="glass-panel p-8 mb-8">
          {status === VerificationStatus.INITIAL && (
            <div className="flex flex-col items-center text-center">
              <div className="w-24 h-24 rounded-full bg-dark-800 flex items-center justify-center mb-6">
                <Shield className="w-12 h-12 text-neon-blue" />
              </div>
              <h2 className="text-2xl font-semibold mb-6">Choose Verification Method</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-3xl">
                <button
                  onClick={handleScanClick}
                  className="flex flex-col items-center p-6 rounded-lg bg-dark-800 hover:bg-dark-700 border border-dark-600 transition-all duration-300"
                >
                  <QrCode className="w-10 h-10 text-neon-blue mb-3" />
                  <span className="text-white font-medium">Scan QR Code</span>
                </button>
                <label className="flex flex-col items-center p-6 rounded-lg bg-dark-800 hover:bg-dark-700 border border-dark-600 transition-all duration-300 cursor-pointer">
                  <Upload className="w-10 h-10 text-neon-purple mb-3" />
                  <span className="text-white font-medium">Upload File</span>
                  <input 
                    type="file" 
                    className="hidden" 
                    onChange={handleFileUpload} 
                    accept="image/*,.json,.pdf"
                  />
                </label>
                <button
                  onClick={handleBlockchainVerification}
                  className="flex flex-col items-center p-6 rounded-lg bg-dark-800 hover:bg-dark-700 border border-dark-600 transition-all duration-300"
                >
                  <Blocks className="w-10 h-10 text-neon-pink mb-3" />
                  <span className="text-white font-medium">Blockchain Verify</span>
                </button>
              </div>
            </div>
          )}
          
          {method === VerificationMethod.BLOCKCHAIN && (
            <DocumentVerifier onVerificationComplete={handleBlockchainVerificationComplete} />
          )}
          
          {status === VerificationStatus.VERIFYING && method !== VerificationMethod.BLOCKCHAIN && (
            <div className="flex flex-col items-center text-center">
              <div className="w-24 h-24 rounded-full bg-dark-800 flex items-center justify-center mb-6">
                <div className="w-12 h-12 border-4 border-t-neon-blue border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin"></div>
              </div>
              <h2 className="text-2xl font-semibold mb-2">Verifying Credential</h2>
              <p className="text-gray-400">
                Please wait while we verify the credential...
              </p>
            </div>
          )}
          
          {status === VerificationStatus.SUCCESS && verifiedCredential && (
            <div className="flex flex-col items-center text-center">
              <div className="w-24 h-24 rounded-full bg-success-900/30 flex items-center justify-center mb-6 border-2 border-success-500 animate-pulse">
                <ClipboardCheck className="w-12 h-12 text-success-500" />
              </div>
              <h2 className="text-2xl font-semibold mb-4 text-success-500">Verification Successful</h2>
              <div className="w-full max-w-md p-4 bg-dark-800 rounded-lg border border-dark-600 mb-6">
                <div className="flex flex-col space-y-2">
                  <div className="grid grid-cols-3 gap-2">
                    <span className="text-sm text-gray-400">ID:</span>
                    <span className="text-sm text-white col-span-2">{verifiedCredential.id}</span>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    <span className="text-sm text-gray-400">Name:</span>
                    <span className="text-sm text-white col-span-2">{verifiedCredential.name}</span>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    <span className="text-sm text-gray-400">Issuer:</span>
                    <span className="text-sm text-white col-span-2">{verifiedCredential.issuer}</span>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    <span className="text-sm text-gray-400">Issued:</span>
                    <span className="text-sm text-white col-span-2">
                      {new Date(verifiedCredential.issuedAt).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    <span className="text-sm text-gray-400">Status:</span>
                    <span className="text-sm text-white col-span-2">{verifiedCredential.status}</span>
                  </div>
                  {verificationResult && (
                    <div className="grid grid-cols-3 gap-2">
                      <span className="text-sm text-gray-400">Blockchain Verified:</span>
                      <span className="text-sm text-white col-span-2">
                        {verificationResult.isValid ? 'Yes' : 'No'}
                      </span>
                    </div>
                  )}
                </div>
              </div>
              <div className="flex gap-4">
                <button
                  onClick={handleReset}
                  className="btn btn-primary"
                >
                  Verify Another
                </button>
                <button
                  onClick={handleViewCredentials}
                  className="btn btn-secondary"
                >
                  View All Credentials
                </button>
              </div>
            </div>
          )}
          
          {status === VerificationStatus.ERROR && (
            <div className="flex flex-col items-center text-center">
              <div className="w-24 h-24 rounded-full bg-error-900/30 flex items-center justify-center mb-6 border-2 border-error-500">
                <XCircle className="w-12 h-12 text-error-500" />
              </div>
              <h2 className="text-2xl font-semibold mb-2 text-error-500">Verification Failed</h2>
              <p className="text-gray-400 mb-6">
                {errorMessage || 'Unable to verify the credential. Please try again.'}
              </p>
              <button
                onClick={handleReset}
                className="btn btn-primary"
              >
                Try Again
              </button>
            </div>
          )}
        </div>
        
        <div className="text-center">
          <h3 className="text-xl font-semibold mb-4">How Verification Works</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="glass-panel p-6">
              <div className="w-12 h-12 flex items-center justify-center rounded-full bg-dark-700 mx-auto mb-4">
                <span className="text-lg font-bold text-neon-blue">1</span>
              </div>
              <h4 className="text-lg font-medium mb-2">Multiple Verification Methods</h4>
              <p className="text-sm text-gray-400">
                Scan a QR code, upload a file, or use blockchain verification to validate credentials
              </p>
            </div>
            <div className="glass-panel p-6">
              <div className="w-12 h-12 flex items-center justify-center rounded-full bg-dark-700 mx-auto mb-4">
                <span className="text-lg font-bold text-neon-purple">2</span>
              </div>
              <h4 className="text-lg font-medium mb-2">Blockchain Verification</h4>
              <p className="text-sm text-gray-400">
                Credentials are verified against immutable blockchain records for maximum security
              </p>
            </div>
            <div className="glass-panel p-6">
              <div className="w-12 h-12 flex items-center justify-center rounded-full bg-dark-700 mx-auto mb-4">
                <span className="text-lg font-bold text-neon-pink">3</span>
              </div>
              <h4 className="text-lg font-medium mb-2">Instant Results</h4>
              <p className="text-sm text-gray-400">
                Get immediate verification results with detailed credential information
              </p>
            </div>
          </div>
        </div>
      </div>
      
      {showQRScanner && (
        <QRScanner 
          onScan={handleQRScanned} 
          onClose={() => {
            setShowQRScanner(false);
            setStatus(VerificationStatus.INITIAL);
            setMethod(VerificationMethod.NONE);
          }}
        />
      )}
    </div>
  );
};

export default VerifyPage;