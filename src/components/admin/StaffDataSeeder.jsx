import React, { useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Alert,
  LinearProgress,
  Stack,
  Chip,
} from "@mui/material";
import {
  CloudUpload,
  Group,
  Person,
  CheckCircle,
  Error,
} from "@mui/icons-material";
import {
  seedMinistryDepartments,
  seedStaffData,
  seedAllData,
} from "../utils/seedStaffData";

const StaffDataSeeder = () => {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [messageType, setMessageType] = useState("success");

  const showMessage = (text, type = "success") => {
    setMessage(text);
    setMessageType(type);
    setTimeout(() => setMessage(null), 5000);
  };

  const handleSeedDepartments = async () => {
    setLoading(true);
    try {
      await seedMinistryDepartments();
      showMessage("Ministry departments seeded successfully!", "success");
    } catch (error) {
      showMessage(`Error seeding departments: ${error.message}`, "error");
    } finally {
      setLoading(false);
    }
  };

  const handleSeedStaff = async () => {
    setLoading(true);
    try {
      await seedStaffData();
      showMessage("Staff data seeded successfully!", "success");
    } catch (error) {
      showMessage(`Error seeding staff data: ${error.message}`, "error");
    } finally {
      setLoading(false);
    }
  };

  const handleSeedAll = async () => {
    setLoading(true);
    try {
      await seedAllData();
      showMessage("All data seeded successfully!", "success");
    } catch (error) {
      showMessage(`Error seeding data: ${error.message}`, "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card sx={{ maxWidth: 600, mx: "auto", mt: 4 }}>
      <CardContent sx={{ p: 4 }}>
        <Typography variant="h5" gutterBottom sx={{ fontWeight: 600, mb: 3 }}>
          <CloudUpload sx={{ mr: 1, verticalAlign: "middle" }} />
          Staff Data Seeder
        </Typography>

        <Typography variant="body2" color="text.secondary" paragraph>
          Use these buttons to populate your database with sample ministry
          departments and staff data. This is useful for development and testing
          purposes.
        </Typography>

        {loading && (
          <Box sx={{ mb: 3 }}>
            <LinearProgress />
            <Typography variant="body2" sx={{ mt: 1, textAlign: "center" }}>
              Seeding data...
            </Typography>
          </Box>
        )}

        {message && (
          <Alert
            severity={messageType}
            sx={{ mb: 3 }}
            icon={messageType === "success" ? <CheckCircle /> : <Error />}
          >
            {message}
          </Alert>
        )}

        <Stack spacing={2}>
          <Box>
            <Button
              variant="outlined"
              color="primary"
              fullWidth
              startIcon={<Group />}
              onClick={handleSeedDepartments}
              disabled={loading}
              sx={{ mb: 1 }}
            >
              Seed Ministry Departments
            </Button>
            <Typography variant="caption" color="text.secondary">
              Creates 5 ministry departments: Leadership, Pastoral Care, Youth
              Ministry, Worship Ministry, Administration
            </Typography>
          </Box>

          <Box>
            <Button
              variant="outlined"
              color="secondary"
              fullWidth
              startIcon={<Person />}
              onClick={handleSeedStaff}
              disabled={loading}
              sx={{ mb: 1 }}
            >
              Seed Staff Data
            </Button>
            <Typography variant="caption" color="text.secondary">
              Creates 7 sample staff members across all departments
            </Typography>
          </Box>

          <Box>
            <Button
              variant="contained"
              color="success"
              fullWidth
              startIcon={<CloudUpload />}
              onClick={handleSeedAll}
              disabled={loading}
              size="large"
              sx={{ mb: 1 }}
            >
              Seed All Data
            </Button>
            <Typography variant="caption" color="text.secondary">
              Seeds both ministry departments and staff data
            </Typography>
          </Box>
        </Stack>

        <Box sx={{ mt: 4, p: 2, bgcolor: "grey.50", borderRadius: 2 }}>
          <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 600 }}>
            Sample Data Overview:
          </Typography>
          <Stack direction="row" spacing={1} sx={{ mb: 1 }}>
            <Chip
              label="5 Departments"
              size="small"
              color="primary"
              variant="outlined"
            />
            <Chip
              label="7 Staff Members"
              size="small"
              color="secondary"
              variant="outlined"
            />
          </Stack>
          <Typography variant="caption" color="text.secondary">
            Data includes pastors, ministers, administrators, and support staff
            with realistic contact information and backgrounds.
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
};

export default StaffDataSeeder;
