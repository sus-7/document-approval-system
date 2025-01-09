import React from "react";
import { FaUserCircle, FaEdit, FaEnvelope, FaPhone, FaMapMarkerAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { IoArrowBack } from "react-icons/io5";
const ProfileDashboard = () => {
    const navigate = useNavigate();
    const userData = {
        name: "John Doe",
        email: "john.doe@example.com",
        phone: "1234567890",
        address: "123 Main Street, Cityville",
    };


    const navigateToEditProfile = (e) => {
            e.preventDefault();
            navigate("/edit/profile");
    }
    return (
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-white to-blue-100">
            <div className="w-full max-w-3xl bg-white shadow-lg border border-gray-200 rounded-lg p-8">
                <div className="flex items-center justify-between mb-6">
                    <h1 className="text-2xl font-semibold text-gray-800">Profile Dashboard</h1>
                    <button onClick={navigateToEditProfile} className="px-4 py-2 bg-blue-500 text-white font-medium rounded-md hover:bg-blue-600 transition duration-200 flex items-center">
                        <FaEdit className="mr-2"  />
                        Edit Profile
                    </button>
                </div>
                <div className="flex items-center gap-6 mb-8">
                    <FaUserCircle size={80} className="text-blue-500" />
                    <div>
                        <h2 className="text-xl font-medium text-gray-800">{userData.name}</h2>
                        <p className="text-sm text-gray-500">Welcome to your dashboard!</p>
                    </div>
                </div>
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
                    {/* Address */}
                    <div className="flex items-center bg-gray-50 border border-gray-200 rounded-lg p-4 sm:col-span-2">
                        <FaMapMarkerAlt className="text-blue-500 text-lg mr-4" />
                        <div>
                            <h3 className="text-sm font-medium text-gray-700">Address</h3>
                            <p className="text-gray-900">{userData.address}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfileDashboard;
