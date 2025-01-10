// Sidebar.js

import React from 'react';
import { FaChartLine, FaHistory, FaUsers, FaBell, FaHome } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const Sidebar = () => {
  const navigate = useNavigate();

  return (
    <div className="w-64 h-full bg-gray-800 text-white p-4">
      <div className="text-2xl font-bold mb-6 text-center">Admin Panel</div>
      <div className="space-y-4">
        <button
          onClick={() => navigate("/dashboard")}
          className="flex items-center gap-2 p-3 hover:bg-gray-700 rounded-md w-full"
        >
          <FaHome />
          Dashboard
        </button>
        <button
          onClick={() => navigate("/history")}
          className="flex items-center gap-2 p-3 hover:bg-gray-700 rounded-md w-full"
        >
          <FaHistory />
          History
        </button>
        <button
          onClick={() => navigate("/manage-users")}
          className="flex items-center gap-2 p-3 hover:bg-gray-700 rounded-md w-full"
        >
          <FaUsers />
          Manage Users
        </button>
        <button
          onClick={() => navigate("/notifications")}
          className="flex items-center gap-2 p-3 hover:bg-gray-700 rounded-md w-full"
        >
          <FaBell />
          Notifications
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
