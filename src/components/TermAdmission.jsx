import React, { useState, useEffect } from 'react';
import { Dialog, DialogActions, DialogTitle, AppBar, Toolbar, IconButton, Typography, Box, Stack, TextField, Button } from '@mui/material';
import { Close } from '@mui/icons-material';
import { useSnackbar } from 'notistack';
import { format } from 'date-fns';

function RenderDetailPopUp({ handleClosePopUp, isPopUpOpen, selectedTerm, GetTerm, mode }) {

    const isViewMode = mode === 'view'; // TRUE nếu đang xem

    const { enqueueSnackbar } = useSnackbar();

    const [formData, setFormData] = useState({
        grade: null,
        startDate: null,
        endDate: null,
        maxNumberRegistration: 0,
        reservationFee: 0,
        serviceFee: 0,
        uniformFee: 0,
        learningMaterialFee: 0,
        facilityFee: 0
    });

    //Đồng bộ formData từ selectedTerm
    useEffect(() => {
        console.log("selectedTerm: ", selectedTerm);
        if (selectedTerm) {
            setFormData({
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
                facilityFee: selectedTerm.facilityFee ?? 0
            });
        }
    }, [selectedTerm]);


    const handleUpdateTerm = async () => {
        try {
            const response = await updateTerm(
                selectedTerm.id,
                formData.grade,
                formData.startDate,
                formData.endDate,
                formData.maxNumberRegistration, // Sử dụng giá trị mới
                selectedTerm.reservationFee, // Giữ nguyên giá trị cũ
                selectedTerm.serviceFee, // Giữ nguyên giá trị cũ
                selectedTerm.uniformFee, // Giữ nguyên giá trị cũ
                selectedTerm.learningMaterialFee, // Giữ nguyên giá trị cũ
                selectedTerm.facilityFee // Giữ nguyên giá trị cũ
            );
            enqueueSnackbar("Term updated successfully!", { variant: "success" });
            handleClosePopUp();
            GetTerm();
        } catch (error) {
            enqueueSnackbar("Failed to update term", { variant: "error" });
        }
    };

    // hàm cập nhật liên tục, onChange sẽ đc gọi, môix khi có thông tin thay đổi
    function HandleOnChange(e) {
        console.log('e.target.name: ', e.target.name)
        console.log('e.target.value: ', e.target.value)
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }

    return (
        <Dialog
            fullScreen
            open={isPopUpOpen}
            onClose={handleClosePopUp}
        >
            <AppBar sx={{ position: 'relative', backgroundColor: '#07663a' }}>
                <Toolbar>
                    <IconButton edge="start"
                        color="inherit"
                        onClick={handleClosePopUp}
                        aria-label="close">
                        <Close />
                    </IconButton>
                    <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
                        Admission Term Detail
                    </Typography>
                </Toolbar>
            </AppBar>

            <Box p={4}>
                <Typography
                    variant='subtitle1'
                    sx={{ mb: 2, fontWeight: 'bold', fontSize: "2.5rem", textAlign: "center", color: '#07663a' }}
                >
                    Term Information
                </Typography>

                <Stack spacing={3}>
                    <Stack>
                        <TextField
                            label="Start Date"
                            type="datetime-local"
                            required
                            fullWidth
                            name="startDate"
                            value={formData.startDate}
                            onChange={(e) => HandleOnChange(e)}
                            InputProps={{ readOnly: isViewMode }}
                        />
                    </Stack>
                    <Stack>
                        <TextField
                            label="End Date"
                            type="datetime-local"
                            name="endDate"
                            value={formData.endDate}
                            onChange={(e) => HandleOnChange(e)}
                            InputProps={{ readOnly: isViewMode }}
                            required
                            fullWidth
                        />
                    </Stack>

                    <Stack>
                        <TextField
                            label="Max Registrations"
                            type="number"
                            required
                            fullWidth
                            name="maxNumberRegistration"
                            value={formData.maxNumberRegistration}
                            onChange={(e) => HandleOnChange(e)}
                            InputProps={{ readOnly: isViewMode }}
                        />
                    </Stack>

                    <Typography fontWeight="bold" sx={{ mt: 1, mb: 0, color: '#07663a' }}>Fees</Typography>

                    <Stack>
                        <TextField label="Reservation Fee"
                            type="number"
                            name="reservationFee"
                            value={formData.reservationFee}
                            InputProps={{ readOnly: true }}
                            required
                            fullWidth
                        />
                    </Stack>

                    <Stack>
                        <TextField label="Service Fee"
                            type="number"
                            name="serviceFee"
                            value={formData.serviceFee}
                            InputProps={{ readOnly: true }}
                            required
                            fullWidth
                        />
                    </Stack>

                    <Stack>
                        <TextField label="Uniform Fee"
                            type="number"
                            name="uniformFee"
                            value={formData.uniformFee}
                            InputProps={{ readOnly: true }}
                            required
                            fullWidth
                        />
                    </Stack>

                    <Stack>
                        <TextField label="Learning Material Fee"
                            type="number"
                            name="learningMaterialFee"
                            value={formData.learningMaterialFee}
                            InputProps={{ readOnly: true }}
                            required
                            fullWidth
                        />
                    </Stack>

                    <Stack>
                        <TextField label="Facility Fee"
                            type="number"
                            name="facilityFee"
                            value={formData.facilityFee}
                            InputProps={{ readOnly: true }}
                            required
                            fullWidth
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

                {/* Chỉ hiện nếu không phải chế độ view */}
                {!isViewMode && (
                    <Button
                        sx={{ minWidth: 120, height: '44px' }}
                        variant="contained"
                        color="success"
                        onClick={handleUpdateTerm}
                    >
                        Update
                    </Button>
                )}

            </DialogActions>

        </Dialog>

    )
}

export default RenderDetailPopUp; 