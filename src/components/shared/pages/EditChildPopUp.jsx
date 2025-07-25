import React, { useEffect, useState } from "react";
import {
  Dialog, AppBar, Toolbar, IconButton, Typography, Box, Stack, Button,
  TextField, FormLabel, RadioGroup, FormControlLabel, Radio
} from "@mui/material";
import { Close } from "@mui/icons-material";
import dayjs from "dayjs";
import { updateChild, getChildren } from "@api/services/parentService";
import { enqueueSnackbar } from "notistack";
import axios from "axios";

async function uploadToCloudinary(file) {
  if (!file) return "";
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", "pes_swd");
  formData.append("api_key", "837117616828593");
  const res = await axios.post("https://api.cloudinary.com/v1_1/dbrfnkrbh/image/upload", formData, {
    headers: { "Content-Type": "multipart/form-data" }
  });
  return res.data.url;
}

export default function EditChildPopUp({ open, onClose, childId, onSuccess }) {
  const [form, setForm] = useState({
    name: "",
    gender: "",
    dateOfBirth: "",
    placeOfBirth: "",
    profileImage: "",
    birthCertificateImg: "",
    householdRegistrationImg: ""
  });
  const [file, setFile] = useState({
    profile: null,
    birth: null,
    house: null
  });
  const [loading, setLoading] = useState(false);
  const [canEdit, setCanEdit] = useState(true);

  useEffect(() => {
    async function fetchChild() {
      const res = await getChildren();
      const found = Array.isArray(res.data)
        ? res.data.find(c => String(c.id) === String(childId))
        : null;
      if (found) {
        setForm(found);
        // Kiểm tra trạng thái các form
        const hasActiveForm = found.admissionForms && found.admissionForms.some(
          form => !['draft', 'cancelled', 'rejected'].includes((form.status || '').toLowerCase())
        );
        setCanEdit(!hasActiveForm);
      }
    }
    if (open && childId) fetchChild();
  }, [open, childId]);

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleFileChange = (e, type) => setFile({ ...file, [type]: e.target.files[0] });

  const handleSubmit = async () => {
    setLoading(true);
    try {
      // Upload ảnh nếu có file mới
      const profileImage = file.profile ? await uploadToCloudinary(file.profile) : form.profileImage;
      const birthCertificateImg = file.birth ? await uploadToCloudinary(file.birth) : form.birthCertificateImg;
      const householdRegistrationImg = file.house ? await uploadToCloudinary(file.house) : form.householdRegistrationImg;

      await updateChild({
        ...form,
        id: childId,
        profileImage,
        birthCertificateImg,
        householdRegistrationImg
      });
      enqueueSnackbar("Cập nhật thành công!", { variant: "success" });
      if (onSuccess) onSuccess();
      onClose();
    } catch (err) {
      enqueueSnackbar("Cập nhật thất bại!", { variant: "error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth PaperProps={{
      sx: {
        borderRadius: 4,
        boxShadow: 8,
        p: 0,
        m: 0,
        maxWidth: 500,
        width: '100%',
      }
    }}>
      <AppBar sx={{ position: "relative", borderRadius: '16px 16px 0 0', boxShadow: 0, bgcolor: '#07663a' }} elevation={0}>
        <Toolbar>
          <IconButton edge="start" color="inherit" onClick={onClose} aria-label="close">
            <Close />
          </IconButton>
          <Typography sx={{ ml: 2, flex: 1, fontWeight: 700 }} variant="h6" component="div">
            Edit Child Information
          </Typography>
        </Toolbar>
      </AppBar>
      <Box sx={{ p: { xs: 2, sm: 4 }, background: '#f9fafb' }}>
        <Stack spacing={3}>
          {!canEdit && (
            <Typography color="error" fontWeight="bold">
              Cannot update child info while there is an active admission form (pending/approved)
            </Typography>
          )}
          <Box sx={{ bgcolor: 'white', borderRadius: 3, boxShadow: 2, p: 3 }}>
            <Stack spacing={2}>
              <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 1, color: '#07663a' }}>Basic Information</Typography>
              <TextField label="Full Name" name="name" value={form.name} onChange={handleChange} fullWidth disabled={!canEdit} InputLabelProps={{ style: { fontWeight: 500 } }} />
              <FormLabel sx={{ fontWeight: 500, color: '#07663a' }}>Gender</FormLabel>
              <RadioGroup row name="gender" value={form.gender} onChange={handleChange} disabled={!canEdit}>
                <FormControlLabel value="male" control={<Radio />} label="Male" />
                <FormControlLabel value="female" control={<Radio />} label="Female" />
              </RadioGroup>
              <TextField
                label="Date of Birth"
                name="dateOfBirth"
                type="date"
                value={form.dateOfBirth ? dayjs(form.dateOfBirth).format('YYYY-MM-DD') : ""}
                onChange={handleChange}
                fullWidth
                InputLabelProps={{ shrink: true, style: { fontWeight: 500 } }}
                disabled={!canEdit}
              />
              <TextField label="Place of Birth" name="placeOfBirth" value={form.placeOfBirth} onChange={handleChange} fullWidth disabled={!canEdit} InputLabelProps={{ style: { fontWeight: 500 } }} />
            </Stack>
          </Box>
          <Box sx={{ bgcolor: 'white', borderRadius: 3, boxShadow: 2, p: 3 }}>
            <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 1, color: '#07663a' }}>Documents</Typography>
            <Stack spacing={2} direction={{ xs: 'column', sm: 'row' }}>
              <Box sx={{ flex: 1 }}>
                <FormLabel sx={{ fontWeight: 500 }}>Profile Image</FormLabel>
                <input type="file" accept="image/*" onChange={e => handleFileChange(e, "profile") } disabled={!canEdit} style={{ marginTop: 8, marginBottom: 8 }} />
                {form.profileImage && <img src={form.profileImage} alt="Profile" style={{ width: '100%', borderRadius: 8, marginTop: 8, boxShadow: '0 2px 8px #eee' }} />}
              </Box>
              <Box sx={{ flex: 1 }}>
                <FormLabel sx={{ fontWeight: 500 }}>Birth Certificate</FormLabel>
                <input type="file" accept="image/*" onChange={e => handleFileChange(e, "birth") } disabled={!canEdit} style={{ marginTop: 8, marginBottom: 8 }} />
                {form.birthCertificateImg && <img src={form.birthCertificateImg} alt="Birth Certificate" style={{ width: '100%', borderRadius: 8, marginTop: 8, boxShadow: '0 2px 8px #eee' }} />}
              </Box>
              <Box sx={{ flex: 1 }}>
                <FormLabel sx={{ fontWeight: 500 }}>Household Registration</FormLabel>
                <input type="file" accept="image/*" onChange={e => handleFileChange(e, "house") } disabled={!canEdit} style={{ marginTop: 8, marginBottom: 8 }} />
                {form.householdRegistrationImg && <img src={form.householdRegistrationImg} alt="Household Registration" style={{ width: '100%', borderRadius: 8, marginTop: 8, boxShadow: '0 2px 8px #eee' }} />}
              </Box>
            </Stack>
          </Box>
          <Stack direction="row" spacing={2} justifyContent="flex-end">
            <Button variant="outlined" onClick={onClose} disabled={loading} sx={{ minWidth: 120, fontWeight: 600 }}>
              Cancel
            </Button>
            <Button variant="contained" onClick={handleSubmit} disabled={loading || !canEdit} sx={{ minWidth: 140, fontWeight: 600, bgcolor: '#07663a', '&:hover': { bgcolor: '#05522c' } }}>
              {loading ? "Saving..." : "Save Changes"}
            </Button>
          </Stack>
        </Stack>
      </Box>
    </Dialog>
  );
} 