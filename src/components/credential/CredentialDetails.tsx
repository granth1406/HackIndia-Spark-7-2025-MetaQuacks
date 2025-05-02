import React from 'react';
import { Clock, Calendar, User, Shield, ExternalLink, CheckCircle, AlertTriangle } from 'lucide-react';

export interface CredentialDetailsProps {
  credential: {
    id: string;
    title: string;
    issuer: string;
    issuerAddress: string;
    holder: string;
    holderAddress: string;
    issuedAt: string;
    expiresAt?: string;
    metadataCID: string;
    documentCID: string;
    verified: boolean;
    status: 'valid' | 'expired' | 'revoked';
  };
}

const CredentialDetails: React.FC<CredentialDetailsProps> = ({ credential }) => {
  const getStatusBadge = () => {
    switch (credential.status) {
      case 'valid':
        return (
          <div className="flex items-center text-success-500">
            <CheckCircle size={16} className="mr-1" />
            <span>Valid</span>
          </div>
        );
      case 'expired':
        return (
          <div className="flex items-center text-warning-500">
            <Clock size={16} className="mr-1" />
            <span>Expired</span>
          </div>
        );
      case 'revoked':
        return (
          <div className="flex items-center text-error-500">
            <AlertTriangle size={16} className="mr-1" />
            <span>Revoked</span>
          </div>
        );
      default:
        return null;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const truncateAddress = (address: string) => {
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
  };

  return (
    <div className="glass-panel p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-semibold">{credential.title}</h3>
        {getStatusBadge()}
      </div>
      
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Issuer Info */}
          <div className="space-y-2">
            <div className="text-gray-400 text-sm">Issuer</div>
            <div className="flex items-start">
              <Shield size={18} className="text-primary-500 mt-1 mr-2" />
              <div>
                <div className="text-white">{credential.issuer}</div>
                <div className="text-gray-400 text-sm">
                  {truncateAddress(credential.issuerAddress)}
                </div>
              </div>
            </div>
          </div>
          
          {/* Holder Info */}
          <div className="space-y-2">
            <div className="text-gray-400 text-sm">Holder</div>
            <div className="flex items-start">
              <User size={18} className="text-primary-500 mt-1 mr-2" />
              <div>
                <div className="text-white">{credential.holder}</div>
                <div className="text-gray-400 text-sm">
                  {truncateAddress(credential.holderAddress)}
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Issued Date */}
          <div className="space-y-2">
            <div className="text-gray-400 text-sm">Issued On</div>
            <div className="flex items-center">
              <Calendar size={18} className="text-primary-500 mr-2" />
              <span className="text-white">{formatDate(credential.issuedAt)}</span>
            </div>
          </div>
          
          {/* Expiry Date */}
          {credential.expiresAt && (
            <div className="space-y-2">
              <div className="text-gray-400 text-sm">Expires On</div>
              <div className="flex items-center">
                <Clock size={18} className="text-primary-500 mr-2" />
                <span className="text-white">{formatDate(credential.expiresAt)}</span>
              </div>
            </div>
          )}
        </div>
        
        <div className="pt-2 border-t border-dark-border">
          <div className="text-gray-300 mb-2">Verification Information</div>
          
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <div className="text-gray-400">Blockchain Verification</div>
              <div className={credential.verified ? "text-success-500" : "text-error-500"}>
                {credential.verified ? "Verified" : "Not Verified"}
              </div>
            </div>
            
            <div className="flex justify-between items-center">
              <div className="text-gray-400">Document CID</div>
              <a 
                href={`https://ipfs.io/ipfs/${credential.documentCID}`} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-primary-400 hover:text-primary-300 flex items-center"
              >
                View Document <ExternalLink size={12} className="ml-1" />
              </a>
            </div>
            
            <div className="flex justify-between items-center">
              <div className="text-gray-400">Metadata CID</div>
              <a 
                href={`https://ipfs.io/ipfs/${credential.metadataCID}`} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-primary-400 hover:text-primary-300 flex items-center"
              >
                View Metadata <ExternalLink size={12} className="ml-1" />
              </a>
            </div>
          </div>
        </div>
        
        <div className="flex space-x-4">
          <button className="btn btn-primary">Share Credential</button>
          <button className="btn btn-outline">Download</button>
        </div>
      </div>
    </div>
  );
};

export default CredentialDetails;