import React, { useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemText,
  Box,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import {
  Menu as MenuIcon,
  Close as CloseIcon,
  Church as ChurchIcon,
} from "@mui/icons-material";
import { Link, useLocation } from "react-router-dom";

const Header = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const location = useLocation();

  const menuItems = [
    { title: "Home", path: "/" },
    { title: "About", path: "/about" },
    { title: "Sermons", path: "/sermons" },
    { title: "Events", path: "/events" },
    { title: "Ministries", path: "/ministries" },
    { title: "Giving", path: "/giving" },
    { title: "Staff", path: "/staff" },
    { title: "Contact", path: "/contact" },
  ];

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const drawer = (
    <Box sx={{ width: 250 }}>
      <Box sx={{ display: "flex", justifyContent: "flex-end", p: 1 }}>
        <IconButton onClick={handleDrawerToggle}>
          <CloseIcon />
        </IconButton>
      </Box>
      <List>
        {menuItems.map((item) => (
          <ListItem
            key={item.title}
            component={Link}
            to={item.path}
            onClick={handleDrawerToggle}
            sx={{
              bgcolor:
                location.pathname === item.path
                  ? "primary.light"
                  : "transparent",
              "&:hover": {
                bgcolor: "primary.light",
              },
            }}
          >
            <ListItemText
              primary={item.title}
              sx={{
                color: location.pathname === item.path ? "white" : "inherit",
              }}
            />
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <>
      <AppBar
        position="fixed"
        elevation={4}
        sx={{
          bgcolor: "primary.main",
          backdropFilter: "blur(10px)",
          borderBottom: "1px solid rgba(255,255,255,0.1)",
        }}
      >
        <Toolbar sx={{ justifyContent: "space-between" }}>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <ChurchIcon sx={{ mr: 1, fontSize: 32 }} />
            <Box>
              <Typography
                variant="h6"
                component={Link}
                to="/"
                sx={{
                  textDecoration: "none",
                  color: "inherit",
                  fontWeight: 700,
                  lineHeight: 1,
                }}
              >
                Christ Apostolic
              </Typography>
              <Typography
                variant="caption"
                sx={{
                  display: "block",
                  color: "secondary.main",
                  fontSize: "0.75rem",
                }}
              >
                Hours of Mercy
              </Typography>
            </Box>
          </Box>

          {isMobile ? (
            <IconButton
              color="inherit"
              aria-label="open drawer"
              onClick={handleDrawerToggle}
            >
              <MenuIcon />
            </IconButton>
          ) : (
            <Box sx={{ display: "flex", gap: 1 }}>
              {menuItems.map((item) => (
                <Button
                  key={item.title}
                  component={Link}
                  to={item.path}
                  color="inherit"
                  sx={{
                    bgcolor:
                      location.pathname === item.path
                        ? "rgba(255,255,255,0.1)"
                        : "transparent",
                    "&:hover": {
                      bgcolor: "rgba(255,255,255,0.1)",
                    },
                  }}
                >
                  {item.title}
                </Button>
              ))}
              <Button
                component={Link}
                to="/member-portal"
                variant="contained"
                color="secondary"
                sx={{ ml: 2 }}
              >
                Member Portal
              </Button>
            </Box>
          )}
        </Toolbar>
      </AppBar>

      <Drawer
        anchor="right"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true, // Better open performance on mobile.
        }}
      >
        {drawer}
      </Drawer>
    </>
  );
};

export default Header;
