import React, { useState, useRef } from 'react';
import { Upload, FileCheck, AlertTriangle, Loader2 } from 'lucide-react';
import { useWeb3Storage } from '../../contexts/Web3StorageContext';

interface CredentialUploaderProps {
  onUploadComplete: (cid: string, file: File) => void;
}

const CredentialUploader: React.FC<CredentialUploaderProps> = ({ onUploadComplete }) => {
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const { uploadDocument, isUploading, uploadingStatus } = useWeb3Storage();

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = (file: File) => {
    setError(null);
    
    // Check file type
    const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg'];
    if (!allowedTypes.includes(file.type)) {
      setError('Only PDF, JPEG, and PNG files are supported.');
      return;
    }
    
    // Check file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      setError('File size exceeds the 10MB limit.');
      return;
    }
    
    setSelectedFile(file);
  };

  const handleUpload = async () => {
    if (!selectedFile) return;
    
    try {
      const cid = await uploadDocument(selectedFile);
      onUploadComplete(cid, selectedFile);
    } catch (error) {
      setError('Failed to upload document. Please try again.');
      console.error('Upload error:', error);
    }
  };

  const openFileSelector = () => {
    if (inputRef.current) {
      inputRef.current.click();
    }
  };

  return (
    <div className="glass-panel p-6 w-full">
      <h3 className="text-lg font-semibold mb-4">Upload Credential Document</h3>
      
      <div
        className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors ${
          dragActive ? 'border-primary-500 bg-primary-900/20' : 'border-dark-border'
        } ${error ? 'border-error-500' : ''}`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          ref={inputRef}
          type="file"
          className="hidden"
          onChange={handleChange}
          accept=".pdf,.png,.jpg,.jpeg"
        />
        
        {!selectedFile && !isUploading && (
          <div className="flex flex-col items-center">
            <Upload size={40} className="text-gray-400 mb-4" />
            <p className="text-white mb-2">
              Drag and drop your document here, or
            </p>
            <button
              className="btn btn-primary mt-2"
              onClick={openFileSelector}
            >
              Browse Files
            </button>
            <p className="text-gray-400 text-sm mt-4">
              Supported formats: PDF, PNG, JPG (Max: 10MB)
            </p>
          </div>
        )}
        
        {selectedFile && !isUploading && (
          <div>
            <div className="flex items-center justify-center space-x-2 mb-4">
              <FileCheck size={24} className="text-success-500" />
              <span className="text-white">{selectedFile.name}</span>
            </div>
            
            <div className="flex justify-center space-x-2">
              <button
                className="btn btn-outline"
                onClick={() => setSelectedFile(null)}
              >
                Change
              </button>
              <button
                className="btn btn-primary"
                onClick={handleUpload}
                disabled={isUploading}
              >
                Upload to IPFS
              </button>
            </div>
          </div>
        )}
        
        {isUploading && (
          <div className="flex flex-col items-center">
            <Loader2 size={40} className="text-primary-500 animate-spin mb-4" />
            <p className="text-white mb-1">{uploadingStatus}</p>
            <p className="text-gray-400 text-sm">Please do not close the browser</p>
          </div>
        )}
        
        {error && (
          <div className="mt-4 text-error-500 flex items-center justify-center">
            <AlertTriangle size={16} className="mr-2" />
            <span>{error}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default CredentialUploader;