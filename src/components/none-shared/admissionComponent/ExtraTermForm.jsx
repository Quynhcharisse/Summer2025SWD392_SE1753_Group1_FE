import {
    Box,
    Button,
    Divider,
    Paper,
    Stack,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TextField,
    Typography,
    FormControl,
    FormLabel,
    Tooltip,
    IconButton,
    Alert
} from "@mui/material";
import {Add, Info, Close} from "@mui/icons-material";
import {format} from "date-fns";
import {useState, useMemo} from "react";
import {createExtraTerm} from "@api/services/admissionService.js";
import {enqueueSnackbar} from "notistack";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions
} from "@mui/material";
import {LocalizationProvider} from "@mui/x-date-pickers/LocalizationProvider";
import {AdapterDateFns} from "@mui/x-date-pickers/AdapterDateFns";
import {DateTimePicker} from "@mui/x-date-pickers/DateTimePicker";

export default function ExtraTermForm({formData, onClose, getStatusColor}) {
    const [extraTermForm, setExtraTermForm] = useState({
        startDate: null,
        endDate: null,
        displayForm: false
    });

    const [selectedTerm, setSelectedTerm] = useState(null);
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [open, setOpen] = useState(false);

    // Kiểm tra xem có extra term đang active/inactive không
    const hasActiveExtraTerm = useMemo(() => {
        if (!formData.extraTerms || formData.extraTerms.length === 0) return false;
        return formData.extraTerms.some(term => 
            term.status.toLowerCase() === 'active' || 
            term.status.toLowerCase() === 'inactive'
        );
    }, [formData.extraTerms]);

    const handleExtraTermSubmit = async () => {
        try {
            // Log form data và term data
            console.log('🔍 Current Form Data:', formData);
            console.log('🔍 Extra Term Form Data:', extraTermForm);

            // Kiểm tra term ID
            if (!formData || !formData.id) {
                console.error('❌ Validation Error: Invalid term ID');
                enqueueSnackbar('Invalid term selected', { variant: 'error' });
                return;
            }

            // Kiểm tra cả hai ngày phải được chọn
            if (!extraTermForm.startDate || !extraTermForm.endDate) {
                console.error('❌ Validation Error: Missing dates', {
                    startDate: extraTermForm.startDate,
                    endDate: extraTermForm.endDate
                });
                enqueueSnackbar('Please select both start and end dates', { variant: 'error' });
                return;
            }

            // Chuyển đổi string thành Date object để so sánh
            const startDate = new Date(extraTermForm.startDate);
            const endDate = new Date(extraTermForm.endDate);

            // Log thông tin về dates
            console.log('📅 Date Information:', {
                rawStartDate: extraTermForm.startDate,
                rawEndDate: extraTermForm.endDate,
                parsedStartDate: startDate,
                parsedEndDate: endDate
            });

            // Kiểm tra ngày hợp lệ
            if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
                console.error('❌ Validation Error: Invalid date format');
                enqueueSnackbar('Please select valid dates', { variant: 'error' });
                return;
            }

            // So sánh ngày bắt đầu và kết thúc
            if (startDate >= endDate) {
                console.error('❌ Validation Error: End date must be after start date');
                enqueueSnackbar('End date must be after start date', { variant: 'error' });
                return;
            }

            // Format dates theo chuẩn ISO cho LocalDateTime của Java
            const formatToJavaDateTime = (date) => {
                return format(date, "yyyy-MM-dd'T'HH:mm:ss");
            };

            // Log request data trước khi gửi
            const requestData = {
                termId: formData.id,
                startDate: formatToJavaDateTime(startDate),
                endDate: formatToJavaDateTime(endDate),
                maxNumberRegistration: formData.maxNumberRegistration - formData.approvedForm
            };
            console.log('🚀 Request Data:', requestData);

            const response = await createExtraTerm(requestData);

            if (response.success) {
                console.log('✅ Success Response:', response);
                enqueueSnackbar('Extra term created successfully', { variant: 'success' });
                setExtraTermForm({ startDate: null, endDate: null, displayForm: false });
                onClose();
            } else {
                console.error('❌ Error Response:', response);
                enqueueSnackbar(response.message || 'Failed to create extra term', { variant: 'error' });
            }
        } catch (error) {
            console.error('❌ Error Details:', {
                name: error.name,
                message: error.message,
                status: error.response?.status,
                statusText: error.response?.statusText,
                data: error.response?.data
            });
            enqueueSnackbar(error.response?.data?.message || 'Failed to create extra term', { variant: 'error' });
        }
    };

    const handleStartDateChange = (newValue) => {
        const dateValue = newValue instanceof Date ? newValue : new Date(newValue);
        setStartDate(dateValue);
    };

    const handleEndDateChange = (newValue) => {
        const dateValue = newValue instanceof Date ? newValue : new Date(newValue);
        setEndDate(dateValue);
    };

    // Function to generate extra term name
    const generateExtraTermName = (term) => {
        return `Extra Term - ${term.grade} ${term.year}`;
    };

    return (
        <>
            <Divider sx={{mt: 4, mb: 2}}>Extra Terms</Divider>
            
            {formData.extraTerms?.length > 0 ? (
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Start Date</TableCell>
                                <TableCell>End Date</TableCell>
                                <TableCell>Registration Progress</TableCell>
                                <TableCell>Status</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {formData.extraTerms.map((extraTerm, index) => (
                                <TableRow key={index}>
                                    <TableCell>{format(new Date(extraTerm.startDate), 'dd/MM/yyyy HH:mm')}</TableCell>
                                    <TableCell>{format(new Date(extraTerm.endDate), 'dd/MM/yyyy HH:mm')}</TableCell>
                                    <TableCell>{`${extraTerm.approvedForm}/${extraTerm.maxNumberRegistration}`}</TableCell>
                                    <TableCell>
                                        <Box sx={{
                                            backgroundColor: getStatusColor(extraTerm.status),
                                            padding: '4px 12px',
                                            borderRadius: '12px',
                                            display: 'inline-block'
                                        }}>
                                            <Typography sx={{
                                                color: '#ffffff',
                                                fontWeight: 600,
                                                fontSize: '0.875rem'
                                            }}>
                                                {extraTerm.status}
                                            </Typography>
                                        </Box>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            ) : (
                <Typography variant="body1" color="text.secondary" textAlign="center">
                    No extra terms available
                </Typography>
            )}

            {/* Chỉ hiển thị nút "ADD EXTRA TERM" khi:
                1. Không có extra term nào, hoặc
                2. Tất cả extra term hiện có đều đã locked
            */}
            {!hasActiveExtraTerm && !extraTermForm.displayForm && (
                <Button
                    fullWidth
                    variant="contained"
                    onClick={() => setExtraTermForm(prev => ({ ...prev, displayForm: true }))}
                    sx={{
                        backgroundColor: '#07663a',
                        '&:hover': { backgroundColor: 'rgba(7, 102, 58, 0.85)' },
                        mt: 2
                    }}
                >
                    + ADD EXTRA TERM
                </Button>
            )}

            {/* Form tạo extra term */}
            {!hasActiveExtraTerm && extraTermForm.displayForm && (
                <Box sx={{ mt: 2, p: 3, border: '1px solid #e0e0e0', borderRadius: 2 }}>
                    <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
                        <Typography variant="h6">New Extra Term</Typography>
                        {/* Thêm nút đóng form */}
                        <IconButton 
                            onClick={() => setExtraTermForm(prev => ({ ...prev, displayForm: false }))}
                            size="small"
                        >
                            <Close />
                        </IconButton>
                    </Stack>
                    
                    <Stack spacing={3}>
                        <FormControl>
                            <FormLabel>Start Date</FormLabel>
                            <TextField
                                type="datetime-local"
                                value={extraTermForm.startDate || ''}
                                onChange={(e) => setExtraTermForm(prev => ({
                                    ...prev,
                                    startDate: e.target.value
                                }))}
                                fullWidth
                                InputLabelProps={{ shrink: true }}
                            />
                        </FormControl>

                        <FormControl>
                            <FormLabel>End Date</FormLabel>
                            <TextField
                                type="datetime-local"
                                value={extraTermForm.endDate || ''}
                                onChange={(e) => setExtraTermForm(prev => ({
                                    ...prev,
                                    endDate: e.target.value
                                }))}
                                fullWidth
                                InputLabelProps={{ shrink: true }}
                            />
                        </FormControl>

                        <Typography variant="body2" color="textSecondary">
                            Maximum Registration: {formData.maxNumberRegistration - formData.approvedForm} slots
                            <Tooltip title="This is the remaining slots from the main term">
                                <IconButton size="small">
                                    <Info fontSize="small" />
                                </IconButton>
                            </Tooltip>
                        </Typography>

                        <Button
                            fullWidth
                            variant="contained"
                            onClick={handleExtraTermSubmit}
                            sx={{
                                backgroundColor: '#07663a',
                                '&:hover': { backgroundColor: 'rgba(7, 102, 58, 0.85)' }
                            }}
                        >
                            CREATE EXTRA TERM
                        </Button>
                    </Stack>
                </Box>
            )}

            {/* Hiển thị thông báo khi đã có extra term active/inactive */}
            {hasActiveExtraTerm && (
                <Alert severity="info" sx={{ mt: 2 }}>
                    An active or upcoming extra term already exists. You can create a new extra term once the current one is locked.
                </Alert>
            )}
        </>
    );
} 