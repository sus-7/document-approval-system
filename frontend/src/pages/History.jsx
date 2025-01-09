import React, { useState } from "react";
import { FaArrowLeft, FaSearch } from "react-icons/fa";
import { Link as RouterLink } from "react-router-dom";

const History = () => {
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-white to-blue-100">
      <div className="w-96 bg-white shadow-lg border border-gray-200 rounded-lg p-8">
        {/* Back Button */}
        <RouterLink
          to="/dashboard"
          className="text-blue-600 hover:text-blue-800 mb-6 flex items-center transition-colors duration-300"
        >
          <FaArrowLeft size={24} className="mr-2" />
        </RouterLink>

        {/* Title */}
        <h2 className="text-center text-xl font-semibold text-gray-800 mb-6">
          Your History
        </h2>

        {/* Search Bar */}
        <div className="relative mb-6">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <FaSearch className="text-gray-400" />
          </div>
          <input
            type="text"
            name="search"
            id="search"
            className="w-full px-4 py-2 bg-white border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none pl-10 text-black"
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* History List */}
        <ul className="space-y-4">
          <li className="flex items-center justify-between bg-white p-4 rounded-md shadow-sm hover:bg-gray-100 transition-colors duration-200">
            <div>
              <h3 className="text-lg font-semibold">Letter Title 1</h3>
              <p className="text-sm text-gray-500">01/02/2025</p>
            </div>
            <span className="px-3 py-1 rounded-md bg-green-100 text-green-600">
              ACCEPTED
            </span>
          </li>
          <li className="flex items-center justify-between bg-white p-4 rounded-md shadow-sm hover:bg-gray-100 transition-colors duration-200">
            <div>
              <h3 className="text-lg font-semibold">Letter Title 2</h3>
              <p className="text-sm text-gray-500">01/03/2025</p>
            </div>
            <span className="px-3 py-1 rounded-md bg-red-100 text-red-600">
              REJECTED
            </span>
          </li>
          <li className="flex items-center justify-between bg-white p-4 rounded-md shadow-sm hover:bg-gray-100 transition-colors duration-200">
            <div>
              <h3 className="text-lg font-semibold">Letter Title 3</h3>
              <p className="text-sm text-gray-500">01/04/2025</p>
            </div>
            <span className="px-3 py-1 rounded-md bg-yellow-100 text-yellow-600">
              PENDING
            </span>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default History;
