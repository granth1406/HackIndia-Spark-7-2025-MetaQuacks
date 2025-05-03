import { Web3Storage } from 'web3.storage';

// Initialize Web3.Storage client
// In production, you should use environment variables for this
const WEB3_STORAGE_TOKEN = 'YOUR_WEB3_STORAGE_TOKEN';

let client: Web3Storage | null = null;

export function getWeb3StorageClient(): Web3Storage {
  if (!client) {
    client = new Web3Storage({ token: WEB3_STORAGE_TOKEN });
  }
  return client;
}

// Upload a file to Web3.Storage
export async function uploadFile(file: File): Promise<string> {
  const client = getWeb3StorageClient();
  const cid = await client.put([file]);
  return cid;
}

// Retrieve a file from Web3.Storage
export async function retrieveFile(cid: string): Promise<any> {
  const client = getWeb3StorageClient();
  const res = await client.get(cid);
  if (!res) throw new Error('Failed to retrieve file');
  
  const files = await res.files();
  return files[0];
}

// Helper to create a URL for a stored file
export function makeStorageUrl(cid: string, fileName: string): string {
  return `https://${cid}.ipfs.w3s.link/${fileName}`;
}