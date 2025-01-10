import React, { useState } from "react";
import { FaBell, FaUserAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { IconButton, Menu, MenuItem } from "@mui/material";
import DashboardIcon from "@mui/icons-material/Dashboard";
import { Tooltip } from "@mui/material";

const Navbar = ({ role }) => {
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null); // State to control the dropdown

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

  const navigateHome = () => {
    navigate("/dashboard");
    handleMenuClose();
  };

  return (
    <div>
      <div className="navbar w-full h-[8vh] flex items-center justify-between bg-white text-gray-700 px-8 shadow-md">
        
        {/* Title based on Role */}
        <h1 className="text-center text-lg font-semibold tracking-wider">
          {role === "approver"
            ? "Approver Dashboard"
            : role === "assistant"
            ? "Assistant Dashboard"
            : ""}
        </h1>

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
          {role === "approver" || role === "assistant" ? (
            <Tooltip title="Profile" arrow>
              <IconButton
                className="text-gray-600 hover:text-blue-500"
                onClick={handleMenuOpen}
                aria-label="Profile"
              >
                <FaUserAlt />
              </IconButton>
            </Tooltip>
          ) : (
            <Tooltip title="Assistant Dashboard" arrow>
              <button
                onClick={navigateHome}
                className="text-gray-600 text-xl hover:text-blue-500"
                aria-label="Dashboard"
              >
                <DashboardIcon />
              </button>
            </Tooltip>
          )}

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
            {role === "approver" || role === "assistant" ? (
              <>
                <MenuItem onClick={navigateProfile}>View Profile</MenuItem>
                <MenuItem onClick={navigateHistory}>History</MenuItem>
              </>
            ) : null}
            <MenuItem onClick={() => navigate("/")}>Logout</MenuItem>
          </Menu>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
