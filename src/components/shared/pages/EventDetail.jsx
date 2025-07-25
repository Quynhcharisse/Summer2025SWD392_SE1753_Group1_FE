import { useParams, Link, useNavigate } from "react-router-dom";
import { useEventActiveDetail, useRegisterEvent, useChildren } from "@hooks/useEvent";
import { CircularProgress, Alert, Box, Typography, Paper, Chip, Dialog, DialogTitle, DialogContent, DialogActions, Card, CardContent, Button as MuiButton } from "@mui/material";
import dayjs from "dayjs";
import React from "react";
import Snackbar from '@mui/material/Snackbar';
import { getCurrentTokenData } from "@services/JWTService.jsx";

const formatDateTime = (dateStr) => {
  if (!dateStr) return "";
  const d = dayjs(dateStr);
  return d.isValid() ? d.format("DD/MM/YYYY HH:mm") : "";
};

const EventDetail = () => {
  const { id } = useParams();
  const { data, isLoading, isError, error } = useEventActiveDetail(id);
  const registerEventMutation = useRegisterEvent();
  // Sử dụng useChildren với enabled: false để không tự động fetch
  const { data: childrenData, isLoading: isLoadingChildren, refetch: refetchChildren } = useChildren({ enabled: false });
  const [selectedStudentIds, setSelectedStudentIds] = React.useState([]);
  const [openRegisterDialog, setOpenRegisterDialog] = React.useState(false);
  const event = data?.data?.data;
  const [snackbar, setSnackbar] = React.useState({ open: false, message: '', severity: 'success' });
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));
  const isLoggedIn = !!user;

  const handleStudentCheckbox = (id) => {
    setSelectedStudentIds((prev) =>
      prev.includes(id) ? prev.filter((sid) => sid !== id) : [...prev, id]
    );
  };

  const handleOpenRegisterDialog = () => {
    refetchChildren();
    setOpenRegisterDialog(true);
  };

  const handleCloseRegisterDialog = () => {
    setOpenRegisterDialog(false);
    setSelectedStudentIds([]);
    registerEventMutation.reset && registerEventMutation.reset();
  };

  const handleCloseSnackbar = (event, reason) => {
    if (reason === 'clickaway') return;
    setSnackbar({ ...snackbar, open: false });
  };

  const handleConfirmRegister = () => {
    registerEventMutation.mutate(
      { eventId: String(id), studentIds: selectedStudentIds.map(String) },
      {
        onSuccess: () => {
          setSnackbar({ open: true, message: 'Registration successful!', severity: 'success' });
          setOpenRegisterDialog(false);
          setSelectedStudentIds([]);
        },
        onError: (error) => {
          setSnackbar({
            open: true,
            message: error?.response?.data?.message || 'Registration failed. Please try again.',
            severity: 'error',
          });
          setOpenRegisterDialog(false);
          setSelectedStudentIds([]);
        },
      }
    );
  };

  const handleRegisterClick = () => {
    if (!isLoggedIn) {
      navigate("/auth/login");
      return;
    }
    // Kiểm tra role, chỉ cho phép parent đăng ký
    const tokenData = getCurrentTokenData();
    if (!tokenData || tokenData.role?.toLowerCase() !== "parent") {
      setSnackbar({
        open: true,
        message: "Only parents can register their children for events!",
        severity: "warning",
      });
      return;
    }
    // Nếu là parent thì mới fetch children và mở dialog
    handleOpenRegisterDialog();
  };

  // Breadcrumbs
  const breadcrumbs = (
    <nav className="mb-4">
      <ol className="flex items-center space-x-2 text-sm text-gray-600">
        <li>
          <Link to="/homepage" className="hover:text-blue-600 transition-colors">
            Home
          </Link>
        </li>
        <span className="mx-2 text-gray-400">/</span>
        <li>
          <Link to="/homepage/events" className="hover:text-blue-600 transition-colors">
            Events
          </Link>
        </li>
        {event?.name && (
          <>
            <span className="mx-2 text-gray-400">/</span>
            <li className="text-gray-900 font-medium">{event.name}</li>
          </>
        )}
      </ol>
    </nav>
  );

  if (isLoading) {
    return (
      <Box className="flex justify-center items-center h-64">
        <CircularProgress />
      </Box>
    );
  }
  if (isError) {
    return <Alert severity="error">{error?.message || "Error loading event details."}</Alert>;
  }
  if (!event) {
    return <Alert severity="info">No event found.</Alert>;
  }

  return (
    <Box className="max-w-7xl mx-auto px-4 py-6">
      {/* Header section giống PageTemplate */}
      <div className="mb-6">
        {breadcrumbs}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-blue-700 mb-2">{event.name}</h1>
            {/* Event date/time under title */}
            <div className="flex flex-wrap gap-2 mb-2">
              <Chip label={`Start: ${event.startTime}`} color="primary" size="small" />
              <Chip label={`End: ${event.endTime}`} color="primary" size="small" />
              <Chip label={`Location: ${event.location}`} color="secondary" size="small" />
              {event.category && <Chip label={event.category} color="info" size="small" />}
            </div>
            {event.description && (
              <p className="text-lg text-gray-600 mt-1">{event.description}</p>
            )}
          </div>
          {/* Nút đăng ký event */}
          <div className="flex-shrink-0">
            <button
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2 rounded-lg shadow transition-colors text-base disabled:opacity-60"
              onClick={handleRegisterClick}
            >
              Register Event
            </button>
            {/* Dialog chọn học sinh */}
            <Dialog
              open={openRegisterDialog}
              onClose={handleCloseRegisterDialog}
              maxWidth="md"
              fullWidth
              PaperProps={{
                sx: {
                  minWidth: 600,
                  maxWidth: 700,
                  minHeight: 400,
                  maxHeight: '90vh',
                },
              }}
            >
              <DialogTitle>
                <span className="text-blue-700 font-bold text-lg w-full block text-center">Select children to register for event</span>
              </DialogTitle>
              <DialogContent>
                {isLoadingChildren ? (
                  <div className="py-4 text-center"><CircularProgress size={24} /></div>
                ) : childrenData && Array.isArray(childrenData.data) && childrenData.data.filter(child => child.isStudent === true).length > 0 ? (
                  <Box className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
                    {childrenData.data.filter(child => child.isStudent === true).map((child) => {
                      const isSelected = selectedStudentIds.includes(child.id);
                      return (
                        <Card
                          key={child.id}
                          variant="outlined"
                          onClick={() => handleStudentCheckbox(child.id)}
                          sx={{
                            borderRadius: 3,
                            borderColor: '#2563eb',
                            boxShadow: isSelected ? 10 : 3,
                            bgcolor: isSelected ? '#bae6fd' : '#e0f2fe',
                            transition: 'all 0.18s',
                            cursor: 'pointer',
                            '&:hover': {
                              borderColor: '#2563eb',
                              bgcolor: '#bae6fd',
                              boxShadow: 12,
                            },
                          }}
                        >
                          <CardContent className="flex items-center gap-3">
                            <input
                              type="checkbox"
                              checked={isSelected}
                              onChange={e => { e.stopPropagation(); handleStudentCheckbox(child.id); }}
                              className="accent-blue-600 scale-125"
                              onClick={e => e.stopPropagation()}
                            />
                            <div>
                              <div className="font-semibold text-gray-900">{child.name}</div>
                              <div className="text-xs text-gray-500">Date of birth: {child.dateOfBirth ? dayjs(child.dateOfBirth).format('DD/MM/YYYY') : ''}</div>
                            </div>
                          </CardContent>
                        </Card>
                      );
                    })}
                  </Box>
                ) : (
                  <div className="py-4 text-center text-gray-500">No children available for registration.</div>
                )}
                
              </DialogContent>
              <DialogActions>
                <MuiButton onClick={handleCloseRegisterDialog} color="secondary">Close</MuiButton>
                <MuiButton
                  onClick={handleConfirmRegister}
                  color="primary"
                  variant="contained"
                  disabled={registerEventMutation.isLoading || selectedStudentIds.length === 0}
                >
                  {registerEventMutation.isLoading ? 'Registering...' : 'Confirm Register'}
                </MuiButton>
              </DialogActions>
            </Dialog>
          </div>
        </div>
      </div>
      {/* Nội dung chi tiết event */}
      <div className="max-w-3xl mx-auto space-y-6">
        {event.attachmentImg && (
          <Paper elevation={2} className="overflow-hidden rounded-lg">
            <img
              src={event.attachmentImg}
              alt={event.name}
              className="w-full max-h-[500px] object-contain bg-white"
              style={{ display: 'block', margin: '0 auto' }}
            />
          </Paper>
        )}
      </div>
      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          variant="filled"
          sx={{ width: '100%', whiteSpace: 'pre-line' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default EventDetail;
