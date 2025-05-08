import React, { useState, useEffect } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Menu,
  MenuItem,
  Badge,
  CssBaseline,
  Box,
  Container,
  createTheme,
  ThemeProvider,
  Tabs,
  Tab,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
} from "@mui/material";
import {
  NotificationsOutlined,
  Brightness4Outlined,
  Brightness7Outlined,
  ShieldOutlined,
  VisibilityOutlined,
  ManageAccountsOutlined,
  AccountCircleOutlined,
} from "@mui/icons-material";

import MyConsents from "./components/MyConsents";

// Import static JSON data
import notificationsData from "../backend/data/payload.json";
import { v4 as uuidv4 } from "uuid";

export default function MyConsentsPage() {
  const [mode, setMode] = useState<"light" | "dark">("light");
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [activeTab, setActiveTab] = useState(0);
  const [notifOpen, setNotifOpen] = useState(false);
  const [approvalData, setApprovalData] = useState([]);
  const [user, setUser] = useState<{ username: string; role: string } | null>(
    null
  );

  useEffect(() => {
    const storedUser = sessionStorage.getItem("userDetails");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  useEffect(() => {
    // Use static JSON data instead of API call
    setApprovalData(notificationsData);
  }, []);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) =>
    setActiveTab(newValue);
  const handleProfileClick = (event: React.MouseEvent<HTMLElement>) =>
    setAnchorEl(event.currentTarget);
  const handleProfileClose = () => setAnchorEl(null);

  const handleApprove = (row: any) => {
    const newEntry = {
      "Application Name": row.appName,
      "Dataset Name": row.dataset,
      "Data Class": row.classification,
      Fields: row.fields.join(", "),
      "Access Type": "Approved",
      "Function Role": row.functionRole,
      "Purpose of Access": row.purpose,
      "Access Token": generateJWT(),
      "Expiry Date": row.expiry,
      DPO: "Pending",
      CISO: "Pending",
      CDO: "Approved",
    };
    console.log("✅ New Approved Entry →", newEntry);
    // In real application, post this to backend for Excel update
    setApprovalData((prev) => prev.filter((r) => r !== row));

    // In static version we're just logging the approved entry instead of POSTing to an API
    console.log("✅ Approved Entry (would be saved to backend):", newEntry);
    
    // We can still filter the notifications locally the same way we would on the backend
    // This would normally remove the notification on the server
  };

  const handleReject = (row: any) => {
    setApprovalData((prev) => prev.filter((r) => r !== row));
  };

  const generateJWT = () => {
    const token = uuidv4().replace(/-/g, "").substring(0, 24);
    return `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.${btoa(token)}.signature`;
  };

  const theme = createTheme({
    palette: {
      mode,
      primary: { main: "#4f46e5" },
      background: { default: mode === "light" ? "#f8fafc" : "#0f172a" },
      text: { primary: mode === "light" ? "#0f172a" : "#f8fafc" },
    },
    typography: { fontFamily: "Inter, sans-serif", fontSize: 13 },
    components: {
      MuiAppBar: {
        styleOverrides: {
          root: {
            backgroundColor: mode === "light" ? "#ffffff" : "#1f2937",
            boxShadow: "none",
            borderBottom:
              mode === "light" ? "1px solid #e5e7eb" : "1px solid #374151",
          },
        },
      },
    },
  });

  const grayIconStyle = { fontSize: "20px", color: "#6b7280" };
  const topNavTabs = [
    {
      label: "Consent Dashboard",
      icon: <ShieldOutlined sx={grayIconStyle} />,
    }
  ];

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ flexGrow: 1, zoom: 0.95 }}>
        <AppBar
          position="fixed"
          sx={{ height: 88, justifyContent: "center", px: 4 }}
        >
          <Toolbar disableGutters>
            <Box display="flex" alignItems="center" gap={2} flexGrow={1}>
              <ShieldOutlined sx={{ fontSize: 26, color: "#4f46e5" }} />
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 600,
                  color: mode === "light" ? "#1e293b" : "#f1f5f9",
                }}
              >
                TrustChain
              </Typography>

              <Tabs
                value={activeTab}
                onChange={handleTabChange}
                textColor="primary"
                indicatorColor="primary"
                sx={{ ml: 4 }}
              >
                {topNavTabs.map((tab, index) => (
                  <Tab
                    key={tab.label}
                    icon={tab.icon}
                    iconPosition="start"
                    label={
                      <Typography fontWeight={600}>{tab.label}</Typography>
                    }
                    sx={{
                      textTransform: "none",
                      color: index === activeTab ? "#4f46e5" : "#64748b",
                      fontWeight: index === activeTab ? 600 : 500,
                      minHeight: 48,
                    }}
                  />
                ))}
              </Tabs>
            </Box>
            <Box display="flex" alignItems="center" gap={1}>
              <IconButton
                color="inherit"
                onClick={() => setMode(mode === "light" ? "dark" : "light")}
              >
                {mode === "light" ? (
                  <Brightness4Outlined sx={grayIconStyle} />
                ) : (
                  <Brightness7Outlined sx={grayIconStyle} />
                )}
              </IconButton>
              <IconButton color="inherit" onClick={() => setNotifOpen(true)}>
                <Badge badgeContent={approvalData.length} color="error">
                  <NotificationsOutlined sx={grayIconStyle} />
                </Badge>
              </IconButton>
              <IconButton color="inherit" onClick={handleProfileClick}>
                <AccountCircleOutlined sx={grayIconStyle} />
              </IconButton>
              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleProfileClose}
              >
                <MenuItem disabled>
                  {user?.username && " | " && user?.role}
                </MenuItem>
                <MenuItem onClick={handleProfileClose}>Logout</MenuItem>
              </Menu>
            </Box>
          </Toolbar>
        </AppBar>

        <Dialog
          open={notifOpen}
          onClose={() => setNotifOpen(false)}
          maxWidth="xl"
          fullWidth
        >
          <DialogTitle fontWeight={600}>
            Access Requests Pending Approval
          </DialogTitle>
          <DialogContent>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>
                    <strong>Application Name</strong>
                  </TableCell>
                  <TableCell>
                    <strong>Dataset Name</strong>
                  </TableCell>
                  <TableCell>
                    <strong>Classification</strong>
                  </TableCell>
                  <TableCell>
                    <strong>Fields</strong>
                  </TableCell>
                  <TableCell>
                    <strong>Function Role</strong>
                  </TableCell>
                  <TableCell>
                    <strong>Purpose of Access</strong>
                  </TableCell>
                  <TableCell>
                    <strong>Expiry Date</strong>
                  </TableCell>
                  <TableCell>
                    <strong>Action</strong>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {approvalData.map((row: any, index) => (
                  <TableRow key={index}>
                    <TableCell>{row.appName}</TableCell>
                    <TableCell>{row.dataset}</TableCell>
                    <TableCell>{row.classification}</TableCell>
                    <TableCell>{row.fields?.join(", ")}</TableCell>
                    <TableCell>{row.functionRole}</TableCell>
                    <TableCell>{row.purpose}</TableCell>
                    <TableCell>{row.expiry}</TableCell>
                    <TableCell>
                      <Button
                        size="small"
                        variant="contained"
                        color="success"
                        sx={{ mr: 1 }}
                        onClick={() => handleApprove(row)}
                      >
                        Approve
                      </Button>
                      <Button
                        size="small"
                        variant="outlined"
                        color="error"
                        onClick={() => handleReject(row)}
                      >
                        Reject
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setNotifOpen(false)}>Close</Button>
          </DialogActions>
        </Dialog>

        {/* Main Content */}
        <Box component="main" sx={{ mt: "96px", px: 4, pb: 4 }}>
          <Container maxWidth={false} disableGutters>
            {activeTab === 0 && <MyConsents />}
          </Container>
        </Box>
      </Box>
    </ThemeProvider>
  );
}
