import React, { useState } from "react";
import { FaBell, FaArrowLeft, FaUser, FaHistory, FaCheckCircle, FaTimesCircle, FaExclamationCircle } from "react-icons/fa";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar.jsx";

const Notifications = () => {
  const [notifications, setNotifications] = useState([
    { id: 1, title: "Document Accepted", description: "Your Document was Accepted By CM.", time: "5 minutes ago", type: "accepted", read: false },
    { id: 2, title: "Document Rejected", description: "Your Document was Rejected By CM.", time: "1 hour ago", type: "rejected", read: false },
    { id: 3, title: "Correction Spotted", description: "Document has Correction.", time: "3 hours ago", type: "correction", read: false },
  ]);
  
  const navigate = useNavigate();

  const navigateback = () => {
    navigate("/dashboard");
  };

  const handleMarkAsRead = (id) => {
    setNotifications((prevNotifications) =>
      prevNotifications.map((notification) =>
        notification.id === id ? { ...notification, read: true } : notification
      )
    );
    toast.success("Notification marked as read!", {
      position: "top-center",
      duration: 3000,
    });
  };

  const getNotificationColor = (type) => {
    switch (type) {
      case "accepted":
        return "bg-green-100 text-green-600";
      case "rejected":
        return "bg-red-100 text-red-600";
      case "correction":
        return "bg-yellow-100 text-yellow-600";
      default:
        return "bg-blue-50 text-blue-600";
    }
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case "accepted":
        return <FaCheckCircle size={20} />;
      case "rejected":
        return <FaTimesCircle size={20} />;
      case "correction":
        return <FaExclamationCircle size={20} />;
      default:
        return <FaBell size={20} />;
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-r from-white to-blue-100">
      {/* Navbar */}
     <Navbar/>

      {/* Main Content */}
      <div className="flex items-center justify-center flex-grow">
        <div className="w-full max-w-3xl bg-white shadow-lg border border-gray-200 rounded-lg p-8">
          {/* Back Button */}
          <button
            className="text-blue-600 hover:text-blue-800 mb-6 flex items-center transition-colors duration-300"
            onClick={navigateback}
          >
            <FaArrowLeft size={24} className="mr-2" />
            Back to Dashboard
          </button>

          {/* Notifications List */}
          <div>
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">Your Notifications</h2>
            {notifications.map((notification) => (
              <div
                key={notification.id}
                className={`flex justify-between items-center p-4 mb-4 rounded-lg ${getNotificationColor(notification.type)} shadow-md transform transition-all  `}
              >
                <div className="flex items-center gap-4">
                  <div className="p-2 bg-white rounded-full shadow-md">{getNotificationIcon(notification.type)}</div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800">{notification.title}</h3>
                    <p className="text-sm text-gray-600">{notification.description}</p>
                    <span className="text-xs font-medium text-gray-500">{notification.time}</span>
                  </div>
                </div>
                <button
                  onClick={() => handleMarkAsRead(notification.id)}
                  className="text-blue-600 hover:text-blue-800 w-24 font-semibold transition-colors duration-300 text-sm"
                >
                  {notification.read ? "Read" : "Mark as Read"}
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Notifications;
