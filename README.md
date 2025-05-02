# ProofPass

*ProofPass* is a decentralized web application that enables users to *securely store and verify documents* using their *blockchain wallet*. It ensures the authenticity and integrity of documents by leveraging the security of blockchain networks, providing a transparent and tamper-proof verification system.

## 🔐 Key Features

* *Decentralized Document Storage*: Upload and manage documents with cryptographic hashes stored on-chain or linked to wallet identity.
* *Blockchain Wallet Integration*: Connect your wallet (e.g., MetaMask) to interact with the app securely.
* *Instant Document Verification*: Verify ownership and authenticity of documents through blockchain-based validation.
* *Minimal and Intuitive UI*: Built with React and Tailwind CSS for a modern, responsive interface.

## ⚙ Tech Stack

* *Frontend*: React + TypeScript
* *Styling*: Tailwind CSS
* *Build Tool*: Vite
* *Blockchain*: Ethereum
* *Wallet Integration*: ethers.js, web3.js
* *Storage*: IPFS

## 📦 Installation

1. *Clone the Repository*:
```
   git clone https://github.com/granth1406/HackIndia-Spark-7-2025-MetaQuacks.git
   cd HackIndia-Spark-7-2025-MetaQuacks
 ```  

2. *Install Dependencies*:

```
   npm install
 ```  

3. *Start Development Server*:

```
   npm run dev
 ```  

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🧠 How It Works

1. *Connect Wallet*: Users connect their blockchain wallet to the app.
2. *Upload Document*: Document metadata or hashes are generated and stored securely.
3. *Verify*: Anyone with the document can verify its authenticity by checking against the stored hash and wallet signature.

## 📁 Project Structure Overview

```
src/
├── components/        # Reusable React components
├── pages/             # Main views like Dashboard, Upload, Verify
├── utils/             # Helper functions and blockchain logic
├── App.tsx            # Main application wrapper
├── main.tsx           # React entry point
tailwind.config.js     # Tailwind CSS config
vite.config.ts         # Vite config
```


## 📄 License

This project is for hackathon purposes and does not currently use a formal open-source license.
