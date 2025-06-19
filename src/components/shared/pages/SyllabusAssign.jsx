import React, { useState, useEffect, useMemo } from "react";
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Checkbox,
  CircularProgress,
  Alert,
  Snackbar,
  Button,
  IconButton,
  Tooltip,
} from "@mui/material";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspace";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import {
  useUnassignedLessons,
  useAssignedLessons,
  useAssignLessons,
} from "@hooks/useSyllabusLesson";

const SyllabusAssign = () => {
  const { id: syllabusId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const syllabusData = location.state?.syllabusData;

  // UI lists and original topics (for diffing new assignments)
  const [uiAssignedLessons, setUiAssignedLessons] = useState([]);
  const [uiUnassignedLessons, setUiUnassignedLessons] = useState([]);

  // Selection state in UI tables
  const [selectedUIUnassigned, setSelectedUIUnassigned] = useState([]);
  const [selectedUIAssigned, setSelectedUIAssigned] = useState([]);

  // Snackbar state
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  // Fetch from API via custom hooks (React Query or similar)
  const {
    data: unassignedData,
    isLoading: isLoadingUnassigned,
    isError: isErrorUnassigned,
    error: errorUnassigned,
    refetch: refetchUnassigned,
  } = useUnassignedLessons(syllabusId);

  const {
    data: assignedData,
    isLoading: isLoadingAssigned,
    isError: isErrorAssigned,
    error: errorAssigned,
  } = useAssignedLessons(syllabusId);

  // Initialize UI lists when assignedData/unassignedData arrive
  useEffect(() => {
    refetchUnassigned();
  }, [syllabusId]);

  useEffect(() => {
    if (assignedData?.data?.data && unassignedData?.data?.data) {
      const assignedLessons = assignedData.data.data;
      const unassignedLessons = unassignedData.data.data;
      setUiAssignedLessons(assignedLessons);
      setUiUnassignedLessons(unassignedLessons);
      setSelectedUIAssigned([]);
      setSelectedUIUnassigned([]);
    }
  }, [assignedData, unassignedData]);

  // If no syllabusId or missing syllabusData, show an error
  if (!syllabusId || !syllabusData) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error">
          No syllabus data available. Please return to the syllabus list.
        </Alert>
      </Box>
    );
  }

  // Compute totals and checks:
  // totalAssignedHoursPerWeek from current UI-assigned lessons
  const totalAssignedHoursPerWeek = useMemo(
    () =>
      uiAssignedLessons.reduce(
        (sum, lesson) => sum + (Number(lesson.duration) || 0),
        0
      ),
    [uiAssignedLessons]
  );

  const numberOfWeek = Number(syllabusData.numberOfWeek) || 0;
  const maxHoursAllowed = Number(syllabusData.maxHoursOfSyllabus) || 0;
  // Total hours after current UI changes (per week sum * weeks)
  const totalHourAfterUI = totalAssignedHoursPerWeek * numberOfWeek;
  const isExceedMax = totalHourAfterUI != maxHoursAllowed;

  // Mutation hook for assign
  const assignLessonsMutation = useAssignLessons();

  // Save handler: only assign new lessons (those in uiAssignedLessons that were not in originalAssignedTopics)
  const handleSave = async () => {
    const uiAssignedTopics = uiAssignedLessons.map((l) => l.topic);

    // (Nếu không cần dùng totalHourAfterUI, có thể bỏ phần tính toán này luôn)
    // const totalAssignedHoursPerWeek = uiAssignedLessons.reduce(
    //   (sum, lesson) => sum + (Number(lesson.duration) || 0), 0
    // );
    // const totalHourAfterUI = totalAssignedHoursPerWeek * maxWeeks;

    try {
      const result = await assignLessonsMutation.mutateAsync({
        id: syllabusId,
        lessonNames: uiAssignedTopics,
      });
      const successMsg = result?.message || "Assignment saved successfully";
      setSnackbar({
        open: true,
        message: successMsg,
        severity: "success",
      });
      setSelectedUIAssigned([]);
      setSelectedUIUnassigned([]);
    } catch (error) {
      console.error("Assignment error:", error);
      setSnackbar({
        open: true,
        message: error.response?.data?.message || "Failed to save assignment",
        severity: "error",
      });
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  // Handlers for selecting in Unassigned UI table
  const handleSelectAllUIUnassigned = (event) => {
    if (event.target.checked) {
      setSelectedUIUnassigned(uiUnassignedLessons.map((l) => l.topic));
    } else {
      setSelectedUIUnassigned([]);
    }
  };
  const handleSelectUIUnassigned = (lesson) => {
    setSelectedUIUnassigned((prev) =>
      prev.includes(lesson.topic)
        ? prev.filter((t) => t !== lesson.topic)
        : [...prev, lesson.topic]
    );
  };

  // Handlers for selecting in Assigned UI table
  const handleSelectAllUIAssigned = (event) => {
    if (event.target.checked) {
      setSelectedUIAssigned(uiAssignedLessons.map((l) => l.topic));
    } else {
      setSelectedUIAssigned([]);
    }
  };
  const handleSelectUIAssigned = (lesson) => {
    setSelectedUIAssigned((prev) =>
      prev.includes(lesson.topic)
        ? prev.filter((t) => t !== lesson.topic)
        : [...prev, lesson.topic]
    );
  };

  // Move UI: assign selected from Unassigned -> Assigned
  const handleAssignUI = () => {
    if (selectedUIUnassigned.length === 0) return;
    const toMove = uiUnassignedLessons.filter((l) =>
      selectedUIUnassigned.includes(l.topic)
    );
    setUiAssignedLessons((prev) => [...prev, ...toMove]);
    setUiUnassignedLessons((prev) =>
      prev.filter((l) => !selectedUIUnassigned.includes(l.topic))
    );
    setSelectedUIUnassigned([]);
  };

  // Move UI: unassign selected from Assigned -> Unassigned (UI only)
  const handleUnassignUI = () => {
    if (selectedUIAssigned.length === 0) return;
    const toMove = uiAssignedLessons.filter((l) =>
      selectedUIAssigned.includes(l.topic)
    );
    setUiUnassignedLessons((prev) => [...prev, ...toMove]);
    setUiAssignedLessons((prev) =>
      prev.filter((l) => !selectedUIAssigned.includes(l.topic))
    );
    setSelectedUIAssigned([]);
  };

  return (
    <Box sx={{ p: 3 }}>
      {/* Back Button */}
      <Box sx={{ mb: 2 }}>
        <Button
          variant="outlined"
          color="primary"
          startIcon={<KeyboardBackspaceIcon />}
          onClick={() => navigate("/user/education/syllabus")}
          sx={{
            borderRadius: 2,
            textTransform: "none",
            "&:hover": {
              backgroundColor: "rgba(25, 118, 210, 0.04)",
            },
          }}
        >
          Back to Syllabus List
        </Button>
      </Box>

      <Paper sx={{ width: "100%", mb: 2, borderRadius: 2, boxShadow: 3 }}>
        {/* Header */}
        <Box
          sx={{
            p: 2,
            borderBottom: "1px solid #e0e0e0",
            background: "linear-gradient(to right, #f3e5f5, #e3f2fd)",
          }}
        >
          <Typography
            variant="h5"
            component="h1"
            align="center"
            sx={{ color: "#1976d2", fontWeight: 600 }}
          >
            {syllabusData.subject}
          </Typography>
          <Typography
            variant="subtitle1"
            align="center"
            sx={{ mt: 1, color: "text.secondary" }}
          >
            Lesson Assignment Management
          </Typography>

          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              gap: 4,
              mt: 1,
            }}
          >
            <Typography
              variant="subtitle2"
              sx={{ color: "#1976d2", fontWeight: 500, fontSize: "1rem" }}
            >
              Hours Per Week of Syllabus: 30
            </Typography>
            <Typography
              variant="subtitle2"
              sx={{ color: "#1976d2", fontWeight: 500, fontSize: "1rem" }}
            >
              Weeks of Syllabus: {syllabusData.numberOfWeek ?? "N/A"}
            </Typography>
          </Box>

          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              mt: 1,
            }}
          >
            <Typography
              variant="subtitle2"
              sx={{ color: "#1976d2", fontWeight: 500, fontSize: "1rem" }}
            >
              Min Lessons Required Per Week: 3 lessons
            </Typography>
          </Box>
        </Box>

        <Typography
          sx={{
            color: isExceedMax ? "#f44336" : "#388e3c",
            fontWeight: 300,
            fontSize: "0.9rem",
            border: "1px solid",
            borderColor: isExceedMax ? "#f44336" : "#388e3c",
            borderRadius: 1,
            px: 1.5,
            py: 0.5,
            background: isExceedMax ? "#ffebee" : "#e8f5e9",
            display: "inline-block",
            marginLeft: 2,
            marginTop: 2,
          }}
        >
          Current Assigned Hours Per Week: {totalAssignedHoursPerWeek}
        </Typography>

        {/* Grid: Unassigned & Assigned with arrow UI */}
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "1fr auto 1fr",
            gap: 3,
            p: 3,
            bgcolor: "#ffffff",
          }}
        >
          {/* Unassigned Lessons Table */}
          <Box>
            <Typography
              variant="h6"
              sx={{ color: "#2196f3", fontWeight: 500, mb: 2 }}
            >
              Unassigned Lessons
            </Typography>
            <TableContainer
              component={Paper}
              variant="outlined"
              sx={{
                borderRadius: 1,
                "& .MuiTableCell-root": {
                  borderColor: "#e0e0e0",
                },
              }}
            >
              <Table size="small">
                <TableHead>
                  <TableRow sx={{ bgcolor: "#f5f5f5" }}>
                    <TableCell padding="checkbox">
                      <Checkbox
                        indeterminate={
                          selectedUIUnassigned.length > 0 &&
                          selectedUIUnassigned.length <
                            uiUnassignedLessons.length
                        }
                        checked={
                          uiUnassignedLessons.length > 0 &&
                          selectedUIUnassigned.length ===
                            uiUnassignedLessons.length
                        }
                        onChange={handleSelectAllUIUnassigned}
                      />
                    </TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Lesson Name</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>
                      Duration per week (Hours)
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {isLoadingUnassigned ? (
                    <TableRow>
                      <TableCell colSpan={3} align="center" sx={{ py: 3 }}>
                        <CircularProgress size={24} />
                      </TableCell>
                    </TableRow>
                  ) : isErrorUnassigned ? (
                    <TableRow>
                      <TableCell colSpan={3}>
                        <Alert severity="error">
                          {errorUnassigned?.message ||
                            "Error loading unassigned lessons"}
                        </Alert>
                      </TableCell>
                    </TableRow>
                  ) : uiUnassignedLessons.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={3} align="center" sx={{ py: 3 }}>
                        <Typography color="text.secondary">
                          No unassigned lessons available
                        </Typography>
                      </TableCell>
                    </TableRow>
                  ) : (
                    uiUnassignedLessons.map((lesson) => (
                      <TableRow
                        key={lesson.id}
                        selected={selectedUIUnassigned.includes(lesson.topic)}
                        hover
                        sx={{
                          "&.Mui-selected": {
                            backgroundColor: "#e3f2fd",
                          },
                          "&.Mui-selected:hover": {
                            backgroundColor: "#bbdefb",
                          },
                        }}
                      >
                        <TableCell padding="checkbox">
                          <Checkbox
                            checked={selectedUIUnassigned.includes(
                              lesson.topic
                            )}
                            onChange={() => handleSelectUIUnassigned(lesson)}
                          />
                        </TableCell>
                        <TableCell>{lesson.topic}</TableCell>
                        <TableCell>{lesson.duration ?? "-"}</TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>

          {/* Arrow Buttons UI */}
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              gap: 2,
            }}
          >
            <Tooltip title="Move to Assigned (UI)">
              <span>
                <IconButton
                  onClick={handleAssignUI}
                  disabled={selectedUIUnassigned.length === 0}
                  color="primary"
                  sx={{
                    border: "1px solid",
                    borderColor: "primary.main",
                    borderRadius: 2,
                    p: 1.5,
                    "&:hover": {
                      bgcolor: "primary.light",
                    },
                    "&.Mui-disabled": {
                      borderColor: "action.disabled",
                    },
                  }}
                >
                  <ArrowForwardIcon />
                </IconButton>
              </span>
            </Tooltip>
            <Tooltip title="Move to Unassigned (UI)">
              <span>
                <IconButton
                  onClick={handleUnassignUI}
                  disabled={selectedUIAssigned.length === 0}
                  color="primary"
                  sx={{
                    border: "1px solid",
                    borderColor: "primary.main",
                    borderRadius: 2,
                    p: 1.5,
                    "&:hover": {
                      bgcolor: "primary.light",
                    },
                    "&.Mui-disabled": {
                      borderColor: "action.disabled",
                    },
                  }}
                >
                  <ArrowBackIcon />
                </IconButton>
              </span>
            </Tooltip>
          </Box>

          {/* Assigned Lessons Table */}
          <Box>
            <Typography
              variant="h6"
              sx={{
                mb: 2,
                color: "#2196f3",
                fontWeight: 500,
                display: "flex",
                alignItems: "center",
                gap: 1,
              }}
            >
              Assigned Lessons
            </Typography>
            <TableContainer
              component={Paper}
              variant="outlined"
              sx={{
                borderRadius: 1,
                "& .MuiTableCell-root": {
                  borderColor: "#e0e0e0",
                },
              }}
            >
              <Table size="small">
                <TableHead>
                  <TableRow sx={{ bgcolor: "#f5f5f5" }}>
                    <TableCell padding="checkbox">
                      <Checkbox
                        indeterminate={
                          selectedUIAssigned.length > 0 &&
                          selectedUIAssigned.length < uiAssignedLessons.length
                        }
                        checked={
                          uiAssignedLessons.length > 0 &&
                          selectedUIAssigned.length === uiAssignedLessons.length
                        }
                        onChange={handleSelectAllUIAssigned}
                      />
                    </TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Lesson Name</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>
                      Duration per week (Hours)
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {isLoadingAssigned ? (
                    <TableRow>
                      <TableCell colSpan={3} align="center" sx={{ py: 3 }}>
                        <CircularProgress size={24} />
                      </TableCell>
                    </TableRow>
                  ) : isErrorAssigned ? (
                    <TableRow>
                      <TableCell colSpan={3}>
                        <Alert severity="error">
                          {errorAssigned?.message ||
                            "Error loading assigned lessons"}
                        </Alert>
                      </TableCell>
                    </TableRow>
                  ) : uiAssignedLessons.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={3} align="center" sx={{ py: 3 }}>
                        <Typography color="text.secondary">
                          No assigned lessons available
                        </Typography>
                      </TableCell>
                    </TableRow>
                  ) : (
                    uiAssignedLessons.map((lesson) => (
                      <TableRow
                        key={lesson.id}
                        selected={selectedUIAssigned.includes(lesson.topic)}
                        hover
                        sx={{
                          "&.Mui-selected": {
                            backgroundColor: "#e3f2fd",
                          },
                          "&.Mui-selected:hover": {
                            backgroundColor: "#bbdefb",
                          },
                        }}
                      >
                        <TableCell padding="checkbox">
                          <Checkbox
                            checked={selectedUIAssigned.includes(lesson.topic)}
                            onChange={() => handleSelectUIAssigned(lesson)}
                          />
                        </TableCell>
                        <TableCell>{lesson.topic}</TableCell>
                        <TableCell>{lesson.duration ?? "-"}</TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        </Box>

        <Box
          sx={{
            p: 2,
            display: "flex",
            justifyContent: "flex-end",
            borderTop: "1px solid #e0e0e0",
            background: "#f9f9f9",
          }}
        >
          <Button
            variant="contained"
            color="primary"
            onClick={handleSave}
            disabled={assignLessonsMutation.isLoading || isExceedMax}
          >
            {assignLessonsMutation.isLoading ? "Saving..." : "Save"}
          </Button>
        </Box>
      </Paper>

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
          sx={{ width: "100%", whiteSpace: "pre-line" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default SyllabusAssign;
