import React from "react";
import { FaHistory } from "react-icons/fa";
import { FaBell } from "react-icons/fa";
import { FaUserAlt } from "react-icons/fa";
import { FaSearch } from "react-icons/fa";

const SentBack = () => {
  return (
    <div className="bg-blue-50 flex min-h-screen items-center justify-center">
      <div className="bg-white w-[90%] max-w-[80vh] shadow-lg rounded-lg h-[100vh]">
        <div className="navbar w-full h-[8vh] flex items-center justify-between text-gray-700 px-4 border-b border-gray-200">
          <button className="text-lg">
            <FaHistory />
          </button>
          <h1 className="text-center text-sm font-semibold tracking-wider">
          </h1>
          <div className="flex space-x-4">
            <button>
              <FaBell />
            </button>
            <button>
              <FaUserAlt />
            </button>
          </div>
        </div>

        <div className="tabs flex justify-around items-center text-sm text-gray-700 mt-2 border-b border-gray-200">
          <button className="pb-2 border-gray-700">NEW</button>
          <button className="pb-2 border-b-2 text-gray-500">SENT BACK</button>
        </div>

        <div className="search-section flex items-center space-x-2 px-4 mt-4">
          <div className="flex bg-gray-200 items-center rounded-full px-3 py-1 w-full">
            <FaSearch className="text-gray-500 text-sm" />
            <input
              type="text"
              placeholder="Hinted search text"
              className="bg-transparent text-sm text-gray-700 ml-2 outline-none w-full"
            />
          </div>
        </div>

        <div className="filters flex items-center justify-between px-4 mt-4">
          <select className="bg-gray-200 text-gray-700 text-sm rounded-md px-3 py-1">
            <option>Category</option>
            <option>Health</option>
            <option>Education</option>
            <option>Transportation</option>
            <option>Finance</option>
          </select>
          <input
            type="date"
            className="bg-gray-200 text-gray-700 text-sm rounded-md px-3 py-1"
          />
        </div>

        <div className="letters mt-4 space-y-4 px-4">
          {[
            { title: "Letter Title", date: "01/02/2025", status: "CORRECTION" },
            { title: "Letter Title", date: "01/02/2025", status: "REJECTED" },
            { title: "Letter Title", date: "01/02/2025", status: "CORRECTION" },
            { title: "Letter Title", date: "01/02/2025", status: "REJECTED" },
          ].map((letter, index) => (
            <div
              key={index}
              className="letter-card bg-gray-100 text-gray-700 flex justify-between items-center px-3 py-2 rounded-lg shadow-md"
            >
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gray-300 text-gray-800 rounded-full flex items-center justify-center text-xs font-bold">
                  PDF
                </div>
                <div>
                  <p className="text-sm font-semibold">{letter.title}</p>
                  <p className="text-xs text-gray-500">{letter.date}</p>
                </div>
              </div>
              <p
                className={`text-xs font-semibold ${
                  letter.status === "REJECTED"
                    ? "text-red-500"
                    : "text-yellow-600"
                }`}
              >
                {letter.status}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SentBack;
