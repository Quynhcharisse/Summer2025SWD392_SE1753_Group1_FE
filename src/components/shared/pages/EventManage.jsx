import {
  useCreateEvent,
  useEventList,
  useUpdateEvent,
  useEventDetail
} from '@hooks/useEvent';
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
  Typography
} from '@mui/material';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import dayjs from 'dayjs';

const EventManage = () => {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [viewDetailId, setViewDetailId] = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    date: null,
    startTime: null,
    endTime: null,
    location: '',
    description: '',
    status: '',
    registrationDeadline: '',
    attachmentImg: '',
    hostName: ''
  });
  const [formErrors, setFormErrors] = useState({});
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  // TanStack Query hooks
  const { data: eventResponse, isLoading, isError, error } = useEventList();
  const createEventMutation = useCreateEvent();
  const updateEventMutation = useUpdateEvent();
  const { data: detailData, isLoading: isLoadingDetail } = useEventDetail(viewDetailId);

  // Handle 403 errors
  useEffect(() => {
    if (error?.response?.status === 403) {
      setSnackbar({
        open: true,
        message: 'You do not have permission to access this resource. Please log in with appropriate permissions.',
        severity: 'error'
      });
    }
  }, [error]);

  // Handle mutation errors
  useEffect(() => {
    const handleMutationError = (error) => {
      if (error?.response?.status === 403) {
        setSnackbar({
          open: true,
          message: 'You do not have permission to perform this action. Please log in with appropriate permissions.',
          severity: 'error'
        });
      }
    };

    if (createEventMutation.error) handleMutationError(createEventMutation.error);
    if (updateEventMutation.error) handleMutationError(updateEventMutation.error);
  }, [createEventMutation.error, updateEventMutation.error]);

  const eventList = eventResponse?.data?.data || [];
  const totalItems = eventList.length || 0;

  const validateForm = () => {
    const errors = {};
    if (!formData.name.trim()) {
      errors.name = 'Name is required';
    }
    if (!formData.date) {
      errors.date = 'Date is required';
    }
    if (!formData.startTime) {
      errors.startTime = 'Start time is required';
    }
    if (!formData.endTime) {
      errors.endTime = 'End time is required';
    }
    if (!formData.location.trim()) {
      errors.location = 'Location is required';
    }
    if (!formData.description.trim()) {
      errors.description = 'Description is required';
    }
    if (!formData.status.trim()) {
      errors.status = 'Status is required';
    }
    if (!formData.registrationDeadline.trim()) {
      errors.registrationDeadline = 'Registration deadline is required';
    }
    if (!formData.hostName.trim()) {
      errors.hostName = 'Host name is required';
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const showModal = (record = null) => {
    setFormErrors({});
    if (record) {
      setFormData({
        name: record.name ?? '',
        date: record.date ? new Date(record.date) : null,
        startTime: record.startTime ? new Date(record.startTime) : null,
        endTime: record.endTime ? new Date(record.endTime) : null,
        location: record.location ?? '',
        description: record.description ?? '',
        status: record.status ?? '',
        registrationDeadline: record.registrationDeadline ?? '',
        attachmentImg: record.attachmentImg ?? '',
        hostName: record.hostName ?? ''
      });
      setEditingId(record.id);
    } else {
      setFormData({
        name: '',
        date: null,
        startTime: null,
        endTime: null,
        location: '',
        description: '',
        status: '',
        registrationDeadline: '',
        attachmentImg: '',
        hostName: ''
      });
      setEditingId(null);
    }
    setIsModalOpen(true);
  };

  const handleClose = () => {
    setIsModalOpen(false);
    setEditingId(null);
    setFormData({
      name: '',
      date: null,
      startTime: null,
      endTime: null,
      location: '',
      description: '',
      status: '',
      registrationDeadline: '',
      attachmentImg: '',
      hostName: ''
    });
    setFormErrors({});
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user types
    if (formErrors[name]) {
      setFormErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleDateChange = (name, value) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (formErrors[name]) {
      setFormErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }

    try {
      const processedData = {
        name: formData.name.trim(),
        date: formData.date.toISOString(),
        startTime: formData.startTime.toISOString(),
        endTime: formData.endTime.toISOString(),
        location: formData.location.trim(),
        description: formData.description.trim(),
        status: formData.status.trim(),
        registrationDeadline: formData.registrationDeadline.trim(),
        attachmentImg: formData.attachmentImg.trim(),
        hostName: formData.hostName.trim()
      };

      if (editingId) {
        await updateEventMutation.mutateAsync({
          id: editingId,
          data: processedData
        });
        setSnackbar({
          open: true,
          message: 'Event updated successfully',
          severity: 'success'
        });
        handleClose();
      } else {
        await createEventMutation.mutateAsync(processedData);
        setSnackbar({
          open: true,
          message: 'Event created successfully',
          severity: 'success'
        });
        handleClose();
      }
    } catch (error) {
      console.error('Operation error:', error);
      setSnackbar({
        open: true,
        message: error.message || 'An error occurred',
        severity: 'error'
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

  const handleCloseSnackbar = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  const handleViewDetail = (id) => {
    setViewDetailId(id);
    setIsDetailModalOpen(true);
  };

  const handleCloseDetail = () => {
    setIsDetailModalOpen(false);
    setViewDetailId(null);
  };

  if (isError) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error">
          {error?.response?.status === 403 
            ? 'You do not have permission to access this resource. Please log in with appropriate permissions.'
            : `Error loading event data: ${error?.message || 'Please try again later.'}`
          }
        </Alert>
      </Box>
    );
  }

  const displayedData = eventList?.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  ) || [];

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
          <Typography variant="h4" component="h1">
            Event Management
          </Typography>
          <Typography variant="subtitle1" color="textSecondary">
            Total Events: {totalItems}
          </Typography>
        </Box>
        <Button
          variant="contained"
          color="primary"
          onClick={() => showModal()}
        >
          Create New Event
        </Button>
      </Box>

      {isLoading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
          <CircularProgress />
        </Box>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Date</TableCell>
                <TableCell>Location</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Host Name</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {displayedData.map((row) => (
                <TableRow key={row.id}>
                  <TableCell>{row.name || '-'}</TableCell>
                  <TableCell>{new Date(row.date).toLocaleDateString() || '-'}</TableCell>
                  <TableCell>{row.location || '-'}</TableCell>
                  <TableCell>{row.status || '-'}</TableCell>
                  <TableCell>{row.hostName || '-'}</TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <Button
                        variant="outlined"
                        color="info"
                        onClick={() => handleViewDetail(row.id)}
                        size="small"
                      >
                        View
                      </Button>
                      <Button
                        variant="outlined"
                        color="primary"
                        onClick={() => showModal(row)}
                        size="small"
                      >
                        Edit
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
          />
        </TableContainer>
      )}

      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <Dialog
          open={isModalOpen}
          onClose={handleClose}
          maxWidth="md"
          fullWidth
        >
          <form onSubmit={handleSubmit}>
            <DialogTitle>
              {editingId ? 'Edit Event' : 'Create New Event'}
            </DialogTitle>
            <DialogContent>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 2 }}>
                <TextField
                  name="name"
                  label="Event Name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  fullWidth
                  error={!!formErrors.name}
                  helperText={formErrors.name}
                />
                
                <DatePicker
                  label="Date"
                  value={formData.date}
                  onChange={(newValue) => handleDateChange('date', newValue)}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      required
                      fullWidth
                      error={!!formErrors.date}
                      helperText={formErrors.date}
                    />
                  )}
                />

                <DateTimePicker
                  label="Start Time"
                  value={formData.startTime}
                  onChange={(newValue) => handleDateChange('startTime', newValue)}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      required
                      fullWidth
                      error={!!formErrors.startTime}
                      helperText={formErrors.startTime}
                    />
                  )}
                />

                <DateTimePicker
                  label="End Time"
                  value={formData.endTime}
                  onChange={(newValue) => handleDateChange('endTime', newValue)}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      required
                      fullWidth
                      error={!!formErrors.endTime}
                      helperText={formErrors.endTime}
                    />
                  )}
                />

                <TextField
                  name="location"
                  label="Location"
                  value={formData.location}
                  onChange={handleInputChange}
                  required
                  fullWidth
                  error={!!formErrors.location}
                  helperText={formErrors.location}
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
                  error={!!formErrors.description}
                  helperText={formErrors.description}
                />

                <TextField
                  name="status"
                  label="Status"
                  value={formData.status}
                  onChange={handleInputChange}
                  required
                  fullWidth
                  error={!!formErrors.status}
                  helperText={formErrors.status}
                />

                <TextField
                  name="registrationDeadline"
                  label="Registration Deadline"
                  value={formData.registrationDeadline}
                  onChange={handleInputChange}
                  required
                  fullWidth
                  error={!!formErrors.registrationDeadline}
                  helperText={formErrors.registrationDeadline}
                />

                <TextField
                  name="attachmentImg"
                  label="Attachment Image URL"
                  value={formData.attachmentImg}
                  onChange={handleInputChange}
                  fullWidth
                />

                <TextField
                  name="hostName"
                  label="Host Name"
                  value={formData.hostName}
                  onChange={handleInputChange}
                  required
                  fullWidth
                  error={!!formErrors.hostName}
                  helperText={formErrors.hostName}
                />
              </Box>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleClose}>Cancel</Button>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                disabled={createEventMutation.isPending || updateEventMutation.isPending}
              >
                {createEventMutation.isPending || updateEventMutation.isPending ? (
                  <CircularProgress size={24} />
                ) : editingId ? (
                  'Update'
                ) : (
                  'Create'
                )}
              </Button>
            </DialogActions>
          </form>
        </Dialog>
      </LocalizationProvider>

      <Dialog
        open={isDetailModalOpen}
        onClose={handleCloseDetail}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle sx={{ 
          textAlign: 'center',
          borderBottom: '2px solid #e3f2fd',
          backgroundColor: '#bbdefb',
          color: '#1976d2',
          fontWeight: 'bold',
          py: 2
        }}>
          Event Details
        </DialogTitle>
        <DialogContent>
          {isLoadingDetail ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '300px' }}>
              <CircularProgress />
            </Box>
          ) : detailData?.data?.data ? (
            <Box sx={{ p: 4 }}>
              <Box sx={{ mb: 4, textAlign: 'center' }}>
                {detailData.data.data.attachmentImg && (
                  <img 
                    src={detailData.data.data.attachmentImg}
                    alt="Event"
                    style={{ maxWidth: '100%', maxHeight: '300px', borderRadius: '8px' }}
                  />
                )}
              </Box>
              
              <Typography variant="h5" gutterBottom>
                {detailData.data.data.name}
              </Typography>

              <Box sx={{ display: 'grid', gap: 2 }}>
                <Box>
                  <Typography variant="subtitle2" color="textSecondary">Date</Typography>
                  <Typography>{new Date(detailData.data.data.date).toLocaleDateString()}</Typography>
                </Box>

                <Box>
                  <Typography variant="subtitle2" color="textSecondary">Time</Typography>
                  <Typography>
                    {new Date(detailData.data.data.startTime).toLocaleTimeString()} - 
                    {new Date(detailData.data.data.endTime).toLocaleTimeString()}
                  </Typography>
                </Box>

                <Box>
                  <Typography variant="subtitle2" color="textSecondary">Location</Typography>
                  <Typography>{detailData.data.data.location}</Typography>
                </Box>

                <Box>
                  <Typography variant="subtitle2" color="textSecondary">Description</Typography>
                  <Typography>{detailData.data.data.description}</Typography>
                </Box>

                <Box>
                  <Typography variant="subtitle2" color="textSecondary">Status</Typography>
                  <Typography>{detailData.data.data.status}</Typography>
                </Box>

                <Box>
                  <Typography variant="subtitle2" color="textSecondary">Registration Deadline</Typography>
                  <Typography>{detailData.data.data.registrationDeadline}</Typography>
                </Box>

                <Box>
                  <Typography variant="subtitle2" color="textSecondary">Host</Typography>
                  <Typography>{detailData.data.data.hostName}</Typography>
                </Box>
              </Box>
            </Box>
          ) : (
            <Box sx={{ p: 4, textAlign: 'center' }}>
              <Typography color="error">Failed to load event details.</Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ 
          borderTop: '2px solid #e3f2fd',
          backgroundColor: '#f8f9fa',
          p: 2,
          justifyContent: 'center'
        }}>
          <Button 
            onClick={handleCloseDetail}
            variant="contained"
            sx={{
              minWidth: 120,
              backgroundColor: '#1976d2',
              '&:hover': {
                backgroundColor: '#1565c0'
              }
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
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default EventManage;
