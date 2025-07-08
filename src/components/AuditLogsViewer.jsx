// Audit Logs Viewer Component for Admin Dashboard
import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Tabs,
  Tab,
  Button,
  Alert,
  CircularProgress,
  TextField,
  Grid,
  Card,
  CardContent,
} from "@mui/material";
import {
  Security,
  AdminPanelSettings,
  Person,
  Refresh,
  Download,
  Warning,
} from "@mui/icons-material";
import { auditService } from "../firebase/audit";

// Tab panel component
function TabPanel({ children, value, index, ...other }) {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`audit-tabpanel-${index}`}
      aria-labelledby={`audit-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );
}

const AuditLogsViewer = () => {
  const [tabValue, setTabValue] = useState(0);
  const [adminLogs, setAdminLogs] = useState([]);
  const [securityLogs, setSecurityLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filterText, setFilterText] = useState("");

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const fetchLogs = async () => {
    try {
      setLoading(true);
      setError("");

      const [adminLogsData, securityLogsData] = await Promise.all([
        auditService.getAdminLogs(100),
        auditService.getSecurityLogs(100),
      ]);

      setAdminLogs(adminLogsData);
      setSecurityLogs(securityLogsData);
    } catch (err) {
      setError("Failed to load audit logs: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  const formatTimestamp = (timestamp) => {
    if (!timestamp) return "Unknown";
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleString();
  };

  const getActionColor = (action) => {
    if (action.includes("login") || action.includes("created"))
      return "success";
    if (action.includes("delete") || action.includes("failed")) return "error";
    if (action.includes("update") || action.includes("viewed"))
      return "warning";
    return "default";
  };

  const getSecurityEventColor = (event) => {
    if (
      event.includes("unauthorized") ||
      event.includes("failed") ||
      event.includes("invalid")
    ) {
      return "error";
    }
    if (event.includes("suspicious")) return "warning";
    if (event.includes("successful")) return "success";
    return "default";
  };

  const filterLogs = (logs) => {
    if (!filterText) return logs;
    return logs.filter((log) =>
      JSON.stringify(log).toLowerCase().includes(filterText.toLowerCase())
    );
  };

  const exportLogs = (logs, filename) => {
    const csvContent = [
      // Header
      "Timestamp,User,Email,Action/Event,Details,User Agent",
      // Data
      ...logs.map((log) =>
        [
          formatTimestamp(log.timestamp),
          log.userDisplayName || log.userId || "System",
          log.userEmail || "N/A",
          log.action || log.event || "Unknown",
          JSON.stringify(log.details || {}),
          log.userAgent || "N/A",
        ]
          .map((field) => `"${field}"`)
          .join(",")
      ),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" py={4}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={3}
      >
        <Typography variant="h4" gutterBottom>
          Audit Logs & Security Monitoring
        </Typography>
        <Button
          variant="outlined"
          startIcon={<Refresh />}
          onClick={fetchLogs}
          disabled={loading}
        >
          Refresh
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* Summary Cards */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={4}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center">
                <AdminPanelSettings color="primary" sx={{ mr: 2 }} />
                <Box>
                  <Typography variant="h6">{adminLogs.length}</Typography>
                  <Typography variant="body2" color="textSecondary">
                    Admin Actions
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center">
                <Security color="error" sx={{ mr: 2 }} />
                <Box>
                  <Typography variant="h6">{securityLogs.length}</Typography>
                  <Typography variant="body2" color="textSecondary">
                    Security Events
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center">
                <Warning color="warning" sx={{ mr: 2 }} />
                <Box>
                  <Typography variant="h6">
                    {
                      securityLogs.filter(
                        (log) =>
                          log.event &&
                          (log.event.includes("unauthorized") ||
                            log.event.includes("failed"))
                      ).length
                    }
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Security Alerts
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Filter */}
      <TextField
        fullWidth
        label="Filter logs..."
        value={filterText}
        onChange={(e) => setFilterText(e.target.value)}
        sx={{ mb: 3 }}
        placeholder="Search by user, action, email, or any other field"
      />

      {/* Tabs */}
      <Paper elevation={1}>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          sx={{ borderBottom: 1, borderColor: "divider" }}
        >
          <Tab
            icon={<AdminPanelSettings />}
            label={`Admin Logs (${adminLogs.length})`}
          />
          <Tab
            icon={<Security />}
            label={`Security Events (${securityLogs.length})`}
          />
        </Tabs>

        {/* Admin Logs Tab */}
        <TabPanel value={tabValue} index={0}>
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            mb={2}
          >
            <Typography variant="h6">Administrative Actions</Typography>
            <Button
              variant="outlined"
              startIcon={<Download />}
              onClick={() =>
                exportLogs(filterLogs(adminLogs), "admin-logs.csv")
              }
              size="small"
            >
              Export CSV
            </Button>
          </Box>

          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Timestamp</TableCell>
                  <TableCell>User</TableCell>
                  <TableCell>Action</TableCell>
                  <TableCell>Details</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filterLogs(adminLogs).map((log) => (
                  <TableRow key={log.id}>
                    <TableCell>
                      <Typography variant="body2">
                        {formatTimestamp(log.timestamp)}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Box>
                        <Typography variant="body2" fontWeight="bold">
                          {log.userDisplayName || "Unknown"}
                        </Typography>
                        <Typography variant="caption" color="textSecondary">
                          {log.userEmail}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={log.action}
                        color={getActionColor(log.action)}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {JSON.stringify(log.details || {})}
                      </Typography>
                    </TableCell>
                  </TableRow>
                ))}
                {filterLogs(adminLogs).length === 0 && (
                  <TableRow>
                    <TableCell colSpan={4} align="center">
                      <Typography color="textSecondary">
                        No admin logs found
                      </Typography>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </TabPanel>

        {/* Security Logs Tab */}
        <TabPanel value={tabValue} index={1}>
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            mb={2}
          >
            <Typography variant="h6">Security Events</Typography>
            <Button
              variant="outlined"
              startIcon={<Download />}
              onClick={() =>
                exportLogs(filterLogs(securityLogs), "security-logs.csv")
              }
              size="small"
            >
              Export CSV
            </Button>
          </Box>

          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Timestamp</TableCell>
                  <TableCell>User</TableCell>
                  <TableCell>Event</TableCell>
                  <TableCell>Details</TableCell>
                  <TableCell>User Agent</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filterLogs(securityLogs).map((log) => (
                  <TableRow key={log.id}>
                    <TableCell>
                      <Typography variant="body2">
                        {formatTimestamp(log.timestamp)}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Box>
                        <Typography variant="body2" fontWeight="bold">
                          {log.userEmail || "Anonymous"}
                        </Typography>
                        <Typography variant="caption" color="textSecondary">
                          {log.userId || "N/A"}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={log.event}
                        color={getSecurityEventColor(log.event)}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {JSON.stringify(log.details || {})}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="caption" color="textSecondary">
                        {log.userAgent
                          ? log.userAgent.substring(0, 50) + "..."
                          : "N/A"}
                      </Typography>
                    </TableCell>
                  </TableRow>
                ))}
                {filterLogs(securityLogs).length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5} align="center">
                      <Typography color="textSecondary">
                        No security events found
                      </Typography>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </TabPanel>
      </Paper>

      <Alert severity="info" sx={{ mt: 3 }}>
        <Typography variant="body2">
          <strong>Security Notice:</strong> All administrative actions and
          security events are logged for auditing purposes. Logs are
          automatically retained according to your data retention policy.
        </Typography>
      </Alert>
    </Box>
  );
};

export default AuditLogsViewer;
