import React, { useState, useEffect } from "react";
import {
  Box,
  Container,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  IconButton,
  Grid,
  FormControlLabel,
  Checkbox,
  Alert,
  Tabs,
  Tab,
} from "@mui/material";
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Event as EventIcon,
  Schedule as ScheduleIcon,
} from "@mui/icons-material";
import { DatePicker, TimePicker } from "@mui/x-date-pickers";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import dayjs from "dayjs";
import { useRecurringEvents } from "../hooks/useFirestore";
import { generateRecurringEventInstances } from "../firebase/recurringEventsService";

// Validation schema
const templateSchema = yup.object({
  title: yup.string().required("Title is required"),
  description: yup.string().required("Description is required"),
  startTime: yup.string().required("Start time is required"),
  endTime: yup.string(),
  location: yup.string().required("Location is required"),
  address: yup.string(),
  category: yup.string().required("Category is required"),
  organizer: yup.string(),
  capacity: yup.number().min(1, "Capacity must be at least 1"),
  recurringType: yup.string().required("Recurring type is required"),
  startDate: yup.date().required("Start date is required"),
  endDate: yup.date(),
  isActive: yup.boolean(),
});

const RecurringEventsAdmin = () => {
  const [selectedTab, setSelectedTab] = useState(0);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState(null);
  const [previewDate, setPreviewDate] = useState(dayjs());
  const [previewEvents, setPreviewEvents] = useState([]);
  const [showSuccess, setShowSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const {
    templates,
    loading,
    error,
    addTemplate,
    updateTemplate,
    deleteTemplate,
  } = useRecurringEvents();

  const {
    control,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(templateSchema),
    defaultValues: {
      title: "",
      description: "",
      startTime: "10:00",
      endTime: "11:00",
      location: "",
      address: "1480 Lincoln Ave, Dolton, IL",
      category: "worship",
      organizer: "",
      capacity: 100,
      recurringType: "weekly",
      recurringConfig: {},
      startDate: new Date(),
      endDate: null,
      isActive: true,
      registrationRequired: false,
      imageUrl: "/api/placeholder/400/250",
      tags: [],
    },
  });

  const watchedRecurringType = watch("recurringType");

  const categories = [
    { value: "worship", label: "Worship" },
    { value: "prayer", label: "Prayer" },
    { value: "youth", label: "Youth" },
    { value: "fellowship", label: "Fellowship" },
    { value: "study", label: "Bible Study" },
    { value: "outreach", label: "Outreach" },
    { value: "retreat", label: "Retreat" },
    { value: "conference", label: "Conference" },
  ];

  const recurringTypes = [
    { value: "weekly", label: "Weekly" },
    { value: "monthly", label: "Monthly" },
    { value: "yearly", label: "Yearly" },
    { value: "custom", label: "Custom Interval" },
  ];

  const daysOfWeek = [
    { value: 0, label: "Sunday" },
    { value: 1, label: "Monday" },
    { value: 2, label: "Tuesday" },
    { value: 3, label: "Wednesday" },
    { value: 4, label: "Thursday" },
    { value: 5, label: "Friday" },
    { value: 6, label: "Saturday" },
  ];

  // Preview events when date changes
  useEffect(() => {
    const generatePreview = async () => {
      if (templates.length > 0) {
        const activeTemplates = templates.filter((t) => t.isActive);
        const startDate = previewDate.startOf("month");
        const endDate = previewDate.endOf("month");
        const instances = generateRecurringEventInstances(
          activeTemplates,
          startDate,
          endDate
        );
        setPreviewEvents(instances);
      }
    };
    generatePreview();
  }, [templates, previewDate]);

  const handleOpenDialog = (template = null) => {
    if (template) {
      setEditingTemplate(template);
      reset({
        ...template,
        startDate: new Date(template.startDate),
        endDate: template.endDate ? new Date(template.endDate) : null,
      });
    } else {
      setEditingTemplate(null);
      reset();
    }
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setEditingTemplate(null);
    reset();
  };

  const onSubmit = async (data) => {
    try {
      const templateData = {
        ...data,
        startDate: dayjs(data.startDate).format("YYYY-MM-DD"),
        endDate: data.endDate ? dayjs(data.endDate).format("YYYY-MM-DD") : null,
        recurringConfig: generateRecurringConfig(data.recurringType, data),
      };

      if (editingTemplate) {
        await updateTemplate(editingTemplate.id, templateData);
        setSuccessMessage("Template updated successfully!");
      } else {
        await addTemplate(templateData);
        setSuccessMessage("Template created successfully!");
      }

      setShowSuccess(true);
      handleCloseDialog();

      setTimeout(() => setShowSuccess(false), 5000);
    } catch (error) {
      console.error("Error saving template:", error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this template?")) {
      try {
        await deleteTemplate(id);
        setSuccessMessage("Template deleted successfully!");
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 5000);
      } catch (error) {
        console.error("Error deleting template:", error);
      }
    }
  };

  const generateRecurringConfig = (type, data) => {
    switch (type) {
      case "weekly":
        return {
          daysOfWeek: data.daysOfWeek || [dayjs(data.startDate).day()],
        };
      case "monthly":
        return {
          monthlyType: data.monthlyType || "date",
          dayOfMonth: data.dayOfMonth || dayjs(data.startDate).date(),
          dayOfWeek: data.dayOfWeek || dayjs(data.startDate).day(),
          weekOfMonth:
            data.weekOfMonth || Math.ceil(dayjs(data.startDate).date() / 7),
        };
      case "yearly":
        return {
          month: data.month || dayjs(data.startDate).month(),
          dayOfMonth: data.dayOfMonth || dayjs(data.startDate).date(),
        };
      case "custom":
        return {
          intervalDays: data.intervalDays || 7,
        };
      default:
        return {};
    }
  };

  const renderRecurringConfig = () => {
    switch (watchedRecurringType) {
      case "weekly":
        return (
          <FormControl fullWidth margin="normal">
            <InputLabel>Days of Week</InputLabel>
            <Select
              multiple
              value={watch("daysOfWeek") || []}
              onChange={(e) => setValue("daysOfWeek", e.target.value)}
              renderValue={(selected) => (
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                  {selected.map((value) => (
                    <Chip
                      key={value}
                      label={daysOfWeek.find((d) => d.value === value)?.label}
                      size="small"
                    />
                  ))}
                </Box>
              )}
            >
              {daysOfWeek.map((day) => (
                <MenuItem key={day.value} value={day.value}>
                  {day.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        );

      case "monthly":
        return (
          <Box>
            <FormControl fullWidth margin="normal">
              <InputLabel>Monthly Type</InputLabel>
              <Select
                value={watch("monthlyType") || "date"}
                onChange={(e) => setValue("monthlyType", e.target.value)}
              >
                <MenuItem value="date">Same Date Each Month</MenuItem>
                <MenuItem value="weekday">Same Weekday Each Month</MenuItem>
              </Select>
            </FormControl>

            {watch("monthlyType") === "date" && (
              <TextField
                fullWidth
                margin="normal"
                label="Day of Month"
                type="number"
                inputProps={{ min: 1, max: 31 }}
                value={watch("dayOfMonth") || 1}
                onChange={(e) =>
                  setValue("dayOfMonth", parseInt(e.target.value))
                }
              />
            )}

            {watch("monthlyType") === "weekday" && (
              <>
                <FormControl fullWidth margin="normal">
                  <InputLabel>Day of Week</InputLabel>
                  <Select
                    value={watch("dayOfWeek") || 0}
                    onChange={(e) => setValue("dayOfWeek", e.target.value)}
                  >
                    {daysOfWeek.map((day) => (
                      <MenuItem key={day.value} value={day.value}>
                        {day.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                <TextField
                  fullWidth
                  margin="normal"
                  label="Week of Month (1-5)"
                  type="number"
                  inputProps={{ min: 1, max: 5 }}
                  value={watch("weekOfMonth") || 1}
                  onChange={(e) =>
                    setValue("weekOfMonth", parseInt(e.target.value))
                  }
                />
              </>
            )}
          </Box>
        );

      case "yearly":
        return (
          <>
            <TextField
              fullWidth
              margin="normal"
              label="Month (0-11)"
              type="number"
              inputProps={{ min: 0, max: 11 }}
              value={watch("month") || 0}
              onChange={(e) => setValue("month", parseInt(e.target.value))}
              helperText="0 = January, 11 = December"
            />
            <TextField
              fullWidth
              margin="normal"
              label="Day of Month"
              type="number"
              inputProps={{ min: 1, max: 31 }}
              value={watch("dayOfMonth") || 1}
              onChange={(e) => setValue("dayOfMonth", parseInt(e.target.value))}
            />
          </>
        );

      case "custom":
        return (
          <TextField
            fullWidth
            margin="normal"
            label="Interval (Days)"
            type="number"
            inputProps={{ min: 1 }}
            value={watch("intervalDays") || 7}
            onChange={(e) => setValue("intervalDays", parseInt(e.target.value))}
            helperText="Number of days between occurrences"
          />
        );

      default:
        return null;
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom>
        Recurring Events Management
      </Typography>

      {showSuccess && (
        <Alert
          severity="success"
          sx={{ mb: 2 }}
          onClose={() => setShowSuccess(false)}
        >
          {successMessage}
        </Alert>
      )}

      <Tabs
        value={selectedTab}
        onChange={(e, newValue) => setSelectedTab(newValue)}
        sx={{ mb: 3 }}
      >
        <Tab label="Templates" />
        <Tab label="Preview" />
      </Tabs>

      {/* Templates Tab */}
      {selectedTab === 0 && (
        <Paper sx={{ p: 2 }}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 2,
            }}
          >
            <Typography variant="h6">Event Templates</Typography>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => handleOpenDialog()}
            >
              Add Template
            </Button>
          </Box>

          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Title</TableCell>
                  <TableCell>Category</TableCell>
                  <TableCell>Recurring Type</TableCell>
                  <TableCell>Time</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {templates.map((template) => (
                  <TableRow key={template.id}>
                    <TableCell>{template.title}</TableCell>
                    <TableCell>
                      <Chip label={template.category} size="small" />
                    </TableCell>
                    <TableCell>{template.recurringType}</TableCell>
                    <TableCell>
                      {template.startTime}
                      {template.endTime && ` - ${template.endTime}`}
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={template.isActive ? "Active" : "Inactive"}
                        color={template.isActive ? "success" : "default"}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <IconButton onClick={() => handleOpenDialog(template)}>
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        onClick={() => handleDelete(template.id)}
                        color="error"
                      >
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      )}

      {/* Preview Tab */}
      {selectedTab === 1 && (
        <Paper sx={{ p: 2 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 3 }}>
            <Typography variant="h6">Event Preview</Typography>
            <DatePicker
              label="Preview Month"
              value={previewDate}
              onChange={(newDate) => setPreviewDate(newDate)}
              views={["year", "month"]}
            />
          </Box>

          <Grid container spacing={2}>
            {previewEvents.map((event) => (
              <Grid item xs={12} sm={6} md={4} key={event.id}>
                <Paper sx={{ p: 2, border: 1, borderColor: "grey.300" }}>
                  <Typography variant="subtitle1" gutterBottom>
                    {event.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {dayjs(event.date).format("MMMM D, YYYY")}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {event.time}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {event.location}
                  </Typography>
                  <Chip label={event.category} size="small" sx={{ mt: 1 }} />
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Paper>
      )}

      {/* Template Form Dialog */}
      <Dialog
        open={dialogOpen}
        onClose={handleCloseDialog}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          {editingTemplate ? "Edit Template" : "Add New Template"}
        </DialogTitle>
        <DialogContent>
          <Box component="form" sx={{ mt: 1 }}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Controller
                  name="title"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      label="Event Title"
                      error={!!errors.title}
                      helperText={errors.title?.message}
                    />
                  )}
                />
              </Grid>

              <Grid item xs={12}>
                <Controller
                  name="description"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      multiline
                      rows={3}
                      label="Description"
                      error={!!errors.description}
                      helperText={errors.description?.message}
                    />
                  )}
                />
              </Grid>

              <Grid item xs={6}>
                <Controller
                  name="startTime"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      label="Start Time (HH:MM)"
                      placeholder="10:00"
                      error={!!errors.startTime}
                      helperText={errors.startTime?.message}
                    />
                  )}
                />
              </Grid>

              <Grid item xs={6}>
                <Controller
                  name="endTime"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      label="End Time (HH:MM)"
                      placeholder="11:00"
                    />
                  )}
                />
              </Grid>

              <Grid item xs={12}>
                <Controller
                  name="location"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      label="Location"
                      error={!!errors.location}
                      helperText={errors.location?.message}
                    />
                  )}
                />
              </Grid>

              <Grid item xs={6}>
                <Controller
                  name="category"
                  control={control}
                  render={({ field }) => (
                    <FormControl fullWidth>
                      <InputLabel>Category</InputLabel>
                      <Select {...field}>
                        {categories.map((cat) => (
                          <MenuItem key={cat.value} value={cat.value}>
                            {cat.label}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  )}
                />
              </Grid>

              <Grid item xs={6}>
                <Controller
                  name="recurringType"
                  control={control}
                  render={({ field }) => (
                    <FormControl fullWidth>
                      <InputLabel>Recurring Type</InputLabel>
                      <Select {...field}>
                        {recurringTypes.map((type) => (
                          <MenuItem key={type.value} value={type.value}>
                            {type.label}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  )}
                />
              </Grid>

              <Grid item xs={12}>
                {renderRecurringConfig()}
              </Grid>

              <Grid item xs={6}>
                <Controller
                  name="startDate"
                  control={control}
                  render={({ field }) => (
                    <DatePicker
                      label="Start Date"
                      value={field.value}
                      onChange={field.onChange}
                      slotProps={{
                        textField: {
                          fullWidth: true,
                          error: !!errors.startDate,
                          helperText: errors.startDate?.message,
                        },
                      }}
                    />
                  )}
                />
              </Grid>

              <Grid item xs={6}>
                <Controller
                  name="endDate"
                  control={control}
                  render={({ field }) => (
                    <DatePicker
                      label="End Date (Optional)"
                      value={field.value}
                      onChange={field.onChange}
                      slotProps={{
                        textField: {
                          fullWidth: true,
                        },
                      }}
                    />
                  )}
                />
              </Grid>

              <Grid item xs={12}>
                <Controller
                  name="isActive"
                  control={control}
                  render={({ field }) => (
                    <FormControlLabel
                      control={<Checkbox {...field} checked={field.value} />}
                      label="Active Template"
                    />
                  )}
                />
              </Grid>
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleSubmit(onSubmit)} variant="contained">
            {editingTemplate ? "Update" : "Create"}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default RecurringEventsAdmin;
