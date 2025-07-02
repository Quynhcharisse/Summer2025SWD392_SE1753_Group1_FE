import { Backdrop, CircularProgress, Typography } from '@mui/material';

export default function LoadingOverlay({ open, message }) {
    return (
        <Backdrop
            sx={{
                color: '#fff',
                zIndex: (theme) => theme.zIndex.drawer + 1,
                flexDirection: 'column',
                gap: 2,
                backgroundColor: 'rgba(0, 0, 0, 0.8)'
            }}
            open={open}
        >
            <CircularProgress color="inherit" size={60} />
            <Typography variant="h6" sx={{ textAlign: 'center' }}>
                {message || 'Loading...'}
            </Typography>
        </Backdrop>
    );
} 