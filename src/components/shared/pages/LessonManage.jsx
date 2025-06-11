import {
  useCreateLesson,
  useLessonList,
  useUpdateLesson,
} from '@hooks/useLesson';
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

const LessonManage = () => {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    topic: '',
    description: ''
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
  const { data: lessonResponse, isLoading, isError, error } = useLessonList();
  const createLessonMutation = useCreateLesson();
  const updateLessonMutation = useUpdateLesson();

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

    if (createLessonMutation.error) handleMutationError(createLessonMutation.error);
    if (updateLessonMutation.error) handleMutationError(updateLessonMutation.error);
  }, [createLessonMutation.error, updateLessonMutation.error]);

  const lessonList = lessonResponse?.data?.data || [];
  const totalItems = lessonList.length || 0;

  const validateForm = () => {
    const errors = {};
    if (!formData.topic.trim()) {
      errors.topic = 'Topic is required';
    }
    if (!formData.description.trim()) {
      errors.description = 'Description is required';
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const showModal = (record = null) => {
    setFormErrors({});
    if (record) {
      setFormData({
        topic: record.topic ?? '',
        description: record.description ?? ''
      });
      setEditingId(record.id);
    } else {
      setFormData({
        topic: '',
        description: ''
      });
      setEditingId(null);
    }
    setIsModalOpen(true);
  };

  const handleClose = () => {
    setIsModalOpen(false);
    setEditingId(null);
    setFormData({
      topic: '',
      description: ''
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
        topic: formData.topic.trim(),
        description: formData.description.trim()
      };

      if (editingId) {
        try {
          console.log('Updating lesson:', editingId, processedData);
          await updateLessonMutation.mutateAsync({
            id: editingId,
            data: processedData
          });
          
          setSnackbar({
            open: true,
            message: 'Lesson edited successfully',
            severity: 'success'
          });
          handleClose();
        } catch (error) {
          console.error('Edit error:', error);
          setSnackbar({
            open: true,
            message: error.response?.data?.message || 'Failed to edit lesson',
            severity: 'error'
          });
        }
      } else {
        try {
          console.log('Creating lesson:', processedData);
          await createLessonMutation.mutateAsync(processedData);
          setSnackbar({
            open: true,
            message: 'Lesson created successfully',
            severity: 'success'
          });
          handleClose();
        } catch (error) {
          console.error('Create error:', error);
          setSnackbar({
            open: true,
            message: error.response?.data?.message || 'Failed to create lesson',
            severity: 'error'
          });
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

  if (isError) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error">
          {error?.response?.status === 403 
            ? 'You do not have permission to access this resource. Please log in with appropriate permissions.'
            : `Error loading lesson data: ${error?.message || 'Please try again later.'}`
          }
        </Alert>
      </Box>
    );
  }

  const displayedData = lessonList?.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  ) || [];

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ 
        mb: 3, 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        borderBottom: '2px solid #e3f2fd',
        pb: 2
      }}>
        <Box>
          <Typography 
            variant="h4" 
            component="h1" 
            sx={{ 
              color: '#1976d2',
              fontWeight: 'bold',
              mb: 1
            }}
          >
            Lesson Management
          </Typography>
          <Typography 
            variant="subtitle1" 
            sx={{ 
              color: '#666',
              fontWeight: 'medium'
            }}
          >
            Total Lessons: {totalItems}
          </Typography>
        </Box>
        <Button
          variant="contained"
          color="primary"
          onClick={() => showModal()}
          sx={{
            backgroundColor: '#1976d2',
            '&:hover': {
              backgroundColor: '#1565c0'
            },
            px: 3
          }}
        >
          Create New Lesson
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
                <TableCell>Topic</TableCell>
                <TableCell>Description</TableCell>
                <TableCell align="right" sx={{ width: '200px' }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {displayedData.map((row) => (
                <TableRow key={row.id}>
                  <TableCell>{row.topic || '-'}</TableCell>
                  <TableCell>{row.description || '-'}</TableCell>
                  <TableCell align="right">
                    <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
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
            labelRowsPerPage="Rows per page:"
            labelDisplayedRows={({ from, to, count }) => 
              `${from}-${to} of ${count !== -1 ? count : `more than ${to}`}`
            }
          />
        </TableContainer>
      )}

      {/* Form Dialog */}
      <Dialog
        open={isModalOpen}
        onClose={handleClose}
        maxWidth="sm"
        fullWidth
      >
        <form onSubmit={handleSubmit}>
          <DialogTitle>
            {editingId ? 'Edit Lesson' : 'Create New Lesson'}
          </DialogTitle>
          <DialogContent>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 2 }}>
              <TextField
                name="topic"
                label="Topic"
                value={formData.topic}
                onChange={handleInputChange}
                required
                fullWidth
                error={!!formErrors.topic}
                helperText={formErrors.topic}
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
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              disabled={createLessonMutation.isPending || updateLessonMutation.isPending}
            >
              {createLessonMutation.isPending || updateLessonMutation.isPending ? (
                <CircularProgress size={24} />
              ) : editingId ? (
                'Save'
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
    </Box>
  );
};

export default LessonManage; 