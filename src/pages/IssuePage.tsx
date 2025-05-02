import React, { useState } from 'react';
import { Shield, FileCheck, CheckCircle, AlertCircle } from 'lucide-react';
import { useAccount } from 'wagmi';
import { useWeb3Storage } from '../contexts/Web3StorageContext';
import CredentialUploader from '../components/credential/CredentialUploader';
import CredentialForm, { CredentialFormData } from '../components/credential/CredentialForm';

type IssueStatus = 'idle' | 'uploading' | 'issuing' | 'success' | 'error';

const IssuePage: React.FC = () => {
  const { isConnected } = useAccount();
  const [currentStep, setCurrentStep] = useState(1);
  const [status, setStatus] = useState<IssueStatus>('idle');
  const [documentCID, setDocumentCID] = useState<string | null>(null);
  const [documentName, setDocumentName] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [transactionHash, setTransactionHash] = useState<string | null>(null);

  const handleUploadComplete = (cid: string, file: File) => {
    setDocumentCID(cid);
    setDocumentName(file.name);
    setCurrentStep(2);
  };

  const handleIssueCredential = async (formData: CredentialFormData) => {
    if (!documentCID) return;
    
    try {
      setStatus('issuing');
      
      // Simulate blockchain transaction delay
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Simulate successful transaction
      setTransactionHash('0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef');
      setStatus('success');
    } catch (error) {
      console.error('Error issuing credential:', error);
      setErrorMessage('Failed to issue credential. Please try again.');
      setStatus('error');
    }
  };

  const resetForm = () => {
    setCurrentStep(1);
    setStatus('idle');
    setDocumentCID(null);
    setDocumentName(null);
    setErrorMessage(null);
    setTransactionHash(null);
  };

  if (!isConnected) {
    return (
      <div className="page-container flex items-center justify-center min-h-[70vh]">
        <div className="glass-panel p-8 text-center max-w-md">
          <Shield size={48} className="text-primary-500 mx-auto mb-4" />
          <h2 className="text-2xl font-display font-bold mb-4">Connect Your Wallet</h2>
          <p className="text-gray-300 mb-6">
            You need to connect your wallet to issue credentials.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container">
      <div className="max-w-3xl mx-auto">
        <h1 className="section-title mb-2">Issue New Credential</h1>
        <p className="text-gray-300 mb-8">
          Create and issue verifiable credentials secured by blockchain technology.
        </p>
        
        {/* Status display for success/error */}
        {status === 'success' && (
          <div className="glass-panel p-6 mb-8 border border-success-600 bg-success-900/20">
            <div className="flex items-center mb-4">
              <CheckCircle size={24} className="text-success-500 mr-2" />
              <h3 className="text-xl font-semibold text-success-100">Credential Issued Successfully!</h3>
            </div>
            <p className="text-gray-300 mb-4">
              Your credential has been successfully created and issued on the blockchain.
            </p>
            <div className="bg-dark-card p-4 rounded-lg text-sm mb-4">
              <div className="mb-2">
                <span className="text-gray-400">Transaction Hash:</span>
                <a 
                  href={`https://etherscan.io/tx/${transactionHash}`}
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="ml-2 text-primary-400 hover:text-primary-300"
                >
                  {transactionHash}
                </a>
              </div>
              {documentCID && (
                <div>
                  <span className="text-gray-400">Document CID:</span>
                  <a 
                    href={`https://ipfs.io/ipfs/${documentCID}`}
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="ml-2 text-primary-400 hover:text-primary-300"
                  >
                    {documentCID}
                  </a>
                </div>
              )}
            </div>
            <div className="flex justify-center">
              <button 
                onClick={resetForm}
                className="btn btn-primary"
              >
                Issue Another Credential
              </button>
            </div>
          </div>
        )}
        
        {status === 'error' && (
          <div className="glass-panel p-6 mb-8 border border-error-600 bg-error-900/20">
            <div className="flex items-center mb-4">
              <AlertCircle size={24} className="text-error-500 mr-2" />
              <h3 className="text-xl font-semibold text-error-100">Error Issuing Credential</h3>
            </div>
            <p className="text-gray-300 mb-4">
              {errorMessage || 'An error occurred while issuing the credential. Please try again.'}
            </p>
            <div className="flex justify-center">
              <button 
                onClick={() => setStatus('idle')}
                className="btn btn-primary"
              >
                Try Again
              </button>
            </div>
          </div>
        )}
        
        {status !== 'success' && status !== 'error' && (
          <>
            {/* Progress Steps */}
            <div className="flex items-center mb-8">
              <div className={`flex items-center justify-center w-8 h-8 rounded-full mr-2 ${
                currentStep >= 1 ? 'bg-primary-600 text-white' : 'bg-dark-card text-gray-400'
              }`}>
                1
              </div>
              <div className={`text-sm ${currentStep >= 1 ? 'text-white' : 'text-gray-400'}`}>
                Upload Document
              </div>
              
              <div className={`h-0.5 w-8 mx-2 ${
                currentStep >= 2 ? 'bg-primary-600' : 'bg-dark-card'
              }`}></div>
              
              <div className={`flex items-center justify-center w-8 h-8 rounded-full mr-2 ${
                currentStep >= 2 ? 'bg-primary-600 text-white' : 'bg-dark-card text-gray-400'
              }`}>
                2
              </div>
              <div className={`text-sm ${currentStep >= 2 ? 'text-white' : 'text-gray-400'}`}>
                Enter Details
              </div>
              
              <div className={`h-0.5 w-8 mx-2 ${
                currentStep >= 3 ? 'bg-primary-600' : 'bg-dark-card'
              }`}></div>
              
              <div className={`flex items-center justify-center w-8 h-8 rounded-full mr-2 ${
                currentStep >= 3 ? 'bg-primary-600 text-white' : 'bg-dark-card text-gray-400'
              }`}>
                3
              </div>
              <div className={`text-sm ${currentStep >= 3 ? 'text-white' : 'text-gray-400'}`}>
                Issue & Confirm
              </div>
            </div>
            
            {currentStep === 1 && (
              <CredentialUploader onUploadComplete={handleUploadComplete} />
            )}
            
            {currentStep === 2 && (
              <>
                <CredentialForm 
                  onSubmit={handleIssueCredential} 
                  documentCID={documentCID || undefined}
                  documentName={documentName || undefined}
                />
                
                <div className="flex justify-between mt-6">
                  <button 
                    onClick={() => setCurrentStep(1)}
                    className="btn btn-outline"
                  >
                    Back
                  </button>
                </div>
              </>
            )}
            
            {/* Issuing Spinner */}
            {status === 'issuing' && (
              <div className="fixed top-0 left-0 right-0 bottom-0 bg-dark-background/80 backdrop-blur-sm flex items-center justify-center z-50">
                <div className="glass-panel p-8 max-w-md text-center">
                  <div className="w-16 h-16 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
                  <h3 className="text-xl font-semibold mb-2">Issuing Credential</h3>
                  <p className="text-gray-300">
                    Please wait while your credential is being issued on the blockchain...
                  </p>
                </div>
              </div>
            )}
          </>
        )}
        
        {/* How it works section */}
        <div className="mt-12 pt-8 border-t border-dark-border">
          <h2 className="text-xl font-semibold mb-4">How Credential Issuance Works</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="glass-panel p-5">
              <div className="bg-primary-900/30 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                <FileCheck size={24} className="text-primary-500" />
              </div>
              <h3 className="text-lg font-medium mb-2">1. Upload Document</h3>
              <p className="text-gray-300">
                Upload the document you want to certify. It will be stored on IPFS, making it immutable and permanently accessible.
              </p>
            </div>
            
            <div className="glass-panel p-5">
              <div className="bg-primary-900/30 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                <Shield size={24} className="text-primary-500" />
              </div>
              <h3 className="text-lg font-medium mb-2">2. Create Credential</h3>
              <p className="text-gray-300">
                Specify who the credential is for and details about it, such as expiration date and credential type.
              </p>
            </div>
            
            <div className="glass-panel p-5">
              <div className="bg-primary-900/30 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                <CheckCircle size={24} className="text-primary-500" />
              </div>
              <h3 className="text-lg font-medium mb-2">3. Issue On-Chain</h3>
              <p className="text-gray-300">
                The credential is issued on blockchain, creating a permanent, verifiable record that can be shared and verified.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IssuePage;