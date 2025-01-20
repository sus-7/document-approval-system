import React from "react";
import {
  FaUserCircle,
  FaEdit,
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaLock,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { useAuth } from "../contexts/AuthContext";
const ProfileDashboard = () => {
  const navigate = useNavigate();
  const { loggedInUser } = useAuth();
  const userData = {
    name: loggedInUser.fullName,
    email: loggedInUser.email,
    phone: loggedInUser.mobileNo,
    address: "123 Main Street, Cityville",
  };

  const navigateToEditProfile = (e) => {
    e.preventDefault();
    navigate("/edit/profile");
  };

  const navigateToChangePassword = (e) => {
    e.preventDefault();
    navigate("/changepassword");
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-r from-white to-blue-100">
      {/* Navbar */}
      <Navbar />
      {/* Main Content */}
      <div className="flex flex-col items-center justify-center flex-grow p-4">
        <div className="w-full max-w-3xl bg-white shadow-lg border border-gray-200 rounded-lg p-6 sm:p-8 space-y-8">
          {/* Header Section */}
          <div className="flex flex-col sm:flex-row items-center justify-end gap-4">
            <div className="flex gap-4">
              <button
                onClick={navigateToEditProfile}
                className="px-4 py-2 bg-blue-500 text-white font-medium rounded-md hover:bg-blue-600 transition duration-200 flex items-center"
              >
                <FaEdit className="mr-2" />
                Edit Profile
              </button>
              <button
                onClick={navigateToChangePassword}
                className="px-4 py-2 bg-green-500 text-white font-medium rounded-md hover:bg-green-600 transition duration-200 flex items-center"
              >
                <FaLock className="mr-2" />
                Change Password
              </button>
            </div>
          </div>

          {/* Profile Info Section */}
          <div className="flex flex-col sm:flex-row items-center gap-6">
            <FaUserCircle size={80} className="text-blue-500" />
            <div className="text-center sm:text-left">
              <h2 className="text-xl font-medium text-gray-800">
                {userData.name}
              </h2>
              <p className="text-sm text-gray-500">
                Welcome to your dashboard!
              </p>
            </div>
          </div>

          {/* User Details Section */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Email */}
            <div className="flex items-center bg-gray-50 border border-gray-200 rounded-lg p-4">
              <FaEnvelope className="text-blue-500 text-lg mr-4" />
              <div>
                <h3 className="text-sm font-medium text-gray-700">Email</h3>
                <p className="text-gray-900">{userData.email}</p>
              </div>
            </div>

            {/* Phone */}
            <div className="flex items-center bg-gray-50 border border-gray-200 rounded-lg p-4">
              <FaPhone className="text-blue-500 text-lg mr-4" />
              <div>
                <h3 className="text-sm font-medium text-gray-700">Phone</h3>
                <p className="text-gray-900">{userData.phone}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileDashboard;
