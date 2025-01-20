import React, { useState, useContext } from "react";
import Cookies from "js-cookie";
import { toast, Toaster } from "react-hot-toast";
import { FaBell, FaUserAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { IconButton, Menu, MenuItem } from "@mui/material";
import DashboardIcon from "@mui/icons-material/Dashboard";
import { Tooltip } from "@mui/material";
import { useAuth } from "../contexts/AuthContext";
const Navbar = () => {
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null); // State to control the dropdown
  const { loggedInUser, setLoggedInUser, loading, logout } = useAuth();
  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget); // Open the dropdown
  };

  const handleMenuClose = () => {
    setAnchorEl(null); // Close the dropdown
  };

  const navigateNoti = () => {
    navigate("/notifications");
    handleMenuClose();
  };

  const navigateHistory = () => {
    navigate("/history");
    handleMenuClose();
  };

  const navigateProfile = () => {
    navigate("/profile");
    handleMenuClose();
  };

  const navigateManageUsers = () => {
    navigate("/users/manage");
    handleMenuClose();
  };
  const navigateHome = () => {
    if (loggedInUser.role == "Admin") {
      navigate("/admin/dashboard");
    }
    else
      navigate("/assistant/dashboard");

    handleMenuClose();
  };
  const handleLogout = async (e) => {
    e.preventDefault();
    toast.loading("Logging out...", {
      position: "top-center",
      duration: 1000,
    });
    try {
      const logoutUrl = import.meta.env.VITE_API_URL + "/user/signout";
      const response = await fetch(logoutUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });
      if (!response.ok) {
        throw new Error("Failed to logout");
      }
      toast.success("Logged out successfully!", {
        position: "top-center",
        duration: 2000,
      });
      logout();
    } catch (error) {
      console.error("Error during logout:", error);
      toast.error(error.message, {
        position: "top-center",
        duration: 2000,
      });
    }
  };
  return (
    <div>
      <div className="navbar w-full h-[8vh] flex items-center justify-between bg-white text-gray-700 px-8 shadow-md">
        {/* Title based on Role */}
        {!loggedInUser ? (
          <h1 className="text-center text-lg font-semibold tracking-wider">
            Loading...
          </h1>
        ) : (
          <h1 className="text-center text-lg font-semibold tracking-wider">
            {`${loggedInUser.role}'s Dashboard`}
          </h1>
        )}

        <div className="flex space-x-6">
          {/* Notifications Button */}
          <Tooltip title="Notifications" arrow>
            <button
              onClick={navigateNoti}
              className="text-gray-600 text-xl hover:text-blue-500"
              aria-label="Notifications"
            >
              <FaBell />
            </button>
          </Tooltip>

          {/* Profile Dropdown Icon */}

          <Tooltip title="Profile" arrow>
            <IconButton
              className="text-gray-600 hover:text-blue-500"
              onClick={handleMenuOpen}
              aria-label="Profile"
            >
              <FaUserAlt />
            </IconButton>
          </Tooltip>

          {/* Dropdown Menu */}
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
            PaperProps={{
              style: {
                maxHeight: 200,
                width: "20ch",
              },
            }}
          >
            <MenuItem onClick={navigateProfile}>View Profile</MenuItem>
            <MenuItem onClick={navigateHistory}>History</MenuItem>
            {loggedInUser.role == "Senior Assistant" || "Admin" ? (
              <MenuItem onClick={navigateManageUsers}>Manage Users</MenuItem>
            ) : null}
            <MenuItem onClick={handleLogout}>Logout</MenuItem>
          </Menu>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
