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
  Stack,
  Divider,
  Fade,
} from "@mui/material";
import {
  Menu as MenuIcon,
  Close as CloseIcon,
  Church as ChurchIcon,
  ArrowForward,
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
    <Box sx={{ width: 320, height: "100%", bgcolor: "white" }}>
      {/* Drawer Header */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          p: 3,
          bgcolor: "primary.main",
          color: "white",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <ChurchIcon sx={{ fontSize: 28, mr: 1.5 }} />
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 700, lineHeight: 1.2 }}>
              Christ Apostolic
            </Typography>
            <Typography variant="caption" sx={{ opacity: 0.9 }}>
              Hours of Mercy
            </Typography>
          </Box>
        </Box>
        <IconButton
          onClick={handleDrawerToggle}
          sx={{
            color: "white",
            "&:hover": { bgcolor: "rgba(255,255,255,0.1)" },
          }}
        >
          <CloseIcon />
        </IconButton>
      </Box>

      {/* Navigation Items */}
      <List sx={{ pt: 3, px: 2 }}>
        {menuItems.map((item, index) => (
          <Fade in={true} timeout={300 + index * 100} key={item.title}>
            <ListItem
              component={Link}
              to={item.path}
              onClick={handleDrawerToggle}
              sx={{
                py: 2,
                px: 3,
                mb: 1,
                borderRadius: 0,
                bgcolor: "transparent",
                border: "none",
                "&:hover": {
                  bgcolor: "transparent",
                  transform: "translateY(-2px)",
                  textDecoration: "underline",
                  textUnderlineOffset: "4px",
                  textDecorationColor: "#1e3a8a",
                  textDecorationThickness: "2px",
                },
                transition: "all 0.3s ease",
                cursor: "pointer",
              }}
            >
              <ListItemText
                primary={item.title}
                sx={{
                  "& .MuiListItemText-primary": {
                    fontSize: "1.1rem",
                    fontWeight: location.pathname === item.path ? 700 : 500,
                    color:
                      location.pathname === item.path ? "#1e3a8a" : "#334155",
                    letterSpacing: "0.5px",
                    textDecoration:
                      location.pathname === item.path ? "underline" : "none",
                    textUnderlineOffset: "4px",
                    textDecorationColor: "#1e3a8a",
                    textDecorationThickness: "2px",
                  },
                }}
              />
            </ListItem>
          </Fade>
        ))}

        <Divider sx={{ my: 3, mx: 2 }} />

        <Fade in={true} timeout={800}>
          <ListItem
            component={Link}
            to="/member-portal"
            onClick={handleDrawerToggle}
            sx={{
              py: 2.5,
              px: 3,
              mx: 1,
              borderRadius: 3,
              bgcolor: "primary.main",
              color: "white",
              "&:hover": {
                bgcolor: "primary.dark",
                transform: "translateY(-2px)",
                boxShadow: "0 8px 25px rgba(30, 58, 138, 0.3)",
              },
              transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
              cursor: "pointer",
            }}
          >
            <ListItemText
              primary="Member Portal"
              sx={{
                "& .MuiListItemText-primary": {
                  fontSize: "1.1rem",
                  fontWeight: 600,
                  textAlign: "center",
                  letterSpacing: "0.5px",
                },
              }}
            />
          </ListItem>
        </Fade>
      </List>
    </Box>
  );

  return (
    <>
      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          background:
            "linear-gradient(135deg, #ffffff 0%, #f8fafc 50%, #ffffff 100%)",
          borderBottom: "1px solid #e2e8f0",
        }}
      >
        <Toolbar
          sx={{
            justifyContent: "space-between",
            py: 1.5,
            minHeight: "80px !important",
          }}
        >
          {/* Enhanced Logo Section */}
          <Box
            component={Link}
            to="/"
            sx={{
              display: "flex",
              alignItems: "center",
              textDecoration: "none",
              "&:hover": {
                transform: "scale(1.03)",
              },
              transition: "transform 0.3s ease",
            }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: 50,
                height: 50,
                borderRadius: "12px",
                mr: 2,
                bgcolor: "#1e3a8a",
              }}
            >
              <ChurchIcon sx={{ fontSize: 28, color: "white" }} />
            </Box>
            <Box>
              <Typography
                variant="h5"
                sx={{
                  color: "#1a202c",
                  fontWeight: 800,
                  lineHeight: 1.2,
                  fontSize: "1.4rem",
                  letterSpacing: "-0.5px",
                }}
              >
                Christ Apostolic
              </Typography>
              <Typography
                variant="subtitle2"
                sx={{
                  color: "#4a5568",
                  fontSize: "0.85rem",
                  fontWeight: 600,
                  letterSpacing: "1px",
                  textTransform: "uppercase",
                }}
              >
                Hours of Mercy
              </Typography>
            </Box>
          </Box>

          {/* Desktop Navigation */}
          {isMobile ? (
            <IconButton
              color="inherit"
              aria-label="open drawer"
              onClick={handleDrawerToggle}
              sx={{
                borderRadius: 2,
                p: 1.5,
                color: "#1a202c",
                "&:hover": {
                  bgcolor: "#f7fafc",
                  transform: "scale(1.1)",
                },
                transition: "all 0.3s ease",
              }}
            >
              <MenuIcon sx={{ fontSize: 24 }} />
            </IconButton>
          ) : (
            <Stack direction="row" spacing={3} alignItems="center">
              {/* Navigation Items */}
              <Stack direction="row" spacing={0}>
                {menuItems.map((item) => (
                  <Button
                    key={item.title}
                    component={Link}
                    to={item.path}
                    disableRipple
                    disableElevation
                    sx={{
                      color: "#2d3748",
                      fontWeight: location.pathname === item.path ? 700 : 500,
                      fontSize: "0.95rem",
                      textTransform: "none",
                      px: 2.5,
                      py: 1.5,
                      mx: 0.5,
                      borderRadius: 0,
                      backgroundColor: "transparent !important",
                      background: "transparent !important",
                      border: "none !important",
                      boxShadow: "none !important",
                      minWidth: "auto",
                      "&:hover": {
                        backgroundColor: "transparent !important",
                        background: "transparent !important",
                        textDecoration: "underline",
                        textUnderlineOffset: "4px",
                        textDecorationColor: "#1e3a8a",
                        textDecorationThickness: "2px",
                        boxShadow: "none !important",
                      },
                      "&:focus, &:active, &.Mui-focusVisible": {
                        backgroundColor: "transparent !important",
                        background: "transparent !important",
                        border: "none !important",
                        boxShadow: "none !important",
                        outline: "none !important",
                      },
                      "&:before, &:after": {
                        display: "none !important",
                      },
                      transition: "text-decoration 0.3s ease",
                    }}
                  >
                    {item.title}
                  </Button>
                ))}
              </Stack>

              {/* Member Portal Button */}
              <Button
                component={Link}
                to="/member-portal"
                variant="contained"
                sx={{
                  bgcolor: "#1e3a8a",
                  color: "white",
                  fontWeight: 600,
                  px: 3,
                  py: 1.2,
                  borderRadius: 3,
                  textTransform: "none",
                  fontSize: "0.9rem",
                  "&:hover": {
                    bgcolor: "#1e40af",
                    transform: "translateY(-2px)",
                  },
                  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                }}
              >
                Member Portal
              </Button>
            </Stack>
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
