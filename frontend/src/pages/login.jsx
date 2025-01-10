import React, { useState, useContext, useEffect } from "react";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";
import {toast,Toaster} from "react-hot-toast";
const Login = () => {
  const [selectedToggle, setSelectedToggle] = useState("Assistant");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { tempUser, setTempUser, loggedInUser, setLoggedInUser } =
    useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (loggedInUser) {
      //todo:role based access
      navigate("/dashboard");
    }
  }, [loggedInUser]);
  const handleSubmit = async (e) => {
    e.preventDefault();
    const apiUrl = import.meta.env.VITE_API_URL + "/user/signin";

    const formData = {
      username,
      password,
    };

    try {
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
        credentials: "include",
      });

      if (!response.ok) {
        console.log(await response.json());
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log("Signin successful:", result);
      setLoggedInUser(result.user);
      toast.success("Login successful!", {
        position: "top-center",
        duration: 2000,
      });
      navigate("/dashboard");
    } catch (error) {
      console.error("Error during signup:", error);
      toast.error("Login failed! Please try again.", {
        position: "top-center",
        duration: 2000,
      });
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-white to-blue-100"> 
      <Toaster/>
      <button className="absolute top-4 bg-red-600 text-white p-2 rounded-md  right-4" onClick={() => navigate("/adminLogin")}>Admin</button>  
      <div className="w-96 bg-white shadow-lg border border-gray-200 rounded-lg p-8">
        <div>
          {/* Toggle Buttons for CM/PA */}
          <div className="flex justify-center gap-4 mb-6">
            <button
              className={`px-4 py-2 text-sm font-medium rounded-md ${
                selectedToggle === "Approver"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-100 text-gray-700"
              }`}
              onClick={() => setSelectedToggle("Approver")}
            >
              Approver
            </button>
            <button
              className={`px-4 py-2 text-sm font-medium rounded-md ${
                selectedToggle === "Assistant"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-100 text-gray-700"
              }`}
              onClick={() => setSelectedToggle("Assistant")}
            >
              Assistant
            </button>
          </div>

          {/* Title */}
          <h2 className="text-center text-xl font-semibold text-gray-800 mb-6">
            Welcome Back!
          </h2>

          {/* Form */}
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Username
              </label>
              <input
                type="text"
                placeholder="Enter your username"
                className="w-full px-4 py-2 bg-white border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none text-black"
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
                className="w-full px-4 py-2 bg-white border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none text-black"
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

            <button className="w-full px-4 py-2 bg-blue-500 text-white font-medium rounded-md hover:bg-blue-600 transition duration-200">
              Login as {selectedToggle}
            </button>
          </form>

          {/* Footer */}
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
    </div>
  );
};

export default Login;
