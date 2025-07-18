import {useLocation, useNavigate} from "react-router-dom";
import {CheckCircleIcon} from "lucide-react";
import CancelIcon from '@mui/icons-material/Cancel';
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty';
import HomeIcon from '@mui/icons-material/Home';
import {Box, Button, Divider, Paper, Stack, Typography, Zoom} from "@mui/material";
import {useEffect, useRef} from "react";
import {createTransaction} from "@services/parentService.js";

function formatMoney(amount, s = "0 VND") {
    if (!amount) return;
    return amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + " VND";
}

export default function Payment() {
    const location = useLocation();
    const navigate = useNavigate();

    const amount = new URLSearchParams(location.search).get("vnp_Amount")
    const description = new URLSearchParams(location.search).get("vnp_OrderInfo")
    const paymentDate = new URLSearchParams(location.search).get("vnp_PayDate")
    const transactionNo = new URLSearchParams(location.search).get("vnp_TransactionNo")
    const txnRef = new URLSearchParams(location.search).get("vnp_TxnRef")
    const responseCode = new URLSearchParams(location.search).get("vnp_ResponseCode")

    let amountInt = 0;
    if (amount) amountInt = parseInt(amount) / 100;

    let status, statusColor, StatusIcon, note;
    if (responseCode === "00") {
        status = "Thanh toán thành công";
        statusColor = "#005AA9";
        StatusIcon = CheckCircleIcon;
        note = "Cảm ơn bạn đã thanh toán!";
    } else if (responseCode) {
        status = "Thanh toán thất bại";
        statusColor = "#ff424f";
        StatusIcon = CancelIcon;
        note = "Giao dịch của bạn chưa hoàn thành.";
    } else {
        status = "Đang xử lý";
        statusColor = "#ff9800";
        StatusIcon = HourglassEmptyIcon;
        note = "Giao dịch của bạn đang được xử lý.";
    }

    const called = useRef(false);

    useEffect(() => {
        if (called.current) return;
        called.current = true;

        async function CreateTransaction() {
            const formId = localStorage.getItem("form")
            if (formId) {
                return await createTransaction(parseInt(formId), description, transactionNo, responseCode)
            }
        }

        CreateTransaction().then(res => {
            if (res && res.data.success) {
                localStorage.removeItem("form")
            }
        })

    }, [])

    const handleBackHome = () => {
        navigate('/user/parent/dashboard');
    };

    return (
        <Box sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "flex-start",
            minHeight: "100vh",
            background: "linear-gradient(135deg, #f4fafe 0%, #e6f7ff 100%)",
            py: 8,
            px: 2
        }}>
            <Zoom in={true} style={{transitionDelay: '100ms'}}>
                <Paper
                    elevation={3}
                    sx={{
                        p: {xs: 3, sm: 5},
                        borderRadius: 4,
                        minWidth: {xs: 300, sm: 400},
                        maxWidth: 500,
                        background: "#fff",
                        boxShadow: "0 8px 32px 0 rgba(0, 90, 169, 0.08)",
                        textAlign: "center",
                        transition: "transform 0.2s ease-in-out",
                        "&:hover": {
                            transform: "translateY(-4px)",
                        }
                    }}
                >
                    <Stack direction="column" justifyContent="center" alignItems="center" spacing={2} mb={3}>
                        <img
                            alt="VNPay"
                            src="/vnpay.webp"
                            width={100}
                            height={50}
                        />
                        <Typography variant="h5" fontWeight={700} sx={{color: "#005AA9"}}>
                            Kết quả thanh toán
                        </Typography>
                    </Stack>

                    <Stack direction="row" justifyContent="center" alignItems="center" spacing={2} mb={3}>
                        <Typography variant="h6" fontWeight={700} sx={{color: statusColor, mb: 1}}>
                            {status}
                        </Typography>

                        <StatusIcon
                            sx={{
                                fill: statusColor,
                                fontSize: 64,
                                mb: 2,
                                animation: responseCode === "00" ? "pulse 2s infinite" : "none",
                                "@keyframes pulse": {
                                    "0%": {transform: "scale(1)"},
                                    "50%": {transform: "scale(1.1)"},
                                    "100%": {transform: "scale(1)"}
                                }
                            }}/>
                    </Stack>


                    <Typography variant="body1" sx={{color: "#666", mb: 3}}>
                        {note}
                    </Typography>

                    <Divider sx={{mb: 3}}/>

                    <Typography
                        variant="subtitle1"
                        fontWeight={600}
                        sx={{color: "#005AA9", mb: 2}}
                    >
                        Chi tiết giao dịch
                    </Typography>

                    <Stack spacing={2} sx={{mb: 4}}>
                        <Box sx={{background: "#f8f9fa", p: 2, borderRadius: 2}}>
                            <Typography variant="body2" color="text.secondary">Số tiền</Typography>
                            <Typography variant="h6" sx={{color: "#005AA9", fontWeight: 700}}>
                                {formatMoney(amountInt)}
                            </Typography>
                        </Box>

                        <Stack spacing={1.5} sx={{px: 2}}>
                            <Box>
                                <Typography variant="body2" color="text.secondary">Nội dung thanh toán</Typography>
                                <Typography variant="body1" fontWeight={500}>{description}</Typography>
                            </Box>
                            <Box>
                                <Typography variant="body2" color="text.secondary">Thời gian</Typography>
                                <Typography variant="body1" fontWeight={500}>{paymentDate}</Typography>
                            </Box>
                            <Box>
                                <Typography variant="body2" color="text.secondary">Mã giao dịch VNPay</Typography>
                                <Typography variant="body1" fontWeight={500}>{transactionNo}</Typography>
                            </Box>
                            <Box>
                                <Typography variant="body2" color="text.secondary">Mã tham chiếu</Typography>
                                <Typography variant="body1" fontWeight={500}>{txnRef}</Typography>
                            </Box>
                        </Stack>
                    </Stack>

                    <Button
                        variant="contained"
                        startIcon={<HomeIcon/>}
                        onClick={handleBackHome}
                        sx={{
                            bgcolor: "#005AA9",
                            "&:hover": {
                                bgcolor: "#004986",
                                transition: "background-color 0.2s"
                            },
                            mb: 3
                        }}
                    >
                        Về trang chủ
                    </Button>

                    <Divider sx={{mb: 2}}/>

                    <Typography variant="caption" sx={{color: "#888", display: "block"}}>
                        Biên lai này được tạo bởi VNPay - để được hỗ trợ, vui lòng liên hệ{" "}
                        <a
                            href="https://vnpay.vn"
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{
                                color: "#005AA9",
                                textDecoration: "none",
                                "&:hover": {
                                    textDecoration: "underline"
                                }
                            }}
                        >
                            VNPay.vn
                        </a>
                    </Typography>
                </Paper>
            </Zoom>
        </Box>
    );
}