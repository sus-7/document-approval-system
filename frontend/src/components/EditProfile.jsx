import React, { useState, useEffect } from 'react';
import { FaUserCircle } from 'react-icons/fa';
// Import additional libraries for fetching user data (replace with your actual implementation)
// import { getUserData } from './api'; // Example API call

const EditProfile = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');

  // Fetch user data on component mount (replace with your logic)
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // Replace with your API call to fetch user data
        // const response = await getUserData();
        // const userData = response.data;
        // setName(userData.name);
        // setEmail(userData.email);
        // setPhone(userData.phone);
        // setAddress(userData.address);
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserData();
  }, []);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-white to-blue-100">
      <div className="w-full max-w-2xl bg-white shadow-lg border border-gray-200 rounded-lg p-8 space-y-6">
        <h1 className="text-2xl font-bold">Edit Profile</h1>
        <form>
          <div className="mb-4">
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              Name
            </label>
            <input
              type="text"
              id="name"
              className="mt-1 p-2 w-full border rounded-md focus:ring-blue-500 focus:border-blue-500"
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
              className="mt-1 p-2 w-full border rounded-md focus:ring-blue-500 focus:border-blue-500"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled // Disable email editing (optional)
            />
          </div>
          <div className="mb-4">
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
              Phone
            </label>
            <input
              type="tel"
              id="phone"
              className="mt-1 p-2 w-full border rounded-md focus:ring-blue-500 focus:border-blue-500"
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
              className="mt-1 p-2 w-full border rounded-md focus:ring-blue-500 focus:border-blue-500"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              required
            />
          </div>
          <button
            type="submit" // Changed to type="submit" for form submission
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Save Changes
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditProfile;