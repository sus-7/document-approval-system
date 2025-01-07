import React, { useState } from "react";
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
import PersonIcon from '@mui/icons-material/Person';

const Register = () => {
  const [authMode, setAuthMode] = useState("register");
  const [showPassword, setShowPassword] = useState(false);

  const handleAuthToggle = (event, newAuthMode) => {
    if (newAuthMode) {
      setAuthMode(newAuthMode);
    }
  };

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <Container
      maxWidth="sm" 
      style={{
        backgroundColor: "#f9f9f9",
        borderRadius: "16px",
        padding: "24px",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "auto",
        position: "absolute",
        top: "0",
        left: "0",
        right: "0",
        bottom: "0",
        margin: "auto",
        backdropFilter: "blur(8px)", 
        maxHeight: "95vh",
        boxShadow: "0 0 10px 0 rgba(0,0,0,0.1)",
      }}
    >
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        width="90%"
      >
        <Typography variant="h4" color="black" gutterBottom sx={{ fontSize: "1.8rem", fontFamily: "Playfair Display, serif" }}>
          REGISTER
        </Typography>

        <ToggleButtonGroup
          value={authMode}
          exclusive
          onChange={handleAuthToggle}
          sx={{ marginBottom: 3} }
        >
          <ToggleButton value="login" sx={{ 
            '&.Mui-selected': {
              backgroundColor: '#2570b1',
              color: 'white',
            }
          }}>Login</ToggleButton>
          <ToggleButton value="register"  sx={{ 
            '&.Mui-selected': {
              backgroundColor: '#2570b1',
              color: 'white',
            }
          }}>Register</ToggleButton>
        </ToggleButtonGroup>

        <Box component="form" noValidate autoComplete="off" width="95%">
        
          <Box display="flex" alignItems="center" marginBottom={2}>
          <PersonIcon style={{color: 'black'}} sx={{ marginRight: 1 }} />
            <TextField
              label="Username"
              variant="standard"
              fullWidth
              InputProps={{
                style: { fontSize: "1rem" },
              }}
            />
          </Box>
          <Box display="flex" alignItems="center" marginBottom={2}>
            <EmailIcon style={{color: 'black'}} sx={{ marginRight: 1 }} />
            <TextField
              label="Email Address"
              variant="standard"
              fullWidth
              InputProps={{
                style: { fontSize: "1rem" },
              }}
            />
          </Box>
          <Box display="flex" alignItems="center" marginBottom={2}>
            <LockIcon style={{color: 'black'}} sx={{ marginRight: 1 }} />
            <TextField
              label="Create Password"
              variant="standard"
              type={showPassword ? 'text' : 'password'}
              fullWidth
              InputProps={{
                style: { fontSize: "1rem" },
                endAdornment: (<VisibilityIcon style={{color:"gray",cursor: 'pointer'}} onClick={handleClickShowPassword}/>),
              }}
            />
          </Box>
          <Box display="flex" alignItems="center" marginBottom={2}>
            <LockIcon style={{color: 'black'}} sx={{ marginRight: 1 }} />
            <TextField
              label="Re-enter Password"
              variant="standard"
              type="password"
              fullWidth
              InputProps={{
                style: { fontSize: "1rem" },
                endAdornment: (<VisibilityIcon style={{color:"gray", cursor: 'pointer'}}/>),
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
              control={<Checkbox defaultChecked />} style={{ color: 'black' }}
              label ="Remember Me"
            />
          </Box>

          <Typography variant="body2" color="textSecondary" marginBottom={2} align="center">
            By Registering you are agreeing to our{" "}
            <Link href="#" underline="hover">
              Terms
            </Link>{" "}
            and{" "}
            <Link href="#" underline="hover">
              Privacy Policy
            </Link>
          </Typography>

          <Button
            variant="contained"
            color="primary"
            fullWidth
            style={{
              borderRadius: "8px",
              fontSize: "1rem",
            }}
          >
            REGISTER
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default Register;