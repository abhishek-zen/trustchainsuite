import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Container,
  CssBaseline,
  TextField,
  Typography,
  Checkbox,
  FormControlLabel,
  CircularProgress,
  AppBar,
  Toolbar,
  IconButton,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import ShieldWithCheckIcon from "@mui/icons-material/VerifiedUser";

const userRoles = {
  cdoOfficeUser: "Chief Data Officer",
  cisoOfficeUser_001: "Chief Information Security Officer (CISO)",
  cisoOfficeUser_002: "Chief Information Security Officer (CISO)",
  dpoOfficeUser_001: "Data Protection Officer",
  dpoOfficeUser_002: "Data Protection Officer",
  dpoOfficeUser_003: "Data Protection Officer",
  dpoOfficeUser_004: "Data Protection Officer",
  appOwner_001: "Application Owner",
};

interface LoginProps {
  onLoginSuccess: () => void;
}

const Login: React.FC<LoginProps> = ({ onLoginSuccess }) => {
  const [username, setUsername] = useState("");
  const [role, setRole] = useState("");
  const [loading, setLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setRole(userRoles[username] || "");
  }, [username]);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);

    setTimeout(() => {
      setLoading(false);

      const role =
        username === "cdoOfficeUser"
          ? "Chief Data Officer"
          : userRoles[username]?.includes("Protection Officer")
          ? "Data Protection Officer"
          : userRoles[username]?.includes("Information Security Officer")
          ? "Chief Information Security Officer"
          : username === "appOwner_001"
          ? "Application Owner"
          : null;

      if (role) {
        // ✅ Store in sessionStorage
        sessionStorage.setItem(
          "userDetails",
          JSON.stringify({ username, role })
        );

        localStorage.setItem("token", "token");
        onLoginSuccess();

        // ✅ Redirect
        if (role === "Application Owner") {
          navigate("/manage");
        } else {
          navigate("/");
        }
      } else {
        alert("Invalid User");
      }
    }, 2000);
  };

  return (
    <Box sx={{ minHeight: "100vh", backgroundColor: "#f9fbfc" }}>
      <AppBar
        position="static"
        elevation={0}
        sx={{ backgroundColor: "#ffffff", borderBottom: "1px solid #e5e7eb" }}
      >
        <Toolbar sx={{ justifyContent: "space-between" }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <ShieldWithCheckIcon color="primary" />
            <Typography variant="h6" color="text.primary" fontWeight="bold">
              TrustChain Product Console
            </Typography>
          </Box>
          <Box sx={{ display: "flex", gap: 3 }}>
            <Typography
              variant="body2"
              sx={{ color: "text.secondary", cursor: "pointer" }}
            >
              Help
            </Typography>
            <Typography
              variant="body2"
              sx={{ color: "text.secondary", cursor: "pointer" }}
            >
              About
            </Typography>
            <Typography
              variant="body2"
              sx={{ color: "text.secondary", cursor: "pointer" }}
            >
              Contact
            </Typography>
          </Box>
        </Toolbar>
      </AppBar>

      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "calc(100vh - 64px)",
        }}
      >
        <Container component="main" maxWidth="sm">
          <CssBaseline />
          <Box
            sx={{
              mt: 4,
              p: 5,
              backgroundColor: "white",
              boxShadow: 3,
              borderRadius: 4,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Box
              sx={{
                mb: 2,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: 56,
                height: 56,
                backgroundColor: "#eef2ff",
                borderRadius: "50%",
              }}
            >
              <ShieldWithCheckIcon color="primary" fontSize="large" />
            </Box>
            <Typography
              component="h1"
              variant="h5"
              fontWeight="bold"
              sx={{ mb: 1 }}
            >
              Welcome back
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Sign in to your account
            </Typography>
            <Box
              component="form"
              onSubmit={handleSubmit}
              noValidate
              sx={{ mt: 1, width: "100%" }}
            >
              <TextField
                margin="normal"
                required
                fullWidth
                id="username"
                label="Email address or Username"
                name="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                autoFocus
              />
              {role && (
                <Typography
                  variant="subtitle2"
                  sx={{ color: "primary.main", mb: 1 }}
                >
                  Role: {role}
                </Typography>
              )}
              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
              />
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
              >
                <FormControlLabel
                  control={
                    <Checkbox
                      value={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      color="primary"
                    />
                  }
                  label="Remember me for 30 days"
                />
                <Typography
                  variant="body2"
                  sx={{
                    color: "primary.main",
                    cursor: "pointer",
                    fontWeight: 500,
                  }}
                >
                  Forgot password?
                </Typography>
              </Box>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                disabled={loading}
                sx={{
                  mt: 3,
                  mb: 2,
                  py: 1.5,
                  fontWeight: "bold",
                  textTransform: "none",
                }}
                startIcon={
                  !loading && <span className="material-icons">Login</span>
                }
              >
                {loading ? <CircularProgress size={24} color="inherit" /> : ""}
              </Button>
              <Typography variant="body2" align="center">
                Don’t have an account?{" "}
                <span style={{ color: "#6366f1", cursor: "pointer" }}>
                  Create an account
                </span>
              </Typography>
            </Box>
          </Box>
          <Typography
            variant="caption"
            color="text.secondary"
            align="center"
            sx={{ mt: 4 }}
          >
            By signing in, you agree to our{" "}
            <span style={{ textDecoration: "underline", cursor: "pointer" }}>
              Terms of Service
            </span>{" "}
            and{" "}
            <span style={{ textDecoration: "underline", cursor: "pointer" }}>
              Privacy Policy
            </span>
          </Typography>
        </Container>
      </Box>
    </Box>
  );
};

export default Login;
