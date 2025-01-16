import React, { useState, useContext, useEffect } from "react";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";
import { toast, Toaster } from "react-hot-toast";

const Login = () => {
  const [selectedToggle, setSelectedToggle] = useState("Assistant");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { loggedInUser, setLoggedInUser } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (loggedInUser) {
      if (loggedInUser.role === "Approver") {
        navigate("/dashboard");
      } else if (loggedInUser.role === "Senior Assistant") {
        navigate("/page");
      }
    }
  }, [loggedInUser, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const apiUrl = import.meta.env.VITE_API_URL + "/user/signin";
    const formData = { username, password };
    const minimumDuration = 500; // Minimum spinner duration in ms
    const startTime = Date.now();

    try {
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
        credentials: "include",
      });

      const elapsedTime = Date.now() - startTime;
      const remainingTime = Math.max(minimumDuration - elapsedTime, 0);
      await new Promise((resolve) => setTimeout(resolve, remainingTime));

      if (!response.ok) {
        throw new Error("Login failed! Please try again.");
      }

      const result = await response.json();
      setLoggedInUser(result.user);
      setUsername("");
      setPassword("");
      toast.success("Login successful!", {
        position: "top-center",
        duration: 2000,
      });
    } catch (error) {
      toast.error(error.message || "Login failed! Please try again.", {
        position: "top-center",
        duration: 2000,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-white to-blue-100">
      <Toaster />
      {loading && (
        <div className="absolute inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50">
          <div className="spinner-border text-white w-16 h-16 border-4 border-t-4 rounded-full"></div>
        </div>
      )}
      <button
        className="absolute top-4 right-4 bg-red-600 text-white p-2 rounded-md"
        onClick={() => navigate("/adminLogin")}
      >
        Admin
      </button>
      <div className="w-96 bg-white shadow-lg border border-gray-200 rounded-lg p-8">
        <div className="flex justify-center gap-4 mb-6">
          <button
            className={`px-4 py-2 text-sm font-medium rounded-md ${selectedToggle === "Approver"
                ? "bg-blue-500 text-white"
                : "bg-gray-100 text-gray-700"
              }`}
            onClick={() => setSelectedToggle("Approver")}
          >
            Approver
          </button>
          <button
            className={`px-4 py-2 text-sm font-medium rounded-md ${selectedToggle === "Assistant"
                ? "bg-blue-500 text-white"
                : "bg-gray-100 text-gray-700"
              }`}
            onClick={() => setSelectedToggle("Assistant")}
          >
            Assistant
          </button>
        </div>

        <h2 className="text-center text-xl font-semibold text-gray-800 mb-6">
          Welcome Back!
        </h2>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Username
            </label>
            <input
              type="text"
              placeholder="Enter your username"
              className="w-full px-4 py-2 bg-white border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              type="password"
              placeholder="Enter your password"
              className="w-full px-4 py-2 bg-white border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
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

          <button
            type="submit"
            className="w-full px-4 py-2 bg-blue-500 text-white font-medium rounded-md hover:bg-blue-600 transition duration-200"
          >
            Login as {selectedToggle}
          </button>
        </form>

        {selectedToggle === "Assistant" && (
          <div className="text-center mt-6">
            <span className="text-sm text-gray-600">
              Don't have an account?{" "}
            </span>
            <RouterLink
              to="/register"
              className="text-sm text-blue-500 hover:underline"
            >

              Register
            </RouterLink>
          </div>
        )}
      </div>
    </div>
  );
};

export default Login;
