import React, { useState } from 'react';
import { Calendar, User, FileText, Shield } from 'lucide-react';

interface CredentialFormProps {
  onSubmit: (data: CredentialFormData) => void;
  documentCID?: string;
  documentName?: string;
}

export interface CredentialFormData {
  title: string;
  description: string;
  holder: string;
  expiryDate: string;
  type: string;
}

const CredentialForm: React.FC<CredentialFormProps> = ({ 
  onSubmit, 
  documentCID,
  documentName 
}) => {
  const [formData, setFormData] = useState<CredentialFormData>({
    title: '',
    description: '',
    holder: '',
    expiryDate: '',
    type: 'certificate',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="glass-panel p-6">
      <h3 className="text-lg font-semibold mb-4">Credential Information</h3>
      
      {documentCID && documentName && (
        <div className="mb-6 p-3 bg-success-900/20 border border-success-800/30 rounded-lg flex items-center">
          <FileText size={20} className="text-success-500 mr-2" />
          <span className="text-success-100">Document uploaded successfully: {documentName}</span>
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div className="space-y-4">
          <div>
            <label htmlFor="title" className="block text-gray-300 mb-1">
              Credential Title *
            </label>
            <div className="relative">
              <input
                type="text"
                id="title"
                name="title"
                className="input-field pl-10"
                placeholder="e.g. Bachelor's Degree in Computer Science"
                value={formData.title}
                onChange={handleChange}
                required
              />
              <Shield size={20} className="absolute left-3 top-3 text-gray-400" />
            </div>
          </div>
          
          <div>
            <label htmlFor="description" className="block text-gray-300 mb-1">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              className="input-field"
              placeholder="Describe this credential"
              value={formData.description}
              onChange={handleChange}
              rows={3}
            />
          </div>
          
          <div>
            <label htmlFor="holder" className="block text-gray-300 mb-1">
              Holder Address *
            </label>
            <div className="relative">
              <input
                type="text"
                id="holder"
                name="holder"
                className="input-field pl-10"
                placeholder="0x..."
                value={formData.holder}
                onChange={handleChange}
                required
              />
              <User size={20} className="absolute left-3 top-3 text-gray-400" />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="expiryDate" className="block text-gray-300 mb-1">
                Expiry Date
              </label>
              <div className="relative">
                <input
                  type="date"
                  id="expiryDate"
                  name="expiryDate"
                  className="input-field pl-10"
                  value={formData.expiryDate}
                  onChange={handleChange}
                />
                <Calendar size={20} className="absolute left-3 top-3 text-gray-400" />
              </div>
            </div>
            
            <div>
              <label htmlFor="type" className="block text-gray-300 mb-1">
                Credential Type
              </label>
              <select
                id="type"
                name="type"
                className="input-field"
                value={formData.type}
                onChange={handleChange}
              >
                <option value="certificate">Certificate</option>
                <option value="degree">Academic Degree</option>
                <option value="license">Professional License</option>
                <option value="badge">Digital Badge</option>
                <option value="membership">Membership</option>
                <option value="identity">Identity Document</option>
              </select>
            </div>
          </div>
          
          <div className="pt-4">
            <button
              type="submit"
              className="btn btn-primary w-full"
              disabled={!documentCID}
            >
              Issue Credential
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default CredentialForm;