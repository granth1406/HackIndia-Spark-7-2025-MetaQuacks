import React, { useState } from 'react';
import { useAccount, useDisconnect } from 'wagmi';
import { User, Settings, Key, Shield, LogOut, Save, Copy, ExternalLink } from 'lucide-react';

const ProfilePage: React.FC = () => {
  const { address, isConnected } = useAccount();
  const { disconnect } = useDisconnect();
  
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState({
    name: 'John Smith',
    email: 'john.smith@example.com',
    bio: 'Blockchain developer and credential verification enthusiast.',
    website: 'https://johnsmith.dev',
    twitter: '@jsmith',
  });
  
  const [formData, setFormData] = useState({ ...profile });
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setProfile(formData);
    setIsEditing(false);
  };
  
  const copyAddress = () => {
    if (address) {
      navigator.clipboard.writeText(address);
    }
  };
  
  if (!isConnected) {
    return (
      <div className="page-container flex items-center justify-center min-h-[70vh]">
        <div className="glass-panel p-8 text-center max-w-md">
          <User size={48} className="text-primary-500 mx-auto mb-4" />
          <h2 className="text-2xl font-display font-bold mb-4">Connect Your Wallet</h2>
          <p className="text-gray-300 mb-6">
            You need to connect your wallet to view your profile.
          </p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="page-container">
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-col md:flex-row gap-8">
          <div className="w-full md:w-1/3">
            <div className="glass-panel p-6 sticky top-24">
              <div className="flex flex-col items-center mb-6">
                <div className="w-24 h-24 bg-gradient-to-br from-primary-600 to-accent-600 rounded-full flex items-center justify-center mb-4">
                  <User size={40} className="text-white" />
                </div>
                <h2 className="text-xl font-semibold">{profile.name}</h2>
                <div className="text-sm text-gray-400 flex items-center mt-1">
                  <span>{address ? `${address.substring(0, 6)}...${address.substring(address.length - 4)}` : ''}</span>
                  <button onClick={copyAddress} className="ml-2 text-primary-400 hover:text-primary-300">
                    <Copy size={14} />
                  </button>
                </div>
              </div>
              
              <div className="space-y-2 mb-6">
                <div className="flex items-center">
                  <Shield size={16} className="text-primary-400 mr-2" />
                  <span className="text-gray-300">Verified Issuer</span>
                </div>
                <div className="flex items-center">
                  <Key size={16} className="text-primary-400 mr-2" />
                  <span className="text-gray-300">24 Credentials Issued</span>
                </div>
              </div>
              
              <div className="space-y-2">
                <button 
                  onClick={() => setIsEditing(true)} 
                  className="btn btn-outline w-full flex items-center justify-center"
                  disabled={isEditing}
                >
                  <Settings size={16} className="mr-2" />
                  Edit Profile
                </button>
                <button 
                  onClick={() => disconnect()} 
                  className="btn border-error-700 text-error-500 hover:bg-error-900/20 w-full flex items-center justify-center"
                >
                  <LogOut size={16} className="mr-2" />
                  Disconnect Wallet
                </button>
              </div>
            </div>
          </div>
          
          <div className="w-full md:w-2/3">
            <div className="glass-panel p-6 mb-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold">Profile Information</h3>
                {isEditing && (
                  <button 
                    onClick={() => setIsEditing(false)} 
                    className="text-gray-400 hover:text-white"
                  >
                    Cancel
                  </button>
                )}
              </div>
              
              {isEditing ? (
                <form onSubmit={handleSubmit}>
                  <div className="space-y-4">
                    <div>
                      <label htmlFor="name" className="block text-gray-300 mb-1">
                        Name
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        className="input-field"
                        value={formData.name}
                        onChange={handleChange}
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="email" className="block text-gray-300 mb-1">
                        Email
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        className="input-field"
                        value={formData.email}
                        onChange={handleChange}
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="bio" className="block text-gray-300 mb-1">
                        Bio
                      </label>
                      <textarea
                        id="bio"
                        name="bio"
                        className="input-field"
                        rows={3}
                        value={formData.bio}
                        onChange={handleChange}
                      />
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="website" className="block text-gray-300 mb-1">
                          Website
                        </label>
                        <input
                          type="url"
                          id="website"
                          name="website"
                          className="input-field"
                          value={formData.website}
                          onChange={handleChange}
                        />
                      </div>
                      
                      <div>
                        <label htmlFor="twitter" className="block text-gray-300 mb-1">
                          Twitter
                        </label>
                        <input
                          type="text"
                          id="twitter"
                          name="twitter"
                          className="input-field"
                          value={formData.twitter}
                          onChange={handleChange}
                        />
                      </div>
                    </div>
                    
                    <div className="pt-4">
                      <button
                        type="submit"
                        className="btn btn-primary flex items-center justify-center"
                      >
                        <Save size={16} className="mr-2" />
                        Save Changes
                      </button>
                    </div>
                  </div>
                </form>
              ) : (
                <div className="space-y-4">
                  <div>
                    <div className="text-gray-400 text-sm mb-1">Name</div>
                    <div className="text-white">{profile.name}</div>
                  </div>
                  
                  <div>
                    <div className="text-gray-400 text-sm mb-1">Email</div>
                    <div className="text-white">{profile.email}</div>
                  </div>
                  
                  <div>
                    <div className="text-gray-400 text-sm mb-1">Bio</div>
                    <div className="text-white">{profile.bio}</div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <div className="text-gray-400 text-sm mb-1">Website</div>
                      <a 
                        href={profile.website} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-primary-400 hover:text-primary-300 flex items-center"
                      >
                        {profile.website} <ExternalLink size={12} className="ml-1" />
                      </a>
                    </div>
                    
                    <div>
                      <div className="text-gray-400 text-sm mb-1">Twitter</div>
                      <div className="text-white">{profile.twitter}</div>
                    </div>
                  </div>
                </div>
              )}
            </div>
            
            <div className="glass-panel p-6">
              <h3 className="text-xl font-semibold mb-4">Account Security</h3>
              
              <div className="space-y-6">
                <div>
                  <h4 className="text-lg font-medium mb-2">Connected Wallet</h4>
                  <div className="flex items-center justify-between p-4 bg-dark-card rounded-lg">
                    <div>
                      <div className="text-white font-medium">
                        {address ? `${address.substring(0, 10)}...${address.substring(address.length - 6)}` : ''}
                      </div>
                      <div className="text-sm text-primary-400">Primary Account</div>
                    </div>
                    <a 
                      href={`https://etherscan.io/address/${address}`} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-primary-400 hover:text-primary-300 flex items-center"
                    >
                      View on Etherscan <ExternalLink size={12} className="ml-1" />
                    </a>
                  </div>
                </div>
                
                <div>
                  <h4 className="text-lg font-medium mb-2">Recovery Settings</h4>
                  <p className="text-gray-300 mb-4">
                    Set up recovery options to ensure you never lose access to your credentials.
                  </p>
                  <button className="btn btn-outline">
                    Set Up Recovery Options
                  </button>
                </div>
                
                <div>
                  <h4 className="text-lg font-medium mb-2">Export Account Data</h4>
                  <p className="text-gray-300 mb-4">
                    Download all your credential data and account information.
                  </p>
                  <button className="btn btn-outline">
                    Export Data
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;