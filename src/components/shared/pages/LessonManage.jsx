import {
  useCreateLesson,
  useLessonList,
  useUpdateLesson,
} from "@hooks/useLesson";
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
} from "@mui/material";
import { useEffect, useRef, useState } from "react";

const LessonManage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formErrors, setFormErrors] = useState({});
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const topicRef = useRef();
  const descriptionRef = useRef();
  const objectiveRef = useRef();
  const toolsRequiredRef = useRef();
  const durationRef = useRef();

  const { data: lessonResponse, isLoading, isError, error } = useLessonList();
  const createLessonMutation = useCreateLesson();
  const updateLessonMutation = useUpdateLesson();

  const lessonList = lessonResponse?.data?.data || [];
  const totalItems = lessonList.length || 0;

  useEffect(() => {
    if (error?.response?.status === 403) {
      setSnackbar({
        open: true,
        message: "You do not have permission to access this resource.",
        severity: "error",
      });
    }
  }, [error]);

  useEffect(() => {
    const handleMutationError = (error) => {
      if (error?.response?.status === 403) {
        setSnackbar({
          open: true,
          message: "You do not have permission to perform this action.",
          severity: "error",
        });
      }
    };
    if (createLessonMutation.error)
      handleMutationError(createLessonMutation.error);
    if (updateLessonMutation.error)
      handleMutationError(updateLessonMutation.error);
  }, [createLessonMutation.error, updateLessonMutation.error]);

  const showModal = (record = null) => {
    setFormErrors({});
    setTimeout(() => {
      if (record) {
        topicRef.current.value = record.topic ?? "";
        descriptionRef.current.value = record.description ?? "";
        objectiveRef.current.value = record.objective ?? "";
        toolsRequiredRef.current.value = record.toolsRequired ?? "";
        durationRef.current.value = record.duration ?? "";
        setEditingId(record.id);
      } else {
        topicRef.current.value = "";
        descriptionRef.current.value = "";
        objectiveRef.current.value = "";
        toolsRequiredRef.current.value = "";
        durationRef.current.value = "";
        setEditingId(null);
      }
    }, 0);
    setIsModalOpen(true);
  };

  const handleClose = () => {
    setIsModalOpen(false);
    setEditingId(null);
    setFormErrors({});
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = {
      topic: topicRef.current.value.trim(),
      description: descriptionRef.current.value.trim(),
      objective: objectiveRef.current.value.trim(),
      toolsRequired: toolsRequiredRef.current.value.trim(),
      duration: Number(durationRef.current.value),
    };

    const errors = {};
    if (!data.topic) errors.topic = "Topic is required";
    if (!data.description) errors.description = "Description is required";
    if (!data.objective) errors.objective = "Objective is required";
    if (!data.duration || data.duration < 1)
      errors.duration = "Duration must be at least 1 hour";
    setFormErrors(errors);
    if (Object.keys(errors).length > 0) return;

    try {
      if (editingId) {
        await updateLessonMutation.mutateAsync({ id: editingId, data });
        setSnackbar({
          open: true,
          message: "Lesson updated successfully",
          severity: "success",
        });
      } else {
        await createLessonMutation.mutateAsync(data);
        setSnackbar({
          open: true,
          message: "Lesson created successfully",
          severity: "success",
        });
      }
      handleClose();
    } catch (error) {
      setSnackbar({
        open: true,
        message: error?.response?.data?.message || "Failed to process request",
        severity: "error",
      });
    }
  };

  const handleChangePage = (_, newPage) => setPage(newPage);
  const handleChangeRowsPerPage = (e) => {
    setRowsPerPage(parseInt(e.target.value, 10));
    setPage(0);
  };
  const handleCloseSnackbar = () => setSnackbar({ ...snackbar, open: false });

  const displayedData = lessonList.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

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
            Lesson Management
          </Typography>
          <Typography
            variant="subtitle1"
            sx={{
              color: "#666",
              fontWeight: "medium",
            }}
          >
            Total Lessons: {totalItems}
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
          color="primary"
          onClick={() => showModal()}
        >
          Create New Lesson
        </Button>
      </Box>

      {isLoading ? (
        <Box sx={{ display: "flex", justifyContent: "center", p: 3 }}>
          <CircularProgress />
        </Box>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Topic</TableCell>
                <TableCell>Description</TableCell>
                <TableCell>Objective</TableCell>
                <TableCell>Required Tools</TableCell>
                <TableCell>Duration (Hours)</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {displayedData.filter(Boolean).map((row) => (
                <TableRow key={row.id}>
                  <TableCell>{row.topic}</TableCell>
                  <TableCell>{row.description}</TableCell>
                  <TableCell>{row.objective}</TableCell>
                  <TableCell>{row.toolsRequired}</TableCell>
                  <TableCell>{row.duration}</TableCell>
                  <TableCell>
                    <Button
                      variant="outlined"
                      size="small"
                      onClick={() => showModal(row)}
                    >
                      Edit
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <TablePagination
            component="div"
            count={totalItems}
            page={page}
            rowsPerPage={rowsPerPage}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            labelDisplayedRows={({ from, to, count }) =>
              `${from}-${to} of ${count}`
            }
          />
        </TableContainer>
      )}

      <Dialog
        open={isModalOpen}
        onClose={handleClose}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            display: "flex",
            flexDirection: "column",
          },
        }}
      >
        <form onSubmit={handleSubmit}>
          <DialogTitle>
            {editingId ? "Edit Lesson" : "Create New Lesson"}
          </DialogTitle>
          <DialogContent>
            <Box
              sx={{ display: "flex", flexDirection: "column", gap: 2, pt: 2 }}
            >
              <TextField
                name="topic"
                label="Topic"
                inputRef={topicRef}
                fullWidth
                required
                multiline
                rows={1}
                error={!!formErrors.topic}
                helperText={formErrors.topic}
              />
              <TextField
                name="description"
                label="Description"
                inputRef={descriptionRef}
                fullWidth
                required
                multiline
                rows={2}
                error={!!formErrors.description}
                helperText={formErrors.description}
              />
              <TextField
                name="objective"
                label="Objective"
                inputRef={objectiveRef}
                fullWidth
                required
                multiline
                rows={2}
                error={!!formErrors.objective}
                helperText={formErrors.objective}
              />
              <TextField
                name="toolsRequired"
                label="Required Tools"
                inputRef={toolsRequiredRef}
                fullWidth
                multiline
                rows={2}
                error={!!formErrors.toolsRequired}
                helperText={formErrors.toolsRequired}
              />
              <TextField
                name="duration"
                label="Duration (Hours)"
                inputRef={durationRef}
                fullWidth
                type="number"
                required
                rows={1}
                error={!!formErrors.duration}
                helperText={formErrors.duration}
              />
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>
            <Button type="submit" variant="contained" color="primary">
              {editingId ? "Update" : "Create"}
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
          variant="filled"
          sx={{ width: "100%", whiteSpace: "pre-line" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default LessonManage;
