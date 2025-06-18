import {
  useCreateLesson,
  useLessonList,
  useUpdateLesson,
  useLessonSyllabuses,
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
  Grid,
} from "@mui/material";
import { useEffect, useRef, useState } from "react";

const LessonManage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [viewDetailId, setViewDetailId] = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");
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

  const { data: lessonResponse, isLoading, error } = useLessonList();
  const createLessonMutation = useCreateLesson();
  const updateLessonMutation = useUpdateLesson();
  const { data: syllabusesData, isLoading: isLoadingSyllabuses } = useLessonSyllabuses(viewDetailId);

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
  };

  const handleViewDetail = (id) => {
    setViewDetailId(id);
    setIsDetailModalOpen(true);
  };

  const handleCloseDetail = () => {
    setIsDetailModalOpen(false);
    setViewDetailId(null);
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

  // Filter and sort logic
  const filteredAndSortedData = lessonList
    ?.filter(lesson => {
      const searchLower = searchQuery.toLowerCase();
      return (
        searchQuery === "" ||
        lesson.topic.toLowerCase().includes(searchLower) ||
        lesson.description.toLowerCase().includes(searchLower) ||
        lesson.objective.toLowerCase().includes(searchLower) ||
        lesson.toolsRequired.toLowerCase().includes(searchLower)
      );
    })
    .sort((a, b) => {
      if (sortOrder === "asc") {
        return a.duration - b.duration;
      } else {
        return b.duration - a.duration;
      }
    }) || [];

  const displayedData = filteredAndSortedData.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  const handleSortClick = () => {
    setSortOrder(prev => prev === "asc" ? "desc" : "asc");
  };

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

      {/* Add Search and Sort Controls */}
      <Box
        sx={{
          mb: 3,
          display: "flex",
          gap: 2,
          alignItems: "center",
          flexWrap: "wrap"
        }}
      >
        <TextField
          size="small"
          label="Search lessons"
          variant="outlined"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          sx={{ minWidth: 300 }}
          placeholder="Search by topic, description, objective, or tools..."
        />

        <Box sx={{ flexGrow: 1 }} />

        <Typography
          variant="body2"
          sx={{
            color: "#666",
            fontWeight: "medium",
          }}
        >
          Filtered Results: {filteredAndSortedData.length}
        </Typography>
      </Box>

      {isLoading ? (
        <Box sx={{ display: "flex", justifyContent: "center", p: 3 }}>
          <CircularProgress />
        </Box>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: '#f8f9fa' }}>
                <TableCell 
                  align="center"
                  sx={{
                    color: '#1976d2',
                    fontWeight: 600,
                    fontSize: '0.95rem',
                    borderBottom: '2px solid #e3f2fd',
                    whiteSpace: 'nowrap'
                  }}
                >Topic</TableCell>
                <TableCell 
                  align="center"
                  sx={{
                    color: '#1976d2',
                    fontWeight: 600,
                    fontSize: '0.95rem',
                    borderBottom: '2px solid #e3f2fd',
                    whiteSpace: 'nowrap'
                  }}
                >Description</TableCell>
                <TableCell 
                  align="center"
                  sx={{
                    color: '#1976d2',
                    fontWeight: 600,
                    fontSize: '0.95rem',
                    borderBottom: '2px solid #e3f2fd',
                    whiteSpace: 'nowrap'
                  }}
                >Objective</TableCell>
                <TableCell 
                  align="center"
                  sx={{
                    color: '#1976d2',
                    fontWeight: 600,
                    fontSize: '0.95rem',
                    borderBottom: '2px solid #e3f2fd',
                    whiteSpace: 'nowrap'
                  }}
                >Required Tools</TableCell>
                <TableCell 
                  align="center"
                  sx={{
                    color: '#1976d2',
                    fontWeight: 600,
                    fontSize: '0.95rem',
                    borderBottom: '2px solid #e3f2fd',
                    whiteSpace: 'nowrap',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 0.5
                  }}
                  onClick={handleSortClick}
                >
                  Duration per week (Hours)
                  <Box component="span" sx={{ display: 'inline-flex', alignItems: 'center' }}>
                    {sortOrder === "asc" ? "↑" : "↓"}
                  </Box>
                </TableCell>
                <TableCell 
                  align="center"
                  sx={{
                    color: '#1976d2',
                    fontWeight: 600,
                    fontSize: '0.95rem',
                    borderBottom: '2px solid #e3f2fd',
                    whiteSpace: 'nowrap'
                  }}
                >Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {displayedData.filter(Boolean).map((row) => (
                <TableRow key={row.id}>
                  <TableCell align="center">{row.topic}</TableCell>
                  <TableCell align="center">{row.description}</TableCell>
                  <TableCell align="center">{row.objective}</TableCell>
                  <TableCell align="center">{row.toolsRequired}</TableCell>
                  <TableCell align="center">{row.duration}</TableCell>
                  <TableCell align="center">
                    <Box sx={{ display: "flex", gap: 1, justifyContent: "center" }}>
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
                        size="small"
                        onClick={() => showModal(row)}
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
            component="div"
            count={filteredAndSortedData.length}
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

      {/* Create/Edit Modal */}
      <Dialog open={isModalOpen} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>{editingId ? "Edit Lesson" : "Create New Lesson"}</DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2, pt: 1 }}>
              <TextField
                label="Topic"
                inputRef={topicRef}
                fullWidth
                required
              />
              <TextField
                label="Description"
                inputRef={descriptionRef}
                fullWidth
                multiline
                rows={2}
                required
              />
              <TextField
                label="Objective"
                inputRef={objectiveRef}
                fullWidth
                multiline
                rows={2}
                required
              />
              <TextField
                label="Required Tools"
                inputRef={toolsRequiredRef}
                fullWidth
                required
              />
              <TextField
                label="Duration (Hours)"
                inputRef={durationRef}
                type="number"
                fullWidth
                required
                inputProps={{ min: 1 }}
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
                "Update"
              ) : (
                "Create"
              )}
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      {/* Detail Modal */}
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
          Lesson Details
        </DialogTitle>
        <DialogContent>
          {isLoadingSyllabuses ? (
            <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "300px" }}>
              <CircularProgress size={40} />
            </Box>
          ) : syllabusesData?.data?.data ? (
            <Box sx={{ p: 3 }}>
              {/* Lesson Info */}
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
                  },
                  '& .MuiTableRow-root': {
                    '&:last-child td, &:last-child th': {
                      borderBottom: 0
                    }
                  }
                }}
              >
                <Table>
                  <TableBody>
                    {displayedData.find(lesson => lesson.id === viewDetailId) && (
                      <>
                        <TableRow>
                          <TableCell 
                            sx={{ 
                              width: '20%',
                              bgcolor: '#f8f9fa',
                              fontWeight: 600,
                              color: '#1976d2'
                            }}
                          >
                            Topic
                          </TableCell>
                          <TableCell sx={{ whiteSpace: 'pre-wrap' }}>
                            {displayedData.find(lesson => lesson.id === viewDetailId).topic}
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
                            Description
                          </TableCell>
                          <TableCell sx={{ whiteSpace: 'pre-wrap' }}>
                            {displayedData.find(lesson => lesson.id === viewDetailId).description}
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
                            Duration
                          </TableCell>
                          <TableCell>
                            {displayedData.find(lesson => lesson.id === viewDetailId).duration} hours
                          </TableCell>
                        </TableRow>
                      </>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>

              {/* Syllabuses Section */}
              <Box sx={{ mt: 4 }}>
                <Paper 
                  elevation={0} 
                  sx={{ 
                    p: 3,
                    border: '1px solid #e0e0e0',
                    borderRadius: 2
                  }}
                >
                  <Typography
                    variant="h6"
                    sx={{
                      color: '#1976d2',
                      fontWeight: 600,
                      mb: 3,
                      pb: 2,
                      borderBottom: '2px solid #e3f2fd',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1
                    }}
                  >
                    <Box 
                      component="span" 
                      sx={{ 
                        width: 6, 
                        height: 24, 
                        bgcolor: '#1976d2', 
                        display: 'inline-block',
                        borderRadius: 1,
                        mr: 1
                      }}
                    />
                    Syllabuses Using This Lesson
                  </Typography>

                  {syllabusesData.data.data.length > 0 ? (
                    <Grid 
                      container 
                      spacing={2.5} 
                      sx={{ 
                        px: { xs: 0, sm: 2 },
                        mx: { xs: -1, sm: -2 }
                      }}
                    >
                      {syllabusesData.data.data.map((syllabus) => (
                        <Grid item xs={12} sm={6} md={4} lg={3} key={syllabus.id}>
                          <Paper
                            elevation={0}
                            sx={{
                              p: 2.5,
                              height: '100%',
                              bgcolor: '#fff',
                              border: '1px solid #e0e0e0',
                              borderRadius: 2,
                              transition: 'all 0.2s ease',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              cursor: 'pointer',
                              '&:hover': {
                                bgcolor: '#f5f5f5',
                                borderColor: '#1976d2',
                                transform: 'translateY(-2px)',
                                boxShadow: '0 4px 8px rgba(0,0,0,0.05)'
                              }
                            }}
                          >
                            <Typography
                              sx={{
                                fontWeight: 500,
                                color: '#2c3e50',
                                textAlign: 'center',
                                lineHeight: 1.3,
                                fontSize: '0.95rem'
                              }}
                            >
                              {syllabus.subject}
                            </Typography>
                          </Paper>
                        </Grid>
                      ))}
                    </Grid>
                  ) : (
                    <Paper
                      elevation={0}
                      sx={{
                        p: 3,
                        textAlign: 'center',
                        bgcolor: '#f8f9fa',
                        border: '1px solid #e0e0e0',
                        borderRadius: 2
                      }}
                    >
                      <Typography color="text.secondary">
                        This lesson is not used in any syllabus yet.
                      </Typography>
                    </Paper>
                  )}
                </Paper>
              </Box>
            </Box>
          ) : (
            <Box sx={{ p: 4, textAlign: "center" }}>
              <Typography color="error" sx={{ fontSize: "1.1rem", fontWeight: 500 }}>
                Failed to load lesson details.
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
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default LessonManage;
