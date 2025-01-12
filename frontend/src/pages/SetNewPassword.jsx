import React, { useState, useEffect, useContext } from "react";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { toast, Toaster } from "react-hot-toast";
import { AuthContext } from "../contexts/AuthContext";

const SetNewPassword = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [timer, setTimer] = useState(10);
  const { tempUser, setTempUser, loggedInUser, setLoggedInUser } =
    useContext(AuthContext);
  const navigate = useNavigate();
  // Countdown timer effect
  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => {
        setTimer((prevTimer) => prevTimer - 1);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [timer]);

  const handleResendOtp = async () => {
    navigate("/forgot-password");
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error("Passwords do not match", {
        position: "top-center",
        duration: 3000,
      });
      return;
    }
    try {
      const submitUrl = import.meta.env.VITE_API_URL + "/user/reset-password";
      const response = await fetch(submitUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          newPassword: password,
        }),
        credentials: "include",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || `HTTP error! status: ${response.status}`
        );
      }
      setTempUser(null);
      setLoggedInUser(null);
      toast.success("Password changed successfully!", {
        position: "top-center",
        duration: 3000,
      });
      setTimeout(() => {
        navigate("/");
      }, 1500);
    } catch (error) {
      console.error("Password change failed:", error);
      toast.error(error.message, {
        position: "top-center",
        duration: 3000,
      });
    }
  };
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-white to-blue-100">
      <Toaster />
      <div className="w-96 bg-white shadow-lg border border-gray-200 rounded-lg p-8">
        <div>
          {/* Title */}
          <h2 className="text-center text-xl font-semibold text-gray-800 mb-6">
            Set New Password
          </h2>

          {/* Form */}
          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                New Password
              </label>
              <input
                type="text"
                placeholder="Enter your new password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 bg-white border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none text-black"
              />
            </div>
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Confirm Password
              </label>
              <input
                type="text"
                placeholder="Confirm your password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-4 py-2 bg-white border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none text-black"
              />
            </div>

            <button
              type="submit"
              className="w-full px-4 py-2 bg-blue-500 text-white font-medium rounded-md hover:bg-blue-600 transition duration-200"
            >
              Submit
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SetNewPassword;
