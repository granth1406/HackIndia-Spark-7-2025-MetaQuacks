import React, { createContext, useContext, useState, ReactNode } from 'react';
import { uploadFile, retrieveFile, makeStorageUrl } from '../lib/web3Storage';

interface Web3StorageContextType {
  uploadDocument: (file: File) => Promise<string>;
  retrieveDocument: (cid: string) => Promise<File | null>;
  getDocumentUrl: (cid: string, fileName: string) => string;
  uploadingStatus: string;
  isUploading: boolean;
}

const Web3StorageContext = createContext<Web3StorageContextType | undefined>(undefined);

export function Web3StorageProvider({ children }: { children: ReactNode }) {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadingStatus, setUploadingStatus] = useState('');

  const uploadDocument = async (file: File): Promise<string> => {
    try {
      setIsUploading(true);
      setUploadingStatus('Preparing document for upload...');
      
      // Small delay to show the first status message
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setUploadingStatus('Uploading to IPFS via Web3.Storage...');
      const cid = await uploadFile(file);
      
      setUploadingStatus('Document uploaded successfully!');
      return cid;
    } catch (error) {
      setUploadingStatus('Upload failed. Please try again.');
      console.error('Error uploading document:', error);
      throw error;
    } finally {
      setIsUploading(false);
    }
  };

  const retrieveDocument = async (cid: string): Promise<File | null> => {
    try {
      return await retrieveFile(cid);
    } catch (error) {
      console.error('Error retrieving document:', error);
      return null;
    }
  };

  const getDocumentUrl = (cid: string, fileName: string): string => {
    return makeStorageUrl(cid, fileName);
  };

  return (
    <Web3StorageContext.Provider value={{
      uploadDocument,
      retrieveDocument,
      getDocumentUrl,
      uploadingStatus,
      isUploading
    }}>
      {children}
    </Web3StorageContext.Provider>
  );
}

export function useWeb3Storage() {
  const context = useContext(Web3StorageContext);
  if (context === undefined) {
    throw new Error('useWeb3Storage must be used within a Web3StorageProvider');
  }
  return context;
}