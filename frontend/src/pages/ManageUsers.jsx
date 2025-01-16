import React, { useState } from "react";
import { FaUserPlus, FaEdit, FaTrashAlt, FaKey, FaEye, FaEyeSlash } from "react-icons/fa"; // Import FaKey, FaEye, and FaEyeSlash icons
import { Toaster, toast } from "react-hot-toast";

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
  const [users, setUsers] = useState({ Approver: [], Assistant: [] });
  const [showModal, setShowModal] = useState(false);
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
  const [errors, setErrors] = useState({
    name: "",
    email: "",
    mno: "",
    password: "",
    confirmPassword: "",
  });

  const validateInputs = (user) => {
    let valid = true;
    const newErrors = { name: "", email: "", mno: "", password: "", confirmPassword: "" };

    if (!user.name.trim()) {
      newErrors.name = "Name is required.";
      valid = false;
    }
    if (!user.email.trim()) {
      newErrors.email = "Email is required.";
      valid = false;
    }
    if (!user.mno.trim() || !/^\d{10}$/.test(user.mno)) {
      newErrors.mno = "A valid 10-digit Mobile Number is required.";
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

  const handleAddUser = () => {
    if (!validateInputs(newUser)) return;

    const newUserData = { id: Date.now(), ...newUser };

    setUsers((prevUsers) => {
      const updatedUsers = { ...prevUsers };
      updatedUsers[newUser.role].push(newUserData);
      return updatedUsers;
    });

    toast.success("User added successfully", { position: "top-right", duration: 3000 });

    setShowModal(false);
    setNewUser({ name: "", role: "Approver", email: "", mno: "", password: "", confirmPassword: "" });
    setErrors({});
  };

  const handleEditUser = () => {
    if (!validateInputs(userToEdit)) return;

    const updatedUsers = users[userToEdit.role].map((user) =>
      user.id === userToEdit.id ? userToEdit : user
    );

    setUsers((prevUsers) => ({ ...prevUsers, [userToEdit.role]: updatedUsers }));

    toast.success("User details updated successfully", { position: "top-right", duration: 3000 });

    setShowEditModal(false);
    setErrors({});
  };

  const handleDeleteUser = (id, role) => {
    const updatedUsers = users[role].filter((user) => user.id !== id);
    setUsers((prevUsers) => ({ ...prevUsers, [role]: updatedUsers }));

    toast.error("User deleted successfully", { position: "top-right", duration: 3000 });
  };

  const handleCancelAdd = () => {
    setShowModal(false);
    setNewUser({ name: "", role: "Approver", email: "", mno: "", password: "", confirmPassword: "" });
    setErrors({});
  };

  const handleCancelEdit = () => {
    setShowEditModal(false);
    setErrors({});
  };

  const handleChangePassword = (user) => {
    setUserToChangePassword(user);
    setShowChangePasswordModal(true);
  };

  const validatePasswordChange = () => {
    const newErrors = {};
    
    if (!passwords.currentPassword) {
      newErrors.currentPassword = "Current password is required";
    }
    
    if (!passwords.password || passwords.password.length < 6) {
      newErrors.password = "New password must be at least 6 characters";
    }
    
    if (passwords.password !== passwords.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSavePassword = () => {
    if (!validatePasswordChange()) return;

    // Verify current password matches (in real app, this would be an API call)
    if (passwords.currentPassword !== userToChangePassword.password) {
      setErrors({ currentPassword: "Current password is incorrect" });
      return;
    }

    const updatedUsers = users[userToChangePassword.role].map((user) =>
      user.id === userToChangePassword.id 
        ? { ...user, password: passwords.password }
        : user
    );

    setUsers((prevUsers) => ({
      ...prevUsers,
      [userToChangePassword.role]: updatedUsers
    }));

    toast.success("Password changed successfully", { position: "top-right", duration: 3000 });

    setShowChangePasswordModal(false);
    setPasswords({ currentPassword: "", password: "", confirmPassword: "" });
    setErrors({});
  };

  const handleCancelChangePassword = () => {
    setShowChangePasswordModal(false);
    setPasswords({ currentPassword: "", password: "", confirmPassword: "" });
    setErrors({});
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
              onClick={() => setShowModal(true)}
              className="text-white bg-blue-600 hover:bg-blue-700 p-2 rounded-lg flex items-center gap-2"
            >
              <FaUserPlus />
              Add New
            </button>
          </div>

          {/* Approvers */}
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Manage Approvers</h3>
          {users.Approver.length === 0 ? (
            <p className="text-gray-600">No Approvers available</p>
          ) : (
            <div className="space-y-4">
              {users.Approver.map((user) => (
                <div
                  key={user.id}
                  className="flex justify-between items-center p-4 bg-gray-50 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-all"
                >
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800">{user.name}</h3>
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
                      onClick={() => handleDeleteUser(user.id, "Approver")}
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

          {/* Assistants */}
          <h3 className="text-lg font-semibold text-gray-800 mb-4 mt-8">Manage Assistants</h3>
          {users.Assistant.length === 0 ? (
            <p className="text-gray-600">No Assistants available</p>
          ) : (
            <div className="space-y-4">
              {users.Assistant.map((user) => (
                <div
                  key={user.id}
                  className="flex justify-between items-center p-4 bg-gray-50 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-all"
                >
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800">{user.name}</h3>
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
      {showModal && (
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
            {errors.name && <p className="text-red-500 text-sm mb-4">{errors.name}</p>}
            <input
              type="email"
              placeholder="Email"
              className="w-full p-2 border text-black rounded mb-4 bg-white"
              value={newUser.email}
              onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
            />
            {errors.email && <p className="text-red-500 text-sm mb-4">{errors.email}</p>}
            <input
              type="text"
              placeholder="Mobile No"
              className="w-full p-2 border text-black rounded mb-4 bg-white"
              value={newUser.mno}
              onChange={(e) => setNewUser({ ...newUser, mno: e.target.value })}
            />
            {errors.mno && <p className="text-red-500 text-sm mb-4">{errors.mno}</p>}
            <PasswordInput
              placeholder="Password"
              value={newUser.password}
              onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
              error={errors.password}
            />
            <PasswordInput
              placeholder="Confirm Password"
              value={newUser.confirmPassword}
              onChange={(e) => setNewUser({ ...newUser, confirmPassword: e.target.value })}
              error={errors.confirmPassword}
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
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Edit User</h2>
            <input
              type="text"
              placeholder="Name"
              className="w-full p-2 border rounded mb-4 text-black bg-white"
              value={userToEdit.name}
              onChange={(e) => setUserToEdit({ ...userToEdit, name: e.target.value })}
            />
            {errors.name && <p className="text-red-500 text-sm mb-4">{errors.name}</p>}
            <input
              type="email"
              placeholder="Email"
              className="w-full p-2 border text-black rounded mb-4 bg-white"
              value={userToEdit.email}
              onChange={(e) => setUserToEdit({ ...userToEdit, email: e.target.value })}
            />
            {errors.email && <p className="text-red-500 text-sm mb-4">{errors.email}</p>}
            <input
              type="text"
              placeholder="Mobile No"
              className="w-full p-2 border text-black rounded mb-4 bg-white"
              value={userToEdit.mno}
              onChange={(e) => setUserToEdit({ ...userToEdit, mno: e.target.value })}
            />
            {errors.mno && <p className="text-red-500 text-sm mb-4">{errors.mno}</p>}
            <select
              value={userToEdit.role}
              onChange={(e) => setUserToEdit({ ...userToEdit, role: e.target.value })}
              className="w-full p-2 border rounded mb-4 text-black bg-white"
            >
              <option value="Approver">Approver</option>
              <option value="Assistant">Assistant</option>
            </select>
            <div className="flex justify-end gap-4">
              <button className="text-gray-500 hover:text-gray-700" onClick={handleCancelEdit}>
                Cancel
              </button>
              <button className="bg-blue-600 text-white p-2 rounded" onClick={handleEditUser}>
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
              error={errors.currentPassword}
            />
            <PasswordInput
              placeholder="New Password"
              value={passwords.password}
              onChange={(e) => setPasswords({ ...passwords, password: e.target.value })}
              error={errors.password}
            />
            <PasswordInput
              placeholder="Confirm New Password"
              value={passwords.confirmPassword}
              onChange={(e) => setPasswords({ ...passwords, confirmPassword: e.target.value })}
              error={errors.confirmPassword}
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