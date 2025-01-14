import React, { useState } from "react";
import { FaUserPlus, FaEdit, FaTrashAlt } from "react-icons/fa";
import { Toaster, toast } from "react-hot-toast";
import axios from "axios";
const AddUser = ({ showAddUser, setShowAddUser }) => {
  const [newUser, setNewUser] = useState({
    fullName: "",
    role: "Approver",
    email: "",
    mobileNo: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({
    username: "",
    fullName: "",
    email: "",
    mobileNo: "",
    password: "",
    confirmPassword: "",
  });
  const validateInputs = (user) => {
    let valid = true;
    const newErrors = {
      username: "",
      name: "",
      email: "",
      mno: "",
      password: "",
      confirmPassword: "",
    };

    if (!user.username.trim()) {
      newErrors.username = "username is required.";
      valid = false;
    }
    if (!user.fullName.trim()) {
      newErrors.fullName = "full name is required.";
      valid = false;
    }
    if (!user.email.trim()) {
      newErrors.email = "Email is required.";
      valid = false;
    }
    if (!user.mobileNo.trim() || !/^\d{10}$/.test(user.mobileNo)) {
      newErrors.mobileNo = "A valid 10-digit Mobile Number is required.";
      valid = false;
    }
    if (!user.password.trim() || user.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters long.";
      valid = false;
    }
    if (user.password !== user.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match.";
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const handleAddUser = async () => {
    if (!validateInputs(newUser)) return;

    // const newUserData = { id: Date.now(), ...newUser };
    try {
      delete newUser.confirmPassword;
      const response = await axios.post(
        "http://localhost:4000/assistant/create-user",
        newUser,
        {
          withCredentials: true,
        }
      );
      if (response.status === 200) {
        toast.success("User added successfully", {
          position: "top-right",
          duration: 3000,
        });
        setShowModal(false);
        setNewUser({
          fullName: "",
          role: "Approver",
          email: "",
          mobileNo: "",
          password: "",
          confirmPassword: "",
        });
        setErrors({});
      } else {
        toast.error("Error adding user", {
          position: "top-right",
          duration: 3000,
        });
      }
    } catch (error) {
      console.log(error.response.data.message);
      toast.error(error.response.data.message, {
        position: "top-right",
        duration: 3000,
      });
      return;
    }
    setUsers((prevUsers) => {
      const updatedUsers = { ...prevUsers };
      updatedUsers[newUser.role].push(newUserData);
      return updatedUsers;
    });

    toast.success("User added successfully", {
      position: "top-right",
      duration: 3000,
    });

    setShowModal(false);
    setNewUser({
      fullName: "",
      role: "Approver",
      email: "",
      mobileNo: "",
      password: "",
      confirmPassword: "",
    });
  };
  const handleCancelAdd = () => {
    setShowAddUser(false);
    setNewUser({
      fullName: "",
      role: "Approver",
      email: "",
      mobileNo: "",
      password: "",
      confirmPassword: "",
    });
  };

  return (
    showAddUser && (
      <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50">
        <div className="bg-white p-8 rounded-lg w-96">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Add New User
          </h2>
          <input
            type="text"
            placeholder="Username"
            className="w-full p-2 border rounded mb-4 text-black bg-white"
            value={newUser.username}
            onChange={(e) =>
              setNewUser({ ...newUser, username: e.target.value })
            }
          />
          {errors.username && (
            <p className="text-red-500 text-sm mb-4">{errors.username}</p>
          )}
          <input
            type="text"
            placeholder="Full Name"
            className="w-full p-2 border rounded mb-4 text-black bg-white"
            value={newUser.fullName}
            onChange={(e) =>
              setNewUser({ ...newUser, fullName: e.target.value })
            }
          />
          {errors.fullName && (
            <p className="text-red-500 text-sm mb-4">{errors.fullName}</p>
          )}
          <input
            type="email"
            placeholder="Email"
            className="w-full p-2 border text-black rounded mb-4 bg-white"
            value={newUser.email}
            onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
          />
          {errors.email && (
            <p className="text-red-500 text-sm mb-4">{errors.email}</p>
          )}
          <input
            type="text"
            placeholder="Mobile No"
            className="w-full p-2 border text-black rounded mb-4 bg-white"
            value={newUser.mobileNo}
            onChange={(e) =>
              setNewUser({ ...newUser, mobileNo: e.target.value })
            }
          />
          {errors.mobileNo && (
            <p className="text-red-500 text-sm mb-4">{errors.mobileNo}</p>
          )}
          <input
            type="password"
            placeholder="Password"
            className="w-full p-2 border text-black rounded mb-4 bg-white"
            value={newUser.password}
            onChange={(e) =>
              setNewUser({ ...newUser, password: e.target.value })
            }
          />
          {errors.password && (
            <p className="text-red-500 text-sm mb-4">{errors.password}</p>
          )}
          <input
            type="password"
            placeholder="Confirm Password"
            className="w-full p-2 border text-black rounded mb-4 bg-white"
            value={newUser.confirmPassword}
            onChange={(e) =>
              setNewUser({ ...newUser, confirmPassword: e.target.value })
            }
          />
          {errors.confirmPassword && (
            <p className="text-red-500 text-sm mb-4">
              {errors.confirmPassword}
            </p>
          )}
          <select
            value={newUser.role}
            onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
            className="w-full p-2 border rounded mb-4 text-black bg-white"
          >
            <option value="Approver">Approver</option>
            <option value="Assistant">Assistant</option>
          </select>
          <div className="flex justify-end gap-4">
            <button
              className="text-gray-500 hover:text-gray-700"
              onClick={handleCancelAdd}
            >
              Cancel
            </button>
            <button
              className="bg-blue-600 text-white p-2 rounded"
              onClick={handleAddUser}
            >
              Add
            </button>
          </div>
        </div>
      </div>
    )
  );
};

export default AddUser;
