import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { IoArrowBack } from "react-icons/io5";
import {toast,Toaster} from "react-hot-toast";

const EditProfile = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const navigate = useNavigate();

  // Mock data fetch
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userData = {
          name: "John Doe",
          email: "john.doe@example.com",
          phone: "1234567890",
          address: "123 Main Street, Cityville",
        };
        setName(userData.name);
        setEmail(userData.email);
        setPhone(userData.phone);
        setAddress(userData.address);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, []);

  // Save Changes logic
  const handleSaveChanges = async (e) => {
    e.preventDefault();
    try {
      // Mock API call to update user data
      const updatedData = {
        name,
        phone,
        address,
      };
      console.log("Saved Data:", updatedData);
      toast.success("Profile updated successfully!", {
        position: "top-right",
        duration: 3000,
      }); 


    } catch (error) {
      console.error("Error saving changes:", error);
      toast.error("Failed to update profile. Please try again.", {
        position: "top-right",
        duration: 3000,
      });
    }
  };

  // Change Password logic
  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      toast.success("New password and confirm password do not match.", {
        position: "top-right",
        duration: 3000,
      });  // Clear previous messages
      return;
    }
    try {
      // Mock API call to change password
      const passwordData = {
        currentPassword,
        newPassword,
      };
      console.log("Password Data:", passwordData);
        toast.success("Password changed successfully!", {
        position: "top-right",
        duration: 3000,
      });
    } catch (error) {
      console.error("Error changing password:", error);
      toast.error("Failed to change password. Please try again.", {
        position: "top-right",
        duration: 3000,
      });
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-white to-blue-100">
      <Toaster/>
      <div className="w-full max-w-2xl bg-white shadow-lg border border-gray-200 rounded-lg p-8 space-y-6">
        <div className="flex items-start justify-start mb-6 cursor-pointer">
          <IoArrowBack
            className="text-zinc-900 hover:text-zinc-700 text-3xl mt-1 mr-4"
            onClick={() => navigate("/profile")}
          />
          <h1 className="text-2xl font-semibold mt-0.5 text-gray-800">Edit Profile</h1>
        </div>
        {/* Profile Edit Form */}
        <form onSubmit={handleSaveChanges}>
          <div className="mb-4">
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              Name
            </label>
            <input
              type="text"
              id="name"
              className="mt-1 px-4 py-2 w-full bg-white border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none text-gray-900"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              id="email"
              className="mt-1 px-4 py-2 w-full bg-white border border-gray-300 rounded-md text-gray-900 cursor-not-allowed"
              value={email}
              disabled
            />
          </div>
          <div className="mb-4">
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
              Phone
            </label>
            <input
              type="tel"
              id="phone"
              className="mt-1 px-4 py-2 w-full bg-white border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none text-gray-900"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="address" className="block text-sm font-medium text-gray-700">
              Address
            </label>
            <textarea
              id="address"
              rows={4}
              className="mt-1 px-4 py-2 w-full bg-white border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none text-gray-900"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              required
            />
          </div>
          <button
            type="submit"
            className="w-full px-4 py-2 bg-blue-500 text-white font-medium rounded-md hover:bg-blue-600 transition duration-200"
          >
            Save Changes
          </button>
        </form>
        {/* Change Password Section */}
       
      </div>
    </div>
  );
};

export default EditProfile;
