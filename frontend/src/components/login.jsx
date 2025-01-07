import React, { useState } from "react";
import { Link as RouterLink, useNavigate } from "react-router-dom";

const Login = () => {
  const [selectedToggle, setSelectedToggle] = useState("CM");
  const navigate = useNavigate();

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-white to-blue-100">
      <div className="w-96 bg-white shadow-lg border border-gray-200 rounded-lg p-8">
        <div>
          {/* Toggle Buttons for CM/PA */}
          <div className="flex justify-center gap-4 mb-6">
            <button
              className={`px-4 py-2 text-sm font-medium rounded-md ${
                selectedToggle === "CM"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-100 text-gray-700"
              }`}
              onClick={() => setSelectedToggle("CM")}
            >
              CM
            </button>
            <button
              className={`px-4 py-2 text-sm font-medium rounded-md ${
                selectedToggle === "PA"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-100 text-gray-700"
              }`}
              onClick={() => setSelectedToggle("PA")}
            >
              PA
            </button>
          </div>

          {/* Title */}
          <h2 className="text-center text-xl font-semibold text-gray-800 mb-6">
            Welcome Back!
          </h2>

          {/* Form */}
          <form>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email Address
              </label>
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full px-4 py-2 bg-white border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none text-black"
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <input
                type="password"
                placeholder="Enter your password"
                className="w-full px-4 py-2 bg-white border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none text-black"
              />
            </div>

            <div className="flex justify-between items-center mb-4">
              <label className="flex items-center text-sm text-gray-600">
                <input
                  type="checkbox"
                  className="text-blue-500 focus:ring-blue-500 rounded"
                />
                <span className="ml-2">Remember Me</span>
              </label>
              <RouterLink
                to="/forgot-password"
                className="text-sm text-blue-500 hover:underline"
              >
                Forgot Password?
              </RouterLink>
            </div>

            <button className="w-full px-4 py-2 bg-blue-500 text-white font-medium rounded-md hover:bg-blue-600 transition duration-200">
              Login as {selectedToggle}
            </button>
          </form>

          {/* Footer */}
          <div className="text-center mt-6">
            <span className="text-sm text-gray-600">
              Don't have an account?{" "}
            </span>
            <RouterLink
              to="/register"
              className="text-sm text-blue-500 hover:underline"
            >
              Register as {selectedToggle}
            </RouterLink>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;