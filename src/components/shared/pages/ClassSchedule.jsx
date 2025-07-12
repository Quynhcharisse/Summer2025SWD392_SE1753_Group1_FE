import { useEffect, useState } from "react";
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
  Avatar,
  Button,
  Chip,
  IconButton,
} from "@mui/material";
import { getChildren } from "@api/services/parentService";
import { useNavigate } from "react-router-dom";
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import MaleIcon from '@mui/icons-material/Male';
import FemaleIcon from '@mui/icons-material/Female';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { useMediaQuery } from "@mui/material";

const ClassSchedule = () => {
  const [children, setChildren] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const isMobile = useMediaQuery('(max-width:600px)');

  useEffect(() => {
    const fetchChildren = async () => {
      setLoading(true);
      setError("");
      try {
        const data = await getChildren();
        setChildren(Array.isArray(data) ? data : data.data || []);
      } catch (err) {
        setError("Failed to load children.");
      } finally {
        setLoading(false);
      }
    };
    fetchChildren();
  }, []);

  return (
    <Box sx={{ p: { xs: 1, md: 4 }, maxWidth: 1100, mx: "auto" }}>
      <Typography variant="h4" sx={{ fontWeight: 800, color: "#1976d2", mb: 3, letterSpacing: 1 }}>
        Children List
      </Typography>
      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", p: 3 }}>
          <CircularProgress />
        </Box>
      ) : error ? (
        <Alert severity="error">{error}</Alert>
      ) : (
        <TableContainer
          component={Paper}
          sx={{
            borderRadius: 4,
            background: '#fff',
            boxShadow: "0 8px 32px rgba(25,118,210,0.10)",
            border: "none",
            overflow: "auto",
            maxHeight: 600,
            p: { xs: 0, md: 2 },
          }}
        >
          <Table stickyHeader sx={{ minWidth: 800, borderCollapse: 'separate', borderSpacing: 0 }}>
            <TableHead>
              <TableRow sx={{ height: 64, boxShadow: '0 2px 8px rgba(25,118,210,0.10)', background: '#fff' }}>
                <TableCell align="center" sx={{ color: "#1976d2", fontWeight: 900, fontSize: 18, background: '#fff', position: 'sticky', top: 0, zIndex: 2, borderBottom: '2px solid #e3f2fd', boxShadow: '0 2px 8px rgba(25,118,210,0.04)' }}>#</TableCell>
                <TableCell align="center" sx={{ color: "#1976d2", fontWeight: 900, fontSize: 18, background: '#fff', position: 'sticky', top: 0, zIndex: 2, borderBottom: '2px solid #e3f2fd', boxShadow: '0 2px 8px rgba(25,118,210,0.04)' }}>Profile</TableCell>
                <TableCell align="center" sx={{ color: "#1976d2", fontWeight: 900, fontSize: 18, background: '#fff', position: 'sticky', top: 0, zIndex: 2, borderBottom: '2px solid #e3f2fd', boxShadow: '0 2px 8px rgba(25,118,210,0.04)' }}>Name</TableCell>
                {!isMobile && <TableCell align="center" sx={{ color: "#1976d2", fontWeight: 900, fontSize: 18, background: '#fff', position: 'sticky', top: 0, zIndex: 2, borderBottom: '2px solid #e3f2fd', boxShadow: '0 2px 8px rgba(25,118,210,0.04)' }}>Gender</TableCell>}
                {!isMobile && <TableCell align="center" sx={{ color: "#1976d2", fontWeight: 900, fontSize: 18, background: '#fff', position: 'sticky', top: 0, zIndex: 2, borderBottom: '2px solid #e3f2fd', boxShadow: '0 2px 8px rgba(25,118,210,0.04)' }}>Date of Birth</TableCell>}
                {!isMobile && <TableCell align="center" sx={{ color: "#1976d2", fontWeight: 900, fontSize: 18, background: '#fff', position: 'sticky', top: 0, zIndex: 2, borderBottom: '2px solid #e3f2fd', boxShadow: '0 2px 8px rgba(25,118,210,0.04)' }}>Place of Birth</TableCell>}
                <TableCell align="center" sx={{ color: "#1976d2", fontWeight: 900, fontSize: 18, background: '#fff', position: 'sticky', top: 0, zIndex: 2, borderBottom: '2px solid #e3f2fd', boxShadow: '0 2px 8px rgba(25,118,210,0.04)' }}>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {children.map((child, idx) => (
                <TableRow
                  key={child.id}
                  sx={{
                    transition: "all 0.2s",
                    height: 72,
                    borderBottom: '1.5px solid #e3f2fd',
                    '&:hover': {
                      backgroundColor: "#f5faff",
                      boxShadow: "0 4px 16px rgba(25,118,210,0.10)",
                      transform: 'translateY(-2px) scale(1.01)',
                    },
                  }}
                >
                  <TableCell align="center" sx={{ verticalAlign: 'middle', fontWeight: 700, fontSize: 16 }}>{idx + 1}</TableCell>
                  <TableCell align="center" sx={{ verticalAlign: 'middle' }}>
                    <Avatar
                      src={child.profileImage}
                      alt={child.name}
                      sx={{ width: 48, height: 48, bgcolor: "#e3f2fd", color: "#1976d2", fontWeight: 900, border: '3px solid #1976d2', mx: 'auto', fontSize: 24, boxShadow: '0 2px 8px rgba(25,118,210,0.10)' }}
                    >
                      {(!child.profileImage && child.name?.[0]) || "?"}
                    </Avatar>
                  </TableCell>
                  <TableCell align="center" sx={{ verticalAlign: 'middle', fontWeight: 600, fontSize: 16 }}>{child.name}</TableCell>
                  {!isMobile && <TableCell align="center" sx={{ verticalAlign: 'middle', fontSize: 15 }}>
                    {child.gender === "Male" && (
                      <Chip icon={<MaleIcon sx={{ color: '#1976d2' }} />} label="Male" color="primary" variant="outlined" />
                    )}
                    {child.gender === "Female" && (
                      <Chip icon={<FemaleIcon sx={{ color: '#e91e63' }} />} label="Female" color="secondary" variant="outlined" />
                    )}
                    {!child.gender && "-"}
                  </TableCell>}
                  {!isMobile && <TableCell align="center" sx={{ verticalAlign: 'middle', fontSize: 15 }}>{child.dateOfBirth || "-"}</TableCell>}
                  {!isMobile && <TableCell align="center" sx={{ verticalAlign: 'middle', fontSize: 15 }}>{child.placeOfBirth || "-"}</TableCell>}
                  <TableCell align="center" sx={{ verticalAlign: 'middle' }}>
                    <Button
                      variant="contained"
                      color="primary"
                      size="medium"
                      startIcon={<InfoOutlinedIcon />}
                      sx={{
                        borderRadius: 3,
                        fontWeight: 700,
                        px: 2.5,
                        py: 1,
                        boxShadow: '0 2px 8px rgba(25,118,210,0.10)',
                        textTransform: 'none',
                        fontSize: 15,
                        transition: 'background 0.2s, transform 0.2s',
                        '&:hover': {
                          background: 'linear-gradient(90deg, #1565c0 60%, #1976d2 100%)',
                          transform: 'scale(1.05)',
                        },
                      }}
                      onClick={() => navigate(`/user/parent/class-detail/${child.id}`)}
                    >
                      View Class Info
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
};

export default ClassSchedule;
