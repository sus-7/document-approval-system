import React, { useState, useContext, useEffect } from "react";
import { FaUserPlus, FaEdit, FaTrashAlt, FaKey, FaEye, FaEyeSlash } from "react-icons/fa";
import { Toaster, toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { UsersContext } from "../contexts/UsersContext";
import { AuthContext } from "../contexts/AuthContext";

// Reusable Password Input Component
const PasswordInput = ({ placeholder, value, onChange, error }) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="relative mb-4">
      <input
        type={showPassword ? "text" : "password"}
        placeholder={placeholder}
        className="w-full p-2 border rounded text-black bg-white"
        value={value}
        onChange={onChange}
      />
      <button
        type="button"
        onClick={() => setShowPassword(!showPassword)}
        className="absolute right-3 top-3 text-gray-500"
      >
        {showPassword ? <FaEyeSlash /> : <FaEye />}
      </button>
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  );
};

const ManageUsers = () => {
  const { approver, assistants, setUsers } = useContext(UsersContext);
  const { loggedInUser } = useContext(AuthContext);
  const [users, setLocalUsers] = useState({ Approver: [], Assistant: [] });
  const [showAddUser, setShowAddUser] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showChangePasswordModal, setShowChangePasswordModal] = useState(false);
  const [newUser, setNewUser] = useState({
    name: "",
    role: "Approver",
    email: "",
    mno: "",
    password: "",
    confirmPassword: "",
  });
  const [userToEdit, setUserToEdit] = useState(null);
  const [userToChangePassword, setUserToChangePassword] = useState(null);
  const [passwords, setPasswords] = useState({
    currentPassword: "",
    password: "",
    confirmPassword: "",
  });

  useEffect(() => {
    // Fetch users on component load
    const fetchUsers = async () => {
      try {
        const response = await axios.get("http://localhost:3000/user");
        setLocalUsers(response.data);
        setUsers(response.data);
      } catch (error) {
        toast.error("Failed to load users", { position: "top-right", duration: 3000 });
      }
    };

    fetchUsers();
  }, [setUsers]);

  const handleAddUser = async () => {
    const { name, email, mno, password, confirmPassword, role } = newUser;

    // Validate inputs
    if (!name || !email || !mno || !password || !confirmPassword) {
      toast.error("All fields are required", { position: "top-right", duration: 3000 });
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error("Invalid email format", { position: "top-right", duration: 3000 });
      return;
    }

    if (password.length < 6) {
      toast.error("Password must be at least 6 characters", { position: "top-right", duration: 3000 });
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match", { position: "top-right", duration: 3000 });
      return;
    }

    try {
      const response = await axios.post("http://localhost:3000/api/user/signup", newUser);
      setLocalUsers((prevUsers) => ({
        ...prevUsers,
        [role]: [...prevUsers[role], response.data],
      }));
      toast.success("User added successfully", { position: "top-right", duration: 3000 });
      setShowAddUser(false);
    } catch (error) {
      console.error("Failed to add user:", error.response || error.message);
      toast.error("Failed to add user", { position: "top-right", duration: 3000 });
    }
  };

  const handleEditUser = async () => {
    try {
      await axios.put(`http://localhost:3000/user/${userToEdit.id}`, userToEdit);
      setLocalUsers((prevUsers) => {
        const updatedUsers = prevUsers[userToEdit.role].map((user) =>
          user.id === userToEdit.id ? userToEdit : user
        );
        return { ...prevUsers, [userToEdit.role]: updatedUsers };
      });
      toast.success("User updated successfully", { position: "top-right", duration: 3000 });
      setShowEditModal(false);
    } catch (error) {
      toast.error("Failed to update user", { position: "top-right", duration: 3000 });
    }
  };

  const handleDeleteUser = async (id, role) => {
    try {
      await axios.delete(`http://localhost:3000/user/${id}`);
      setLocalUsers((prevUsers) => ({
        ...prevUsers,
        [role]: prevUsers[role].filter((user) => user.id !== id),
      }));
      toast.success("User deleted successfully", { position: "top-right", duration: 3000 });
    } catch (error) {
      toast.error("Failed to delete user", { position: "top-right", duration: 3000 });
    }
  };

  const handleSavePassword = async () => {
    const { currentPassword, password, confirmPassword } = passwords;

    if (!currentPassword || !password || !confirmPassword) {
      toast.error("All fields are required", { position: "top-right", duration: 3000 });
      return;
    }

    if (password.length < 6) {
      toast.error("Password must be at least 6 characters", { position: "top-right", duration: 3000 });
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match", { position: "top-right", duration: 3000 });
      return;
    }

    try {
      await axios.patch(`http://localhost:3000/user/${userToChangePassword.id}/password`, {
        currentPassword,
        newPassword: password,
      });
      toast.success("Password changed successfully", { position: "top-right", duration: 3000 });
      setShowChangePasswordModal(false);
    } catch (error) {
      toast.error("Failed to change password", { position: "top-right", duration: 3000 });
    }
  };

  const handleCancelAdd = () => {
    setShowAddUser(false);
    setNewUser({ name: "", role: "Approver", email: "", mno: "", password: "", confirmPassword: "" });
  };

  const handleCancelEdit = () => {
    setShowEditModal(false);
  };

  const handleCancelChangePassword = () => {
    setShowChangePasswordModal(false);
    setPasswords({ currentPassword: "", password: "", confirmPassword: "" });
  };

  const handleChangePassword = (user) => {
    setUserToChangePassword(user);
    setShowChangePasswordModal(true);
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-r from-white to-blue-100">
      <Toaster />
      <div className="flex justify-between items-center bg-white shadow-md px-6 py-4 border-b border-gray-200">
        <h1 className="text-2xl font-bold text-gray-800">Manage Users</h1>
      </div>

      <div className="flex items-center justify-center flex-grow p-4">
        <div className="w-full max-w-3xl bg-white shadow-lg border border-gray-200 rounded-lg p-8">
          <div className="flex gap-4 mb-6 justify-end">
            <button
              onClick={() => setShowAddUser(true)}
              className="text-white bg-blue-600 hover:bg-blue-700 p-2 rounded-lg flex items-center gap-2"
            >
              <FaUserPlus />
              Add New
            </button>
          </div>

          {/* Approvers */}
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Manage Approvers
          </h3>
          {!approver ? (
            <p className="text-gray-600">No Approvers available</p>
          ) : (
            <div className="space-y-4">
              <div
                key={approver.id}
                className="flex justify-between items-center p-4 bg-gray-50 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-all"
              >
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">
                    {approver.fullName}
                  </h3>
                  <p className="text-sm text-gray-600">{approver.email}</p>
                  <span className="text-xs text-gray-400">{approver.role}</span>
                </div>
                <div className="flex gap-3">
                  <button
                    title="Edit User"
                    onClick={() => {
                      setUserToEdit(approver);
                      setShowEditModal(true);
                    }}
                    className="text-yellow-600 hover:text-yellow-800"
                  >
                    <FaEdit />
                  </button>
                  <button
                    title="Delete User"
                    onClick={() => handleDeleteUser(approver.id, "Approver")}
                    className="text-red-600 hover:text-red-800"
                  >
                    <FaTrashAlt />
                  </button>
                  <button
                    title="Change Password"
                    onClick={() => handleChangePassword(approver)}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    <FaKey />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Assistants */}
          <h3 className="text-lg font-semibold text-gray-800 mb-4 mt-8">
            Manage Assistants
          </h3>
          {assistants.length === 0 ? (
            <p className="text-gray-600">No Assistants available</p>
          ) : (
            <div className="space-y-4">
              {assistants.map((user) => (
                <div
                  key={user.username}
                  className="flex justify-between items-center p-4 bg-gray-50 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-all"
                >
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800">
                      {user.fullName}
                    </h3>
                    <p className="text-sm text-gray-600">{user.email}</p>
                    <span className="text-xs text-gray-400">{user.role}</span>
                  </div>
                  <div className="flex gap-3">
                    <button
                      title="Edit User"
                      onClick={() => {
                        setUserToEdit(user);
                        setShowEditModal(true);
                      }}
                      className="text-yellow-600 hover:text-yellow-800"
                    >
                      <FaEdit />
                    </button>
                    <button
                      title="Delete User"
                      onClick={() => handleDeleteUser(user.id, "Assistant")}
                      className="text-red-600 hover:text-red-800"
                    >
                      <FaTrashAlt />
                    </button>
                    <button
                      title="Change Password"
                      onClick={() => handleChangePassword(user)}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      <FaKey />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Add Modal */}
      {showAddUser && (
        <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50">
          <div className="bg-white p-8 rounded-lg w-96">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Add New User</h2>
            <input
              type="text"
              placeholder="Name"
              className="w-full p-2 border rounded mb-4 text-black bg-white"
              value={newUser.name}
              onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
            />
            <input
              type="email"
              placeholder="Email"
              className="w-full p-2 border text-black rounded mb-4 bg-white"
              value={newUser.email}
              onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
            />
            <input
              type="text"
              placeholder="Mobile No"
              className="w-full p-2 border text-black rounded mb-4 bg-white"
              value={newUser.mno}
              onChange={(e) => setNewUser({ ...newUser, mno: e.target.value })}
            />
            <PasswordInput
              placeholder="Password"
              value={newUser.password}
              onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
            />
            <PasswordInput
              placeholder="Confirm Password"
              value={newUser.confirmPassword}
              onChange={(e) => setNewUser({ ...newUser, confirmPassword: e.target.value })}
            />
            <select
              value={newUser.role}
              onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
              className="w-full p-2 border rounded mb-4 text-black bg-white"
            >
              <option value="Approver">Approver</option>
              <option value="Assistant">Assistant</option>
            </select>
            <div className="flex justify-end gap-4">
              <button className="text-gray-500 hover:text-gray-700" onClick={handleCancelAdd}>
                Cancel
              </button>
              <button className="bg-blue-600 text-white p-2 rounded" onClick={handleAddUser}>
                Add
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {showEditModal && userToEdit && (
        <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50">
          <div className="bg-white p-8 rounded-lg w-96">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Edit User
            </h2>
            <input
              type="text"
              placeholder="Name"
              className="w-full p-2 border rounded mb-4 text-black bg-white"
              value={userToEdit.fullName}
              onChange={(e) =>
                setUserToEdit({ ...userToEdit, fullName: e.target.value })
              }
            />
            <input
              type="email"
              placeholder="Email"
              className="w-full p-2 border text-black rounded mb-4 bg-white"
              value={userToEdit.email}
              onChange={(e) =>
                setUserToEdit({ ...userToEdit, email: e.target.value })
              }
            />

            <input
              type="text"
              placeholder="Mobile No"
              className="w-full p-2 border text-black rounded mb-4 bg-white"
              value={userToEdit.mno}
              onChange={(e) =>
                setUserToEdit({ ...userToEdit, mno: e.target.value })
              }
            />

            <select
              value={userToEdit.role}
              onChange={(e) =>
                setUserToEdit({ ...userToEdit, role: e.target.value })
              }
              className="w-full p-2 border rounded mb-4 text-black bg-white"
            >
              <option value="Approver">Approver</option>
              <option value="Assistant">Assistant</option>
            </select>
            <div className="flex justify-end gap-4">
              <button
                className="text-gray-500 hover:text-gray-700"
                onClick={handleCancelEdit}
              >
                Cancel
              </button>
              <button
                className="bg-blue-600 text-white p-2 rounded"
                onClick={handleEditUser}
              >
                Update
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Change Password Modal */}
      {showChangePasswordModal && userToChangePassword && (
        <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50">
          <div className="bg-white p-8 rounded-lg w-96">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Change Password</h2>
            <PasswordInput
              placeholder="Current Password"
              value={passwords.currentPassword}
              onChange={(e) => setPasswords({ ...passwords, currentPassword: e.target.value })}
            />
            <PasswordInput
              placeholder="New Password"
              value={passwords.password}
              onChange={(e) => setPasswords({ ...passwords, password: e.target.value })}
            />
            <PasswordInput
              placeholder="Confirm New Password"
              value={passwords.confirmPassword}
              onChange={(e) => setPasswords({ ...passwords, confirmPassword: e.target.value })}
            />
            <div className="flex justify-end gap-4">
              <button className="text-gray-500 hover:text-gray-700" onClick={handleCancelChangePassword}>
                Cancel
              </button>
              <button className="bg-blue-600 text-white p-2 rounded" onClick={handleSavePassword}>
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageUsers;