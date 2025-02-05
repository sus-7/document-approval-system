import React, { useContext, useEffect, useState } from "react";
import { FaHistory, FaBell, FaUserAlt, FaSearch } from "react-icons/fa";
import NewCm from "./NewCm";
import SentBackTabContent from "./SentBackTabContent";
import Navbar from "../components/Navbar.jsx";
import { AuthContext } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { Dialog, DialogActions, DialogContent, DialogTitle, Button } from "@mui/material";
import axios from "axios";
import toast from "react-hot-toast";

const ApproverDashboard = () => {
  const [selectedTab, setSelectedTab] = useState("NEW");
  const { loggedInUser } = useContext(AuthContext);
  const [currentPdfUrl, setCurrentPdfUrl] = useState("");
  const [viewPdfDialogOpen, setViewPdfDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filteredData, setFilteredData] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (!loggedInUser) {
      navigate("/");
    }
  }, [loggedInUser]);

  const fetchDocuments = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/file/get-documents?status=pending`,
        { withCredentials: true }
      );
      if (response.data.status && response.data.documents) {
        setFilteredData(response.data.documents);
      } else {
        throw new Error("Invalid response format");
      }
    } catch (err) {
      console.error("Fetch error:", err);
      setError(err.response?.data?.message || "Failed to fetch documents");
      toast.error("Failed to load documents");
      setFilteredData([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-r from-white to-blue-100">
      {/* Navbar */}

      {/* Main Content */}
      <div className="flex items-center min-h-screen mt-3 h-auto justify-center flex-grow">
        <div className="w-[90%] max-w-[80vh] bg-white h-full flex flex-col flex-grow-1 shadow-lg border border-gray-200 rounded-lg">
          {/* Tabs */}
          <div className="tabs flex justify-around items-center text-sm text-gray-700 mt-2 border-b border-gray-200">
            <button
              onClick={() => setSelectedTab("NEW")}
              className={`px-4 py-2 font-medium rounded-md ${
                selectedTab === "NEW" ? "bg-blue-500 text-white" : "bg-gray-100 text-gray-700"
              }`}
            >
              NEW
            </button>
            <button
              onClick={() => setSelectedTab("SENT BACK")}
              className={`px-4 py-2 font-medium rounded-md ${
                selectedTab === "SENT BACK" ? "bg-blue-500 text-white" : "bg-gray-100 text-gray-700"
              }`}
            >
              SENT BACK
            </button>
          </div>

          {/* Content */}
          <div className="content p-4">
            {selectedTab === "NEW" ? (
              <NewCm
                handleTitleClick={(url) => {
                  setCurrentPdfUrl(url);
                  setViewPdfDialogOpen(true);
                }}
              />
            ) : (
              <SentBackTabContent />
            )}
          </div>
        </div>
      </div>

      {/* PDF Preview Dialog */}
      <Dialog
        open={viewPdfDialogOpen}
        onClose={() => setViewPdfDialogOpen(false)}
        maxWidth="xl"
        fullWidth
      >
        <DialogTitle>Document Preview</DialogTitle>
        <DialogContent>
          <div style={{ width: "100%", height: "80vh" }}>
            <object
              data={currentPdfUrl}
              type="application/pdf"
              width="100%"
              height="100%"
            >
              <p>
                Your browser does not support PDFs. <a href={currentPdfUrl}>Download the PDF</a>.
              </p>
            </object>
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setViewPdfDialogOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default ApproverDashboard;
