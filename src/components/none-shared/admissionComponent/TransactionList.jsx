import React, {useEffect, useState} from 'react';
import {
    Box,
    Button,
    Container,
    InputAdornment,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TextField,
    Typography,
} from '@mui/material';
import {FileDownload, Search} from '@mui/icons-material';
import {exportTransactions, getTransactionList} from '@api/services/admissionService';
import {useSnackbar} from 'notistack';
import dayjs from 'dayjs';
import {formatVND} from '@/components/none-shared/formatVND';

export default function TransactionList() {
    const [transactions, setTransactions] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const {enqueueSnackbar} = useSnackbar();

    useEffect(() => {
        fetchTransactions();
    }, []);

    const fetchTransactions = async () => {
        try {
            const response = await getTransactionList();
            if (response.success) {
                setTransactions(response.data);
            } else {
                enqueueSnackbar(response.message || 'Failed to fetch transactions', {variant: 'error'});
            }
        } catch (error) {
//             console.error('Error fetching transactions:', error);
            enqueueSnackbar(error.response?.data?.message || 'Error fetching transactions', {variant: 'error'});
        }
    };

    const handleExport = async () => {
        try {
            const blob = await exportTransactions();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `transactions_${dayjs().format('YYYY-MM-DD')}.xlsx`;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);
        } catch (error) {
//             console.error('Error exporting transactions:', error);
            enqueueSnackbar(error.response?.data?.message || 'Error exporting transactions', {variant: 'error'});
        }
    };

    const filteredTransactions = transactions.filter(transaction =>
        transaction.txnRef?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        transaction.description?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <Container maxWidth="xl">
            <Box sx={{py: 3}}>
                <Box sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    mb: 3,
                    backgroundColor: '#f8f9fa',
                    padding: '20px',
                    borderRadius: '8px',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                }}>
                    <Typography
                        variant="h5"
                        component="h1"
                        sx={{
                            fontWeight: 600,
                            color: '#07663a',
                            fontSize: '1.5rem'
                        }}
                    >
                        Transaction Management
                    </Typography>
                    <Button
                        variant="contained"
                        startIcon={<FileDownload/>}
                        onClick={handleExport}
                        sx={{
                            backgroundColor: '#07663a',
                            '&:hover': {backgroundColor: '#05512e'},
                            textTransform: 'none',
                            fontWeight: 600,
                            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                            padding: '8px 24px'
                        }}
                    >
                        Export Excel
                    </Button>
                </Box>

                <Box sx={{mb: 3}}>
                    <TextField
                        fullWidth
                        placeholder="Search by invoice number or payment content..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <Search sx={{color: '#07663a'}}/>
                                </InputAdornment>
                            ),
                        }}
                        sx={{
                            bgcolor: 'white',
                            '& .MuiOutlinedInput-root': {
                                '& fieldset': {
                                    borderColor: '#e0e0e0',
                                },
                                '&:hover fieldset': {
                                    borderColor: '#07663a',
                                },
                                '&.Mui-focused fieldset': {
                                    borderColor: '#07663a',
                                },
                            },
                        }}
                    />
                </Box>

                <TableContainer
                    component={Paper}
                    sx={{
                        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                        borderRadius: '8px',
                        overflow: 'hidden'
                    }}
                >
                    <Table>
                        <TableHead>
                            <TableRow sx={{
                                bgcolor: '#07663a',
                            }}>
                                <TableCell align="center" sx={{fontWeight: 600, color: 'white'}}>No.</TableCell>
                                <TableCell align="center" sx={{fontWeight: 600, color: 'white'}}>Trace
                                    Number</TableCell>
                                <TableCell align="center" sx={{fontWeight: 600, color: 'white'}}>Invoice
                                    Number</TableCell>
                                <TableCell align="center" sx={{fontWeight: 600, color: 'white'}}>Bank</TableCell>
                                <TableCell align="center" sx={{fontWeight: 600, color: 'white'}}>Amount</TableCell>
                                <TableCell align="center" sx={{fontWeight: 600, color: 'white'}}>Created
                                    Date</TableCell>
                                <TableCell align="center" sx={{fontWeight: 600, color: 'white'}}>Payment
                                    Content</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {filteredTransactions.map((transaction, index) => (
                                <TableRow
                                    key={transaction.id || index}
                                    hover
                                    sx={{
                                        '&:nth-of-type(odd)': {
                                            backgroundColor: '#f8f9fa',
                                        },
                                        '&:hover': {
                                            backgroundColor: '#e8f5e9 !important',
                                        }
                                    }}
                                >
                                    <TableCell align="center">{index + 1}</TableCell>
                                    <TableCell align="center">{transaction.vnpTransactionNo}</TableCell>
                                    <TableCell align="center">{transaction.txnRef}</TableCell>
                                    <TableCell align="center">
                                        <Typography
                                            sx={{
                                                color: '#1a237e',
                                                fontWeight: 600,
                                                backgroundColor: 'rgba(26, 35, 126, 0.1)',
                                                padding: '4px 12px',
                                                borderRadius: '16px',
                                                display: 'inline-block'
                                            }}
                                        >
                                            NCB
                                        </Typography>
                                    </TableCell>
                                    <TableCell align="right" sx={{color: '#07663a', fontWeight: 600}}>
                                        {formatVND(transaction.amount)}
                                    </TableCell>
                                    <TableCell align="center">
                                        {dayjs(transaction.paymentDate).format('HH:mm DD/MM/YYYY')}
                                    </TableCell>
                                    <TableCell align="left">{transaction.description}</TableCell>
                                </TableRow>
                            ))}
                            {filteredTransactions.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={7} align="center" sx={{py: 3}}>
                                        <Typography variant="body1" color="text.secondary">
                                            No transactions found
                                        </Typography>
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Box>
        </Container>
    );
}