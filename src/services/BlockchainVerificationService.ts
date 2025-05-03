// filepath: f:\Hackathon\ProofPass\src\services\BlockchainVerificationService.ts
import { ethers } from 'ethers';
import { Credential, CredentialStatus } from '../types';

// This would be a real smart contract address in a production environment
const VERIFICATION_CONTRACT_ADDRESS = '0x1234567890123456789012345678901234567890';

// This would be the ABI for the verification contract 
const VERIFICATION_CONTRACT_ABI = [
  'function verifyCredential(string credentialId, string issuer, uint256 timestamp, bytes signature) view returns (bool)',
  'function revokeCredential(string credentialId)',
  'function isCredentialRevoked(string credentialId) view returns (bool)',
  'function registerCredential(string credentialId, string data, bytes signature)'
];

export interface VerificationResult {
  isValid: boolean;
  blockchainRecordExists: boolean;
  hashMatch: boolean;
  signatureValid: boolean;
  revocationStatus: boolean;
  timestamp: number | null;
  blockNumber: number | null;
  transactionHash: string | null;
  errorMessage?: string;
}

export class BlockchainVerificationService {
  private provider: ethers.BrowserProvider | null = null;
  private contract: ethers.Contract | null = null;

  constructor() {
    // Initialize the provider if window.ethereum is available
    if (typeof window !== 'undefined' && window.ethereum) {
      this.provider = new ethers.BrowserProvider(window.ethereum);
      this.contract = new ethers.Contract(
        VERIFICATION_CONTRACT_ADDRESS,
        VERIFICATION_CONTRACT_ABI,
        this.provider
      );
    }
  }

  /**
   * Verify a credential using blockchain
   * @param credential The credential to verify
   */
  public async verifyCredential(
    credential: Credential
  ): Promise<VerificationResult> {
    try {
      if (!this.provider || !this.contract) {
        return this.simulateVerification(credential);
      }

      // In a real implementation, we would:
      // 1. Call the smart contract to verify the credential
      // 2. Check the hash of the credential against the stored hash
      // 3. Verify the signature from the issuer
      // 4. Check revocation status

      // For now, we'll simulate the verification process
      return this.simulateVerification(credential);
    } catch (error) {
      console.error('Error verifying credential:', error);
      return {
        isValid: false,
        blockchainRecordExists: false,
        hashMatch: false,
        signatureValid: false,
        revocationStatus: false,
        timestamp: null,
        blockNumber: null,
        transactionHash: null,
        errorMessage: error instanceof Error ? error.message : 'Unknown error during verification'
      };
    }
  }

  /**
   * Registers a credential on the blockchain
   * @param credential The credential to register
   */
  public async registerCredential(credential: Credential): Promise<boolean> {
    try {
      if (!this.provider || !this.contract) {
        console.warn('Provider or contract not available, simulating registration');
        // Simulate successful registration
        return true;
      }

      // In a real implementation, we would:
      // 1. Create a hash of the credential data
      const credentialData = JSON.stringify(credential);
      console.log(`Would register credential: ${credential.id} with data hash length: ${credentialData.length}`);
      
      // 2. Sign the hash using the user's private key (this would happen client-side)
      // 3. Call the smart contract to register the credential

      // For demo purposes, just return true
      return true;
    } catch (error) {
      console.error('Error registering credential:', error);
      return false;
    }
  }

  /**
   * Verify a credential from a file
   * @param file The file containing the credential
   */
  public async verifyCredentialFile(file: File): Promise<{credential: Credential | null, verification: VerificationResult}> {
    try {
      // Read file content
      const fileContent = await this.readFileContent(file);
      
      // Parse the credential
      const credential = JSON.parse(fileContent) as Credential;
      
      // Verify the credential
      const verificationResult = await this.verifyCredential(credential);
      
      return {
        credential,
        verification: verificationResult
      };
    } catch (error) {
      console.error('Error verifying credential file:', error);
      return {
        credential: null,
        verification: {
          isValid: false,
          blockchainRecordExists: false,
          hashMatch: false,
          signatureValid: false,
          revocationStatus: false,
          timestamp: null,
          blockNumber: null,
          transactionHash: null,
          errorMessage: error instanceof Error ? error.message : 'Invalid credential file format'
        }
      };
    }
  }

  /**
   * Helper method to read file content
   */
  private readFileContent(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          resolve(event.target.result as string);
        } else {
          reject(new Error('Failed to read file'));
        }
      };
      reader.onerror = () => reject(new Error('File read error'));
      reader.readAsText(file);
    });
  }

  /**
   * Simulate blockchain verification (for demo purposes)
   */
  private simulateVerification(credential: Credential): VerificationResult {
    // For demo, simulate successful verification for valid credentials
    const isValidCredential = credential.status !== CredentialStatus.REVOKED;
    
    // If ID contains "invalid" or status is REVOKED, simulate verification failure
    const simulatedFailure = credential.id.includes('invalid') || 
                            credential.status === CredentialStatus.REVOKED;
    
    if (simulatedFailure) {
      return {
        isValid: false,
        blockchainRecordExists: true,
        hashMatch: false,
        signatureValid: false,
        revocationStatus: credential.status === CredentialStatus.REVOKED,
        timestamp: Date.now() - 86400000, // 1 day ago
        blockNumber: 12345678,
        transactionHash: '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef',
        errorMessage: 'Credential has been revoked or is invalid'
      };
    }
    
    return {
      isValid: isValidCredential,
      blockchainRecordExists: true,
      hashMatch: true,
      signatureValid: true,
      revocationStatus: credential.status === CredentialStatus.REVOKED,
      timestamp: Date.now() - 86400000, // 1 day ago
      blockNumber: 12345678,
      transactionHash: '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef',
      errorMessage: undefined
    };
  }
}

// Export singleton instance
export const blockchainVerificationService = new BlockchainVerificationService();