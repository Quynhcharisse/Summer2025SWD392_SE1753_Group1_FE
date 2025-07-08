import React, {useEffect, useState} from 'react';
import {Box, Divider, Paper, Typography} from '@mui/material';
import {LineChart} from '@mui/x-charts/LineChart';
import dayjs from 'dayjs';
import {getDailyTotal} from "@services/admissionService.js";

const AdmissionChart = () => {
    const [startDate, setStartDate] = useState(dayjs().subtract(6, 'day'));
    const [endDate, setEndDate] = useState(dayjs());
    const [chartData, setChartData] = useState({
        dates: [],
        amounts: [],
        totalAmount: 0
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchChartData = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await getDailyTotal();
            console.log('API Response:', response);

            if (response?.success && response.data?.dailyData) {
                const data = response.data.dailyData;
                console.log('Processing data:', data);

                const lastEntry = data[data.length - 1] || {totalAmount: 0};

                setChartData({
                    dates: data.map(item => item.date),
                    amounts: data.map(item => item.amount),
                    totalAmount: lastEntry.totalAmount
                });
            } else {
                console.error('Invalid response structure:', response);
                setError('Invalid data received from server');
            }
        } catch (error) {
            console.error('Error fetching chart data:', error);
            setError(error.message || 'Error fetching data');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchChartData();
    }, []);

    const formatCurrency = (value) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND',
            maximumFractionDigits: 0
        }).format(value || 0);
    };

    const formatYAxisValue = (value) => {
        if (value >= 1000000) {
            return `${(value / 1000000).toFixed(1)}M`;
        } else if (value >= 1000) {
            return `${(value / 1000).toFixed(0)}K`;
        }
        return value.toString();
    };

    return (
        <Paper sx={{p: 3, mb: 3, borderRadius: 2, boxShadow: '0 2px 4px rgba(0,0,0,0.1)'}}>
            <Box sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                mb: 3
            }}>
                <Typography variant="h6" sx={{
                    fontWeight: 'bold',
                    color: '#2c3e50'
                }}>
                    Total Transaction Amount
                </Typography>
                <Typography
                    variant="h6"
                    sx={{
                        color: '#3498db',
                        fontWeight: 'bold'
                    }}
                >
                    Total: {formatCurrency(chartData.totalAmount)}
                </Typography>
            </Box>

            <Divider sx={{mb: 3}}/>

            <Box sx={{
                width: '100%',
                height: 400,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: '#fff',
                borderRadius: 1,
                p: 2
            }}>
                {loading ? (
                    <Typography>Loading...</Typography>
                ) : error ? (
                    <Typography color="error">{error}</Typography>
                ) : chartData.dates.length > 0 ? (
                    <LineChart
                        xAxis={[{
                            data: chartData.dates,
                            scaleType: 'band',
                            tickLabelStyle: {
                                angle: 0,
                                textAnchor: 'middle',
                                fontSize: 12
                            }
                        }]}
                        yAxis={[{
                            min: 0,
                            max: Math.max(...chartData.amounts, 20000) + 5000,
                            tickNumber: 5,
                            valueFormatter: formatYAxisValue,
                            label: 'Amount (VND)'
                        }]}
                        series={[{
                            data: chartData.amounts,
                            area: true,
                            showMark: true,
                            color: '#3498db',
                            valueFormatter: formatCurrency,
                            label: 'Daily Transaction Amount'
                        }]}
                        height={400}
                        margin={{left: 70, right: 30, top: 50, bottom: 30}}
                        sx={{
                            '.MuiLineElement-root': {
                                strokeWidth: 2,
                            },
                            '.MuiAreaElement-root': {
                                fillOpacity: 0.1
                            },
                            '.MuiChartsAxis-line': {
                                stroke: '#e0e0e0'
                            },
                            '.MuiChartsAxis-tick': {
                                stroke: '#e0e0e0'
                            },
                            '.MuiChartsAxis-tickLabel': {
                                fill: '#666',
                                fontSize: '0.875rem'
                            },
                            '.MuiChartsAxis-label': {
                                fill: '#666',
                                fontSize: '0.875rem'
                            },
                            '.MuiChartsAxis-gridLine': {
                                stroke: '#f5f5f5'
                            }
                        }}
                    />
                ) : (
                    <Typography variant="body1" color="text.secondary">
                        No data to display
                    </Typography>
                )}
            </Box>
        </Paper>
    );
};

export default AdmissionChart;