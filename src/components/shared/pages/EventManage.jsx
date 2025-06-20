import {
  useCreateEvent,
  useEventList,
  useUpdateEvent,
  useEventDetail
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
  Stepper,
  Step,
  StepLabel,
  Checkbox,
  IconButton,
  Autocomplete
} from "@mui/material";
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import dayjs from 'dayjs';
import CloseIcon from '@mui/icons-material/Close';
import { uploadImageToCloudinary, deleteImageFromCloudinary, getPublicIdFromUrl, validateImage } from '@utils/cloudinary';
import { useTeacherList } from "@hooks/useTeacher";

const EventManage = () => {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [viewDetailId, setViewDetailId] = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState({
    name: '',
    startTime: null,
    endTime: null,
    location: '',
    description: '',
    registrationDeadline: null,
    attachmentImg: '',
    hostName: '',
    emails: []
  });
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });
  const [selectedTeacher, setSelectedTeacher] = useState(null);

  // TanStack Query hooks
  const { data: eventResponse, isLoading, isError, error } = useEventList();
  const createEventMutation = useCreateEvent();
  const updateEventMutation = useUpdateEvent();
  const { data: detailData, isLoading: isLoadingDetail } = useEventDetail(viewDetailId);

  // Get teacher list for email selection
  const { data: teacherResponse, isLoading: isLoadingTeachers } = useTeacherList();
  const teacherList = teacherResponse?.data?.data || [];
  const teacherEmails = teacherList.map(teacher => teacher.email);

  const eventList = eventResponse?.data?.data || [];
  const totalItems = eventList.length || 0;

  const showModal = (record = null) => {
    if (record) {
      setFormData({
        name: record.name ?? '',
        startTime: record.startTime ? dayjs(record.startTime) : null,
        endTime: record.endTime ? dayjs(record.endTime) : null,
        location: record.location ?? '',
        description: record.description ?? '',
        registrationDeadline: record.registrationDeadline ? dayjs(record.registrationDeadline) : null,
        attachmentImg: record.attachmentImg ?? '',
        hostName: record.hostName ?? '',
        emails: record.emails ?? []
      });
      setEditingId(record.id);
      setSelectedTeacher(record.teacherEmail);
    } else {
      setFormData({
        name: '',
        startTime: null,
        endTime: null,
        location: '',
        description: '',
        registrationDeadline: null,
        attachmentImg: '',
        hostName: '',
        emails: []
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
    setFormData({
      name: '',
      startTime: null,
      endTime: null,
      location: '',
      description: '',
      registrationDeadline: null,
      attachmentImg: '',
      hostName: '',
      emails: []
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleDateChange = (name, value) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
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
        startTime: formData.startTime.toISOString(),
        endTime: formData.endTime.toISOString(),
        location: formData.location.trim(),
        description: formData.description.trim(),
        registrationDeadline: formData.registrationDeadline.toISOString(),
        attachmentImg: formData.attachmentImg.trim(),
        hostName: formData.hostName.trim(),
        emails: formData.emails
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
      } else {
        await createEventMutation.mutateAsync(processedData);
        setSnackbar({
          open: true,
          message: 'Event created successfully',
          severity: 'success'
        });
      }
      handleClose();
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

  const handleImageUpload = async (file) => {
    try {
      // Validate the image file
      validateImage(file);

      // Show loading state
      setSnackbar({
        open: true,
        message: 'Uploading image...',
        severity: 'info'
      });

      // Upload the new image
      const imageUrl = await uploadImageToCloudinary(file);
      
      // Update form data with the new image URL
      setFormData(prev => ({
        ...prev,
        attachmentImg: imageUrl
      }));

      // Show success message
      setSnackbar({
        open: true,
        message: 'Image uploaded successfully',
        severity: 'success'
      });
    } catch (error) {
      console.error('Error handling image upload:', error);
      setSnackbar({
        open: true,
        message: error.message || 'Failed to upload image. Please try again.',
        severity: 'error'
      });
    }
  };

  const handleImageDelete = () => {
    setFormData(prev => ({
      ...prev,
      attachmentImg: ''
    }));
    
    setSnackbar({
      open: true,
      message: 'Image removed',
      severity: 'success'
    });
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
        <Button
          variant="contained"
          sx={{
            backgroundColor: "#1976d2",
            "&:hover": {
              backgroundColor: "#1565c0",
            },
            px: 3,
          }}
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
        <TableContainer 
          component={Paper}
          elevation={0}
          sx={{ 
            borderRadius: 2,
            overflow: 'hidden',
            border: '1px solid #e0e0e0',
            '& .MuiTableCell-root': {
              borderColor: '#e0e0e0',
              py: 2.5,
              px: 3,
            },
            '& .MuiTableRow-root': {
              '&:last-child td, &:last-child th': {
                borderBottom: 0
              }
            }
          }}
        >
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: '#f8f9fa' }}>
                <TableCell>Name</TableCell>
                <TableCell>Start Time</TableCell>
                <TableCell>End Time</TableCell>
                <TableCell>Location</TableCell>
                <TableCell>Host Name</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {displayedData.map((row) => (
                <TableRow key={row.id}>
                  <TableCell>{row.name || '-'}</TableCell>
                  <TableCell>{dayjs(row.startTime).format('DD/MM/YYYY HH:mm') || '-'}</TableCell>
                  <TableCell>{dayjs(row.endTime).format('DD/MM/YYYY HH:mm') || '-'}</TableCell>
                  <TableCell>{row.location || '-'}</TableCell>
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
          PaperProps={{
            sx: {
              minHeight: editingId ? "auto" : "70vh",
              display: "flex",
              flexDirection: "column",
            },
          }}
        >
          {editingId ? (
            // Edit Form
            <form onSubmit={handleSubmit}>
              <DialogTitle sx={{
                borderBottom: '2px solid #e3f2fd',
                backgroundColor: '#bbdefb',
                color: '#1976d2',
                fontWeight: 'bold',
                py: 2
              }}>
                Edit Event
              </DialogTitle>
              <DialogContent>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5, pt: 2.5 }}>
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
                    value={formData.startTime}
                    onChange={(newValue) => handleDateChange('startTime', newValue)}
                    slotProps={{
                      textField: {
                        required: true,
                        fullWidth: true
                      }
                    }}
                  />

                  <DateTimePicker
                    label="End Time"
                    value={formData.endTime}
                    onChange={(newValue) => handleDateChange('endTime', newValue)}
                    slotProps={{
                      textField: {
                        required: true,
                        fullWidth: true
                      }
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
                    value={formData.registrationDeadline}
                    onChange={(newValue) => handleDateChange('registrationDeadline', newValue)}
                    slotProps={{
                      textField: {
                        required: true,
                        fullWidth: true
                      }
                    }}
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
                  />

                  <TextField
                    name="emails"
                    label="Emails (comma-separated)"
                    value={formData.emails.join(', ')}
                    onChange={(e) => {
                      const emailsArray = e.target.value.split(',').map(email => email.trim());
                      setFormData(prev => ({
                        ...prev,
                        emails: emailsArray
                      }));
                    }}
                    fullWidth
                    helperText="Enter email addresses separated by commas"
                  />

                  <Autocomplete
                    value={selectedTeacher}
                    onChange={(event, newValue) => {
                      setSelectedTeacher(newValue);
                    }}
                    options={teacherEmails}
                    loading={isLoadingTeachers}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Teacher Email"
                        required
                        InputProps={{
                          ...params.InputProps,
                          endAdornment: (
                            <>
                              {isLoadingTeachers ? (
                                <CircularProgress color="inherit" size={20} />
                              ) : null}
                              {params.InputProps.endAdornment}
                            </>
                          ),
                        }}
                      />
                    )}
                  />
                </Box>
              </DialogContent>
              <DialogActions sx={{ 
                borderTop: '2px solid #e3f2fd',
                backgroundColor: '#f8f9fa',
                p: 2,
                justifyContent: 'center'
              }}>
                <Button onClick={handleClose}>Cancel</Button>
                <Button
                  type="submit"
                  variant="contained"
                  sx={{
                    minWidth: 120,
                    backgroundColor: '#1976d2',
                    '&:hover': {
                      backgroundColor: '#1565c0'
                    }
                  }}
                  disabled={updateEventMutation.isPending}
                >
                  {updateEventMutation.isPending ? (
                    <CircularProgress size={24} />
                  ) : (
                    'Update'
                  )}
                </Button>
              </DialogActions>
            </form>
          ) : (
            // Create Form with Stepper
            <Box sx={{ width: "100%" }}>
              <DialogTitle sx={{
                borderBottom: '2px solid #e3f2fd',
                backgroundColor: '#bbdefb',
                color: '#1976d2',
                fontWeight: 'bold',
                py: 2
              }}>
                Create New Event
              </DialogTitle>
              <DialogContent>
                <Box sx={{ width: "100%", mt: 2 }}>
                  <Box sx={{ 
                    width: "70%", 
                    margin: "0 auto",
                    display: "flex",
                    justifyContent: "center"
                  }}>
                    <Stepper 
                      activeStep={activeStep}
                      sx={{
                        width: "100%",
                        '& .MuiStepLabel-root': {
                          padding: '24px 12px',
                        },
                        '& .MuiStepIcon-root': {
                          width: '35px',
                          height: '35px',
                          color: '#e3f2fd',
                          '&.Mui-active': {
                            color: '#1976d2',
                          },
                          '&.Mui-completed': {
                            color: '#2e7d32',
                          },
                        },
                        '& .MuiStepLabel-label': {
                          fontSize: '1.1rem',
                          fontWeight: 500,
                          '&.Mui-active': {
                            color: '#1976d2',
                            fontWeight: 600,
                          },
                          '&.Mui-completed': {
                            color: '#2e7d32',
                            fontWeight: 600,
                          },
                        },
                        '& .MuiStepConnector-line': {
                          borderColor: '#e3f2fd',
                          borderWidth: '3px',
                        },
                        '& .MuiStepConnector-root.Mui-active .MuiStepConnector-line': {
                          borderColor: '#1976d2',
                        },
                        '& .MuiStepConnector-root.Mui-completed .MuiStepConnector-line': {
                          borderColor: '#2e7d32',
                        },
                      }}
                    >
                      <Step>
                        <StepLabel>Basic Information</StepLabel>
                      </Step>
                      <Step>
                        <StepLabel>Teacher Emails</StepLabel>
                      </Step>
                    </Stepper>
                  </Box>

                  <Box sx={{ mt: 4 }}>
                    {activeStep === 0 ? (
                      // Step 1 content
                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
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
                          value={formData.startTime}
                          onChange={(newValue) => handleDateChange('startTime', newValue)}
                          slotProps={{
                            textField: {
                              required: true,
                              fullWidth: true
                            }
                          }}
                        />

                        <DateTimePicker
                          label="End Time"
                          value={formData.endTime}
                          onChange={(newValue) => handleDateChange('endTime', newValue)}
                          slotProps={{
                            textField: {
                              required: true,
                              fullWidth: true
                            }
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
                          value={formData.registrationDeadline}
                          onChange={(newValue) => handleDateChange('registrationDeadline', newValue)}
                          slotProps={{
                            textField: {
                              required: true,
                              fullWidth: true
                            }
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
                              color: '#1976d2',
                              fontWeight: 600,
                              mb: 2
                            }}
                          >
                            Event Image
                          </Typography>
                          <Box sx={{ 
                            display: 'flex', 
                            alignItems: 'center',
                            gap: 2
                          }}>
                            <Button
                              variant="outlined"
                              component="label"
                              sx={{
                                borderColor: '#1976d2',
                                color: '#1976d2',
                                '&:hover': {
                                  borderColor: '#1565c0',
                                  backgroundColor: '#f8f9fa'
                                }
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
                              <Box sx={{ 
                                position: 'relative',
                                width: 100,
                                height: 100,
                                borderRadius: 1,
                                overflow: 'hidden',
                                border: '1px solid #e0e0e0'
                              }}>
                                <img
                                  src={formData.attachmentImg}
                                  alt="Event preview"
                                  style={{
                                    width: '100%',
                                    height: '100%',
                                    objectFit: 'cover'
                                  }}
                                />
                                <IconButton
                                  size="small"
                                  sx={{
                                    position: 'absolute',
                                    top: 4,
                                    right: 4,
                                    backgroundColor: 'rgba(255,255,255,0.8)',
                                    '&:hover': {
                                      backgroundColor: 'rgba(255,255,255,0.9)'
                                    }
                                  }}
                                  onClick={handleImageDelete}
                                >
                                  <CloseIcon fontSize="small" />
                                </IconButton>
                              </Box>
                            )}
                          </Box>
                        </Box>
                      </Box>
                    ) : (
                      // Step 2 content - Teacher Emails only
                      <Box>
                        <Typography
                          variant="h6"
                          sx={{
                            color: '#1976d2',
                            fontWeight: 600,
                            mb: 3
                          }}
                        >
                          Select Teachers
                        </Typography>
                        <Paper
                          elevation={0}
                          sx={{
                            border: '1px solid #e0e0e0',
                            borderRadius: 2,
                            overflow: 'hidden'
                          }}
                        >
                          <TableContainer>
                            <Table>
                              <TableHead>
                                <TableRow sx={{ backgroundColor: '#f8f9fa' }}>
                                  <TableCell padding="checkbox">
                                    <Checkbox
                                      checked={formData.emails.length > 0}
                                      indeterminate={formData.emails.length > 0 && formData.emails.length < teacherEmails.length}
                                      onChange={(e) => {
                                        if (e.target.checked) {
                                          setFormData(prev => ({
                                            ...prev,
                                            emails: teacherEmails
                                          }));
                                        } else {
                                          setFormData(prev => ({
                                            ...prev,
                                            emails: []
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
                                      '&:last-child td, &:last-child th': { border: 0 },
                                      cursor: 'pointer',
                                      '&:hover': {
                                        backgroundColor: '#f5f5f5'
                                      }
                                    }}
                                    onClick={() => {
                                      const isSelected = formData.emails.includes(teacher.email);
                                      setFormData(prev => ({
                                        ...prev,
                                        emails: isSelected
                                          ? prev.emails.filter(e => e !== teacher.email)
                                          : [...prev.emails, teacher.email]
                                      }));
                                    }}
                                  >
                                    <TableCell padding="checkbox">
                                      <Checkbox
                                        checked={formData.emails.includes(teacher.email)}
                                        onChange={(e) => {
                                          if (e.target.checked) {
                                            setFormData(prev => ({
                                              ...prev,
                                              emails: [...prev.emails, teacher.email]
                                            }));
                                          } else {
                                            setFormData(prev => ({
                                              ...prev,
                                              emails: prev.emails.filter(e => e !== teacher.email)
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
              <DialogActions sx={{ 
                borderTop: '2px solid #e3f2fd',
                backgroundColor: '#f8f9fa',
                p: 2,
                justifyContent: 'center'
              }}>
                <Button onClick={handleClose}>Cancel</Button>
                {activeStep > 0 && (
                  <Button onClick={handleBack}>Back</Button>
                )}
                {activeStep === 0 ? (
                  <Button 
                    onClick={handleNext}
                    variant="contained"
                    sx={{
                      minWidth: 120,
                      backgroundColor: '#1976d2',
                      '&:hover': {
                        backgroundColor: '#1565c0'
                      }
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
                      backgroundColor: '#1976d2',
                      '&:hover': {
                        backgroundColor: '#1565c0'
                      }
                    }}
                    disabled={createEventMutation.isPending}
                  >
                    {createEventMutation.isPending ? (
                      <CircularProgress size={24} />
                    ) : (
                      'Create'
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
            <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "300px" }}>
              <CircularProgress size={40} />
            </Box>
          ) : detailData?.data?.data ? (
            <Box sx={{ p: 3 }}>
              <TableContainer 
                component={Paper} 
                elevation={0}
                sx={{ 
                  borderRadius: 2,
                  overflow: 'hidden',
                  mb: 3,
                  border: '1px solid #e0e0e0',
                  '& .MuiTableCell-root': {
                    borderColor: '#e0e0e0',
                    py: 2.5,
                    px: 3,
                  }
                }}
              >
                <Table>
                  <TableBody>
                    <TableRow>
                      <TableCell 
                        sx={{ 
                          width: '30%',
                          bgcolor: '#f8f9fa',
                          fontWeight: 600,
                          color: '#1976d2'
                        }}
                      >
                        Event Name
                      </TableCell>
                      <TableCell>{detailData.data.data.name}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell 
                        sx={{ 
                          bgcolor: '#f8f9fa',
                          fontWeight: 600,
                          color: '#1976d2'
                        }}
                      >
                        Start Time
                      </TableCell>
                      <TableCell>{dayjs(detailData.data.data.startTime).format('DD/MM/YYYY HH:mm')}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell 
                        sx={{ 
                          bgcolor: '#f8f9fa',
                          fontWeight: 600,
                          color: '#1976d2'
                        }}
                      >
                        End Time
                      </TableCell>
                      <TableCell>{dayjs(detailData.data.data.endTime).format('DD/MM/YYYY HH:mm')}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell 
                        sx={{ 
                          bgcolor: '#f8f9fa',
                          fontWeight: 600,
                          color: '#1976d2'
                        }}
                      >
                        Location
                      </TableCell>
                      <TableCell>{detailData.data.data.location}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell 
                        sx={{ 
                          bgcolor: '#f8f9fa',
                          fontWeight: 600,
                          color: '#1976d2'
                        }}
                      >
                        Description
                      </TableCell>
                      <TableCell sx={{ whiteSpace: 'pre-wrap' }}>
                        {detailData.data.data.description}
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell 
                        sx={{ 
                          bgcolor: '#f8f9fa',
                          fontWeight: 600,
                          color: '#1976d2'
                        }}
                      >
                        Registration Deadline
                      </TableCell>
                      <TableCell>
                        {dayjs(detailData.data.data.registrationDeadline).format('DD/MM/YYYY HH:mm')}
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell 
                        sx={{ 
                          bgcolor: '#f8f9fa',
                          fontWeight: 600,
                          color: '#1976d2'
                        }}
                      >
                        Host Name
                      </TableCell>
                      <TableCell>{detailData.data.data.hostName}</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>

              {detailData.data.data.attachmentImg && (
                <Box sx={{ mt: 4 }}>
                  <Typography
                    variant="h6"
                    sx={{
                      color: '#1976d2',
                      fontWeight: 600,
                      mb: 2,
                      pb: 2,
                      borderBottom: '2px solid #e3f2fd'
                    }}
                  >
                    Event Image
                  </Typography>
                  <Paper
                    elevation={0}
                    sx={{
                      p: 2,
                      border: '1px solid #e0e0e0',
                      borderRadius: 2,
                      textAlign: 'center'
                    }}
                  >
                    <img 
                      src={detailData.data.data.attachmentImg}
                      alt="Event"
                      style={{ 
                        maxWidth: '100%', 
                        maxHeight: '300px', 
                        borderRadius: '8px',
                        objectFit: 'contain'
                      }}
                    />
                  </Paper>
                </Box>
              )}

              {detailData.data.data.emails && detailData.data.data.emails.length > 0 && (
                <Box sx={{ mt: 4 }}>
                  <Typography
                    variant="h6"
                    sx={{
                      color: '#1976d2',
                      fontWeight: 600,
                      mb: 2,
                      pb: 2,
                      borderBottom: '2px solid #e3f2fd'
                    }}
                  >
                    Participant Emails
                  </Typography>
                  <Paper
                    elevation={0}
                    sx={{
                      p: 2,
                      border: '1px solid #e0e0e0',
                      borderRadius: 2
                    }}
                  >
                    <Grid container spacing={1}>
                      {detailData.data.data.emails.map((email, index) => (
                        <Grid item xs={12} sm={6} md={4} key={index}>
                          <Paper
                            elevation={0}
                            sx={{
                              p: 1.5,
                              textAlign: 'center',
                              bgcolor: '#f8f9fa',
                              border: '1px solid #e0e0e0',
                              borderRadius: 1
                            }}
                          >
                            <Typography
                              sx={{
                                fontSize: '0.9rem',
                                color: '#2c3e50'
                              }}
                            >
                              {email}
                            </Typography>
                          </Paper>
                        </Grid>
                      ))}
                    </Grid>
                  </Paper>
                </Box>
              )}
            </Box>
          ) : (
            <Box sx={{ p: 4, textAlign: "center" }}>
              <Typography color="error" sx={{ fontSize: "1.1rem", fontWeight: 500 }}>
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
