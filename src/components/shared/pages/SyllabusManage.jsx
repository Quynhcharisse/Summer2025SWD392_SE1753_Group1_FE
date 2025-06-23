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
  Stepper,
  Step,
  StepLabel,
  Checkbox,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAssignedLessons } from "@hooks/useSyllabusLesson";
import { useLessonList } from "@hooks/useLesson";

const HOURS_PER_WEEK = 30;

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
        message: "Subject is required",
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
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: '#e3f2fd' }}>
                <TableCell align="center" sx={{ color: '#1976d2', fontWeight: 'bold', fontSize: '1.05rem' }}>Subject</TableCell>
                <TableCell align="center" sx={{ color: '#1976d2', fontWeight: 'bold', fontSize: '1.05rem' }}>Description</TableCell>
                <TableCell align="center" sx={{ color: '#1976d2', fontWeight: 'bold', fontSize: '1.05rem' }}>Number of Week</TableCell>
                <TableCell align="center" sx={{ color: '#1976d2', fontWeight: 'bold', fontSize: '1.05rem' }}>Hours of Syllabuses</TableCell>
                <TableCell align="center" sx={{ color: '#1976d2', fontWeight: 'bold', fontSize: '1.05rem' }}>Grade</TableCell>
                <TableCell align="center" sx={{ color: '#1976d2', fontWeight: 'bold', fontSize: '1.05rem' }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {displayedData.map((row) => (
                <TableRow key={row.id}>
                  <TableCell align="center">{row.subject || "-"}</TableCell>
                  <TableCell align="center">{row.description || "-"}</TableCell>
                  <TableCell align="center">{row.numberOfWeek || "-"}</TableCell>
                  <TableCell align="center">{row.maxHoursOfSyllabus || "-"}</TableCell>
                  <TableCell align="center">{row.grade || "-"}</TableCell>
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
                        disabled={row.isAssigned}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="contained"
                        sx={{
                          backgroundColor: '#8e24aa',
                          color: '#fff',
                          minWidth: 120,
                          '&:hover': { backgroundColor: '#6a1b9a' },
                          fontWeight: 600
                        }}
                        onClick={() =>
                          navigate(
                            `/user/education/syllabus/assignlesson/${row.id}`,
                            { state: { syllabusData: row } }
                          )
                        }
                        size="small"
                      >
                        Assign Lessons
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
        maxWidth={editingId ? "sm" : "md"}
        fullWidth
        PaperProps={{
          sx: {
            minHeight: editingId ? "auto" : "70vh",
            display: "flex",
            flexDirection: "column",
          },
        }}
      >
        <DialogTitle>
          {editingId ? "Edit Syllabus" : "Create New Syllabus"}
        </DialogTitle>

        <DialogContent>
          {editingId ? (
            // Edit Form
            <form onSubmit={handleSubmit}>
              <Stack spacing={3} sx={{ pt: 2 }}>
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
            // Create Form with Stepper
            <Box sx={{ width: "100%", mt: 2 }}>
              <Box
                sx={{
                  width: "70%",
                  margin: "0 auto",
                  display: "flex",
                  justifyContent: "center",
                }}
              >
                <Stepper
                  activeStep={activeStep}
                  sx={{
                    width: "100%",
                    "& .MuiStepLabel-root": {
                      padding: "24px 12px",
                    },
                    "& .MuiStepIcon-root": {
                      width: "35px",
                      height: "35px",
                      color: "#e3f2fd",
                      "&.Mui-active": {
                        color: "#1976d2",
                      },
                      "&.Mui-completed": {
                        color: "#2e7d32",
                      },
                    },
                    "& .MuiStepLabel-label": {
                      fontSize: "1.1rem",
                      fontWeight: 500,
                      "&.Mui-active": {
                        color: "#1976d2",
                        fontWeight: 600,
                      },
                      "&.Mui-completed": {
                        color: "#2e7d32",
                        fontWeight: 600,
                      },
                    },
                    "& .MuiStepConnector-line": {
                      borderColor: "#e3f2fd",
                      borderWidth: "3px",
                    },
                    "& .MuiStepConnector-root.Mui-active .MuiStepConnector-line":
                      {
                        borderColor: "#1976d2",
                      },
                    "& .MuiStepConnector-root.Mui-completed .MuiStepConnector-line":
                      {
                        borderColor: "#2e7d32",
                      },
                  }}
                >
                  <Step>
                    <StepLabel>Basic Information</StepLabel>
                  </Step>
                  <Step>
                    <StepLabel>Select Lessons</StepLabel>
                  </Step>
                </Stepper>
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
          <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>
            {activeStep > 0 && <Button onClick={handleBack}>Back</Button>}
            {activeStep === 0 ? (
              <Button onClick={handleNext}>Next</Button>
            ) : (
              <form onSubmit={handleSubmit} style={{ display: "inline" }}>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  disabled={createSyllabusMutation.isPending}
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
          Syllabus Details
        </DialogTitle>
        <DialogContent>
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
            <Box sx={{ p: 3 }}>
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
                    <TableRow>
                      <TableCell
                        sx={{
                          width: "20%",
                          bgcolor: "#f8f9fa",
                          fontWeight: 600,
                          color: "#1976d2",
                        }}
                      >
                        Grade
                      </TableCell>
                      <TableCell>{detailData.data.data.grade}</TableCell>
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
                        {detailData.data.data.numberOfWeek} weeks
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
                        {detailData.data.data.description}
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>

              {/* Lessons Section */}
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
                    Lessons
                  </Typography>

                  {isLoadingAssignedLessons ? (
                    <Box
                      sx={{ display: "flex", justifyContent: "center", p: 3 }}
                    >
                      <CircularProgress size={24} />
                    </Box>
                  ) : assignedLessonsData?.data?.data?.length > 0 ? (
                    <Grid
                      container
                      spacing={2.5}
                      sx={{
                        px: { xs: 0, sm: 2 },
                        mx: { xs: -1, sm: -2 },
                      }}
                    >
                      {assignedLessonsData.data.data.map((lesson) => (
                        <Grid item xs={12} sm={6} md={4} lg={3} key={lesson.id}>
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
                              {lesson.topic}
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
                        No lessons assigned.
                      </Typography>
                    </Paper>
                  )}
                </Paper>
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
