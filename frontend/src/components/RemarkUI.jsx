import React, { useState } from "react";
import { GrView } from "react-icons/gr";
import { FaDownload, FaBell, FaHistory, FaUser, FaCheckDouble, FaArrowLeft } from "react-icons/fa";
import { toast,Toaster } from "react-hot-toast";

const RemarkUI = () => {
  const [isTicked, setIsTicked] = useState(false);

  const handleTickClick = () => {
    if (!isTicked) {
      setIsTicked(true);
      toast.success("Marked as complete!", {
        position: "top-right",
        duration: 3000,
      });
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-r from-white to-blue-100">
      <Toaster/>
      {/* Navbar */}
      <div className="flex justify-between items-center bg-white shadow-md px-6 py-4 border-b border-gray-200">
        <h1 className="text-lg font-bold text-gray-800">CORRECTION</h1>
        <div className="flex gap-4">
          <button className="text-gray-500 hover:text-gray-700">
            <FaHistory size={20} />
          </button>
          <button className="text-gray-500 hover:text-gray-700">
            <FaBell size={20} />
          </button>
          <button className="text-gray-500 hover:text-gray-700">
            <FaUser size={20} />
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex items-center justify-center flex-grow">
        <div className="w-96 bg-white shadow-lg border border-gray-200 rounded-lg p-8">
          {/* Back Button */}
          <button className="text-blue-600 hover:text-blue-800 mb-6 flex items-center">
            <FaArrowLeft size={20} className="mr-2" />
          </button>

          {/* Tab */}
           

          {/* Title and Remark Label */}
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-xl font-semibold text-gray-800">Letter Title 1</h2>
              <p className="text-sm text-gray-500">01/02/2025</p>
            </div>
            <div className="px-3 py-1 bg-blue-100 text-blue-600 text-sm font-medium rounded">
              REMARK
            </div>
          </div>

          {/* PDF Section */}
          <div className="flex justify-center items-center h-40 bg-gray-100 border border-dashed border-gray-300 rounded mb-6 relative">
            <span className="text-gray-400 text-4xl">PDF</span>
            <div className="absolute top-2 right-2 flex gap-2">
              <button className="text-blue-600 hover:text-blue-800">
                <GrView size={20} />
              </button>
              <button className="text-blue-600 hover:text-blue-800">
                <FaDownload size={20} />
              </button>
            </div>
          </div>

          {/* Remark Input */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">REMARK:</label>
            <div className="bg-white border border-gray-300 rounded p-4 min-h-[50px]">
              {/* Remark content here */}
            </div>
          </div>

          {/* Description Input */}
          <div className="relative mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">DESCRIPTION:</label>
            <div className="bg-white border border-gray-300 rounded p-4 min-h-[50px]">
              {/* Description content here */}
            </div>
          </div>

          {/* Double Tick Circle */}
          <div className="flex justify-center items-center">
            <button
              onClick={handleTickClick}
              className={`w-12 h-12 flex items-center justify-center rounded-full transition-all duration-200 ${
                isTicked ? "bg-green-500 text-white" : "bg-transparent border-2 border-blue-500 text-blue-500"
              }`}
            >
              <FaCheckDouble size={20} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RemarkUI;
