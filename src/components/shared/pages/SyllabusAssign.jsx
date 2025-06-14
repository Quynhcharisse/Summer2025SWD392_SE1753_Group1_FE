import {
  Box,
  Typography,
  Paper,
  IconButton,
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
  Divider,
  Tooltip,
  Button,
} from "@mui/material";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspace";
import {
  useUnassignedLessons,
  useAssignedLessons,
  useAssignLessons,
  useUnassignLessons,
} from "@hooks/useSyllabusLesson";

const SyllabusAssign = () => {
  const { id: syllabusId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const syllabusData = location.state?.syllabusData;

  // States for selected lessons
  const [selectedUnassigned, setSelectedUnassigned] = useState([]);
  const [selectedAssigned, setSelectedAssigned] = useState([]);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  // Debug logging
  useEffect(() => {
    console.log("Component mounted with syllabusId:", syllabusId);
    console.log("Syllabus data:", syllabusData);
  }, [syllabusId, syllabusData]);

  // Fetch lessons data
  const {
    data: unassignedData,
    isLoading: isLoadingUnassigned,
    isError: isErrorUnassigned,
    error: errorUnassigned,
  } = useUnassignedLessons(syllabusId);

  const {
    data: assignedData,
    isLoading: isLoadingAssigned,
    isError: isErrorAssigned,
    error: errorAssigned,
  } = useAssignedLessons(syllabusId);

  // Tính tổng số giờ của các lesson đã assign
  const totalAssignedHours = (assignedData?.data?.data || []).reduce(
    (sum, lesson) => sum + (Number(lesson.duration) || 0),
    0
  );

  // Tính tổng số giờ của các lesson đang được chọn để assign
  const selectedUnassignedLessons = (unassignedData?.data?.data || []).filter(
    (lesson) => selectedUnassigned.includes(lesson.topic)
  );
  const totalSelectedUnassignedHours = selectedUnassignedLessons.reduce(
    (sum, lesson) => sum + (Number(lesson.duration) || 0),
    0
  );
  const totalHourAfterAssign = totalAssignedHours + totalSelectedUnassignedHours;
  const isExceedMax = totalHourAfterAssign > (Number(syllabusData.maxHoursOfSyllabus) || 0);

  // Debug logging for data fetching
  useEffect(() => {
    if (unassignedData) {
      console.log("Unassigned lessons data:", unassignedData);
    }
    if (errorUnassigned) {
      console.error("Unassigned lessons error:", errorUnassigned);
    }
  }, [unassignedData, errorUnassigned]);

  useEffect(() => {
    if (assignedData) {
      console.log("Assigned lessons data:", assignedData);
    }
    if (errorAssigned) {
      console.error("Assigned lessons error:", errorAssigned);
    }
  }, [assignedData, errorAssigned]);

  // Mutations for assigning/unassigning lessons
  const assignLessonsMutation = useAssignLessons();
  const unassignLessonsMutation = useUnassignLessons();

  if (!syllabusId || !syllabusData) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error">
          No syllabus data available. Please return to the syllabus list.
        </Alert>
      </Box>
    );
  }

  const handleRefresh = () => {
    // Implement refresh logic
  };

  const handleAssign = async () => {
    if (selectedUnassigned.length === 0) return;

    try {
      console.log("Attempting to assign lessons:", {
        id: syllabusId,
        lessonNames: selectedUnassigned,
      });

      await assignLessonsMutation.mutateAsync({
        id: syllabusId,
        lessonNames: selectedUnassigned,
      });
      setSelectedUnassigned([]);
      setSnackbar({
        open: true,
        message: "Lessons assigned successfully",
        severity: "success",
      });
    } catch (error) {
      console.error("Assignment error:", error);
      setSnackbar({
        open: true,
        message: error?.response?.data?.message || "Failed to assign lessons",
        severity: "error",
      });
    }
  };

  const handleUnassign = async () => {
    if (selectedAssigned.length === 0) return;

    try {
      console.log("Attempting to unassign lessons:", {
        id: syllabusId,
        lessonNames: selectedAssigned,
      });

      await unassignLessonsMutation.mutateAsync({
        id: syllabusId,
        lessonNames: selectedAssigned,
      });
      setSelectedAssigned([]);
      setSnackbar({
        open: true,
        message: "Lessons unassigned successfully",
        severity: "success",
      });
    } catch (error) {
      console.error("Unassignment error:", error);
      setSnackbar({
        open: true,
        message: error?.response?.data?.message || "Failed to unassign lessons",
        severity: "error",
      });
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  const handleSelectAllUnassigned = (event) => {
    if (event.target.checked) {
      setSelectedUnassigned(
        unassignedData?.data?.data?.map((lesson) => lesson.topic) || []
      );
    } else {
      setSelectedUnassigned([]);
    }
  };

  const handleSelectAllAssigned = (event) => {
    if (event.target.checked) {
      setSelectedAssigned(
        assignedData?.data?.data?.map((lesson) => lesson.topic) || []
      );
    } else {
      setSelectedAssigned([]);
    }
  };

  const handleSelectUnassigned = (lesson) => {
    setSelectedUnassigned((prev) => {
      if (prev.includes(lesson.topic)) {
        return prev.filter((topic) => topic !== lesson.topic);
      } else {
        return [...prev, lesson.topic];
      }
    });
  };

  const handleSelectAssigned = (lesson) => {
    setSelectedAssigned((prev) => {
      if (prev.includes(lesson.topic)) {
        return prev.filter((topic) => topic !== lesson.topic);
      } else {
        return [...prev, lesson.topic];
      }
    });
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

      <Paper
        sx={{
          width: "100%",
          mb: 2,
          borderRadius: 2,
          boxShadow: 3,
        }}
      >
        {/* Header */}
        <Box
          sx={{
            p: 2,
            borderBottom: "1px solid #e0e0e0",
            background: "linear-gradient(to right, #f3e5f5, #e3f2fd)", // Tím nhạt -> xanh dương nhạt
          }}
        >
          <Typography
            variant="h5"
            component="h1"
            align="center"
            sx={{
              color: "#1976d2",
              fontWeight: 600,
            }}
          >
            {syllabusData.subject}
          </Typography>
          <Typography
            variant="subtitle1"
            align="center"
            sx={{
              mt: 1,
              color: "text.secondary",
            }}
          >
            Lesson Assignment Management
          </Typography>
          <Typography
            variant="subtitle2"
            align="center"
            sx={{ mt: 1, color: "#1976d2", fontWeight: 500,
              fontSize: "1rem" }}
          >
            Max Hours of Syllabus: {syllabusData.maxHoursOfSyllabus ?? "N/A"}
          </Typography>
          <Typography
            variant="subtitle2"
            align="center"
            sx={{ mt: 1, color: "#388e3c", fontWeight: 500,
              fontSize: "1rem" }}
          >
            Total Assigned Hours: {totalAssignedHours}
          </Typography>
        </Box>

        {/* Tables Container */}
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
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 2,
                mb: 2,
                flexWrap: "wrap", // thêm nếu muốn xuống dòng gọn gàng khi nhỏ
              }}
            >
              <Typography
                variant="h6"
                sx={{ color: "#2196f3", fontWeight: 500 }}
              >
                Unassigned Lessons
              </Typography>

              {selectedUnassigned.length > 0 && (
                <Typography
                  sx={{
                    color: "text.secondary",
                    fontSize: "0.875rem",
                  }}
                >
                  ({selectedUnassigned.length} selected)
                </Typography>
              )}

              {selectedUnassigned.length > 0 && (
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
                  }}
                >
                  Total Hours After Assign: {totalHourAfterAssign}
                </Typography>
              )}
            </Box>

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
                          selectedUnassigned.length > 0 &&
                          selectedUnassigned.length <
                          (unassignedData?.data?.data?.length || 0)
                        }
                        checked={
                          (unassignedData?.data?.data?.length || 0) > 0 &&
                          selectedUnassigned.length ===
                          (unassignedData?.data?.data?.length || 0)
                        }
                        onChange={handleSelectAllUnassigned}
                      />
                    </TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Lesson Name</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Duration (Hours)</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {isLoadingUnassigned ? (
                    <TableRow>
                      <TableCell colSpan={2} align="center" sx={{ py: 3 }}>
                        <CircularProgress size={24} />
                      </TableCell>
                    </TableRow>
                  ) : isErrorUnassigned ? (
                    <TableRow>
                      <TableCell colSpan={2}>
                        <Alert severity="error">
                          {errorUnassigned?.message ||
                            "Error loading unassigned lessons"}
                        </Alert>
                      </TableCell>
                    </TableRow>
                  ) : (unassignedData?.data?.data || []).length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={2} align="center" sx={{ py: 3 }}>
                        <Typography color="text.secondary">
                          No unassigned lessons available
                        </Typography>
                      </TableCell>
                    </TableRow>
                  ) : (
                    (unassignedData?.data?.data || []).map((lesson) => (
                      <TableRow
                        key={lesson.id}
                        selected={selectedUnassigned.includes(lesson.topic)}
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
                            checked={selectedUnassigned.includes(lesson.topic)}
                            onChange={() => handleSelectUnassigned(lesson)}
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

          {/* Arrow Buttons */}
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              gap: 2,
            }}
          >
            <Tooltip title="Assign selected lessons">
              <span>
                <IconButton
                  onClick={handleAssign}
                  disabled={
                    selectedUnassigned.length === 0 ||
                    assignLessonsMutation.isPending
                  }
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
            <Tooltip title="Unassign selected lessons">
              <span>
                <IconButton
                  onClick={handleUnassign}
                  disabled={
                    selectedAssigned.length === 0 ||
                    unassignLessonsMutation.isPending
                  }
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
              {selectedAssigned.length > 0 && (
                <Typography
                  component="span"
                  sx={{
                    ml: 1,
                    color: "text.secondary",
                    fontSize: "0.875rem",
                  }}
                >
                  ({selectedAssigned.length} selected)
                </Typography>
              )}
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
                          selectedAssigned.length > 0 &&
                          selectedAssigned.length <
                          (assignedData?.data?.data?.length || 0)
                        }
                        checked={
                          (assignedData?.data?.data?.length || 0) > 0 &&
                          selectedAssigned.length ===
                          (assignedData?.data?.data?.length || 0)
                        }
                        onChange={handleSelectAllAssigned}
                      />
                    </TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Lesson Name</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Duration (Hours)</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {isLoadingAssigned ? (
                    <TableRow>
                      <TableCell colSpan={2} align="center" sx={{ py: 3 }}>
                        <CircularProgress size={24} />
                      </TableCell>
                    </TableRow>
                  ) : isErrorAssigned ? (
                    <TableRow>
                      <TableCell colSpan={2}>
                        <Alert severity="error">
                          {errorAssigned?.message ||
                            "Error loading assigned lessons"}
                        </Alert>
                      </TableCell>
                    </TableRow>
                  ) : (assignedData?.data?.data || []).length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={2} align="center" sx={{ py: 3 }}>
                        <Typography color="text.secondary">
                          No assigned lessons available
                        </Typography>
                      </TableCell>
                    </TableRow>
                  ) : (
                    (assignedData?.data?.data || []).map((lesson) => (
                      <TableRow
                        key={lesson.id}
                        selected={selectedAssigned.includes(lesson.topic)}
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
                            checked={selectedAssigned.includes(lesson.topic)}
                            onChange={() => handleSelectAssigned(lesson)}
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
      </Paper>

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

export default SyllabusAssign;
