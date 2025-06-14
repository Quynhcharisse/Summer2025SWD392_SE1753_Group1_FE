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
} from "@mui/material";
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAssignedLessons } from "@hooks/useSyllabusLesson";

const SyllabusManage = () => {
  const [grade, setGrade] = useState("LEAF");

  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [viewDetailId, setViewDetailId] = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    subject: "",
    description: "",
    maxNumberOfWeek: "",
    grade: "LEAF",
  });
  const [formErrors, setFormErrors] = useState({});
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const [maxWeekInput, setMaxWeekInput] = useState(0);
  const subjectRef = useRef();
  const descriptionRef = useRef();
  const maxWeekRef = useRef();
  const gradeRef = useRef("LEAF");

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
  const { data: assignedLessonsData, isLoading: isLoadingAssignedLessons } = useAssignedLessons(viewDetailId);

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

  const showModal = (record = null) => {
    setFormErrors({});
    if (record) {
      
      setTimeout(() => {
        if (subjectRef.current) subjectRef.current.value = record.subject ?? "";
        if (descriptionRef.current)
          descriptionRef.current.value = record.description ?? "";
        if (maxWeekRef.current)
          maxWeekRef.current.value = record.maxNumberOfWeek ?? "";
      }, 0);
      gradeRef.current = record.grade ?? "LEAF";
      setMaxWeekInput(Number(record.maxNumberOfWeek) || 0); 
      setEditingId(record.id);
      setGrade(record.grade ?? "LEAF");
      setEditingId(record.id);
    } else {
      
      setTimeout(() => {
        if (subjectRef.current) subjectRef.current.value = "";
        if (descriptionRef.current) descriptionRef.current.value = "";
        if (maxWeekRef.current) maxWeekRef.current.value = "";
        setMaxWeekInput(0);
      }, 0);
      gradeRef.current = "LEAF";
      setGrade("LEAF");
      setEditingId(null);
    }

    setIsModalOpen(true);
  };

  const handleClose = () => {
    setIsModalOpen(false);
    setEditingId(null);
    setGrade("LEAF");
    setFormData({
      subject: "",
      description: "",
      maxNumberOfWeek: "",
      grade: "LEAF",
    });
    setFormErrors({});
  };

  // const handleInputChange = (e) => {
  //   const { name, value } = e.target;
  //   setFormData((prev) => ({
  //     ...prev,
  //     [name]: value,
  //   }));
  //   // Clear error when user types
  //   if (formErrors[name]) {
  //     setFormErrors((prev) => ({
  //       ...prev,
  //       [name]: "",
  //     }));
  //   }
  // };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const dataFromForm = {
      subject: subjectRef.current?.value.trim() || "",
      description: descriptionRef.current?.value.trim() || "",
      maxNumberOfWeek: Number(maxWeekRef.current?.value || 0),
      grade,
    };

    const errors = {};
    if (!dataFromForm.subject) errors.subject = "Subject is required";
    if (!dataFromForm.description)
      errors.description = "Description is required";
    if (!dataFromForm.maxNumberOfWeek || dataFromForm.maxNumberOfWeek < 1)
      errors.maxNumberOfWeek = "Max number of weeks must be at least 1";
    if (!dataFromForm.grade) errors.grade = "Grade is required";

    setFormErrors(errors);
    if (Object.keys(errors).length > 0) return;

    try {
      if (editingId) {
        await updateSyllabusMutation.mutateAsync({
          id: editingId,
          data: dataFromForm,
        });
        setSnackbar({
          open: true,
          message: "Syllabus edited successfully",
          severity: "success",
        });
      } else {
        await createSyllabusMutation.mutateAsync(dataFromForm);
        setSnackbar({
          open: true,
          message: "Syllabus created successfully",
          severity: "success",
        });
      }
      handleClose();
    } catch (error) {
      const msg = error.response?.data?.message || "Operation failed";
      if (msg === "Syllabus already exists") {
        setFormErrors((prev) => ({ ...prev, subject: msg }));
      } else {
        setSnackbar({ open: true, message: msg, severity: "error" });
      }
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

  if (isError) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error">
          {error?.response?.status === 403
            ? "You do not have permission to access this resource. Please log in with appropriate permissions."
            : `Error loading syllabus data: ${error?.message || "Please try again later."
            }`}
        </Alert>
      </Box>
    );
  }

  const displayedData =
    syllabusList?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage) ||
    [];

  
  const HOURS_PER_WEEK = 40; 
  const totalHours = maxWeekInput * HOURS_PER_WEEK;

  
  const totalHoursDisplay =
    totalHours > 0 ? `${totalHours} hours` : "N/A hours";

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

      {isLoading ? (
        <Box sx={{ display: "flex", justifyContent: "center", p: 3 }}>
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
                <TableCell>Hours of Syllabuses</TableCell>
                <TableCell>Grade</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {displayedData.map((row) => (
                <TableRow key={row.id}>
                  <TableCell>{row.subject || "-"}</TableCell>
                  <TableCell>{row.description || "-"}</TableCell>
                  <TableCell>{row.maxNumberOfWeek || "-"}</TableCell>
                  <TableCell>{row.maxHoursOfSyllabus || "-"}</TableCell>

                  <TableCell>{row.grade || "-"}</TableCell>
                  <TableCell>
                    <Box
                      sx={{
                        display: "inline-flex",
                        alignItems: "center",
                        px: 1,
                        py: 0.5,
                        borderRadius: 1,
                        backgroundColor: row.isAssigned ? "#e8f5e9" : "#ffebee",
                        color: row.isAssigned ? "#2e7d32" : "#c62828",
                      }}
                    >
                      <Typography variant="body2">
                        {row.isAssigned ? "Assigned" : "Not Assigned"}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: "flex", gap: 1 }}>
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
                      <Button
                        variant="outlined"
                        color="secondary"
                        onClick={() =>
                          navigate(
                            `/user/education/syllabus/assignlesson/${row.id}`,
                            { state: { syllabusData: row } }
                          )
                        }
                        size="small"
                      >
                        Assign Page
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
            {editingId ? "Edit Syllabus" : "Create New Syllabus"}
          </DialogTitle>
          <DialogContent dividers sx={{ pt: 2, px: 3 }}>
            <Stack spacing={2}>
              <TextField
                label="Subject"
                inputRef={subjectRef}
                fullWidth
                required
                error={!!formErrors.subject}
                helperText={formErrors.subject}
              />

              <TextField
                label="Description"
                inputRef={descriptionRef}
                fullWidth
                multiline
                rows={2}
                required
                error={!!formErrors.description}
                helperText={formErrors.description}
              />

              <TextField
                label="Max Number of Week"
                inputRef={maxWeekRef}
                type="number"
                fullWidth
                inputProps={{ min: 1 }}
                required
                onChange={() => {
                  const value = Number(maxWeekRef.current?.value || 0);
                  setMaxWeekInput(value);
                }}
                error={!!formErrors.maxNumberOfWeek}
                helperText={formErrors.maxNumberOfWeek}
              />
              <Grid container alignItems="center" spacing={4} sx={{ py: 1 }}>
                {/* Hours Per Week */}
                <Grid item>
                  <Typography variant="subtitle2" color="text.secondary">
                    Hours Per Week
                  </Typography>
                  <Typography variant="body1" fontWeight={600}>
                    {HOURS_PER_WEEK} hours
                  </Typography>
                </Grid>

                {/* Hours of Syllabus */}
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
                error={!!formErrors.grade}
                component="fieldset"
                sx={{
                  "& .MuiFormGroup-root": {
                    flexDirection: "row",
                    gap: 4,
                  },
                }}
              >
                <FormLabel
                  component="legend"
                  sx={{
                    mb: 1,
                    color: (theme) =>
                      formErrors.grade ? theme.palette.error.main : "inherit",
                  }}
                >
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
                          fontWeight: formData.grade === "LEAF" ? 600 : 400,
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
                          fontWeight: formData.grade === "BUD" ? 600 : 400,
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
                          fontWeight: formData.grade === "SEED" ? 600 : 400,
                        }}
                      >
                        SEED
                      </Typography>
                    }
                  />
                </RadioGroup>
                {formErrors.grade && (
                  <Typography variant="caption" color="error" sx={{ mt: 0.5 }}>
                    {formErrors.grade}
                  </Typography>
                )}
              </FormControl>
            </Stack>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              disabled={
                createSyllabusMutation.isPending ||
                updateSyllabusMutation.isPending
              }
            >
              {createSyllabusMutation.isPending ||
                updateSyllabusMutation.isPending ? (
                <CircularProgress size={24} />
              ) : editingId ? (
                "Edit"
              ) : (
                "Create"
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
          sx={{ width: "100%" }}
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
            <Box
              sx={{
                p: 4,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <Box
                sx={{
                  width: "100%",
                  maxWidth: "600px",
                  backgroundColor: "white",
                  borderRadius: 2,
                  boxShadow: 3,
                  p: 3,
                }}
              >
                <Typography
                  variant="h5"
                  sx={{
                    textAlign: "center",
                    color: "#1976d2",
                    fontWeight: "bold",
                    mb: 3,
                  }}
                >
                  {detailData.data.data.subject}
                </Typography>

                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 3,
                  }}
                >
                  <Box>
                    <Typography
                      sx={{
                        color: "#5c6bc0",
                        fontWeight: "bold",
                        fontSize: "1.1rem",
                        mb: 1,
                      }}
                    >
                      Grade
                    </Typography>
                    <Box
                      sx={{
                        backgroundColor: "#f5f5f5",
                        p: 2,
                        borderRadius: 1,
                      }}
                    >
                      <Typography>{detailData.data.data.grade}</Typography>
                    </Box>
                  </Box>

                  <Box>
                    <Typography
                      sx={{
                        color: "#5c6bc0",
                        fontWeight: "bold",
                        fontSize: "1.1rem",
                        mb: 1,
                      }}
                    >
                      Duration (Hours)
                    </Typography>
                    <Box
                      sx={{
                        backgroundColor: "#f5f5f5",
                        p: 2,
                        borderRadius: 1,
                      }}
                    >
                      <Typography>
                        {detailData.data.data.maxNumberOfWeek} weeks
                      </Typography>
                    </Box>
                  </Box>

                  <Box>
                    <Typography
                      sx={{
                        color: "#5c6bc0",
                        fontWeight: "bold",
                        fontSize: "1.1rem",
                        mb: 1,
                      }}
                    >
                      Description
                    </Typography>
                    <Box
                      sx={{
                        backgroundColor: "#f5f5f5",
                        p: 2,
                        borderRadius: 1,
                      }}
                    >
                      <Typography
                        sx={{
                          whiteSpace: "pre-wrap",
                          wordBreak: "break-word",
                        }}
                      >
                        {detailData.data.data.description}
                      </Typography>
                    </Box>
                  </Box>

                  <Box>
                    <Typography
                      sx={{
                        color: "#5c6bc0",
                        fontWeight: "bold",
                        fontSize: "1.1rem",
                        mb: 1,
                      }}
                    >
                      Lessons
                    </Typography>
                    <Box
                      sx={{
                        backgroundColor: "#f5f5f5",
                        p: 2,
                        borderRadius: 1,
                        minHeight: 40,
                        maxHeight: 250,
                        overflowY: "auto",
                      }}
                    >
                      {isLoadingAssignedLessons ? (
                        <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: 40 }}>
                          <CircularProgress size={20} />
                        </Box>
                      ) : assignedLessonsData?.data?.data?.length > 0 ? (
                        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
                          {assignedLessonsData.data.data.map((lesson) => (
                            <Box
                              key={lesson.id}
                              sx={{
                                minWidth: 160,
                                maxWidth: 220,
                                p: 2,
                                background: "#e3f2fd",
                                borderRadius: 2,
                                boxShadow: 1,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                              }}
                            >
                              <Typography variant="body1" sx={{ fontWeight: 600, color: "#1976d2", textAlign: "center" }}>
                                {lesson.topic}
                              </Typography>
                            </Box>
                          ))}
                        </Box>
                      ) : (
                        <Typography variant="body2" color="text.secondary">
                          No lessons assigned.
                        </Typography>
                      )}
                    </Box>
                  </Box>
                </Box>
              </Box>
            </Box>
          ) : (
            <Box
              sx={{
                p: 4,
                textAlign: "center",
              }}
            >
              <Typography
                color="error"
                sx={{
                  fontSize: "1.1rem",
                  fontWeight: 500,
                }}
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
