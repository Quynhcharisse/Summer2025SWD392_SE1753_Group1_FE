import {
    Alert,
    AppBar,
    Backdrop,
    Box,
    Button,
    CircularProgress,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    FormControl,
    FormControlLabel,
    FormHelperText,
    FormLabel,
    Grid,
    IconButton,
    InputLabel,
    LinearProgress,
    MenuItem,
    Paper,
    Radio,
    RadioGroup,
    Select,
    Stack,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TablePagination,
    TableRow,
    TextField,
    Toolbar,
    Typography
} from "@mui/material";
import {Add, Close, CloudUpload} from '@mui/icons-material';
import {useEffect, useState, useRef} from "react";
import {DatePicker} from "@mui/x-date-pickers/DatePicker";
import {LocalizationProvider} from "@mui/x-date-pickers/LocalizationProvider";
import {AdapterDateFns} from "@mui/x-date-pickers/AdapterDateFns";
import {parseISO} from "date-fns";
import {enqueueSnackbar} from "notistack";
import axios from "axios";
import {cancelAdmission, getFormInformation, refillForm, submittedForm} from "@api/services/parentService.js";

// Loading Overlay Component
function LoadingOverlay({ open, message }) {
    return (
        <Backdrop
            sx={{
                color: '#fff',
                zIndex: (theme) => theme.zIndex.drawer + 1,
                flexDirection: 'column',
                gap: 2
            }}
            open={open}
        >
            <CircularProgress color="inherit" size={60} />
            <Typography variant="h6">{message}</Typography>
        </Backdrop>
    );
}

async function uploadToCloudinary(file, onProgress, signal) {
    try {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("upload_preset", "pes_swd");
        formData.append("cloud_name", "dfx4miova");

        const response = await axios.post(
            "https://api.cloudinary.com/v1_1/dfx4miova/image/upload",
            formData,
            {
                onUploadProgress: (progressEvent) => {
                    const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                    onProgress(percentCompleted);
                },
                signal: signal
            }
        );

        return response.data.secure_url;
    } catch (error) {
        if (axios.isCancel(error)) {
            enqueueSnackbar("Upload cancelled", {variant: "info"});
            return null;
        }
        enqueueSnackbar("Failed to upload file", {variant: "error"});
        return null;
    }
}

function RenderTable({openDetailPopUpFunc, forms, HandleSelectedForm, openRefillPopUpFunc}) {
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    }

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(event.target.value)
        setPage(0)
    }

    const handleDetailClick = (form) => {
        HandleSelectedForm(form)
        openDetailPopUpFunc();
    }

    const handleRefillClick = (form) => {
        HandleSelectedForm(form);
        openRefillPopUpFunc();
    }

    return (
        <Paper sx={{
            width: '100%',
            overflow: 'hidden',
            borderRadius: '16px',
            boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.05)',
            border: '1px solid #e0e0e0'
        }}>
            <TableContainer>
                <Table stickyHeader>
                    <TableHead>
                        <TableRow>
                            <TableCell align="center" sx={{
                                fontWeight: '600',
                                color: '#07663a',
                                backgroundColor: '#f8faf8',
                                fontSize: '0.95rem',
                                padding: '16px 8px',
                                borderBottom: '2px solid #e0e0e0'
                            }}>
                                No
                            </TableCell>
                            <TableCell align="center" sx={{
                                fontWeight: '600',
                                color: '#07663a',
                                backgroundColor: '#f8faf8',
                                fontSize: '0.95rem',
                                padding: '16px 8px',
                                borderBottom: '2px solid #e0e0e0'
                            }}>
                                Submit Date
                            </TableCell>
                            <TableCell align="center" sx={{
                                fontWeight: '600',
                                color: '#07663a',
                                backgroundColor: '#f8faf8',
                                fontSize: '0.95rem',
                                padding: '16px 8px',
                                borderBottom: '2px solid #e0e0e0'
                            }}>
                                Cancel Reason
                            </TableCell>
                            <TableCell align="center" sx={{
                                fontWeight: '600',
                                color: '#07663a',
                                backgroundColor: '#f8faf8',
                                fontSize: '0.95rem',
                                padding: '16px 8px',
                                borderBottom: '2px solid #e0e0e0'
                            }}>
                                Status
                            </TableCell>
                            <TableCell align="center" sx={{
                                fontWeight: '600',
                                color: '#07663a',
                                backgroundColor: '#f8faf8',
                                fontSize: '0.95rem',
                                padding: '16px 8px',
                                borderBottom: '2px solid #e0e0e0'
                            }}>
                                Note
                            </TableCell>
                            <TableCell align="center" sx={{
                                fontWeight: '600',
                                color: '#07663a',
                                backgroundColor: '#f8faf8',
                                fontSize: '0.95rem',
                                padding: '16px 8px',
                                borderBottom: '2px solid #e0e0e0'
                            }}>
                                Action
                            </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {forms
                            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                            .map((form, index) => (
                                <TableRow
                                    key={index}
                                    sx={{
                                        '&:hover': {
                                            backgroundColor: '#f8faf8',
                                        },
                                        transition: 'background-color 0.2s'
                                    }}
                                >
                                    <TableCell align="center" sx={{padding: '12px 8px'}}>
                                        {page * rowsPerPage + index + 1}
                                    </TableCell>
                                    <TableCell align="center" sx={{padding: '12px 8px'}}>
                                        {form.submittedDate}
                                    </TableCell>
                                    <TableCell align="center" sx={{padding: '12px 8px'}}>
                                        {form.cancelReason || "N/A"}
                                    </TableCell>
                                    <TableCell align="center" sx={{padding: '12px 8px'}}>
                                        <Typography
                                            component="span"
                                            sx={{
                                                color: form.status === "approved" ? "#07663a" :
                                                    form.status === "rejected" || form.status === "cancelled" ? "#dc3545" :
                                                        form.status === "pending approval" ? "#0d6efd" : "black",
                                                fontWeight: "600",
                                                padding: '6px 12px',
                                                backgroundColor: form.status === "approved" ? "rgba(7, 102, 58, 0.1)" :
                                                    form.status === "rejected" || form.status === "cancelled" ? "rgba(220, 53, 69, 0.1)" :
                                                        form.status === "pending approval" ? "rgba(13, 110, 253, 0.1)" : "transparent",
                                                borderRadius: '20px',
                                                fontSize: '0.875rem'
                                            }}
                                        >
                                            {form.status}
                                        </Typography>
                                    </TableCell>
                                    <TableCell align="center" sx={{padding: '12px 8px'}}>
                                        {form.note || "N/A"}
                                    </TableCell>
                                    <TableCell align="center" sx={{padding: '12px 8px'}}>
                                        <Stack direction="row" spacing={1} justifyContent="center">
                                            <Button
                                                variant="contained"
                                                size="small"
                                                onClick={() => handleDetailClick(form)}
                                                sx={{
                                                    backgroundColor: '#07663a',
                                                    '&:hover': {
                                                        backgroundColor: 'rgba(7, 102, 58, 0.85)'
                                                    },
                                                    minWidth: '90px',
                                                    borderRadius: '8px',
                                                    textTransform: 'none',
                                                    fontWeight: '600',
                                                    boxShadow: 'none'
                                                }}
                                            >
                                                Detail
                                            </Button>
                                            {(form.status === "cancelled" || form.status === "rejected") && (
                                                <Button
                                                    variant="contained"
                                                    size="small"
                                                    onClick={() => handleRefillClick(form)}
                                                    sx={{
                                                        backgroundColor: '#2196f3',
                                                        '&:hover': {
                                                            backgroundColor: 'rgba(33, 150, 243, 0.85)'
                                                        },
                                                        minWidth: '90px',
                                                        borderRadius: '8px',
                                                        textTransform: 'none',
                                                        fontWeight: '600',
                                                        boxShadow: 'none'
                                                    }}
                                                >
                                                    Refill
                                                </Button>
                                            )}
                                        </Stack>
                                    </TableCell>
                                </TableRow>
                            ))}
                    </TableBody>
                </Table>
            </TableContainer>
            <TablePagination
                component="div"
                rowsPerPageOptions={[5, 10, 15]}
                count={forms.length}
                page={page}
                onPageChange={handleChangePage}
                rowsPerPage={rowsPerPage}
                onRowsPerPageChange={handleChangeRowsPerPage}
                sx={{
                    borderTop: '1px solid #e0e0e0',
                    '.MuiTablePagination-select': {
                        borderRadius: '8px',
                        padding: '4px 8px',
                        marginRight: '8px'
                    },
                }}
            />
        </Paper>
    )
}

function RenderDetailPopUp({handleClosePopUp, isPopUpOpen, selectedForm, GetForm}) {
    const [isConfirmOpen, setIsConfirmOpen] = useState(false);
    const [isRefillOpen, setIsRefillOpen] = useState(false);
    const [isCancelling, setIsCancelling] = useState(false);

    const handleCloseConfirm = () => setIsConfirmOpen(false);
    const handleOpenConfirm = () => setIsConfirmOpen(true);

    const handleOpenRefill = () => {
        handleClosePopUp();
        setIsRefillOpen(true);
    };

    const handleCloseRefill = () => {
        setIsRefillOpen(false);
    };

    const canRefill = selectedForm?.status?.toLowerCase() === 'cancelled' || selectedForm?.status?.toLowerCase() === 'rejected';

    //tạo state để hiển thị ảnh
    const [openImageDialogs, setOpenImageDialogs] = useState({
        profileImage: false,
        birthCertificate: false,
        householdRegistration: false,
        childCharacteristics: false,
        commitment: false
    });
    const [selectedImage, setSelectedImage] = useState('');

    const handleOpenImageDialog = (imageType, src) => {
        setSelectedImage(src);
        setOpenImageDialogs(prev => ({...prev, [imageType]: true}));
    };

    const handleCloseImageDialog = (imageType) => {
        setOpenImageDialogs(prev => ({...prev, [imageType]: false}));
    };

    async function HandleCancel() {
        try {
            setIsCancelling(true);
            const response = await cancelAdmission(selectedForm.id);
            if (response && response.success) {
                enqueueSnackbar(response.message || "Form cancelled successfully", {variant: "success"});
                handleClosePopUp();
                handleCloseConfirm();
                await GetForm();
            } else {
                enqueueSnackbar(response?.message || "Failed to cancel admission form", {variant: "error"});
            }
        } catch (error) {
            if (error.response?.status === 403) {
                enqueueSnackbar("Your session has expired. Please login again.", {
                    variant: "error",
                    action: (
                        <Button color="inherit" size="small" onClick={() => {
                            window.location.href = '/auth/login';
                        }}>
                            Login
                        </Button>
                    )
                });
            } else {
                enqueueSnackbar(error.response?.data?.message || "Failed to cancel admission form", {variant: "error"});
            }
        } finally {
            setIsCancelling(false);
        }
    }

    return (
        <Dialog
            fullScreen
            open={isPopUpOpen}
            onClose={handleClosePopUp}
        >
            <LoadingOverlay open={isCancelling} message="Cancelling admission form..." />

            <AppBar sx={{
                position: 'relative',
                backgroundColor: '#07663a'
            }}>
                <Toolbar>
                    <IconButton edge="start"
                                color="inherit"
                                onClick={handleClosePopUp}
                                aria-label="close">
                        <Close/>
                    </IconButton>
                    <Typography sx={{ml: 2, flex: 1}} variant="h6" component="div">
                        Admission Form Detail
                    </Typography>
                </Toolbar>
            </AppBar>

            <Box p={4}>
                <Typography
                    variant='subtitle1'
                    sx={{
                        mb: 2,
                        fontWeight: 'bold',
                        fontSize: "2.5rem",
                        textAlign: "center",
                        color: '#07663a'
                    }}
                >
                    Form Information
                </Typography>

                <Stack spacing={3}>
                    <Stack>
                        <TextField fullWidth label='Child name' disabled value={selectedForm.studentName || ''}/>
                    </Stack>
                    <Stack>
                        <FormControl>
                            <FormLabel sx={{color: 'black'}} disabled>Gender</FormLabel>
                            <RadioGroup row value={selectedForm.studentGender || ''}>
                                <FormControlLabel value="female" control={<Radio/>} label="Female"
                                                  sx={{color: 'black'}} disabled/>
                                <FormControlLabel value="male" control={<Radio/>} label="Male"
                                                  sx={{color: 'black'}} disabled/>
                            </RadioGroup>
                        </FormControl>
                    </Stack>
                    <Stack>
                        <LocalizationProvider dateAdapter={AdapterDateFns}>
                            <DatePicker
                                label="Date of Birth"
                                value={selectedForm.studentDateOfBirth ? parseISO(selectedForm.studentDateOfBirth.toString()) : null}
                                disabled
                                renderInput={(params) => <TextField {...params} fullWidth/>}
                            />
                        </LocalizationProvider>
                    </Stack>
                    <Stack>
                        <TextField fullWidth label={'Place of birth'} disabled
                                   value={selectedForm.studentPlaceOfBirth || ''}/>
                    </Stack>

                    <Stack>
                        <TextField fullWidth label={'Household registration address'} disabled
                                   value={selectedForm.householdRegistrationAddress || ''}/>
                    </Stack>

                    <Stack>
                        <TextField fullWidth label={'Note'} disabled value={selectedForm.note || ''}/>
                    </Stack>
                    <Stack>
                        <TextField fullWidth label={'Cancel reason'} disabled value={selectedForm.cancelReason || ''}/>
                    </Stack>

                    {/* Student Documents */}
                    <Grid item xs={12}>
                        <Typography variant="subtitle1" sx={{
                            mt: 2,
                            mb: 2,
                            color: '#07663a',
                            fontWeight: 600
                        }}>
                            Student Documents
                        </Typography>

                        <Stack direction="row" spacing={3} flexWrap="wrap" useFlexGap>
                            {[
                                {label: "Profile Image", src: selectedForm.profileImage, type: 'profileImage'},
                                {label: "Birth Certificate", src: selectedForm.birthCertificateImg, type: 'birthCertificate'},
                                {label: "Household Registration", src: selectedForm.householdRegistrationImg, type: 'householdRegistration'}
                            ].map((item, idx) => (
                                <Paper key={idx} elevation={2} sx={{p: 2, borderRadius: 2, width: 200}}>
                                    <Typography variant="body2" fontWeight="bold" sx={{mb: 1}}>{item.label}</Typography>
                                    <img
                                        src={item.src}
                                        alt={item.label}
                                        style={{width: '100%', borderRadius: 8, cursor: 'pointer'}}
                                        onClick={() => handleOpenImageDialog(item.type, item.src)}
                                    />
                                    <Dialog 
                                        open={openImageDialogs[item.type]} 
                                        onClose={() => handleCloseImageDialog(item.type)} 
                                        maxWidth="md"
                                    >
                                        <img src={selectedImage} style={{width: '100%'}} alt="Zoom"/>
                                    </Dialog>
                                </Paper>
                            ))}
                        </Stack>
                    </Grid>

                    <Typography variant="subtitle1" sx={{
                        mt: 5,
                        mb: 2,
                        fontWeight: 'bold',
                        color: '#07663a'
                    }}>
                        Uploaded Documents
                    </Typography>
                    <Stack direction="row" spacing={3} flexWrap="wrap" useFlexGap>
                        {[
                            {label: "Child Characteristics Form", src: selectedForm.childCharacteristicsFormImg, type: 'childCharacteristics'},
                            {label: "Commitment", src: selectedForm.commitmentImg, type: 'commitment'}
                        ].map((item, idx) => (
                            <Paper key={idx} elevation={2} sx={{p: 2, borderRadius: 2, width: 200}}>
                                <Typography variant="body2" fontWeight="bold" sx={{mb: 1}}>{item.label}</Typography>
                                <img
                                    src={item.src}
                                    alt={item.label}
                                    style={{width: '100%', borderRadius: 8, cursor: 'pointer'}}
                                    onClick={() => handleOpenImageDialog(item.type, item.src)}
                                />
                                <Dialog 
                                    open={openImageDialogs[item.type]} 
                                    onClose={() => handleCloseImageDialog(item.type)} 
                                    maxWidth="md"
                                >
                                    <img src={selectedImage} style={{width: '100%'}} alt="Zoom"/>
                                </Dialog>
                            </Paper>
                        ))}
                    </Stack>
                </Stack>

                <Stack spacing={3}>
                    <Stack
                        sx={{
                            display: 'flex',
                            flexDirection: 'row',
                            justifyContent: 'flex-end',
                            gap: '1rem',
                            marginTop: '2vh'
                        }}
                    >
                        {/*button submit*/}
                        <Button
                            sx={{
                                width: '10%',
                                height: '5vh',
                            }}
                            variant="contained"
                            color='warning'
                            onClick={handleClosePopUp}
                        >
                            Close
                        </Button>

                        {/*button cancel*/}
                        {/*xét điều kiện, nếu cancel rồi thì ẩn nút cancel đó, ko cho hiện lại */}
                        {selectedForm.status !== 'cancelled' && (
                            <Button
                                sx={{
                                    width: '10%',
                                    height: '5vh',
                                }}
                                variant="contained"
                                color='error'
                                onClick={handleOpenConfirm}
                            >
                                Cancel
                            </Button>
                        )}

                        {/* Dialog xác nhận cancel */}
                        <Dialog open={isConfirmOpen} onClose={handleCloseConfirm}>
                            <DialogTitle sx={{color: 'red', fontWeight: 'bold'}}>
                                Cancel Admission Form
                            </DialogTitle>
                            <DialogContent>
                                <DialogContentText>
                                    ⚠️ Are you sure you want to cancel this admission form?
                                    <br/>
                                    This action <strong>cannot be undone</strong> and the child may lose their
                                    enrollment opportunity for this term.
                                </DialogContentText>
                            </DialogContent>
                            <DialogActions>
                                <Button
                                    onClick={handleCloseConfirm}
                                    disabled={isCancelling}
                                    sx={{
                                        color: 'red',
                                    }}
                                >
                                    Disagree
                                </Button>
                                <Button
                                    onClick={HandleCancel}
                                    disabled={isCancelling}
                                    sx={{
                                        color: 'red',
                                    }}
                                    startIcon={isCancelling ? <CircularProgress size={20} color="error"/> : null}
                                    autoFocus
                                >
                                    {isCancelling ? 'Cancelling...' : 'Agree'}
                                </Button>
                            </DialogActions>
                        </Dialog>
                    </Stack>
                </Stack>

                {/* Add Refill button */}
                {canRefill && (
                    <Button
                        variant="contained"
                        onClick={handleOpenRefill}
                        sx={{
                            backgroundColor: '#07663a',
                            '&:hover': {backgroundColor: 'rgba(7, 102, 58, 0.85)'},
                            position: 'absolute',
                            right: '100px',
                            top: '10px'
                        }}
                    >
                        Refill Form
                    </Button>
                )}
            </Box>

            {/* Refill Form Dialog */}
            {isRefillOpen && (
                <RenderRefillForm
                    isPopUpOpen={isRefillOpen}
                    handleClosePopUp={handleCloseRefill}
                    selectedForm={selectedForm}
                    GetForm={GetForm}
                />
            )}
        </Dialog>
    )
}

function RenderFormPopUp({handleClosePopUp, isPopUpOpen, studentList, GetForm}) {
    //Lưu id học sinh được chọn từ dropdown
    const [selectedStudentId, setSelectedStudentId] = useState(null);

    //Hiển thị trạng thái đang xử lý (true khi submit, upload...)
    const [isLoading, setIsLoading] = useState(false);
    const [loadingMessage, setLoadingMessage] = useState('');

    //Lưu trữ lỗi khi validate (ví dụ thiếu địa chỉ, file...)
    const [errors, setErrors] = useState({});

    //Lưu nội dung nhập từ form: địa chỉ thường trú, ghi chú
    const [input, setInput] = useState({
        address: '',
        note: ''
    });

    //Lưu các file thô (ảnh, giấy tờ) được người dùng upload
    const [uploadedFile, setUploadedFile] = useState({
        childCharacteristicsForm: '',
        commit: ''
    });

    const [uploadProgress, setUploadProgress] = useState({});
    const [isCancelDialogOpen, setCancelDialogOpen] = useState(false);
    const abortControllerRef = useRef(null);

    const student = studentList.find(s => s.id === selectedStudentId) || null;

    //Khi studentList thay đổi
    // Nếu chưa chọn học sinh (selectedStudentId rỗng), thì chọn học sinh đầu tiên chưa có đơn nhập học
    useEffect(() => {
        if (Array.isArray(studentList) && studentList.length > 0 && !selectedStudentId) {
            const availableStudent = studentList.find(student => !student.hadForm);
            if (availableStudent) {
                setSelectedStudentId(availableStudent.id);
            }
        }
    }, [studentList, selectedStudentId]);

    const validateForm = () => {
        const newErrors = {};

        // Required field validations
        if (selectedStudentId === null) {
            newErrors.student = "Please select a student";
        }
        if (!input.address.trim()) {
            newErrors.address = "Household registration address is required";
        }

        // File validations
        if (!uploadedFile.childCharacteristicsForm) {
            newErrors.childCharacteristicsForm = "Child characteristics form is required";
        }
        if (!uploadedFile.commit) {
            newErrors.commit = "Commitment form is required";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const validateFileType = (file) => {
        const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp'];
        const allowedExtensions = ['.jpg', '.jpeg', '.png', 'webp'];
        const maxSize = 5 * 1024 * 1024; // 5MB

        if (!file) {
            enqueueSnackbar(`Please select a file`, {variant: "error"});
            return false;
        }

        // Check file size
        if (file.size > maxSize) {
            enqueueSnackbar(`File size should not exceed 5MB`, {variant: "error"});
            return false;
        }

        // Check MIME type
        if (!allowedTypes.includes(file.type)) {
            enqueueSnackbar(`Only JPG, JPEG & PNG & WEBP files are allowed`, {variant: "error"});
            return false;
        }

        // Check file extension
        const fileName = file.name.toLowerCase();
        const hasValidExtension = allowedExtensions.some(ext => fileName.endsWith(ext));
        if (!hasValidExtension) {
            enqueueSnackbar(`Invalid file extension. Only .jpg, .jpeg, .png .webp are allowed`, {variant: "error"});
            return false;
        }

        return true;
    };

    const handleCancelUpload = () => {
        setCancelDialogOpen(true);
    };

    const confirmCancel = () => {
        if (abortControllerRef.current) {
            abortControllerRef.current.abort();
        }
        setCancelDialogOpen(false);
        setIsLoading(false);
        setUploadProgress({});
    };

    const handleUploadImage = async () => {
        if (!validateFileUploads()) {
            return null;
        }

        try {
            abortControllerRef.current = new AbortController();
            const signal = abortControllerRef.current.signal;

            const uploadPromises = [];
            const uploadResults = {};

            if (uploadedFile.childCharacteristicsForm) {
                uploadPromises.push(
                    uploadToCloudinary(
                        uploadedFile.childCharacteristicsForm,
                        (progress) => setUploadProgress(prev => ({...prev, childCharacteristicsForm: progress})),
                        signal
                    ).then(url => {
                        uploadResults.childCharacteristicsFormLink = url;
                    })
                );
            }

            if (uploadedFile.commit) {
                uploadPromises.push(
                    uploadToCloudinary(
                        uploadedFile.commit,
                        (progress) => setUploadProgress(prev => ({...prev, commit: progress})),
                        signal
                    ).then(url => {
                        uploadResults.commitLink = url;
                    })
                );
            }

            await Promise.all(uploadPromises);

            if (signal.aborted) {
                return null;
            }

            return uploadResults;
        } catch (error) {
            console.error('Error uploading images:', error);
            return null;
        }
    };

    const validateFileUploads = () => {
        const requiredFiles = {
            childCharacteristicsForm: 'Child characteristics form',
            commit: 'Commitment form'
        };

        for (const [key, label] of Object.entries(requiredFiles)) {
            const file = uploadedFile[key];

            if (!file) {
                enqueueSnackbar(`${label} is required`, {variant: "error"});
                return false;
            }

            // Revalidate files before upload
            if (!validateFileType(file)) {
                enqueueSnackbar(`Invalid ${label.toLowerCase()}`, {variant: "error"});
                return false;
            }
        }

        return true;
    };

    function CheckAge(dateOfBirth) {
        const birthYear = new Date(dateOfBirth).getFullYear()
        const currentYear = new Date().getFullYear()
        const age = currentYear - birthYear
        return age >= 3 && age <= 5
    }

    async function HandleSubmit() {
        try {
            if (!validateForm()) {
                return;
            }

            setIsLoading(true);
            setLoadingMessage('Uploading files...');
            const uploadResult = await handleUploadImage();
            if (!uploadResult) {
                return;
            }

            setLoadingMessage('Submitting form...');
            const formData = {
                studentId: selectedStudentId,
                householdRegistrationAddress: input.address,
                childCharacteristicsFormImg: uploadResult.childCharacteristicsFormLink,
                commitmentImg: uploadResult.commitLink,
                note: input.note || ""
            };

            const response = await submittedForm(formData);

            if (response && response.success) {
                enqueueSnackbar(response.message, {variant: 'success'});
                await GetForm();
                handleClosePopUp();
            }
        } catch (error) {
            console.error('Error submitting form:', error);
            if (error.response?.status === 403) {
                enqueueSnackbar("Your session has expired. Please login again.", {
                    variant: "error",
                    action: (
                        <Button color="inherit" size="small" onClick={() => {
                            window.location.href = '/auth/login';
                        }}>
                            Login
                        </Button>
                    )
                });
            } else {
                enqueueSnackbar(error.message || "Failed to submit form", {variant: "error"});
            }
        } finally {
            setIsLoading(false);
            setLoadingMessage('');
            setUploadProgress({});
        }
    }

    function HandleUploadFile(file, id) {
        try {
            // Check if file exists
            if (!file) {
                enqueueSnackbar("Please select a file to upload", {variant: "error"});
                return;
            }

            // Basic file validation
            if (!file.name || !file.type) {
                enqueueSnackbar("Invalid file format", {variant: "error"});
                return;
            }

            // Validate file type
            if (!validateFileType(file)) {
                return;
            }

            // Update state based on file type
            if (id === 1) {
                setUploadedFile(prev => ({...prev, childCharacteristicsForm: file}));
                enqueueSnackbar("Child characteristics form uploaded successfully", {variant: "success"});
            } else {
                setUploadedFile(prev => ({...prev, commit: file}));
                enqueueSnackbar("Commitment form uploaded successfully", {variant: "success"});
            }

        } catch (error) {
            console.error("Error handling file upload:", error);
            enqueueSnackbar("Error processing file", {variant: "error"});
        }
    }

    return (
        <Dialog
            fullScreen
            open={isPopUpOpen}
            onClose={handleClosePopUp}
        >
            <LoadingOverlay open={isLoading} message={loadingMessage} />
            
            <AppBar sx={{
                position: 'relative',
                backgroundColor: '#07663a'
            }}>
                <Toolbar>
                    <IconButton
                        edge="start"
                        color="inherit"
                        onClick={handleClosePopUp}
                    >
                        <Close/>
                    </IconButton>
                    <Typography sx={{ml: 2, flex: 1}} variant="h6">
                        Create Admission Form
                    </Typography>
                </Toolbar>
            </AppBar>

            <Box sx={{
                p: {xs: 2, sm: 4, md: 6},
                maxWidth: '1200px',
                margin: '0 auto',
                width: '100%'
            }}>
                <Typography variant="h4" sx={{
                    mb: 4,
                    textAlign: 'center',
                    fontWeight: 'bold',
                    color: '#07663a'
                }}>
                    Form Information
                </Typography>

                <Stack spacing={4} sx={{
                    maxWidth: '800px',
                    mx: 'auto',
                    width: '100%',
                    '& .MuiFormControl-root': {
                        backgroundColor: '#fff',
                        borderRadius: '8px'
                    }
                }}>
                    {/* Student Selection */}
                    <FormControl fullWidth error={!!errors.student}>
                        <InputLabel>Child Name</InputLabel>
                        <Select
                            value={selectedStudentId}
                            onChange={(e) => setSelectedStudentId(e.target.value)}
                            label="Child Name"
                            sx={{
                                '& .MuiSelect-select': {
                                    padding: '12px 16px'
                                }
                            }}
                        >
                            {studentList && studentList.length > 0 ? (
                                studentList
                                    .filter(student => CheckAge(student.dateOfBirth))
                                    .map((student) => {
                                        // Kiểm tra xem học sinh có form đang pending approval hoặc approved không
                                        const hasActiveForm = student.hadForm &&
                                            student.admissionForms?.some(form =>
                                                form.status === 'approved' ||
                                                form.status === 'pending approval'
                                            );

                                        return (
                                            <MenuItem
                                                key={student.id}
                                                value={student.id}
                                                disabled={hasActiveForm}
                                            >
                                                {student.name}
                                                {hasActiveForm ? ' (Has active form)' : ''}
                                                {student.admissionForms?.some(form => form.status === 'rejected') ? ' (Previously rejected)' : ''}
                                                {student.admissionForms?.some(form => form.status === 'cancelled') ? ' (Previously cancelled)' : ''}
                                            </MenuItem>
                                        );
                                    })
                            ) : (
                                <MenuItem disabled>No available students</MenuItem>
                            )}
                        </Select>
                        <Typography
                            variant={"subtitle2"}
                            color={"error"}
                        >
                            * Only children with the age from 3 to 5 can be submitted to sunshine preschool
                        </Typography>

                        {errors.student && (
                            <FormHelperText>{errors.student}</FormHelperText>
                        )}
                    </FormControl>

                    {/* Student Information Display */}
                    {student && (
                        <Box sx={{
                            p: 3,
                            backgroundColor: 'rgba(7, 102, 58, 0.05)',
                            borderRadius: 2,
                            mb: 2
                        }}>
                            <Typography variant="h6" sx={{
                                mb: 2,
                                color: '#07663a',
                                fontWeight: 600
                            }}>
                                Student Information
                            </Typography>
                            <Grid container spacing={3}>
                                <Grid item xs={12} md={6}>
                                    <TextField
                                        fullWidth
                                        label="Full Name"
                                        value={student.name || ''}
                                        InputProps={{readOnly: true}}
                                    />
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <TextField
                                        fullWidth
                                        label="Gender"
                                        value={student.gender || ''}
                                        InputProps={{readOnly: true}}
                                    />
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <TextField
                                        fullWidth
                                        label="Date of Birth"
                                        value={student.dateOfBirth || ''}
                                        InputProps={{readOnly: true}}
                                    />
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <TextField
                                        fullWidth
                                        label="Place of Birth"
                                        value={student.placeOfBirth || ''}
                                        InputProps={{readOnly: true}}
                                    />
                                </Grid>

                                {/* Student Documents */}
                                <Grid item xs={12}>
                                    <Typography variant="subtitle1" sx={{
                                        mt: 2,
                                        mb: 2,
                                        color: '#07663a',
                                        fontWeight: 600
                                    }}>
                                        Student Documents
                                    </Typography>
                                    <Grid container spacing={3}>
                                        {[
                                            {
                                                label: "Profile Image",
                                                src: student ? student.profileImage : 'https://upload.wikimedia.org/wikipedia/commons/1/14/No_Image_Available.jpg'
                                            },
                                            {
                                                label: "Birth Certificate",
                                                src: student ? student.birthCertificateImg : 'https://upload.wikimedia.org/wikipedia/commons/1/14/No_Image_Available.jpg'
                                            },
                                            {
                                                label: "Household Registration",
                                                src: student ? student.householdRegistrationImg : 'https://upload.wikimedia.org/wikipedia/commons/1/14/No_Image_Available.jpg'
                                            }
                                        ].map((item, idx) => (
                                            <Grid item xs={12} sm={6} md={4} key={idx}>
                                                <Paper elevation={2} sx={{
                                                    p: 2,
                                                    borderRadius: 2,
                                                    height: '100%',
                                                    display: 'flex',
                                                    flexDirection: 'column',
                                                    gap: 1
                                                }}>
                                                    <Typography variant="body2" fontWeight="bold" sx={{
                                                        color: '#07663a'
                                                    }}>
                                                        {item.label}
                                                    </Typography>
                                                    <Box sx={{
                                                        width: '100%',
                                                        height: 200,
                                                        position: 'relative',
                                                        overflow: 'hidden',
                                                        borderRadius: 1,
                                                        border: '1px solid rgba(7, 102, 58, 0.2)',
                                                        bgcolor: '#f5f5f5',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center'
                                                    }}>
                                                        {item.src ? (
                                                            <img
                                                                src={item.src}
                                                                alt={item.label}
                                                                style={{
                                                                    width: '100%',
                                                                    height: '100%',
                                                                    objectFit: 'contain',
                                                                    cursor: 'pointer'
                                                                }}
                                                                onClick={() => {
                                                                    setSelectedImage(item.src);
                                                                    setOpenImageDialogs(prev => ({
                                                                        ...prev,
                                                                        profileImage: true,
                                                                        birthCertificate: false,
                                                                        householdRegistration: false
                                                                    }));
                                                                }}
                                                            />
                                                        ) : (
                                                            <Typography variant="body2" color="text.secondary">
                                                                No Image Available
                                                            </Typography>
                                                        )}
                                                    </Box>
                                                </Paper>
                                            </Grid>
                                        ))}
                                    </Grid>
                                </Grid>

                                <Grid item xs={12}>
                                    <Alert severity="info" sx={{mt: 1}}>
                                        Please verify that all student information is correct before submitting the
                                        form.
                                        If any information needs to be updated, please contact the school
                                        administration.
                                    </Alert>
                                </Grid>
                            </Grid>
                        </Box>
                    )}

                    {/* Form Fields */}
                    <TextField
                        fullWidth
                        label="Household Registration Address *"
                        value={input.address}
                        onChange={(e) => setInput({...input, address: e.target.value})}
                        error={!!errors.address}
                        helperText={errors.address}
                        sx={{
                            '& .MuiOutlinedInput-root': {
                                padding: '12px 16px'
                            }
                        }}
                    />

                    <TextField
                        fullWidth
                        label="Note"
                        value={input.note}
                        onChange={(e) => setInput({...input, note: e.target.value})}
                        multiline
                        rows={4}
                        sx={{
                            '& .MuiOutlinedInput-root': {
                                padding: '12px 16px'
                            }
                        }}
                    />

                    {/* Upload Progress */}
                    {isLoading && Object.keys(uploadProgress).length > 0 && (
                        <Box sx={{ mt: 2 }}>
                            <Typography variant="subtitle1" gutterBottom>
                                Upload Progress
                            </Typography>
                            {Object.entries(uploadProgress).map(([key, progress]) => (
                                <Box key={key} sx={{ mb: 2 }}>
                                    <Typography variant="body2" color="text.secondary">
                                        {key === 'childCharacteristicsForm' ? 'Child Characteristics Form' : 'Commitment Form'}: {progress}%
                                    </Typography>
                                    <LinearProgress 
                                        variant="determinate" 
                                        value={progress} 
                                        sx={{ 
                                            mt: 1,
                                            height: 8,
                                            borderRadius: 5
                                        }}
                                    />
                                </Box>
                            ))}
                            <Button
                                variant="outlined"
                                color="error"
                                onClick={handleCancelUpload}
                                sx={{ mt: 1 }}
                            >
                                Cancel Upload
                            </Button>
                        </Box>
                    )}

                    {/* Cancel Confirmation Dialog */}
                    <Dialog
                        open={isCancelDialogOpen}
                        onClose={() => setCancelDialogOpen(false)}
                    >
                        <DialogTitle>Cancel Upload?</DialogTitle>
                        <DialogContent>
                            <DialogContentText>
                                Are you sure you want to cancel the upload? This action cannot be undone.
                            </DialogContentText>
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={() => setCancelDialogOpen(false)}>No</Button>
                            <Button onClick={confirmCancel} color="error" autoFocus>
                                Yes, Cancel Upload
                            </Button>
                        </DialogActions>
                    </Dialog>

                    {/* Document Upload Section */}
                    <Typography variant="h6" sx={{
                        mt: 4,
                        mb: 2,
                        color: '#07663a',
                        fontWeight: 600
                    }}>
                        Upload Documents
                    </Typography>

                    <Stack container spacing={3} sx={{mt: 2}}>
                        {[
                            {
                                label: 'Child Characteristics Form',
                                key: 'childCharacteristicsForm',
                                error: errors.childCharacteristicsFormImg,
                                fileId: 1,
                                file: uploadedFile.childCharacteristicsForm
                            },
                            {
                                label: 'Commitment',
                                key: 'commit',
                                error: errors.commitmentImg,
                                fileId: 2,
                                file: uploadedFile.commit
                            }
                        ].map((item) => (
                            <Grid item xs={12} md={6} key={item.key}>
                                <Box sx={{
                                    mb: 1,
                                    height: '100%',
                                    display: 'flex',
                                    flexDirection: 'column'
                                }}>
                                    <Typography variant="subtitle2" sx={{mb: 1}}>
                                        {item.label}{item.error && <span style={{color: 'red'}}>*</span>}
                                    </Typography>
                                    <Box sx={{display: 'flex', alignItems: 'center', gap: 2}}>
                                        <Button
                                            component="label"
                                            variant="outlined"
                                            startIcon={<CloudUpload/>}
                                            sx={{height: '60%', width: '25%'}}
                                        >
                                            Upload New
                                            <input
                                                type="file"
                                                hidden
                                                onChange={(e) => {
                                                    const file = e.target.files[0];
                                                    if (file) {
                                                        setUploadedFile(prev => ({...prev, [item.key]: file}));
                                                    }
                                                }}
                                                accept="image/*"
                                            />
                                        </Button>
                                        {item.file && (
                                            <Box sx={{display: 'flex', alignItems: 'center', gap: 1}}>
                                                <Typography variant="body2" color="success.main">
                                                    Selected: {item.file.name}
                                                </Typography>
                                                <IconButton
                                                    size="small"
                                                    onClick={() => setUploadedFile(prev => ({...prev, [item.key]: ''}))}
                                                >
                                                    <Close fontSize="small" />
                                                </IconButton>
                                            </Box>
                                        )}
                                    </Box>
                                    {item.error && (
                                        <FormHelperText error>{item.error}</FormHelperText>
                                    )}
                                </Box>
                            </Grid>
                        ))}
                    </Stack>

                    {/* Action Buttons */}
                    <Stack direction="row" spacing={2} justifyContent="flex-end" sx={{mt: 4}}>
                        <Button
                            variant="contained"
                            color='warning'
                            onClick={handleClosePopUp}
                            disabled={isLoading}
                            sx={{
                                minWidth: '120px'
                            }}
                        >
                            Cancel
                        </Button>
                        <Button
                            variant="contained"
                            onClick={HandleSubmit}
                            disabled={isLoading}
                            startIcon={isLoading ? <CircularProgress size={20}/> : null}
                            sx={{
                                backgroundColor: '#07663a',
                                '&:hover': {
                                    backgroundColor: ''
                                },
                                minWidth: '120px'
                            }}
                        >
                            {isLoading ? 'Submitting...' : 'Submit'}
                        </Button>
                    </Stack>
                </Stack>
            </Box>
        </Dialog>
    );
}

function RenderRefillForm({handleClosePopUp, isPopUpOpen, selectedForm, GetForm}) {
    const [isLoading, setIsLoading] = useState(false);
    const [loadingMessage, setLoadingMessage] = useState('');
    const [errors, setErrors] = useState({});
    const [input, setInput] = useState({
        address: selectedForm?.householdRegistrationAddress || '',
        note: selectedForm?.note || ''
    });
    const [uploadedFile, setUploadedFile] = useState({
        childCharacteristicsForm: '',
        commit: ''
    });

    useEffect(() => {
        if (selectedForm) {
            setInput({
                address: selectedForm.householdRegistrationAddress || '',
                note: selectedForm.note || ''
            });
        }
    }, [selectedForm]);

    const validateForm = () => {
        const newErrors = {};

        if (!input.address?.trim()) {
            newErrors.address = "Household registration address is required";
        }

        if (!uploadedFile.childCharacteristicsForm && !selectedForm?.childCharacteristicsFormImg) {
            newErrors.childCharacteristicsForm = "Child characteristics form is required";
        }

        if (!uploadedFile.commit && !selectedForm?.commitmentImg) {
            newErrors.commit = "Commitment form is required";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const validateFileType = (file) => {
        const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp'];
        const allowedExtensions = ['.jpg', '.jpeg', '.png', 'webp'];
        const maxSize = 5 * 1024 * 1024; // 5MB

        if (!file) {
            enqueueSnackbar(`Please select a file`, {variant: "error"});
            return false;
        }

        // Check file size
        if (file.size > maxSize) {
            enqueueSnackbar(`File size should not exceed 5MB`, {variant: "error"});
            return false;
        }

        // Check MIME type
        if (!allowedTypes.includes(file.type)) {
            enqueueSnackbar(`Only JPG, JPEG & PNG & WEBP files are allowed`, {variant: "error"});
            return false;
        }

        // Check file extension
        const fileName = file.name.toLowerCase();
        const hasValidExtension = allowedExtensions.some(ext => fileName.endsWith(ext));
        if (!hasValidExtension) {
            enqueueSnackbar(`Invalid file extension. Only .jpg, .jpeg, .png .webp are allowed`, {variant: "error"});
            return false;
        }

        return true;
    };

    function HandleUploadFile(file, id) {
        try {
            // Check if file exists
            if (!file) {
                enqueueSnackbar("Please select a file to upload", {variant: "error"});
                return;
            }

            // Basic file validation
            if (!file.name || !file.type) {
                enqueueSnackbar("Invalid file format", {variant: "error"});
                return;
            }

            // Validate file type
            if (!validateFileType(file)) {
                return;
            }

            // Update state based on file type
            if (id === 1) {
                setUploadedFile(prev => ({...prev, childCharacteristicsForm: file}));
                enqueueSnackbar("Child characteristics form uploaded successfully", {variant: "success"});
            } else {
                setUploadedFile(prev => ({...prev, commit: file}));
                enqueueSnackbar("Commitment form uploaded successfully", {variant: "success"});
            }

        } catch (error) {
            console.error("Error handling file upload:", error);
            enqueueSnackbar("Error processing file", {variant: "error"});
        }
    }

    const handleUploadImage = async () => {
        try {
            if (!validateFileUploads()) {
                return null;
            }

            // Upload each file to Cloudinary
            const uploadFile = async (file) => {
                const formData = new FormData();
                formData.append("file", file);
                formData.append("upload_preset", "pes_swd");
                formData.append("cloud_name", "dfx4miova");

                const response = await axios.post(
                    "https://api.cloudinary.com/v1_1/dfx4miova/image/upload",
                    formData
                );

                if (response.status === 200) {
                    return response.data.secure_url;
                }
                throw new Error('Upload failed');
            };

            // Upload both files
            const [childCharacteristicsFormUrl, commitUrl] = await Promise.all([
                uploadFile(uploadedFile.childCharacteristicsForm),
                uploadFile(uploadedFile.commit)
            ]);

            if (!childCharacteristicsFormUrl || !commitUrl) {
                enqueueSnackbar("Failed to upload one or more images", {variant: "error"});
                return null;
            }

            return {
                childCharacteristicsFormLink: childCharacteristicsFormUrl,
                commitLink: commitUrl
            };
        } catch (error) {
            enqueueSnackbar("Failed to process images", {variant: "error"});
            return null;
        }
    };

    const validateFileUploads = () => {
        const requiredFiles = {
            childCharacteristicsForm: 'Child characteristics form',
            commit: 'Commitment form'
        };

        for (const [key, label] of Object.entries(requiredFiles)) {
            const file = uploadedFile[key];

            if (!file) {
                enqueueSnackbar(`${label} is required`, {variant: "error"});
                return false;
            }

            // Revalidate files before upload
            if (!validateFileType(file)) {
                enqueueSnackbar(`Invalid ${label.toLowerCase()}`, {variant: "error"});
                return false;
            }
        }

        return true;
    };

    async function HandleRefillSubmit() {
        try {
            if (!validateForm()) {
                return;
            }

            setIsLoading(true);
            setLoadingMessage('Uploading files...');
            const uploadResult = await handleUploadImage();
            if (!uploadResult) {
                return;
            }

            setLoadingMessage('Resubmitting form...');
            const formData = {
                studentId: selectedForm.studentId,
                householdRegistrationAddress: input.address.trim(),
                childCharacteristicsFormImg: uploadResult.childCharacteristicsFormLink,
                commitmentImg: uploadResult.commitLink,
                note: input.note?.trim() || ""
            };

            const response = await refillForm(formData);

            if (response && response.success) {
                enqueueSnackbar(response.message || "Form resubmitted successfully", {variant: 'success'});
                await GetForm();
                handleClosePopUp();
            } else {
                enqueueSnackbar(response?.message || "Failed to resubmit form", {variant: "error"});
            }
        } catch (error) {
            if (error.response?.status === 403) {
                enqueueSnackbar("Your session has expired. Please login again.", {
                    variant: "error",
                    action: (
                        <Button color="inherit" size="small" onClick={() => {
                            window.location.href = '/auth/login';
                        }}>
                            Login
                        </Button>
                    )
                });
            } else {
                enqueueSnackbar(error.response?.data?.message || "Failed to resubmit form", {variant: "error"});
            }
        } finally {
            setIsLoading(false);
            setLoadingMessage('');
        }
    }

    return (
        <Dialog fullScreen open={isPopUpOpen} onClose={handleClosePopUp}>
            <LoadingOverlay open={isLoading} message={loadingMessage} />
            
            <AppBar sx={{position: 'relative', backgroundColor: '#07663a'}}>
                <Toolbar>
                    <IconButton edge="start" color="inherit" onClick={handleClosePopUp}>
                        <Close/>
                    </IconButton>
                    <Typography sx={{ml: 2, flex: 1}} variant="h6">
                        Resubmit Admission Form
                    </Typography>
                </Toolbar>
            </AppBar>

            <Box p={4}>
                <Typography variant="h5" sx={{mb: 4, textAlign: "center", color: '#07663a'}}>
                    Resubmit Form for {selectedForm?.studentName}
                </Typography>

                <Stack spacing={4} sx={{maxWidth: '800px', mx: 'auto'}}>
                    {/* Student Information Display */}
                    <Box sx={{p: 3, backgroundColor: 'rgba(7, 102, 58, 0.05)', borderRadius: 2}}>
                        <Typography variant="h6" sx={{mb: 2, color: '#07663a'}}>
                            Student Information
                        </Typography>
                        <Grid container spacing={3}>
                            <Grid item xs={12} md={6}>
                                <TextField
                                    fullWidth
                                    label="Full Name"
                                    value={selectedForm?.studentName || ''}
                                    InputProps={{readOnly: true}}
                                />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <TextField
                                    fullWidth
                                    label="Gender"
                                    value={selectedForm?.studentGender || ''}
                                    InputProps={{readOnly: true}}
                                />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <TextField
                                    fullWidth
                                    label="Date of Birth"
                                    value={selectedForm?.studentDateOfBirth || ''}
                                    InputProps={{readOnly: true}}
                                />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <TextField
                                    fullWidth
                                    label="Place of Birth"
                                    value={selectedForm?.studentPlaceOfBirth || ''}
                                    InputProps={{readOnly: true}}
                                />
                            </Grid>
                        </Grid>
                    </Box>

                    {/* Student Documents */}
                    <Grid item xs={12}>
                        <Typography variant="subtitle1" sx={{
                            mt: 2,
                            mb: 2,
                            color: '#07663a',
                            fontWeight: 600
                        }}>
                            Student Documents
                        </Typography>
                        <Grid container spacing={3}>
                            {[
                                {
                                    label: "Profile Image",
                                    src: selectedForm ? selectedForm.profileImage : 'https://upload.wikimedia.org/wikipedia/commons/1/14/No_Image_Available.jpg'
                                },
                                {
                                    label: "Birth Certificate",
                                    src: selectedForm ? selectedForm.birthCertificateImg : 'https://upload.wikimedia.org/wikipedia/commons/1/14/No_Image_Available.jpg'
                                },
                                {
                                    label: "Household Registration",
                                    src: selectedForm ? selectedForm.householdRegistrationImg : 'https://upload.wikimedia.org/wikipedia/commons/1/14/No_Image_Available.jpg'
                                }
                            ].map((item, idx) => (
                                <Grid item xs={12} sm={6} md={4} key={idx}>
                                    <Paper elevation={2} sx={{
                                        p: 2,
                                        borderRadius: 2,
                                        height: '100%',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        gap: 1
                                    }}>
                                        <Typography variant="body2" fontWeight="bold" sx={{
                                            color: '#07663a'
                                        }}>
                                            {item.label}
                                        </Typography>
                                        <Box sx={{
                                            width: '100%',
                                            height: 200,
                                            position: 'relative',
                                            overflow: 'hidden',
                                            borderRadius: 1,
                                            border: '1px solid rgba(7, 102, 58, 0.2)',
                                            bgcolor: '#f5f5f5',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center'
                                        }}>
                                            {item.src ? (
                                                <img
                                                    src={item.src}
                                                    alt={item.label}
                                                    style={{
                                                        width: '100%',
                                                        height: '100%',
                                                        objectFit: 'contain',
                                                        cursor: 'pointer'
                                                    }}
                                                    onClick={() => {
                                                        setSelectedImage(item.src);
                                                        setOpenImageDialogs(prev => ({
                                                            ...prev,
                                                            profileImage: true,
                                                            birthCertificate: false,
                                                            householdRegistration: false
                                                        }));
                                                    }}
                                                />
                                            ) : (
                                                <Typography variant="body2" color="text.secondary">
                                                    No Image Available
                                                </Typography>
                                            )}
                                        </Box>
                                    </Paper>
                                </Grid>
                            ))}
                        </Grid>
                    </Grid>

                    <Grid item xs={12}>
                        <Alert severity="info" sx={{mt: 1}}>
                            Please verify that all student information is correct before submitting the
                            form.
                            If any information needs to be updated, please contact the school
                            administration.
                        </Alert>
                    </Grid>

                    {/* Form Fields */}
                    <TextField
                        fullWidth
                        label="Household Registration Address *"
                        value={input.address}
                        onChange={(e) => setInput({...input, address: e.target.value})}
                        error={!!errors.address}
                        helperText={errors.address}
                    />

                    <TextField
                        fullWidth
                        label="Note"
                        value={input.note}
                        onChange={(e) => setInput({...input, note: e.target.value})}
                        multiline
                        rows={4}
                    />

                    {/* File Upload Section */}
                    <Box>
                        <Typography variant="h6" sx={{mb: 2, color: '#07663a'}}>
                            Required Documents
                        </Typography>
                        <Stack spacing={3}>
                            <Box>
                                <Typography variant="subtitle1" sx={{mb: 1}}>
                                    Child Characteristics Form *
                                </Typography>
                                <Box sx={{display: 'flex', alignItems: 'center', gap: 2}}>
                                    <Button
                                        component="label"
                                        variant="outlined"
                                        startIcon={<CloudUpload/>}
                                        sx={{height: '60%', width: '25%'}}
                                    >
                                        Upload New
                                        <input
                                            type="file"
                                            hidden
                                            onChange={(e) => HandleUploadFile(e.target.files[0], 1)}
                                            accept="image/*"
                                        />
                                    </Button>
                                    {uploadedFile.childCharacteristicsForm && (
                                        <Box sx={{display: 'flex', alignItems: 'center', gap: 1, justifyContent: 'space-between'}}>
                                            <Typography variant="body2" color="success.main">
                                                Selected: {uploadedFile.childCharacteristicsForm.name}
                                            </Typography>
                                            <IconButton
                                                size="small"
                                                onClick={() => setUploadedFile(prev => ({...prev, childCharacteristicsForm: ''}))}
                                            >
                                                <Close fontSize="small" />
                                            </IconButton>
                                        </Box>
                                    )}
                                </Box>
                                {errors.childCharacteristicsForm && (
                                    <Typography color="error" variant="caption">
                                        {errors.childCharacteristicsForm}
                                    </Typography>
                                )}
                            </Box>

                            <Box>
                                <Typography variant="subtitle1" sx={{mb: 1}}>
                                    Commitment Form *
                                </Typography>
                                <Box sx={{display: 'flex', alignItems: 'center', gap: 2}}>
                                    <Button
                                        component="label"
                                        variant="outlined"
                                        startIcon={<CloudUpload/>}
                                        sx={{height: '60%', width: '25%'}}
                                    >
                                        Upload New
                                        <input
                                            type="file"
                                            hidden
                                            onChange={(e) => HandleUploadFile(e.target.files[0], 2)}
                                            accept="image/*"
                                        />
                                    </Button>
                                    {uploadedFile.commit && (
                                        <Box sx={{display: 'flex', alignItems: 'center', gap: 1, justifyContent: 'flex-end'}}>
                                            <Typography variant="body2" color="success.main">
                                                Selected: {uploadedFile.commit.name}
                                            </Typography>
                                            <IconButton
                                                size="small"
                                                onClick={() => setUploadedFile(prev => ({...prev, commit: ''}))}
                                            >
                                                <Close fontSize="small" />
                                            </IconButton>
                                        </Box>
                                    )}
                                </Box>
                                {errors.commit && (
                                    <Typography color="error" variant="caption">
                                        {errors.commit}
                                    </Typography>
                                )}
                            </Box>
                        </Stack>
                    </Box>

                    {/* Action Buttons */}
                    <Stack direction="row" spacing={2} justifyContent="flex-end">
                        <Button
                            variant="contained"
                            color="warning"
                            onClick={handleClosePopUp}
                            disabled={isLoading}
                        >
                            Cancel
                        </Button>
                        <Button
                            variant="contained"
                            onClick={HandleRefillSubmit}
                            disabled={isLoading}
                            startIcon={isLoading ? <CircularProgress size={20}/> : null}
                            sx={{backgroundColor: '#07663a'}}
                        >
                            {isLoading ? 'Resubmitting...' : 'Resubmit'}
                        </Button>
                    </Stack>
                </Stack>
            </Box>
        </Dialog>
    );
}

function RenderPage({
                        openFormPopUpFunc,
                        openDetailPopUpFunc,
                        openRefillPopUpFunc,
                        forms,
                        HandleSelectedForm,
                        studentList
                    }) {
    return (
        <div className="container">
            {/*1.tiêu đề */}
            <Box sx={{mt: 2, mb: 2}}>
                <Typography
                    variant="h4"
                    fontWeight="bold"
                    sx={{
                        textAlign: 'center',
                        fontFamily: 'inherit',
                        letterSpacing: 1,
                        mb: 1,
                        color: '#07663a'
                    }}
                >
                    Form Admission
                </Typography>
                <Typography
                    variant="subtitle1"
                    color="text.secondary"
                    sx={{
                        textAlign: 'center',
                        fontWeight: 500,
                        fontFamily: 'inherit'
                    }}
                >
                    Fill and submit the student admission form
                </Typography>
            </Box>

            {/*2. button create new term */}
            <Box sx={{display: 'flex', justifyContent: 'flex-end', mb: 2}}>
                <Button
                    variant="contained"
                    endIcon={<Add/>}
                    onClick={openFormPopUpFunc}
                    sx={{
                        minWidth: 180,
                        height: 44,
                        borderRadius: '10px',
                        fontWeight: 600,
                        fontSize: 14,
                        backgroundColor: '#07663a',
                        '&:hover': {
                            backgroundColor: 'rgba(7, 102, 58, 0.85)'
                        },
                        boxShadow: 2,
                        mr: {xs: 0, md: 2}
                    }}
                >
                    Create new form
                </Button>
            </Box>

            {/*3. cần 1 bảng để hiện list */}
            <RenderTable
                forms={forms}
                openDetailPopUpFunc={openDetailPopUpFunc}
                openRefillPopUpFunc={openRefillPopUpFunc}
                HandleSelectedForm={HandleSelectedForm}
            />
        </div>
    )
}

export default function AdmissionForm() {
    const [popUp, setPopUp] = useState({
        isOpen: false,
        type: ''
    });

    const [data, setData] = useState({
        admissionFormList: [],
        studentList: []
    });

    const [selectedForm, setSelectedForm] = useState(null);

    function HandleSelectedForm(form) {
        setSelectedForm(form);
    }

    const handleOpenPopUp = (type) => {
        setPopUp({...popUp, isOpen: true, type: type});
    }

    const handleClosePopUp = () => {
        setPopUp({...popUp, isOpen: false, type: ''});
        GetForm();
    }

    async function GetForm() {
        try {
            const response = await getFormInformation();
            if (response && response.success) {
                setData({
                    admissionFormList: response.data.admissionFormList || [],
                    studentList: response.data.studentList || []
                });
            } else {
                enqueueSnackbar("Failed to fetch data", {variant: "error"});
            }
        } catch (error) {
            enqueueSnackbar(error.message || "Failed to fetch data", {variant: "error"});
        }
    }

    useEffect(() => {
        GetForm();
    }, []);

    return (
        <>
            <RenderPage
                forms={data.admissionFormList}
                openFormPopUpFunc={() => handleOpenPopUp('form')}
                openDetailPopUpFunc={() => handleOpenPopUp('detail')}
                openRefillPopUpFunc={() => handleOpenPopUp('refill')}
                HandleSelectedForm={HandleSelectedForm}
                studentList={data.studentList}
            />
            {popUp.isOpen && popUp.type === 'form' && (
                <RenderFormPopUp
                    isPopUpOpen={popUp.isOpen}
                    handleClosePopUp={handleClosePopUp}
                    studentList={data.studentList}
                    GetForm={GetForm}
                />
            )}
            {popUp.isOpen && popUp.type === 'detail' && (
                <RenderDetailPopUp
                    isPopUpOpen={popUp.isOpen}
                    handleClosePopUp={handleClosePopUp}
                    selectedForm={selectedForm}
                    GetForm={GetForm}
                />
            )}
            {popUp.isOpen && popUp.type === 'refill' && (
                <RenderRefillForm
                    isPopUpOpen={popUp.isOpen}
                    handleClosePopUp={handleClosePopUp}
                    selectedForm={selectedForm}
                    GetForm={GetForm}
                />
            )}
        </>
    );
}