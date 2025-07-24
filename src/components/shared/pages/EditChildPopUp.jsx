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

  useEffect(() => {
    async function fetchChild() {
      const res = await getChildren();
      const found = Array.isArray(res.data)
        ? res.data.find(c => String(c.id) === String(childId))
        : null;
      if (found) setForm(found);
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
    <Dialog fullScreen open={open} onClose={onClose}>
      <AppBar sx={{ position: "relative" }}>
        <Toolbar>
          <IconButton edge="start" color="inherit" onClick={onClose} aria-label="close">
            <Close />
          </IconButton>
          <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
            Edit Child
          </Typography>
        </Toolbar>
      </AppBar>
      <Box p={4}>
        <Stack spacing={3}>
          <TextField label="Name" name="name" value={form.name} onChange={handleChange} fullWidth />
          <FormLabel>Gender</FormLabel>
          <RadioGroup row name="gender" value={form.gender} onChange={handleChange}>
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
            InputLabelProps={{ shrink: true }}
          />
          <TextField label="Place of Birth" name="placeOfBirth" value={form.placeOfBirth} onChange={handleChange} fullWidth />
          <FormLabel>Profile Image</FormLabel>
          <input type="file" accept="image/*" onChange={e => handleFileChange(e, "profile")}/>
          <FormLabel>Birth Certificate Image</FormLabel>
          <input type="file" accept="image/*" onChange={e => handleFileChange(e, "birth")}/>
          <FormLabel>Household Registration Image</FormLabel>
          <input type="file" accept="image/*" onChange={e => handleFileChange(e, "house")}/>
          <Button variant="contained" onClick={handleSubmit} disabled={loading}>
            {loading ? "Saving..." : "Save"}
          </Button>
        </Stack>
      </Box>
    </Dialog>
  );
} 