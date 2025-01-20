import React, { useState } from "react";
import { toast, Toaster } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { IoArrowBack } from "react-icons/io5";
import { useAuth } from "../contexts/AuthContext";
import axios from "axios";
const ChangePassword = () => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const { loggedInUser } = useAuth();
  const navigate = useNavigate();

  const handleChangePassword = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      toast.error("New password and confirm password do not match.", {
        position: "top-center",
        duration: 3000,
      });
      return;
    }
    if (newPassword.length < 8) {
      toast.error("New password must be at least 8 characters long.", {
        position: "top-center",
        duration: 3000,
      });
      return;
    }

    const passChangeUrl =
      import.meta.env.VITE_API_URL + "/user/change-password";

    const passwordData = {
      username: loggedInUser.username,
      currentPassword,
      newPassword,
    };
    try {
      const response = await axios.post(passChangeUrl, passwordData, {
        withCredentials: true,
      });
      if (response.status === 200) {
        toast.success(response.data.message, {
          position: "top-center",
          duration: 3000,
        });
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
      }
    } catch (error) {
      console.log(
        "ChangePassword service :: handleChangePassword :: error : ",
        error
      );
      toast.error(error.response.data.message, {
        position: "top-center",
        duration: 3000,
      });
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-white to-blue-100">
      <Toaster />
      <div className="w-full max-w-md bg-white shadow-lg border border-gray-200 rounded-lg p-8 space-y-6">
        <div className="flex justify-start items-center mb-6">
          <IoArrowBack
            size={25}
            className="text-black mt-1 mr-3"
            onClick={() => navigate("/profile")}
          />

          <h2 className="text-xl font-semibold mt text-gray-800 ">
            Change Password
          </h2>
        </div>

        <form onSubmit={handleChangePassword}>
          <div className="mb-4">
            <label
              htmlFor="currentPassword"
              className="block text-sm font-medium text-gray-700"
            >
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
            <label
              htmlFor="newPassword"
              className="block text-sm font-medium text-gray-700"
            >
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
            <label
              htmlFor="confirmPassword"
              className="block text-sm font-medium text-gray-700"
            >
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
