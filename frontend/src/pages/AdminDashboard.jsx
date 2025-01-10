// AdminDashboard.js

import React from "react";
import Sidebar from "../components/Sidebar";
import { Line } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from "chart.js";

// Register chart components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const AdminDashboard = () => {
  const data = {
    labels: ["January", "February", "March", "April", "May", "June", "July"],
    datasets: [
      {
        label: "Users Registered",
        data: [65, 59, 80, 81, 56, 55, 40],
        borderColor: "rgba(75, 192, 192, 1)",
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        fill: true,
      },
    ],
  };

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 p-8 bg-gray-100">
        <h1 className="text-2xl font-semibold mb-6">Admin Dashboard</h1>

        {/* Graph */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">User Registrations Over Time</h2>
          <Line data={data} />
        </div>

        {/* Add other sections like History and User Management here */}
      </div>
    </div>
  );
};

export default AdminDashboard;
