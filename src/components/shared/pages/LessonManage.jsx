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
  Card,
  Divider,
  Stack,
} from "@mui/material";
import { useEffect, useRef, useState } from "react";
import EditIcon from "@mui/icons-material/Edit";
import VisibilityIcon from "@mui/icons-material/Visibility";
import LibraryBooksIcon from "@mui/icons-material/LibraryBooks";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import InfoIcon from "@mui/icons-material/Info";

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
        durationRef.current.value =
          record.duration != null ? String(record.duration) : "";
        setEditingId(record.id);
      } else {
        topicRef.current.value = "";
        descriptionRef.current.value = "";
        objectiveRef.current.value = "";
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
    const durationVal = Number(durationRef.current.value);

    // Validate cơ bản
    if (!topic) {
      setSnackbar({
        open: true,
        message: "Lesson name is required",
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
        lesson.objective?.toLowerCase().includes(searchLower)
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
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <LibraryBooksIcon sx={{ color: "#1976d2", fontSize: 38 }} />
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
          onClick={() => showModal(null)}
          startIcon={<AddCircleOutlineIcon />}
        >
          CREATE NEW LESSON
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
          placeholder="Search by lesson name, description, or objective..."
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
        <TableContainer
          component={Paper}
          sx={{
            borderRadius: 3,
            boxShadow: "0 4px 24px rgba(25,118,210,0.08)",
            overflow: "hidden",
            border: "1.5px solid #e3f2fd",
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
                  Lesson Name
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
                  Description
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
                  Objective
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
                  Duration per week (Hours)
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
              {displayedData.map((row) => {
                if (!row) return null;
                return (
                  <TableRow
                    key={row.id}
                    sx={{
                      transition: "background 0.2s",
                      "&:hover": { backgroundColor: "#f1f8fd" },
                      "&:last-child td, &:last-child th": { borderBottom: 0 },
                    }}
                  >
                    <TableCell align="center" sx={{ fontWeight: 600 }}>
                      {row.topic ?? "-"}
                    </TableCell>
                    <TableCell align="center">
                      {row.description ?? "-"}
                    </TableCell>
                    <TableCell align="center">{row.objective ?? "-"}</TableCell>
                    <TableCell align="center">
                      {typeof row.duration === "number" ? row.duration : "-"}
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
                            backgroundColor: "#1976d2",
                            color: "#fff",
                            minWidth: 44,
                            borderRadius: 2,
                            boxShadow: "0 2px 8px rgba(25,118,210,0.10)",
                            "&:hover": { backgroundColor: "#1565c0" },
                            fontWeight: 600,
                            p: 1.2,
                          }}
                          onClick={() => showModal(row)}
                          size="small"
                          startIcon={<EditIcon />}
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

      {/* Create/Edit Modal */}
      <Dialog
        open={isModalOpen}
        onClose={handleClose}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            minHeight: "60vh",
            display: "flex",
            flexDirection: "column",
            borderRadius: 4,
            boxShadow: "0 8px 32px rgba(25,118,210,0.18)",
            border: "2px solid #e3f2fd",
            background: "linear-gradient(120deg, #f8fafc 60%, #e3f2fd 100%)",
          },
        }}
      >
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
          {editingId ? (
            <EditIcon sx={{ color: "#1976d2", fontSize: 28 }} />
          ) : (
            <AddCircleOutlineIcon sx={{ color: "#1976d2", fontSize: 28 }} />
          )}
          {editingId ? "Edit Lesson" : "Create New Lesson"}
        </DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent sx={{ px: 4, py: 3 }}>
            <Stack spacing={3} sx={{ pt: 2 }}>
              <TextField
                label="Lesson Name"
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
                label="Duration per week (Hours)"
                inputRef={durationRef}
                type="number"
                fullWidth
                required
                inputProps={{ min: 1, max: 1000 }}
              />
            </Stack>
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
            <Button
              type="submit"
              variant="contained"
              sx={{
                minWidth: 120,
                backgroundColor: "#1976d2",
                color: "#fff",
                fontWeight: 700,
                borderRadius: 2,
                boxShadow: "0 2px 8px rgba(25,118,210,0.12)",
                fontSize: "1.08rem",
                "&:hover": {
                  backgroundColor: "#1565c0",
                  boxShadow: "0 4px 16px rgba(25,118,210,0.18)",
                },
              }}
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
        maxWidth="lg"
        fullWidth
        sx={{
          "& .MuiDialog-paper": {
            borderRadius: 4,
            background: "linear-gradient(120deg, #f8fafc 60%, #e3f2fd 100%)",
            boxShadow: "0 8px 32px rgba(25,118,210,0.18)",
            p: 0,
            fontFamily: "Inter, Roboto, Arial, sans-serif",
            maxHeight: "90vh",
            overflow: "hidden",
          },
        }}
      >
        <DialogTitle
          sx={{
            textAlign: "center",
            borderBottom: "2px solid #e3f2fd",
            background: "linear-gradient(90deg, #e3f2fd 60%, #fff 100%)",
            color: "#1976d2",
            fontWeight: 900,
            fontSize: "2rem",
            py: 3,
            letterSpacing: 1,
            fontFamily: "Inter, Roboto, Arial, sans-serif",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 2,
          }}
        >
          <LibraryBooksIcon sx={{ fontSize: 32, color: "#1976d2" }} />
          Lesson Details
        </DialogTitle>
        <DialogContent sx={{ p: 0, overflow: "auto", maxHeight: "calc(90vh - 140px)" }}>
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
            <Box
              sx={{
                p: { xs: 2, sm: 4 },
                fontFamily: "Inter, Roboto, Arial, sans-serif",
              }}
            >
              {/* Lesson Information Section */}
              <Card
                sx={{
                  mb: 4,
                  borderRadius: 4,
                  boxShadow: "0 4px 24px rgba(56,189,248,0.10)",
                  borderLeft: "6px solid #1976d2",
                  background: "linear-gradient(90deg, #e3f0fd 60%, #fff 100%)",
                  overflow: "hidden",
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 2,
                    px: 3,
                    py: 2.5,
                    background: "linear-gradient(90deg, #e3f2fd 60%, #bbdefb 100%)",
                    borderTopLeftRadius: 18,
                    borderTopRightRadius: 18,
                  }}
                >
                  <LibraryBooksIcon sx={{ color: "#1976d2", fontSize: 32 }} />
                  <Typography
                    sx={{
                      fontWeight: 700,
                      fontSize: "1.25rem",
                      color: "#1976d2",
                      fontFamily: "inherit",
                    }}
                  >
                    Lesson Information
                  </Typography>
                </Box>
                
                {lessonDetail ? (
                  <Box sx={{ p: 3 }}>
                    {/* Header with Lesson ID and Duration */}
                    <Box sx={{ mb: 3 }}>
                      <Grid container spacing={3}>
                        <Grid item xs={12} sm={6}>
                          <Card
                            sx={{
                              bgcolor: "#e3f2fd",
                              borderRadius: 3,
                              p: 2.5,
                              height: "100%",
                              display: "flex",
                              flexDirection: "column",
                              alignItems: "flex-start",
                              justifyContent: "center",
                              border: "2px solid #bbdefb",
                            }}
                          >
                            <Typography
                              sx={{
                                color: "#666",
                                fontWeight: 600,
                                fontSize: "1.08rem",
                                mb: 1,
                                fontFamily: "inherit",
                              }}
                            >
                              Lesson ID
                            </Typography>
                            <Typography
                              sx={{
                                color: "#1976d2",
                                fontWeight: 700,
                                fontSize: "1.25rem",
                                letterSpacing: 0.5,
                                fontFamily: "inherit",
                              }}
                            >
                              #{lessonDetail.id}
                            </Typography>
                          </Card>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <Card
                            sx={{
                              bgcolor: "#e3f2fd",
                              borderRadius: 3,
                              p: 2.5,
                              height: "100%",
                              display: "flex",
                              flexDirection: "column",
                              alignItems: "flex-start",
                              justifyContent: "center",
                              border: "2px solid #bbdefb",
                            }}
                          >
                            <Typography
                              sx={{
                                color: "#666",
                                fontWeight: 600,
                                fontSize: "1.08rem",
                                mb: 1,
                                fontFamily: "inherit",
                              }}
                            >
                              Duration per Week
                            </Typography>
                            <Typography
                              sx={{
                                color: "#1976d2",
                                fontWeight: 700,
                                fontSize: "1.25rem",
                                letterSpacing: 0.5,
                                fontFamily: "inherit",
                              }}
                            >
                              {typeof lessonDetail.duration === "number"
                                ? `${lessonDetail.duration} hours`
                                : "N/A"}
                            </Typography>
                          </Card>
                        </Grid>
                      </Grid>
                    </Box>

                    <Divider
                      sx={{
                        my: 3,
                        background: "#bbdefb",
                        height: 2,
                        borderRadius: 1,
                      }}
                    />

                    {/* Lesson Name */}
                    <Card
                      sx={{
                        bgcolor: "#e3f2fd",
                        borderRadius: 3,
                        p: 2.5,
                        mb: 3,
                        border: "2px solid #bbdefb",
                      }}
                    >
                      <Typography
                        sx={{
                          color: "#666",
                          fontWeight: 600,
                          fontSize: "1.08rem",
                          mb: 1,
                          fontFamily: "inherit",
                        }}
                      >
                        Lesson Name
                      </Typography>
                      <Typography
                        sx={{
                          color: "#1976d2",
                          fontWeight: 700,
                          fontSize: "1.5rem",
                          fontFamily: "inherit",
                          whiteSpace: "pre-line",
                          lineHeight: 1.4,
                        }}
                      >
                        {lessonDetail.topic ?? "N/A"}
                      </Typography>
                    </Card>

                    <Divider
                      sx={{
                        my: 3,
                        background: "#bbdefb",
                        height: 2,
                        borderRadius: 1,
                      }}
                    />

                    {/* Objective */}
                    <Card
                      sx={{
                        bgcolor: "#e3f2fd",
                        borderRadius: 3,
                        p: 2.5,
                        mb: 3,
                        border: "2px solid #bbdefb",
                      }}
                    >
                      <Typography
                        sx={{
                          color: "#666",
                          fontWeight: 600,
                          fontSize: "1.08rem",
                          mb: 1,
                          fontFamily: "inherit",
                        }}
                      >
                        Learning Objective
                      </Typography>
                      <Typography
                        sx={{
                          color: "#1976d2",
                          fontWeight: 600,
                          fontSize: "1.15rem",
                          fontFamily: "inherit",
                          whiteSpace: "pre-line",
                          lineHeight: 1.6,
                        }}
                      >
                        {lessonDetail.objective ?? "N/A"}
                      </Typography>
                    </Card>

                    <Divider
                      sx={{
                        my: 3,
                        background: "#bbdefb",
                        height: 2,
                        borderRadius: 1,
                      }}
                    />

                    {/* Description */}
                    <Card
                      sx={{
                        bgcolor: "#e3f2fd",
                        borderRadius: 3,
                        p: 2.5,
                        mb: 0,
                        border: "2px solid #bbdefb",
                      }}
                    >
                      <Typography
                        sx={{
                          color: "#666",
                          fontWeight: 600,
                          fontSize: "1.08rem",
                          mb: 1,
                          fontFamily: "inherit",
                        }}
                      >
                        Lesson Description
                      </Typography>
                      <Typography
                        sx={{
                          color: "#1976d2",
                          fontWeight: 600,
                          fontSize: "1.15rem",
                          fontFamily: "inherit",
                          whiteSpace: "pre-line",
                          lineHeight: 1.6,
                        }}
                      >
                        {lessonDetail.description ?? "N/A"}
                      </Typography>
                    </Card>
                  </Box>
                ) : (
                  <Box sx={{ p: 4, textAlign: "center" }}>
                    <Typography
                      color="error"
                      sx={{ fontSize: "1.1rem", fontWeight: 500 }}
                    >
                      Lesson not found.
                    </Typography>
                  </Box>
                )}
              </Card>

              {/* Syllabuses Section */}
              <Card
                sx={{
                  borderRadius: 4,
                  boxShadow: "0 4px 24px rgba(34,197,94,0.10)",
                  borderLeft: "6px solid #16a34a",
                  background: "linear-gradient(90deg, #e8fbe9 60%, #fff 100%)",
                  overflow: "hidden",
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 2,
                    px: 3,
                    py: 2.5,
                    background: "linear-gradient(90deg, #e8fbe9 60%, #bbf7d0 100%)",
                    borderTopLeftRadius: 18,
                    borderTopRightRadius: 18,
                  }}
                >
                  <LibraryBooksIcon sx={{ color: "#16a34a", fontSize: 32 }} />
                  <Typography
                    sx={{
                      fontWeight: 700,
                      fontSize: "1.25rem",
                      color: "#16a34a",
                      fontFamily: "inherit",
                    }}
                  >
                    Syllabuses Using This Lesson
                  </Typography>
                </Box>
                
                <Box sx={{ p: 3 }}>
                  {syllabusesData?.data?.data?.length > 0 ? (
                    <Grid container spacing={3}>
                      {syllabusesData.data.data.map((syllabus) => (
                        <Grid
                          item
                          xs={12}
                          sm={6}
                          md={4}
                          lg={3}
                          key={syllabus.id}
                        >
                          <Card
                            sx={{
                              p: 2.5,
                              borderRadius: 3,
                              bgcolor: "#fff",
                              boxShadow: "0 2px 8px rgba(34,197,94,0.10)",
                              border: "2px solid #bbf7d0",
                              display: "flex",
                              alignItems: "center",
                              gap: 2,
                              transition: "all 0.2s",
                              cursor: "pointer",
                              "&:hover": {
                                bgcolor: "#f0fdfa",
                                boxShadow: "0 6px 16px rgba(34,197,94,0.18)",
                                transform: "translateY(-2px) scale(1.03)",
                                borderColor: "#16a34a",
                              },
                            }}
                          >
                            <LibraryBooksIcon
                              sx={{ color: "#16a34a", fontSize: 28 }}
                            />
                            <Box sx={{ flex: 1 }}>
                              <Typography
                                sx={{
                                  fontWeight: 700,
                                  color: "#222",
                                  fontSize: "1.08rem",
                                  fontFamily: "inherit",
                                  mb: 0.5,
                                }}
                              >
                                {syllabus.subject}
                              </Typography>
                              <Typography
                                sx={{
                                  color: "#666",
                                  fontSize: "0.9rem",
                                  fontFamily: "inherit",
                                }}
                              >
                                Syllabus ID: #{syllabus.id}
                              </Typography>
                            </Box>
                          </Card>
                        </Grid>
                      ))}
                    </Grid>
                  ) : (
                    <Card
                      sx={{
                        p: 4,
                        textAlign: "center",
                        bgcolor: "#f8f9fa",
                        border: "2px solid #e0e0e0",
                        borderRadius: 3,
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        gap: 2,
                      }}
                    >
                      <LibraryBooksIcon
                        sx={{ color: "#bdbdbd", fontSize: 48, mb: 1 }}
                      />
                      <Typography
                        color="text.secondary"
                        fontWeight={600}
                        fontSize="1.1rem"
                        sx={{ fontFamily: "inherit" }}
                      >
                        This lesson is not used in any syllabus yet.
                      </Typography>
                      <Typography
                        color="text.secondary"
                        fontSize="0.9rem"
                        sx={{ fontFamily: "inherit" }}
                      >
                        The lesson will appear here once it's added to a syllabus.
                      </Typography>
                    </Card>
                  )}
                </Box>
              </Card>
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
              fontWeight: 700,
              borderRadius: 2,
              fontSize: "1.08rem",
              boxShadow: "0 2px 8px rgba(25,118,210,0.12)",
              fontFamily: "inherit",
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
