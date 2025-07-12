import { useParams, useNavigate } from 'react-router-dom';
import { useEventStudents } from '@hooks/useEvent';
import {
  Box,
  Typography,
  CircularProgress,
  Alert,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Avatar,
  TextField
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import DownloadIcon from '@mui/icons-material/Download';
import { useState } from 'react';
import { exportEventParticipants } from '@api/services/eventService';

const EventChildExport = () => {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const { data, isLoading, error } = useEventStudents(eventId);
  const [search, setSearch] = useState("");
  const [exporting, setExporting] = useState(false);

  // Lọc danh sách học sinh theo tên (không phân biệt hoa thường)
  const students = data?.data || [];
  const filteredStudents = students.filter(student =>
    student.name?.toLowerCase().includes(search.trim().toLowerCase())
  );

  // Hàm export file Excel sử dụng eventService
  const handleExport = async () => {
    setExporting(true);
    try {
      const response = await exportEventParticipants(eventId);
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `event_${eventId}_students.xlsx`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      alert('Export failed!');
    } finally {
      setExporting(false);
    }
  };

  return (
    <Box sx={{ p: { xs: 1, md: 4 } }}>
      <Button startIcon={<ArrowBackIcon />} onClick={() => navigate(-1)} sx={{ mb: 3 }}>
        Back
      </Button>
      <Typography variant="h4" sx={{ fontWeight: 700, color: '#1976d2', mb: 2 }}>
        Students Registered for Event #{eventId}
      </Typography>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2, flexWrap: 'wrap' }}>
        <TextField
          size="small"
          label="Search by name"
          variant="outlined"
          value={search}
          onChange={e => setSearch(e.target.value)}
          sx={{ minWidth: 260 }}
        />
        <Button
          variant="contained"
          color="success"
          startIcon={<DownloadIcon />}
          onClick={handleExport}
          disabled={exporting}
          sx={{ minWidth: 140, fontWeight: 600 }}
        >
          {exporting ? 'Exporting...' : 'Export to Excel'}
        </Button>
        <Box sx={{ flexGrow: 1 }} />
        <Typography variant="body2" sx={{ color: '#1976d2', fontWeight: 600 }}>
          Total students: {filteredStudents.length}
        </Typography>
      </Box>
      {isLoading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
          <CircularProgress />
        </Box>
      ) : error ? (
        <Alert severity="error">Failed to load students.</Alert>
      ) : filteredStudents.length > 0 ? (
        <TableContainer component={Paper} sx={{ borderRadius: 3, boxShadow: '0 4px 24px rgba(25,118,210,0.08)', border: '1.5px solid #e3f2fd', overflow: 'hidden' }}>
          <Table>
            <TableHead>
              <TableRow sx={{ background: 'linear-gradient(90deg, #e3f2fd 60%, #fff 100%)' }}>
                <TableCell align="center" sx={{ color: '#1976d2', fontWeight: 'bold', fontSize: '1.08rem', py: 2.5 }}>#</TableCell>
                <TableCell align="center" sx={{ color: '#1976d2', fontWeight: 'bold', fontSize: '1.08rem', py: 2.5 }}>Name</TableCell>
                <TableCell align="center" sx={{ color: '#1976d2', fontWeight: 'bold', fontSize: '1.08rem', py: 2.5 }}>Gender</TableCell>
                <TableCell align="center" sx={{ color: '#1976d2', fontWeight: 'bold', fontSize: '1.08rem', py: 2.5 }}>Date of Birth</TableCell>
                <TableCell align="center" sx={{ color: '#1976d2', fontWeight: 'bold', fontSize: '1.08rem', py: 2.5 }}>Place of Birth</TableCell>
                <TableCell align="center" sx={{ color: '#1976d2', fontWeight: 'bold', fontSize: '1.08rem', py: 2.5 }}>Parent Name</TableCell>
                <TableCell align="center" sx={{ color: '#1976d2', fontWeight: 'bold', fontSize: '1.08rem', py: 2.5 }}>Parent Phone</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredStudents.map((student, idx) => (
                <TableRow
                  key={student.id}
                  sx={{
                    transition: 'background 0.2s',
                    '&:hover': { backgroundColor: '#f1f8fd' },
                    '&:last-child td, &:last-child th': { borderBottom: 0 },
                  }}
                >
                  <TableCell align="center" sx={{ fontWeight: 600 }}>{idx + 1}</TableCell>
                  <TableCell align="center" sx={{ fontWeight: 600, color: '#1976d2' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, justifyContent: 'center' }}>
                      <Avatar src={student.avatarUrl || undefined} alt={student.name} sx={{ width: 32, height: 32, bgcolor: '#e3f2fd', color: '#1976d2', fontWeight: 700, fontSize: 18 }}>
                        {student.name?.[0] || '?'}
                      </Avatar>
                      {student.name}
                    </Box>
                  </TableCell>
                  <TableCell align="center">{student.gender === 'male' ? 'Male' : student.gender === 'female' ? 'Female' : '-'}</TableCell>
                  <TableCell align="center">{student.dateOfBirth || '-'}</TableCell>
                  <TableCell align="center">{student.placeOfBirth || '-'}</TableCell>
                  <TableCell align="center">{student.parentName || '-'}</TableCell>
                  <TableCell align="center">{student.parentPhoneNumber || '-'}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      ) : (
        <Typography sx={{ textAlign: 'center', p: 2 }}>
          No students registered for this event.
        </Typography>
      )}
    </Box>
  );
};

export default EventChildExport;
