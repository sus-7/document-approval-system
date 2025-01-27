import React, { useState, useEffect } from "react";
import { FaSearch } from "react-icons/fa";
import axios from "axios";
import { toast,Toaster } from "react-hot-toast";
import { ClipLoader } from "react-spinners";
import { AiOutlineClose, AiOutlineCheck, AiOutlineCloseCircle } from "react-icons/ai";
import { FaCommentDots } from "react-icons/fa";
import { IoMdClose } from "react-icons/io"
import '../index.css';
import { FileStatus } from "../../utils/enums";
const SentBackTabContent = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filteredData, setFilteredData] = useState([]);
  const [category, setCategory] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isRemarkModalOpen, setIsRemarkModalOpen] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [remark, setRemark] = useState("");

  const fetchDocuments = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const queryParams = new URLSearchParams();
      queryParams.append('status', 'pending');

      console.log(queryParams);

      if (category) {
        queryParams.append('category', category);
      }
      if (startDate) {
        queryParams.append('startDate', startDate);
      }
      if (endDate) {
        queryParams.append('endDate', endDate);
      }

      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/file/get-documents?status=rejected`, 
        { withCredentials: true }
      );

      console.log(response.data);

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
  }, [category, startDate, endDate]);

  

 
  


  const handleApprove = async (fileUniqueName) => {
    try {
      toast.loading("Approving document...");
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/file/approve`,
        { fileUniqueName },
        { withCredentials: true }
      );
  
      toast.dismiss();
      toast.success(response.data.message || "Document approved successfully!");
      fetchDocuments(); // Refresh list after approval
    } catch (error) {
      toast.dismiss();   console.log(error.response?.data?.message);
      toast.error(error.response?.data?.message || "Approval failed");
    }
  };
  
  const handleReject = async (fileUniqueName) => {
    try {
      toast.loading("Rejecting document...");
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/file/reject`,
        { fileUniqueName },
        { withCredentials: true }
      );
  
      toast.dismiss();
      toast.success(response.data.message || "Document rejected successfully!");
      fetchDocuments(); 
    } catch (error) {
      toast.dismiss();
      console.log(error.response?.data?.message);
      
      toast.error(error.response?.data?.message || "Rejection failed");
    }
  };
  


  return (
    <div className="flex flex-col font-roboto space-y-6 p-4">
      {/* Search Section */}
      
      <Toaster/>
      <div className="relative">
        <FaSearch className="absolute top-3 left-3 text-gray-400" />
        <input
          type="text"
          placeholder="Search"
          className="w-full pl-10 pr-4 py-2 rounded-md bg-gray-100 text-gray-800 border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none"
        />
      </div>

      {/* Filters */}
      <div className="flex flex-col space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4">
        <select
          className="flex-1 px-4 py-2 rounded-md bg-gray-200 text-gray-700 border border-gray-300"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          <option value="">Category</option>
          <option value="Health">Health</option>
          <option value="Education">Education</option>
          <option value="Transportation">Transportation</option>
          <option value="Finance">Finance</option>
        </select>
        <input
          type="date"
          className="flex-1 px-4 py-2 rounded-md bg-gray-200 text-gray-700 border border-gray-300"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
        />
        <input
          type="date"
          className="flex-1 px-4 py-2 rounded-md bg-gray-200 text-gray-700 border border-gray-300"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
        />
      </div>

      {/* Documents */}
      <div className="space-y-4">
        {isLoading ? (
          <div className="flex justify-center">
            <ClipLoader size={35} color={"#123abc"} loading={isLoading} />
          </div>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : (
          filteredData.map((item) => (
            <div
              key={item._id}
              className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-gray-100 p-4 rounded-md shadow-md border border-gray-300"
            >
              <div className="flex items-start sm:items-center space-x-4">
                <div className="w-10 h-10 bg-gray-200 flex items-center justify-center rounded-md">
                  📄
                </div>
                <div className="flex flex-col">
                  <h3
                    className="text-xl font-bold tracking-tight  font-open-sans  text-gray-800 cursor-pointer"
                    onClick={() => openModal(item)}
                  >
                    {item.title}
                  </h3>
                  <div className="flex flex-col sm:flex-row sm:space-x-4">
                    <span className="text-[13px] font-light text-gray-800">
                      <span className="font-semibold">Department:</span> {item.department?.departmentName || 'Unassigned'}
                    </span>
                    <span className="text-[13px] font-light text-gray-800">
                      <span className="font-semibold">Created By:</span> {item.createdBy?.fullName || item.createdBy?.username || 'Unknown'}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500">{item.date}</p>
                </div>
              </div>
              <span className={`text-sm font-semibold ${item.status===FileStatus.REJECTED?'text-red-600':'text-yellow-300'}  mt-2 sm:mt-0`}>
                {item.status.toUpperCase()}
              </span>
            </div>
          ))
        )}
      </div>

      

    
    </div>
  );
};

export default SentBackTabContent;