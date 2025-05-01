import React from 'react';
import { Credential, CredentialStatus, CredentialType } from '../../types';
import { Calendar, Clock, Shield, Award, Briefcase, GraduationCap, UserCheck, Key, Medal } from 'lucide-react';

interface CredentialCardProps {
  credential: Credential;
  onClick?: () => void;
}

const CredentialCard: React.FC<CredentialCardProps> = ({ credential, onClick }) => {
  // Define icons and colors based on credential type
  const getTypeIcon = (type: CredentialType) => {
    switch (type) {
      case CredentialType.IDENTITY:
        return <UserCheck className="h-5 w-5 text-neon-blue" />;
      case CredentialType.EDUCATION:
        return <GraduationCap className="h-5 w-5 text-neon-purple" />;
      case CredentialType.EMPLOYMENT:
        return <Briefcase className="h-5 w-5 text-neon-pink" />;
      case CredentialType.CERTIFICATION:
        return <Award className="h-5 w-5 text-success-500" />;
      case CredentialType.MEMBERSHIP:
        return <Shield className="h-5 w-5 text-warning-500" />;
      case CredentialType.ACCESS:
        return <Key className="h-5 w-5 text-error-500" />;
      case CredentialType.ACHIEVEMENT:
        return <Medal className="h-5 w-5 text-accent-500" />;
      default:
        return <Shield className="h-5 w-5 text-secondary-500" />;
    }
  };

  // Format date string
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  // Get status badge color
  const getStatusBadge = (status: CredentialStatus) => {
    switch (status) {
      case CredentialStatus.ACTIVE:
        return <span className="badge badge-success">Active</span>;
      case CredentialStatus.EXPIRED:
        return <span className="badge badge-warning">Expired</span>;
      case CredentialStatus.REVOKED:
        return <span className="badge badge-error">Revoked</span>;
      case CredentialStatus.PENDING:
        return <span className="badge bg-dark-700 text-gray-300 border border-dark-500">Pending</span>;
      default:
        return null;
    }
  };

  return (
    <div 
      className="card-glow holo-effect group cursor-pointer transform transition-all duration-300 hover:scale-[1.02] hover:shadow-neon-strong"
      onClick={onClick}
    >
      <div className="flex flex-col h-full">
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center">
            <div className="p-2 rounded-lg bg-dark-700">
              {getTypeIcon(credential.type)}
            </div>
            <div className="ml-3">
              <h3 className="text-lg font-semibold text-white">{credential.name}</h3>
              <p className="text-sm text-gray-400">{credential.issuer}</p>
            </div>
          </div>
          {getStatusBadge(credential.status)}
        </div>
        
        <div className="flex-grow">
          {/* Credential metadata could be rendered here */}
          {credential.metadata && credential.metadata.description && (
            <p className="text-sm text-gray-300 mb-4">{credential.metadata.description}</p>
          )}
        </div>
        
        <div className="flex justify-between text-xs text-gray-400 mt-4 pt-4 border-t border-dark-600">
          <div className="flex items-center">
            <Calendar className="h-3 w-3 mr-1" />
            <span>Issued: {formatDate(credential.issuedAt)}</span>
          </div>
          {credential.expiresAt && (
            <div className="flex items-center">
              <Clock className="h-3 w-3 mr-1" />
              <span>Expires: {formatDate(credential.expiresAt)}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CredentialCard;