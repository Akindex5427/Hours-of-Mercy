import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { Toolbar } from "@mui/material";
import { HelmetProvider } from "react-helmet-async";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { AnimatePresence } from "framer-motion";

// Components
import Header from "./components/layout/Header";
import Footer from "./components/layout/Footer";
import FirebaseStatus from "./components/FirebaseStatus";

// Pages
import HomePage from "./pages/HomePage";
import AboutPage from "./pages/AboutPage";
import SermonPage from "./pages/SermonPage";
import EventsPage from "./pages/EventsPage";
import MinistriesPage from "./pages/MinistriesPage";
import GivingPage from "./pages/GivingPage";
import ContactPage from "./pages/ContactPageSafe";
import PrayerRequestPage from "./pages/PrayerRequestPage";
import MemberPortal from "./pages/MemberPortal";
import StaffDirectory from "./pages/StaffDirectorySafe";
import AdminPage from "./pages/AdminPage";

// Theme configuration
const theme = createTheme({
  palette: {
    primary: {
      main: "#1e3a8a", // Deep navy blue
      light: "#3b82f6", // Bright blue
      dark: "#1e40af", // Darker navy
    },
    secondary: {
      main: "#06b6d4", // Cyan blue
      light: "#67e8f9", // Light cyan
      dark: "#0891b2", // Dark cyan
    },
    background: {
      default: "#f8fafc", // Very light blue-gray
      paper: "#ffffff",
    },
    text: {
      primary: "#1e293b", // Dark blue-gray
      secondary: "#475569", // Medium blue-gray
    },
    info: {
      main: "#0ea5e9", // Sky blue
      light: "#7dd3fc",
      dark: "#0284c7",
    },
    success: {
      main: "#10b981", // Emerald (keeping some accent color)
      light: "#6ee7b7",
      dark: "#059669",
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 700,
      fontSize: "2.5rem",
      lineHeight: 1.2,
    },
    h2: {
      fontWeight: 600,
      fontSize: "2rem",
      lineHeight: 1.3,
    },
    h3: {
      fontWeight: 600,
      fontSize: "1.5rem",
      lineHeight: 1.4,
    },
    body1: {
      fontSize: "1rem",
      lineHeight: 1.6,
    },
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none",
          fontWeight: 600,
          borderRadius: 8,
          padding: "10px 24px",
        },
        contained: {
          backgroundColor: "#1e3a8a",
          color: "white",
          "&:hover": {
            backgroundColor: "#1e40af",
            transform: "translateY(-1px)",
            boxShadow: "0 4px 12px rgba(30, 58, 138, 0.3)",
          },
        },
        outlined: {
          borderColor: "#1e3a8a",
          color: "#1e3a8a",
          "&:hover": {
            borderColor: "#1e40af",
            backgroundColor: "rgba(30, 58, 138, 0.04)",
          },
        },
        text: {
          color: "#1e3a8a",
          "&:hover": {
            backgroundColor: "rgba(30, 58, 138, 0.04)",
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          boxShadow: "0 4px 16px rgba(30, 58, 138, 0.1)",
          borderRadius: 16,
          border: "1px solid rgba(59, 130, 246, 0.1)",
          "&:hover": {
            boxShadow: "0 8px 24px rgba(30, 58, 138, 0.15)",
            transform: "translateY(-2px)",
            transition: "all 0.3s ease-in-out",
          },
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: "#1e3a8a",
          backdropFilter: "blur(10px)",
          borderBottom: "1px solid rgba(59, 130, 246, 0.2)",
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          backgroundColor: "#06b6d4",
          color: "white",
          fontWeight: 600,
        },
      },
    },
  },
});

// Route wrapper component for animations
const AnimatedRoutes = () => {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/sermons" element={<SermonPage />} />
        <Route path="/events" element={<EventsPage />} />
        <Route path="/ministries" element={<MinistriesPage />} />
        <Route path="/giving" element={<GivingPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/prayer-request" element={<PrayerRequestPage />} />
        <Route path="/member-portal" element={<MemberPortal />} />
        <Route path="/staff" element={<StaffDirectory />} />
        <Route path="/admin" element={<AdminPage />} />
      </Routes>
    </AnimatePresence>
  );
};

function App() {
  return (
    <HelmetProvider>
      <ThemeProvider theme={theme}>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <CssBaseline />
          <Router>
            <div className="App">
              <FirebaseStatus />
              <Header />
              <Toolbar /> {/* This creates space for the fixed header */}
              <main>
                <AnimatedRoutes />
              </main>
              <Footer />
            </div>
          </Router>
        </LocalizationProvider>
      </ThemeProvider>
    </HelmetProvider>
  );
}

export default App;
