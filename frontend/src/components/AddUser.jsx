import React, { useState, useContext, useEffect } from "react";
import { FaUserPlus, FaEdit, FaTrashAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { Toaster, toast } from "react-hot-toast";
import { UsersContext } from "../contexts/UsersContext";
import { AuthContext } from "../contexts/AuthContext";
import { Role } from "../../utils/enums";
import axios from "axios";
const AddUser = ({ showAddUser, setShowAddUser }) => {
  const navigate = useNavigate();
  const { refreshUsers } = useContext(UsersContext);
  const { loggedInUser } = useContext(AuthContext);
  const [newUser, setNewUser] = useState({
    fullName: "",
    role: Role.APPROVER,
    email: "",
    mobileNo: "",
    password: "",
    confirmPassword: "",
  });
  const [username, setUsername] = useState("");
  const [fullName, setFullName] = useState("");
  const [role, setRole] = useState(Role.ASSISTANT);
  const [email, setEmail] = useState("");
  const [mobileNo, setMobileNo] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // useEffect(() => {
  //   if (!loggedInUser) {
  //     navigate("/");
  //   }
  // }, [loggedInUser]);
  const validateInputs = (user) => {
    let valid = true;
    if (!username.trim()) {
      toast.error("username is required.", {
        position: "top-right",
        duration: 3000,
      });
      valid = false;
    }
    if (!fullName.trim()) {
      toast.error("Full Name is required.", {
        position: "top-right",
        duration: 3000,
      });
      valid = false;
    }
    if (!email.trim()) {
      toast.error("Email is required.", {
        position: "top-right",
        duration: 3000,
      });
      valid = false;
    }
    if (!mobileNo.trim() || !/^\d{10}$/.test(mobileNo)) {
      toast.error("A valid 10-digit Mobile Number is required.", {
        position: "top-right",
        duration: 3000,
      });
      valid = false;
    }
    if (!password.trim() || password.length < 6) {
      toast.error("Password must be at least 6 characters long.", {
        position: "top-right",
        duration: 3000,
      });
      valid = false;
    }
    if (password !== confirmPassword) {
      toast.error("Passwords do not match.", {
        position: "top-right",
        duration: 3000,
      });
      valid = false;
    }

    return valid;
  };

  const handleAddUser = async () => {
    const newUser = {
      username,
      fullName,
      role,
      email,
      mobileNo,
      password,
      confirmPassword,
    };
    if (!validateInputs(newUser)) return;
    try {
      delete newUser.confirmPassword;
      const createUserUrl =
        import.meta.env.VITE_API_URL + "/assistant/create-user";
      const response = await axios.post(createUserUrl, newUser, {
        withCredentials: true,
      });

      if (response.status === 200) {
        refreshUsers();
        toast.success("User added successfully", {
          position: "top-right",
          duration: 3000,
        });
        setShowAddUser(false);
        setNewUser({
          fullName: "",
          role: "Assistant",
          email: "",
          mobileNo: "",
          password: "",
          confirmPassword: "",
        });
      } else {
        toast.error("Error adding user", {
          position: "top-right",
          duration: 3000,
        });
      }
    } catch (error) {
      console.log("AddUser service :: handleAddUser :: error : ", error);
      toast.error(error.response.data.message, {
        position: "top-right",
        duration: 3000,
      });
      return;
    }
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
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />

          <input
            type="text"
            placeholder="Full Name"
            className="w-full p-2 border rounded mb-4 text-black bg-white"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
          />

          <input
            type="email"
            placeholder="Email"
            className="w-full p-2 border text-black rounded mb-4 bg-white"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="text"
            placeholder="Mobile No"
            className="w-full p-2 border text-black rounded mb-4 bg-white"
            value={mobileNo}
            onChange={(e) => setMobileNo(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full p-2 border text-black rounded mb-4 bg-white"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <input
            type="password"
            placeholder="Confirm Password"
            className="w-full p-2 border text-black rounded mb-4 bg-white"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="w-full p-2 border rounded mb-4 text-black bg-white"
          >
            <option value={Role.APPROVER}>Approver</option>
            <option value={Role.ASSISTANT}>Assistant</option>
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
