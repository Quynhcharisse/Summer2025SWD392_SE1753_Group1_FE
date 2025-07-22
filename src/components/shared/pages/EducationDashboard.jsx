import React, { useEffect, useState } from "react";
import { PieChart } from "@mui/x-charts/PieChart";
import { BarChart } from "@mui/x-charts/BarChart";
import {
  Card,
  CardContent,
  Typography,
  CircularProgress,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Box,
  Stack,
  Alert,
} from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import {
  getClassReportByYear,
  getEventParticipantsStats,
  getSchoolYears,
} from "@/api/services/classService";

const COLORS = ["#3b82f6", "#fbbf24", "#ef4444"]; // SEED, BUD, LEAF

export default function EducationDashboard() {
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(false);
  const [year, setYear] = useState("");
  const [years, setYears] = useState([]);
  const [barData, setBarData] = useState([]);
  const [loadingBar, setLoadingBar] = useState(false);

  // Ngày mặc định (ISO format)
  const [startDate, setStartDate] = useState(dayjs().subtract(7, "day"));
  const [endDate, setEndDate] = useState(dayjs());
  const [dateError, setDateError] = useState("");

  function isCurrentYear(yearStr) {
    if (!yearStr) return false;
    const currentYear = new Date().getFullYear();
    // Tách bởi - hoặc –, loại bỏ khoảng trắng
    const years = yearStr.replace(/\s/g, "").split(/[-–]/);
    // So sánh cả hai năm trong chuỗi năm học
    return years.some((y) => parseInt(y) === currentYear);
  }

  useEffect(() => {
    getSchoolYears().then((res) => {
      const yearArr = res.data?.data || [];
      setYears(yearArr);
      if (yearArr.length > 0) {
        // Tìm năm học chứa năm hiện tại
        const found = yearArr.find((y) => isCurrentYear(y));
        setYear(found || yearArr[0]);
      }
    });
  }, []);
  const getStartYear = (yearStr) => {
    if (!yearStr) return "";
    // Tách bởi - hoặc –
    return yearStr.replace(/\s/g, "").split(/[-–]/)[0];
  };
  useEffect(() => {
    if (!year) return;
    setLoading(true);
    getClassReportByYear(getStartYear(year))
      .then((res) => setReport(res.data?.data))
      .finally(() => setLoading(false));
  }, [year]);

  // Validate ngày và fetch lại dữ liệu khi ngày hợp lệ
  useEffect(() => {
    if (!startDate || !endDate) return;
    if (startDate.isSame(endDate) || startDate.isAfter(endDate)) {
      setDateError("Start Date must be before End Date");
      return;
    }
    setDateError("");
    setLoadingBar(true);
    getEventParticipantsStats({
      startDate: startDate.format("YYYY-MM-DD"),
      endDate: endDate.format("YYYY-MM-DD"),
    })
      .then((res) => setBarData(res.data?.data || []))
      .finally(() => setLoadingBar(false));
  }, [startDate, endDate]);

  // PieChart data
  let chartData = [];
  if (report?.byGrade) {
    chartData = Object.entries(report.byGrade)
      .filter(([_, value]) => value > 0)
      .map(([key, value], idx) => ({
        id: key,
        value,
        label: key,
        color: COLORS[idx] || COLORS[0],
      }));
  }
  const total = chartData.reduce((sum, d) => sum + d.value, 0);

  // BarChart data
  const hasBarData = barData && barData.length > 0;
  const eventNames = barData.map((d) => d.eventName);
  const studentCounts = barData.map((d) => d.studentCount);
  const maxStudent = Math.max(...studentCounts, 5);

  return (
    <div>
      <div className="bg-gradient-to-r from-green-600 to-teal-600 text-white p-8 rounded-2xl shadow-lg mb-6">
        <h1 className="text-2xl font-bold">Education Dashboard</h1>
      </div>
      <Stack
        direction={{ xs: "column", md: "row" }}
        gap={4}
        sx={{
          maxWidth: 1100,
          mx: "auto",
          alignItems: "stretch",
        }}
      >
        {/* Pie Chart Card */}
        <Card
          sx={{
            flex: 1,
            minWidth: 0,
            minHeight: 420,
            display: "flex",
            flexDirection: "column",
          }}
        >
          <CardContent
            sx={{ flexGrow: 1, display: "flex", flexDirection: "column" }}
          >
            <Box display="flex" alignItems="center" gap={2} mb={2}>
              <Typography variant="h6" component="span">
                Number of Classes by Grade
              </Typography>
              <FormControl size="small" sx={{ minWidth: 100 }}>
                <InputLabel id="school-year-label">Year</InputLabel>
                <Select
                  labelId="school-year-label"
                  value={year}
                  label="Year"
                  onChange={(e) => setYear(e.target.value)}
                >
                  {years.map((y) => (
                    <MenuItem key={y} value={y}>
                      {y}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
            {loading ? (
              <Box display="flex" justifyContent="center" py={5}>
                <CircularProgress color="success" />
              </Box>
            ) : total === 0 ? (
              <Typography color="text.secondary" align="center">
                No classes created in this year.
              </Typography>
            ) : (
              <Box sx={{ width: "100%", height: 320 }}>
                <PieChart
                  series={[
                    {
                      data: chartData,
                      innerRadius: 50,
                      outerRadius: 100,
                      paddingAngle: 3,
                      cornerRadius: 5,
                      colors: chartData.map((d) => d.color),
                    },
                  ]}
                  width={undefined}
                  height={300}
                  slotProps={{
                    legend: {
                      direction: "row",
                      position: { vertical: "bottom", horizontal: "middle" },
                    },
                  }}
                />
              </Box>
            )}
          </CardContent>
        </Card>

        {/* Bar Chart Card */}
        <Card
          sx={{
            flex: 1,
            minWidth: 0,
            minHeight: 420,
            display: "flex",
            flexDirection: "column",
          }}
        >
          <CardContent
            sx={{ flexGrow: 1, display: "flex", flexDirection: "column" }}
          >
            {/* Tiêu đề */}
            <Typography variant="h6" sx={{ mb: 1 }}>
              Students Participation by Event
            </Typography>
            {/* Hàng input ngày */}
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <Box display="flex" gap={2} mb={2}>
                <DatePicker
                  label="Start Date"
                  value={startDate}
                  onChange={setStartDate}
                  maxDate={endDate ? endDate.subtract(1, "day") : undefined}
                  format="DD/MM/YYYY" // <-- Đổi định dạng ở đây
                  slotProps={{
                    textField: {
                      size: "small",
                      fullWidth: false,
                      sx: { minWidth: 150 },
                    },
                  }}
                />
                <DatePicker
                  label="End Date"
                  value={endDate}
                  onChange={setEndDate}
                  minDate={startDate ? startDate.add(1, "day") : undefined}
                  format="DD/MM/YYYY" // <-- Đổi định dạng ở đây
                  slotProps={{
                    textField: {
                      size: "small",
                      fullWidth: false,
                      sx: { minWidth: 150 },
                    },
                  }}
                />
              </Box>
            </LocalizationProvider>
            {/* Hiển thị lỗi nếu nhập sai */}
            {dateError && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {dateError}
              </Alert>
            )}
            {loadingBar ? (
              <Box display="flex" justifyContent="center" py={6}>
                <CircularProgress />
              </Box>
            ) : hasBarData ? (
              <Box sx={{ width: "100%", height: 320 }}>
                <BarChart
                  xAxis={[
                    {
                      id: "eventName",
                      data: eventNames,
                      label: "Event",
                      scaleType: "band",
                      tickLabelStyle: { fontSize: 14 },
                    },
                  ]}
                  yAxis={[
                    {
                      label: "Student Count",
                      tickLabelStyle: { fontSize: 13 },
                      min: 0,
                      max: maxStudent,
                      ticks: Array.from(
                        { length: maxStudent + 1 },
                        (_, i) => i
                      ),
                    },
                  ]}
                  series={[
                    {
                      data: studentCounts,
                      label: "Number of Students",
                      color: "#2563eb",
                    },
                  ]}
                  width={undefined}
                  height={300}
                  grid={{ vertical: true, horizontal: true }}
                  sx={{
                    ".MuiChartsLegend-root": { mt: 2 },
                    ".MuiBarElement-root": { rx: 5 },
                  }}
                />
              </Box>
            ) : (
              <Typography color="text.secondary" align="center" sx={{ my: 6 }}>
                No data found for selected date range.
              </Typography>
            )}
          </CardContent>
        </Card>
      </Stack>
    </div>
  );
}
