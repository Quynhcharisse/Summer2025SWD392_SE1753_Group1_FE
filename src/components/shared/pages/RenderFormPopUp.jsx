import React, { useState } from "react";
import {
  Dialog, AppBar, Toolbar, IconButton, Typography, Box, Stack, Button,
  FormControl, InputLabel, Select, MenuItem, TextField, FormLabel, RadioGroup, FormControlLabel, Radio
} from "@mui/material";
import { CloudUpload, Close } from "@mui/icons-material";
import dayjs from "dayjs";
import axios from "axios";
import { enqueueSnackbar } from "notistack";

// Hàm xử lý upload ảnh lên Cloudinary
async function handleUploadImage(uploadedFile, setImageLink) {
  const makeUpload = async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "pes_swd");
    formData.append("api_key", "837117616828593");
    const res = await axios.post("https://api.cloudinary.com/v1_1/dbrfnkrbh/image/upload", formData, {
      headers: { "Content-Type": "multipart/form-data" }
    });
    return res;
  };
  try {
    const [profileRes, houseRes, birthRes, commitRes] = await Promise.all([
      makeUpload(uploadedFile.profile),
      makeUpload(uploadedFile.houseAddress),
      makeUpload(uploadedFile.birth),
      makeUpload(uploadedFile.commit)
    ]);
    if ([profileRes, houseRes, birthRes, commitRes].every(r => r && r.status === 200)) {
      const result = {
        profileLink: profileRes.data.url,
        houseAddressLink: houseRes.data.url,
        birthLink: birthRes.data.url,
        commitLink: commitRes.data.url
      };
      setImageLink(result);
      return result;
    }
    return null;
  } catch (err) {
    enqueueSnackbar("Image upload failed", { variant: "error" });
    return null;
  }
}

async function submittedForm(
  studentId,
  admissionTermId,
  address,
  profileLink,
  houseAddressLink,
  birthLink,
  commitLink,
  note
) {
  try {
    const res = await axios.post("/api/v1/parent/form/submit", {
      studentId,
      admissionTermId,
      householdRegistrationAddress: address,
      profileImage: profileLink,
      householdRegistrationImg: houseAddressLink,
      birthCertificateImg: birthLink,
      commitmentImg: commitLink,
      note
    });
    return res.data;
  } catch (err) {
    return { success: false, message: err?.response?.data?.message || "Submission failed" };
  }
}

export default function RenderFormPopUp({ handleClosePopUp, isPopUpOpen, students, GetForm, admissionTerms }) {
  const [selectedStudentId, setSelectedStudentId] = useState(students[0]?.id || "");
  const [selectedTermId, setSelectedTermId] = useState(admissionTerms[0]?.id || "");
  const [input, setInput] = useState({ address: "", note: "" });
  const [uploadedFile, setUploadedFile] = useState({ profile: "", houseAddress: "", birth: "", commit: "" });
  const [imageLink, setImageLink] = useState({ profileLink: "", houseAddressLink: "", birthLink: "", commitLink: "" });
  const [isSubmit, setIsSubmit] = useState(false);
  const [loading, setLoading] = useState(false);

  function HandleUploadFile(file, id) {
    switch (id) {
      case 1:
        setUploadedFile({ ...uploadedFile, profile: file });
        break;
      case 2:
        setUploadedFile({ ...uploadedFile, houseAddress: file });
        break;
      case 3:
        setUploadedFile({ ...uploadedFile, birth: file });
        break;
      default:
        setUploadedFile({ ...uploadedFile, commit: file });
        break;
    }
  }

  const HandleSubmit = async () => {
    setIsSubmit(true);
    if (!input.address.trim()) {
      enqueueSnackbar("Please enter household registration address", { variant: "error" });
      return;
    }
    if (!selectedTermId) {
      enqueueSnackbar("Please select an admission term", { variant: "error" });
      return;
    }
    setLoading(true);
    const uploadResult = await handleUploadImage(uploadedFile, setImageLink);
    if (!uploadResult) {
      setLoading(false);
      return;
    }
    const selectedStudent = students.find(child => child.id === selectedStudentId);
    const response = await submittedForm(
      selectedStudent.id,
      selectedTermId,
      input.address,
      uploadResult.profileLink,
      uploadResult.houseAddressLink,
      uploadResult.birthLink,
      uploadResult.commitLink,
      input.note
    );
    setLoading(false);
    if (response && response.success) {
      enqueueSnackbar(response.message, { variant: "success" });
      GetForm();
      handleClosePopUp();
    } else {
      enqueueSnackbar(response.message || "Submission failed", { variant: "error" });
    }
  };

  return (
    <Dialog fullScreen open={isPopUpOpen} onClose={handleClosePopUp}>
      <AppBar sx={{ position: "relative" }}>
        <Toolbar>
          <IconButton edge="start" color="inherit" onClick={handleClosePopUp} aria-label="close">
            <Close />
          </IconButton>
          <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
            Create Admission Form
          </Typography>
        </Toolbar>
      </AppBar>
      <Box p={4}>
        <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: "bold", fontSize: "2.5rem", textAlign: "center" }}>
          Form Information
        </Typography>
        {selectedStudentId && Array.isArray(students) && (
          <Stack spacing={3}>
            <FormControl fullWidth>
              <InputLabel>Child Name</InputLabel>
              <Select
                value={selectedStudentId}
                onChange={e => setSelectedStudentId(e.target.value)}
                label="Child Name"
                name="childName"
                variant="outlined"
              >
                {students.filter(student => !student.hadForm).map((student, index) => (
                  <MenuItem key={index} value={student.id}>
                    <Typography fontWeight={600}>{student.name}</Typography>
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl fullWidth>
              <InputLabel>Admission Term</InputLabel>
              <Select
                value={selectedTermId}
                onChange={e => setSelectedTermId(e.target.value)}
                label="Admission Term"
                name="admissionTerm"
                variant="outlined"
              >
                {admissionTerms.map(term => (
                  <MenuItem key={term.id} value={term.id}>{term.name}</MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl>
              <FormLabel sx={{ color: "black" }}>Gender</FormLabel>
              <RadioGroup
                row
                value={(() => {
                  const s = students.find(child => child.id === selectedStudentId);
                  return s ? s.gender : "";
                })()}
              >
                <FormControlLabel value="female" control={<Radio />} label="Female" sx={{ color: "black" }} disabled />
                <FormControlLabel value="male" control={<Radio />} label="Male" sx={{ color: "black" }} disabled />
              </RadioGroup>
            </FormControl>
            <TextField
              fullWidth
              label="Date of birth"
              disabled
              value={(() => {
                const s = students.find(child => child.id === selectedStudentId);
                if (!s) return "";
                if (typeof s.dateOfBirth === 'string' && s.dateOfBirth.startsWith('http')) return "";
                return s.dateOfBirth || "";
              })()}
              name="dateOfBirth"
            />
            <TextField
              fullWidth
              label="Place of birth"
              disabled
              value={(() => {
                const s = students.find(child => child.id === selectedStudentId);
                return s ? s.placeOfBirth : "";
              })()}
              name="placeOfBirth"
            />
            <TextField
              fullWidth
              label="Household registration address *"
              value={input.address}
              onChange={e => setInput({ ...input, address: e.target.value })}
              name="householdRegistrationAddress"
              error={isSubmit && !input.address.trim()}
              helperText={isSubmit && !input.address.trim() ? "This field is required" : ""}
            />
            <TextField
              fullWidth
              label="Note"
              value={input.note}
              onChange={e => setInput({ ...input, note: e.target.value })}
              name="note"
            />
            {/* Upload fields with preview */}
            <Typography variant="subtitle1" sx={{ mb: 1, mt: 3, fontSize: "1rem", fontWeight: "bold" }}>
              UPLOAD DOCUMENTS
            </Typography>
            {/* Profile Image Upload - Custom style, không dùng MUI Button */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 16 }}>
              <label style={{
                background: '#1976d2', color: '#fff', padding: '8px 16px', borderRadius: 6, cursor: 'pointer', fontWeight: 500,
                display: 'inline-block', minWidth: 120, textAlign: 'center'
              }}>
                Upload Profile
                <input type="file" accept="image/*" style={{ display: 'none' }} onChange={e => HandleUploadFile(e.target.files[0], 1)} />
              </label>
              {uploadedFile.profile && (
                <img
                  src={typeof uploadedFile.profile === 'string' ? uploadedFile.profile : URL.createObjectURL(uploadedFile.profile)}
                  alt="Profile Preview"
                  style={{ width: 80, height: 80, borderRadius: 8, objectFit: 'cover', border: '1px solid #eee' }}
                />
              )}
            </div>
            {/* Household Registration Upload - Custom style */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 16 }}>
              <label style={{
                background: '#1976d2', color: '#fff', padding: '8px 16px', borderRadius: 6, cursor: 'pointer', fontWeight: 500,
                display: 'inline-block', minWidth: 120, textAlign: 'center'
              }}>
                Upload Household Registration
                <input type="file" accept="image/*" style={{ display: 'none' }} onChange={e => HandleUploadFile(e.target.files[0], 2)} />
              </label>
              {uploadedFile.houseAddress && (
                <img
                  src={typeof uploadedFile.houseAddress === 'string' ? uploadedFile.houseAddress : URL.createObjectURL(uploadedFile.houseAddress)}
                  alt="Household Registration Preview"
                  style={{ width: 80, height: 80, borderRadius: 8, objectFit: 'cover', border: '1px solid #eee' }}
                />
              )}
            </div>
            {/* Birth Certificate Upload - Custom style */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 16 }}>
              <label style={{
                background: '#1976d2', color: '#fff', padding: '8px 16px', borderRadius: 6, cursor: 'pointer', fontWeight: 500,
                display: 'inline-block', minWidth: 120, textAlign: 'center'
              }}>
                Upload Birth Certificate
                <input type="file" accept="image/*" style={{ display: 'none' }} onChange={e => HandleUploadFile(e.target.files[0], 3)} />
              </label>
              {uploadedFile.birth && (
                <img
                  src={typeof uploadedFile.birth === 'string' ? uploadedFile.birth : URL.createObjectURL(uploadedFile.birth)}
                  alt="Birth Certificate Preview"
                  style={{ width: 80, height: 80, borderRadius: 8, objectFit: 'cover', border: '1px solid #eee' }}
                />
              )}
            </div>
            {/* Commitment Upload - Custom style */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 16 }}>
              <label style={{
                background: '#1976d2', color: '#fff', padding: '8px 16px', borderRadius: 6, cursor: 'pointer', fontWeight: 500,
                display: 'inline-block', minWidth: 120, textAlign: 'center'
              }}>
                Upload Commitment
                <input type="file" accept="image/*" style={{ display: 'none' }} onChange={e => HandleUploadFile(e.target.files[0], 4)} />
              </label>
              {uploadedFile.commit && (
                <img
                  src={typeof uploadedFile.commit === 'string' ? uploadedFile.commit : URL.createObjectURL(uploadedFile.commit)}
                  alt="Commitment Preview"
                  style={{ width: 80, height: 80, borderRadius: 8, objectFit: 'cover', border: '1px solid #eee' }}
                />
              )}
            </div>
          </Stack>
        )}
        <Stack sx={{ display: "flex", flexDirection: "row", justifyContent: "flex-end", gap: "1rem", marginTop: "2vh" }}>
          <Button sx={{ width: "10%", height: "5vh" }} variant="contained" color="warning" onClick={handleClosePopUp} disabled={loading}>
            Close
          </Button>
          <Button sx={{ width: "10%", height: "5vh" }} variant="contained" color="success" onClick={HandleSubmit} disabled={loading}>
            {loading ? "Submitting..." : "Submit"}
          </Button>
        </Stack>
      </Box>
    </Dialog>
  );
}
