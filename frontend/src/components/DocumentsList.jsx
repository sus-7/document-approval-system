import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';

const DocumentsList = ({ status, department }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filteredData, setFilteredData] = useState([]);

  const fetchDocuments = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Construct query params properly
      const queryParams = new URLSearchParams();

      // Ensure status is valid or set default to 'pending'
      const validStatus = status && status !== 'all' ? status : 'pending';
      queryParams.append('status', validStatus);

      // Add department to query params if provided
      if (department) {
        queryParams.append('department', department);
      }

      const apiUrl = `${import.meta.env.VITE_API_URL}/file/get-documents?${queryParams}`;

      const response = await axios.get(apiUrl, {
        withCredentials: true,
      });

      // Check if the response is valid
      if (response.data.status && response.data.documents) {
        setFilteredData(response.data.documents);
        console.log('Documents loaded:', response.data.documents);
      } else {
        throw new Error('Invalid response format');
      }

    } catch (err) {
      console.error('Error fetching documents:', err);
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

  const renderDocumentRow = (doc) => (
    <tr key={doc._id} className="hover:bg-gray-50">
      <td className="py-2 px-4">
        <span className="text-blue-500 cursor-pointer hover:underline">
          {doc.title || 'Untitled'}
        </span>
      </td>
      <td className="py-2 px-4">{doc.department?.name || 'N/A'}</td>
      <td className="py-2 px-4">
        {new Date(doc.createdDate).toLocaleDateString()}
      </td>
      <td className="py-2 px-4">
        <span className={`px-2 py-1 rounded-full text-xs font-medium
          ${doc.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 
          doc.status === 'approved' ? 'bg-green-100 text-green-800' :
          'bg-red-100 text-red-800'}`} >
          {doc.status?.toUpperCase()}
        </span>
      </td>
    </tr>
  );

  return (
    <div className="bg-white rounded-lg shadow p-6">
      {isLoading ? (
        <div className="text-center py-4">Loading...</div>
      ) : error ? (
        <div className="text-center text-red-500 py-4">{error}</div>
      ) : (
        <table className="min-w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="py-3 px-4 text-left">Title</th>
              <th className="py-3 px-4 text-left">Department</th>
              <th className="py-3 px-4 text-left">Date</th>
              <th className="py-3 px-4 text-left">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredData.length > 0 ? (
              filteredData.map(renderDocumentRow)
            ) : (
              <tr>
                <td colSpan="4" className="text-center py-4 text-gray-500">
              o documents found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default DocumentsList;
