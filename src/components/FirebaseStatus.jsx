// Firebase connection status component
import React, { useState, useEffect } from "react";
import { Alert, Box, Typography, Chip } from "@mui/material";
import { db } from "../firebase/config";
import { doc, getDoc } from "firebase/firestore";

const FirebaseStatus = () => {
  const [connectionStatus, setConnectionStatus] = useState("checking");
  const [error, setError] = useState(null);

  useEffect(() => {
    const checkConnection = async () => {
      try {
        // Try to read from Firestore to test connection
        await getDoc(doc(db, "__connection_test__", "test"));
        setConnectionStatus("connected");
      } catch (err) {
        console.log("Firebase connection test:", err.message);
        setConnectionStatus("disconnected");
        setError(err.message);
      }
    };

    checkConnection();
  }, []);

  if (connectionStatus === "checking") {
    return (
      <Box sx={{ position: "fixed", top: 10, right: 10, zIndex: 9999 }}>
        <Chip
          label="Checking Firebase..."
          color="info"
          size="small"
          variant="filled"
        />
      </Box>
    );
  }

  if (connectionStatus === "connected") {
    return (
      <Box sx={{ position: "fixed", top: 10, right: 10, zIndex: 9999 }}>
        <Chip
          label="🔥 Firebase Connected"
          color="success"
          size="small"
          variant="filled"
        />
      </Box>
    );
  }

  return (
    <Box sx={{ position: "fixed", top: 10, right: 10, zIndex: 9999 }}>
      <Chip
        label="Firebase: Demo Mode"
        color="warning"
        size="small"
        variant="filled"
      />
    </Box>
  );
};

export default FirebaseStatus;
