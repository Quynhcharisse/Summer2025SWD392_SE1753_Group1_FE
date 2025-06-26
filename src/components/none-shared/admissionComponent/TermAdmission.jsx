import {
    AppBar,
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    FormControl,
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
import {Add, Close, FilterList, Visibility} from '@mui/icons-material';
import {useEffect, useState} from "react";
import {createTerm, getDefaultGrade, getTermList, getTermYears} from "@services/admissionService.js";
import {useSnackbar} from "notistack";
import {format} from 'date-fns';
import {ValidateTermFormData} from "../validation/ValidateTermFormData.jsx";
import ExtraTermForm from "./ExtraTermForm.jsx";

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

    const columns = [
        {label: 'No', minWidth: 80, align: 'center', key: 'no'},
        {label: 'Grade', minWidth: 100, align: 'center', key: 'grade'},
        {label: 'Academic Year', minWidth: 120, align: 'center', key: 'year'},
        {label: 'Classes', minWidth: 100, align: 'center', key: 'classes'},
        {label: 'Registration', minWidth: 160, align: 'center', key: 'registration'},
        {label: 'Status', minWidth: 120, align: 'center', key: 'status'},
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
                                    <TableCell align="center" sx={{minWidth: 80}}>{idx + 1}</TableCell>
                                    <TableCell align="center" sx={{minWidth: 100}}>
                                        <Box sx={{
                                            display: 'inline-block',
                                            backgroundColor: term.grade === 'SEED'
                                                ? '#2e7d32'
                                                : term.grade === 'BUD'
                                                    ? '#ed6c02'
                                                    : '#0288d1',
                                            padding: '6px 16px',
                                            borderRadius: '16px',
                                            minWidth: '90px',
                                        }}>
                                            <Typography sx={{
                                                fontWeight: 600,
                                                color: '#ffffff',
                                                textTransform: 'uppercase',
                                                fontSize: '0.875rem',
                                                lineHeight: '1.43',
                                                letterSpacing: '0.01071em',
                                            }}>
                                                {term.grade}
                                            </Typography>
                                        </Box>
                                    </TableCell>
                                    <TableCell align="center" sx={{minWidth: 120}}>{term.year}</TableCell>
                                    <TableCell align="center" sx={{minWidth: 100}}>
                                        <Typography>
                                            {term.expectedClasses} classes
                                            <Typography component="span" sx={{color: 'text.secondary', fontSize: '0.875rem'}}>
                                                {` (${term.studentsPerClass} students/class)`}
                                            </Typography>
                                        </Typography>
                                    </TableCell>
                                    <TableCell align="center" sx={{minWidth: 160}}>
                                        <Box sx={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            gap: 1
                                        }}>
                                            <Typography sx={{
                                                fontWeight: 600,
                                                color: term.approvedForm >= term.maxNumberRegistration ? '#d32f2f' : '#07663a'
                                            }}>
                                                {term.approvedForm || 0}
                                            </Typography>
                                            <Typography sx={{color: '#666'}}>/</Typography>
                                            <Typography sx={{fontWeight: 600}}>
                                                {term.maxNumberRegistration}
                                            </Typography>
                                        </Box>
                                    </TableCell>
                                    <TableCell align="center" sx={{
                                        minWidth: 120,
                                        fontWeight: 700,
                                        color:
                                            term.status === 'active'
                                                ? '#219653' // xanh lá
                                                : term.status === 'inactive'
                                                    ? '#bdbdbd' // xám nhạt
                                                    : term.status === 'locked'
                                                        ? '#d32f2f' // đỏ
                                                        : '#2c3e50',
                                        borderRadius: 2,
                                        letterSpacing: 1,
                                        textTransform: 'uppercase'
                                    }}>
                                        {term.status}
                                    </TableCell>
                                    <TableCell align="center" sx={{minWidth: 80}}>
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

function RenderDetailPopUp({handleClosePopUp, isPopUpOpen, selectedTerm}) {
    const [formData, setFormData] = useState({
        grade: null,
        startDate: null,
        endDate: null,
        maxNumberRegistration: 0,
        reservationFee: 0,
        serviceFee: 0,
        uniformFee: 0,
        learningMaterialFee: 0,
        facilityFee: 0,
        approvedForm: 0,
        status: '',
        extraTerms: [],
        studentsPerClass: 20,
        expectedClasses: 0
    });

    useEffect(() => {
        if (selectedTerm) {
            setFormData({
                id: selectedTerm.id,
                grade: selectedTerm.grade ?? '',
                startDate: selectedTerm.startDate
                    ? format(new Date(selectedTerm.startDate), "yyyy-MM-dd'T'HH:mm")
                    : '',
                endDate: selectedTerm.endDate
                    ? format(new Date(selectedTerm.endDate), "yyyy-MM-dd'T'HH:mm")
                    : '',
                maxNumberRegistration: selectedTerm.maxNumberRegistration ?? 0,
                reservationFee: selectedTerm.reservationFee ?? 0,
                serviceFee: selectedTerm.serviceFee ?? 0,
                uniformFee: selectedTerm.uniformFee ?? 0,
                learningMaterialFee: selectedTerm.learningMaterialFee ?? 0,
                facilityFee: selectedTerm.facilityFee ?? 0,
                approvedForm: selectedTerm.approvedForm ?? 0,
                status: selectedTerm.status ?? '',
                extraTerms: selectedTerm.extraTerms ?? [],
                studentsPerClass: selectedTerm.studentsPerClass ?? 20,
                expectedClasses: selectedTerm.expectedClasses ?? 0
            });
        }
    }, [selectedTerm]);

    const getStatusColor = (status) => {
        switch(status?.toLowerCase()) {
            case 'active':
                return '#219653';
            case 'inactive':
                return '#bdbdbd';
            case 'locked':
                return '#d32f2f';
            default:
                return '#2c3e50';
        }
    };

    return (
        <Dialog
            fullScreen
            open={isPopUpOpen}
            onClose={handleClosePopUp}
        >
            <AppBar sx={{position: 'relative', backgroundColor: '#07663a'}}>
                <Toolbar>
                    <IconButton edge="start"
                                color="inherit"
                                onClick={handleClosePopUp}
                                aria-label="close">
                        <Close/>
                    </IconButton>
                    <Typography sx={{ml: 2, flex: 1}} variant="h6" component="div">
                        Admission Term Detail
                    </Typography>
                    <Box sx={{
                        backgroundColor: getStatusColor(formData.status),
                        padding: '6px 16px',
                        borderRadius: '16px',
                        marginLeft: 2
                    }}>
                        <Typography sx={{
                            color: '#ffffff',
                            fontWeight: 600,
                            textTransform: 'uppercase'
                        }}>
                            {formData.status}
                        </Typography>
                    </Box>
                </Toolbar>
            </AppBar>

            <Box p={4}>
                <Typography
                    variant='subtitle1'
                    sx={{mb: 2, fontWeight: 'bold', fontSize: "2.5rem", textAlign: "center", color: '#07663a'}}
                >
                    Term Information
                </Typography>

                <Stack spacing={3}>
                    {/* Grade Display */}
                    <Box sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        mb: 3
                    }}>
                        <Box sx={{
                            backgroundColor: formData.grade === 'seed'
                                ? '#2e7d32'
                                : formData.grade === 'bud'
                                    ? '#ed6c02'
                                    : '#0288d1',
                            padding: '12px 32px',
                            borderRadius: '24px',
                            boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
                            minWidth: '150px',
                            textAlign: 'center'
                        }}>
                            <Typography sx={{
                                color: '#ffffff',
                                fontWeight: 700,
                                fontSize: '1.5rem',
                                textTransform: 'uppercase',
                                letterSpacing: '2px'
                            }}>
                                {formData.grade}
                            </Typography>
                        </Box>
                    </Box>

                    <Stack>
                        <TextField
                            label="Start Date"
                            type="datetime-local"
                            required
                            fullWidth
                            name="startDate"
                            value={formData.startDate}
                            InputProps={{readOnly: true}}
                        />
                    </Stack>
                    <Stack>
                        <TextField
                            label="End Date"
                            type="datetime-local"
                            name="endDate"
                            value={formData.endDate}
                            required
                            fullWidth
                            InputProps={{readOnly: true}}
                        />
                    </Stack>

                    <Box sx={{display: 'flex', gap: 2}}>
                        <TextField
                            label="Expected Classes"
                            type="number"
                            value={formData.expectedClasses}
                            InputProps={{readOnly: true}}
                            fullWidth
                        />
                        <TextField
                            label="Students Per Class"
                            type="number"
                            value={formData.studentsPerClass}
                            InputProps={{
                                readOnly: true
                            }}
                            sx={{
                                '& .MuiOutlinedInput-root': {
                                    borderRadius: '12px',
                                    backgroundColor: '#f5f5f5'
                                }
                            }}
                        />
                        <TextField
                            label="Max Registration"
                            type="number"
                            value={formData.maxNumberRegistration}
                            InputProps={{
                                readOnly: true
                            }}
                            sx={{
                                '& .MuiOutlinedInput-root': {
                                    borderRadius: '12px',
                                    backgroundColor: '#f5f5f5'
                                }
                            }}
                        />
                    </Box>

                    <Stack>
                        <TextField
                            label="Registration Progress"
                            type="text"
                            value={`${formData.approvedForm}/${formData.maxNumberRegistration}`}
                            required
                            fullWidth
                            InputProps={{
                                readOnly: true,
                                startAdornment: (
                                    <Box sx={{
                                        width: `${(formData.approvedForm / formData.maxNumberRegistration) * 100}%`,
                                        height: '4px',
                                        backgroundColor: formData.approvedForm >= formData.maxNumberRegistration ? '#d32f2f' : '#4caf50',
                                        position: 'absolute',
                                        bottom: 0,
                                        left: 0,
                                        transition: 'width 0.3s ease'
                                    }}/>
                                )
                            }}
                        />
                    </Stack>

                    <Typography fontWeight="bold" sx={{mt: 1, mb: 0, color: '#07663a'}}>Fees</Typography>

                    <Stack>
                        <TextField label="Reservation Fee"
                                   type="number"
                                   name="reservationFee"
                                   value={formData.reservationFee}
                                   required
                                   fullWidth
                                   InputProps={{readOnly: true}}
                        />
                    </Stack>

                    <Stack>
                        <TextField label="Service Fee"
                                   type="number"
                                   name="serviceFee"
                                   value={formData.serviceFee}
                                   required
                                   fullWidth
                                   InputProps={{readOnly: true}}
                        />
                    </Stack>

                    <Stack>
                        <TextField label="Uniform Fee"
                                   type="number"
                                   name="uniformFee"
                                   value={formData.uniformFee}
                                   required
                                   fullWidth
                                   InputProps={{readOnly: true}}
                        />
                    </Stack>

                    <Stack>
                        <TextField label="Learning Material Fee"
                                   type="number"
                                   name="learningMaterialFee"
                                   value={formData.learningMaterialFee}
                                   required
                                   fullWidth
                                   InputProps={{readOnly: true}}
                        />
                    </Stack>

                    <Stack>
                        <TextField label="Facility Fee"
                                   type="number"
                                   name="facilityFee"
                                   value={formData.facilityFee}
                                   required
                                   fullWidth
                                   InputProps={{readOnly: true}}
                        />
                    </Stack>

                    {formData.status === 'locked' && (
                        <ExtraTermForm 
                            formData={formData}
                            onClose={handleClosePopUp}
                            getStatusColor={getStatusColor}
                        />
                    )}
                </Stack>
            </Box>

            <DialogActions sx={{justifyContent: 'flex-end', px: 4, py: 3}}>
                <Button
                    sx={{minWidth: 120, height: '44px'}}
                    variant="contained"
                    color="warning"
                    onClick={handleClosePopUp}
                >
                    Close
                </Button>
            </DialogActions>
        </Dialog>
    );
}

function RenderFormPopUp({isPopUpOpen, handleClosePopUp, GetTerm, terms}) {
    const {enqueueSnackbar} = useSnackbar();

    const [formData, setFormData] = useState({
        name: '',
        year: new Date().getFullYear(),
        startDate: '',
        endDate: '',
        grade: '',
        expectedClasses: '',
        studentsPerClass: 20,
        maxNumberRegistration: 0,
        reservationFee: 0,
        serviceFee: 0,
        uniformFee: 0,
        learningMaterialFee: 0,
        facilityFee: 0,
        status: 'ACTIVE'
    });

    useEffect(() => {
        const numExpectedClasses = parseInt(formData.expectedClasses) || 0;
        setFormData(prev => ({
            ...prev,
            maxNumberRegistration: numExpectedClasses * prev.studentsPerClass,
            name: `${prev.grade || ''} Term ${prev.year}-${prev.year + 1}`
        }));
    }, [formData.expectedClasses, formData.grade]);

    const handleCreate = async (formData) => {
        const errorMsg = ValidateTermFormData(formData, terms);
        if (errorMsg) {
            enqueueSnackbar(errorMsg, {variant: "warning"});
            return;
        }

        try {
            const response = await createTerm(
                formData.grade,
                formData.startDate,
                formData.endDate,
                formData.expectedClasses,
                formData.reservationFee,
                formData.serviceFee,
                formData.uniformFee,
                formData.learningMaterialFee,
                formData.facilityFee
            );

            if (response.success) {
                enqueueSnackbar("Term created successfully!", {variant: "success"});
                handleClosePopUp();
                GetTerm();
            } else {
                enqueueSnackbar(response.message || "Failed to create term", {variant: "error"});
            }
        } catch (error) {
            enqueueSnackbar(error.message || "An error occurred while creating term", {variant: "error"});
        }
    };

    const handleChange = async (e) => {
        const {name, value} = e.target;

        if (name === "expectedClasses") {
            // Allow empty string or positive numbers
            if (value === '' || (parseInt(value) >= 0)) {
                setFormData(prev => ({
                    ...prev,
                    [name]: value,
                    maxNumberRegistration: value ? parseInt(value) * prev.studentsPerClass : 0
                }));
            }
            return;
        }

        if (name === "grade") {
            try {
                // First update the grade and name immediately
                setFormData(prev => ({
                    ...prev,
                    grade: value,
                    name: `${value} Term ${prev.year}-${prev.year + 1}`
                }));

                const response = await getDefaultGrade(value);
                console.log("Default fee response:", response);

                if (response?.success && response?.data) {
                    const fees = response.data;
                    // Update fees matching the backend enum order
                    setFormData(prev => ({
                        ...prev,
                        learningMaterialFee: fees.learningMaterialFee || 0,
                        reservationFee: fees.reservationFee || 0,
                        serviceFee: fees.serviceFee || 0,
                        uniformFee: fees.uniformFee || 0,
                        facilityFee: fees.facilityFee || 0
                    }));
                } else {
                    enqueueSnackbar("Failed to load fees for the selected grade. Please try again.", {variant: "error"});
                }
            } catch (err) {
                console.error("Error loading default fees:", err);
                enqueueSnackbar("Error loading fees. Please try again or contact support.", {variant: "error"});
            }
            return;
        }

        if (name === "startDate" || name === "endDate") {
            const date = new Date(value);
            if (!isNaN(date.getTime())) {
                setFormData(prev => ({
                    ...prev,
                    [name]: value
                }));
            }
            return;
        }

        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    return (
        <Dialog
            open={isPopUpOpen}
            fullScreen
            PaperProps={{
                sx: {
                    bgcolor: '#f8f9fa'
                }
            }}
        >
            <AppBar 
                position="relative" 
                sx={{
                    bgcolor: '#07663a',
                    boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
                }}
            >
                <Toolbar>
                    <IconButton
                        edge="start"
                        color="inherit"
                        onClick={handleClosePopUp}
                        aria-label="close"
                        sx={{
                            mr: 2,
                            '&:hover': {
                                backgroundColor: 'rgba(255,255,255,0.1)'
                            }
                        }}
                    >
                        <Close />
                    </IconButton>
                    <Typography 
                        variant="h6" 
                        component="div" 
                        sx={{
                            flex: 1,
                            fontSize: '1.25rem',
                            fontWeight: 600,
                            letterSpacing: '0.5px'
                        }}
                    >
                        Create New Term
                    </Typography>
                </Toolbar>
            </AppBar>

            <DialogContent>
                <Box sx={{
                    mt: 4,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 3,
                    maxWidth: '1000px',
                    mx: 'auto',
                    px: 2
                }}>
                    {/* Term Name */}
                    <TextField
                        label="Term Name"
                        name="name"
                        value={formData.name}
                        fullWidth
                        required
                        InputProps={{
                            readOnly: true,
                        }}
                        sx={{
                            '& .MuiOutlinedInput-root': {
                                borderRadius: '12px',
                                backgroundColor: '#f5f5f5'
                            }
                        }}
                    />

                    {/* Academic Year */}
                    <TextField
                        label="Academic Year"
                        value={`${formData.year}-${formData.year + 1}`}
                        fullWidth
                        InputProps={{
                            readOnly: true,
                        }}
                        sx={{
                            '& .MuiOutlinedInput-root': {
                                borderRadius: '12px',
                                backgroundColor: '#f5f5f5'
                            }
                        }}
                    />

                    {/* Start Date and End Date */}
                    <Box sx={{display: 'flex', gap: 2}}>
                        <TextField
                            label="Start Date *"
                            type="datetime-local"
                            name="startDate"
                            value={formData.startDate}
                            onChange={handleChange}
                            required
                            fullWidth
                            InputLabelProps={{shrink: true}}
                            sx={{
                                '& .MuiOutlinedInput-root': {
                                    borderRadius: '12px',
                                    '&:hover .MuiOutlinedInput-notchedOutline': {
                                        borderColor: '#07663a',
                                    },
                                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                        borderColor: '#07663a',
                                        borderWidth: 2
                                    }
                                },
                                '& .MuiInputLabel-root.Mui-focused': {
                                    color: '#07663a'
                                }
                            }}
                        />

                        <TextField
                            label="End Date *"
                            type="datetime-local"
                            name="endDate"
                            value={formData.endDate}
                            onChange={handleChange}
                            required
                            fullWidth
                            InputLabelProps={{shrink: true}}
                            sx={{
                                '& .MuiOutlinedInput-root': {
                                    borderRadius: '12px',
                                    '&:hover .MuiOutlinedInput-notchedOutline': {
                                        borderColor: '#07663a',
                                    },
                                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                        borderColor: '#07663a',
                                        borderWidth: 2
                                    }
                                },
                                '& .MuiInputLabel-root.Mui-focused': {
                                    color: '#07663a'
                                }
                            }}
                        />
                    </Box>

                    {/* Grade Selection */}
                    <FormControl 
                        fullWidth
                        sx={{
                            '& .MuiOutlinedInput-root': {
                                borderRadius: '12px',
                                '&:hover .MuiOutlinedInput-notchedOutline': {
                                    borderColor: '#07663a',
                                },
                                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                    borderColor: '#07663a',
                                    borderWidth: 2
                                }
                            },
                            '& .MuiInputLabel-root.Mui-focused': {
                                color: '#07663a'
                            }
                        }}
                    >
                        <InputLabel id="grade-label">Grade *</InputLabel>
                        <Select
                            labelId="grade-label"
                            name="grade"
                            value={formData.grade}
                            onChange={handleChange}
                            label="Grade *"
                            required
                        >
                            <MenuItem value="SEED">SEED</MenuItem>
                            <MenuItem value="BUD">BUD</MenuItem>
                            <MenuItem value="LEAF">LEAF</MenuItem>
                        </Select>
                    </FormControl>

                    {/* Class Information */}
                    <Box sx={{display: 'flex', gap: 2}}>
                        <TextField
                            label="Expected Classes *"
                            type="number"
                            required
                            fullWidth
                            name="expectedClasses"
                            value={formData.expectedClasses}
                            onChange={handleChange}
                            placeholder="Enter number of classes"
                            InputProps={{
                                inputProps: { 
                                    min: 0,
                                    style: { textAlign: 'left' }
                                }
                            }}
                            sx={{
                                '& .MuiOutlinedInput-root': {
                                    borderRadius: '12px',
                                    '&:hover .MuiOutlinedInput-notchedOutline': {
                                        borderColor: '#07663a',
                                    },
                                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                        borderColor: '#07663a',
                                        borderWidth: 2
                                    }
                                },
                                '& .MuiInputLabel-root.Mui-focused': {
                                    color: '#07663a'
                                }
                            }}
                        />

                        <TextField
                            label="Students Per Class"
                            type="number"
                            value={formData.studentsPerClass}
                            InputProps={{
                                readOnly: true,
                            }}
                            sx={{
                                '& .MuiOutlinedInput-root': {
                                    borderRadius: '12px',
                                    backgroundColor: '#f5f5f5'
                                }
                            }}
                        />

                        <TextField
                            label="Max Registration"
                            type="number"
                            value={formData.maxNumberRegistration}
                            InputProps={{
                                readOnly: true,
                            }}
                            sx={{
                                '& .MuiOutlinedInput-root': {
                                    borderRadius: '12px',
                                    backgroundColor: '#f5f5f5'
                                }
                            }}
                        />
                    </Box>

                    {/* Fee Information */}
                    <Paper 
                        elevation={0} 
                        sx={{
                            p: 3,
                            borderRadius: '16px',
                            border: '1px solid #e0e0e0',
                            backgroundColor: '#fff'
                        }}
                    >
                        <Typography 
                            variant="h6" 
                            sx={{
                                mb: 3,
                                color: '#07663a',
                                fontWeight: 600,
                                fontSize: '1.1rem'
                            }}
                        >
                            Fee Information
                        </Typography>

                        <Box sx={{display: 'flex', flexDirection: 'column', gap: 2}}>
                            <TextField
                                label="Reservation Fee"
                                type="number"
                                value={formData.reservationFee}
                                InputProps={{readOnly: true}}
                                fullWidth
                                sx={{
                                    '& .MuiOutlinedInput-root': {
                                        borderRadius: '12px',
                                        backgroundColor: '#f5f5f5'
                                    }
                                }}
                            />

                            <TextField
                                label="Service Fee"
                                type="number"
                                value={formData.serviceFee}
                                InputProps={{readOnly: true}}
                                fullWidth
                                sx={{
                                    '& .MuiOutlinedInput-root': {
                                        borderRadius: '12px',
                                        backgroundColor: '#f5f5f5'
                                    }
                                }}
                            />

                            <TextField
                                label="Uniform Fee"
                                type="number"
                                value={formData.uniformFee}
                                InputProps={{readOnly: true}}
                                fullWidth
                                sx={{
                                    '& .MuiOutlinedInput-root': {
                                        borderRadius: '12px',
                                        backgroundColor: '#f5f5f5'
                                    }
                                }}
                            />

                            <TextField
                                label="Learning Material Fee"
                                type="number"
                                value={formData.learningMaterialFee}
                                InputProps={{readOnly: true}}
                                fullWidth
                                sx={{
                                    '& .MuiOutlinedInput-root': {
                                        borderRadius: '12px',
                                        backgroundColor: '#f5f5f5'
                                    }
                                }}
                            />

                            <TextField
                                label="Facility Fee"
                                type="number"
                                value={formData.facilityFee}
                                InputProps={{readOnly: true}}
                                fullWidth
                                sx={{
                                    '& .MuiOutlinedInput-root': {
                                        borderRadius: '12px',
                                        backgroundColor: '#f5f5f5'
                                    }
                                }}
                            />
                        </Box>
                    </Paper>
                </Box>
            </DialogContent>

            <Toolbar sx={{ justifyContent: 'flex-end' }}>
                <Button
                    onClick={handleClosePopUp}
                    variant="outlined"
                    color="error"
                    sx={{
                        mr: 2,
                        borderRadius: '10px',
                        px: 3,
                        py: 1,
                        textTransform: 'none',
                        fontWeight: 600
                    }}
                >
                    Cancel
                </Button>
                <Button
                    onClick={() => handleCreate(formData)}
                    variant="contained"
                    sx={{
                        backgroundColor: '#07663a',
                        borderRadius: '10px',
                        px: 3,
                        py: 1,
                        textTransform: 'none',
                        fontWeight: 600,
                        '&:hover': {
                            backgroundColor: '#05512e'
                        }
                    }}
                >
                    Create Term
                </Button>
            </Toolbar>
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
                    const sortedYears = [...response.data].sort((a, b) => b - a);
                    setYears(['all', ...sortedYears]);
                } else {
                    console.error('Failed to fetch years:', response.message);
                }
            } catch (error) {
                console.error('Error fetching years:', error);
            }
        };
        fetchYears();
    }, []);

    const filteredTerms = selectedYear === 'all' 
        ? terms
        : terms.filter(term => term.year === selectedYear);

    // const totalMaxRegistrations = terms.reduce((sum, term) => sum + term.maxNumberRegistration, 0);
    // const totalRegistered = terms.reduce((sum, term) => sum + (term.approvedForm || 0), 0);
    //
    // const budMaxRegistrations = filteredTerms.filter(term => term.grade === 'BUD').reduce((sum, term) => sum + term.maxNumberRegistration, 0);
    // const budRegistered = filteredTerms.filter(term => term.grade === 'BUD').reduce((sum, term) => sum + (term.approvedForm || 0), 0);
    //
    // const seedMaxRegistrations = filteredTerms.filter(term => term.grade === 'SEED').reduce((sum, term) => sum + term.maxNumberRegistration, 0);
    // const seedRegistered = filteredTerms.filter(term => term.grade === 'SEED').reduce((sum, term) => sum + (term.approvedForm || 0), 0);

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
                <FormControl sx={{ minWidth: 200 }}>
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
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <FilterList sx={{ color: '#07663a', fontSize: 20 }} />
                                <Typography sx={{ color: '#07663a', fontWeight: 500 }}>
                                    {selected === 'all' ? 'Filter by Year' : `Year: ${selected}`}
                                </Typography>
                            </Box>
                        )}
                    >
                        {years.map((year) => (
                            <MenuItem key={year} value={year}>
                                {year === 'all' ? 'All Years' : year}
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
        <>
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
                />
            )}
        </>
    );
}