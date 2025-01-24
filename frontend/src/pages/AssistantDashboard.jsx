import React, { useState, useEffect } from "react";
import { FaSearch, FaBars } from "react-icons/fa";
import Navbar from "../components/Navbar";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  TextField,
  IconButton,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { toast, Toaster } from "react-hot-toast";
import axios from "axios";
import CryptoJS from "crypto-js";
import DocumentsList from "../components/DocumentsList";

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

      const apiUrl = `${
        import.meta.env.VITE_API_URL
      }/file/get-documents?status=${selectedTab.toLowerCase()}`;

      const response = await axios.get(apiUrl, {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        withCredentials: true,
      });

      console.log("fetched data", response.data);
      setDocuments(response.data.documents);
      setFilteredData(response.data);
    } catch (err) {
      const errorMessage =
        err.response?.data?.message ||
        err.message ||
        "Failed to fetch documents";
      setError(errorMessage);
      console.error("Error fetching documents:", err);
      setDocuments([]);
      setFilteredData([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Effects
  useEffect(() => {}, [selectedTab]);

  useEffect(() => {
    const filtered = documents.filter(
      (doc) =>
        doc.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
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
      toast.error("Please fill all required fields");
      return;
    }

    if (!newDocFile.type.includes("pdf")) {
      toast.error("Please upload only PDF files");
      return;
    }

    try {
      const arrayBuffer = await newDocFile.arrayBuffer();
      const wordArray = CryptoJS.lib.WordArray.create(arrayBuffer);

      const encrypted = CryptoJS.AES.encrypt(wordArray, encryptionKey);
      const encryptedBytes = CryptoJS.enc.Base64.parse(encrypted.toString());

      const blob = new Blob([encryptedBytes], { type: "application/pdf" });
      const encryptedFile = new File([blob], newDocFile.name, {
        type: "application/pdf",
      });

      const formData = new FormData();
      formData.append("pdfFile", encryptedFile);
      formData.append("department", newDocDepartment);
      formData.append("title", newDocTitle);
      formData.append("description", newDocDesc || "");

      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/file/upload-pdf`,
        formData,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.data) {
        toast.success("Document uploaded successfully");
        setNewDocFile(null);
        setNewDocDepartment("");
        setNewDocTitle("");
        setNewDocDesc("");
        fetchDocuments();
      }
    } catch (error) {
      console.error("Upload error:", error);
      toast.error(error.response?.data?.message || "Error uploading document");
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
            background: "#333",
            color: "#fff",
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
          <FaSearch className="absolute top-3 left-3 text-gray-400" />
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
        <DocumentsList status={selectedTab.toLowerCase()} department={selectedCategory} />
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
      <Dialog
        open={newDocDialogOpen}
        onClose={() => setNewDocDialogOpen(false)}
      >
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
