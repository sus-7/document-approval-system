import React, { useState } from "react";
import { Link as RouterLink } from "react-router-dom";

const Register = () => {
  const [selectedToggle, setSelectedToggle] = useState("CM");

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
            Create an Account
          </h2>

          {/* Form */}
          <form>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Full Name
              </label>
              <input
                type="text"
                placeholder="Enter your full name"
                className="w-full px-4 py-2 bg-white border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 text-gray-700 focus:border-blue-500 focus:outline-none"
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email Address
              </label>
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full px-4 py-2 bg-white border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500  text-gray-700 focus:border-blue-500 focus:outline-none"
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <input
                type="password"
                placeholder="Enter your password"
                className="w-full px-4 py-2 bg-white border border-gray-300 rounded-md  text-gray-700  focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none"
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Confirm Password
              </label>
              <input
                type="password"
                placeholder="Confirm your password"
                className="w-full px-4 py-2  text-gray-700 bg-white border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none"
              />
            </div>

            <button className="w-full px-4 py-2 bg-blue-500 text-white font-medium rounded-md hover:bg-blue-600 transition duration-200">
              Register as {selectedToggle}
            </button>
          </form>

          {/* Footer */}
          <div className="text-center mt-6">
            <span className="text-sm text-gray-600">
              Already have an account?{" "}
            </span>
            <RouterLink
              to="/"
              className="text-sm text-blue-500 hover:underline"
            >
              Login 
            </RouterLink>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;