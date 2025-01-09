import React, { useState } from "react";
import { BsPlus, BsPersonCircle } from "react-icons/bs";
import { FaSearch } from "react-icons/fa"; // Import FaSearch icon
import Navbar from "./Navbar";

const ApprovalPage = () => {
  const [selectedTab, setSelectedTab] = useState("APPROVED");

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-r from-white to-blue-100">
      {/* Navbar */}
      <Navbar role="Approver" />

      {/* Main Content */}
      <div className="flex items-center justify-center flex-grow mt-6 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-[90vw] lg:max-w-[80vh] bg-white shadow-lg border border-gray-200 rounded-lg h-[90vh] p-4 flex flex-col">
          {/* Search Section */}
          <div className="relative mb-4">
            <FaSearch className="absolute top-3 left-3 text-gray-400" />
            <input
              type="text"
              placeholder="Search"
              className="w-full pl-10 pr-4 py-2 rounded-md bg-gray-100 text-gray-800 border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          {/* Filters */}
          <div className="flex flex-col sm:flex-row sm:space-x-4 mb-4">
            <select className="w-full sm:w-1/2 px-4 py-2 rounded-md bg-gray-200 text-gray-700 border border-gray-300">
              <option>Category</option>
              <option>Health</option>
              <option>Education</option>
              <option>Transportation</option>
              <option>Finance</option>
            </select>
            <input
              type="date"
              className="w-full sm:w-1/2 px-4 py-2 mt-4 sm:mt-0 rounded-md bg-gray-200 text-gray-700 border border-gray-300"
            />
          </div>

          {/* Tabs */}
          <div className="tabs flex flex-wrap justify-between sm:justify-around items-center text-sm text-gray-700 mb-4 border-b border-gray-200">
            {["APPROVED", "REJECTED", "REMARK", "PENDING"].map((tab) => (
              <button
                key={tab}
                onClick={() => setSelectedTab(tab)}
                className={`px-4 py-2 font-medium rounded-md ${
                  selectedTab === tab
                    ? "bg-blue-500 text-white"
                    : "bg-gray-100 text-gray-700"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="flex-grow overflow-auto">
            {selectedTab === "APPROVED" && <div>Approved Content</div>}
            {selectedTab === "REJECTED" && <div>Rejected Content</div>}
            {selectedTab === "REMARK" && <div>Remark Content</div>}
            {selectedTab === "PENDING" && <div>Pending Content</div>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApprovalPage;
