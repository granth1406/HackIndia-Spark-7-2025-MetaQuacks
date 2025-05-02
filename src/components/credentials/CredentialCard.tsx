import React, { useState } from 'react';
import { Credential, CredentialStatus, CredentialType } from '../../types';
import { Calendar, Clock, Shield, Award, Briefcase, GraduationCap, UserCheck, Key, Medal, Download, MoreVertical, X, Trash2, AlertTriangle } from 'lucide-react';

interface CredentialCardProps {
  credential: Credential;
  onClick?: () => void;
  onDelete?: (credentialId: string) => void;
}

const CredentialCard: React.FC<CredentialCardProps> = ({ credential, onClick, onDelete }) => {
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [filename, setFilename] = useState(`${credential.name.replace(/\s+/g, '-').toLowerCase()}`);
  const [fileFormat, setFileFormat] = useState<'json' | 'pdf' | 'png'>('json');
  const [showActions, setShowActions] = useState(false);
  
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

  const handleSaveClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent triggering parent onClick
    setShowSaveModal(true);
    setShowActions(false);
  };
  
  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent triggering parent onClick
    setShowDeleteModal(true);
    setShowActions(false);
  };
  
  const handleMoreClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent triggering parent onClick
    setShowActions(!showActions);
  };

  const saveCredential = () => {
    // Create a JSON representation of the credential
    const credentialData = JSON.stringify(credential, null, 2);
    
    // Prepare the file based on selected format
    let fileData: string | Blob;
    let mimeType: string;
    let fileExtension: string;
    
    switch (fileFormat) {
      case 'json':
        fileData = credentialData;
        mimeType = 'application/json';
        fileExtension = '.json';
        break;
      case 'pdf':
        // In a real app, you'd generate a PDF here
        // For this demo, we'll just use JSON with a note
        fileData = JSON.stringify({
          ...credential,
          notice: "This would be a properly formatted PDF in a production app"
        }, null, 2);
        mimeType = 'application/json';
        fileExtension = '.json'; // Using .json since we're not creating a real PDF
        break;
      case 'png':
        // In a real app, you'd generate an image here
        // For this demo, just use JSON with a note
        fileData = JSON.stringify({
          ...credential,
          notice: "This would be a PNG image in a production app"
        }, null, 2);
        mimeType = 'application/json';
        fileExtension = '.json'; // Using .json since we're not creating a real PNG
        break;
    }
    
    // Create a blob and downloadable link
    const blob = new Blob([fileData], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    
    // Ensure filename has the correct extension
    const finalFilename = filename.endsWith(fileExtension) 
      ? filename 
      : `${filename}${fileExtension}`;
      
    link.download = finalFilename;
    link.click();
    
    // Clean up
    URL.revokeObjectURL(url);
    setShowSaveModal(false);
    setFilename(`${credential.name.replace(/\s+/g, '-').toLowerCase()}`);
  };
  
  const deleteCredential = () => {
    if (onDelete) {
      onDelete(credential.id);
    }
    setShowDeleteModal(false);
  };

  return (
    <>
      <div 
        className="card-glow holo-effect group cursor-pointer transform transition-all duration-300 hover:scale-[1.02] hover:shadow-neon-strong relative"
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
            <div className="flex items-center">
              {getStatusBadge(credential.status)}
              <button 
                className="ml-2 p-1 text-gray-400 hover:text-white transition-colors rounded-full hover:bg-dark-700"
                onClick={handleMoreClick}
              >
                <MoreVertical className="h-4 w-4" />
              </button>
            </div>
          </div>
          
          {/* Action dropdown */}
          {showActions && (
            <div className="absolute right-4 top-12 z-10 bg-dark-800 border border-dark-600 rounded-md shadow-lg overflow-hidden">
              <div className="py-1">
                <button
                  className="flex items-center w-full px-4 py-2 text-sm text-left text-gray-300 hover:bg-dark-700"
                  onClick={handleSaveClick}
                >
                  <Download className="h-4 w-4 mr-2" />
                  Save As...
                </button>
                <button
                  className="flex items-center w-full px-4 py-2 text-sm text-left text-error-500 hover:bg-dark-700"
                  onClick={handleDeleteClick}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </button>
              </div>
            </div>
          )}
          
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
      
      {/* Save Modal */}
      {showSaveModal && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-dark-900/90 backdrop-blur-sm p-4"
          onClick={(e) => {
            e.stopPropagation();
            setShowSaveModal(false);
          }}
        >
          <div 
            className="relative w-full max-w-md bg-dark-800 rounded-lg shadow-xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-4 border-b border-dark-700 flex justify-between items-center">
              <h3 className="text-lg font-medium text-white">Save Credential</h3>
              <button
                onClick={() => setShowSaveModal(false)}
                className="text-gray-400 hover:text-white"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            
            <div className="p-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Filename</label>
                  <input
                    type="text"
                    value={filename}
                    onChange={(e) => setFilename(e.target.value)}
                    className="input w-full"
                    placeholder="credential-filename"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">File Format</label>
                  <div className="flex gap-4">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="fileFormat"
                        value="json"
                        checked={fileFormat === 'json'}
                        onChange={() => setFileFormat('json')}
                        className="mr-2"
                      />
                      <span className="text-gray-300">JSON</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="fileFormat"
                        value="pdf"
                        checked={fileFormat === 'pdf'}
                        onChange={() => setFileFormat('pdf')}
                        className="mr-2"
                      />
                      <span className="text-gray-300">PDF</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="fileFormat"
                        value="png"
                        checked={fileFormat === 'png'}
                        onChange={() => setFileFormat('png')}
                        className="mr-2"
                      />
                      <span className="text-gray-300">PNG</span>
                    </label>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="p-4 border-t border-dark-700 flex justify-end">
              <button
                onClick={() => setShowSaveModal(false)}
                className="btn btn-ghost mr-2"
              >
                Cancel
              </button>
              <button
                onClick={saveCredential}
                className="btn btn-primary"
              >
                <Download className="w-4 h-4 mr-2" />
                Save
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-dark-900/90 backdrop-blur-sm p-4"
          onClick={(e) => {
            e.stopPropagation();
            setShowDeleteModal(false);
          }}
        >
          <div 
            className="relative w-full max-w-md bg-dark-800 rounded-lg shadow-xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-4 border-b border-dark-700 flex justify-between items-center">
              <h3 className="text-lg font-medium text-white flex items-center">
                <AlertTriangle className="h-5 w-5 text-error-500 mr-2" />
                Delete Credential
              </h3>
              <button
                onClick={() => setShowDeleteModal(false)}
                className="text-gray-400 hover:text-white"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            
            <div className="p-6">
              <p className="text-gray-300 mb-2">
                Are you sure you want to delete this credential?
              </p>
              <p className="text-gray-400 text-sm">
                <strong>{credential.name}</strong> issued by <strong>{credential.issuer}</strong>
              </p>
              <p className="text-error-500 text-sm mt-4">
                This action cannot be undone.
              </p>
            </div>
            
            <div className="p-4 border-t border-dark-700 flex justify-end">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="btn btn-ghost mr-2"
              >
                Cancel
              </button>
              <button
                onClick={deleteCredential}
                className="btn btn-error"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default CredentialCard;