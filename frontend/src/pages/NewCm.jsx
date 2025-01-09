import React from "react";
import { FaSearch } from "react-icons/fa";

const NewCm = () => {
  return (
    <div className="flex flex-col space-y-6">
      {/* Search Section */}
      <div className="relative">
        <FaSearch className="absolute top-3 left-3 text-gray-400" />
        <input
          type="text"
          placeholder="Search"
          className="w-full pl-10 pr-4 py-2 rounded-md bg-gray-100 text-gray-800 border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none"
        />
      </div>

      {/* Filters */}
      <div className="flex space-x-4">
        <select className="flex-1 px-4 py-2 rounded-md bg-gray-200 text-gray-700 border border-gray-300">
          <option>Category</option>
          <option>Health</option>
          <option>Education</option>
          <option>Transportation</option>
          <option>Finance</option>
        </select>
        <input
          type="date"
          className="flex-1 px-4 py-2 rounded-md bg-gray-200 text-gray-700 border border-gray-300"
        />
      </div>

      {/* Documents */}
      <div className="space-y-4">
        {[1, 2, 3].map((item) => (
          <div
            key={item}
            className="flex justify-between items-center bg-gray-100 p-4 rounded-md shadow-md border border-gray-300"
          >
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-gray-200 flex items-center justify-center rounded-md">
                📄
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-800">
                  Letter Title {item}
                </h3>
                <p className="text-xs text-gray-500">01/02/2025</p>
              </div>
            </div>
            <span className="text-sm font-semibold text-blue-500">
              PENDING
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NewCm;
