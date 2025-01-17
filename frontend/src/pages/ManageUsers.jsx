import React, { useState, useContext, useEffect } from "react";
import { FaUserPlus, FaEdit, FaTrashAlt } from "react-icons/fa";
import { Toaster, toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import AddUser from "../components/AddUser";
import { UsersContext } from "../contexts/UsersContext";
import { AuthContext } from "../contexts/AuthContext";
const ManageUsers = () => {
  const { approver, assistants, refreshUsers } = useContext(UsersContext);
  const navigate = useNavigate();
  const { loggedInUser } = useContext(AuthContext);
  const [users, setUsers] = useState({ Approver: [], Assistant: [] });
  const [showAddUser, setShowAddUser] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [userToEdit, setUserToEdit] = useState(null);

  const handleEditUser = () => {
    if (!validateInputs(userToEdit)) return;
    setShowEditModal(false);
  };

  useEffect(() => {
    if (!loggedInUser) {
      navigate("/");
    } else {
      refreshUsers();
    }
  }, [loggedInUser]);
  const handleDeleteUser = (id, role) => {};

  const handleCancelEdit = () => {
    setShowEditModal(false);
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
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Add Modal */}
      <AddUser showAddUser={showAddUser} setShowAddUser={setShowAddUser} />

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
              value={userToEdit.name}
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
    </div>
  );
};

export default ManageUsers;
