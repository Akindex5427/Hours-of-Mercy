import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { Toolbar } from "@mui/material";
import { HelmetProvider } from "react-helmet-async";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

// Components
import Header from "./components/layout/Header";
import Footer from "./components/layout/Footer";
import FirebaseStatus from "./components/FirebaseStatus";

// Pages
import HomePage from "./pages/HomePage";
import AboutPage from "./pages/AboutPage";
import SermonPage from "./pages/SermonPageModern";
import EventsPage from "./pages/EventsPage";
import MinistriesPage from "./pages/MinistriesPage";
import GivingPage from "./pages/GivingPage";
import ContactPage from "./pages/ContactPage";
import PrayerRequestPage from "./pages/PrayerRequestPage";
import MemberPortal from "./pages/MemberPortal";
import StaffDirectory from "./pages/StaffDirectory";
import AdminPage from "./pages/AdminPage";

// Theme configuration
const theme = createTheme({
  palette: {
    primary: {
      main: "#2c5530", // Deep forest green
      light: "#5a7f5e",
      dark: "#1a3a1d",
    },
    secondary: {
      main: "#d4af37", // Golden yellow
      light: "#ddc15e",
      dark: "#a8822b",
    },
    background: {
      default: "#fafafa",
      paper: "#ffffff",
    },
    text: {
      primary: "#2c2c2c",
      secondary: "#5a5a5a",
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
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
          borderRadius: 12,
        },
      },
    },
  },
});

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
                <Routes>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/about" element={<AboutPage />} />
                  <Route path="/sermons" element={<SermonPage />} />
                  <Route path="/events" element={<EventsPage />} />
                  <Route path="/ministries" element={<MinistriesPage />} />
                  <Route path="/giving" element={<GivingPage />} />
                  <Route path="/contact" element={<ContactPage />} />
                  <Route
                    path="/prayer-request"
                    element={<PrayerRequestPage />}
                  />
                  <Route path="/member-portal" element={<MemberPortal />} />
                  <Route path="/staff" element={<StaffDirectory />} />
                  <Route path="/admin" element={<AdminPage />} />
                </Routes>
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
