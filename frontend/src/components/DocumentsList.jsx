import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { FaDownload } from 'react-icons/fa';
import CryptoJS from 'crypto-js';

const DocumentsList = ({ status, department }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filteredData, setFilteredData] = useState([]);

  // TODO: Replace with secure key management
  const encryptionKey =  "your-hardcoded-encryption-key";

  const fetchDocuments = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const queryParams = new URLSearchParams();
      const validStatus = status && status !== 'all' ? status : 'pending';
      queryParams.append('status', validStatus);

      if (department) {
        queryParams.append('department', department);
      }

      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/file/get-documents?${queryParams}`,
        { withCredentials: true }
      );

      if (response.data.status && response.data.documents) {
        setFilteredData(response.data.documents);
      } else {
        throw new Error('Invalid response format');
      }
    } catch (err) {
      console.error('Fetch error:', err);
      setError(err.response?.data?.message || 'Failed to fetch documents');
      toast.error('Failed to load documents');
      setFilteredData([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, [status, department]);

  const handleDownload = async (fileName) => {
    if (!fileName || !encryptionKey) {
      toast.error('Please provide filename and encryption key');
      return;
    }
  
    try {
      // Download encrypted file
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/file/download-pdf/${fileName}`,
        {
          responseType: 'arraybuffer',
          withCredentials: true,
        }
      );
  
      if (response.status !== 200) {
        throw new Error('Failed to download file');
      }
  
      // Convert ArrayBuffer to Base64 with a different approach
      const base64 = btoa(
        new Uint8Array(response.data)
          .reduce((data, byte) => data + String.fromCharCode(byte), '')
      );
  
      // Decrypt the entire Base64 string
      const decrypted = CryptoJS.AES.decrypt(base64, encryptionKey);
  
      // Verify decryption
      if (!decrypted.sigBytes) {
        throw new Error('Decryption failed. Check your encryption key.');
      }
  
      // Convert decrypted words to Uint8Array
      const decryptedUint8Array = convertWordArrayToUint8Array(decrypted);
  
      // Create blob and download
      const decryptedBlob = new Blob([decryptedUint8Array], { type: 'application/pdf' });
      
      const pdfUrl = URL.createObjectURL(decryptedBlob);
      const link = document.createElement('a');
      link.href = pdfUrl;
      link.download = fileName.replace('.enc', '.pdf');
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(pdfUrl);
  
      toast.success('File decrypted and downloaded successfully');
    } catch (err) {
      console.error('Download/Decryption error:', err);
      toast.error(err.message || 'Failed to decrypt file');
    }
  };
  
  // Helper function to convert WordArray to Uint8Array
  const convertWordArrayToUint8Array = (wordArray) => {
    const len = wordArray.sigBytes;
    const words = wordArray.words;
    const uint8Array = new Uint8Array(len);
    let offset = 0;
    
    for (let i = 0; i < len; i += 4) {
      const word = words[i >>> 2];
      for (let j = 0; j < 4 && offset < len; ++j) {
        uint8Array[offset++] = (word >>> (24 - j * 8)) & 0xff;
      }
    }
    
    return uint8Array;
  };

  
   
  return (
    <div className="flex items-start justify-start flex-grow">
      <div className="w-full max-w-4xl bg-white shadow-lg border border-gray-200 rounded-lg p-6">
        {isLoading ? (
          <div className="text-center py-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
          </div>
        ) : error ? (
          <div className="text-center text-red-500 py-4">{error}</div>
        ) : (
          <>
            <div className="space-y-4">
              {filteredData.length > 0 ? (
                filteredData.map((doc) => (
                  <div
                    key={doc._id}
                    className="flex justify-between items-center p-4 bg-gray-50 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-all"
                  >
                    <div className="flex-grow">
                      <h3 className="text-lg font-semibold text-gray-800">
                        {doc.title || 'Untitled'}
                      </h3>
                      <div className="flex flex-wrap gap-4 mt-2">
                        <p className="text-sm text-gray-600">
                          Department: {doc.department?.departmentName || 'Unassigned'}
                        </p>
                        <p className="text-sm text-gray-600">
                          Created by: {doc.createdBy?.fullName || doc.createdBy?.username || 'Unknown'}
                        </p>
                        <span className="text-xs text-gray-400">
                          {new Date(doc.createdDate).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => handleDownload(doc.fileUniqueName)}
                        className="p-2 text-blue-600 hover:text-blue-800 transition-colors"
                        title="Download Decrypted File"
                      >
                        <FaDownload size={20} />
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-gray-500">No documents found</div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default DocumentsList;