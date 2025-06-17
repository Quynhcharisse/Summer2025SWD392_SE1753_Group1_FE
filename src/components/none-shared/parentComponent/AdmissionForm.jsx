import {
    Alert,
    AppBar,
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
import {Add, Close, CloudUpload, Info} from '@mui/icons-material';
import {useEffect, useState} from "react";
import {DatePicker} from "@mui/x-date-pickers/DatePicker";
import {LocalizationProvider} from "@mui/x-date-pickers/LocalizationProvider";
import {AdapterDateFns} from "@mui/x-date-pickers/AdapterDateFns";
import {parseISO} from "date-fns";
import {enqueueSnackbar} from "notistack";
import axios from "axios";
import {cancelAdmission, getFormInformation, submittedForm} from "@services/parentService.js";


function RenderTable({openDetailPopUpFunc, forms, HandleSelectedForm}) {
    const [page, setPage] = useState(0); // Trang hiện tại
    const [rowsPerPage, setRowsPerPage] = useState(5); //số dòng trang

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    }

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(event.target.value)
        setPage(0)
    }

    const handleDetailClick = (form) => {
        // Xử lý khi người dùng click vào nút "Detail"
        HandleSelectedForm(form)
        openDetailPopUpFunc();
    }

    return (
        <Paper sx={{
            width: '100%',
            height: 500,
            borderRadius: 3,
            overflow: 'hidden',
            backgroundColor: '#fff',
            boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.1)',
            border: '2px solid rgb(254, 254, 253)'
        }}>

            <TableContainer sx={{height: 500}}>
                <Table stickyHeader>
                    <TableHead>
                        <TableRow>
                            <TableCell align={"center"}>No</TableCell>
                            <TableCell align={"center"}>Submit Date</TableCell>
                            <TableCell align={"center"}>Cancel Reason</TableCell>
                            <TableCell align={"center"}>Status</TableCell>
                            <TableCell align={"center"}>Note</TableCell>
                            <TableCell align={"center"}>Action</TableCell>
                        </TableRow>
                    </TableHead>

                    <TableBody>
                        {forms?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                            .map((form, index) => {
                                return (
                                    <TableRow
                                        key={index}
                                    >
                                        <TableCell align={"center"}>{index + 1}</TableCell>
                                        <TableCell align={"center"}>{form.submittedDate}</TableCell>
                                        <TableCell align={"center"}>{form.cancelReason || "N/A"}</TableCell>
                                        <TableCell align="center" sx={{
                                            color:
                                                form.status === "approved"
                                                    ? "#07663a"
                                                    : form.status === "rejected" || form.status === "cancelled"
                                                        ? "#dc3545"
                                                        : form.status === "pending approval" || form.status === "pending"
                                                            ? "#0d6efd"
                                                            : "black",
                                            fontWeight: "600",
                                            padding: '6px 12px',
                                            width: 'fit-content',
                                            margin: '0 auto'
                                        }}>
                                            {form.status}
                                        </TableCell>
                                        <TableCell align={"center"}>{form.note}</TableCell>
                                        <TableCell align={"center"}>
                                            <IconButton
                                                onClick={() => handleDetailClick(form)}
                                                sx={{
                                                    backgroundColor: 'rgba(7, 102, 58, 0.1)',
                                                    borderRadius: '12px',
                                                    padding: '8px',
                                                    '&:hover': {
                                                        backgroundColor: 'rgba(7, 102, 58, 0.2)',
                                                    },
                                                    transition: 'all 0.2s'
                                                }}
                                            >
                                                <Info sx={{
                                                    color: '#07663a',
                                                    fontSize: '1.2rem'
                                                }}/>
                                            </IconButton>
                                        </TableCell>
                                    </TableRow>
                                )
                            })
                        }
                    </TableBody>
                </Table>
            </TableContainer>
            <TablePagination
                component="div"
                rowsPerPageOptions={[5, 10, 15]}
                count={forms?.length}
                page={page}
                onPageChange={handleChangePage}
                rowsPerPage={rowsPerPage}
                onRowsPerPageChange={handleChangeRowsPerPage}
                sx={{
                    '.MuiTablePagination-select': {
                        backgroundColor: 'rgba(7, 102, 58, 0.1)',
                        borderRadius: '8px',
                        padding: '4px 8px',
                    },
                    '.MuiTablePagination-selectIcon': {
                        color: '#07663a'
                    }
                }}
            />
        </Paper>
    )
}

function RenderDetailPopUp({handleClosePopUp, isPopUpOpen, selectedForm}) {

    const [openConfirm, setOpenConfirm] = useState(false); // tạo usestate để mở dialog

    const handleOpenConfirm = () => setOpenConfirm(true);

    /*handleCloseConfirm sẽ đặt lại openConfirm = false để đóng dialog khi người dùng nhấn Disagree hoặc đóng hộp thoại*/
    const handleCloseConfirm = () => setOpenConfirm(false);

    //tạo state để hiển thị ảnh
    const [openImage, setOpenImage] = useState(false);
    const [selectedImage, setSelectedImage] = useState('');

    async function HandleCancel() {
        console.log(selectedForm.id)
        try {
            const response = await cancelAdmission(selectedForm.id);
            if (response && response.success) {
                enqueueSnackbar(response.message || "Form cancelled successfully", {variant: "success"});
                handleClosePopUp();
                handleCloseConfirm(); // Close confirm dialog
                // await GetForm(); // Refresh the form list
            } else {
                enqueueSnackbar(response?.message || "Failed to cancel admission form", {variant: "error"});
            }
        } catch (error) {
            console.error("Error canceling form:", error);
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
        }
    }

    console.log(selectedForm)
    return (
        <Dialog
            fullScreen
            open={isPopUpOpen}
            onClose={handleClosePopUp}
        >
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
                            {label: "Child Characteristics Form", src: selectedForm.childCharacteristicsFormImg},
                            {label: "Commitment", src: selectedForm.commitmentImg}
                        ].map((item, idx) => (
                            <Paper key={idx} elevation={2} sx={{p: 2, borderRadius: 2, width: 200}}>
                                <Typography variant="body2" fontWeight="bold" sx={{mb: 1}}>{item.label}</Typography>

                                {/*thay vì click="ảnh" redirect sang link khác*/}
                                {/*vì giải quyết vấn đề hiện model thôi*/}
                                <img
                                    src={item.src}
                                    alt={item.label}
                                    style={{width: '100%', borderRadius: 8, cursor: 'pointer'}}
                                    onClick={() => {
                                        setSelectedImage(item.src);
                                        setOpenImage(true);
                                    }}
                                />

                                <Dialog open={openImage} onClose={() => setOpenImage(false)} maxWidth="md">
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
                        <Dialog open={openConfirm} onClose={handleCloseConfirm}>
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
                                    sx={{
                                        color: 'red',
                                    }}
                                >
                                    Disagree
                                </Button>
                                <Button
                                    onClick={HandleCancel}
                                    sx={{
                                        color: 'red',
                                    }}
                                    autoFocus
                                >
                                    Agree
                                </Button>
                            </DialogActions>
                        </Dialog>
                    </Stack>
                </Stack>
            </Box>
        </Dialog>
    )
}

function RenderFormPopUp({handleClosePopUp, isPopUpOpen, studentList, GetForm}) {
    //Lưu id học sinh được chọn từ dropdown
    const [selectedStudentId, setSelectedStudentId] = useState(0);

    //Hiển thị trạng thái đang xử lý (true khi submit, upload...)
    const [isLoading, setIsLoading] = useState(false);

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

    const student = studentList.find(s => s.id === selectedStudentId) || null



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

    // Debug log khi studentList thay đổi
    useEffect(() => {
        console.log("Student List:", studentList);
    }, [studentList]);

    // Debug log khi selectedStudentId thay đổi
    useEffect(() => {
        if (selectedStudentId) {
            console.log("Selected Student ID:", selectedStudentId);
            console.log("Selected Student:", student);
        }
    }, [selectedStudentId]);

    const validateForm = () => {
        const newErrors = {};

        // Required field validations
        if (!selectedStudentId) {
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

    const validateFileSize = (file) => {
        const minSize = 10 * 1024; // 10KB
        const maxSize = 5 * 1024 * 1024; // 5MB

        if (!file) {
            enqueueSnackbar(`Please select a file`, {variant: "error"});
            return false;
        }

        if (file.size < minSize) {
            enqueueSnackbar(`File size should not be less than 10KB`, {variant: "error"});
            return false;
        }

        if (file.size > maxSize) {
            enqueueSnackbar(`File size should not exceed 5MB`, {variant: "error"});
            return false;
        }

        return true;
    };

    const validateFileType = (file) => {
        const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];
        const allowedExtensions = ['.jpg', '.jpeg', '.png'];

        if (!file) {
            enqueueSnackbar(`Please select a file`, {variant: "error"});
            return false;
        }

        // Check MIME type
        if (!allowedTypes.includes(file.type)) {
            enqueueSnackbar(`Only JPG, JPEG & PNG files are allowed`, {variant: "error"});
            return false;
        }

        // Check file extension
        const fileName = file.name.toLowerCase();
        const hasValidExtension = allowedExtensions.some(ext => fileName.endsWith(ext));
        if (!hasValidExtension) {
            enqueueSnackbar(`Invalid file extension. Only .jpg, .jpeg, .png are allowed`, {variant: "error"});
            return false;
        }

        return true;
    };

    async function HandleSubmit() {
        try {
            if (!validateForm()) {
                return;
            }

            setIsLoading(true);
            const uploadResult = await handleUploadImage();
            if (!uploadResult) {
                return;
            }

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
                            window.location.href = '/login';
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
            if (!file.name || !file.type || !file.size) {
                enqueueSnackbar("Invalid file format", {variant: "error"});
                return;
            }

            // Validate file size and type
            if (!validateFileSize(file) || !validateFileType(file)) {
                return;
            }

            // Create a new FileReader
            const reader = new FileReader();
            reader.onload = function (e) {
                // Create an image object to check dimensions
                const img = new Image();
                img.onload = function () {
                    // Check minimum dimensions (e.g., 200x200 pixels)
                    if (this.width < 200 || this.height < 200) {
                        enqueueSnackbar("Image dimensions should be at least 200x200 pixels", {variant: "error"});
                        return;
                    }

                    // Check maximum dimensions (e.g., 4000x4000 pixels)
                    if (this.width > 4000 || this.height > 4000) {
                        enqueueSnackbar("Image dimensions should not exceed 4000x4000 pixels", {variant: "error"});
                        return;
                    }

                    // If all validations pass, update the state
                    switch (id) {
                        case 1:
                            setUploadedFile({...uploadedFile, childCharacteristicsForm: file});
                            break;
                        default:
                            setUploadedFile({...uploadedFile, commit: file});
                            break;
                    }
                };
                img.onerror = function () {
                    enqueueSnackbar("Invalid image file", {variant: "error"});
                };
                img.src = e.target.result;
            };
            reader.onerror = function () {
                enqueueSnackbar("Error reading file", {variant: "error"});
            };
            reader.readAsDataURL(file);

        } catch (error) {
            console.error('Error handling file upload:', error);
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
                formData.append("cloud_name", "dbrfnkrbh");

                const response = await axios.post(
                    "https://api.cloudinary.com/v1_1/dbrfnkrbh/image/upload",
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
            console.error('Error in handleUploadImage:', error);
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
            if (!validateFileSize(file) || !validateFileType(file)) {
                enqueueSnackbar(`Invalid ${label.toLowerCase()}`, {variant: "error"});
                return false;
            }
        }

        return true;
    };

    // bản chât luôn nằm trong hàm tổng, chỉ là ẩn nó thông qua cái nút
    return (
        <Dialog
            fullScreen
            open={isPopUpOpen}
            onClose={handleClosePopUp}
        >
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
                                studentList.map((student) => (
                                    <MenuItem
                                        key={student.id}
                                        value={student.id}
                                        disabled={student.hadForm}
                                    >
                                        {student.name} {student.hadForm ? '(Already has form)' : ''}
                                    </MenuItem>
                                ))
                            ) : (
                                <MenuItem disabled>No available students</MenuItem>
                            )}
                        </Select>
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
                                            {label: "Profile Image", src: student ? student.profileImage : 'https://upload.wikimedia.org/wikipedia/commons/1/14/No_Image_Available.jpg'},
                                            {label: "Birth Certificate", src: student ? student.birthCertificateImg : 'https://upload.wikimedia.org/wikipedia/commons/1/14/No_Image_Available.jpg'},
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
                                                                    setOpenImage(true);
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

                    {/* Document Upload Section */}
                    <Typography variant="h6" sx={{
                        mt: 4,
                        mb: 2,
                        color: '#07663a',
                        fontWeight: 600
                    }}>
                        Upload Documents
                    </Typography>

                    <Grid container spacing={3} sx={{mt: 2}}>
                        {[
                            {
                                label: 'Child Characteristics Form',
                                key: 'childCharacteristicsForm',
                                error: errors.childCharacteristicsForm
                            },
                            {label: 'Commitment', key: 'commit', error: errors.commit}
                        ].map((item) => (
                            <Grid item xs={12} md={6} key={item.key}>
                                <Box sx={{
                                    mb: 1,
                                    height: '100%',
                                    display: 'flex',
                                    flexDirection: 'column'
                                }}>
                                    <Typography variant="subtitle2" sx={{mb: 1}}>
                                        {item.label} {item.error && <span style={{color: 'red'}}>*</span>}
                                    </Typography>
                                    <Button
                                        variant="outlined"
                                        component="label"
                                        startIcon={<CloudUpload/>}
                                        fullWidth
                                        sx={{
                                            height: '56px',
                                            borderColor: '#07663a',
                                            color: '#07663a',
                                            '&:hover': {
                                                borderColor: '#07663a',
                                                backgroundColor: 'rgba(7, 102, 58, 0.04)'
                                            }
                                        }}
                                    >
                                        Upload
                                        <input
                                            type="file"
                                            hidden
                                            onChange={(e) => HandleUploadFile(e.target.files[0], ['childCharacteristicsForm', 'commit'].indexOf(item.key) + 1)}
                                            accept="image/*"
                                        />
                                    </Button>
                                    {uploadedFile[item.key] && (
                                        <Typography variant="caption" sx={{mt: 1, display: 'block'}}>
                                            Selected: {uploadedFile[item.key].name}
                                        </Typography>
                                    )}
                                    {item.error && (
                                        <FormHelperText error>{item.error}</FormHelperText>
                                    )}
                                </Box>
                            </Grid>
                        ))}
                    </Grid>

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

function RenderPage({openFormPopUpFunc, openDetailPopUpFunc, forms, HandleSelectedForm, studentList}) {

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
                HandleSelectedForm={HandleSelectedForm}//selected form moi dc
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
            console.error("Error fetching data:", error);
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
                HandleSelectedForm={HandleSelectedForm}
                studentList={data.studentList}
            />
            {popUp.isOpen && popUp.type === 'form' && (
                <RenderFormPopUp
                    isPopUpOpen={popUp.isOpen}//chú ý
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
                />
            )}
        </>
    );
}