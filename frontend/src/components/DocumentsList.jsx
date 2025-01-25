import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { FaDownload } from 'react-icons/fa';
import CryptoJS from 'crypto-js';

const DocumentsList = ({ status, department }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filteredData, setFilteredData] = useState([]);

  const encryptionKey = "your-hardcoded-encryption-key"; // Replace with secure storage

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

  const decryptFile = (encryptedData) => {
    try {
      const decrypted = CryptoJS.AES.decrypt(encryptedData, encryptionKey);
      const decryptedBytes = decrypted.toString(CryptoJS.enc.Utf8);
      const utf8Decoder = new TextDecoder('utf-8');
      const decodedData = utf8Decoder.decode(new TextEncoder().encode(decryptedBytes));
      const byteArray = new Uint8Array(decodedData.split('').map(char => char.charCodeAt(0)));
      return byteArray.buffer;
    } catch (error) {
      console.error('Decryption failed:', error);
      toast.error('Error during file decryption');
      return null;
    }
  };

  const handleDownload = async (fileName) => {
    try {
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

      const encryptedData = response.data;
      const decryptedArrayBuffer = decryptFile(encryptedData);

      if (decryptedArrayBuffer) {
        const decryptedBlob = new Blob([decryptedArrayBuffer], { type: 'application/pdf' });
        const pdfUrl = URL.createObjectURL(decryptedBlob);
        const link = document.createElement('a');
        link.href = pdfUrl;
        link.download = fileName.replace('.enc', '.pdf');
        document.body.appendChild(link);
        link.click();
        link.remove();
        URL.revokeObjectURL(pdfUrl);
      }
    } catch (err) {
      console.error('Download/Decryption error:', err);
      toast.error('Failed to decrypt file');
    }
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
