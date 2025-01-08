import React, { useState } from "react";
import { FaUserPlus, FaEdit, FaTrashAlt, FaPlusCircle } from "react-icons/fa";
import { toast } from "react-hot-toast";

const ManageUsers = () => {
  const [users, setUsers] = useState({
    CM: [
      { id: 1, name: "John Doe", role: "CM", email: "john@example.com" },
    ],
    PA: [
      { id: 2, name: "Jane Smith", role: "PA", email: "jane@example.com" },
    ],
  });

  const [showModal, setShowModal] = useState(false); // Modal for adding a user
  const [showEditModal, setShowEditModal] = useState(false); // Modal for editing a user
  const [newUser, setNewUser] = useState({ name: "", role: "CM", email: "" });
  const [userToEdit, setUserToEdit] = useState(null); // User being edited

  const handleAddUser = () => {
    const newUserData = {
      id: Date.now(),
      ...newUser,
    };

    setUsers((prevUsers) => {
      const updatedUsers = { ...prevUsers };
      updatedUsers[newUser.role].push(newUserData);
      return updatedUsers;
    });

    toast.success(`${newUser.role} added successfully!`);
    setShowModal(false);
    setNewUser({ name: "", role: "CM", email: "" });
  };

  const handleEditUser = () => {
    const updatedUsers = users[userToEdit.role].map((user) =>
      user.id === userToEdit.id ? userToEdit : user
    );
    setUsers((prevUsers) => ({ ...prevUsers, [userToEdit.role]: updatedUsers }));
    toast.success("User updated successfully!");
    setShowEditModal(false);
  };

  const handleDeleteUser = (id, role) => {
    const updatedUsers = users[role].filter((user) => user.id !== id);
    setUsers((prevUsers) => ({ ...prevUsers, [role]: updatedUsers }));
    toast.success("User deleted successfully!");
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-r from-white to-blue-100">
      {/* Navbar */}
      <div className="flex justify-between items-center bg-white shadow-md px-6 py-4 border-b border-gray-200">
        <h1 className="text-2xl font-bold text-gray-800">Manage Users</h1>
      </div>

      {/* Main Content */}
      <div className="flex items-center justify-center flex-grow p-4">
        <div className="w-full max-w-3xl bg-white shadow-lg border border-gray-200 rounded-lg p-8">
          {/* Manage PAs & CMs */}
          <div className="flex gap-4 mb-6 justify-between">
            <h2 className="text-xl font-semibold text-gray-800">Manage Users</h2>
            <button
              onClick={() => setShowModal(true)}
              className="text-white bg-blue-600 hover:bg-blue-700 p-2 rounded-lg flex items-center gap-2"
            >
              <FaUserPlus />
              Add New
            </button>
          </div>

          {/* Manage CMs Section */}
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Manage CMs</h3>
          {users.CM.length === 0 ? (
            <p className="text-gray-600">No CMs available</p>
          ) : (
            <div className="space-y-4">
              {users.CM.map((user) => (
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
                      onClick={() => {
                        setUserToEdit(user);
                        setShowEditModal(true);
                      }}
                      className="text-yellow-600 hover:text-yellow-800"
                    >
                      <FaEdit />
                    </button>
                    <button
                      onClick={() => handleDeleteUser(user.id, "CM")}
                      className="text-red-600 hover:text-red-800"
                    >
                      <FaTrashAlt />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Manage PAs Section */}
          <h3 className="text-lg font-semibold text-gray-800 mb-4 mt-8">Manage PAs</h3>
          {users.PA.length === 0 ? (
            <p className="text-gray-600">No PAs available</p>
          ) : (
            <div className="space-y-4">
              {users.PA.map((user) => (
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
                      onClick={() => {
                        setUserToEdit(user);
                        setShowEditModal(true);
                      }}
                      className="text-yellow-600 hover:text-yellow-800"
                    >
                      <FaEdit />
                    </button>
                    <button
                      onClick={() => handleDeleteUser(user.id, "PA")}
                      className="text-red-600 hover:text-red-800"
                    >
                      <FaTrashAlt />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Add User Modal */}
      {showModal && (
        <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50">
          <div className="bg-white p-8 rounded-lg w-96">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Add New User</h2>
            <div>
              <label className="block text-gray-700 mb-2">Name</label>
              <input
                type="text"
                className="w-full p-2 border border-gray-300 rounded-lg mb-4 bg-white text-black"
                value={newUser.name}
                onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-gray-700 mb-2">Email</label>
              <input
                type="email"
                className="w-full p-2 border border-gray-300 rounded-lg mb-4 bg-white text-black"
                value={newUser.email}
                onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Role</label>
              <select
                className="w-full p-2 border border-gray-300 rounded-lg bg-white text-black"
                value={newUser.role}
                onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
              >
                <option value="CM">CM</option>
                <option value="PA">PA</option>
              </select>
            </div>
            <div className="flex justify-end gap-4">
              <button
                className="text-gray-500 hover:text-gray-700"
                onClick={() => setShowModal(false)}
              >
                Cancel
              </button>
              <button
                className="bg-blue-600 flex items-center gap-3 text-white p-2 rounded"
                onClick={handleAddUser}
              >
                <FaPlusCircle /> Add
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit User Modal */}
      {showEditModal && userToEdit && (
        <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50">
          <div className="bg-white p-8 rounded-lg w-96">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Edit User</h2>
            <div>
              <label className="block text-gray-700 mb-2">Name</label>
              <input
                type="text"
                className="w-full p-2 border border-gray-300 rounded-lg mb-4 bg-white text-black"
                value={userToEdit.name}
                onChange={(e) =>
                  setUserToEdit({ ...userToEdit, name: e.target.value })
                }
              />
            </div>
            <div>
              <label className="block text-gray-700 mb-2">Email</label>
              <input
                type="email"
                className="w-full p-2 border border-gray-300 rounded-lg mb-4 bg-white text-black"
                value={userToEdit.email}
                onChange={(e) =>
                  setUserToEdit({ ...userToEdit, email: e.target.value })
                }
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Role</label>
              <select
                className="w-full p-2 border border-gray-300 rounded-lg bg-white text-black"
                value={userToEdit.role}
                onChange={(e) =>
                  setUserToEdit({ ...userToEdit, role: e.target.value })
                }
              >
                <option value="CM">CM</option>
                <option value="PA">PA</option>
              </select>
            </div>
            <div className="flex justify-end gap-4">
              <button
                className="text-gray-500 hover:text-gray-700"
                onClick={() => setShowEditModal(false)}
              >
                Cancel
              </button>
              <button
                className="bg-blue-600 text-white p-2 rounded"
                onClick={handleEditUser}
              >
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
