import {
  useCreateSyllabus,
  useSyllabusList,
  useUpdateSyllabus,
  useSyllabusDetail,
} from "@hooks/useSyllabus";
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
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  Grid,
  Stack,
  Checkbox,
  InputLabel,
  Select,
  MenuItem,
  Tooltip,
} from "@mui/material";
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAssignedLessons } from "@hooks/useSyllabusLesson";
import { useLessonList } from "@hooks/useLesson";
import LayersIcon from "@mui/icons-material/Layers";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import InfoIcon from "@mui/icons-material/Info";
import EditIcon from "@mui/icons-material/Edit";
import VisibilityIcon from "@mui/icons-material/Visibility";
import LibraryBooksIcon from "@mui/icons-material/LibraryBooks";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import { styled } from "@mui/material/styles";

const HOURS_PER_WEEK = 30;

// Custom Timeline Step Component
const TimelineStep = styled("div")(({ theme, active, completed }) => ({
  display: "flex",
  alignItems: "flex-start",
  marginBottom: theme.spacing(4),
  position: "relative",
  "&:last-child": {
    marginBottom: 0,
  },
}));

const TimelineCircleContainer = styled("div")(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  marginRight: theme.spacing(3),
  position: "relative",
  zIndex: 2,
}));

const TimelineCircle = styled("div")(({ theme, active, completed }) => ({
  width: 48,
  height: 48,
  borderRadius: "50%",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  backgroundColor: active ? "#1976d2" : completed ? "#009688" : "#e3f2fd",
  border: active ? "3px solid #1976d2" : completed ? "3px solid #009688" : "3px solid #e3f2fd",
  boxShadow: active 
    ? "0 4px 16px rgba(25,118,210,0.18)" 
    : completed 
    ? "0 4px 16px rgba(0,150,136,0.18)" 
    : "0 2px 8px rgba(25,118,210,0.08)",
  transition: "all 0.3s ease",
  color: active || completed ? "#fff" : "#90caf9",
  fontWeight: 900,
  fontSize: "1.25rem",
  "&:hover": {
    transform: "scale(1.1)",
  },
}));

const TimelineLine = styled("div")(({ theme, active, completed }) => ({
  width: 4,
  height: 60,
  backgroundColor: active ? "#1976d2" : completed ? "#009688" : "#e3f2fd",
  borderRadius: 2,
  marginTop: theme.spacing(1),
  transition: "background-color 0.3s ease",
}));

const TimelineContent = styled("div")(({ theme, active, completed }) => ({
  flex: 1,
  padding: theme.spacing(2),
  backgroundColor: active ? "#e3f2fd" : completed ? "#e8f5e8" : "#f8f9fa",
  borderRadius: theme.spacing(2),
  border: active ? "2px solid #1976d2" : completed ? "2px solid #009688" : "2px solid #e0e0e0",
  transition: "all 0.3s ease",
  "&:hover": {
    transform: "translateY(-2px)",
    boxShadow: "0 4px 16px rgba(0,0,0,0.1)",
  },
}));

const StepNumber = styled("div")(({ theme, active, completed }) => ({
  fontSize: "0.875rem",
  fontWeight: 700,
  color: active ? "#1976d2" : completed ? "#009688" : "#666",
  marginBottom: theme.spacing(0.5),
  textTransform: "uppercase",
  letterSpacing: "0.5px",
}));

const StepTitle = styled("div")(({ theme, active, completed }) => ({
  fontSize: "1.125rem",
  fontWeight: 700,
  color: active ? "#1976d2" : completed ? "#009688" : "#333",
  marginBottom: theme.spacing(0.5),
}));

const StepDescription = styled("div")(({ theme, active, completed }) => ({
  fontSize: "0.875rem",
  color: active ? "#1976d2" : completed ? "#009688" : "#666",
  fontWeight: 500,
}));

// Custom Timeline Step Component
const CustomTimelineStep = ({ step, index, active, completed, icon }) => {
  return (
    <TimelineStep active={active} completed={completed}>
      <TimelineCircleContainer>
        <TimelineCircle active={active} completed={completed}>
          {completed ? (
            <span style={{ fontSize: 24, fontWeight: 900 }}>✓</span>
          ) : (
            icon
          )}
        </TimelineCircle>
        {index < 1 && (
          <TimelineLine active={active} completed={completed} />
        )}
      </TimelineCircleContainer>
      
      <TimelineContent active={active} completed={completed}>
        <StepNumber active={active} completed={completed}>
          Step {index + 1}
        </StepNumber>
        <StepTitle active={active} completed={completed}>
          {step.title}
        </StepTitle>
        <StepDescription active={active} completed={completed}>
          {step.description}
        </StepDescription>
      </TimelineContent>
    </TimelineStep>
  );
};

const SyllabusManage = () => {
  const [grade, setGrade] = useState("LEAF");
  const [activeStep, setActiveStep] = useState(0);
  const [selectedLessons, setSelectedLessons] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [gradeFilter, setGradeFilter] = useState("ALL");

  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [viewDetailId, setViewDetailId] = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    subject: "",
    description: "",
    numberOfWeek: "",
    grade: "LEAF",
    lessonNames: [],
  });
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const [maxWeekInput, setMaxWeekInput] = useState(16);
  const subjectRef = useRef();
  const descriptionRef = useRef();
  const numberOfWeekRef = useRef(16);

  // TanStack Query hooks
  const {
    data: syllabusResponse,
    isLoading,
    isError,
    error,
  } = useSyllabusList();
  const createSyllabusMutation = useCreateSyllabus();
  const updateSyllabusMutation = useUpdateSyllabus();
  const { data: detailData, isLoading: isLoadingDetail } =
    useSyllabusDetail(viewDetailId);
  const { data: assignedLessonsData, isLoading: isLoadingAssignedLessons } =
    useAssignedLessons(viewDetailId);

  // Handle 403 errors
  useEffect(() => {
    if (error?.response?.status === 403) {
      setSnackbar({
        open: true,
        message:
          "You do not have permission to access this resource. Please log in with appropriate permissions.",
        severity: "error",
      });
    }
  }, [error]);

  // Handle mutation errors
  useEffect(() => {
    const handleMutationError = (error) => {
      if (error?.response?.status === 403) {
        setSnackbar({
          open: true,
          message:
            "You do not have permission to perform this action. Please log in with appropriate permissions.",
          severity: "error",
        });
      }
    };

    if (createSyllabusMutation.error)
      handleMutationError(createSyllabusMutation.error);
    if (updateSyllabusMutation.error)
      handleMutationError(updateSyllabusMutation.error);
  }, [createSyllabusMutation.error, updateSyllabusMutation.error]);

  const syllabusList = syllabusResponse?.data?.data || [];
  const totalItems = syllabusList.length || 0;

  // Filter and search logic
  const filteredData =
    syllabusList?.filter((syllabus) => {
      const matchesSearch =
        searchQuery === "" ||
        syllabus.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
        syllabus.description.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesGrade =
        gradeFilter === "ALL" || syllabus.grade === gradeFilter;

      return matchesSearch && matchesGrade;
    }) || [];

  const displayedData = filteredData.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  const showModal = (record = null) => {
    if (record) {
      const recordData = {
        subject: record.subject ?? "",
        description: record.description ?? "",
        numberOfWeek: record.numberOfWeek ?? "",
        grade: record.grade ?? "LEAF",
        lessonNames: Array.isArray(record.lessonNames)
          ? record.lessonNames
          : [],
      };

      setFormData(recordData);
      setGrade(recordData.grade);
      setSelectedLessons(recordData.lessonNames);
      setMaxWeekInput(Number(recordData.numberOfWeek) || 16);

      setTimeout(() => {
        if (subjectRef.current) subjectRef.current.value = recordData.subject;
        if (descriptionRef.current)
          descriptionRef.current.value = recordData.description;
        if (numberOfWeekRef.current)
          numberOfWeekRef.current.value = recordData.numberOfWeek;
      }, 0);

      setEditingId(record.id);
    } else {
      const emptyData = {
        subject: "",
        description: "",
        numberOfWeek: "",
        grade: "LEAF",
        lessonNames: [],
      };

      setFormData(emptyData);
      setGrade("LEAF");
      setSelectedLessons([]);
      setMaxWeekInput(16);

      setTimeout(() => {
        if (subjectRef.current) subjectRef.current.value = "";
        if (descriptionRef.current) descriptionRef.current.value = "";
        if (numberOfWeekRef.current) numberOfWeekRef.current.value = 16;
      }, 0);

      setEditingId(null);
    }

    setActiveStep(0);
    setIsModalOpen(true);
  };

  const handleClose = () => {
    setIsModalOpen(false);
    setEditingId(null);
    setGrade("LEAF");
    setActiveStep(0);
    setSelectedLessons([]);
    setFormData({
      subject: "",
      description: "",
      numberOfWeek: "",
      grade: "LEAF",
      lessonNames: [],
    });
  };

  const handleNext = () => {
    // Only validate basic fields in step 1
    const subject = subjectRef.current?.value?.trim();
    const description = descriptionRef.current?.value?.trim();
    const numberWeeks = Number(numberOfWeekRef.current?.value);

    if (!subject) {
      setSnackbar({
        open: true,
        message: "Syllabus Name is required",
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

    // Save form data
    setFormData({
      subject,
      description,
      numberOfWeek: numberWeeks,
      grade,
    });

    // Just move to next step without any other validation
    setActiveStep((prevStep) => prevStep + 1);
  };

  const handleBack = () => {
    if (activeStep === 1) {
      // Restore form data when going back to step 1
      setTimeout(() => {
        if (subjectRef.current) subjectRef.current.value = formData.subject;
        if (descriptionRef.current)
          descriptionRef.current.value = formData.description;
        if (numberOfWeekRef.current)
          numberOfWeekRef.current.value = formData.numberOfWeek;
      }, 0);
    }
    setActiveStep((prevStep) => prevStep - 1);
  };

  const handleLessonSelect = (lessonTopic) => {
    setSelectedLessons((prev) => {
      if (prev.includes(lessonTopic)) {
        return prev.filter((topic) => topic !== lessonTopic);
      } else {
        return [...prev, lessonTopic];
      }
    });
  };

  // Get lessons list for step 2
  const { data: lessonResponse, isLoading: isLoadingLessons } = useLessonList();
  const lessonList = lessonResponse?.data?.data || [];

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleCloseSnackbar = () => {
    setSnackbar((prev) => ({ ...prev, open: false }));
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

    const data = editingId
      ? {
          subject: subjectRef.current.value.trim(),
          description: descriptionRef.current.value.trim(),
          numberOfWeek: Number(numberOfWeekRef.current.value),
          grade,
        }
      : {
          ...formData,
          lessonNames: selectedLessons,
        };

    try {
      if (editingId) {
        await updateSyllabusMutation.mutateAsync({ id: editingId, data });
        setSnackbar({
          open: true,
          message: "Syllabus updated successfully",
          severity: "success",
        });
      } else {
        await createSyllabusMutation.mutateAsync(data);
        setSnackbar({
          open: true,
          message: "Syllabus created successfully",
          severity: "success",
        });
      }
      handleClose();
    } catch (error) {
      console.error("Error submitting syllabus:", error);
      const errorMessage =
        error?.response?.data?.message || "Operation failed. Please try again.";
      setSnackbar({
        open: true,
        message: errorMessage,
        severity: "error",
      });
    }
  };

  if (isError) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error">
          {error?.response?.status === 403
            ? "You do not have permission to access this resource. Please log in with appropriate permissions."
            : `Error loading syllabus data: ${
                error?.message || "Please try again later."
              }`}
        </Alert>
      </Box>
    );
  }

  // Only calculate if valid
  const totalHoursDisplay =
    maxWeekInput < 1 || maxWeekInput > 53
      ? "N/A hours"
      : `${maxWeekInput * HOURS_PER_WEEK} hours`;

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
              Syllabus Management
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
          onClick={() => showModal()}
          startIcon={<AddCircleOutlineIcon />}
        >
          Create New Syllabus
        </Button>
      </Box>

      {/* Add Filter and Search Section */}
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
          label="Search syllabuses"
          variant="outlined"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          sx={{ minWidth: 300 }}
          placeholder="Search by subject or description..."
        />

        <FormControl size="small" sx={{ minWidth: 200 }}>
          <InputLabel>Grade Filter</InputLabel>
          <Select
            value={gradeFilter}
            onChange={(e) => setGradeFilter(e.target.value)}
            label="Grade Filter"
          >
            <MenuItem value="ALL">All Grades</MenuItem>
            <MenuItem value="LEAF">LEAF</MenuItem>
            <MenuItem value="BUD">BUD</MenuItem>
            <MenuItem value="SEED">SEED</MenuItem>
          </Select>
        </FormControl>

        <Box sx={{ flexGrow: 1 }} />

        <Typography
          variant="body2"
          sx={{
            color: "#666",
            fontWeight: "medium",
          }}
        >
          Filtered Results: {filteredData.length}
        </Typography>
      </Box>

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
                  Syllabus Name
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
                  Number of Week
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
                  Hours of Syllabuses
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
                  Grade
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
              {displayedData.map((row) => (
                <TableRow
                  key={row.id}
                  sx={{
                    transition: "background 0.2s",
                    "&:hover": { backgroundColor: "#f1f8fd" },
                    "&:last-child td, &:last-child th": { borderBottom: 0 },
                  }}
                >
                  <TableCell align="center" sx={{ fontWeight: 600 }}>
                    {row.subject || "-"}
                  </TableCell>
                  <TableCell align="center">{row.description || "-"}</TableCell>
                  <TableCell align="center">
                    {row.numberOfWeek || "-"}
                  </TableCell>
                  <TableCell align="center">
                    {row.maxHoursOfSyllabus || "-"}
                  </TableCell>
                  <TableCell align="center">
                    <Box
                      sx={{
                        display: "inline-block",
                        px: 2,
                        py: 0.5,
                        borderRadius: 2,
                        border: "1.5px solid #1976d2",
                        color: "#1976d2",
                        fontWeight: 700,
                        fontSize: "0.98rem",
                        background: "#e3f2fd",
                        minWidth: 70,
                        textAlign: "center",
                      }}
                    >
                      {row.grade || "-"}
                    </Box>
                  </TableCell>
                  <TableCell align="center">
                    <Box
                      sx={{
                        display: "flex",
                        gap: 1.5,
                        justifyContent: "center",
                      }}
                    >
                      <Tooltip title="View Details">
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
                      </Tooltip>
                      <Tooltip title="Edit Syllabus">
                        <span>
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
                            disabled={row.isAssigned}
                          >
                            Edit
                          </Button>
                        </span>
                      </Tooltip>
                      <Tooltip title="Assign Lessons">
                        <Button
                          variant="contained"
                          sx={{
                            backgroundColor: "#8e24aa",
                            color: "#fff",
                            minWidth: 44,
                            borderRadius: 2,
                            boxShadow: "0 2px 8px rgba(142,36,170,0.10)",
                            "&:hover": { backgroundColor: "#6a1b9a" },
                            fontWeight: 600,
                            p: 1.2,
                          }}
                          onClick={() =>
                            navigate(
                              `/user/education/syllabus/assignlesson/${row.id}`,
                              { state: { syllabusData: row } }
                            )
                          }
                          size="small"
                          startIcon={<LibraryBooksIcon />}
                        >
                          Assign
                        </Button>
                      </Tooltip>
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

      <Dialog
        open={isModalOpen}
        onClose={handleClose}
        maxWidth={editingId ? "sm" : "sm"}
        fullWidth
        PaperProps={{
          sx: {
            minHeight: editingId ? "auto" : "70vh",
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
          {editingId ? "Edit Syllabus" : "Create New Syllabus"}
        </DialogTitle>
        <DialogContent sx={{ px: 4, py: 3 }}>
          {editingId ? (
            // Edit Form
            <form onSubmit={handleSubmit}>
              <Stack spacing={3} sx={{ pt: 2 }}>
                <TextField
                  label="Syllabus Name"
                  inputRef={subjectRef}
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

                <FormControl fullWidth required>
                  <InputLabel id="max-week-label">Number of Week</InputLabel>
                  <Select
                    labelId="max-week-label"
                    value={maxWeekInput}
                    inputRef={numberOfWeekRef}
                    label="Number of Week"
                    onChange={(e) => setMaxWeekInput(Number(e.target.value))}
                  >
                    <MenuItem value={16}>16</MenuItem>
                    <MenuItem value={32}>32</MenuItem>
                  </Select>
                </FormControl>

                <Grid container alignItems="center" spacing={4} sx={{ py: 1 }}>
                  <Grid item>
                    <Typography variant="subtitle2" color="text.secondary">
                      Hours Per Week
                    </Typography>
                    <Typography variant="body1" fontWeight={600}>
                      {HOURS_PER_WEEK} hours
                    </Typography>
                  </Grid>

                  <Grid item>
                    <Typography variant="subtitle2" color="text.secondary">
                      Hours of Syllabus
                    </Typography>
                    <Typography variant="body1" fontWeight={600}>
                      {totalHoursDisplay}
                    </Typography>
                  </Grid>
                </Grid>

                <FormControl
                  required
                  component="fieldset"
                  sx={{
                    "& .MuiFormGroup-root": {
                      flexDirection: "row",
                      gap: 4,
                    },
                  }}
                >
                  <FormLabel component="legend" sx={{ mb: 1 }}>
                    Grade Level
                  </FormLabel>
                  <RadioGroup
                    value={grade}
                    onChange={(e) => setGrade(e.target.value)}
                  >
                    <FormControlLabel
                      value="LEAF"
                      control={
                        <Radio
                          sx={{
                            color: "#4caf50",
                            "&.Mui-checked": {
                              color: "#4caf50",
                            },
                          }}
                        />
                      }
                      label={
                        <Typography
                          sx={{
                            color: "#4caf50",
                            fontWeight: grade === "LEAF" ? 600 : 400,
                          }}
                        >
                          LEAF
                        </Typography>
                      }
                    />
                    <FormControlLabel
                      value="BUD"
                      control={
                        <Radio
                          sx={{
                            color: "#ff9800",
                            "&.Mui-checked": {
                              color: "#ff9800",
                            },
                          }}
                        />
                      }
                      label={
                        <Typography
                          sx={{
                            color: "#ff9800",
                            fontWeight: grade === "BUD" ? 600 : 400,
                          }}
                        >
                          BUD
                        </Typography>
                      }
                    />
                    <FormControlLabel
                      value="SEED"
                      control={
                        <Radio
                          sx={{
                            color: "#f44336",
                            "&.Mui-checked": {
                              color: "#f44336",
                            },
                          }}
                        />
                      }
                      label={
                        <Typography
                          sx={{
                            color: "#f44336",
                            fontWeight: grade === "SEED" ? 600 : 400,
                          }}
                        >
                          SEED
                        </Typography>
                      }
                    />
                  </RadioGroup>
                </FormControl>
              </Stack>
              <DialogActions>
                <Button onClick={handleClose}>Cancel</Button>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  disabled={updateSyllabusMutation.isPending}
                >
                  {updateSyllabusMutation.isPending ? (
                    <CircularProgress size={24} />
                  ) : (
                    "Update"
                  )}
                </Button>
              </DialogActions>
            </form>
          ) : (
            // Create Form with Timeline Stepper
            <Box sx={{ width: "100%", mt: 2 }}>
              {/* Timeline Header */}
              <Box
                sx={{
                  textAlign: "center",
                  mb: 4,
                  p: 3,
                  background: "linear-gradient(90deg, #e3f2fd 60%, #fff 100%)",
                  borderRadius: 3,
                  border: "2px solid #e3f2fd",
                }}
              >
                <Typography
                  variant="h5"
                  sx={{
                    color: "#1976d2",
                    fontWeight: 700,
                    mb: 1,
                    fontFamily: "inherit",
                  }}
                >
                  Syllabus Creation Process
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    color: "#666",
                    fontWeight: 500,
                    fontFamily: "inherit",
                  }}
                >
                  Follow the steps below to create a new syllabus
                </Typography>
              </Box>

              {/* Timeline Steps */}
              <Box sx={{ mb: 4 }}>
                <CustomTimelineStep
                  step={{
                    title: "Basic Information",
                    description: "Enter syllabus name, description, duration, and grade level"
                  }}
                  index={0}
                  active={activeStep === 0}
                  completed={activeStep > 0}
                  icon={<LibraryBooksIcon sx={{ fontSize: 24 }} />}
                />
                <CustomTimelineStep
                  step={{
                    title: "Lesson Assignment",
                    description: "Select and assign lessons to the syllabus"
                  }}
                  index={1}
                  active={activeStep === 1}
                  completed={activeStep > 1}
                  icon={<AddCircleOutlineIcon sx={{ fontSize: 24 }} />}
                />
              </Box>

              <Box sx={{ mt: 4 }}>
                {activeStep === 0 ? (
                  // Step 1 content
                  <Stack spacing={3}>
                    <TextField
                      label="Subject"
                      inputRef={subjectRef}
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

                    <FormControl fullWidth required>
                      <InputLabel id="max-week-label">
                        Number of Week
                      </InputLabel>
                      <Select
                        labelId="max-week-label"
                        inputRef={numberOfWeekRef}
                        value={maxWeekInput}
                        label="Number of Week"
                        onChange={(e) =>
                          setMaxWeekInput(Number(e.target.value))
                        }
                      >
                        <MenuItem value={16}>16</MenuItem>
                        <MenuItem value={32}>32</MenuItem>
                      </Select>
                    </FormControl>

                    <Grid
                      container
                      alignItems="center"
                      spacing={4}
                      sx={{ py: 1 }}
                    >
                      <Grid item>
                        <Typography variant="subtitle2" color="text.secondary">
                          Hours Per Week
                        </Typography>
                        <Typography variant="body1" fontWeight={600}>
                          {HOURS_PER_WEEK} hours
                        </Typography>
                      </Grid>

                      <Grid item>
                        <Typography variant="subtitle2" color="text.secondary">
                          Hours of Syllabus
                        </Typography>
                        <Typography variant="body1" fontWeight={600}>
                          {totalHoursDisplay}
                        </Typography>
                      </Grid>
                    </Grid>

                    <FormControl
                      required
                      component="fieldset"
                      sx={{
                        "& .MuiFormGroup-root": {
                          flexDirection: "row",
                          gap: 4,
                        },
                      }}
                    >
                      <FormLabel component="legend" sx={{ mb: 1 }}>
                        Grade Level
                      </FormLabel>
                      <RadioGroup
                        value={grade}
                        onChange={(e) => setGrade(e.target.value)}
                      >
                        <FormControlLabel
                          value="LEAF"
                          control={
                            <Radio
                              sx={{
                                color: "#4caf50",
                                "&.Mui-checked": {
                                  color: "#4caf50",
                                },
                              }}
                            />
                          }
                          label={
                            <Typography
                              sx={{
                                color: "#4caf50",
                                fontWeight: grade === "LEAF" ? 600 : 400,
                              }}
                            >
                              LEAF
                            </Typography>
                          }
                        />
                        <FormControlLabel
                          value="BUD"
                          control={
                            <Radio
                              sx={{
                                color: "#ff9800",
                                "&.Mui-checked": {
                                  color: "#ff9800",
                                },
                              }}
                            />
                          }
                          label={
                            <Typography
                              sx={{
                                color: "#ff9800",
                                fontWeight: grade === "BUD" ? 600 : 400,
                              }}
                            >
                              BUD
                            </Typography>
                          }
                        />
                        <FormControlLabel
                          value="SEED"
                          control={
                            <Radio
                              sx={{
                                color: "#f44336",
                                "&.Mui-checked": {
                                  color: "#f44336",
                                },
                              }}
                            />
                          }
                          label={
                            <Typography
                              sx={{
                                color: "#f44336",
                                fontWeight: grade === "SEED" ? 600 : 400,
                              }}
                            >
                              SEED
                            </Typography>
                          }
                        />
                      </RadioGroup>
                    </FormControl>
                  </Stack>
                ) : (
                  // Step 2 content
                  <Box>
                    <Typography variant="h6" sx={{ mb: 2 }}>
                      Select Lessons for Syllabus
                    </Typography>
                    <Grid
                      container
                      alignItems="center"
                      spacing={4}
                      sx={{ mb: 2 }}
                    >
                      <Grid item>
                        <Typography variant="subtitle2" color="text.secondary">
                          Hours Per Week
                        </Typography>
                        <Typography variant="body1" fontWeight={600}>
                          30 hours
                        </Typography>
                      </Grid>
                      <Grid item>
                        <Typography variant="subtitle2" color="text.secondary">
                          Min Lessons Required Per Week
                        </Typography>
                        <Typography variant="body1" fontWeight={600}>
                          3 lessons
                        </Typography>
                      </Grid>
                    </Grid>
                    {isLoadingLessons ? (
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "center",
                          p: 3,
                        }}
                      >
                        <CircularProgress />
                      </Box>
                    ) : (
                      <TableContainer component={Paper} variant="outlined">
                        <Table>
                          <TableHead>
                            <TableRow>
                              <TableCell padding="checkbox">
                                <Checkbox
                                  checked={
                                    lessonList.length > 0 &&
                                    lessonList.every((lesson) =>
                                      selectedLessons.includes(lesson.topic)
                                    )
                                  }
                                  onChange={(e) => {
                                    if (e.target.checked) {
                                      setSelectedLessons(
                                        lessonList.map((lesson) => lesson.topic)
                                      );
                                    } else {
                                      setSelectedLessons([]);
                                    }
                                  }}
                                />
                              </TableCell>
                              <TableCell>Topic</TableCell>
                              <TableCell>Description</TableCell>
                              <TableCell>Duration Per Week (Hours)</TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {lessonList.map((lesson) => (
                              <TableRow
                                key={lesson.id}
                                selected={selectedLessons.includes(
                                  lesson.topic
                                )}
                                hover
                              >
                                <TableCell padding="checkbox">
                                  <Checkbox
                                    checked={selectedLessons.includes(
                                      lesson.topic
                                    )}
                                    onChange={() =>
                                      handleLessonSelect(lesson.topic)
                                    }
                                  />
                                </TableCell>
                                <TableCell>{lesson.topic}</TableCell>
                                <TableCell>{lesson.description}</TableCell>
                                <TableCell>{lesson.duration}</TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </TableContainer>
                    )}
                  </Box>
                )}
              </Box>
            </Box>
          )}
        </DialogContent>

        {/* Actions */}
        {!editingId && (
          <DialogActions
            sx={{
              borderTop: "2px solid #e3f2fd",
              backgroundColor: "#f8f9fa",
              p: 2,
              justifyContent: "center",
              gap: 2,
            }}
          >
            <Button
              onClick={handleClose}
              sx={{
                minWidth: 120,
                color: "#1976d2",
                fontWeight: 700,
                borderRadius: 2,
                backgroundColor: "transparent",
                boxShadow: "none",
                fontSize: "1.08rem",
                "&:hover": {
                  backgroundColor: "#e3f2fd",
                },
              }}
            >
              Cancel
            </Button>
            {activeStep > 0 && (
              <Button
                onClick={handleBack}
                sx={{
                  minWidth: 120,
                  color: "#1976d2",
                  fontWeight: 700,
                  borderRadius: 2,
                  backgroundColor: "transparent",
                  boxShadow: "none",
                  fontSize: "1.08rem",
                  "&:hover": {
                    backgroundColor: "#e3f2fd",
                  },
                }}
              >
                Back
              </Button>
            )}
            {activeStep === 0 ? (
              <Button
                onClick={handleNext}
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
              >
                Next
              </Button>
            ) : (
              <form onSubmit={handleSubmit} style={{ display: "inline" }}>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  disabled={createSyllabusMutation.isPending}
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
                >
                  {createSyllabusMutation.isPending ? (
                    <CircularProgress size={24} />
                  ) : (
                    "Create"
                  )}
                </Button>
              </form>
            )}
          </DialogActions>
        )}
      </Dialog>

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

      {/* Detail Modal */}
      <Dialog
        open={isDetailModalOpen}
        onClose={handleCloseDetail}
        maxWidth="md"
        fullWidth
        sx={{
          "& .MuiDialog-paper": {
            borderRadius: 4,
            background: "linear-gradient(120deg, #f8fafc 60%, #e3f2fd 100%)",
            boxShadow: "0 8px 32px rgba(25,118,210,0.18)",
            p: 0,
            fontFamily: "Inter, Roboto, Arial, sans-serif",
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
          }}
        >
          Syllabus Details
        </DialogTitle>
        <DialogContent sx={{ p: 0 }}>
          {isLoadingDetail ? (
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
          ) : detailData?.data?.data ? (
            <Box
              sx={{
                p: { xs: 2, sm: 4 },
                fontFamily: "Inter, Roboto, Arial, sans-serif",
              }}
            >
              {/* Block 1: Syllabus Information */}
              <Box
                sx={{
                  borderRadius: 4,
                  boxShadow: "0 4px 24px rgba(56,189,248,0.10)",
                  borderLeft: "6px solid #1976d2",
                  mb: 4,
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
                    background:
                      "linear-gradient(90deg, #e3f2fd 60%, #bbdefb 100%)",
                    borderTopLeftRadius: 18,
                    borderTopRightRadius: 18,
                  }}
                >
                  <LayersIcon sx={{ color: "#1976d2", fontSize: 32 }} />
                  <Typography
                    sx={{
                      fontWeight: 700,
                      fontSize: "1.25rem",
                      color: "#1976d2",
                      fontFamily: "inherit",
                    }}
                  >
                    Syllabus Information
                  </Typography>
                </Box>
                <Grid container spacing={3} sx={{ p: 3 }}>
                  {/* Hàng 1: Subject, Number of Week, Hours of Syllabus */}
                  <Grid item xs={12} sm={4}>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                        mb: 0.5,
                      }}
                    >
                      <LibraryBooksIcon
                        sx={{ color: "#90caf9", fontSize: 22 }}
                      />
                      <Typography
                        sx={{
                          color: "#888",
                          fontWeight: 600,
                          fontFamily: "inherit",
                          whiteSpace: "nowrap",
                          minWidth: 90,
                        }}
                      >
                        Syllabus Name:
                      </Typography>
                    </Box>
                    <Typography
                      sx={{
                        fontWeight: 700,
                        color: "#1976d2",
                        fontSize: "1.08rem",
                        fontFamily: "inherit",
                        ml: 4,
                      }}
                    >
                      {detailData.data.data.subject}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                        mb: 0.5,
                      }}
                    >
                      <AccessTimeIcon sx={{ color: "#90caf9", fontSize: 22 }} />
                      <Typography
                        sx={{
                          color: "#888",
                          fontWeight: 600,
                          fontFamily: "inherit",
                          whiteSpace: "nowrap",
                          minWidth: 140,
                        }}
                      >
                        Number of Week:
                      </Typography>
                    </Box>
                    <Typography
                      sx={{
                        fontWeight: 700,
                        color: "#1976d2",
                        fontSize: "1.08rem",
                        fontFamily: "inherit",
                        ml: 4,
                      }}
                    >
                      {detailData.data.data.numberOfWeek} weeks
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                        mb: 0.5,
                      }}
                    >
                      <AccessTimeIcon sx={{ color: "#90caf9", fontSize: 22 }} />
                      <Typography
                        sx={{
                          color: "#888",
                          fontWeight: 600,
                          fontFamily: "inherit",
                          whiteSpace: "nowrap",
                          minWidth: 120,
                        }}
                      >
                        Hours of Syllabus:
                      </Typography>
                    </Box>
                    <Typography
                      sx={{
                        fontWeight: 700,
                        color: "#1976d2",
                        fontSize: "1.08rem",
                        fontFamily: "inherit",
                        ml: 4,
                      }}
                    >
                      {detailData.data.data.numberOfWeek * 30 || "N/A"} hours
                    </Typography>
                  </Grid>
                  {/* Hàng 2: Grade, Description */}
                  <Grid item xs={12} sm={4}>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                        mb: 0.5,
                      }}
                    >
                      <LayersIcon sx={{ color: "#90caf9", fontSize: 22 }} />
                      <Typography
                        sx={{
                          color: "#888",
                          fontWeight: 600,
                          fontFamily: "inherit",
                          whiteSpace: "nowrap",
                          minWidth: 110,
                        }}
                      >
                        Grade:
                      </Typography>
                    </Box>
                    <Typography
                      sx={{
                        fontWeight: 700,
                        color: "#1976d2",
                        fontSize: "1.08rem",
                        fontFamily: "inherit",
                        ml: 4,
                      }}
                    >
                      {detailData.data.data.grade}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={8}>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                        mb: 0.5,
                      }}
                    >
                      <InfoIcon sx={{ color: "#90caf9", fontSize: 22 }} />
                      <Typography
                        sx={{
                          color: "#888",
                          fontWeight: 600,
                          fontFamily: "inherit",
                          whiteSpace: "nowrap",
                          minWidth: 120,
                        }}
                      >
                        Description:
                      </Typography>
                    </Box>
                    <Typography
                      sx={{
                        fontWeight: 500,
                        color: "#222",
                        fontSize: "1.08rem",
                        fontFamily: "inherit",
                        background: "#f5faff",
                        borderRadius: 2,
                        px: 2,
                        py: 1,
                        ml: 4,
                      }}
                    >
                      {detailData.data.data.description}
                    </Typography>
                  </Grid>
                </Grid>
              </Box>

              {/* Block 2: Lessons */}
              <Box
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
                    background:
                      "linear-gradient(90deg, #e8fbe9 60%, #bbf7d0 100%)",
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
                    Lessons
                  </Typography>
                </Box>
                <Box sx={{ p: 3 }}>
                  {isLoadingAssignedLessons ? (
                    <Box
                      sx={{ display: "flex", justifyContent: "center", p: 3 }}
                    >
                      <CircularProgress size={24} />
                    </Box>
                  ) : assignedLessonsData?.data?.data?.length > 0 ? (
                    <Grid container spacing={3}>
                      {assignedLessonsData.data.data.map((lesson) => (
                        <Grid item xs={12} sm={6} md={4} lg={3} key={lesson.id}>
                          <Box
                            sx={{
                              p: 2.5,
                              borderRadius: 3,
                              bgcolor: "#fff",
                              boxShadow: "0 2px 8px rgba(34,197,94,0.10)",
                              display: "flex",
                              alignItems: "center",
                              gap: 2,
                              transition: "all 0.2s",
                              cursor: "pointer",
                              "&:hover": {
                                bgcolor: "#f0fdfa",
                                boxShadow: "0 6px 16px rgba(34,197,94,0.18)",
                                transform: "translateY(-2px) scale(1.03)",
                              },
                            }}
                          >
                            <LibraryBooksIcon
                              sx={{ color: "#16a34a", fontSize: 28 }}
                            />
                            <Typography
                              sx={{
                                fontWeight: 700,
                                color: "#222",
                                fontSize: "1.08rem",
                                fontFamily: "inherit",
                              }}
                            >
                              {lesson.topic}
                            </Typography>
                          </Box>
                        </Grid>
                      ))}
                    </Grid>
                  ) : (
                    <Box
                      sx={{
                        p: 4,
                        textAlign: "center",
                        bgcolor: "#f8f9fa",
                        border: "1px solid #e0e0e0",
                        borderRadius: 3,
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        gap: 2,
                      }}
                    >
                      <LibraryBooksIcon
                        sx={{ color: "#bdbdbd", fontSize: 40, mb: 1 }}
                      />
                      <Typography
                        color="text.secondary"
                        fontWeight={600}
                        fontSize="1.1rem"
                      >
                        No lessons assigned.
                      </Typography>
                    </Box>
                  )}
                </Box>
              </Box>
            </Box>
          ) : (
            <Box sx={{ p: 4, textAlign: "center" }}>
              <Typography
                color="error"
                sx={{ fontSize: "1.1rem", fontWeight: 500 }}
              >
                Failed to load syllabus details.
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
    </Box>
  );
};

export default SyllabusManage;
