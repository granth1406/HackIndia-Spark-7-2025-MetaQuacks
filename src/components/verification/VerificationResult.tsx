import React from 'react';
import { CheckCircle, XCircle, AlertTriangle, Info, ExternalLink } from 'lucide-react';

interface VerificationResultProps {
  result: {
    status: 'success' | 'error' | 'warning';
    credentialId?: string;
    title?: string;
    issuer?: string;
    holder?: string;
    issuedDate?: string;
    expiryDate?: string;
    message: string;
    documentCID?: string;
  };
}

const VerificationResult: React.FC<VerificationResultProps> = ({ result }) => {
  const getStatusIcon = () => {
    switch (result.status) {
      case 'success':
        return <CheckCircle size={48} className="text-success-500" />;
      case 'error':
        return <XCircle size={48} className="text-error-500" />;
      case 'warning':
        return <AlertTriangle size={48} className="text-warning-500" />;
      default:
        return <Info size={48} className="text-gray-400" />;
    }
  };

  const getStatusColor = () => {
    switch (result.status) {
      case 'success':
        return 'border-success-600 bg-success-900/20';
      case 'error':
        return 'border-error-600 bg-error-900/20';
      case 'warning':
        return 'border-warning-600 bg-warning-900/20';
      default:
        return 'border-dark-border';
    }
  };

  return (
    <div className={`border rounded-xl p-6 ${getStatusColor()}`}>
      <div className="flex flex-col items-center text-center mb-6">
        {getStatusIcon()}
        <h3 className="text-xl font-bold mt-4 mb-2">
          {result.status === 'success' ? 'Verification Successful' : 
           result.status === 'error' ? 'Verification Failed' : 
           'Verification Warning'}
        </h3>
        <p className="text-gray-300">{result.message}</p>
      </div>
      
      {result.status === 'success' && result.credentialId && (
        <div className="space-y-4">
          <div className="border-t border-b border-dark-border py-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <div className="text-gray-400 text-sm mb-1">Credential Title</div>
                <div className="text-white font-medium">{result.title}</div>
              </div>
              
              <div>
                <div className="text-gray-400 text-sm mb-1">Credential ID</div>
                <div className="text-white font-medium">{result.credentialId}</div>
              </div>
              
              <div>
                <div className="text-gray-400 text-sm mb-1">Issuer</div>
                <div className="text-white font-medium">{result.issuer}</div>
              </div>
              
              <div>
                <div className="text-gray-400 text-sm mb-1">Holder</div>
                <div className="text-white font-medium">{result.holder}</div>
              </div>
              
              {result.issuedDate && (
                <div>
                  <div className="text-gray-400 text-sm mb-1">Issue Date</div>
                  <div className="text-white font-medium">{result.issuedDate}</div>
                </div>
              )}
              
              {result.expiryDate && (
                <div>
                  <div className="text-gray-400 text-sm mb-1">Expiry Date</div>
                  <div className="text-white font-medium">{result.expiryDate}</div>
                </div>
              )}
            </div>
          </div>
          
          {result.documentCID && (
            <div className="flex justify-between items-center">
              <div className="text-gray-400">View Document</div>
              <a 
                href={`https://ipfs.io/ipfs/${result.documentCID}`} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-primary-400 hover:text-primary-300 flex items-center"
              >
                Open on IPFS <ExternalLink size={12} className="ml-1" />
              </a>
            </div>
          )}
          
          <div className="flex justify-center mt-4">
            <button className="btn btn-primary">
              Save Verification Result
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default VerificationResult;