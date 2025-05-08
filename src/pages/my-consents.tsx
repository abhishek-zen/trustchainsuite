// pages/my-consents.tsx
import React, { useState } from 'react';
import {
  AppBar, Toolbar, Typography, IconButton, Avatar, Menu, MenuItem, Badge, Drawer, List,
  ListItem, ListItemButton, ListItemIcon, ListItemText, CssBaseline, Box, Container,
  createTheme, ThemeProvider
} from '@mui/material';
import {
  Menu as MenuIcon, Dashboard, Assignment, LockPerson, Settings, Support,
  Notifications, Brightness4, Brightness7
} from '@mui/icons-material';
import MyConsents from "../components/MyConsents";

const drawerWidth = 240;

export default function MyConsentsPage() {
  const [mode, setMode] = useState<'light' | 'dark'>('light');
  const [drawerOpen, setDrawerOpen] = useState(true);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const toggleDrawer = () => setDrawerOpen(!drawerOpen);
  const handleProfileClick = (event: React.MouseEvent<HTMLElement>) => setAnchorEl(event.currentTarget);
  const handleProfileClose = () => setAnchorEl(null);

  const theme = createTheme({
    palette: { mode },
    typography: { fontFamily: 'Inter, sans-serif', fontSize: 13 },
    components: {
      MuiAppBar: {
        styleOverrides: {
          root: {
            backgroundColor: mode === 'light' ? '#ffffff' : '#1f2937',
            boxShadow: 'none',
            borderBottom: mode === 'light' ? '1px solid #e5e7eb' : '1px solid #374151'
          }
        }
      }
    }
  });

  const sidebarItems = [
    { text: 'Consent Dashboard', icon: <Dashboard /> },
    { text: 'Applications', icon: <Assignment /> },
    { text: 'Purpose Management', icon: <LockPerson /> },
    { text: 'Settings', icon: <Settings /> },
    { text: 'Support', icon: <Support /> },
  ];

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ display: 'flex', zoom: 0.9 }}>
        {/* AppBar */}
        <AppBar position="fixed" sx={{ zIndex: 1300, height: 88, justifyContent: 'center' }}>
          <Toolbar>
            <IconButton edge="start" color="inherit" onClick={toggleDrawer} sx={{ mr: 2 }}>
              <MenuIcon />
            </IconButton>
            <img src="/logo192.png" alt="logo" className="w-10 h-10" />
            <Typography variant="h6" noWrap sx={{ ml: 2, flexGrow: 1, fontWeight: 600, color: mode === 'light' ? '#1e293b' : '#f1f5f9' }}>
              Trustchain Console
            </Typography>
            <IconButton color="inherit" onClick={() => setMode(mode === 'light' ? 'dark' : 'light')}>
              {mode === 'light' ? <Brightness4 /> : <Brightness7 />}
            </IconButton>
            <IconButton color="inherit">
              <Badge badgeContent={4} color="error">
                <Notifications />
              </Badge>
            </IconButton>
            <IconButton onClick={handleProfileClick} color="inherit">
              <Avatar sx={{ width: 30, height: 30 }}>U</Avatar>
            </IconButton>
            <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleProfileClose}>
              <MenuItem disabled>John Doe – Admin</MenuItem>
              <MenuItem onClick={handleProfileClose}>Logout</MenuItem>
            </Menu>
          </Toolbar>
        </AppBar>

        {/* Sidebar Drawer */}
        <Drawer
          variant="permanent"
          open={drawerOpen}
          sx={{
            width: drawerOpen ? drawerWidth : 64,
            flexShrink: 0,
            '& .MuiDrawer-paper': {
              width: drawerOpen ? drawerWidth : 64,
              overflowX: 'hidden',
              transition: 'width 0.3s',
              boxSizing: 'border-box',
              mt: '88px',
              backgroundColor: mode === 'light' ? '#ffffff' : '#1e293b',
              borderRight: mode === 'light' ? '1px solid #e5e7eb' : '1px solid #374151',
              color: mode === 'light' ? '#0f172a' : '#f8fafc'
            }
          }}
        >
          <List>
            {sidebarItems.map(({ text, icon }) => (
              <ListItem key={text} disablePadding sx={{ display: 'block' }}>
                <ListItemButton
                  sx={{
                    minHeight: 48,
                    justifyContent: drawerOpen ? 'initial' : 'center',
                    px: 2.5,
                    '&:hover': {
                      backgroundColor: mode === 'light' ? '#f1f5f9' : '#334155'
                    }
                  }}
                >
                  <ListItemIcon sx={{ minWidth: 0, mr: drawerOpen ? 3 : 'auto', justifyContent: 'center', color: 'inherit' }}>
                    {icon}
                  </ListItemIcon>
                  <ListItemText primary={text} sx={{ opacity: drawerOpen ? 1 : 0 }} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Drawer>

        {/* Main Content */}
        <Box component="main" sx={{ flexGrow: 1, p: 3, mt: '88px' }}>
          <Container maxWidth={false}>
            <MyConsents />
          </Container>
        </Box>
      </Box>
    </ThemeProvider>
  );
}