import React, { useState } from "react";
import { FaHistory, FaBell, FaUserAlt, FaSearch } from "react-icons/fa";
import NewCm from "./NewCm";
import SentBackTabContent from "./SentBackTabContent";
import Navbar from "./Navbar";

const PaDashboard = () => {
  const [selectedTab, setSelectedTab] = useState("SENT BACK");
  

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-r from-white to-blue-100">
      {/* Navbar */}
     <Navbar/>

      {/* Main Content */}
      <div className="flex items-center mt-3 h-auto justify-center flex-grow">
        <div className="w-[90%] max-w-[80vh] bg-white shadow-lg border border-gray-200 rounded-lg h-[90vh]">
          {/* Tabs */}
          <div className="tabs flex justify-around items-center text-sm text-gray-700 mt-2 border-b border-gray-200">
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
          <div className="content p-4">
            {selectedTab === "NEW" ? (
              <NewCm />
            ) : (
              <SentBackTabContent />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaDashboard;
