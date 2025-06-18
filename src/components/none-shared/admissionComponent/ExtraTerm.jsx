import { useState, useEffect } from "react";
import {
    AppBar,
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    IconButton,
    Paper,
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
import { Add, Close, Visibility } from '@mui/icons-material';
import { useSnackbar } from "notistack";
import { format } from 'date-fns';
import { createExtraTerm, getExtraTermList } from "@services/admissionService.js";
import { ValidateExtraTermFormData } from "../validation/ValidateExtraTermFormData.jsx";

function RenderTable({ openDetailPopUpFunc, extraTerms, HandleSelectedTerm }) {
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);

    const columns = [
        { label: 'No', minWidth: 80, align: 'center', key: 'no' },
        { label: 'Name', minWidth: 200, align: 'center', key: 'name' },
        { label: 'Start Date', minWidth: 160, align: 'center', key: 'startDate' },
        { label: 'End Date', minWidth: 160, align: 'center', key: 'endDate' },
        { label: 'Grade', minWidth: 100, align: 'center', key: 'grade' },
        { label: 'Max Number Registration', minWidth: 160, align: 'center', key: 'maxNumberRegistration' },
        { label: 'Year', minWidth: 100, align: 'center', key: 'year' },
        { label: 'Action', minWidth: 80, align: 'center', key: 'action' },
    ];

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(event.target.value);
        setPage(0);
    };

    const handleDetailClick = (term) => {
        HandleSelectedTerm(term);
        openDetailPopUpFunc('view');
    };

    return (
        <Paper sx={{ width: '100%', overflow: 'hidden' }}>
            <TableContainer sx={{ maxHeight: 440 }}>
                <Table stickyHeader aria-label="sticky table">
                    <TableHead>
                        <TableRow>
                            {columns.map((column) => (
                                <TableCell
                                    key={column.key}
                                    align={column.align}
                                    style={{ minWidth: column.minWidth }}
                                    sx={{
                                        backgroundColor: '#07663a',
                                        color: '#ffffff',
                                        fontWeight: 'bold'
                                    }}
                                >
                                    {column.label}
                                </TableCell>
                            ))}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {extraTerms.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                            .map((term, idx) => (
                                <TableRow key={term.id}>
                                    <TableCell align="center">{idx + 1}</TableCell>
                                    <TableCell align="center">{term.name}</TableCell>
                                    <TableCell align="center">
                                        {format(new Date(term.startDate), "dd/MM/yyyy HH:mm")}
                                    </TableCell>
                                    <TableCell align="center">
                                        {format(new Date(term.endDate), "dd/MM/yyyy HH:mm")}
                                    </TableCell>
                                    <TableCell align="center">
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
                                    <TableCell align="center">
                                        {term.maxNumberRegistration}
                                    </TableCell>
                                    <TableCell align="center">{term.year}</TableCell>
                                    <TableCell align="center">
                                        <Tooltip title="View">
                                            <IconButton
                                                color="primary"
                                                onClick={() => handleDetailClick(term)}
                                                sx={{ mr: 1 }}
                                            >
                                                <Visibility />
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
                count={extraTerms?.length}
                page={page}
                onPageChange={handleChangePage}
                rowsPerPage={rowsPerPage}
                onRowsPerPageChange={handleChangeRowsPerPage}
            />
        </Paper>
    );
}

function RenderDetailPopUp({ handleClosePopUp, isPopUpOpen, selectedTerm }) {
    const [formData, setFormData] = useState({
        name: '',
        startDate: '',
        endDate: '',
        maxNumberRegistration: 0,
        reason: '',
        grade: '',
        year: ''
    });

    useEffect(() => {
        if (selectedTerm) {
            setFormData({
                name: selectedTerm.name ?? '',
                startDate: selectedTerm.startDate
                    ? format(new Date(selectedTerm.startDate), "yyyy-MM-dd'T'HH:mm")
                    : '',
                endDate: selectedTerm.endDate
                    ? format(new Date(selectedTerm.endDate), "yyyy-MM-dd'T'HH:mm")
                    : '',
                maxNumberRegistration: selectedTerm.maxNumberRegistration ?? 0,
                reason: selectedTerm.reason ?? '',
                grade: selectedTerm.grade ?? '',
                year: selectedTerm.year ?? ''
            });
        }
    }, [selectedTerm]);

    return (
        <Dialog
            fullScreen
            open={isPopUpOpen}
            onClose={handleClosePopUp}
        >
            <AppBar sx={{ position: 'relative', backgroundColor: '#07663a' }}>
                <Toolbar>
                    <IconButton
                        edge="start"
                        color="inherit"
                        onClick={handleClosePopUp}
                        aria-label="close"
                    >
                        <Close />
                    </IconButton>
                    <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
                        Extra Term Detail
                    </Typography>
                </Toolbar>
            </AppBar>

            <Box p={4}>
                <Typography
                    variant='subtitle1'
                    sx={{ mb: 2, fontWeight: 'bold', fontSize: "2.5rem", textAlign: "center", color: '#07663a' }}
                >
                    Extra Term Information
                </Typography>

                <Stack spacing={3}>
                    <Stack>
                        <TextField
                            label="Name"
                            type="text"
                            value={formData.name}
                            InputProps={{ readOnly: true }}
                            fullWidth
                        />
                    </Stack>

                    <Stack>
                        <TextField
                            label="Grade"
                            type="text"
                            value={formData.grade}
                            InputProps={{ readOnly: true }}
                            fullWidth
                        />
                    </Stack>

                    <Stack>
                        <TextField
                            label="Year"
                            type="text"
                            value={formData.year}
                            InputProps={{ readOnly: true }}
                            fullWidth
                        />
                    </Stack>

                    <Stack>
                        <TextField
                            label="Start Date"
                            type="datetime-local"
                            value={formData.startDate}
                            InputProps={{ readOnly: true }}
                            fullWidth
                        />
                    </Stack>

                    <Stack>
                        <TextField
                            label="End Date"
                            type="datetime-local"
                            value={formData.endDate}
                            InputProps={{ readOnly: true }}
                            fullWidth
                        />
                    </Stack>

                    <Stack>
                        <TextField
                            label="Max Number Registration"
                            type="number"
                            value={formData.maxNumberRegistration}
                            InputProps={{ readOnly: true }}
                            fullWidth
                        />
                    </Stack>

                    <Stack>
                        <TextField
                            label="Reason"
                            type="text"
                            value={formData.reason}
                            InputProps={{ readOnly: true }}
                            fullWidth
                            multiline
                            rows={4}
                        />
                    </Stack>
                </Stack>
            </Box>

            <DialogActions sx={{ justifyContent: 'flex-end', px: 4, py: 3, gap: '1rem' }}>
                <Button
                    sx={{ minWidth: 120, height: '44px' }}
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

function RenderFormPopUp({ isPopUpOpen, handleClosePopUp, GetExtraTerms, admissionTermId }) {
    const { enqueueSnackbar } = useSnackbar();

    const [formData, setFormData] = useState({
        admissionTermId: admissionTermId || '',
        startDate: '',
        endDate: '',
        reason: ''
    });

    const handleOnChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleCreate = async () => {
        const errorMsg = ValidateExtraTermFormData(formData);
        if (errorMsg) {
            enqueueSnackbar(errorMsg, { variant: "warning" });
            return;
        }

        try {
            const response = await createExtraTerm(
                formData.admissionTermId,
                formData.startDate,
                formData.endDate,
                formData.reason
            );

            if (response.success) {
                enqueueSnackbar("Extra term created successfully!", { variant: "success" });
                handleClosePopUp();
                GetExtraTerms();
            } else {
                enqueueSnackbar(response.message || "Failed to create extra term", { variant: "error" });
            }
        } catch (error) {
            enqueueSnackbar(error.message || "An error occurred while creating extra term", { variant: "error" });
        }
    };

    return (
        <Dialog open={isPopUpOpen} onClose={handleClosePopUp} maxWidth="sm" fullWidth>
            <DialogTitle sx={{ fontWeight: 'bold', fontSize: 26, color: '#2c684f' }}>
                Create New Extra Term
            </DialogTitle>
            <DialogContent>
                <Box sx={{ mt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <Stack>
                        <TextField
                            label="Start Date"
                            type="datetime-local"
                            required
                            fullWidth
                            name="startDate"
                            value={formData.startDate}
                            onChange={handleOnChange}
                            InputLabelProps={{ shrink: true }}
                            sx={{
                                '& .MuiOutlinedInput-root': {
                                    borderRadius: '12px',
                                    '& fieldset': {
                                        borderColor: '#2c684f',
                                        borderWidth: 2,
                                    },
                                    '&:hover fieldset': {
                                        borderColor: '#2c684f',
                                    },
                                    '&.Mui-focused fieldset': {
                                        borderColor: '#2c684f',
                                        boxShadow: '0 0 0 2px #eaf3ed'
                                    },
                                }
                            }}
                        />
                    </Stack>

                    <Stack>
                        <TextField
                            label="End Date"
                            type="datetime-local"
                            required
                            fullWidth
                            name="endDate"
                            value={formData.endDate}
                            onChange={handleOnChange}
                            InputLabelProps={{ shrink: true }}
                            sx={{
                                '& .MuiOutlinedInput-root': {
                                    borderRadius: '12px',
                                    '& fieldset': {
                                        borderColor: '#2c684f',
                                        borderWidth: 2,
                                    },
                                    '&:hover fieldset': {
                                        borderColor: '#2c684f',
                                    },
                                    '&.Mui-focused fieldset': {
                                        borderColor: '#2c684f',
                                        boxShadow: '0 0 0 2px #eaf3ed'
                                    },
                                }
                            }}
                        />
                    </Stack>

                    <Stack>
                        <TextField
                            label="Reason"
                            type="text"
                            required
                            fullWidth
                            name="reason"
                            value={formData.reason}
                            onChange={handleOnChange}
                            multiline
                            rows={4}
                            sx={{
                                '& .MuiOutlinedInput-root': {
                                    borderRadius: '12px',
                                    '& fieldset': {
                                        borderColor: '#2c684f',
                                        borderWidth: 2,
                                    },
                                    '&:hover fieldset': {
                                        borderColor: '#2c684f',
                                    },
                                    '&.Mui-focused fieldset': {
                                        borderColor: '#2c684f',
                                        boxShadow: '0 0 0 2px #eaf3ed'
                                    },
                                }
                            }}
                        />
                    </Stack>
                </Box>
            </DialogContent>
            <DialogActions sx={{ p: 3 }}>
                <Button
                    onClick={handleClosePopUp}
                    variant="outlined"
                    color="warning"
                    sx={{
                        minWidth: 100,
                        height: '44px',
                        borderRadius: '10px',
                        borderWidth: '2px',
                        '&:hover': {
                            borderWidth: '2px'
                        }
                    }}
                >
                    Cancel
                </Button>
                <Button
                    onClick={handleCreate}
                    variant="contained"
                    sx={{
                        minWidth: 100,
                        height: '44px',
                        borderRadius: '10px',
                        backgroundColor: '#07663a',
                        '&:hover': {
                            backgroundColor: '#07662a'
                        }
                    }}
                >
                    Create
                </Button>
            </DialogActions>
        </Dialog>
    );
}

function RenderPage({ openFormPopUpFunc, openDetailPopUpFunc, extraTerms, HandleSelectedTerm }) {
    return (
        <div className="container">
            <Box sx={{ mt: 2, mb: 2 }}>
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
                    Extra Term Admission
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
                    Manage extra terms for locked admission terms
                </Typography>
            </Box>

            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
                <Button
                    variant="contained"
                    endIcon={<Add />}
                    onClick={openFormPopUpFunc}
                    sx={{
                        minWidth: 180,
                        height: 44,
                        borderRadius: '10px',
                        fontWeight: 600,
                        fontSize: 14,
                        backgroundColor: '#07663a',
                        boxShadow: 2,
                        mr: { xs: 0, md: 2 }
                    }}
                >
                    Create new extra term
                </Button>
            </Box>

            <RenderTable
                extraTerms={extraTerms}
                openDetailPopUpFunc={openDetailPopUpFunc}
                HandleSelectedTerm={HandleSelectedTerm}
            />
        </div>
    );
}

export default function ExtraTerm() {
    const [popUp, setPopUp] = useState({
        isOpen: false,
        type: '', // 'form' or 'view'
    });

    const [data, setData] = useState({
        extraTerms: [],
    });

    const [selectedTerm, setSelectedTerm] = useState(null);

    const handleOpenPopUp = (type) => {
        setPopUp({ ...popUp, isOpen: true, type: type });
    };

    const handleClosePopUp = () => {
        setPopUp({ ...popUp, isOpen: false, type: '' });
        GetExtraTerms();
    };

    function HandleSelectedTerm(term) {
        setSelectedTerm(term);
    }

    useEffect(() => {
        GetExtraTerms();
    }, []);

    async function GetExtraTerms() {
        const response = await getExtraTermList();
        if (response && response.success) {
            setData({
                ...data,
                extraTerms: response.data
            });
        }
    }

    return (
        <>
            <RenderPage
                extraTerms={data.extraTerms}
                openFormPopUpFunc={() => handleOpenPopUp('form')}
                openDetailPopUpFunc={(type) => handleOpenPopUp('view')}
                HandleSelectedTerm={HandleSelectedTerm}
            />

            {popUp.isOpen && popUp.type === 'form' && (
                <RenderFormPopUp
                    isPopUpOpen={popUp.isOpen}
                    handleClosePopUp={handleClosePopUp}
                    GetExtraTerms={GetExtraTerms}
                    admissionTermId={selectedTerm?.id}
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