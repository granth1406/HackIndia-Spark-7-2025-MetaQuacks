// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

/**
 * @title ProofPass
 * @dev Smart contract for decentralized credential verification
 */
contract ProofPass {
    address public owner;
    
    struct Credential {
        string credentialId;
        address issuer;
        address holder;
        string metadataCID; // IPFS CID for credential metadata
        string documentCID;  // IPFS CID for credential document
        uint256 issuedAt;
        uint256 expiresAt;
        bool revoked;
    }
    
    // Maps credentialId to Credential
    mapping(string => Credential) public credentials;
    
    // Maps address to array of credentialIds
    mapping(address => string[]) public holderCredentials;
    mapping(address => string[]) public issuerCredentials;
    
    // List of approved credential issuers
    mapping(address => bool) public approvedIssuers;
    
    event CredentialIssued(string credentialId, address issuer, address holder);
    event CredentialRevoked(string credentialId, address issuer);
    event IssuerApproved(address issuer);
    event IssuerRevoked(address issuer);

    constructor() {
        owner = msg.sender;
        approvedIssuers[msg.sender] = true;
    }
    
    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call this function");
        _;
    }
    
    modifier onlyApprovedIssuer() {
        require(approvedIssuers[msg.sender], "Only approved issuers can call this function");
        _;
    }
    
    modifier onlyCredentialIssuer(string memory credentialId) {
        require(credentials[credentialId].issuer == msg.sender, "Only the credential issuer can call this function");
        _;
    }
    
    /**
     * @dev Approve an address as a credential issuer
     * @param issuer Address to approve as issuer
     */
    function approveIssuer(address issuer) external onlyOwner {
        approvedIssuers[issuer] = true;
        emit IssuerApproved(issuer);
    }
    
    /**
     * @dev Revoke an address as a credential issuer
     * @param issuer Address to revoke as issuer
     */
    function revokeIssuer(address issuer) external onlyOwner {
        approvedIssuers[issuer] = false;
        emit IssuerRevoked(issuer);
    }
    
    /**
     * @dev Issue a new credential
     * @param credentialId Unique identifier for credential
     * @param holder Address of credential holder
     * @param metadataCID IPFS CID for credential metadata
     * @param documentCID IPFS CID for credential document
     * @param expiresAt Expiration timestamp (0 for no expiration)
     */
    function issueCredential(
        string memory credentialId,
        address holder,
        string memory metadataCID,
        string memory documentCID,
        uint256 expiresAt
    ) external onlyApprovedIssuer {
        // Ensure credentialId doesn't already exist
        require(bytes(credentials[credentialId].credentialId).length == 0, "Credential ID already exists");
        
        // Store credential
        credentials[credentialId] = Credential({
            credentialId: credentialId,
            issuer: msg.sender,
            holder: holder,
            metadataCID: metadataCID,
            documentCID: documentCID,
            issuedAt: block.timestamp,
            expiresAt: expiresAt,
            revoked: false
        });
        
        // Add to holder's and issuer's credentials lists
        holderCredentials[holder].push(credentialId);
        issuerCredentials[msg.sender].push(credentialId);
        
        emit CredentialIssued(credentialId, msg.sender, holder);
    }
    
    /**
     * @dev Revoke a credential
     * @param credentialId ID of credential to revoke
     */
    function revokeCredential(string memory credentialId) external onlyCredentialIssuer(credentialId) {
        require(!credentials[credentialId].revoked, "Credential already revoked");
        
        credentials[credentialId].revoked = true;
        
        emit CredentialRevoked(credentialId, msg.sender);
    }
    
    /**
     * @dev Verify a credential's validity
     * @param credentialId ID of credential to verify
     * @return valid True if credential is valid
     */
    function verifyCredential(string memory credentialId) external view returns (bool valid) {
        Credential memory credential = credentials[credentialId];
        
        // Check if credential exists
        if (bytes(credential.credentialId).length == 0) {
            return false;
        }
        
        // Check if credential is revoked
        if (credential.revoked) {
            return false;
        }
        
        // Check if credential is expired
        if (credential.expiresAt > 0 && block.timestamp > credential.expiresAt) {
            return false;
        }
        
        // Check if issuer is still approved
        if (!approvedIssuers[credential.issuer]) {
            return false;
        }
        
        return true;
    }
    
    /**
     * @dev Get holder's credentials
     * @param holder Address of credential holder
     * @return credentialIds Array of credential IDs held by holder
     */
    function getHolderCredentials(address holder) external view returns (string[] memory) {
        return holderCredentials[holder];
    }
    
    /**
     * @dev Get issuer's credentials
     * @param issuer Address of credential issuer
     * @return credentialIds Array of credential IDs issued by issuer
     */
    function getIssuerCredentials(address issuer) external view returns (string[] memory) {
        return issuerCredentials[issuer];
    }
    
    /**
     * @dev Get credential details
     * @param credentialId ID of the credential
     * @return credential Credential details
     */
    function getCredential(string memory credentialId) external view returns (Credential memory) {
        return credentials[credentialId];
    }
}