import {
  useCreateEvent,
  useEventList,
  useCancelEvent,
  useEventDetail,
  useEventTeachers,
} from "@hooks/useEvent";
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Paper,
  Snackbar,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TextField,
  Typography,
  Grid,
  Stack,
  Checkbox,
  IconButton,
} from "@mui/material";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import dayjs from "dayjs";
import CloseIcon from "@mui/icons-material/Close";
import {
  uploadImageToCloudinary,
  deleteImageFromCloudinary,
  getPublicIdFromUrl,
  validateImage,
} from "@utils/cloudinary";
import { useTeacherList } from "@hooks/useTeacher";
import EventNoteIcon from "@mui/icons-material/EventNote";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import EditIcon from "@mui/icons-material/Edit";
import VisibilityIcon from "@mui/icons-material/Visibility";
import GroupIcon from "@mui/icons-material/Group";
import { styled } from "@mui/material/styles";

// Custom Timeline Step Component
const TimelineStep = styled("div")(({ theme, active, completed }) => ({
  display: "flex",
  alignItems: "flex-start",
  marginBottom: theme.spacing(4),
  position: "relative",
  "&:last-child": {
    marginBottom: 0,
  },
}));

const TimelineCircleContainer = styled("div")(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  marginRight: theme.spacing(3),
  position: "relative",
  zIndex: 2,
}));

const TimelineCircle = styled("div")(({ theme, active, completed }) => ({
  width: 48,
  height: 48,
  borderRadius: "50%",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  backgroundColor: active ? "#1976d2" : completed ? "#009688" : "#e3f2fd",
  border: active ? "3px solid #1976d2" : completed ? "3px solid #009688" : "3px solid #e3f2fd",
  boxShadow: active 
    ? "0 4px 16px rgba(25,118,210,0.18)" 
    : completed 
    ? "0 4px 16px rgba(0,150,136,0.18)" 
    : "0 2px 8px rgba(25,118,210,0.08)",
  transition: "all 0.3s ease",
  color: active || completed ? "#fff" : "#90caf9",
  fontWeight: 900,
  fontSize: "1.25rem",
  "&:hover": {
    transform: "scale(1.1)",
  },
}));

const TimelineLine = styled("div")(({ theme, active, completed }) => ({
  width: 4,
  height: 60,
  backgroundColor: active ? "#1976d2" : completed ? "#009688" : "#e3f2fd",
  borderRadius: 2,
  marginTop: theme.spacing(1),
  transition: "background-color 0.3s ease",
}));

const TimelineContent = styled("div")(({ theme, active, completed }) => ({
  flex: 1,
  padding: theme.spacing(2),
  backgroundColor: active ? "#e3f2fd" : completed ? "#e8f5e8" : "#f8f9fa",
  borderRadius: theme.spacing(2),
  border: active ? "2px solid #1976d2" : completed ? "2px solid #009688" : "2px solid #e0e0e0",
  transition: "all 0.3s ease",
  "&:hover": {
    transform: "translateY(-2px)",
    boxShadow: "0 4px 16px rgba(0,0,0,0.1)",
  },
}));

const StepNumber = styled("div")(({ theme, active, completed }) => ({
  fontSize: "0.875rem",
  fontWeight: 700,
  color: active ? "#1976d2" : completed ? "#009688" : "#666",
  marginBottom: theme.spacing(0.5),
  textTransform: "uppercase",
  letterSpacing: "0.5px",
}));

const StepTitle = styled("div")(({ theme, active, completed }) => ({
  fontSize: "1.125rem",
  fontWeight: 700,
  color: active ? "#1976d2" : completed ? "#009688" : "#333",
  marginBottom: theme.spacing(0.5),
}));

const StepDescription = styled("div")(({ theme, active, completed }) => ({
  fontSize: "0.875rem",
  color: active ? "#1976d2" : completed ? "#009688" : "#666",
  fontWeight: 500,
}));

// Custom Timeline Step Component
const CustomTimelineStep = ({ step, index, active, completed, icon }) => {
  return (
    <TimelineStep active={active} completed={completed}>
      <TimelineCircleContainer>
        <TimelineCircle active={active} completed={completed}>
          {completed ? (
            <span style={{ fontSize: 24, fontWeight: 900 }}>✓</span>
          ) : (
            icon
          )}
        </TimelineCircle>
        {index < 1 && (
          <TimelineLine active={active} completed={completed} />
        )}
      </TimelineCircleContainer>
      
      <TimelineContent active={active} completed={completed}>
        <StepNumber active={active} completed={completed}>
          Step {index + 1}
        </StepNumber>
        <StepTitle active={active} completed={completed}>
          {step.title}
        </StepTitle>
        <StepDescription active={active} completed={completed}>
          {step.description}
        </StepDescription>
      </TimelineContent>
    </TimelineStep>
  );
};

const EventManage = () => {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [viewDetailId, setViewDetailId] = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState({
    name: "",
    startTime: null,
    endTime: null,
    location: "",
    description: "",
    registrationDeadline: null,
    attachmentImg: "",
    hostName: "",
    emails: [],
  });
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const [selectedTeacher, setSelectedTeacher] = useState(null);
  const [hoveredEventId, setHoveredEventId] = useState(null);
  const [cancelReason, setCancelReason] = useState("");

  // TanStack Query hooks
  const { data: eventResponse, isLoading, isError, error } = useEventList();
  const createEventMutation = useCreateEvent();
  const cancelEventMutation = useCancelEvent();
  const { data: detailData, isLoading: isLoadingDetail } =
    useEventDetail(viewDetailId);
  const { data: hoveredDetailData, isLoading: isLoadingHoveredDetail } =
    useEventDetail(hoveredEventId);
  const { data: eventTeachers, isLoading: isLoadingEventTeachers } =
    useEventTeachers(viewDetailId);

  // Get teacher list for email selection
  const { data: teacherResponse, isLoading: isLoadingTeachers } =
    useTeacherList();
  const teacherList = teacherResponse?.data?.data || [];
  const teacherEmails = teacherList.map((teacher) => teacher.email);

  const eventList = eventResponse?.data?.data || [];
  const totalItems = eventList.length || 0;

  const showModal = (record = null) => {
    if (record) {
      setFormData({
        name: record.name ?? "",
        startTime: record.startTime
          ? dayjs(record.startTime).toISOString
          : null,
        endTime: record.endTime ? dayjs(record.endTime).toISOString : null,
        location: record.location ?? "",
        description: record.description ?? "",
        registrationDeadline: record.registrationDeadline
          ? dayjs(record.registrationDeadline).toISOString
          : null,
        attachmentImg: record.attachmentImg ?? "",
        hostName: record.hostName ?? "",
        emails: record.emails ?? [],
      });
      setEditingId(record.id);
      setSelectedTeacher(record.teacherEmail);
    } else {
      setFormData({
        name: "",
        startTime: null,
        endTime: null,
        location: "",
        description: "",
        registrationDeadline: null,
        attachmentImg: "",
        hostName: "",
        emails: [],
      });
      setEditingId(null);
      setSelectedTeacher(null);
    }
    setIsModalOpen(true);
  };

  const handleClose = () => {
    setIsModalOpen(false);
    setEditingId(null);
    setSelectedTeacher(null);
    setActiveStep(0);
    setFormData({
      name: "",
      startTime: null,
      endTime: null,
      location: "",
      description: "",
      registrationDeadline: null,
      attachmentImg: "",
      hostName: "",
      emails: [],
    });
    setCancelReason("");
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleDateChange = (name, value) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleNext = () => {
    // Validate basic fields in step 1
    const name = formData.name.trim();
    const startTime = formData.startTime;
    const endTime = formData.endTime;
    const location = formData.location.trim();
    const description = formData.description.trim();
    const registrationDeadline = formData.registrationDeadline;
    const hostName = formData.hostName.trim();

    if (!name) {
      setSnackbar({
        open: true,
        message: "Event name is required",
        severity: "error",
      });
      return;
    }

    if (!startTime) {
      setSnackbar({
        open: true,
        message: "Start time is required",
        severity: "error",
      });
      return;
    }

    if (!endTime) {
      setSnackbar({
        open: true,
        message: "End time is required",
        severity: "error",
      });
      return;
    }

    if (!location) {
      setSnackbar({
        open: true,
        message: "Location is required",
        severity: "error",
      });
      return;
    }

    if (!description) {
      setSnackbar({
        open: true,
        message: "Description is required",
        severity: "error",
      });
      return;
    }

    if (!registrationDeadline) {
      setSnackbar({
        open: true,
        message: "Registration deadline is required",
        severity: "error",
      });
      return;
    }

    if (!hostName) {
      setSnackbar({
        open: true,
        message: "Host name is required",
        severity: "error",
      });
      return;
    }

    setActiveStep((prevStep) => prevStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const processedData = {
        name: formData.name.trim(),
        startTime: formData.startTime ? formData.startTime.toISOString() : "",
        endTime: formData.endTime ? formData.endTime.toISOString() : "",
        location: formData.location.trim(),
        description: formData.description.trim(),
        registrationDeadline: formData.registrationDeadline
          ? formData.registrationDeadline.toISOString()
          : "",
        attachmentImg: formData.attachmentImg.trim(),
        hostName: formData.hostName.trim(),
        emails: Array.from(new Set(formData.emails)),
      };

      if (editingId) {
        if (!cancelReason.trim()) {
          setSnackbar({
            open: true,
            message: "Please provide a reason for cancellation.",
            severity: "error",
          });
          return;
        }
        await cancelEventMutation.mutateAsync({
          id: editingId,
          reason: cancelReason,
        });
        setSnackbar({
          open: true,
          message: "Event cancelled successfully",
          severity: "success",
        });
      } else {
        await createEventMutation.mutateAsync(processedData);
        setSnackbar({
          open: true,
          message: "Event created successfully!",
          severity: "success",
        });
      }
      handleClose();
    } catch (error) {
//       console.error("Operation error:", error);
      setSnackbar({
        open: true,
        message:
          error?.response?.data?.message ||
          error.message ||
          "An error occurred",
        severity: "error",
      });
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleCloseSnackbar = (event, reason) => {
    if (reason === "clickaway") return;
    setSnackbar({ ...snackbar, open: false });
  };

  const handleViewDetail = (id) => {
    setViewDetailId(id);
    setIsDetailModalOpen(true);
  };

  const handleCloseDetail = () => {
    setIsDetailModalOpen(false);
    setViewDetailId(null);
  };

  const handleImageUpload = async (file) => {
    try {
      // Validate the image file
      validateImage(file);

      // Show loading state
      setSnackbar({
        open: true,
        message: "Uploading image...",
        severity: "info",
      });

      // Upload the new image
      const imageUrl = await uploadImageToCloudinary(file);

      // Update form data with the new image URL
      setFormData((prev) => ({
        ...prev,
        attachmentImg: imageUrl,
      }));

      // Show success message
      setSnackbar({
        open: true,
        message: "Image uploaded successfully",
        severity: "success",
      });
    } catch (error) {
//       console.error("Error handling image upload:", error);
      setSnackbar({
        open: true,
        message: error.message || "Failed to upload image. Please try again.",
        severity: "error",
      });
    }
  };

  const handleImageDelete = () => {
    setFormData((prev) => ({
      ...prev,
      attachmentImg: "",
    }));

    setSnackbar({
      open: true,
      message: "Image removed",
      severity: "success",
    });
  };

  // Hàm helper để render badge status
  const renderStatusBadge = (status) => {
    let label = "-";
    let color = "#bdbdbd";
    let borderColor = "#e0e0e0";
    if (status === "EVENT_REGISTRATION_ACTIVE") {
      label = "Open";
      color = "#2e7d32";
      borderColor = "#2e7d32";
    } else if (status === "EVENT_CANCELLED") {
      label = "Cancel";
      color = "#d32f2f";
      borderColor = "#d32f2f";
    } else if (status === "EVENT_REGISTRATION_CLOSED") {
      label = "Close";
      color = "#1976d2";
      borderColor = "#1976d2";
    }
    return (
      <Box
        component="span"
        sx={{
          display: "inline-block",
          px: 2,
          py: 0.5,
          borderRadius: 2,
          border: `1.5px solid ${borderColor}`,
          color,
          fontWeight: 600,
          fontSize: "0.95rem",
          background: "#fff",
          minWidth: 70,
          textAlign: "center",
        }}
      >
        {label}
      </Box>
    );
  };

  if (isError) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error">
          {error?.response?.status === 403
            ? "You do not have permission to access this resource. Please log in with appropriate permissions."
            : `Error loading event data: ${
                error?.message || "Please try again later."
              }`}
        </Alert>
      </Box>
    );
  }

  const displayedData =
    eventList?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage) ||
    [];

  return (
    <Box sx={{ p: 3 }}>
      <Box
        sx={{
          mb: 3,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          borderBottom: "2px solid #e3f2fd",
          pb: 2,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <EventNoteIcon sx={{ color: "#1976d2", fontSize: 38 }} />
          <Box>
            <Typography
              variant="h4"
              component="h1"
              sx={{
                color: "#1976d2",
                fontWeight: "bold",
                mb: 1,
              }}
            >
              Event Management
            </Typography>
            <Typography
              variant="subtitle1"
              sx={{
                color: "#666",
                fontWeight: "medium",
              }}
            >
              Total Events: {totalItems}
            </Typography>
          </Box>
        </Box>
        <Button
          variant="contained"
          sx={{
            background: "linear-gradient(90deg, #1976d2 60%, #42a5f5 100%)",
            color: "#fff",
            fontWeight: 700,
            borderRadius: 2,
            boxShadow: "0 2px 8px rgba(25,118,210,0.12)",
            px: 3,
            py: 1.2,
            fontSize: "1.08rem",
            "&:hover": {
              background: "linear-gradient(90deg, #1565c0 60%, #42a5f5 100%)",
              boxShadow: "0 4px 16px rgba(25,118,210,0.18)",
            },
            gap: 1.2,
          }}
          color="primary"
          onClick={() => showModal()}
          startIcon={<AddCircleOutlineIcon />}
        >
          CREATE NEW EVENT
        </Button>
      </Box>

      {isLoading ? (
        <Box sx={{ display: "flex", justifyContent: "center", p: 3 }}>
          <CircularProgress />
        </Box>
      ) : (
        <TableContainer
          component={Paper}
          elevation={0}
          sx={{
            borderRadius: 3,
            overflow: "hidden",
            border: "1.5px solid #e3f2fd",
            boxShadow: "0 4px 24px rgba(25,118,210,0.08)",
            "& .MuiTableCell-root": {
              borderColor: "#e0e0e0",
              py: 2.5,
              px: 3,
            },
            "& .MuiTableRow-root": {
              "&:last-child td, &:last-child th": {
                borderBottom: 0,
              },
            },
          }}
        >
          <Table>
            <TableHead>
              <TableRow
                sx={{
                  background: "linear-gradient(90deg, #e3f2fd 60%, #fff 100%)",
                }}
              >
                <TableCell
                  align="center"
                  sx={{
                    color: "#1976d2",
                    fontWeight: "bold",
                    fontSize: "1.08rem",
                    py: 2.5,
                  }}
                >
                  Name
                </TableCell>
                <TableCell
                  align="center"
                  sx={{
                    color: "#1976d2",
                    fontWeight: "bold",
                    fontSize: "1.08rem",
                    py: 2.5,
                  }}
                >
                  Start Time
                </TableCell>
                <TableCell
                  align="center"
                  sx={{
                    color: "#1976d2",
                    fontWeight: "bold",
                    fontSize: "1.08rem",
                    py: 2.5,
                  }}
                >
                  End Time
                </TableCell>
                <TableCell
                  align="center"
                  sx={{
                    color: "#1976d2",
                    fontWeight: "bold",
                    fontSize: "1.08rem",
                    py: 2.5,
                  }}
                >
                  Location
                </TableCell>
                <TableCell
                  align="center"
                  sx={{
                    color: "#1976d2",
                    fontWeight: "bold",
                    fontSize: "1.08rem",
                    py: 2.5,
                  }}
                >
                  Host Name
                </TableCell>
                <TableCell
                  align="center"
                  sx={{
                    color: "#1976d2",
                    fontWeight: "bold",
                    fontSize: "1.08rem",
                    py: 2.5,
                  }}
                >
                  Status
                </TableCell>
                <TableCell
                  align="center"
                  sx={{
                    color: "#1976d2",
                    fontWeight: "bold",
                    fontSize: "1.08rem",
                    py: 2.5,
                  }}
                >
                  Actions
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {displayedData.map((row) => (
                <TableRow
                  key={row.id}
                  sx={{
                    transition: "background 0.2s",
                    "&:hover": { backgroundColor: "#f1f8fd" },
                    "&:last-child td, &:last-child th": { borderBottom: 0 },
                  }}
                >
                  <TableCell align="center" sx={{ fontWeight: 600 }}>
                    {row.name || "-"}
                  </TableCell>
                  <TableCell align="center">{row.startTime || "-"}</TableCell>
                  <TableCell align="center">{row.endTime || "-"}</TableCell>
                  <TableCell align="center">{row.location || "-"}</TableCell>
                  <TableCell align="center">{row.hostName || "-"}</TableCell>
                  <TableCell align="center">
                    {renderStatusBadge(row.status)}
                  </TableCell>
                  <TableCell align="center">
                    <Box
                      sx={{
                        display: "flex",
                        gap: 1.5,
                        justifyContent: "center",
                      }}
                    >
                      <Button
                        variant="contained"
                        sx={{
                          backgroundColor: "#42a5f5",
                          color: "#fff",
                          minWidth: 44,
                          borderRadius: 2,
                          boxShadow: "0 2px 8px rgba(66,165,245,0.10)",
                          "&:hover": { backgroundColor: "#1976d2" },
                          fontWeight: 600,
                          p: 1.2,
                        }}
                        onClick={() => handleViewDetail(row.id)}
                        size="small"
                        startIcon={<VisibilityIcon />}
                      >
                        View
                      </Button>
                      <Button
                        variant="contained"
                        sx={{
                          backgroundColor: "#ef5350",
                          color: "#fff",
                          minWidth: 44,
                          borderRadius: 2,
                          boxShadow: "0 2px 8px rgba(239,83,80,0.10)",
                          "&:hover": { backgroundColor: "#b71c1c" },
                          fontWeight: 600,
                          p: 1.2,
                        }}
                        onClick={() => showModal(row)}
                        size="small"
                        startIcon={<EditIcon />}
                      >
                        Cancel
                      </Button>
                      <Button
                        variant="contained"
                        sx={{
                          backgroundColor: "#16a34a",
                          color: "#fff",
                          minWidth: 44,
                          borderRadius: 2,
                          boxShadow: "0 2px 8px rgba(34,197,94,0.10)",
                          "&:hover": { backgroundColor: "#15803d" },
                          fontWeight: 600,
                          p: 1.2,
                        }}
                        onClick={() => navigate(`/user/education/event/students/${row.id}`)}
                        size="small"
                        startIcon={<GroupIcon />}
                      >
                        View Students
                      </Button>
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={totalItems}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            sx={{
              borderTop: "1.5px solid #e3f2fd",
              background: "#f8fafc",
              ".MuiTablePagination-toolbar": { fontWeight: 600 },
              ".MuiTablePagination-selectLabel, .MuiTablePagination-displayedRows":
                { color: "#1976d2" },
            }}
          />
        </TableContainer>
      )}

      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <Dialog
          open={isModalOpen}
          onClose={handleClose}
          maxWidth={editingId ? "sm" : "sm"}
          fullWidth
          PaperProps={{
            sx: {
              minHeight: editingId ? "auto" : "70vh",
              display: "flex",
              flexDirection: "column",
              borderRadius: 4,
              boxShadow: "0 8px 32px rgba(25,118,210,0.18)",
              border: "2px solid #e3f2fd",
              background: "linear-gradient(120deg, #f8fafc 60%, #e3f2fd 100%)",
            },
          }}
        >
          {editingId ? (
            // Cancel Event Confirmation
            <form onSubmit={handleSubmit}>
              <DialogTitle
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1.5,
                  fontWeight: 800,
                  color: "#d32f2f",
                  fontSize: "1.5rem",
                  background: "linear-gradient(90deg, #ffebee 60%, #fff 100%)",
                  borderBottom: "2px solid #ffcdd2",
                  py: 2.5,
                  px: 3,
                }}
              >
                <EditIcon sx={{ color: "#d32f2f", fontSize: 28 }} />
                Cancel Event
              </DialogTitle>
              <DialogContent sx={{ px: 4, py: 3 }}>
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 2.5,
                    pt: 2,
                  }}
                >
                  <Typography variant="h6" color="error" sx={{ mb: 2 }}>
                    Are you sure you want to cancel this event?
                  </Typography>
                  <Typography variant="body1">
                    This action cannot be undone. The event will be marked as
                    cancelled and participants will be notified.
                  </Typography>
                  <TextField
                    label="Reason for cancellation"
                    value={cancelReason}
                    onChange={(e) => setCancelReason(e.target.value)}
                    required
                    fullWidth
                    multiline
                    rows={3}
                    sx={{ mt: 2 }}
                  />
                </Box>
              </DialogContent>
              <DialogActions
                sx={{
                  borderTop: "2px solid #e3f2fd",
                  backgroundColor: "#f8f9fa",
                  p: 2,
                  justifyContent: "center",
                }}
              >
                <Button onClick={handleClose}>Close</Button>
                <Button
                  type="submit"
                  variant="contained"
                  sx={{
                    minWidth: 120,
                    backgroundColor: "#d32f2f",
                    "&:hover": {
                      backgroundColor: "#b71c1c",
                    },
                  }}
                  disabled={cancelEventMutation.isPending}
                >
                  {cancelEventMutation.isPending ? (
                    <CircularProgress size={24} />
                  ) : (
                    "Cancel Event"
                  )}
                </Button>
              </DialogActions>
            </form>
          ) : (
            // Create Form with Timeline
            <Box sx={{ width: "100%" }}>
              <DialogTitle
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1.5,
                  fontWeight: 800,
                  color: "#1976d2",
                  fontSize: "1.5rem",
                  background: "linear-gradient(90deg, #e3f2fd 60%, #fff 100%)",
                  borderBottom: "2px solid #e3f2fd",
                  py: 2.5,
                  px: 3,
                }}
              >
                <AddCircleOutlineIcon sx={{ color: "#1976d2", fontSize: 28 }} />
                Create New Event
              </DialogTitle>
              <DialogContent sx={{ px: 4, py: 3 }}>
                <Box sx={{ width: "100%", mt: 2 }}>
                  {/* Timeline Header */}
                  <Box
                    sx={{
                      textAlign: "center",
                      mb: 4,
                      p: 3,
                      background: "linear-gradient(90deg, #e3f2fd 60%, #fff 100%)",
                      borderRadius: 3,
                      border: "2px solid #e3f2fd",
                    }}
                  >
                    <Typography
                      variant="h5"
                      sx={{
                        color: "#1976d2",
                        fontWeight: 700,
                        mb: 1,
                        fontFamily: "inherit",
                      }}
                    >
                      Event Creation Process
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{
                        color: "#666",
                        fontWeight: 500,
                        fontFamily: "inherit",
                      }}
                    >
                      Follow the steps below to create a new event
                    </Typography>
                  </Box>

                  {/* Timeline Steps */}
                  <Box sx={{ mb: 4 }}>
                    <CustomTimelineStep
                      step={{
                        title: "Basic Information",
                        description: "Enter event name, time, location, and description"
                      }}
                      index={0}
                      active={activeStep === 0}
                      completed={activeStep > 0}
                      icon={<EventNoteIcon sx={{ fontSize: 24 }} />}
                    />
                    <CustomTimelineStep
                      step={{
                        title: "Teacher Assignment",
                        description: "Select teachers to participate in the event"
                      }}
                      index={1}
                      active={activeStep === 1}
                      completed={activeStep > 1}
                      icon={<AddCircleOutlineIcon sx={{ fontSize: 24 }} />}
                    />
                  </Box>

                  <Box sx={{ mt: 4 }}>
                    {activeStep === 0 ? (
                      // Step 1 content
                      <Stack spacing={3}>
                        <TextField
                          name="name"
                          label="Event Name"
                          value={formData.name}
                          onChange={handleInputChange}
                          required
                          fullWidth
                        />

                        <DateTimePicker
                          label="Start Time"
                          value={
                            formData.startTime
                              ? dayjs(formData.startTime)
                              : null
                          }
                          onChange={(newValue) =>
                            handleDateChange("startTime", newValue)
                          }
                          slotProps={{
                            textField: {
                              required: true,
                              fullWidth: true,
                            },
                          }}
                        />

                        <DateTimePicker
                          label="End Time"
                          value={
                            formData.endTime ? dayjs(formData.endTime) : null
                          }
                          onChange={(newValue) =>
                            handleDateChange("endTime", newValue)
                          }
                          slotProps={{
                            textField: {
                              required: true,
                              fullWidth: true,
                            },
                          }}
                        />

                        <TextField
                          name="location"
                          label="Location"
                          value={formData.location}
                          onChange={handleInputChange}
                          required
                          fullWidth
                        />

                        <TextField
                          name="description"
                          label="Description"
                          value={formData.description}
                          onChange={handleInputChange}
                          required
                          fullWidth
                          multiline
                          rows={4}
                        />

                        <DateTimePicker
                          label="Registration Deadline"
                          value={
                            formData.registrationDeadline
                              ? dayjs(formData.registrationDeadline)
                              : null
                          }
                          onChange={(newValue) =>
                            handleDateChange("registrationDeadline", newValue)
                          }
                          slotProps={{
                            textField: {
                              required: true,
                              fullWidth: true,
                            },
                          }}
                        />

                        <TextField
                          name="hostName"
                          label="Host Name"
                          value={formData.hostName}
                          onChange={handleInputChange}
                          required
                          fullWidth
                        />

                        {/* Image Upload Section */}
                        <Box>
                          <Typography
                            variant="subtitle1"
                            sx={{
                              color: "#1976d2",
                              fontWeight: 600,
                              mb: 2,
                            }}
                          >
                            Event Image
                          </Typography>
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 2,
                            }}
                          >
                            <Button
                              variant="outlined"
                              component="label"
                              sx={{
                                borderColor: "#1976d2",
                                color: "#1976d2",
                                "&:hover": {
                                  borderColor: "#1565c0",
                                  backgroundColor: "#f8f9fa",
                                },
                              }}
                            >
                              Upload Image
                              <input
                                type="file"
                                hidden
                                accept="image/jpeg,image/png,image/gif,image/webp"
                                onChange={(e) => {
                                  const file = e.target.files[0];
                                  if (file) {
                                    handleImageUpload(file);
                                  }
                                }}
                              />
                            </Button>
                            {formData.attachmentImg && (
                              <Box
                                sx={{
                                  position: "relative",
                                  width: 100,
                                  height: 100,
                                  borderRadius: 1,
                                  overflow: "hidden",
                                  border: "1px solid #e0e0e0",
                                }}
                              >
                                <img
                                  src={formData.attachmentImg}
                                  alt="Event preview"
                                  style={{
                                    width: "100%",
                                    height: "100%",
                                    objectFit: "cover",
                                  }}
                                />
                                <IconButton
                                  size="small"
                                  sx={{
                                    position: "absolute",
                                    top: 4,
                                    right: 4,
                                    backgroundColor: "rgba(255,255,255,0.8)",
                                    "&:hover": {
                                      backgroundColor: "rgba(255,255,255,0.9)",
                                    },
                                  }}
                                  onClick={handleImageDelete}
                                >
                                  <CloseIcon fontSize="small" />
                                </IconButton>
                              </Box>
                            )}
                          </Box>
                        </Box>
                      </Stack>
                    ) : (
                      // Step 2 content - Teacher Emails only
                      <Box>
                        <Typography
                          variant="h6"
                          sx={{
                            color: "#1976d2",
                            fontWeight: 600,
                            mb: 3,
                          }}
                        >
                          Select Teachers
                        </Typography>
                        <Paper
                          elevation={0}
                          sx={{
                            border: "1px solid #e0e0e0",
                            borderRadius: 2,
                            overflow: "hidden",
                          }}
                        >
                          <TableContainer>
                            <Table>
                              <TableHead>
                                <TableRow sx={{ backgroundColor: "#f8f9fa" }}>
                                  <TableCell padding="checkbox">
                                    <Checkbox
                                      checked={formData.emails.length > 0}
                                      indeterminate={
                                        formData.emails.length > 0 &&
                                        formData.emails.length <
                                          teacherEmails.length
                                      }
                                      onChange={(e) => {
                                        if (e.target.checked) {
                                          setFormData((prev) => ({
                                            ...prev,
                                            emails: Array.from(
                                              new Set(teacherEmails)
                                            ),
                                          }));
                                        } else {
                                          setFormData((prev) => ({
                                            ...prev,
                                            emails: [],
                                          }));
                                        }
                                      }}
                                    />
                                  </TableCell>
                                  <TableCell>Email</TableCell>
                                  <TableCell>Name</TableCell>
                                  <TableCell>Department</TableCell>
                                </TableRow>
                              </TableHead>
                              <TableBody>
                                {teacherList.map((teacher, index) => (
                                  <TableRow
                                    key={index}
                                    hover
                                    sx={{
                                      "&:last-child td, &:last-child th": {
                                        border: 0,
                                      },
                                      cursor: "pointer",
                                      "&:hover": {
                                        backgroundColor: "#f5f5f5",
                                      },
                                    }}
                                    onClick={() => {
                                      const isSelected =
                                        formData.emails.includes(teacher.email);
                                      setFormData((prev) => ({
                                        ...prev,
                                        emails: isSelected
                                          ? prev.emails.filter(
                                              (e) => e !== teacher.email
                                            )
                                          : Array.from(
                                              new Set([
                                                ...prev.emails,
                                                teacher.email,
                                              ])
                                            ),
                                      }));
                                    }}
                                  >
                                    <TableCell padding="checkbox">
                                      <Checkbox
                                        checked={formData.emails.includes(
                                          teacher.email
                                        )}
                                        onChange={(e) => {
                                          if (e.target.checked) {
                                            setFormData((prev) => ({
                                              ...prev,
                                              emails: Array.from(
                                                new Set([
                                                  ...prev.emails,
                                                  teacher.email,
                                                ])
                                              ),
                                            }));
                                          } else {
                                            setFormData((prev) => ({
                                              ...prev,
                                              emails: prev.emails.filter(
                                                (e) => e !== teacher.email
                                              ),
                                            }));
                                          }
                                        }}
                                      />
                                    </TableCell>
                                    <TableCell>{teacher.email}</TableCell>
                                    <TableCell>{teacher.name}</TableCell>
                                    <TableCell>{teacher.department}</TableCell>
                                  </TableRow>
                                ))}
                              </TableBody>
                            </Table>
                          </TableContainer>
                        </Paper>
                      </Box>
                    )}
                  </Box>
                </Box>
              </DialogContent>
              <DialogActions
                sx={{
                  borderTop: "2px solid #e3f2fd",
                  backgroundColor: "#f8f9fa",
                  p: 2,
                  justifyContent: "center",
                }}
              >
                <Button onClick={handleClose}>Cancel</Button>
                {activeStep > 0 && <Button onClick={handleBack}>Back</Button>}
                {activeStep === 0 ? (
                  <Button
                    onClick={handleNext}
                    variant="contained"
                    sx={{
                      minWidth: 120,
                      backgroundColor: "#1976d2",
                      "&:hover": {
                        backgroundColor: "#1565c0",
                      },
                    }}
                  >
                    Next
                  </Button>
                ) : (
                  <Button
                    onClick={handleSubmit}
                    variant="contained"
                    sx={{
                      minWidth: 120,
                      backgroundColor: "#1976d2",
                      "&:hover": {
                        backgroundColor: "#1565c0",
                      },
                    }}
                    disabled={createEventMutation.isPending}
                  >
                    {createEventMutation.isPending ? (
                      <CircularProgress size={24} />
                    ) : (
                      "Create"
                    )}
                  </Button>
                )}
              </DialogActions>
            </Box>
          )}
        </Dialog>
      </LocalizationProvider>

      <Dialog
        open={isDetailModalOpen}
        onClose={handleCloseDetail}
        maxWidth="md"
        fullWidth
        sx={{
          "& .MuiDialog-paper": {
            borderRadius: 2,
            background: "linear-gradient(to bottom, #ffffff, #f8f9fa)",
          },
        }}
      >
        <DialogTitle
          sx={{
            textAlign: "center",
            borderBottom: "2px solid #e3f2fd",
            backgroundColor: "#bbdefb",
            color: "#1976d2",
            fontWeight: "bold",
            py: 2,
          }}
        >
          Event Details
        </DialogTitle>
        <DialogContent>
          {isLoadingDetail ? (
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                minHeight: "300px",
              }}
            >
              <CircularProgress size={40} />
            </Box>
          ) : detailData?.data?.data ? (
            <Box sx={{ p: 3 }}>
              <TableContainer
                component={Paper}
                elevation={0}
                sx={{
                  borderRadius: 2,
                  overflow: "hidden",
                  mb: 3,
                  border: "1px solid #e0e0e0",
                  "& .MuiTableCell-root": {
                    borderColor: "#e0e0e0",
                    py: 2.5,
                    px: 3,
                  },
                }}
              >
                <Table>
                  <TableBody>
                    <TableRow>
                      <TableCell
                        sx={{
                          width: "30%",
                          bgcolor: "#f8f9fa",
                          fontWeight: 600,
                          color: "#1976d2",
                        }}
                      >
                        Event Name
                      </TableCell>
                      <TableCell>{detailData.data.data.name}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell
                        sx={{
                          bgcolor: "#f8f9fa",
                          fontWeight: 600,
                          color: "#1976d2",
                        }}
                      >
                        Start Time
                      </TableCell>
                      <TableCell>{detailData.data.data.startTime}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell
                        sx={{
                          bgcolor: "#f8f9fa",
                          fontWeight: 600,
                          color: "#1976d2",
                        }}
                      >
                        End Time
                      </TableCell>
                      <TableCell>{detailData.data.data.endTime}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell
                        sx={{
                          bgcolor: "#f8f9fa",
                          fontWeight: 600,
                          color: "#1976d2",
                        }}
                      >
                        Location
                      </TableCell>
                      <TableCell>{detailData.data.data.location}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell
                        sx={{
                          bgcolor: "#f8f9fa",
                          fontWeight: 600,
                          color: "#1976d2",
                        }}
                      >
                        Description
                      </TableCell>
                      <TableCell sx={{ whiteSpace: "pre-wrap" }}>
                        {detailData.data.data.description}
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell
                        sx={{
                          bgcolor: "#f8f9fa",
                          fontWeight: 600,
                          color: "#1976d2",
                        }}
                      >
                        Registration Deadline
                      </TableCell>
                      <TableCell>
                        {detailData.data.data.registrationDeadline}
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell
                        sx={{
                          bgcolor: "#f8f9fa",
                          fontWeight: 600,
                          color: "#1976d2",
                        }}
                      >
                        Host Name
                      </TableCell>
                      <TableCell>{detailData.data.data.hostName}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell
                        sx={{
                          bgcolor: "#f8f9fa",
                          fontWeight: 600,
                          color: "#1976d2",
                        }}
                      >
                        Status
                      </TableCell>
                      <TableCell>
                        {renderStatusBadge(detailData.data.data.status)}
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>

              {detailData.data.data.attachmentImg && (
                <Box sx={{ mt: 4 }}>
                  <Typography
                    variant="h6"
                    sx={{
                      color: "#1976d2",
                      fontWeight: 600,
                      mb: 2,
                      pb: 2,
                      borderBottom: "2px solid #e3f2fd",
                    }}
                  >
                    Event Image
                  </Typography>
                  <Paper
                    elevation={0}
                    sx={{
                      p: 2,
                      border: "1px solid #e0e0e0",
                      borderRadius: 2,
                      textAlign: "center",
                    }}
                  >
                    <img
                      src={detailData.data.data.attachmentImg}
                      alt="Event"
                      style={{
                        maxWidth: "100%",
                        maxHeight: "300px",
                        borderRadius: "8px",
                        objectFit: "contain",
                      }}
                    />
                  </Paper>
                </Box>
              )}

              {((Array.isArray(eventTeachers?.data) &&
                eventTeachers.data.length > 0) ||
                (Array.isArray(eventTeachers) && eventTeachers.length > 0)) && (
                <Box sx={{ mt: 4 }}>
                  <Typography
                    variant="h6"
                    sx={{
                      color: "#1976d2",
                      fontWeight: 600,
                      mb: 2,
                      pb: 2,
                      borderBottom: "2px solid #e3f2fd",
                    }}
                  >
                    Assigned Teachers
                  </Typography>
                  {isLoadingEventTeachers ? (
                    <CircularProgress />
                  ) : (
                    <Paper
                      elevation={0}
                      sx={{
                        border: "1px solid #e0e0e0",
                        borderRadius: 2,
                        overflow: "hidden",
                      }}
                    >
                      <TableContainer>
                        <Table>
                          <TableHead>
                            <TableRow sx={{ backgroundColor: "#f8f9fa" }}>
                              <TableCell>Name</TableCell>
                              <TableCell>Email</TableCell>
                              <TableCell>Department</TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {(Array.isArray(eventTeachers?.data)
                              ? eventTeachers.data
                              : Array.isArray(eventTeachers)
                              ? eventTeachers
                              : []
                            ).map((teacher) => (
                              <TableRow key={teacher.id}>
                                <TableCell>{teacher.name}</TableCell>
                                <TableCell>{teacher.email}</TableCell>
                                <TableCell>
                                  {teacher.department || "N/A"}
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </TableContainer>
                    </Paper>
                  )}
                </Box>
              )}
            </Box>
          ) : (
            <Box sx={{ p: 4, textAlign: "center" }}>
              <Typography
                color="error"
                sx={{ fontSize: "1.1rem", fontWeight: 500 }}
              >
                Failed to load event details.
              </Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions
          sx={{
            borderTop: "2px solid #e3f2fd",
            backgroundColor: "#f8f9fa",
            p: 2,
            justifyContent: "center",
          }}
        >
          <Button
            onClick={handleCloseDetail}
            variant="contained"
            sx={{
              minWidth: 120,
              backgroundColor: "#1976d2",
              "&:hover": {
                backgroundColor: "#1565c0",
              },
            }}
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          variant="filled"
          sx={{ width: "100%", whiteSpace: "pre-line" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default EventManage;
