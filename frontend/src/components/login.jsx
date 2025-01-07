import React, { useState } from "react";
import { Link as RouterLink } from "react-router-dom"; // Import Router Link

import {
  Button,
  TextField,
  Typography,
  Box,
  Container,
  Checkbox,
  FormControlLabel,
  Link,
  ToggleButton,
  ToggleButtonGroup,
} from "@mui/material";
import EmailIcon from "@mui/icons-material/Email";
import LockIcon from "@mui/icons-material/Lock";
import VisibilityIcon from "@mui/icons-material/Visibility";

const Login = () => {
  const [authMode, setAuthMode] = useState("login");
  const [selectedToggle, setSelectedToggle] = useState("CM");

  const handleAuthToggle = (event, newAuthMode) => {
    if (newAuthMode) {
      setAuthMode(newAuthMode);
    }
  };

  const handleToggleChange = (event, newToggle) => {
    if (newToggle) {
      setSelectedToggle(newToggle);
    }
  };

  return (
    <Container
      maxWidth="sm" // Increased the width to make it broader
      style={{
        backgroundColor: "#f9f9f9", // Main background color (previously login background)
        borderRadius: "16px",
        padding: "24px",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "auto", // Reduced height to prevent excessive space
        position: "absolute",
        top: "0",
        left: "0",
        right: "0",
        bottom: "0",
        margin: "auto",
        backdropFilter: "blur(8px)", // Apply background blur effect
        maxHeight: "80vh", // Control the max height of the container
      }}
    >
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        width="100%"
        style={{
          backgroundColor: "#f9f9f9", // Set the background color to the main background
          borderRadius: "16px",
          padding: "24px", // Padding for the login form
        }}
      >
        {/* Adjusted position of CM/PA toggle buttons */}
        <ToggleButtonGroup
          value={selectedToggle}
          exclusive
          onChange={handleToggleChange}
          sx={{
            marginBottom: 3, // Increased gap
            marginTop: 2,    // Slightly moved it up
          }}
        >
          <ToggleButton value="CM">CM</ToggleButton>
          <ToggleButton value="PA">PA</ToggleButton>
        </ToggleButtonGroup>

        {/* Title */}
        <Typography variant="h4" gutterBottom sx={{ fontSize: "1.8rem" }}>
          {authMode === "login" ? "Login" : "Register"}
        </Typography>

        {/* Auth Mode Toggle */}
        <ToggleButtonGroup
          value={authMode}
          exclusive
          onChange={handleAuthToggle}
          sx={{ marginBottom: 3 }}
        >
          <ToggleButton value="login">Login</ToggleButton>
          <ToggleButton value="register">Register</ToggleButton>
        </ToggleButtonGroup>

        {/* Form */}
        <Box component="form" noValidate autoComplete="off" width="100%">
          <Box display="flex" alignItems="center" marginBottom={2}>
            <EmailIcon sx={{ marginRight: 1 }} />
            <TextField
              label="Email Address"
              variant="standard"
              fullWidth
              InputProps={{
                style: { fontSize: "1rem" }, // Increase font size in the input field
              }}
            />
          </Box>
          <Box display="flex" alignItems="center" marginBottom={2}>
            <LockIcon sx={{ marginRight: 1 }} />
            <TextField
              label="Password"
              variant="standard"
              type="password"
              fullWidth
              InputProps={{
                style: { fontSize: "1rem" }, // Increase font size in the input field
                endAdornment: <VisibilityIcon />,
              }}
            />
          </Box>
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            marginBottom={2}
          >
            <FormControlLabel
              control={<Checkbox defaultChecked />}
              label="Remember password"
            />
            <Link href="#" underline="hover">
              FORGET PASSWORD?
            </Link>
          </Box>
          <Button
            variant="contained"
            color="primary"
            fullWidth
            style={{
              borderRadius: "8px",
              fontSize: "1rem", // Increased font size of the button
            }}
          >
            {authMode === "login" ? "Login" : "Register"}
          </Button>

          {/* Link to the Register page */}
          {authMode === "login" && (
            <Box mt={2}>
              <Link component={RouterLink} to="/register" variant="body2">
                Don't have an account? Register
              </Link>
            </Box>
          )}
        </Box>
      </Box>
    </Container>
  );
};

export default Login;
