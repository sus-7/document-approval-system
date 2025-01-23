import React, { useState, useEffect } from "react";
import { FaSearch, FaBars } from "react-icons/fa";
import Navbar from "../components/Navbar";
import { Dialog, DialogActions, DialogContent, DialogTitle, Button, TextField, IconButton } from "@mui/material";
import AddIcon from '@mui/icons-material/Add';
import { toast, Toaster } from 'react-hot-toast';
import axios from 'axios';
import CryptoJS from "crypto-js";

const AssistantDashboard = () => {
  // State Management
  const [selectedTab, setSelectedTab] = useState("PENDING");
  const [searchQuery, setSearchQuery] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [filteredData, setFilteredData] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Dialog States
  const [openDialog, setOpenDialog] = useState(false);
  const [remarks, setRemarks] = useState("");
  const [currentDocumentId, setCurrentDocumentId] = useState(null);
  const [newDocDialogOpen, setNewDocDialogOpen] = useState(false);
  const [viewPdfDialogOpen, setViewPdfDialogOpen] = useState(false);
  const [currentPdfUrl, setCurrentPdfUrl] = useState("");

  // Filter States
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");

  // New Document States
  const [newDocTitle, setNewDocTitle] = useState("");
  const [newDocDepartment, setNewDocDepartment] = useState("");
  const [newDocFile, setNewDocFile] = useState(null);
  const [newDocDesc, setNewDocDesc] = useState("");
  const [encryptionKey, setEncryptionKey] = useState("");
  const [serverResponse, setServerResponse] = useState("");

  // Fetch Documents
  const fetchDocuments = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const apiUrl = import.meta.env.VITE_API_URL + "/api/documents?status=" + selectedTab;
      const response = await fetch(apiUrl, {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      });

      // Check if response is JSON
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        throw new Error('Server returned non-JSON response');
      }

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to fetch documents');
      }

      const data = await response.json();
      setDocuments(data);
      setFilteredData(data);

    } catch (err) {
      setError(err.message);
      console.error("Error fetching documents:", err);
      setDocuments([]);
      setFilteredData([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Effects
  useEffect(() => {
    fetchDocuments();
  }, [selectedTab]);

  useEffect(() => {
    const filtered = documents.filter(doc => 
      doc.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
      (!selectedCategory || doc.category === selectedCategory) &&
      (!startDate || new Date(doc.date) >= new Date(startDate)) &&
      (!endDate || new Date(doc.date) <= new Date(endDate))
    );
    setFilteredData(filtered);
  }, [searchQuery, selectedCategory, startDate, endDate, documents]);

  // Event Handlers
  const handleAcceptReject = (id, status) => {
    setFilteredData((prevData) =>
      prevData.map((item) => (item.id === id ? { ...item, status } : item))
    );
  };

  const handleRemarkSubmit = () => {
    if (remarks && currentDocumentId !== null) {
      setFilteredData((prevData) =>
        prevData.map((item) =>
          item.id === currentDocumentId
            ? { ...item, status: "REMARKS", remark: remarks }
            : item
        )
      );
      setRemarks("");
      setOpenDialog(false);
    }
  };
  const handleEncryptAndUpload = async () => {
    if (!newDocFile || !encryptionKey || !newDocTitle || !newDocDepartment) {
      toast.error("Please fill all required fields");
      return;
    }

    try {
      // Read file as ArrayBuffer
      const arrayBuffer = await newDocFile.arrayBuffer();
      const wordArray = CryptoJS.lib.WordArray.create(arrayBuffer);

      // Encrypt the WordArray
      const encrypted = CryptoJS.AES.encrypt(wordArray, encryptionKey);
      const encryptedContent = encrypted.toString();

      // Create form data
      const formData = new FormData();
      const blob = new Blob([encryptedContent], { type: 'application/pdf' });
      formData.append('pdfFile', new File([blob], `${newDocFile.name}.pdf`));
      formData.append('department', newDocDepartment);
      formData.append('title', newDocTitle);
      formData.append('description', newDocDesc || '');

      const token = localStorage.getItem('token'); // Get auth token
      const apiUrl = import.meta.env.VITE_API_URL + "/file/upload-pdf";
      const response = await axios.post(apiUrl, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`
        }
      });

      toast.success(response.data.message);
      setNewDocDialogOpen(false);
      // Reset form
      setNewDocTitle("");
      setNewDocDepartment("");
      setNewDocDesc("");
      setNewDocFile(null);
      setEncryptionKey("");
      
    } catch (error) {
      console.error("Upload error:", error);
      toast.error(error.response?.data?.message || "Failed to upload document");
    }
  };

  const handleTitleClick = (documentUrl) => {
    setCurrentPdfUrl(documentUrl);
    setViewPdfDialogOpen(true);
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-100 text-gray-800">
      <Navbar role="Personal Assistant - Approval Dashboard"/>
      
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="md:hidden p-2 text-gray-600 rounded-md"
      >
        <FaBars/>
      </button>

      <main className="p-6 flex-grow">
        {/* Status Tabs */}
        <div className="flex flex-wrap gap-4 mb-6 border-b">
          {["ALL", "PENDING", "APPROVED", "REJECTED", "REMARKS"].map((tab) => (
            <button
              key={tab}
              onClick={() => setSelectedTab(tab)}
              className={`px-4 py-2 ${
                selectedTab === tab
                  ? "border-b-2 border-blue-500 text-blue-500"
                  : "text-gray-600 hover:text-blue-500"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Search Bar */}
        <div className="relative w-full max-w-xs mx-auto mb-6">
          <FaSearch className="absolute top-3 left-3 text-gray-400"/>
          <input
            type="text"
            placeholder="Search documents..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-md border bg-white border-gray-300 text-gray-700 focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
        </div>

        {/* Filters */}
        <div className="mb-4 flex flex-col md:flex-row gap-4">
          <div className="flex-shrink-0">
            <label className="block text-sm font-medium text-gray-700">
              Category
            </label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="block w-full md:w-auto mt-1 p-2 text-sm border border-gray-300 bg-white rounded-md"
            >
              <option value="">All Categories</option>
              <option value="Finance">Finance</option>
              <option value="Education">Education</option>
              <option value="Health">Health</option>
              <option value="Transportation">Transportation</option>
            </select>
          </div>

          <div className="flex-grow">
            <label className="block text-sm font-medium text-gray-700">
              Date Range
            </label>
            <div className="flex flex-col md:flex-row gap-4">
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="p-2 border bg-white border-gray-300 rounded-md"
              />
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="p-2 border bg-white border-gray-300 rounded-md"
                min={startDate}
              />
            </div>
          </div>
        </div>

        {/* Document List */}
        <div className="flex flex-col md:flex-row gap-2">
          <div className="bg-white p-4 w-full md:w-2/3 rounded-lg border border-gray-200">
            <h3 className="text-lg font-medium mb-4">Documents</h3>
            {isLoading ? (
              <div className="text-center py-4">
                <p className="text-gray-500">Loading documents...</p>
              </div>
            ) : error ? (
              <div className="text-center py-4 text-red-500">
                <p>Error: {error}</p>
              </div>
            ) : filteredData.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="min-w-full text-sm">
                  <thead className="text-left border-b">
                    <tr>
                      <th className="py-2 px-4">Document Name</th>
                      <th className="py-2 px-4">Category</th>
                      <th className="py-2 px-4">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredData.map((item) => (
                      <tr key={item.id} className="hover:bg-gray-50">
                        <td className="py-2 px-4">
                          <span
                            onClick={() => handleTitleClick(item.fileUrl)}
                            className="text-blue-500 cursor-pointer hover:underline"
                          >
                            {item.name}
                          </span>
                        </td>
                        <td className="py-2 px-4">{item.category}</td>
                        <td className="py-2 px-4">{item.date}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-gray-500 text-center py-4">No documents found.</p>
            )}
          </div>
        </div>
      </main>

      {/* Remarks Dialog */}
      {openDialog && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-md shadow-lg max-w-md w-full">
            <h3 className="text-lg font-medium mb-4">Add Remark</h3>
            <textarea
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              className="w-full p-2 border resize-none border-gray-300 rounded-md mb-4"
              rows="4"
              placeholder="Enter remarks..."
            />
            <div className="flex justify-end space-x-4">
              <button
                className="py-2 px-4 bg-gray-300 text-gray-700 rounded-md"
                onClick={() => setOpenDialog(false)}
              >
                Cancel
              </button>
              <button
                className="py-2 px-4 bg-blue-500 text-white rounded-md"
                onClick={handleRemarkSubmit}
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}

      {/* New Document Dialog */}
      <Dialog open={newDocDialogOpen} onClose={() => setNewDocDialogOpen(false)}>
        <DialogTitle>Prepare New Document</DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            label="Document Title"
            type="text"
            fullWidth
            value={newDocTitle}
            onChange={(e) => setNewDocTitle(e.target.value)}
          />
          <TextField
            margin="dense"
            label="Department"
            type="text"
            fullWidth
            value={newDocDepartment}
            onChange={(e) => setNewDocDepartment(e.target.value)}
          />
          <input
            type="file"
            onChange={(e) => setNewDocFile(e.target.files[0])}
            className="my-4"
          />
          <TextField
            margin="dense"
            label="Description"
            type="text"
            fullWidth
            multiline
            rows={4}
            value={newDocDesc}
            onChange={(e) => setNewDocDesc(e.target.value)}
          />
          <TextField
            margin="dense"
            label="Encryption Key"
            type="text"
            fullWidth
            value={encryptionKey}
            onChange={(e) => setEncryptionKey(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setNewDocDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleEncryptAndUpload}>Encrypt & Upload</Button>
        </DialogActions>
      </Dialog>

      {/* Add Document Button */}
      <div className="fixed bottom-6 right-6">
        <IconButton
          color="primary"
          onClick={() => setNewDocDialogOpen(true)}
          aria-label="add new document"
        >
          <AddIcon fontSize="large"/>
        </IconButton>
      </div>

      {/* PDF Preview Dialog */}
      <Dialog 
        open={viewPdfDialogOpen} 
        onClose={() => setViewPdfDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Document Preview</DialogTitle>
        <DialogContent>
          <iframe 
            src={currentPdfUrl} 
            width="100%" 
            height="600px" 
            title="PDF Preview" 
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setViewPdfDialogOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default AssistantDashboard;