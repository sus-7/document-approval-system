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
      const apiUrl = import.meta.env.VITE_API_URL + "/file/get-all";
      const response = await axios.get(apiUrl);
      setDocuments(response.data);
      setFilteredData(response.data);
    } catch (err) {
      setError(err.message || "Failed to fetch documents");
      toast.error("Error fetching documents.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, [selectedTab]);

  // Handle File Change
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setNewDocFile(file);
      toast.info(`Selected file: ${file.name}`);
    }
  };

  // Encrypt File Function
  const encryptFile = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const encryptedData = CryptoJS.AES.encrypt(e.target.result, encryptionKey).toString();
          const encryptedBlob = new Blob([encryptedData], { type: "text/plain" });
          resolve(encryptedBlob);
        } catch (err) {
          reject(err);
        }
      };
      reader.onerror = (err) => reject(err);
      reader.readAsDataURL(file);
    });
  };

  // Handle Document Upload
  const handleDocumentSubmit = async () => {
    if (!newDocTitle || !newDocDepartment || !newDocFile || !newDocDesc) {
      toast.error("Please fill all fields.");
      return;
    }

    try {
      toast.info("Encrypting file, please wait...");
      const encryptedFile = await encryptFile(newDocFile);
      toast.success("File encrypted successfully!");

      const formData = new FormData();
      formData.append("title", newDocTitle);
      formData.append("department", newDocDepartment);
      formData.append("description", newDocDesc);
      formData.append("file", encryptedFile, `${newDocFile.name}.enc`);
      formData.append("status", "PENDING");

      const apiUrl = import.meta.env.VITE_API_URL + "/file/upload-pdf";
      await axios.post(apiUrl, formData);

      toast.success("Document uploaded successfully!");
      setNewDocDialogOpen(false);
      setNewDocTitle("");
      setNewDocDepartment("");
      setNewDocDesc("");
      setNewDocFile(null);
      fetchDocuments();
    } catch (error) {
      console.error("Error submitting document:", error);
      toast.error("Error uploading document.");
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-100 text-gray-800">
      <Navbar role="Personal Assistant - Approval Dashboard" />

      <button onClick={() => setSidebarOpen(!sidebarOpen)} className="md:hidden p-2 text-gray-600 rounded-md">
        <FaBars />
      </button>

      <main className="p-6 flex-grow">
        <div className="flex flex-wrap gap-4 mb-6 border-b">
          {["ALL", "PENDING", "APPROVED", "REJECTED", "REMARKS"].map((tab) => (
            <button
              key={tab}
              onClick={() => setSelectedTab(tab)}
              className={`px-4 py-2 ${selectedTab === tab ? "border-b-2 border-blue-500 text-blue-500" : "text-gray-600 hover:text-blue-500"}`}
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
          <Button onClick={handleDocumentSubmit}>Submit</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default AssistantDashboard;
