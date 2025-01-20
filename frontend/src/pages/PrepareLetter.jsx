import React from "react";
import { TfiMenu, TfiUser } from "react-icons/tfi";
import Navbar from "../components/Navbar";

const PrepareLetter = () => {
  return (
    <div className="min-h-screen flex flex-col items-center p-4 bg-gradient-to-r from-white to-blue-100">
   <Navbar role="Approver" />

      <div className="mt-6 bg-white p-6 shadow-xl rounded-md w-full max-w-md h-[85vh]">
        <form>
          <div className="mb-4">
            <label className="block text-black sm font-medium mb-2" htmlFor="title">
              Letter Title:
            </label>
            <input
              type="text"
              id="title"
              placeholder="Enter title"
              className="w-full px-4 py-2 rounded-md border-gray-100 bg-gray-50 text-black focus:outline-none focus:ring-2 focus:ring-black"
            />
          </div>
          <div className="mb-4">
            <label className="block text-black sm font-medium mb-2" htmlFor="department">
              Select Department:
            </label>
            <select
              id="department"
              className="w-full px-4 py-2 rounded-md border border-gray-100 bg-gray-50 text-black focus:outline-none focus:ring-2 focus:ring-black"
            >
              <option value="">Department</option>
              <option value="Health">Health</option>
              <option value="Education">Education</option>
              <option value="Finance">Finance</option>
              <option value="Tranprostation">Transportation</option>
            </select>
          </div>

          <div className="mb-4">
            <label className="block text-black sm font-medium mb-2" htmlFor="file">
              Choose File:
            </label>
            <input
              type="file"
              id="file"
              className="w-full px-4 py-2 rounded-md border border-gray-100 bg-gray-50 text-black focus:outline-none focus:ring-2 focus:ring-black"
            />
          </div>

          <div className="mb-4">
            <label className="block text-black sm font-medium mb-2" htmlFor="description">
              Description:
            </label>
            <textarea
              id="description"
              placeholder="Enter description..."
              className="w-full h-24 px-4 py-2 rounded-md border border-gray-100 bg-gray-50 text-black focus:outline-none focus:ring-2 focus:ring-black"
            ></textarea>
          </div>

          <div className="text-center">
            <button
              type="submit"
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-600"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PrepareLetter;
