import React, { useState } from "react";
import { BsPlus, BsPersonCircle } from "react-icons/bs";
import { FaSearch } from "react-icons/fa"; // Import FaSearch icon
import Navbar from "../components/Navbar";

const ApprovalPage = () => {
  const [selectedTab, setSelectedTab] = useState("APPROVED");

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-r from-blue-50 via-indigo-100 to-white">
      {/* Navbar */}
      <Navbar role="Approver" />

      {/* Main Content */}
      <div className="flex items-center justify-center flex-grow mt-6 px-6 sm:px-8 lg:px-10">
        <div className="w-full max-w-6xl bg-white  rounded-lg overflow-hidden p-6 flex flex-col">
          {/* Search Section */}
          <div className="relative mb-6">
            <FaSearch className="absolute top-3 left-3 text-gray-500" />
            <input
              type="text"
              placeholder="Search..."
              className="w-full pl-12 pr-6 py-3 rounded-lg bg-gray-100 text-gray-800 border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all ease-in-out duration-200"
            />
          </div>

          {/* Filters */}
          <div className="flex flex-col sm:flex-row sm:space-x-6 mb-6">
            <select className="w-full sm:w-1/2 px-6 py-3 rounded-lg bg-gray-100 text-gray-700 border border-gray-300 focus:ring-2 focus:ring-blue-500 transition-all ease-in-out duration-200">
              <option>Category</option>
              <option>Health</option>
              <option>Education</option>
              <option>Transportation</option>
              <option>Finance</option>
            </select>
            <input
              type="date"
              className="w-full sm:w-1/2 px-6 py-3 mt-4 sm:mt-0 rounded-lg bg-gray-100 text-gray-700 border border-gray-300 focus:ring-2 focus:ring-blue-500 transition-all ease-in-out duration-200"
            />
          </div>

          {/* Tabs */}
          <div className="flex justify-between sm:justify-around items-center text-sm text-gray-700 mb-6  ">
            {["APPROVED", "REJECTED", "REMARK", "PENDING"].map((tab) => (
              <button
                key={tab}
                onClick={() => setSelectedTab(tab)}
                className={`px-6 py-3 font-semibold rounded-lg transition-all duration-200 ease-in-out ${
                  selectedTab === tab
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200 text-gray-700 hover:bg-blue-100"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="flex-grow overflow-auto">
            {selectedTab === "APPROVED" && (
              <div className="space-y-6">
                <h2 className="text-2xl font-semibold text-gray-800">Approved Documents</h2>
                <ul className="space-y-4"> {/* Add space between cards */}
                  <li className="bg-white p-6 border border-gray-200 rounded-lg transition-all duration-200 ease-in-out">
                    <h3 className="text-lg font-semibold text-gray-700">Document 1</h3>
                    <p className="text-sm text-gray-500">Category: Health</p>
                  </li>
                  <li className="bg-white p-6 border border-gray-200 rounded-lg transition-all duration-200 ease-in-out">
                    <h3 className="text-lg font-semibold text-gray-700">Document 2</h3>
                    <p className="text-sm text-gray-500">Category: Education</p>
                  </li>
                </ul>
              </div>
            )}
            {selectedTab === "REJECTED" && (
              <div className="space-y-6">
                <h2 className="text-2xl font-semibold text-gray-800">Rejected Documents</h2>
                <ul className="space-y-4">
                  <li className="bg-white p-6 border border-gray-200 rounded-lg transition-all duration-200 ease-in-out">
                    <h3 className="text-lg font-semibold text-gray-700">Document A</h3>
                    <p className="text-sm text-gray-500">Category: Transportation</p>
                  </li>
                  <li className="bg-white p-6 border border-gray-200 rounded-lg transition-all duration-200 ease-in-out">
                    <h3 className="text-lg font-semibold text-gray-700">Document B</h3>
                    <p className="text-sm text-gray-500">Category: Finance</p>
                  </li>
                </ul>
              </div>
            )}
            {selectedTab === "REMARK" && (
              <div className="space-y-6">
                <h2 className="text-2xl font-semibold text-gray-800">Remark Section</h2>
                <ul className="space-y-4">
                  <li className="bg-white p-6 border border-gray-200 rounded-lg transition-all duration-200 ease-in-out">
                    <h3 className="text-lg font-semibold text-gray-700">Document X</h3>
                    <p className="text-sm text-gray-500">Category: Health</p>
                    <p className="text-sm text-gray-600">Remark: Needs review by HR</p>
                  </li>
                  <li className="bg-white p-6 border border-gray-200 rounded-lg transition-all duration-200 ease-in-out">
                    <h3 className="text-lg font-semibold text-gray-700">Document Y</h3>
                    <p className="text-sm text-gray-500">Category: Education</p>
                    <p className="text-sm text-gray-600">Remark: Awaiting additional details</p>
                  </li>
                </ul>
              </div>
            )}
            {selectedTab === "PENDING" && (
              <div className="space-y-6">
                <h2 className="text-2xl font-semibold text-gray-800">Pending Documents</h2>
                <ul className="space-y-4">
                  <li className="bg-white p-6 border border-gray-200 rounded-lg transition-all duration-200 ease-in-out">
                    <h3 className="text-lg font-semibold text-gray-700">Document 3</h3>
                    <p className="text-sm text-gray-500">Category: Transportation</p>
                  </li>
                  <li className="bg-white p-6 border border-gray-200 rounded-lg transition-all duration-200 ease-in-out">
                    <h3 className="text-lg font-semibold text-gray-700">Document 4</h3>
                    <p className="text-sm text-gray-500">Category: Finance</p>
                  </li>
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApprovalPage;
