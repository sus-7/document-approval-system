import React, { useContext, useEffect, useState } from "react";
import { FaHistory, FaBell, FaUserAlt, FaSearch } from "react-icons/fa";
import NewCm from "./NewCm";
import SentBackTabContent from "./SentBackTabContent";
import Navbar from "../components/Navbar.jsx";
import { AuthContext } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";

const ApproverDashboard = () => {
  const [selectedTab, setSelectedTab] = useState("NEW");
  const { loggedInUser } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!loggedInUser) {
      navigate("/");
    }
  }, [loggedInUser]);

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

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-r from-white to-blue-100">
      {/* Navbar */}
      <Navbar />

      {/* Main Content */}
      <div className="flex items-center min-h-screen h-auto justify-center flex-grow mt-0"> {/* Reduced mt-3 to mt-1 */}
        <div className="w-[90%] max-w-[100vh] bg-white h-fit flex flex-col flex-grow-1 shadow-lg border border-gray-200 rounded-lg absolute top-20 ">
          {/* Tabs */}
          <div className="tabs flex justify-around items-center text-sm text-gray-700 mt-1 border-b border-gray-200 h-11 ">
            <button
              onClick={() => setSelectedTab("NEW")}
              className={`px-4 py-2 font-medium rounded-md ${
                selectedTab === "NEW"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-100 text-gray-700"
              }`}
            >
              NEW
            </button>
            <button
              onClick={() => setSelectedTab("SENT BACK")}
              className={`px-4 py-2 font-medium rounded-md ${
                selectedTab === "SENT BACK"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-100 text-gray-700"
              }`}
            >
              SENT BACK
            </button>
          </div>

          {/* Content */}
          <div className="content p-4 items-center">
            {selectedTab === "NEW" ? <NewCm /> : <SentBackTabContent />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApproverDashboard;