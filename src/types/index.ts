export interface Credential {
  id: string;
  name: string;
  issuer: string;
  issuedAt: string;
  expiresAt: string | null;
  type: CredentialType;
  status: CredentialStatus;
  metadata: Record<string, any>;
  proofUrl: string;
}

export enum CredentialType {
  IDENTITY = 'identity',
  EDUCATION = 'education',
  EMPLOYMENT = 'employment',
  CERTIFICATION = 'certification',
  MEMBERSHIP = 'membership',
  ACCESS = 'access',
  ACHIEVEMENT = 'achievement',
  CUSTOM = 'custom',
}

export enum CredentialStatus {
  ACTIVE = 'active',
  EXPIRED = 'expired',
  REVOKED = 'revoked',
  PENDING = 'pending',
}

export interface User {
  address: string | null;
  profileName?: string;
  profileImage?: string;
  credentials: Credential[];
}

export interface Web3State {
  isConnected: boolean;
  address: string | null;
  chainId: number | null;
  provider: any | null;
  connect: () => Promise<void>;
  disconnect: () => void;
}

export interface QRCodeData {
  credentialId: string;
  issuerId: string;
  timestamp: number;
  signature: string;
}