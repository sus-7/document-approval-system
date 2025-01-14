import React from "react";
import { FiBell } from "react-icons/fi"; // Notification Icon
import { AiOutlineHistory } from "react-icons/ai"; // History Icon
import { BsPersonCircle } from "react-icons/bs"; // Profile Icon

const Correction = () => {
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-r from-white to-blue-100">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 bg-gray-300 text-white">
        {/* History Icon on the Left */}
        <button className="text-gray-800 text-xl hover:text-gray-200 transition duration-200 p-0">
          <AiOutlineHistory />
        </button>

        {/* Title */}
        <h1 className="text-gray-900 text-xl font-bold">Correction</h1>

        {/* Profile and Notification Icons */}
        <div className="flex gap-4">
          <button className="text-gray-800 text-xl hover:text-gray-200 transition duration-200 p-0">
            <FiBell />
          </button>
          <button className="text-gray-800 text-xl hover:text-gray-200 transition duration-200 p-0">
            <BsPersonCircle />
          </button>
        </div>
      </div>

      {/* Document Info */}
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-base text-lg font-semibold text-gray-800">Letter Title 1</h2>
          <p className="text-sm text-gray-500">01/02/2025</p>
        </div>
        <p className="text-right text-blue-600 font-medium">Remark</p>
      </div>

      {/* PDF Placeholder */}
      <div className="flex justify-center items-center h-40 bg-gray-100">
        <div className="text-center">
          <div className="w-15 h-15 flex items-center justify-center rounded-lg">
            <span className="text-gray-600 text-4xl">PDF</span>
          </div>
          <p className="text-sm text-gray-500 mt-2">Document Preview</p>
        </div>
      </div>

      {/* Remark and Description */}
      <div className="px-6 py-4 space-y-6">
        <div>
          <label htmlFor="remark" className="text-sm font-medium">
            Remark:
          </label>
          <textarea
            id="remark"
            className="w-full mt-2 p-3 rounded-md bg-gray-50 text-gray-700 border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none resize-none"
            rows="2"
            placeholder="Enter remarks here..."
          ></textarea>
        </div>
        <div>
          <label htmlFor="description" className="text-sm font-medium">
            Description:
          </label>
          <textarea
            id="description"
            className="w-full mt-2 p-3 rounded-md bg-gray-50 text-gray-700 border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none resize-none"
            rows="4"
            placeholder="Enter description here..."
          ></textarea>
        </div>
      </div>

      {/* Submit Button */}
      <div className="px-6 py-4">
        <button className="w-full px-4 py-3 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-600 transition duration-200">
          Submit
        </button>
      </div>
    </div>
  );
};

export default Correction;