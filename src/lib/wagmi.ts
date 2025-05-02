import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { mainnet, polygon, optimism, arbitrum, base, sepolia } from 'wagmi/chains';
import { createConfig } from 'wagmi';

export const chains = [
  mainnet,
  polygon,
  optimism,
  arbitrum,
  base,
  sepolia,
];

export const wagmiConfig = createConfig(
  getDefaultConfig({
    appName: 'ProofPass',
    projectId: 'YOUR_PROJECT_ID', // Replace with your WalletConnect project ID
    chains,
  }),
);