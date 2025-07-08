import {
    AppBar,
    Box,
    Button,
    Chip,
    CircularProgress,
    Dialog,
    FormControl,
    FormControlLabel,
    FormLabel,
    IconButton,
    Paper,
    Radio,
    RadioGroup,
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
import {Close, Info} from '@mui/icons-material';
import {useEffect, useState} from "react";
import {DatePicker} from "@mui/x-date-pickers/DatePicker";
import {LocalizationProvider} from "@mui/x-date-pickers/LocalizationProvider";
import {AdapterDateFns} from "@mui/x-date-pickers/AdapterDateFns";
import {getFormTracking, processAdmissionForm} from "@/api/services/admissionService.js";
import {parseISO} from "date-fns";
import {enqueueSnackbar} from "notistack";
import LoadingOverlay from "@/components/none-shared/LoadingOverlay.jsx";


function RenderTable({openDetailPopUpFunc, forms, HandleSelectedForm}) {
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

    const filteredForms = forms?.filter(form => form.status !== "cancelled" && (form.status !== "refilled")) || [];

    return (
        <Paper sx={{
            width: '100%',
            minHeight: 400,
            maxHeight: 'calc(100vh - 200px)',
            borderRadius: 3,
            overflow: 'visible',
            backgroundColor: '#fff',
            boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.1)',
            border: '2px solid rgb(254, 254, 253)',
            display: 'flex',
            flexDirection: 'column'
        }}>
            <TableContainer sx={{flex: 1, maxHeight: 'calc(100vh - 300px)', overflow: 'auto'}}>
                <Table stickyHeader>
                    <TableHead>
                        <TableRow>
                            <TableCell align="center" sx={{
                                fontWeight: 'bold',
                                minWidth: 80,
                                backgroundColor: '#f8faf8',
                                color: '#07663a',
                                fontSize: '0.95rem',
                                borderBottom: '2px solid #e0e0e0'
                            }}>No</TableCell>
                            <TableCell align="center" sx={{
                                fontWeight: 'bold',
                                minWidth: 160,
                                backgroundColor: '#f8faf8',
                                color: '#07663a',
                                fontSize: '0.95rem',
                                borderBottom: '2px solid #e0e0e0'
                            }}>Child Name</TableCell>
                            <TableCell align="center" sx={{
                                fontWeight: 'bold',
                                minWidth: 140,
                                backgroundColor: '#f8faf8',
                                color: '#07663a',
                                fontSize: '0.95rem',
                                borderBottom: '2px solid #e0e0e0'
                            }}>Submit Date</TableCell>
                            <TableCell align="center" sx={{
                                fontWeight: 'bold',
                                minWidth: 160,
                                backgroundColor: '#f8faf8',
                                color: '#07663a',
                                fontSize: '0.95rem',
                                borderBottom: '2px solid #e0e0e0'
                            }}>Cancel Reason</TableCell>
                            <TableCell align="center" sx={{
                                fontWeight: 'bold',
                                minWidth: 120,
                                backgroundColor: '#f8faf8',
                                color: '#07663a',
                                fontSize: '0.95rem',
                                borderBottom: '2px solid #e0e0e0'
                            }}>Status</TableCell>
                            <TableCell align="center" sx={{
                                fontWeight: 'bold',
                                minWidth: 120,
                                backgroundColor: '#f8faf8',
                                color: '#07663a',
                                fontSize: '0.95rem',
                                borderBottom: '2px solid #e0e0e0'
                            }}>Note</TableCell>
                            <TableCell align="center" sx={{
                                fontWeight: 'bold',
                                minWidth: 120,
                                backgroundColor: '#f8faf8',
                                color: '#07663a',
                                fontSize: '0.95rem',
                                borderBottom: '2px solid #e0e0e0'
                            }}>Action</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {filteredForms
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
                                    <TableCell align="center">{index + 1}</TableCell>
                                    <TableCell align="center">{form.studentName}</TableCell>
                                    <TableCell align="center">{form.submittedDate}</TableCell>
                                    <TableCell align="center">{form.cancelReason || "N/A"}</TableCell>
                                    <TableCell align="center">
                                        <Chip
                                            label={form.status === "approved paid" ? "Approved & Paid" : form.status}
                                            sx={{
                                                backgroundColor:
                                                    form.status === "approved" ? "rgba(7, 102, 58, 0.1)" :
                                                        form.status === "approved paid" ? "rgba(46, 125, 50, 0.1)" :
                                                            form.status === "rejected" || form.status === "cancelled" ? "rgba(220, 53, 69, 0.1)" :
                                                                form.status === "pending approval" || form.status === "pending" ? "rgba(13, 110, 253, 0.1)" :
                                                                    form.status === "waiting payment" ? "rgba(0, 0, 128, 0.1)" :
                                                                        "transparent",
                                                color:
                                                    form.status === "approved" ? "#07663a" :
                                                        form.status === "approved paid" ? "#2E7D32" :
                                                            form.status === "rejected" || form.status === "cancelled" ? "#dc3545" :
                                                                form.status === "pending approval" || form.status === "pending" ? "#0d6efd" :
                                                                    form.status === "waiting payment" ? "#000080" :
                                                                        "black",
                                                fontWeight: "600",
                                                borderRadius: '20px',
                                                textTransform: "capitalize"
                                            }}
                                        />
                                    </TableCell>
                                    <TableCell align="center">{form.note || "N/A"}</TableCell>
                                    <TableCell align="center">
                                        <Button
                                            variant="contained"
                                            startIcon={<Info/>}
                                            onClick={() => handleDetailClick(form)}
                                            sx={{
                                                backgroundColor: '#07663a',
                                                '&:hover': {
                                                    backgroundColor: 'rgba(7, 102, 58, 0.85)'
                                                },
                                                textTransform: 'none',
                                                borderRadius: '8px',
                                                boxShadow: 'none'
                                            }}
                                        >
                                            Info
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                    </TableBody>
                </Table>
            </TableContainer>
            <TablePagination
                component="div"
                rowsPerPageOptions={[5, 10, 15]}
                count={filteredForms?.length}
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
                    backgroundColor: '#fff',
                    position: 'sticky',
                    bottom: 0,
                    zIndex: 2
                }}
            />
        </Paper>
    )
}

function RenderDetailPopUp({isPopUpOpen, handleClosePopUp, selectedForm}) {
    const [confirmDialog, setConfirmDialog] = useState({
        open: false,
        type: '',
        reason: ''
    });
    const [isProcessing, setIsProcessing] = useState(false);
    const [openImage, setOpenImage] = useState(false);
    const [selectedImage, setSelectedImage] = useState('');

    async function HandleProcessForm(isApproved, reason) {
        setIsProcessing(true);
        try {
            const response = await processAdmissionForm(selectedForm.id, isApproved, reason);

            if (response && response.success) {
                enqueueSnackbar(
                    isApproved ? "Approved successfully" : "Rejected successfully",
                    {variant: "success"}
                );
                handleClosePopUp();
            } else {
                enqueueSnackbar(
                    isApproved ? "Approval failed" : "Rejection failed",
                    {variant: "error"}
                );
            }
        } catch (error) {
            enqueueSnackbar(
                "An error occurred while processing the form",
                {variant: "error"}
            );
        } finally {
            setIsProcessing(false);
            setConfirmDialog({open: false, type: '', reason: ''});
        }
    }

    return (
        <Dialog
            fullScreen
            open={isPopUpOpen}
            onClose={handleClosePopUp}
        >
            <LoadingOverlay open={isProcessing}
                            message={confirmDialog.type === 'approve' ? 'Approving form...' : 'Rejecting form...'}/>

            <AppBar sx={{position: 'relative', bgcolor: '#07663a'}}>
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
                    sx={{mb: 2, fontWeight: 'bold', fontSize: "2.5rem", textAlign: "center"}}
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
                            <DatePicker label='Date of birth' disabled
                                        value={selectedForm.studentDateOfBirth ? parseISO(selectedForm.studentDateOfBirth.toString()) : null}
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

                    <Typography variant="subtitle1" sx={{mt: 5, mb: 2, fontWeight: 'bold'}}>Uploaded
                        Documents</Typography>
                    <Stack direction="row" spacing={3} flexWrap="wrap" useFlexGap>
                        {[
                            {label: "Profile Image", src: selectedForm.profileImage},
                            {label: "Household Registration", src: selectedForm.householdRegistrationImg},
                            {label: "Birth Certificate", src: selectedForm.birthCertificateImg},
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
                    <Stack sx={{
                        display: 'flex',
                        flexDirection: 'row',
                        justifyContent: 'flex-end',
                        gap: '1rem',
                        marginTop: '2vh',
                    }}>
                        <Button sx={{width: '8%', height: '5vh'}}
                                variant="contained"
                                color="warning"
                                onClick={handleClosePopUp}>
                            Close
                        </Button>

                        {selectedForm.status === "pending approval" && (
                            <>
                                <Button
                                    sx={{width: '8%', height: '5vh'}}
                                    variant="contained"
                                    color="success"
                                    onClick={() => setConfirmDialog({open: true, type: 'approve', reason: ''})}
                                >
                                    Approve
                                </Button>
                                <Button
                                    sx={{width: '8%', height: '5vh'}}
                                    variant="contained"
                                    color="error"
                                    onClick={() => setConfirmDialog({open: true, type: 'reject', reason: ''})}
                                >
                                    Reject
                                </Button>
                            </>
                        )}

                    </Stack>
                    <Dialog open={confirmDialog.open}
                            onClose={() => setConfirmDialog({open: false, type: '', reason: ''})}>
                        <Box p={3} width={500}>
                            <Stack spacing={3}>
                                <Typography variant="h6" fontWeight="bold"
                                            color={confirmDialog.type === 'approve' ? '#07663a' : '#dc3545'}>
                                    {confirmDialog.type === 'approve' ? 'Confirm Approval' : 'Confirm Rejection'}
                                </Typography>

                                <Typography variant="body2" sx={{whiteSpace: 'pre-line'}}>
                                    {confirmDialog.type === 'approve'
                                        ? 'Are you sure you want to approve this admission form?\nThis action cannot be undone.'
                                        : 'Are you sure you want to reject this form?\nPlease enter a reason below.'}
                                </Typography>

                                {confirmDialog.type === 'reject' && (
                                    <TextField
                                        multiline
                                        minRows={3}
                                        label="Reason for rejection"
                                        placeholder="Enter reason..."
                                        fullWidth
                                        value={confirmDialog.reason}
                                        onChange={(e) =>
                                            setConfirmDialog(prev => ({...prev, reason: e.target.value}))
                                        }
                                    />
                                )}

                                <Stack direction="row" spacing={2} justifyContent="flex-end">
                                    <Button
                                        onClick={() => setConfirmDialog({open: false, type: '', reason: ''})}
                                        disabled={isProcessing}
                                    >
                                        Cancel
                                    </Button>
                                    <Button
                                        variant="contained"
                                        color={confirmDialog.type === 'approve' ? 'success' : 'error'}
                                        onClick={() => {
                                            const isApproved = confirmDialog.type === 'approve';
                                            const reason = isApproved ? '' : confirmDialog.reason.trim();

                                            if (!isApproved && reason === '') {
                                                enqueueSnackbar("Please enter a reason for rejection.", {variant: "warning"});
                                                return;
                                            }
                                            HandleProcessForm(isApproved, reason);
                                        }}
                                        disabled={isProcessing}
                                        startIcon={isProcessing ? <CircularProgress size={20}/> : null}
                                    >
                                        {isProcessing ? (confirmDialog.type === 'approve' ? 'Approving...' : 'Rejecting...') : 'Confirm'}
                                    </Button>
                                </Stack>
                            </Stack>
                        </Box>
                    </Dialog>
                </Stack>
            </Box>
        </Dialog>
    )
}

function RenderPage({openDetailPopUpFunc, forms, HandleSelectedForm}) {
    return (
        <Box sx={{
            width: '100%',
            minHeight: '100vh',
            background: '#f7f7f9',
            py: 4,
            px: {xs: 1, sm: 4, md: 8},
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
        }}>
            <Box sx={{
                width: '100%',
                maxWidth: 1200,
                mb: 3,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
            }}>
                <Typography variant="h4" sx={{
                    fontWeight: 'bold',
                    color: '#07663a',
                    mb: 1,
                    textAlign: 'center',
                    fontSize: '2.5rem',
                    letterSpacing: 1
                }}>
                    Process Admission
                </Typography>
                <Typography variant="subtitle1" sx={{color: '#6b7280', mb: 2, textAlign: 'center'}}>
                    Manage and review admission forms submitted by parents
                </Typography>
            </Box>
            <Box sx={{width: '100%', maxWidth: 1200}}>
                <RenderTable
                    forms={forms}
                    openDetailPopUpFunc={openDetailPopUpFunc}
                    HandleSelectedForm={HandleSelectedForm}
                />
            </Box>
        </Box>
    )
}

export default function ProcessForm() {
    // luu nhung bien cuc bi
    const [popUp, setPopup] = useState({
        isOpen: false,
        type: ''
    });

    const [formList, setFormList] = useState([])

    const [selectedForm, setSelectedForm] = useState(null) // tuong trung cho 1 cai selected

    function HandleSelectedForm(form) {
        console.log("Selected form:", form);
        setSelectedForm(form)
    }

    const handleOpenPopup = (type) => {
        console.log("Opening popup with type:", type);
        setPopup({...popUp, isOpen: true, type: type});
    }

    const handleClosePopup = () => {
        console.log("Closing popup");
        setPopup({...popUp, isOpen: false, type: ''});
        GetFormByAdmission()
    }

    async function GetFormByAdmission() {
        console.log("Fetching forms...");
        try {
            const response = await getFormTracking()
            console.log("API Response:", response);
            if (response && response.success) {
                console.log("Setting form list:", response.data);
                setFormList(response.data)
            } else {
                console.error("API call failed:", response);
            }
        } catch (error) {
            console.error("Error fetching forms:", error);
        }
    }

    //useEffcet sẽ chạy lần đầu tiên, or sẽ chạy khi có thay đổi
    useEffect(() => {
        console.log("Component mounted, fetching forms...");
        GetFormByAdmission()
    }, [])

    return (
        <>
            <RenderPage openDetailPopUpFunc={() => handleOpenPopup('detail')}
                        forms={formList}
                        HandleSelectedForm={HandleSelectedForm} // là 1 hàm, truyền hàm vào, để cập nhật for đã chọn
            />

            {
                popUp.isOpen && popUp.type === 'detail' &&
                <RenderDetailPopUp
                    isPopUpOpen={popUp.isOpen}
                    handleClosePopUp={handleClosePopup}
                    selectedForm={selectedForm}
                />
            }
        </>
    )
}