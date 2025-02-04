import React, { useState } from "react";
import { FaArrowLeft, FaSearch } from "react-icons/fa";
import { Link as RouterLink } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const History = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [historyItems, setHistoryItems] = useState([
    { id: 1, title: "Letter Title 1", date: "01/02/2025", status: "ACCEPTED" },
    { id: 2, title: "Letter Title 2", date: "01/03/2025", status: "REJECTED" },
    { id: 3, title: "Letter Title 3", date: "01/04/2025", status: "PENDING" },
  ]);

  // Filter items based on the search term
  const filteredItems = historyItems.filter((item) =>
    item.title.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const { loggedInUser, setLoggedInUser, loading, logout } = useAuth();

  return (
    <div className="flex items-center justify-center font-roboto min-h-screen bg-gradient-to-r from-white to-blue-100">
      <div className="w-96 bg-white shadow-lg border border-gray-200 rounded-lg p-8">
        {/* Back Button */}
        <RouterLink
          to= {loggedInUser.role=='Admin'? "/admin/dashboard":"/assistant/dashboard"}
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
            <FaSearch className="text-zinc-800" />
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
          {filteredItems.length > 0 ? (
            filteredItems.map((item) => (
              <li
                key={item.id}
                className="flex items-center justify-between bg-white p-4 rounded-md shadow-sm hover:bg-gray-100 transition-colors duration-200"
              >
                <div>
                  <h3 className="text-lg text-black">{item.title}</h3>
                  <p className="text-sm text-gray-500">{item.date}</p>
                </div>
                <span
                  className={`px-3 py-1 rounded-md ${
                    item.status === "ACCEPTED"
                      ? "bg-green-100 text-green-600"
                      : item.status === "REJECTED"
                      ? "bg-red-100 text-red-600"
                      : "bg-yellow-100 text-yellow-600"
                  }`}
                >
                  {item.status}
                </span>
              </li>
            ))
          ) : (
            <p className="text-center text-gray-500">No history found.</p>
          )}
        </ul>
      </div>
    </div>
  );
};

export default History;
