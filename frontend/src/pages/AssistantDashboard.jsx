import React, { useState, useEffect } from "react";
import { FaSearch, FaBars } from "react-icons/fa";
import Navbar from "../components/Navbar";
import { Dialog, DialogActions, DialogContent, DialogTitle, Button, TextField, IconButton } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import axios from "axios";
import CryptoJS from "crypto-js";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Initialize toast notifications
toast.configure();

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
  const [newDocDialogOpen, setNewDocDialogOpen] = useState(false);
  const [newDocTitle, setNewDocTitle] = useState("");
  const [newDocDepartment, setNewDocDepartment] = useState("");
  const [newDocFile, setNewDocFile] = useState(null);
  const [newDocDesc, setNewDocDesc] = useState("");

  // Encryption Key (Ensure security in production)
  const encryptionKey = "my-secret-key-123";

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
      setError(err.message || "Failed to fetch documents");
      toast.error("Error fetching documents.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
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
 
  const handleDocumentUpload = async () => {
    if (!newDocFile || !newDocDepartment || !newDocTitle) {
      toast.error('Please fill all required fields');
      return;
    }

    if (!newDocFile.type.includes('pdf')) {
      toast.error('Please upload only PDF files');
      return;
    }

    try {
      const arrayBuffer = await newDocFile.arrayBuffer();
      const wordArray = CryptoJS.lib.WordArray.create(arrayBuffer);

      const encrypted = CryptoJS.AES.encrypt(wordArray, encryptionKey);
      const encryptedBytes = CryptoJS.enc.Base64.parse(encrypted.toString());

      const blob = new Blob([encryptedBytes], { type: 'application/pdf' });
      const encryptedFile = new File([blob], newDocFile.name, { type: 'application/pdf' });

      const formData = new FormData();
      formData.append('pdfFile', encryptedFile);
      formData.append('department', newDocDepartment);
      formData.append('title', newDocTitle);
      formData.append('description', newDocDesc || '');

      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/file/upload-pdf`,
        formData,
        {
          withCredentials: true,
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      if (response.data) {
        toast.success('Document uploaded successfully');
        setNewDocFile(null);
        setNewDocDepartment('');
        setNewDocTitle('');
        setNewDocDesc('');
        fetchDocuments();
      }
    } catch (error) {
      console.error('Upload error:', error);
      toast.error(error.response?.data?.message || 'Error uploading document');
    }
  };
  
  const handleTitleClick = (documentUrl) => {
    setCurrentPdfUrl(documentUrl);
    setViewPdfDialogOpen(true);
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-100 text-gray-800">
      <Navbar role="Personal Assistant - Approval Dashboard" />
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: '#333',
            color: '#fff',
          },
        }}
      />
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="md:hidden p-2 text-gray-600 rounded-md"
      >
        <FaBars />
      </button>

      <main className="p-6 flex-grow">
        <div className="flex flex-wrap gap-4 mb-6 border-b">
          {["ALL", "PENDING", "APPROVED", "REJECTED", "REMARKS"].map((tab) => (
            <button
              key={tab}
              onClick={() => setSelectedTab(tab)}
              className={`px-4 py-2 ${selectedTab === tab
                  ? "border-b-2 border-blue-500 text-blue-500"
                  : "text-gray-600 hover:text-blue-500"
                }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="relative w-full max-w-xs mx-auto mb-6">
          <FaSearch className="absolute top-3 left-3 text-gray-400" />
          <input
            type="text"
            placeholder="Search documents..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-md border border-gray-300 text-gray-700 focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
        </div>

        {isLoading ? (
          <p className="text-center py-4 text-gray-500">Loading documents...</p>
        ) : error ? (
          <p className="text-center py-4 text-red-500">Error: {error}</p>
        ) : filteredData.length > 0 ? (
          <table className="min-w-full border text-sm">
            <thead className="text-left border-b">
              <tr>
                <th className="py-2 px-4">Name</th>
                <th className="py-2 px-4">Department</th>
                <th className="py-2 px-4">Date</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="py-2 px-4">{item.name}</td>
                  <td className="py-2 px-4">{item.department}</td>
                  <td className="py-2 px-4">{item.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="text-center py-4 text-gray-500">No documents found.</p>
        )}
      </main>

      <div className="fixed bottom-6 right-6">
        <IconButton color="primary" onClick={() => setNewDocDialogOpen(true)}>
          <AddIcon fontSize="large" />
        </IconButton>
      </div>

      {/* New Document Dialog */}
      <Dialog open={newDocDialogOpen} onClose={() => setNewDocDialogOpen(false)}>
        <DialogTitle>Upload New Document</DialogTitle>
        <DialogContent>
          <TextField margin="dense" label="Title" fullWidth value={newDocTitle} onChange={(e) => setNewDocTitle(e.target.value)} />
          <TextField margin="dense" label="Department" fullWidth value={newDocDepartment} onChange={(e) => setNewDocDepartment(e.target.value)} />
          <TextField margin="dense" label="Description" fullWidth value={newDocDesc} onChange={(e) => setNewDocDesc(e.target.value)} />
          <input type="file" onChange={handleFileChange} className="mt-4" />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setNewDocDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleDocumentUpload}>Encrypt & Upload</Button>
        </DialogActions>
      </Dialog>

      {/* Add Document Button */}
      <div className="fixed bottom-6 right-6">
        <IconButton
          color="primary"
          onClick={() => setNewDocDialogOpen(true)}
          aria-label="add new document"
        >
          <AddIcon fontSize="large" />
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
