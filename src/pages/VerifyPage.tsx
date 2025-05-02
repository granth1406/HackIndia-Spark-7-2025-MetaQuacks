import React, { useState } from 'react';
import { FileText, Upload, QrCode, Check } from 'lucide-react';
import QRScanner from '../components/verification/QRScanner';
import VerificationResult from '../components/verification/VerificationResult';
import CredentialUploader from '../components/credential/CredentialUploader';

type VerificationMethod = 'qr' | 'url' | 'upload';
type VerificationStatus = 'idle' | 'scanning' | 'verifying' | 'complete';

interface VerificationResultData {
  status: 'success' | 'error' | 'warning';
  credentialId?: string;
  title?: string;
  issuer?: string;
  holder?: string;
  issuedDate?: string;
  expiryDate?: string;
  message: string;
  documentCID?: string;
}

const VerifyPage: React.FC = () => {
  const [method, setMethod] = useState<VerificationMethod>('qr');
  const [status, setStatus] = useState<VerificationStatus>('idle');
  const [urlInput, setUrlInput] = useState('');
  const [result, setResult] = useState<VerificationResultData | null>(null);

  const handleQRScanSuccess = (data: string) => {
    setStatus('verifying');
    
    // Simulate verification process
    setTimeout(() => {
      // Sample result - in a real app this would come from the blockchain
      setResult({
        status: 'success',
        credentialId: 'cred-xyz-123',
        title: 'Senior Blockchain Developer',
        issuer: 'ConsenSys',
        holder: 'Jane Smith',
        issuedDate: 'January 15, 2024',
        expiryDate: 'January 15, 2027',
        message: 'This credential is valid and has been verified on-chain.',
        documentCID: 'QmWJHzKQKEy2Tjpd1MjJgT7CruouFBJV6wEpQsQiuXpfLM'
      });
      setStatus('complete');
    }, 2000);
  };

  const handleUrlVerify = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!urlInput) return;
    
    setStatus('verifying');
    
    // Simulate verification process
    setTimeout(() => {
      if (urlInput.includes('error')) {
        setResult({
          status: 'error',
          message: 'This credential could not be verified. It may have been revoked or doesn\'t exist.',
        });
      } else if (urlInput.includes('warning')) {
        setResult({
          status: 'warning',
          credentialId: 'cred-abc-456',
          title: 'Project Management Professional',
          issuer: 'PMI',
          holder: 'John Doe',
          issuedDate: 'March 10, 2023',
          expiryDate: 'March 10, 2026',
          message: 'This credential is valid but will expire soon.',
          documentCID: 'QmSzTh4FzYqYbWKQvssJ3HNxCLRLPpUjcVxdbLyRdU2JjW'
        });
      } else {
        setResult({
          status: 'success',
          credentialId: 'cred-def-789',
          title: 'Full Stack Web Developer',
          issuer: 'Meta',
          holder: 'John Smith',
          issuedDate: 'June 5, 2024',
          message: 'This credential is valid and has been verified on-chain.',
          documentCID: 'QmVQKhSxAeG1gH1YTVn9N4qkXQrNNCZZnDdSLbMTTvRwXw'
        });
      }
      setStatus('complete');
    }, 2000);
  };

  const handleReset = () => {
    setStatus(VerificationStatus.INITIAL);
    setVerifiedCredential(null);
    setErrorMessage('');
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    // This would handle QR code image uploads in a real app
    alert('File upload functionality would be implemented in a production app');
  };

  return (
    <div className="page-container">
      <div className="max-w-3xl mx-auto">
        <h1 className="section-title mb-2">Verify Credentials</h1>
        <p className="text-gray-300 mb-8">
          Verify credentials using QR code, URL, or by uploading a document.
        </p>
        
        {status !== 'complete' ? (
          <>
            {/* Verification Method Tabs */}
            <div className="flex border-b border-dark-border mb-6">
              <button
                onClick={() => setMethod('qr')}
                className={`pb-3 px-4 font-medium ${
                  method === 'qr'
                    ? 'text-primary-500 border-b-2 border-primary-500'
                    : 'text-gray-300 hover:text-white'
                }`}
              >
                <div className="flex items-center">
                  <QrCode size={18} className="mr-2" />
                  Scan QR Code
                </div>
              </button>
              
              <button
                onClick={() => setMethod('url')}
                className={`pb-3 px-4 font-medium ${
                  method === 'url'
                    ? 'text-primary-500 border-b-2 border-primary-500'
                    : 'text-gray-300 hover:text-white'
                }`}
              >
                <div className="flex items-center">
                  <FileText size={18} className="mr-2" />
                  Enter URL
                </div>
              </button>
              
              <button
                onClick={() => setMethod('upload')}
                className={`pb-3 px-4 font-medium ${
                  method === 'upload'
                    ? 'text-primary-500 border-b-2 border-primary-500'
                    : 'text-gray-300 hover:text-white'
                }`}
              >
                <div className="flex items-center">
                  <Upload size={18} className="mr-2" />
                  Upload Document
                </div>
              </button>
            </div>
            
            {/* QR Scanner */}
            {method === 'qr' && (
              <QRScanner onScanSuccess={handleQRScanSuccess} />
            )}
            
            {/* URL Input */}
            {method === 'url' && (
              <div className="glass-panel p-6">
                <h3 className="text-lg font-semibold mb-4">Enter Credential URL</h3>
                <form onSubmit={handleUrlVerify}>
                  <div className="mb-4">
                    <input
                      type="text"
                      className="input-field"
                      placeholder="https://proofpass.io/credential/..."
                      value={urlInput}
                      onChange={(e) => setUrlInput(e.target.value)}
                      required
                    />
                  </div>
                  <button
                    type="submit"
                    className="btn btn-primary w-full"
                    disabled={!urlInput}
                  >
                    Verify Credential
                  </button>
                </form>
                <div className="mt-4 text-sm text-gray-400">
                  <p>For testing, include:</p>
                  <ul className="list-disc list-inside mt-2">
                    <li>"error" for an error result</li>
                    <li>"warning" for a warning result</li>
                    <li>any other text for a success result</li>
                  </ul>
                </div>
              </div>
            )}
            
            {/* Upload Document */}
            {method === 'upload' && (
              <CredentialUploader onUploadComplete={handleUploadComplete} />
            )}
          </>
        ) : (
          <div className="space-y-6">
            <VerificationResult result={result as VerificationResultData} />
            
            <div className="flex justify-center">
              <button
                onClick={resetVerification}
                className="btn btn-outline"
              >
                Verify Another Credential
              </button>
            </div>
          </div>
        )}
        
        {/* Instructions */}
        <div className="mt-12 pt-8 border-t border-dark-border">
          <h2 className="text-xl font-semibold mb-4">How Verification Works</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="glass-panel p-5">
              <div className="bg-primary-900/30 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                <QrCode size={24} className="text-primary-500" />
              </div>
              <h3 className="text-lg font-medium mb-2">1. Scan or Upload</h3>
              <p className="text-gray-300">
                Scan a QR code, enter a credential URL, or upload a document to verify.
              </p>
            </div>
            
            <div className="glass-panel p-5">
              <div className="bg-primary-900/30 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                <FileText size={24} className="text-primary-500" />
              </div>
              <h3 className="text-lg font-medium mb-2">2. Blockchain Verification</h3>
              <p className="text-gray-300">
                The credential is checked against the blockchain for authenticity and validity.
              </p>
            </div>
            
            <div className="glass-panel p-5">
              <div className="bg-primary-900/30 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                <Check size={24} className="text-primary-500" />
              </div>
              <h3 className="text-lg font-medium mb-2">3. Instant Results</h3>
              <p className="text-gray-300">
                Get immediate verification results that confirm the credential's authenticity.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerifyPage;