import React, { useState } from 'react';
import { FaBell, FaArrowLeft, FaUser, FaHistory, FaSearch } from 'react-icons/fa';

const History = () => {
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-r from-white to-blue-100">
      {/* Navbar */}
      <div className="flex justify-between items-center bg-white shadow-md px-6 py-4 border-b border-gray-200">
        <h1 className="text-2xl font-bold text-gray-800">HISTORY</h1>
        <div className="flex gap-4 items-center">
          <button className="text-gray-500 flex gap-4 transition-colors duration-300">
            <FaHistory size={24} className="hover:text-gray-700" />
            <FaBell size={24} className="hover:text-gray-700" />
            <FaUser size={24} className="hover:text-gray-700" />
          </button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="px-6 py-4">
        <div className="relative rounded-md shadow-sm">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <FaSearch className="text-gray-400" />
          </div>
          <input
            type="text"
            name="search"
            id="search"
            className="block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 pl-10 pr-3 py-2"
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* History List */}
      <div className="flex items-center justify-center flex-grow">
        <div className="w-96 bg-white shadow-lg border border-gray-200 rounded-lg p-8">
          {/* Back Button */}
          <button className="text-blue-600 hover:text-blue-800 mb-6 flex items-center transition-colors duration-300">
            <FaArrowLeft size={24} className="mr-2" />
          </button>

          {/* History List */}
          <div>
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">Your History</h2>
            <ul className="space-y-4">
              {/* Example history item */}
              <li className="flex items-center justify-between bg-white p-4 rounded-md shadow-sm hover:bg-gray-100 transition-colors duration-200">
                <div>
                  <h3 className="text-lg font-semibold">Letter Title 1</h3>
                  <p className="text-sm text-gray-500">01/02/2025</p>
                </div>
                <span className="px-3 py-1 rounded-md bg-green-100 text-green-600">ACCEPTED</span>
              </li>
              {/* Add more history items here */}
            </ul>
            <ul className="space-y-4">
              {/* Example history item */}
              <li className="flex items-center justify-between bg-white p-4 rounded-md shadow-sm hover:bg-gray-100 transition-colors duration-200">
                <div>
                  <h3 className="text-lg font-semibold">Letter Title 1</h3>
                  <p className="text-sm text-gray-500">01/02/2025</p>
                </div>
                <span className="px-3 py-1 rounded-md bg-green-100 text-green-600">REJECTED</span>
              </li>
              {/* Add more history items here */}
            </ul>
            <ul className="space-y-4">
              {/* Example history item */}
              <li className="flex items-center justify-between bg-white p-4 rounded-md shadow-sm hover:bg-gray-100 transition-colors duration-200">
                <div>
                  <h3 className="text-lg font-semibold">Letter Title 1</h3>
                  <p className="text-sm text-gray-500">01/02/2025</p>
                </div>
                <span className="px-3 py-1 rounded-md bg-green-100 text-green-600">REJECTED</span>
              </li>
              {/* Add more history items here */}
            </ul>
          </div>
          
        </div>
      </div>
    </div>
  );
};

export default History;
