import React, { useState } from "react";
import { FiSearch } from "react-icons/fi";
import { BsPersonCircle } from "react-icons/bs";

const CM_New = () => {
  const [selectedTab, setSelectedTab] = useState("NEW");

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-white to-blue-100">
      <div className="w-full max-w-2xl bg-white shadow-lg border border-gray-200 rounded-lg p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-t-lg">
          <h1 className="text-xl font-bold text-gray-800">NEW</h1>
          <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center cursor-pointer">
            <BsPersonCircle className="text-4xl text-gray-500" />
          </div>
        </div>

        {/* Tabs */}
        <div className="flex justify-around border-b border-gray-300 pb-2">
          {["NEW", "SENT BACK"].map((tab) => (
            <button
              key={tab}
              className={`px-4 py-2 text-sm font-medium transition-all duration-200 ${
                selectedTab === tab
                  ? "text-white bg-blue-500 rounded-md" // Selected tab styling
                  : "text-white bg-gray-400 rounded-md hover:bg-blue-500" // Non-selected tab styling
              }`}
              onClick={() => setSelectedTab(tab)}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Search and Filters */}
        <div className="p-4 flex flex-wrap items-center gap-4 bg-gray-50">
          <div className="relative w-full">
            <FiSearch className="absolute top-3 left-3 text-gray-400" />
            <input
              type="text"
              placeholder="Search"
              className="w-full pl-10 pr-4 py-2 rounded-md bg-gray-100 text-gray-800 border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          <select
            className="px-4 py-2 rounded-md bg-black text-gray-100 border border-clack focus:ring-2 focus:ring-blue-500 focus:outline-none"
          >
            <option>Category</option>
            <option>Type 1</option>
            <option>Type 2</option>
            <option>Type 3</option>
          </select>

          <input
            type="date"
            className="px-4 py-2 rounded-md bg-black text-gray-100 border border-black focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
        </div>

        {/* Document List */}
        <div className="p-4 space-y-4 bg-gray-50 rounded-b-md">
          {[1, 2, 3, 4, 5].map((item) => (
            <div
              key={item}
              className="flex items-center justify-between bg-gray-100 p-4 rounded-md shadow-md border border-gray-300"
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-gray-200 flex items-center justify-center rounded-md">
                  <span className="text-gray-500 text-xl">📄</span>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-800">
                    Letter Title
                  </h3>
                  <p className="text-xs text-gray-500">01/02/2025</p>
                </div>
              </div>
              <span className="text-sm font-semibold text-blue-500">PENDING</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CM_New;
