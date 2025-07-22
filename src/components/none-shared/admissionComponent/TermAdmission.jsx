import {
    Alert,
    AppBar,
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    FormControl,
    Grid,
    IconButton,
    InputLabel,
    MenuItem,
    Paper,
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
    Tooltip,
    Typography
} from "@mui/material";
import {
    Add,
    CalendarTodayOutlined,
    CheckCircleOutlined,
    Close,
    EditOutlined,
    EventNoteOutlined,
    EventOutlined,
    EventRepeatOutlined,
    FilterList,
    GroupsOutlined,
    LockOutlined,
    PauseCircleOutlined,
    PersonOutlined,
    SchoolOutlined,
    Visibility
} from '@mui/icons-material';
import {useEffect, useMemo, useState} from "react";
import {
    createExtraTerm,
    createTerm,
    getDefaultGrade,
    getTermList,
    getTermYears,
    updateTermStatus
} from "@services/admissionService.js";
import {enqueueSnackbar, useSnackbar} from "notistack";
import {formatVND} from "@/components/none-shared/formatVND.jsx";
import {DateTimePicker} from "@mui/x-date-pickers/DateTimePicker";
import {AdapterDayjs} from "@mui/x-date-pickers/AdapterDayjs";
import {viVN} from '@mui/x-date-pickers/locales';
import dayjs from "dayjs";
import {LocalizationProvider} from "@mui/x-date-pickers/LocalizationProvider";
import {ValidateTermFormData} from "@/components/none-shared/validation/ValidateTermFormData.jsx";
import {ValidateExtraTermFormData} from "@/components/none-shared/validation/ValidateExtraTermFormData.jsx";

function RenderTable({openDetailPopUpFunc, terms, HandleSelectedTerm}) {
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    }

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(event.target.value)
        setPage(0)
    }

    const handleDetailClick = (term, type) => {
        HandleSelectedTerm(term)
        openDetailPopUpFunc(type);
    }

    const getExtraTermStatus = (extraTerms) => {
        if (!extraTerms || extraTerms.length === 0) return null;

        // Tìm extra term đang active hoặc inactive
        const activeExtraTerm = extraTerms.find(term =>
            term.status.toLowerCase() === 'active' ||
            term.status.toLowerCase() === 'inactive'
        );

        return activeExtraTerm ? activeExtraTerm.status : 'All Locked';
    };

    const columns = [
        {label: 'No', minWidth: 80, align: 'center', key: 'no'},
        {label: 'Academic Year', minWidth: 120, align: 'center', key: 'year'},
        {label: 'Start Date', minWidth: 200, align: 'center', key: 'startDate'},
        {label: 'End Date', minWidth: 200, align: 'center', key: 'endDate'},
        {label: 'Status', minWidth: 200, align: 'center', key: 'status'},
        {label: 'Action', minWidth: 80, align: 'center', key: 'action'},
    ];

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
            <TableContainer sx={{
                flex: 1,
                maxHeight: 'calc(100vh - 300px)',
                overflow: 'auto',
                '&::-webkit-scrollbar': {
                    width: '8px',
                    height: '8px',
                },
                '&::-webkit-scrollbar-track': {
                    background: '#f1f1f1',
                    borderRadius: '4px',
                },
                '&::-webkit-scrollbar-thumb': {
                    background: '#888',
                    borderRadius: '4px',
                    '&:hover': {
                        background: '#555',
                    },
                },
            }}>
                <Table stickyHeader>
                    <TableHead>
                        <TableRow>
                            {columns.map(col => (
                                <TableCell
                                    key={col.key}
                                    align={col.align}
                                    sx={{
                                        minWidth: col.minWidth,
                                        fontWeight: 'bold',
                                        backgroundColor: '#f8faf8',
                                        color: '#07663a',
                                        borderBottom: '2px solid #e0e0e0',
                                        fontSize: '0.95rem',
                                        padding: '16px',
                                        textTransform: 'uppercase',
                                        letterSpacing: '0.5px'
                                    }}
                                >
                                    {col.label}
                                </TableCell>
                            ))}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {terms.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                            .map((term, idx) => (
                                <TableRow
                                    key={term.id}
                                    sx={{
                                        '&:nth-of-type(odd)': {
                                            backgroundColor: '#fafafa',
                                        },
                                        '&:hover': {
                                            backgroundColor: '#f5f5f5',
                                            transition: 'background-color 0.2s ease',
                                        },
                                        cursor: 'pointer'
                                    }}
                                >
                                    <TableCell align="center">{idx + 1}</TableCell>
                                    <TableCell align="center">{term.year}</TableCell>
                                    <TableCell align="center">{dayjs(term.startDate).format('HH:mm DD/MM/YYYY')}</TableCell>
                                    <TableCell align="center">{dayjs(term.endDate).format('HH:mm DD/MM/YYYY')}</TableCell>
                                    <TableCell align="center">
                                        <Typography
                                            component="span"
                                            sx={{
                                                color:
                                                    term.status === "active" ? "#07663a"
                                                        : term.status === "inactive" ? "#b27a00"
                                                            : term.status === "locked" ? "#d32f2f"
                                                                : "#333",
                                                fontWeight: 600,
                                                padding: '6px 16px',
                                                backgroundColor:
                                                    term.status === "active" ? "rgba(7, 102, 58, 0.08)"
                                                        : term.status === "inactive" ? "rgba(255, 193, 7, 0.12)"
                                                            : term.status === "locked" ? "rgba(211, 47, 47, 0.10)"
                                                                : "transparent",
                                                borderRadius: '20px',
                                                fontSize: '0.89rem',
                                                letterSpacing: 1,
                                                textTransform: "capitalize",
                                                minWidth: 90,
                                                display: "inline-block",
                                                textAlign: "center"
                                            }}
                                        >
                                            {term.status}
                                        </Typography>
                                    </TableCell>
                                    <TableCell align="center">
                                        <Tooltip title="View">
                                            <IconButton
                                                color="primary"
                                                onClick={() => handleDetailClick(term, 'view')}
                                                sx={{mr: 1}}
                                            >
                                                <Visibility/>
                                            </IconButton>
                                        </Tooltip>
                                    </TableCell>
                                </TableRow>
                            ))}
                    </TableBody>
                </Table>
            </TableContainer>
            <TablePagination
                component="div"
                rowsPerPageOptions={[5, 10, 15]}
                count={terms?.length}
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

function RenderDetailPopUp({handleClosePopUp, isPopUpOpen, selectedTerm, GetTerm}) {
    const {enqueueSnackbar} = useSnackbar();
    const [showExtraTermForm, setShowExtraTermForm] = useState(false);
    const [showExtraTermDetail, setShowExtraTermDetail] = useState(false);
    const [selectedExtraTerm, setSelectedExtraTerm] = useState(null);
    const [formData, setFormData] = useState({
        parentTermId: selectedTerm.id,
        startDate: null,
        endDate: null,
        maxNumberRegistration: 0,
        expectedClasses: 0
    });

    const isLocked = selectedTerm.status === 'locked';

    // Check if there's an active/inactive extra term
    const hasActiveExtraTerm = useMemo(() => {
        if (!selectedTerm.extraTerms || selectedTerm.extraTerms.length === 0) return false;
        return selectedTerm.extraTerms.some(term =>
            term.status.toLowerCase() === 'active' ||
            term.status.toLowerCase() === 'inactive'
        );
    }, [selectedTerm.extraTerms]);

    // Calculate missing registrations and classes per grade
    const missingInfoByGrade = useMemo(() => {
        if (!selectedTerm.termItemList) return {};

        return selectedTerm.termItemList.reduce((acc, item) => {
            const missingCount = item.maxNumberRegistration - (item.approvedForm || 0);
            if (missingCount > 0) {
                acc[item.grade] = {
                    missingStudents: missingCount,
                    expectedClasses: Math.ceil(missingCount / 40),
                    maxRegistration: item.maxNumberRegistration,
                    approvedForms: item.approvedForm || 0
                };
            }
            return acc;
        }, {});
    }, [selectedTerm.termItemList]);

    // Update formData when missingInfo changes
    useEffect(() => {
        // Get the first grade that has missing students
        const firstGradeWithMissing = Object.keys(missingInfoByGrade)[0];
        if (firstGradeWithMissing) {
            const gradeInfo = missingInfoByGrade[firstGradeWithMissing];
            setFormData((prev) => ({
                ...prev,
                maxNumberRegistration: gradeInfo.missingStudents || 0,
                expectedClasses: gradeInfo.expectedClasses || 0
            }));
        }
    }, [missingInfoByGrade]);

    const handleCreateExtraTerm = async (e) => {
        e.preventDefault();

        const validationError = ValidateExtraTermFormData(formData, selectedTerm);

        if (validationError) {
            enqueueSnackbar(validationError, {variant: 'error'});
            return;
        }

        const firstGradeWithMissing = Object.keys(missingInfoByGrade)[0];
        const gradeInfo = firstGradeWithMissing ? missingInfoByGrade[firstGradeWithMissing] : null;

        try {
            const response = await createExtraTerm({
                parentTermId: selectedTerm.id,
                startDate: dayjs(extraStartDate),
                endDate: dayjs(extraEndDate),
                maxNumberRegistration: gradeInfo?.missingStudents || 0,
                expectedClasses: gradeInfo?.expectedClasses || 0
            });

            if (response.success) {
                enqueueSnackbar(response.message || 'Extra term created successfully', {variant: 'success'});
                await GetTerm();
                setShowExtraTermForm(false);
            } else {
                enqueueSnackbar(response.message || 'Failed to create extra term', {variant: 'error'});
            }
        } catch (error) {
            enqueueSnackbar(
                error.response?.data?.message || 'Error creating extra term',
                {variant: 'error'}
            );
        }
    };

    const handleViewExtraTermDetail = (extraTerm) => {
        setSelectedExtraTerm(extraTerm);
        setShowExtraTermDetail(true);
    };

    const handleCloseExtraTermDetail = () => {
        setShowExtraTermDetail(false);
        setSelectedExtraTerm(null);
    };

    const handleLockTerm = async () => {
        try {
            const response = await updateTermStatus(selectedTerm.id);
            if (response.success) {
                enqueueSnackbar(response.message || 'Term locked successfully', {variant: 'success'});
                await GetTerm();
            } else {
                enqueueSnackbar(response.message || 'Failed to lock term', {variant: 'error'});
            }
        } catch (error) {
            enqueueSnackbar(error.response?.data?.message || 'Error locking term', {variant: 'error'});
        }
    };


    return (
        <>
            <Dialog
                fullScreen
                open={isPopUpOpen}
                onClose={handleClosePopUp}
                PaperProps={{
                    sx: {
                        backgroundColor: '#f8faf8',
                        display: 'flex',
                        flexDirection: 'column'
                    }
                }}
            >
                <AppBar sx={{
                    position: 'relative',
                    backgroundColor: '#07663a',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                }}>
                    <Toolbar variant="dense">
                        <IconButton
                            edge="start"
                            color="inherit"
                            onClick={handleClosePopUp}
                            aria-label="close"
                            size="small"
                            sx={{
                                '&:hover': {
                                    backgroundColor: 'rgba(255,255,255,0.1)'
                                }
                            }}
                        >
                            <Close fontSize="small"/>
                        </IconButton>
                        <Box sx={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            width: '100%'
                        }}>
                            <Stack spacing={0.5}>
                                <Typography variant="subtitle1" sx={{fontWeight: 600}}>
                                    {selectedTerm.name}
                                </Typography>
                            </Stack>
                        </Box>

                        <Typography
                            sx={{
                                display: 'inline-block',
                                px: 3,
                                py: 1,
                                minWidth: 110,
                                textAlign: 'center',
                                fontWeight: 700,
                                borderRadius: 10,
                                fontSize: '1rem',
                                letterSpacing: 1,
                                textTransform: 'uppercase',
                                backgroundColor:
                                    selectedTerm.status === 'locked'
                                        ? '#d32f2f'
                                        : selectedTerm.status === 'active'
                                            ? '#2e7d32'
                                            : selectedTerm.status === 'inactive'
                                                ? '#fbc02d'
                                                : '#eeeeee',
                                color:
                                    selectedTerm.status === 'locked'
                                        ? 'white'
                                        : selectedTerm.status === 'active'
                                            ? 'white'
                                            : selectedTerm.status === 'inactive'
                                                ? 'white'
                                                : '#616161',
                                boxShadow: 2,
                                transition: 'all 0.2s',
                            }}
                        >
                            {selectedTerm.status.toUpperCase()}
                        </Typography>
                    </Toolbar>
                </AppBar>

                {/* Main Content */}
                <Box sx={{
                    p: 3,
                    maxWidth: 900,
                    mx: 'auto',
                    width: '100%',
                    flex: 1,
                    overflow: 'auto'
                }}>
                    <Stack spacing={3}>
                        {/* Term Duration */}
                        <Paper
                            elevation={0}
                            sx={{
                                p: 2,
                                border: '1px solid #e0e0e0',
                                borderRadius: 2,
                                backgroundColor: '#ffffff'
                            }}
                        >
                            <Box sx={{
                                display: 'flex',
                                alignItems: 'center',
                                mb: 2,
                                pb: 1,
                                borderBottom: '1px solid #e8f5e9'
                            }}>
                                <EventNoteOutlined sx={{color: '#07663a', mr: 1}}/>
                                <Typography variant="subtitle1" sx={{fontWeight: 600, color: '#07663a'}}>
                                    Term Duration
                                </Typography>
                            </Box>
                            <Grid container spacing={2} sx={{display: 'flex', flexDirection: 'column'}}>
                                <Grid item xs={12}>
                                    <Box sx={{
                                        p: 1.5,
                                        border: '1px solid #e0e0e0',
                                        borderRadius: 1,
                                        backgroundColor: '#f8faf8',
                                        mb: 1
                                    }}>
                                        <Typography variant="body1" sx={{color: '#07663a', display: 'block', mb: 0.5}}>
                                            Academic Year
                                        </Typography>
                                        <Typography variant="body2" sx={{color: '#333'}}>
                                            {selectedTerm.year}
                                        </Typography>
                                    </Box>
                                </Grid>
                                <Grid item xs={6}>
                                    <Box sx={{
                                        p: 1.5,
                                        border: '1px solid #e0e0e0',
                                        borderRadius: 1,
                                        backgroundColor: '#f8faf8'
                                    }}>
                                        <Typography variant="body1" sx={{color: '#07663a', display: 'block', mb: 0.5}}>
                                            Start Date
                                        </Typography>
                                        <Typography variant="body2" sx={{color: '#333'}}>
                                            {dayjs(selectedTerm.startDate).format(' HH:mm DD/MM/YYYY')}
                                        </Typography>
                                    </Box>
                                </Grid>
                                <Grid item xs={6}>
                                    <Box sx={{
                                        p: 1.5,
                                        border: '1px solid #e0e0e0',
                                        borderRadius: 1,
                                        backgroundColor: '#f8faf8'
                                    }}>
                                        <Typography variant="body1" sx={{color: '#07663a', display: 'block', mb: 0.5}}>
                                            End Date
                                        </Typography>
                                        <Typography variant="body2" sx={{color: '#333'}}>
                                            {dayjs(selectedTerm.endDate).format(' HH:mm DD/MM/YYYY')}
                                        </Typography>
                                    </Box>
                                </Grid>
                            </Grid>
                        </Paper>

                        {/* Term Items */}
                        <Paper
                            elevation={0}
                            sx={{
                                p: 2,
                                border: '1px solid #e0e0e0',
                                borderRadius: 2,
                                backgroundColor: '#ffffff'
                            }}
                        >
                            <Box sx={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                mb: 2,
                                pb: 1,
                                borderBottom: '1px solid #e8f5e9'
                            }}>
                                <Box sx={{display: 'flex', alignItems: 'center'}}>
                                    <SchoolOutlined sx={{color: '#07663a', mr: 1, fontSize: 20}}/>
                                    <Typography variant="subtitle1" sx={{fontWeight: 600, color: '#07663a'}}>
                                        Term Items
                                    </Typography>
                                </Box>
                                {Object.keys(missingInfoByGrade).length > 0 && !showExtraTermForm && (
                                    <Button
                                        variant="outlined"
                                        onClick={() => setShowExtraTermForm(true)}
                                        startIcon={<Add sx={{fontSize: 18}}/>}
                                        size="small"
                                        sx={{
                                            borderColor: '#07663a',
                                            color: '#07663a',
                                            '&:hover': {
                                                borderColor: '#07663a',
                                                backgroundColor: 'rgba(7, 102, 58, 0.04)'
                                            }
                                        }}
                                    >
                                        Add Extra Term
                                    </Button>
                                )}
                            </Box>

                            <Stack spacing={2}>
                                {selectedTerm.termItemList.map((item) => (
                                    <Box
                                        key={item.id}
                                        sx={{
                                            p: 3,
                                            border: '1px solid #e0e0e0',
                                            borderRadius: 2,
                                            backgroundColor: '#ffffff',
                                            '&:hover': {
                                                boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
                                            }
                                        }}
                                    >
                                        {/* Grade Badge */}
                                        <Box sx={{mb: 3}}>
                                            <Typography
                                                component="span"
                                                sx={{
                                                    display: 'inline-block',
                                                    px: 2,
                                                    py: 0.5,
                                                    bgcolor: '#e8f5e9',
                                                    color: '#07663a',
                                                    borderRadius: 2,
                                                    fontSize: '1rem',
                                                    fontWeight: 600
                                                }}
                                            >
                                                Grade {formatGradeDisplay(item.grade)}
                                            </Typography>
                                        </Box>

                                        {/* Content Grid */}
                                        <Grid container spacing={2}>
                                            {/* Class Information Section */}
                                            <Grid item xs={12} md={6}>
                                                <Box sx={{
                                                    p: 2,
                                                    border: '1px solid #e0e0e0',
                                                    borderRadius: 2,
                                                    height: '100%',
                                                    backgroundColor: '#fff',
                                                    display: 'flex',
                                                    flexDirection: 'column'
                                                }}>
                                                    <Typography
                                                        variant="h6"
                                                        sx={{
                                                            color: '#1976d2',
                                                            mb: 2,
                                                            pb: 1,
                                                            borderBottom: '1px solid #e0e0e0',
                                                            fontSize: '1.1rem',
                                                            fontWeight: 600
                                                        }}
                                                    >
                                                        Class Information
                                                    </Typography>
                                                    <Stack
                                                        spacing={2.5}
                                                        sx={{
                                                            flex: 1,
                                                            justifyContent: 'space-evenly'
                                                        }}
                                                    >
                                                        <Box sx={{
                                                            display: 'flex',
                                                            justifyContent: 'space-between',
                                                            alignItems: 'center'
                                                        }}>
                                                            <Typography
                                                                variant="body1"
                                                                sx={{
                                                                    color: 'text.secondary',
                                                                    fontSize: '0.95rem'
                                                                }}
                                                            >
                                                                Expected Classes:
                                                            </Typography>
                                                            <Typography
                                                                variant="body1"
                                                                sx={{
                                                                    color: '#07663a',
                                                                    fontWeight: 600,
                                                                    fontSize: '0.95rem',
                                                                    ml: 2
                                                                }}
                                                            >
                                                                {item.expectedClasses}
                                                            </Typography>
                                                        </Box>
                                                        <Box sx={{
                                                            display: 'flex',
                                                            justifyContent: 'space-between',
                                                            alignItems: 'center'
                                                        }}>
                                                            <Typography
                                                                variant="body1"
                                                                sx={{
                                                                    color: 'text.secondary',
                                                                    fontSize: '0.95rem'
                                                                }}
                                                            >
                                                                Students Per Class:
                                                            </Typography>
                                                            <Typography
                                                                variant="body1"
                                                                sx={{
                                                                    color: '#07663a',
                                                                    fontWeight: 600,
                                                                    fontSize: '0.95rem',
                                                                    ml: 2
                                                                }}
                                                            >
                                                                {item.studentsPerClass}
                                                            </Typography>
                                                        </Box>
                                                        <Box sx={{
                                                            display: 'flex',
                                                            justifyContent: 'space-between',
                                                            alignItems: 'center'
                                                        }}>
                                                            <Typography
                                                                variant="body1"
                                                                sx={{
                                                                    color: 'text.secondary',
                                                                    fontSize: '0.95rem'
                                                                }}
                                                            >
                                                                Max Registration:
                                                            </Typography>
                                                            <Typography
                                                                variant="body1"
                                                                sx={{
                                                                    color: '#07663a',
                                                                    fontWeight: 600,
                                                                    fontSize: '0.95rem',
                                                                    ml: 2
                                                                }}
                                                            >
                                                                {item.maxNumberRegistration}
                                                            </Typography>
                                                        </Box>
                                                    </Stack>
                                                </Box>
                                            </Grid>

                                            {/* Fee Structure Section */}
                                            <Grid item xs={12} md={6}>
                                                <Box sx={{
                                                    p: 2,
                                                    border: '1px solid #e0e0e0',
                                                    borderRadius: 2,
                                                    height: '100%',
                                                    backgroundColor: '#fff',
                                                    display: 'flex',
                                                    flexDirection: 'column'
                                                }}>
                                                    <Typography
                                                        variant="h6"
                                                        sx={{
                                                            color: '#1976d2',
                                                            mb: 2,
                                                            pb: 1,
                                                            borderBottom: '1px solid #e0e0e0',
                                                            fontSize: '1.1rem',
                                                            fontWeight: 600
                                                        }}
                                                    >
                                                        Fee Structure
                                                    </Typography>
                                                    <Stack
                                                        spacing={2.5}
                                                        sx={{
                                                            flex: 1,
                                                            justifyContent: 'space-evenly'
                                                        }}
                                                    >
                                                        <Box sx={{
                                                            display: 'flex',
                                                            justifyContent: 'space-between',
                                                            alignItems: 'center'
                                                        }}>
                                                            <Typography
                                                                variant="body1"
                                                                sx={{
                                                                    color: 'text.secondary',
                                                                    fontSize: '0.95rem'
                                                                }}
                                                            >
                                                                Facility Fee:
                                                            </Typography>
                                                            <Typography
                                                                variant="body1"
                                                                sx={{
                                                                    color: '#07663a',
                                                                    fontWeight: 600,
                                                                    fontSize: '0.95rem',
                                                                    ml: 2
                                                                }}
                                                            >
                                                                {formatVND(item.feeList.facilityFee)}
                                                            </Typography>
                                                        </Box>
                                                        <Box sx={{
                                                            display: 'flex',
                                                            justifyContent: 'space-between',
                                                            alignItems: 'center'
                                                        }}>
                                                            <Typography
                                                                variant="body1"
                                                                sx={{
                                                                    color: 'text.secondary',
                                                                    fontSize: '0.95rem'
                                                                }}
                                                            >
                                                                Uniform Fee:
                                                            </Typography>
                                                            <Typography
                                                                variant="body1"
                                                                sx={{
                                                                    color: '#07663a',
                                                                    fontWeight: 600,
                                                                    fontSize: '0.95rem',
                                                                    ml: 2
                                                                }}
                                                            >
                                                                {formatVND(item.feeList.uniformFee)}
                                                            </Typography>
                                                        </Box>
                                                        <Box sx={{
                                                            display: 'flex',
                                                            justifyContent: 'space-between',
                                                            alignItems: 'center'
                                                        }}>
                                                            <Typography
                                                                variant="body1"
                                                                sx={{
                                                                    color: 'text.secondary',
                                                                    fontSize: '0.95rem'
                                                                }}
                                                            >
                                                                Service Fee:
                                                            </Typography>
                                                            <Typography
                                                                variant="body1"
                                                                sx={{
                                                                    color: '#07663a',
                                                                    fontWeight: 600,
                                                                    fontSize: '0.95rem',
                                                                    ml: 2
                                                                }}
                                                            >
                                                                {formatVND(item.feeList.serviceFee)}
                                                            </Typography>
                                                        </Box>
                                                        <Box sx={{
                                                            display: 'flex',
                                                            justifyContent: 'space-between',
                                                            alignItems: 'center'
                                                        }}>
                                                            <Typography
                                                                variant="body1"
                                                                sx={{
                                                                    color: 'text.secondary',
                                                                    fontSize: '0.95rem'
                                                                }}
                                                            >
                                                                Learning Material Fee:
                                                            </Typography>
                                                            <Typography
                                                                variant="body1"
                                                                sx={{
                                                                    color: '#07663a',
                                                                    fontWeight: 600,
                                                                    fontSize: '0.95rem',
                                                                    ml: 2
                                                                }}
                                                            >
                                                                {formatVND(item.feeList.learningMaterialFee)}
                                                            </Typography>
                                                        </Box>
                                                        <Box sx={{
                                                            display: 'flex',
                                                            justifyContent: 'space-between',
                                                            alignItems: 'center'
                                                        }}>
                                                            <Typography
                                                                variant="body1"
                                                                sx={{
                                                                    color: 'text.secondary',
                                                                    fontSize: '0.95rem'
                                                                }}
                                                            >
                                                                Reservation Fee:
                                                            </Typography>
                                                            <Typography
                                                                variant="body1"
                                                                sx={{
                                                                    color: '#07663a',
                                                                    fontWeight: 600,
                                                                    fontSize: '0.95rem',
                                                                    ml: 2
                                                                }}
                                                            >
                                                                {formatVND(item.feeList.reservationFee)}
                                                            </Typography>
                                                        </Box>
                                                    </Stack>
                                                </Box>
                                            </Grid>
                                        </Grid>
                                    </Box>
                                ))}
                            </Stack>
                        </Paper>

                        {/* Extra Terms Section */}
                        {selectedTerm.extraTerms && selectedTerm.extraTerms.length > 0 && (
                            <Paper
                                elevation={0}
                                sx={{
                                    p: 2,
                                    border: '1px solid #e0e0e0',
                                    borderRadius: 2,
                                    backgroundColor: '#ffffff'
                                }}
                            >
                                <Box sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    mb: 2,
                                    pb: 1,
                                    borderBottom: '1px solid #e8f5e9'
                                }}>
                                    <EventRepeatOutlined sx={{color: '#07663a', mr: 1, fontSize: 20}}/>
                                    <Typography variant="subtitle1" sx={{fontWeight: 600, color: '#07663a'}}>
                                        Extra Terms
                                    </Typography>
                                </Box>
                                <Stack spacing={2}>
                                    {selectedTerm.extraTerms.map((extraTerm) => {
                                        const statusColors = {
                                            'active': {
                                                light: '#e8f5e9',
                                                main: '#2e7d32',
                                                icon: <CheckCircleOutlined sx={{fontSize: 16}}/>
                                            },
                                            'inactive': {
                                                light: '#fff3e0',
                                                main: '#ed6c02',
                                                icon: <PauseCircleOutlined sx={{fontSize: 16}}/>
                                            },
                                            'locked': {
                                                light: '#ffebee',
                                                main: '#d32f2f',
                                                icon: <LockOutlined sx={{fontSize: 16}}/>
                                            }
                                        };
                                        const statusStyle = statusColors[extraTerm.status.toLowerCase()];

                                        return (
                                            <Box
                                                key={extraTerm.id}
                                                sx={{
                                                    p: 2,
                                                    border: '1px solid #e0e0e0',
                                                    borderRadius: 1,
                                                    backgroundColor: statusStyle.light
                                                }}
                                            >
                                                <Box sx={{
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'space-between',
                                                    mb: 1
                                                }}>
                                                    <Typography variant="subtitle2"
                                                                sx={{color: statusStyle.main, fontWeight: 600}}>
                                                        {extraTerm.name}
                                                    </Typography>
                                                    <Box sx={{display: 'flex', alignItems: 'center', gap: 1}}>
                                                        <Tooltip title="View Details">
                                                            <IconButton
                                                                size="small"
                                                                onClick={() => handleViewExtraTermDetail(extraTerm)}
                                                                sx={{
                                                                    color: statusStyle.main,
                                                                    '&:hover': {
                                                                        backgroundColor: `${statusStyle.light}80`
                                                                    }
                                                                }}
                                                            >
                                                                <Visibility fontSize="small"/>
                                                            </IconButton>
                                                        </Tooltip>
                                                        <Box sx={{
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            color: statusStyle.main,
                                                            bgcolor: 'rgba(255,255,255,0.8)',
                                                            px: 1,
                                                            py: 0.5,
                                                            borderRadius: 1,
                                                            border: `1px solid ${statusStyle.main}`
                                                        }}>
                                                            {statusStyle.icon}
                                                            <Typography variant="caption"
                                                                        sx={{ml: 0.5, fontWeight: 600}}>
                                                                {extraTerm.status.toUpperCase()}
                                                            </Typography>
                                                        </Box>
                                                    </Box>
                                                </Box>
                                                <Box sx={{
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    color: '#555'
                                                }}>
                                                    <EventOutlined sx={{fontSize: 16, mr: 0.5}}/>
                                                    <Typography variant="caption">
                                                        {dayjs(extraTerm.startDate)} - {dayjs(extraTerm.endDate)}
                                                    </Typography>
                                                </Box>
                                            </Box>
                                        );
                                    })}
                                </Stack>
                            </Paper>
                        )}

                        {/* Extra Term Form Dialog */}
                        {showExtraTermForm && (
                            <Dialog
                                open={true}
                                onClose={() => setShowExtraTermForm(false)}
                                maxWidth="sm"
                                fullWidth
                            >
                                <DialogTitle>Create Extra Term</DialogTitle>
                                <form onSubmit={handleCreateExtraTerm}>
                                    <DialogContent>
                                        {hasActiveExtraTerm && (
                                            <Alert severity="warning" sx={{mb: 2}}>
                                                There is already an active or pending extra term. Creating a new one may
                                                affect the existing term.
                                            </Alert>
                                        )}
                                        <Box sx={{display: 'flex', flexDirection: 'column', gap: 2}}>
                                            <Typography variant="body2" color="textSecondary">
                                                Parent
                                                Term: {dayjs(selectedTerm.startDate).toISOString()} - {(dayjs(selectedTerm.endDate).toISOString())}
                                            </Typography>

                                            {/* Date Selection */}
                                            <DateTimePicker
                                                label="Start Date"
                                                value={formData.startDate ? dayjs(formData.startDate) : dayjs(new Date())}
                                                onChange={(newValue) => {
                                                    setFormData(prev => ({...prev, startDate: newValue}));
                                                }}
                                                renderInput={(params) => <TextField {...params} fullWidth required/>}
                                                minDate={dayjs(selectedTerm.startDate)}
                                                maxDate={dayjs(selectedTerm.endDate)}
                                            />
                                            <DateTimePicker
                                                label="End Date"
                                                value={formData.endDate ? dayjs(formData.endDate) : dayjs(new Date())}
                                                onChange={(newValue) => {
                                                    setFormData(prev => ({...prev, endDate: newValue}));
                                                }}
                                                renderInput={(params) => <TextField {...params} fullWidth required/>}
                                                minDate={dayjs(formData.startDate) || dayjs(selectedTerm.startDate)}
                                                maxDate={dayjs(selectedTerm.endDate)}
                                            />


                                            {/* Registration Info */}
                                            <Box sx={{
                                                mt: 2,
                                                p: 2,
                                                backgroundColor: 'background.paper',
                                                borderRadius: 1
                                            }}>
                                                <Typography variant="subtitle1" gutterBottom color="primary">
                                                    Missing Registrations Summary
                                                </Typography>

                                                {Object.entries(missingInfoByGrade).map(([grade, info]) => (
                                                    <Box key={grade} sx={{
                                                        mb: 2,
                                                        pl: 2,
                                                        borderLeft: '3px solid',
                                                        borderColor: 'primary.main'
                                                    }}>
                                                        <Typography variant="h6" gutterBottom>
                                                            Grade {formatGradeDisplay(grade)}
                                                        </Typography>
                                                        <Typography variant="body2" color="text.secondary" gutterBottom>
                                                            Maximum Registration: {info.maxRegistration}
                                                        </Typography>
                                                        <Typography variant="body2" color="text.secondary" gutterBottom>
                                                            Approved Forms: {info.approvedForms}
                                                        </Typography>
                                                        <Typography variant="body1" gutterBottom>
                                                            Missing Students: <strong>{info.missingStudents}</strong>
                                                        </Typography>
                                                        <Typography variant="body1" gutterBottom>
                                                            Expected Classes: <strong>{info.expectedClasses}</strong>
                                                        </Typography>
                                                    </Box>
                                                ))}

                                                <Typography variant="caption" color="text.secondary">
                                                    * These values are calculated automatically based on current
                                                    registrations
                                                </Typography>
                                            </Box>
                                        </Box>
                                    </DialogContent>
                                    <DialogActions>
                                        <Button onClick={() => setShowExtraTermForm(false)}>
                                            Cancel
                                        </Button>
                                        <Button
                                            type="submit"
                                            variant="contained"
                                            color="primary"
                                            disabled={Object.keys(missingInfoByGrade).length === 0}
                                        >
                                            Create Extra Term
                                        </Button>
                                    </DialogActions>
                                </form>
                            </Dialog>
                        )}
                    </Stack>
                </Box>

                {/* Fixed Footer */}
                <Box sx={{
                    position: 'sticky',
                    bottom: 0,
                    width: '100%',
                    backgroundColor: 'rgba(255, 255, 255, 0.9)',
                    backdropFilter: 'blur(8px)',
                    borderTop: '1px solid rgba(7, 102, 58, 0.12)',
                    boxShadow: '0px -2px 8px rgba(0, 0, 0, 0.05)'
                }}>
                    <Box sx={{
                        maxWidth: 900,
                        mx: 'auto',
                        p: 1.5,
                        display: 'flex',
                        justifyContent: 'flex-end',
                        gap: 1.5
                    }}>
                        <Button
                            variant="contained"
                            onClick={handleClosePopUp}
                            size="small"
                            color={"warning"}
                            sx={{
                                color: 'white',
                                px: 3,
                                fontSize: '0.875rem',
                                textTransform: 'none',
                            }}
                        >
                            Close
                        </Button>
                        {!isLocked &&
                            <Button
                                variant="contained"
                                onClick={handleLockTerm}
                                size="small"
                                color={"error"}
                                sx={{
                                    color: 'white',
                                    px: 3,
                                    fontSize: '0.875rem',
                                    textTransform: 'none',
                                    boxShadow: '0 2px 4px rgba(7, 102, 58, 0.25)',
                                }}
                            >
                                Locked
                            </Button>
                        }
                    </Box>
                </Box>
            </Dialog>

            {/* Extra Term Detail Dialog */}
            <Dialog
                open={showExtraTermDetail}
                onClose={handleCloseExtraTermDetail}
                maxWidth="sm"
                fullWidth
            >
                <DialogTitle sx={{
                    backgroundColor: '#f8faf8',
                    borderBottom: '1px solid #e0e0e0',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1
                }}>
                    <EventNoteOutlined/>
                    Extra Term Details
                </DialogTitle>
                <DialogContent sx={{mt: 2}}>
                    {selectedExtraTerm && (
                        <Stack spacing={2}>
                            <Box>
                                <Typography variant="subtitle2" color="textSecondary">
                                    Name
                                </Typography>
                                <Typography variant="body1">
                                    {selectedExtraTerm.name}
                                </Typography>
                            </Box>

                            <Box>
                                <Typography variant="subtitle2" color="textSecondary">
                                    Academic Year
                                </Typography>
                                <Typography variant="body1">
                                    {selectedExtraTerm.year}
                                </Typography>
                            </Box>

                            <Box>
                                <Typography variant="subtitle2" color="textSecondary">
                                    Start Date
                                </Typography>
                                <Typography variant="body1">
                                    {dayjs(selectedExtraTerm.startDate)}
                                </Typography>
                            </Box>

                            <Box>
                                <Typography variant="subtitle2" color="textSecondary">
                                    End Date
                                </Typography>
                                <Typography variant="body1">
                                    {dayjs(selectedExtraTerm.endDate)}
                                </Typography>
                            </Box>

                            <Box>
                                <Typography variant="subtitle2" color="textSecondary">
                                    Status
                                </Typography>
                                <Typography
                                    variant="body1"
                                    sx={{
                                        color: selectedExtraTerm.status.toLowerCase() === 'active' ? 'success.main' :
                                            selectedExtraTerm.status.toLowerCase() === 'inactive' ? 'warning.main' :
                                                'error.main'
                                    }}
                                >
                                    {selectedExtraTerm.status}
                                </Typography>
                            </Box>

                            {selectedExtraTerm.termItemList && selectedExtraTerm.termItemList.length > 0 && (
                                <Box>
                                    <Typography variant="subtitle2" color="textSecondary" gutterBottom>
                                        Term Items
                                    </Typography>
                                    {selectedExtraTerm.termItemList.map((item, index) => (
                                        <Box
                                            key={index}
                                            sx={{
                                                mt: 1,
                                                p: 1.5,
                                                border: '1px solid #e0e0e0',
                                                borderRadius: 1,
                                                backgroundColor: '#f8faf8'
                                            }}
                                        >
                                            <Typography variant="subtitle2" gutterBottom>
                                                Grade {formatGradeDisplay(item.grade)}
                                            </Typography>
                                            <Grid container spacing={1}>
                                                <Grid item xs={6}>
                                                    <Typography variant="body2" color="textSecondary">
                                                        Expected Classes: {item.expectedClasses}
                                                    </Typography>
                                                </Grid>
                                                <Grid item xs={6}>
                                                    <Typography variant="body2" color="textSecondary">
                                                        Max Registration: {item.maxNumberRegistration}
                                                    </Typography>
                                                </Grid>
                                            </Grid>
                                        </Box>
                                    ))}
                                </Box>
                            )}
                        </Stack>
                    )}
                </DialogContent>
                <DialogActions sx={{p: 2, borderTop: '1px solid #e0e0e0'}}>
                    <Button onClick={handleCloseExtraTermDetail} variant="outlined">
                        Close
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
}

function RenderFormPopUp({isPopUpOpen, handleClosePopUp, GetTerm, terms}) {
    const today = new Date()
    const tomorrow = new Date(today)
    tomorrow.setDate(today.getDate() + 1)

    const {enqueueSnackbar} = useSnackbar();
    const [formData, setFormData] = useState({
        startDate: null,
        endDate: null,
        termItemList: []
    });

    const [availableGrades] = useState(['SEED', 'BUD', 'LEAF']);
    const [selectedGrade, setSelectedGrade] = useState('');
    const [currentTermItem, setCurrentTermItem] = useState({
        grade: '',
        expectedClasses: '',
        studentsPerClass: 20,
        maxNumberRegistration: 0,
        facilityFee: 0,
        uniformFee: 0,
        learningMaterialFee: 0,
        reservationFee: 0,
        serviceFee: 0,
    });


    // Calculate remaining available grades
    const remainingGrades = availableGrades.filter(
        grade => !formData.termItemList.some(item => item.grade === grade)
    );

    useEffect(() => {
        if (currentTermItem.expectedClasses) {
            setCurrentTermItem(prev => ({
                ...prev,
                maxNumberRegistration: parseInt(prev.expectedClasses) * prev.studentsPerClass
            }));
        }
    }, [currentTermItem.expectedClasses]);

    const handleAddTermItem = async () => {
        if (!selectedGrade) {
            enqueueSnackbar("Please select a grade", {variant: "error"});
            return;
        }
        if (!currentTermItem.expectedClasses || currentTermItem.expectedClasses <= 0) {
            enqueueSnackbar("Expected classes must be greater than 0", {variant: "error"});
            return;
        }

        try {
            // Get default fees for the selected grade
            const response = await getDefaultGrade(selectedGrade);
        
            if (response?.success && response?.data) {
                const newTermItem = {
                    ...currentTermItem,
                    grade: selectedGrade, // Đảm bảo gửi đúng enum cho BE
                    studentsPerClass: 20,
                    maxNumberRegistration: parseInt(response.data.facilityFee),
                    facilityFee: parseInt(response.data.facilityFee),
                    uniformFee: parseInt(response.data.uniformFee),
                    learningMaterialFee: parseInt(response.data.learningMaterialFee),
                    reservationFee: parseInt(response.data.reservationFee),
                    serviceFee: parseInt(response.data.serviceFee),
                };

                setFormData(prev => ({
                    ...prev,
                    termItemList: [...prev.termItemList, newTermItem]
                }));

                // Reset current term item and selected grade
                setCurrentTermItem({
                    grade: '',
                    expectedClasses: '',
                    studentsPerClass: 20,
                    maxNumberRegistration: 0
                });
                setSelectedGrade('');
            }
        } catch (error) {
            enqueueSnackbar("Error loading fees", {variant: "error"});
        }
    };

    const handleRemoveTermItem = (gradeToRemove) => {
        setFormData(prev => ({
            ...prev,
            termItemList: prev.termItemList.filter(item => item.grade !== gradeToRemove)
        }));
    };

    const validateForm = () => {
        // Use the centralized validation function
        const validationError = ValidateTermFormData(formData, terms); 

        if (validationError) {
            enqueueSnackbar(validationError, {variant: "error"});
            return false;
        }

        return true;
    };

    const handleCreate = async () => {
        try {
            if (!validateForm()) {
                return;
            }

            // Format dates to ISO string (use dayjs toISOString to avoid timezone issues)
            const startDateISO = formData.startDate.toISOString();
            const endDateISO = formData.endDate.toISOString();

            // Prepare term items with only required fields for BE
            const termItems = formData.termItemList.map(item => ({
                grade: item.grade,
                expectedClasses: Number(item.expectedClasses)
            }));



            const response = await createTerm(
                startDateISO,
                endDateISO,
                termItems
            );

            if (response.success) {
                enqueueSnackbar("Term created successfully!", {variant: "success"});
                handleClosePopUp();
                GetTerm();
            } else {
                enqueueSnackbar(response.message || "Failed to create term", {variant: "error"});
            }
        } catch (error) {
            enqueueSnackbar(error.response?.data?.message || "Error creating term", {variant: "error"});
        }
    };

    return (
        <Dialog
            open={isPopUpOpen}
            fullScreen
            slotProps={{
                paper: {
                    sx: {
                        backgroundColor: '#f8f9fa',
                    }
                }
            }}
        >
            <AppBar position="relative" sx={{bgcolor: '#07663a'}}>
                <Toolbar>
                    <IconButton
                        edge="start"
                        color="inherit"
                        onClick={handleClosePopUp}
                        aria-label="close"
                    >
                        <Close/>
                    </IconButton>
                    <Typography variant="h6" sx={{flex: 1}}>
                        Create New Term
                    </Typography>
                </Toolbar>
            </AppBar>

            <DialogContent>
                <Box sx={{maxWidth: 800, mx: 'auto', mt: 4, p: 3}}>
                    <Paper
                        elevation={0}
                        sx={{
                            p: 3.5,
                            mb: 4,
                            border: '2px solid #e0e0e0',
                            borderRadius: 3,
                            backgroundColor: '#ffffff',
                            transition: 'all 0.3s ease',
                            '&:hover': {
                                boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                                borderColor: '#07663a'
                            }
                        }}
                    >
                        <Box sx={{
                            display: 'flex',
                            alignItems: 'center',
                            mb: 3,
                            pb: 2,
                            borderBottom: '2px solid #e8f5e9'
                        }}>
                            <EventNoteOutlined sx={{color: '#07663a', mr: 1.5, fontSize: 28}}/>
                            <Typography
                                variant="h6"
                                sx={{
                                    fontWeight: 600,
                                    color: '#07663a',
                                }}
                            >
                                Term Information
                            </Typography>
                        </Box>

                        <Stack spacing={3}>
                            <Box sx={{
                                backgroundColor: '#f8faf8',
                                p: 2.5,
                                borderRadius: 2,
                                border: '1px solid #e0e0e0'
                            }}>
                                <TextField
                                    label="Term Name"
                                    value={"Admission Term for " + calculateAcademicYear(formData.startDate)}
                                    fullWidth
                                    InputProps={{
                                        startAdornment: (
                                            <Box sx={{mr: 1, color: '#07663a'}}>
                                                <EditOutlined/>
                                            </Box>
                                        ),
                                        readOnly: true
                                    }}
                                    sx={{
                                        '& .MuiOutlinedInput-root': {
                                            backgroundColor: '#ffffff',
                                            '& fieldset': {
                                                borderColor: '#e0e0e0',
                                                borderWidth: '2px'
                                            },
                                            '&:hover fieldset': {
                                                borderColor: '#07663a'
                                            },
                                            '&.Mui-focused fieldset': {
                                                borderColor: '#07663a'
                                            }
                                        },
                                        '& .MuiInputLabel-root': {
                                            color: '#07663a',
                                            '&.Mui-focused': {
                                                color: '#07663a'
                                            }
                                        }
                                    }}
                                />
                            </Box>

                            <Box sx={{
                                backgroundColor: '#f8faf8',
                                p: 2.5,
                                borderRadius: 2,
                                border: '1px solid #e0e0e0'
                            }}>
                                <TextField
                                    label="Year"
                                    value={calculateAcademicYearRange(formData.startDate)}
                                    fullWidth
                                    InputProps={{
                                        startAdornment: (
                                            <Box sx={{mr: 1, color: '#07663a'}}>
                                                <CalendarTodayOutlined/>
                                            </Box>
                                        ),
                                        readOnly: true
                                    }}
                                    sx={{
                                        '& .MuiOutlinedInput-root': {
                                            backgroundColor: '#ffffff',
                                            '& fieldset': {
                                                borderColor: '#e0e0e0',
                                                borderWidth: '2px'
                                            },
                                            '&:hover fieldset': {
                                                borderColor: '#07663a'
                                            },
                                            '&.Mui-focused fieldset': {
                                                borderColor: '#07663a'
                                            }
                                        },
                                        '& .MuiInputLabel-root': {
                                            color: '#07663a',
                                            '&.Mui-focused': {
                                                color: '#07663a'
                                            }
                                        }
                                    }}
                                />
                            </Box>

                            <Box sx={{
                                backgroundColor: '#f8faf8',
                                p: 2.5,
                                borderRadius: 2,
                                border: '1px solid #e0e0e0'
                            }}>
                                <Typography
                                    variant="subtitle2"
                                    sx={{
                                        color: '#07663a',
                                        fontWeight: 600,
                                        mb: 2
                                    }}
                                >
                                    Term Duration
                                </Typography>
                                <Stack direction="row" spacing={2}>
                                    <DateTimePicker
                                        label="Start Date"
                                        format={'HH:mm DD/MM/YYYY'}
                                        value={formData.startDate ? dayjs(formData.startDate) : dayjs().add(1, 'day')}
                                        minDate={dayjs().add(1, 'day')}
                                        onChange={(newDate) => setFormData({...formData, startDate: newDate})}
                                    />
                                    {formData.startDate &&
                                        <DateTimePicker
                                            label="End Date"
                                            format={'HH:mm DD/MM/YYYY'}
                                            value={formData.endDate ? dayjs(formData.endDate) : dayjs(formData.startDate).add(2, 'day')}
                                            minDate={dayjs(formData.startDate).add(2, 'day')}
                                            maxDate={dayjs(dayjs(formData.startDate).year() + '-12-31')}
                                            onChange={(newDate) => setFormData({...formData, endDate: newDate})}
                                        />
                                    }
                                </Stack>
                            </Box>
                        </Stack>
                    </Paper>

                    {/* Add Term Item Section */}
                    <Paper
                        elevation={0}
                        sx={{
                            p: 3.5,
                            mb: 3,
                            border: '2px solid #e0e0e0',
                            borderRadius: 3,
                            backgroundColor: '#ffffff',
                            transition: 'all 0.3s ease',
                            '&:hover': {
                                boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                                borderColor: '#07663a'
                            }
                        }}
                    >
                        <Box sx={{
                            display: 'flex',
                            alignItems: 'center',
                            mb: 3,
                            pb: 2,
                            borderBottom: '2px solid #e8f5e9'
                        }}>
                            <Add sx={{color: '#07663a', mr: 1.5, fontSize: 28}}/>
                            <Typography
                                variant="h6"
                                sx={{
                                    fontWeight: 600,
                                    color: '#07663a',
                                }}
                            >
                                Add Grade Configuration
                            </Typography>
                        </Box>

                        <Stack spacing={3}>
                            <FormControl fullWidth>
                                <InputLabel sx={{
                                    color: '#07663a',
                                    '&.Mui-focused': {
                                        color: '#07663a'
                                    }
                                }}>Grade</InputLabel>
                                <Select
                                    value={selectedGrade}
                                    onChange={(e) => setSelectedGrade(e.target.value)}
                                    label="Grade"
                                    sx={{
                                        '& .MuiOutlinedInput-notchedOutline': {
                                            borderColor: '#e0e0e0',
                                            borderWidth: '2px'
                                        },
                                        '&:hover .MuiOutlinedInput-notchedOutline': {
                                            borderColor: '#07663a'
                                        },
                                        '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                            borderColor: '#07663a'
                                        }
                                    }}
                                >
                                    {remainingGrades.map(grade => (
                                        <MenuItem key={grade} value={grade}>{formatGradeDisplay(grade)}</MenuItem>
                                    ))}
                                </Select>
                            </FormControl>

                            <Box sx={{
                                backgroundColor: '#f8faf8',
                                p: 2.5,
                                borderRadius: 2,
                                border: '1px solid #e0e0e0'
                            }}>
                                <Typography
                                    variant="subtitle2"
                                    sx={{
                                        color: '#07663a',
                                        fontWeight: 600,
                                        mb: 2
                                    }}
                                >
                                    Class Capacity
                                </Typography>
                                <Stack spacing={2.5}>
                                    <TextField
                                        label="Expected Classes"
                                        type="number"
                                        value={currentTermItem.expectedClasses}
                                        onChange={(e) => setCurrentTermItem(prev => ({
                                            ...prev,
                                            expectedClasses: e.target.value
                                        }))}
                                        fullWidth
                                        InputProps={{
                                            startAdornment: (
                                                <Box sx={{mr: 1, color: '#07663a'}}>
                                                    <SchoolOutlined/>
                                                </Box>
                                            )
                                        }}
                                        sx={{
                                            '& .MuiOutlinedInput-root': {
                                                '& fieldset': {
                                                    borderColor: '#e0e0e0',
                                                    borderWidth: '2px'
                                                },
                                                '&:hover fieldset': {
                                                    borderColor: '#07663a'
                                                },
                                                '&.Mui-focused fieldset': {
                                                    borderColor: '#07663a'
                                                }
                                            },
                                            '& .MuiInputLabel-root': {
                                                color: '#07663a',
                                                '&.Mui-focused': {
                                                    color: '#07663a'
                                                }
                                            }
                                        }}
                                    />

                                    <Stack
                                        direction="row"
                                        spacing={2}
                                        sx={{
                                            backgroundColor: '#ffffff',
                                            p: 2,
                                            borderRadius: 2,
                                            border: '1px solid #e0e0e0'
                                        }}
                                    >
                                        <TextField
                                            label="Students Per Class"
                                            type="number"
                                            value={currentTermItem.studentsPerClass}
                                            InputProps={{
                                                readOnly: true,
                                                startAdornment: (
                                                    <Box sx={{mr: 1, color: '#07663a'}}>
                                                        <PersonOutlined/>
                                                    </Box>
                                                )
                                            }}
                                            fullWidth
                                            sx={{
                                                '& .MuiOutlinedInput-root': {
                                                    backgroundColor: '#f5f5f5'
                                                }
                                            }}
                                        />
                                        <TextField
                                            label="Max Registration"
                                            type="number"
                                            value={currentTermItem.maxNumberRegistration}
                                            InputProps={{
                                                readOnly: true,
                                                startAdornment: (
                                                    <Box sx={{mr: 1, color: '#07663a'}}>
                                                        <GroupsOutlined/>
                                                    </Box>
                                                )
                                            }}
                                            fullWidth
                                            sx={{
                                                '& .MuiOutlinedInput-root': {
                                                    backgroundColor: '#f5f5f5'
                                                }
                                            }}
                                        />
                                    </Stack>
                                </Stack>
                            </Box>

                            <Button
                                variant="contained"
                                onClick={handleAddTermItem}
                                disabled={!selectedGrade || !currentTermItem.expectedClasses}
                                startIcon={<Add/>}
                                sx={{
                                    alignSelf: 'flex-end',
                                    bgcolor: '#07663a',
                                    '&:hover': {
                                        bgcolor: '#05512e'
                                    },
                                    '&.Mui-disabled': {
                                        bgcolor: '#e0e0e0'
                                    },
                                    px: 3,
                                    py: 1,
                                    borderRadius: 2,
                                    fontWeight: 600
                                }}
                            >
                                Add Grade
                            </Button>
                        </Stack>
                    </Paper>

                    {/* Term Items List */}
                    {formData.termItemList.length > 0 && (
                        <Paper
                            elevation={0}
                            sx={{
                                p: 3,
                                border: '2px solid #e0e0e0',
                                borderRadius: 3,
                                backgroundColor: '#ffffff',
                                transition: 'all 0.3s ease',
                                '&:hover': {
                                    boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                                    borderColor: '#07663a'
                                }
                            }}
                        >
                            <Box sx={{
                                display: 'flex',
                                alignItems: 'center',
                                mb: 3
                            }}>
                                <Typography
                                    variant="h6"
                                    sx={{
                                        fontWeight: 600,
                                        color: '#07663a',
                                        position: 'relative',
                                        '&:after': {
                                            content: '""',
                                            position: 'absolute',
                                            bottom: -8,
                                            left: 0,
                                            width: '60px',
                                            height: '3px',
                                            backgroundColor: '#07663a',
                                            borderRadius: '2px'
                                        }
                                    }}
                                >
                                    Configured Grades
                                </Typography>
                            </Box>
                            <Stack spacing={2.5}>
                                {formData.termItemList.map((item) => (
                                    <Box
                                        key={item.grade}
                                        sx={{
                                            p: 3,
                                            border: '1px solid #e0e0e0',
                                            borderRadius: 2,
                                            position: 'relative',
                                            backgroundColor: '#f8faf8',
                                            transition: 'all 0.2s ease',
                                            '&:hover': {
                                                transform: 'translateY(-2px)',
                                                boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                                                borderColor: '#07663a',
                                                backgroundColor: '#ffffff'
                                            }
                                        }}
                                    >
                                        <IconButton
                                            size="small"
                                            onClick={() => handleRemoveTermItem(item.grade)}
                                            sx={{
                                                position: 'absolute',
                                                right: 8,
                                                top: 8,
                                                color: '#666',
                                                '&:hover': {
                                                    backgroundColor: '#ffebee',
                                                    color: '#d32f2f'
                                                }
                                            }}
                                        >
                                            <Close/>
                                        </IconButton>

                                        <Box sx={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            mb: 2
                                        }}>
                                            <Typography
                                                variant="h6"
                                                sx={{
                                                    fontWeight: 600,
                                                    color: '#07663a',
                                                    backgroundColor: '#e8f5e9',
                                                    px: 2,
                                                    py: 0.5,
                                                    borderRadius: 2
                                                }}
                                            >
                                                {formatGradeDisplay(item.grade)}
                                            </Typography>
                                        </Box>

                                        <Stack
                                            direction="row"
                                            spacing={3}
                                            sx={{
                                                width: '100%',
                                                alignItems: 'stretch'
                                            }}
                                        >
                                            <Box
                                                sx={{
                                                    width: '50%',
                                                    backgroundColor: '#ffffff',
                                                    p: 2.5,
                                                    borderRadius: 2,
                                                    border: '1px solid #e0e0e0'
                                                }}
                                            >
                                                <Typography variant="subtitle2" color="primary" gutterBottom sx={{
                                                    fontWeight: 600,
                                                    mb: 2,
                                                    pb: 1,
                                                    borderBottom: '2px solid #e8f5e9'
                                                }}>
                                                    Class Information
                                                </Typography>
                                                <Stack spacing={1.5}>
                                                    <Typography sx={{
                                                        display: 'flex',
                                                        justifyContent: 'space-between',
                                                        color: '#555',
                                                        '& span': {fontWeight: 600, color: '#07663a'}
                                                    }}>
                                                        Expected Classes: <span>{item.expectedClasses}</span>
                                                    </Typography>
                                                    <Typography sx={{
                                                        display: 'flex',
                                                        justifyContent: 'space-between',
                                                        color: '#555',
                                                        '& span': {fontWeight: 600, color: '#07663a'}
                                                    }}>
                                                        Students Per Class: <span>{item.studentsPerClass}</span>
                                                    </Typography>
                                                    <Typography sx={{
                                                        display: 'flex',
                                                        justifyContent: 'space-between',
                                                        color: '#555',
                                                        '& span': {fontWeight: 600, color: '#07663a'}
                                                    }}>
                                                        Max Registration: <span>{item.maxNumberRegistration}</span>
                                                    </Typography>
                                                </Stack>
                                            </Box>

                                            <Box
                                                sx={{
                                                    width: '50%',
                                                    backgroundColor: '#ffffff',
                                                    p: 2.5,
                                                    borderRadius: 2,
                                                    border: '1px solid #e0e0e0'
                                                }}
                                            >
                                                <Typography variant="subtitle2" color="primary" gutterBottom sx={{
                                                    fontWeight: 600,
                                                    mb: 2,
                                                    pb: 1,
                                                    borderBottom: '2px solid #e8f5e9'
                                                }}>
                                                    Fee Structure
                                                </Typography>
                                                <Grid container spacing={2}>
                                                    <Grid item xs={6}>
                                                        <Typography sx={{
                                                            display: 'flex',
                                                            justifyContent: 'space-between',
                                                            color: '#555',
                                                            mb: 1.5,
                                                            '& span': {fontWeight: 600, color: '#07663a'}
                                                        }}>
                                                            Facility Fee: <span>{formatVND(item.facilityFee)}</span>
                                                        </Typography>
                                                        <Typography sx={{
                                                            display: 'flex',
                                                            justifyContent: 'space-between',
                                                            color: '#555',
                                                            mb: 1.5,
                                                            '& span': {fontWeight: 600, color: '#07663a'}
                                                        }}>
                                                            Uniform Fee: <span>{formatVND(item.uniformFee)}</span>
                                                        </Typography>
                                                        <Typography sx={{
                                                            display: 'flex',
                                                            justifyContent: 'space-between',
                                                            color: '#555',
                                                            '& span': {fontWeight: 600, color: '#07663a'}
                                                        }}>
                                                            Service Fee: <span>{formatVND(item.serviceFee)}</span>
                                                        </Typography>
                                                    </Grid>
                                                    <Grid item xs={6}>
                                                        <Typography sx={{
                                                            display: 'flex',
                                                            justifyContent: 'space-between',
                                                            color: '#555',
                                                            mb: 1.5,
                                                            '& span': {fontWeight: 600, color: '#07663a'}
                                                        }}>
                                                            Learning Material
                                                            Fee: <span>{formatVND(item.learningMaterialFee)}</span>
                                                        </Typography>
                                                        <Typography sx={{
                                                            display: 'flex',
                                                            justifyContent: 'space-between',
                                                            color: '#555',
                                                            '& span': {fontWeight: 600, color: '#07663a'}
                                                        }}>
                                                            Reservation
                                                            Fee: <span>{formatVND(item.reservationFee)}</span>
                                                        </Typography>
                                                    </Grid>
                                                </Grid>
                                            </Box>
                                        </Stack>
                                    </Box>
                                ))}
                            </Stack>
                        </Paper>
                    )}
                </Box>
            </DialogContent>

            <DialogActions sx={{p: 3}}>
                <Button onClick={handleClosePopUp} color="inherit">
                    Cancel
                </Button>
                <Button
                    onClick={handleCreate}
                    variant="contained"
                    disabled={formData.termItemList.length === 0}
                    sx={{bgcolor: '#07663a', '&:hover': {bgcolor: '#05512e'}}}
                >
                    Create Term
                </Button>
            </DialogActions>
        </Dialog>
    );
}

function RenderPage({openFormPopUpFunc, openDetailPopUpFunc, terms, HandleSelectedTerm}) {
    const [years, setYears] = useState(['all']);
    const [selectedYear, setSelectedYear] = useState('all');

    useEffect(() => {
        const fetchYears = async () => {
            try {
                const response = await getTermYears();
                if (response.success) {
                    // Sort years in descending order
                    const sortedYears = [...response.data].sort((a, b) => b - a);
                    setYears(['all', ...sortedYears]);
                } else {
                    enqueueSnackbar('Failed to fetch years:', response.message);
                }
            } catch (error) {
                enqueueSnackbar('Error fetching years:', error);
            }
        };
        fetchYears();
    }, []);

    const formatYear = (year) => {
        if (year === 'all') return 'All Years';
        return `${year}-${parseInt(year) + 1}`;
    };

    const filteredTerms = selectedYear === 'all'
        ? terms.filter(term => !term.isExtraTerm)
        : terms.filter(term => {
            // Format the term year to match the filter format
            const termYear = term.year.split('-')[0];
            return termYear === selectedYear.toString() && !term.isExtraTerm;
        });

    return (
        <div className="container">
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
                    Term Admission
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
                    Manage the terms for student admission
                </Typography>
            </Box>

            <Box sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                mb: 3,
                mx: {xs: 0, md: 2}
            }}>
                <FormControl sx={{minWidth: 200}}>
                    <Select
                        value={selectedYear}
                        onChange={(e) => setSelectedYear(e.target.value)}
                        displayEmpty
                        sx={{
                            height: '44px',
                            backgroundColor: '#fff',
                            borderRadius: '10px',
                            '& .MuiOutlinedInput-notchedOutline': {
                                borderColor: '#07663a',
                                borderWidth: '2px'
                            },
                            '&:hover .MuiOutlinedInput-notchedOutline': {
                                borderColor: '#07663a',
                            },
                            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                borderColor: '#07663a',
                            },
                            '& .MuiSelect-select': {
                                display: 'flex',
                                alignItems: 'center',
                                gap: 1
                            }
                        }}
                        renderValue={(selected) => (
                            <Box sx={{display: 'flex', alignItems: 'center', gap: 1}}>
                                <FilterList sx={{color: '#07663a', fontSize: 20}}/>
                                <Typography sx={{color: '#07663a', fontWeight: 500}}>
                                    {selected === 'all' ? 'Filter by Year' : `Year: ${formatYear(selected)}`}
                                </Typography>
                            </Box>
                        )}
                    >
                        {years.map((year) => (
                            <MenuItem key={year} value={year}>
                                {formatYear(year)}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>

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
                        boxShadow: 2,
                        '&:hover': {
                            backgroundColor: '#05512e'
                        }
                    }}
                >
                    Create new term
                </Button>
            </Box>

            <RenderTable
                terms={filteredTerms}
                openDetailPopUpFunc={openDetailPopUpFunc}
                HandleSelectedTerm={HandleSelectedTerm}
            />
        </div>
    )
}

// Helper function to format grade display (Seed, Bud, Leaf)
const formatGradeDisplay = (grade) => {
    return grade.charAt(0).toUpperCase() + grade.slice(1);
};

// Import calculateAcademicYear from validation file to avoid duplication
// We can create a small wrapper if needed, but let's reuse the logic
const calculateAcademicYear = (date) => {
    if (!date) {
        const currentYear = new Date().getFullYear();
        return currentYear;
    }

    // Handle both dayjs objects and Date objects
    const dateObj = date?.toDate ? date.toDate() : new Date(date);
    const year = dateObj.getFullYear();
    const month = dateObj.getMonth() + 1; // Convert to 1-12

    // If date is June or later, use current year as base
    // If date is Jan-May, use previous year as base (part of academic year that started previous calendar year)
    return month >= 6 ? year : year - 1;
};

const calculateAcademicYearRange = (date) => {
    const baseYear = calculateAcademicYear(date);
    return `${baseYear}–${baseYear + 1}`;
};


export default function TermAdmission() {
    const [popUp, setPopUp] = useState({
        isOpen: false,
        type: '', // 'form' or 'view'
        term: null
    });

    const handleOpenPopUp = (type) => {
        setPopUp({...popUp, isOpen: true, type: type})
    }

    const handleClosePopUp = () => {
        setPopUp({...popUp, isOpen: false, type: ''})
        GetTerm(); //gọi lại api để cập nhật data
    }

    //tạo useState data của BE để sài (dành cho form)
    const [data, setData] = useState({
        terms: [],
    })

    const [selectedTerm, setSelectedTerm] = useState(null) // tuong trung cho 1 cai selected

    function HandleSelectedTerm(term) {
        setSelectedTerm(term)
    }

    //useEffcet sẽ chạy lần đầu tiên, or sẽ chạy khi có thay đổi
    useEffect(() => {
        //lấy data lên và lưu data vào getForm
        GetTerm()
    }, []);

    //gọi API form list //save trực tiếp data
    async function GetTerm() {
        const response = await getTermList()
        if (response && response.success) {
            setData({
                ...data,
                terms: response.data
            })
        }
    }

    return (
        <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale={'vi-VN'}
                              localeText={viVN.components.MuiLocalizationProvider.defaultProps.localeText}>
            <RenderPage
                terms={data.terms}
                openFormPopUpFunc={() => handleOpenPopUp('form')}
                openDetailPopUpFunc={(type) => handleOpenPopUp('view')}
                HandleSelectedTerm={HandleSelectedTerm}
            />

            {popUp.isOpen && popUp.type === 'form' && (
                <RenderFormPopUp
                    isPopUpOpen={popUp.isOpen}
                    handleClosePopUp={handleClosePopUp}
                    GetTerm={GetTerm}
                    terms={data.terms} 
                />
            )}
            {popUp.isOpen && popUp.type === 'view' && (
                <RenderDetailPopUp
                    isPopUpOpen={popUp.isOpen}
                    handleClosePopUp={handleClosePopUp}
                    selectedTerm={selectedTerm}
                    GetTerm={GetTerm}
                />
            )}
        </LocalizationProvider>
    );
}