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
  // State quản lý modal, paging, search, sort, snackbar
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

  // Refs for form inputs
  const topicRef = useRef();
  const descriptionRef = useRef();
  const objectiveRef = useRef();
  const toolsRequiredRef = useRef();
  const durationRef = useRef();

  // Hooks API
  const { data: lessonResponse, isLoading, error } = useLessonList();
  const createLessonMutation = useCreateLesson();
  const updateLessonMutation = useUpdateLesson();
  const { data: syllabusesData, isLoading: isLoadingSyllabuses } =
    useLessonSyllabuses(viewDetailId);

  // Extract lessonList safely
  const lessonList = lessonResponse?.data?.data || [];
  const totalItems = lessonList.length;

  // Handle fetch error (e.g., 403)
  useEffect(() => {
    if (error?.response?.status === 403) {
      setSnackbar({
        open: true,
        message: "You do not have permission to access this resource.",
        severity: "error",
      });
    }
  }, [error]);

  // Handle mutation errors
  useEffect(() => {
    const handleMutationError = (err) => {
      if (err?.response?.status === 403) {
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

  // Mở modal Create/Edit, gán giá trị vào refs
  const showModal = (record = null) => {
    // Delay 0 cho refs tồn tại
    setTimeout(() => {
      if (record) {
        topicRef.current.value = record.topic ?? "";
        descriptionRef.current.value = record.description ?? "";
        objectiveRef.current.value = record.objective ?? "";
        toolsRequiredRef.current.value = record.toolsRequired ?? "";
        durationRef.current.value =
          record.duration != null ? String(record.duration) : "";
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

  // Submit Create/Edit
  const handleSubmit = async (e) => {
    e.preventDefault();
    const topic = topicRef.current.value.trim();
    const description = descriptionRef.current.value.trim();
    const objective = objectiveRef.current.value.trim();
    const toolsRequired = toolsRequiredRef.current.value.trim();
    const durationVal = Number(durationRef.current.value);

    // Validate cơ bản
    if (!topic) {
      setSnackbar({
        open: true,
        message: "Topic is required",
        severity: "error",
      });
      return;
    }
    if (isNaN(durationVal) || durationVal <= 0) {
      setSnackbar({
        open: true,
        message: "Duration must be a positive number",
        severity: "error",
      });
      return;
    }

    const data = {
      topic,
      description,
      objective,
      toolsRequired,
      duration: durationVal,
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
    } catch (err) {
      setSnackbar({
        open: true,
        message: err?.response?.data?.message || "Failed to process request",
        severity: "error",
      });
    }
  };

  const handleChangePage = (_, newPage) => setPage(newPage);
  const handleChangeRowsPerPage = (e) => {
    setRowsPerPage(parseInt(e.target.value, 10));
    setPage(0);
  };
  const handleCloseSnackbar = () =>
    setSnackbar((prev) => ({ ...prev, open: false }));

  // Filter + Sort: guard null và optional chaining
  const filteredAndSortedData = (lessonList || [])
    .filter((lesson) => {
      if (!lesson) return false;
      const searchLower = searchQuery.trim().toLowerCase();
      if (!searchLower) return true;
      return (
        lesson.topic?.toLowerCase().includes(searchLower) ||
        lesson.description?.toLowerCase().includes(searchLower) ||
        lesson.objective?.toLowerCase().includes(searchLower) ||
        lesson.toolsRequired?.toLowerCase().includes(searchLower)
      );
    })
    .sort((a, b) => {
      // Nếu duration không number, gán Infinity để xếp cuối
      const da = typeof a.duration === "number" ? a.duration : Infinity;
      const db = typeof b.duration === "number" ? b.duration : Infinity;
      return sortOrder === "asc" ? da - db : db - da;
    });

  const displayedData = filteredAndSortedData.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  const handleSortClick = () => {
    setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
  };

  // Tìm detail dựa trên toàn bộ lessonList, guard null
  const lessonDetail = (lessonList || []).find(
    (l) => l && l.id === viewDetailId
  );

  return (
    <Box sx={{ p: 3 }}>
      {/* Header + Create */}
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
          onClick={() => showModal(null)}
        >
          Create New Lesson
        </Button>
      </Box>

      {/* Search */}
      <Box
        sx={{
          mb: 3,
          display: "flex",
          gap: 2,
          alignItems: "center",
          flexWrap: "wrap",
        }}
      >
        <TextField
          size="small"
          label="Search lessons"
          variant="outlined"
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            setPage(0);
          }}
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

      {/* Table */}
      {isLoading ? (
        <Box sx={{ display: "flex", justifyContent: "center", p: 3 }}>
          <CircularProgress />
        </Box>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: '#e3f2fd' }}>
                <TableCell align="center" sx={{ color: '#1976d2', fontWeight: 'bold', fontSize: '1.05rem' }}>Topic</TableCell>
                <TableCell align="center" sx={{ color: '#1976d2', fontWeight: 'bold', fontSize: '1.05rem' }}>Description</TableCell>
                <TableCell align="center" sx={{ color: '#1976d2', fontWeight: 'bold', fontSize: '1.05rem' }}>Objective</TableCell>
                <TableCell align="center" sx={{ color: '#1976d2', fontWeight: 'bold', fontSize: '1.05rem' }}>Required Tools</TableCell>
                <TableCell align="center" sx={{ color: '#1976d2', fontWeight: 'bold', fontSize: '1.05rem' }}>Duration per week (Hours)</TableCell>
                <TableCell align="center" sx={{ color: '#1976d2', fontWeight: 'bold', fontSize: '1.05rem' }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {displayedData.map((row) => {
                if (!row) return null;
                return (
                  <TableRow key={row.id}>
                    <TableCell align="center">{row.topic ?? "-"}</TableCell>
                    <TableCell align="center">{row.description ?? "-"}</TableCell>
                    <TableCell align="center">{row.objective ?? "-"}</TableCell>
                    <TableCell align="center">{row.toolsRequired ?? "-"}</TableCell>
                    <TableCell align="center">{typeof row.duration === "number" ? row.duration : "-"}</TableCell>
                    <TableCell align="center">
                      <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
                        <Button
                          variant="contained"
                          sx={{
                            backgroundColor: '#42a5f5',
                            color: '#fff',
                            minWidth: 80,
                            '&:hover': { backgroundColor: '#1976d2' },
                            fontWeight: 600
                          }}
                          onClick={() => handleViewDetail(row.id)}
                          size="small"
                        >
                          View
                        </Button>
                        <Button
                          variant="contained"
                          sx={{
                            backgroundColor: '#1976d2',
                            color: '#fff',
                            minWidth: 80,
                            '&:hover': { backgroundColor: '#1565c0' },
                            fontWeight: 600
                          }}
                          onClick={() => showModal(row)}
                          size="small"
                        >
                          Edit
                        </Button>
                      </Box>
                    </TableCell>
                  </TableRow>
                );
              })}
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
        <DialogTitle>
          {editingId ? "Edit Lesson" : "Create New Lesson"}
        </DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent>
            <Box
              sx={{ display: "flex", flexDirection: "column", gap: 2, pt: 1 }}
            >
              <TextField label="Topic" inputRef={topicRef} fullWidth required />
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
              />
              <TextField
                label="Duration per week (Hours)"
                inputRef={durationRef}
                type="number"
                fullWidth
                required
                inputProps={{ min: 1, max: 1000 }}
              />
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              disabled={
                createLessonMutation.isPending || updateLessonMutation.isPending
              }
            >
              {createLessonMutation.isPending ||
              updateLessonMutation.isPending ? (
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
          ) : (
            <Box sx={{ p: 3 }}>
              {/* Lesson Info */}
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
                  "& .MuiTableRow-root": {
                    "&:last-child td, &:last-child th": {
                      borderBottom: 0,
                    },
                  },
                }}
              >
                <Table>
                  <TableBody>
                    {lessonDetail ? (
                      <>
                        <TableRow>
                          <TableCell
                            sx={{
                              width: "20%",
                              bgcolor: "#f8f9fa",
                              fontWeight: 600,
                              color: "#1976d2",
                            }}
                          >
                            Topic
                          </TableCell>
                          <TableCell sx={{ whiteSpace: "pre-wrap" }}>
                            {lessonDetail.topic ?? "-"}
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
                            Description
                          </TableCell>
                          <TableCell sx={{ whiteSpace: "pre-wrap" }}>
                            {lessonDetail.description ?? "-"}
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
                            Objective
                          </TableCell>
                          <TableCell sx={{ whiteSpace: "pre-wrap" }}>
                            {lessonDetail.objective ?? "-"}
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
                            Required Tools
                          </TableCell>
                          <TableCell sx={{ whiteSpace: "pre-wrap" }}>
                            {lessonDetail.toolsRequired ?? "-"}
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
                            Duration
                          </TableCell>
                          <TableCell>
                            {typeof lessonDetail.duration === "number"
                              ? lessonDetail.duration
                              : "-"}{" "}
                            hours
                          </TableCell>
                        </TableRow>
                      </>
                    ) : (
                      <TableRow>
                        <TableCell colSpan={2} align="center">
                          Lesson not found.
                        </TableCell>
                      </TableRow>
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
                    border: "1px solid #e0e0e0",
                    borderRadius: 2,
                  }}
                >
                  <Typography
                    variant="h6"
                    sx={{
                      color: "#1976d2",
                      fontWeight: 600,
                      mb: 3,
                      pb: 2,
                      borderBottom: "2px solid #e3f2fd",
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                    }}
                  >
                    <Box
                      component="span"
                      sx={{
                        width: 6,
                        height: 24,
                        bgcolor: "#1976d2",
                        display: "inline-block",
                        borderRadius: 1,
                        mr: 1,
                      }}
                    />
                    Syllabuses Using This Lesson
                  </Typography>

                  {syllabusesData?.data?.data?.length > 0 ? (
                    <Grid
                      container
                      spacing={2.5}
                      sx={{
                        px: { xs: 0, sm: 2 },
                        mx: { xs: -1, sm: -2 },
                      }}
                    >
                      {syllabusesData.data.data.map((syllabus) => (
                        <Grid
                          item
                          xs={12}
                          sm={6}
                          md={4}
                          lg={3}
                          key={syllabus.id}
                        >
                          <Paper
                            elevation={0}
                            sx={{
                              p: 2.5,
                              height: "100%",
                              bgcolor: "#fff",
                              border: "1px solid #e0e0e0",
                              borderRadius: 2,
                              transition: "all 0.2s ease",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              cursor: "pointer",
                              "&:hover": {
                                bgcolor: "#f5f5f5",
                                borderColor: "#1976d2",
                                transform: "translateY(-2px)",
                                boxShadow: "0 4px 8px rgba(0,0,0,0.05)",
                              },
                            }}
                          >
                            <Typography
                              sx={{
                                fontWeight: 500,
                                color: "#2c3e50",
                                textAlign: "center",
                                lineHeight: 1.3,
                                fontSize: "0.95rem",
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
                        textAlign: "center",
                        bgcolor: "#f8f9fa",
                        border: "1px solid #e0e0e0",
                        borderRadius: 2,
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

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
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
