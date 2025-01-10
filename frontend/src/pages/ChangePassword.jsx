import React, { useState } from "react";
import {toast,Toaster} from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { IoArrowBack } from "react-icons/io5";

const ChangePassword = () => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("1234");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const handleChangePassword = (e) => {
    e.preventDefault();

    // Clear previous messages
    setError("");
    setSuccess("");

    // Validation checks
    if (newPassword !== confirmPassword) {
      setError("New password and confirm password do not match.");
      return;
    }
    if (newPassword.length < 8) {
      setError("New password must be at least 8 characters long.");
      return;
    }

    // Mock password change logic (replace with API call)
    const isPasswordCorrect = currentPassword === "1234"; // Mock current password validation
    if (!isPasswordCorrect) {
      setError("Current password is incorrect.");
      return;
    }

    // Simulate successful password change
    toast.success("Password changed successfully!", {
      position: "top-center",
      duration: 3000,
    });
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-white to-blue-100">
      <Toaster/>
      <div className="w-full max-w-md bg-white shadow-lg border border-gray-200 rounded-lg p-8 space-y-6">
        <div className="flex justify-start items-center mb-6">
        <IoArrowBack size={25} className="text-black mt-1 mr-3" onClick={() => navigate("/profile")} />
        
        <h2 className="text-xl font-semibold mt text-gray-800 ">
            Change Password</h2>
            
        </div>       


        <form onSubmit={handleChangePassword}>
          {error && (
            <p className="text-red-600 text-sm mb-4">{error}</p>
          )}
          {success && (
            <p className="text-green-600 text-sm mb-4">{success}</p>
          )}
          <div className="mb-4">
            <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700">
              Current Password
            </label>
            <input
              type="password"
              id="currentPassword"
              className="mt-1 px-4 py-2 w-full bg-white border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none text-gray-900"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700">
              New Password
            </label>
            <input
              type="password"
              id="newPassword"
              className="mt-1 px-4 py-2 w-full bg-white border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none text-gray-900"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
              Confirm Password
            </label>
            <input
              type="password"
              id="confirmPassword"
              className="mt-1 px-4 py-2 w-full bg-white border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none text-gray-900"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>
          <button
            type="submit"
            className="w-full px-4 py-2 bg-blue-500 text-white font-medium rounded-md hover:bg-blue-600 transition duration-200"
          >
            Change Password
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChangePassword;
