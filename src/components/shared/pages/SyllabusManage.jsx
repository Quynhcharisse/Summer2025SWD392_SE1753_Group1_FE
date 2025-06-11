import {
  useCreateSyllabus,
  useSyllabusList,
  useUpdateSyllabus,
  useSyllabusDetail
} from '@hooks/useSyllabus';
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

const SyllabusManage = () => {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [viewDetailId, setViewDetailId] = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    subject: '',
    description: '',
    maxNumberOfWeek: '',
    grade: ''
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
  const { data: syllabusResponse, isLoading, isError, error } = useSyllabusList();
  const createSyllabusMutation = useCreateSyllabus();
  const updateSyllabusMutation = useUpdateSyllabus();
  const { data: detailData, isLoading: isLoadingDetail } = useSyllabusDetail(viewDetailId);

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

    if (createSyllabusMutation.error) handleMutationError(createSyllabusMutation.error);
    if (updateSyllabusMutation.error) handleMutationError(updateSyllabusMutation.error);
  }, [createSyllabusMutation.error, updateSyllabusMutation.error]);

  const syllabusList = syllabusResponse?.data?.data || [];
  const totalItems = syllabusList.length || 0;

  const validateForm = () => {
    const errors = {};
    if (!formData.subject.trim()) {
      errors.subject = 'Subject is required';
    }
    if (!formData.description.trim()) {
      errors.description = 'Description is required';
    }
    if (!formData.maxNumberOfWeek || formData.maxNumberOfWeek < 1) {
      errors.maxNumberOfWeek = 'Max number of weeks must be at least 1';
    }
    if (!formData.grade.trim()) {
      errors.grade = 'Grade is required';
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const showModal = (record = null) => {
    setFormErrors({});
    if (record) {
      setFormData({
        subject: record.subject ?? '',
        description: record.description ?? '',
        maxNumberOfWeek: record.maxNumberOfWeek ? String(record.maxNumberOfWeek) : '',
        grade: record.grade ?? ''
      });
      setEditingId(record.id);
    } else {
      setFormData({
        subject: '',
        description: '',
        maxNumberOfWeek: '',
        grade: ''
      });
      setEditingId(null);
    }
    setIsModalOpen(true);
  };

  const handleClose = () => {
    setIsModalOpen(false);
    setEditingId(null);
    setFormData({
      subject: '',
      description: '',
      maxNumberOfWeek: '',
      grade: ''
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }

    try {
      const processedData = {
        subject: formData.subject.trim(),
        description: formData.description.trim(),
        maxNumberOfWeek: Number(formData.maxNumberOfWeek),
        grade: formData.grade.trim()
      };

      if (editingId) {
        try {
          await updateSyllabusMutation.mutateAsync({
            id: editingId,
            data: processedData
          });
          
          setSnackbar({
            open: true,
            message: 'Syllabus edited successfully',
            severity: 'success'
          });
          handleClose();
        } catch (error) {
          console.error('Edit error:', error);
          if (error.response?.data?.message === 'Syllabus already exists') {
            setFormErrors(prev => ({
              ...prev,
              subject: 'A syllabus with this subject already exists'
            }));
          } else {
            setSnackbar({
              open: true,
              message: error.response?.data?.message || 'Failed to edit syllabus',
              severity: 'error'
            });
          }
        }
      } else {
        try {
          await createSyllabusMutation.mutateAsync(processedData);
          setSnackbar({
            open: true,
            message: 'Syllabus created successfully',
            severity: 'success'
          });
          handleClose();
        } catch (error) {
          console.error('Create error:', error);
          if (error.response?.data?.message === 'Syllabus already exists') {
            setFormErrors(prev => ({
              ...prev,
              subject: 'A syllabus with this subject already exists'
            }));
          } else {
            setSnackbar({
              open: true,
              message: error.response?.data?.message || 'Failed to create syllabus',
              severity: 'error'
            });
          }
        }
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
            : `Error loading syllabus data: ${error?.message || 'Please try again later.'}`
          }
        </Alert>
      </Box>
    );
  }

  const displayedData = syllabusList?.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  ) || [];

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
          <Typography variant="h4" component="h1">
            Syllabus Management
          </Typography>
          <Typography variant="subtitle1" color="textSecondary">
            Total Syllabuses: {totalItems}
          </Typography>
        </Box>
        <Button
          variant="contained"
          color="primary"
          onClick={() => showModal()}
        >
          Create New Syllabus
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
                <TableCell>Subject</TableCell>
                <TableCell>Description</TableCell>
                <TableCell>Max Number of Week</TableCell>
                <TableCell>Grade</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {displayedData.map((row) => (
                <TableRow key={row.id}>
                  <TableCell>{row.subject || '-'}</TableCell>
                  <TableCell>{row.description || '-'}</TableCell>
                  <TableCell>{row.maxNumberOfWeek || '-'}</TableCell>
                  <TableCell>{row.grade || '-'}</TableCell>
                  <TableCell>
                    <Box
                      sx={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        px: 1,
                        py: 0.5,
                        borderRadius: 1,
                        backgroundColor: row.isAssigned ? '#e8f5e9' : '#ffebee',
                        color: row.isAssigned ? '#2e7d32' : '#c62828',
                      }}
                    >
                      <Typography variant="body2">
                        {row.isAssigned ? 'Assigned' : 'Not Assigned'}
                      </Typography>
                    </Box>
                  </TableCell>
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
                        disabled={row.isAssigned}
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

      <Dialog
        open={isModalOpen}
        onClose={handleClose}
        maxWidth="sm"
        fullWidth
      >
        <form onSubmit={handleSubmit}>
          <DialogTitle>
            {editingId ? 'Edit Syllabus' : 'Create New Syllabus'}
          </DialogTitle>
          <DialogContent>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 2 }}>
              <TextField
                name="subject"
                label="Subject"
                value={formData.subject}
                onChange={handleInputChange}
                required
                fullWidth
                error={!!formErrors.subject}
                helperText={formErrors.subject}
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
                name="maxNumberOfWeek"
                label="Max Number of Week"
                value={formData.maxNumberOfWeek}
                onChange={handleInputChange}
                required
                fullWidth
                type="number"
                inputProps={{ min: 1 }}
                error={!!formErrors.maxNumberOfWeek}
                helperText={formErrors.maxNumberOfWeek}
              />
              <TextField
                name="grade"
                label="Grade"
                value={formData.grade}
                onChange={handleInputChange}
                required
                fullWidth
                error={!!formErrors.grade}
                helperText={formErrors.grade}
              />
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              disabled={createSyllabusMutation.isPending || updateSyllabusMutation.isPending}
            >
              {createSyllabusMutation.isPending || updateSyllabusMutation.isPending ? (
                <CircularProgress size={24} />
              ) : editingId ? (
                'Edit'
              ) : (
                'Create'
              )}
            </Button>
          </DialogActions>
        </form>
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

      {/* Detail Modal */}
      <Dialog
        open={isDetailModalOpen}
        onClose={handleCloseDetail}
        maxWidth="md"
        fullWidth
        sx={{
          '& .MuiDialog-paper': {
            borderRadius: 2,
            background: 'linear-gradient(to bottom, #ffffff, #f8f9fa)'
          }
        }}
      >
        <DialogTitle sx={{ 
          textAlign: 'center',
          borderBottom: '2px solid #e3f2fd',
          backgroundColor: '#bbdefb',
          color: '#1976d2',
          fontWeight: 'bold',
          py: 2
        }}>
          Syllabus Details
        </DialogTitle>
        <DialogContent>
          {isLoadingDetail ? (
            <Box sx={{ 
              display: 'flex', 
              justifyContent: 'center', 
              alignItems: 'center',
              minHeight: '300px'
            }}>
              <CircularProgress size={40} />
            </Box>
          ) : detailData?.data?.data ? (
            <Box sx={{ 
              p: 4,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center'
            }}>
              <Box sx={{ 
                width: '100%',
                maxWidth: '600px',
                backgroundColor: 'white',
                borderRadius: 2,
                boxShadow: 3,
                p: 3
              }}>
                <Typography 
                  variant="h5" 
                  sx={{ 
                    textAlign: 'center',
                    color: '#1976d2',
                    fontWeight: 'bold',
                    mb: 3
                  }}
                >
                  {detailData.data.data.subject}
                </Typography>

                <Box sx={{ 
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 3
                }}>
                  <Box>
                    <Typography sx={{ 
                      color: '#5c6bc0',
                      fontWeight: 'bold',
                      fontSize: '1.1rem',
                      mb: 1
                    }}>
                      Grade
                    </Typography>
                    <Box sx={{ 
                      backgroundColor: '#f5f5f5',
                      p: 2,
                      borderRadius: 1
                    }}>
                      <Typography>
                        {detailData.data.data.grade}
                      </Typography>
                    </Box>
                  </Box>

                  <Box>
                    <Typography sx={{ 
                      color: '#5c6bc0',
                      fontWeight: 'bold',
                      fontSize: '1.1rem',
                      mb: 1
                    }}>
                      Duration
                    </Typography>
                    <Box sx={{ 
                      backgroundColor: '#f5f5f5',
                      p: 2,
                      borderRadius: 1
                    }}>
                      <Typography>
                        {detailData.data.data.maxNumberOfWeek} weeks
                      </Typography>
                    </Box>
                  </Box>

                  <Box>
                    <Typography sx={{ 
                      color: '#5c6bc0',
                      fontWeight: 'bold',
                      fontSize: '1.1rem',
                      mb: 1
                    }}>
                      Description
                    </Typography>
                    <Box sx={{ 
                      backgroundColor: '#f5f5f5',
                      p: 2,
                      borderRadius: 1
                    }}>
                      <Typography sx={{ 
                        whiteSpace: 'pre-wrap',
                        wordBreak: 'break-word'
                      }}>
                        {detailData.data.data.description}
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              </Box>
            </Box>
          ) : (
            <Box sx={{ 
              p: 4, 
              textAlign: 'center'
            }}>
              <Typography 
                color="error"
                sx={{
                  fontSize: '1.1rem',
                  fontWeight: 500
                }}
              >
                Failed to load syllabus details.
              </Typography>
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
    </Box>
  );
};

export default SyllabusManage;
