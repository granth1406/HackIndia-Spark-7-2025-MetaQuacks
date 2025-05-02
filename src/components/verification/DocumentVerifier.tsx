// filepath: f:\Hackathon\ProofPass\src\components\verification\DocumentVerifier.tsx
import React, { useState, useRef } from 'react';
import { 
  Upload, 
  Check, 
  X, 
  AlertCircle, 
  FileText, 
  Blocks, 
  Hash,
  Key,
  Ban,
  Calendar
} from 'lucide-react';
import { blockchainVerificationService, VerificationResult } from '../../services/BlockchainVerificationService';
import { Credential } from '../../types';

interface DocumentVerifierProps {
  onVerificationComplete?: (result: {credential: Credential | null, verification: VerificationResult}) => void;
}

const DocumentVerifier: React.FC<DocumentVerifierProps> = ({ onVerificationComplete }) => {
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationResult, setVerificationResult] = useState<VerificationResult | null>(null);
  const [verifiedCredential, setVerifiedCredential] = useState<Credential | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsVerifying(true);
    setError(null);
    setVerificationResult(null);
    setVerifiedCredential(null);

    try {
      // Verify the credential file
      const result = await blockchainVerificationService.verifyCredentialFile(file);
      
      setVerificationResult(result.verification);
      setVerifiedCredential(result.credential);
      
      // Notify parent component if callback provided
      if (onVerificationComplete) {
        onVerificationComplete(result);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred during verification');
    } finally {
      setIsVerifying(false);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      const fileInput = fileInputRef.current;
      if (fileInput) {
        // Create a new DataTransfer object and add the file
        const dataTransfer = new DataTransfer();
        dataTransfer.items.add(files[0]);
        
        // Set the files property on the file input
        fileInput.files = dataTransfer.files;
        
        // Manually trigger the change event
        const event = new Event('change', { bubbles: true });
        fileInput.dispatchEvent(event);
      }
    }
  };

  const reset = () => {
    setVerificationResult(null);
    setVerifiedCredential(null);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const formatDate = (timestamp: number | null) => {
    if (!timestamp) return 'N/A';
    return new Date(timestamp).toLocaleString();
  };

  return (
    <div className="glass-panel p-6">
      {!verificationResult && !isVerifying && !error && (
        <div 
          className="border-2 border-dashed border-dark-600 rounded-lg p-8 text-center cursor-pointer hover:border-primary-600 transition-colors"
          onClick={() => fileInputRef.current?.click()}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
        >
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 rounded-full bg-dark-700 flex items-center justify-center mb-4">
              <Upload className="w-8 h-8 text-primary-400" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Verify Document</h3>
            <p className="text-gray-400 mb-4">
              Upload a credential file to verify its authenticity on the blockchain
            </p>
            <p className="text-xs text-gray-500">
              Drag and drop or click to select a file (.json)
            </p>
            <input 
              type="file" 
              ref={fileInputRef}
              className="hidden" 
              accept=".json"
              onChange={handleFileChange}
            />
          </div>
        </div>
      )}

      {isVerifying && (
        <div className="flex flex-col items-center text-center p-8">
          <div className="w-16 h-16 rounded-full bg-dark-700 flex items-center justify-center mb-6">
            <div className="w-8 h-8 border-4 border-t-primary-500 border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin"></div>
          </div>
          <h3 className="text-xl font-semibold mb-2">Verifying Document</h3>
          <p className="text-gray-400">
            Checking blockchain records and validating the credential...
          </p>
        </div>
      )}

      {error && (
        <div className="flex flex-col items-center text-center p-8">
          <div className="w-16 h-16 rounded-full bg-error-900/30 flex items-center justify-center mb-6 border-2 border-error-500">
            <AlertCircle className="w-8 h-8 text-error-500" />
          </div>
          <h3 className="text-xl font-semibold mb-2 text-error-500">Verification Error</h3>
          <p className="text-gray-400 mb-6">
            {error}
          </p>
          <button
            onClick={reset}
            className="btn btn-primary"
          >
            Try Again
          </button>
        </div>
      )}

      {verificationResult && verifiedCredential && (
        <div className="flex flex-col">
          <div className="flex flex-col sm:flex-row items-center sm:items-start mb-6">
            <div className={`w-16 h-16 rounded-full flex items-center justify-center mr-6 ${
              verificationResult.isValid 
                ? 'bg-success-900/30 border-2 border-success-500' 
                : 'bg-error-900/30 border-2 border-error-500'
            }`}>
              {verificationResult.isValid ? (
                <Check className="w-8 h-8 text-success-500" />
              ) : (
                <X className="w-8 h-8 text-error-500" />
              )}
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-1">
                {verificationResult.isValid ? (
                  <span className="text-success-500">Credential Verified</span>
                ) : (
                  <span className="text-error-500">Verification Failed</span>
                )}
              </h3>
              <p className="text-gray-400">
                {verificationResult.isValid 
                  ? 'This credential has been successfully verified on the blockchain.'
                  : verificationResult.errorMessage || 'This credential could not be verified on the blockchain.'}
              </p>
            </div>
          </div>
          
          <div className="bg-dark-800/50 rounded-lg p-4 mb-6">
            <h4 className="text-md font-semibold mb-3 flex items-center">
              <FileText className="w-5 h-5 mr-2 text-primary-400" />
              Credential Details
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="flex flex-col">
                <span className="text-xs text-gray-500">Name</span>
                <span className="text-sm">{verifiedCredential.name}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-xs text-gray-500">Issuer</span>
                <span className="text-sm">{verifiedCredential.issuer}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-xs text-gray-500">Type</span>
                <span className="text-sm capitalize">{verifiedCredential.type}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-xs text-gray-500">Status</span>
                <span className="text-sm capitalize">{verifiedCredential.status}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-xs text-gray-500">Issue Date</span>
                <span className="text-sm">{new Date(verifiedCredential.issuedAt).toLocaleDateString()}</span>
              </div>
              {verifiedCredential.expiresAt && (
                <div className="flex flex-col">
                  <span className="text-xs text-gray-500">Expiry Date</span>
                  <span className="text-sm">{new Date(verifiedCredential.expiresAt).toLocaleDateString()}</span>
                </div>
              )}
            </div>
          </div>
          
          <div className="bg-dark-800/50 rounded-lg p-4 mb-6">
            <h4 className="text-md font-semibold mb-3 flex items-center">
              <Blocks className="w-5 h-5 mr-2 text-primary-400" />
              Blockchain Verification Details
            </h4>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="flex items-center text-sm">
                  <Hash className="w-4 h-4 mr-2 text-gray-400" />
                  Hash Match
                </span>
                <span>
                  {verificationResult.hashMatch ? (
                    <Check className="w-5 h-5 text-success-500" />
                  ) : (
                    <X className="w-5 h-5 text-error-500" />
                  )}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center text-sm">
                  <Key className="w-4 h-4 mr-2 text-gray-400" />
                  Signature Valid
                </span>
                <span>
                  {verificationResult.signatureValid ? (
                    <Check className="w-5 h-5 text-success-500" />
                  ) : (
                    <X className="w-5 h-5 text-error-500" />
                  )}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center text-sm">
                  <Ban className="w-4 h-4 mr-2 text-gray-400" />
                  Revocation Status
                </span>
                <span>
                  {verificationResult.revocationStatus ? (
                    <span className="text-xs bg-error-900/50 text-error-300 px-2 py-1 rounded-full">Revoked</span>
                  ) : (
                    <span className="text-xs bg-success-900/50 text-success-300 px-2 py-1 rounded-full">Not Revoked</span>
                  )}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center text-sm">
                  <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                  Verification Time
                </span>
                <span className="text-xs text-gray-400">
                  {formatDate(verificationResult.timestamp)}
                </span>
              </div>
              {verificationResult.blockNumber && (
                <div className="flex items-center justify-between">
                  <span className="flex items-center text-sm">
                    <Blocks className="w-4 h-4 mr-2 text-gray-400" />
                    Block Number
                  </span>
                  <span className="text-xs text-gray-400">
                    {verificationResult.blockNumber}
                  </span>
                </div>
              )}
            </div>
          </div>
          
          {verificationResult.transactionHash && (
            <div className="bg-dark-800/50 rounded-lg p-4 mb-6">
              <h4 className="text-md font-semibold mb-2 flex items-center">
                <Hash className="w-5 h-5 mr-2 text-primary-400" />
                Transaction Hash
              </h4>
              <div className="bg-dark-900 p-2 rounded overflow-x-auto">
                <code className="text-xs text-primary-300 break-all">
                  {verificationResult.transactionHash}
                </code>
              </div>
            </div>
          )}
          
          <div className="flex gap-4 mt-2">
            <button
              onClick={reset}
              className="btn btn-ghost"
            >
              Verify Another
            </button>
            {verificationResult.isValid && (
              <button
                onClick={() => {
                  // In a real app, this would add the credential to the user's collection
                  alert('Credential saved to your collection!');
                }}
                className="btn btn-primary"
              >
                Save to My Credentials
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default DocumentVerifier;