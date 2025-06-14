import {
    AppBar,
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    FormControl,
    FormControlLabel,
    FormLabel,
    IconButton,
    InputLabel,
    MenuItem,
    Paper,
    Radio,
    RadioGroup,
    Select,
    Stack,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TablePagination,
    TableRow,
    TextField,
    Toolbar,
    Typography
} from "@mui/material";
import {Add, Close, CloudUpload, Info} from '@mui/icons-material';
import {useEffect, useState} from "react";
import {DatePicker} from "@mui/x-date-pickers/DatePicker";

import dayjs from "dayjs";
import {enqueueSnackbar} from "notistack";
import axios from "axios";
import {cancelAdmission, getFormInformation, submittedForm} from "@services/parentService.js";


function RenderTable({openDetailPopUpFunc, forms, HandleSelectedForm}) {
    const [page, setPage] = useState(0); // Trang hiện tại
    const [rowsPerPage, setRowsPerPage] = useState(5); //số dòng trang

    console.log("form" + forms)
    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    }

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(event.target.value)
        setPage(0)
    }

    const handleDetailClick = (form) => {
        // Xử lý khi người dùng click vào nút "Detail"
        HandleSelectedForm(form)
        openDetailPopUpFunc();
    }

    return (
        <Paper sx={{
            width: '100%',
            height: 500,
            borderRadius: 3,
            overflow: 'hidden',
            backgroundColor: '#fff',
            boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.1)',
            border: '2px solid rgb(254, 254, 253)'
        }}>

            <TableContainer sx={{height: 500}}>
                <Table stickyHeader>
                    <TableHead>
                        <TableRow>
                            <TableCell align={"center"}>No</TableCell>
                            {/*<TableCell align={"center"}>Child ID</TableCell>*/}
                            <TableCell align={"center"}>Submit Date</TableCell>
                            <TableCell align={"center"}>Cancel Reason</TableCell>
                            <TableCell align={"center"}>Status</TableCell>
                            <TableCell align={"center"}>Note</TableCell>
                            <TableCell align={"center"}>Action</TableCell>
                        </TableRow>
                    </TableHead>

                    <TableBody>
                        {forms?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                            .map((form, index) => {
                                return (
                                    <TableRow key={index}>
                                        <TableCell align={"center"}>{index + 1}</TableCell>
                                        {/*<TableCell align={"center"}>{form.studentId}</TableCell>*/}
                                        <TableCell align={"center"}>{form.submittedDate}</TableCell>
                                        <TableCell align={"center"}>{form.cancelReason || "N/A"}</TableCell>
                                        <TableCell align="center" sx={{
                                            color:
                                                form.status === "approved"
                                                    ? "green"
                                                    : form.status === "rejected" || form.status === "cancelled"
                                                        ? "red"
                                                        : form.status === "pending approval"
                                                            ? "#052c65"
                                                            : "black",
                                            fontWeight: "bold"
                                        }}>
                                            {form.status}
                                        </TableCell>
                                        <TableCell align={"center"}>{form.note}</TableCell>
                                        <TableCell align={"center"}>
                                            <IconButton color="primary"
                                                        onClick={() => handleDetailClick(form)}
                                            >
                                                <Info sx={{color: '#2c3e50'}}/>
                                            </IconButton>
                                        </TableCell>
                                    </TableRow>
                                )
                            })
                        }

                    </TableBody>
                </Table>
            </TableContainer>
            <TablePagination
                component="div"
                rowsPerPageOptions={[5, 10, 15]}
                count={forms?.length} //phân trang có bn dòng
                page={page}
                onPageChange={handleChangePage}
                rowsPerPage={rowsPerPage}
                onRowsPerPageChange={handleChangeRowsPerPage}
            />
        </Paper>
    )
}

function RenderDetailPopUp({handleClosePopUp, isPopUpOpen, selectedForm}) {

    const [openConfirm, setOpenConfirm] = useState(false); // tạo usestate để mở dialog

    const handleOpenConfirm = () => setOpenConfirm(true);

    /*handleCloseConfirm sẽ đặt lại openConfirm = false để đóng dialog khi người dùng nhấn Disagree hoặc đóng hộp thoại*/
    const handleCloseConfirm = () => setOpenConfirm(false);

    //tạo state để hiển thị ảnh
    const [openImage, setOpenImage] = useState(false);
    const [selectedImage, setSelectedImage] = useState('');

    async function HandleCancel() {
        const response = await cancelAdmission(selectedForm.id)
        if (response && response.success) {
            enqueueSnackbar("Form cancelled successfully", {variant: "success"});
            handleClosePopUp()
        } else {
            enqueueSnackbar("Failed to cancel admission form", {variant: "error"});
        }
    }

    console.log(selectedForm)
    return (
        <Dialog
            fullScreen
            open={isPopUpOpen}
            onClose={handleClosePopUp}
        >
            <AppBar sx={{position: 'relative'}}>
                <Toolbar>
                    <IconButton edge="start"
                                color="inherit"
                                onClick={handleClosePopUp}
                                aria-label="close">
                        <Close/>
                    </IconButton>
                    <Typography sx={{ml: 2, flex: 1}} variant="h6" component="div">
                        Admission Form Detail
                    </Typography>
                </Toolbar>
            </AppBar>

            <Box p={4}>
                <Typography
                    variant='subtitle1'
                    sx={{mb: 2, fontWeight: 'bold', fontSize: "2.5rem", textAlign: "center"}}
                >
                    Form Information
                </Typography>

                <Stack spacing={3}>
                    <Stack>
                        <TextField fullWidth label='Child name' disabled value={selectedForm.studentName || ''}/>
                    </Stack>
                    <Stack>
                        <FormControl>
                            <FormLabel sx={{color: 'black'}} disabled>Gender</FormLabel>
                            <RadioGroup row value={selectedForm.studentGender || ''}>
                                <FormControlLabel value="female" control={<Radio/>} label="Female"
                                                  sx={{color: 'black'}} disabled/>
                                <FormControlLabel value="male" control={<Radio/>} label="Male"
                                                  sx={{color: 'black'}} disabled/>
                            </RadioGroup>
                        </FormControl>
                    </Stack>
                    <Stack>
                        <DatePicker label='Date of birth' disabled
                                    defaultValue={selectedForm.studentDateOfBirth ? dayjs(selectedForm.studentDateOfBirth.toString()) : null}
                        />
                    </Stack>
                    <Stack>
                        <TextField fullWidth label={'Place of birth'} disabled
                                   value={selectedForm.studentPlaceOfBirth || ''}/>
                    </Stack>

                    <Stack>
                        <TextField fullWidth label={'Household registration address'} disabled
                                   value={selectedForm.householdRegistrationAddress || ''}/>
                    </Stack>

                    <Stack>
                        <TextField fullWidth label={'Note'} disabled value={selectedForm.note || ''}/>
                    </Stack>
                    <Stack>
                        <TextField fullWidth label={'Cancel reason'} disabled value={selectedForm.cancelReason || ''}/>
                    </Stack>

                    <Typography variant="subtitle1" sx={{mt: 5, mb: 2, fontWeight: 'bold'}}>Uploaded
                        Documents</Typography>
                    <Stack direction="row" spacing={3} flexWrap="wrap" useFlexGap>
                        {[
                            {label: "Profile Image", src: selectedForm.profileImage},
                            {label: "Household Registration", src: selectedForm.householdRegistrationImg},
                            {label: "Birth Certificate", src: selectedForm.birthCertificateImg},
                            {label: "Commitment", src: selectedForm.commitmentImg}
                        ].map((item, idx) => (
                            <Paper key={idx} elevation={2} sx={{p: 2, borderRadius: 2, width: 200}}>
                                <Typography variant="body2" fontWeight="bold" sx={{mb: 1}}>{item.label}</Typography>

                                {/*thay vì click="ảnh" redirect sang link khác*/}
                                {/*vì giải quyết vấn đề hiện model thôi*/}
                                <img
                                    src={item.src}
                                    alt={item.label}
                                    style={{width: '100%', borderRadius: 8, cursor: 'pointer'}}
                                    onClick={() => {
                                        setSelectedImage(item.src);
                                        setOpenImage(true);
                                    }}
                                />

                                <Dialog open={openImage} onClose={() => setOpenImage(false)} maxWidth="md">
                                    <img src={selectedImage} style={{width: '100%'}} alt="Zoom"/>
                                </Dialog>
                            </Paper>
                        ))}
                    </Stack>
                </Stack>

                <Stack spacing={3}>
                    <Stack
                        sx={{
                            display: 'flex',
                            flexDirection: 'row',
                            justifyContent: 'flex-end',
                            gap: '1rem',
                            marginTop: '2vh'
                        }}
                    >
                        {/*button submit*/}
                        <Button
                            sx={{width: '10%', height: '5vh'}}
                            variant="contained"
                            color="warning"
                            onClick={handleClosePopUp}
                        >
                            Close
                        </Button>

                        {/*button cancel*/}
                        {/*xét điều kiện, nếu cancel rồi thì ẩn nút cancel đó, ko cho hiện lại */}
                        {selectedForm.status !== 'cancelled' && (
                            <Button
                                sx={{width: '10%', height: '5vh'}}
                                variant="contained"
                                color="success"
                                onClick={handleOpenConfirm}
                            >
                                Cancel
                            </Button>
                        )}

                        {/* Dialog xác nhận cancel */}
                        <Dialog open={openConfirm} onClose={handleCloseConfirm}>
                            <DialogTitle>Cancel Admission Form</DialogTitle>
                            <DialogContent>
                                <DialogContentText>
                                    ⚠️ Are you sure you want to cancel this admission form?
                                    <br/>
                                    This action <strong>cannot be undone</strong> and the child may lose their
                                    enrollment opportunity for this term.
                                </DialogContentText>
                            </DialogContent>
                            <DialogActions>
                                {/*handleCloseConfirm sẽ đặt lại openConfirm = false để đóng dialog khi người dùng nhấn Disagree hoặc đóng hộp thoại*/}
                                <Button onClick={handleCloseConfirm} color="inherit">Disagree</Button>
                                <Button onClick={HandleCancel} color="error" autoFocus>Agree</Button>
                            </DialogActions>
                        </Dialog>
                    </Stack>
                </Stack>
            </Box>
        </Dialog>
    )
}

function RenderFormPopUp({handleClosePopUp, isPopUpOpen, studentList, GetForm}) {
    //mỗi lần select là lưu id student
    const [selectedStudentId, setSelectedStudentId] = useState(studentList?[0]?.id : []);
    //lam 1 useState de nhap input cho address + note
    const [input, setInput] = useState({
        address: '',
        note: ''
    });

    //nơi lưu file thô mà người dùng upload từ <input="file"/>
    const [uploadedFile, setUploadedFile] = useState({
        profile: '',
        houseAddress: '',
        birth: '',
        commit: ''
    });

    //nơi lưu trữ URL trả về từ Couldinary sau khi upload thành công
    const [imageLink, setImageLink] = useState({
        profileLink: '',
        houseAddressLink: '',
        birthLink: '',
        commitLink: ''
    });

    const [isSubmit, setIsSubmit] = useState(false); // để chỉ báo rằng user đã bấm Submit ít nhất 1 lần

    async function HandleSubmit() {

        setIsSubmit(true);//báo hiệu bấm submit

        // Validate bắt buộc
        if (!input.address.trim()) {
            enqueueSnackbar("Please enter household registration address", {variant: "error"});
            return;
        }


        const uploadResult = await handleUploadImage()
        if (!uploadResult) {
            return;
        }

        const selectedStudent = studentList.find(child => child.id === selectedStudentId);
        console.log("Selected student:", selectedStudent);

        const response = await submittedForm(
            selectedStudent.id,
            input.address,
            uploadResult.profileLink,
            uploadResult.houseAddressLink,
            uploadResult.birthLink,
            uploadResult.commitLink,
            input.note
        )

        console.log("Phản hồi từ submittedForm:", response);

        if (response && response.success) {
            enqueueSnackbar(response.message, {variant: 'success'});
            // muốn gọi lại danh sách sau khi submit
            GetForm()
            handleClosePopUp()
        } else {
            enqueueSnackbar("Submission failed", {variant: "error"});
        }
    }

    //đưa vào id, lưu đúng loại file vào uploadFile
    function HandleUploadFile(file, id) {
        switch (id) {
            case 1:
                setUploadedFile({...uploadedFile, profile: file})
                break;

            case 2:
                setUploadedFile({...uploadedFile, houseAddress: file})
                break;

            case 3:
                setUploadedFile({...uploadedFile, birth: file})
                break;

            default:
                setUploadedFile({...uploadedFile, commit: file})
                break;
        }
    }

    const handleUploadImage = async () => {
        if (!uploadedFile.profile) {
            enqueueSnackbar("Please upload profile image.", {variant: "warning"});
            return null;
        }

        if (!uploadedFile.houseAddress) {
            enqueueSnackbar("Please upload household registration document.", {variant: "warning"});
            return null;
        }

        if (!uploadedFile.birth) {
            enqueueSnackbar("Please upload birth certificate.", {variant: "warning"});
            return null;
        }

        if (!uploadedFile.commit) {
            enqueueSnackbar("Please upload commitment form.", {variant: "warning"});
            return null;
        }

        //ghép các chuỗi lại với nhau
        const profileData = new FormData();
        profileData.append("file", uploadedFile.profile);
        profileData.append("upload_preset", "pes_swd");
        profileData.append("api_key", "837117616828593");

        const houseAddressData = new FormData();
        houseAddressData.append("file", uploadedFile.houseAddress);
        houseAddressData.append("upload_preset", "pes_swd");
        houseAddressData.append("api_key", "837117616828593");

        const birthData = new FormData();
        birthData.append("file", uploadedFile.birth);
        birthData.append("upload_preset", "pes_swd");
        birthData.append("api_key", "837117616828593");

        const commitData = new FormData();
        commitData.append("file", uploadedFile.commit);
        commitData.append("upload_preset", "pes_swd");
        commitData.append("api_key", "837117616828593");

        //mock api cho từng upload ảnh
        const profileResponse = await axios.post("https://api.cloudinary.com/v1_1/dbrfnkrbh/image/upload", profileData, {
            headers: {
                "Content-Type": "multipart/form-data"
            }
        });

        const houseAddressResponse = await axios.post("https://api.cloudinary.com/v1_1/dbrfnkrbh/image/upload", houseAddressData, {
            headers: {
                "Content-Type": "multipart/form-data"
            }
        });

        const birthResponse = await axios.post("https://api.cloudinary.com/v1_1/dbrfnkrbh/image/upload", birthData, {
            headers: {
                "Content-Type": "multipart/form-data"
            }
        });

        const commitResponse = await axios.post("https://api.cloudinary.com/v1_1/dbrfnkrbh/image/upload", commitData, {
            headers: {
                "Content-Type": "multipart/form-data"
            }
        });

        const profileCondition = profileResponse && profileResponse.status === 200
        const houseAddressCondition = houseAddressResponse && houseAddressResponse.status === 200
        const birthCondition = birthResponse && birthResponse.status === 200
        const commitCondition = commitResponse && commitResponse.status === 200

        if (profileCondition && houseAddressCondition && birthCondition && commitCondition) {
            const result = {
                profileLink: profileResponse.data.url,
                houseAddressLink: houseAddressResponse.data.url,
                birthLink: birthResponse.data.url,
                commitLink: commitResponse.data.url,
            }
            setImageLink(result)
            return result;
        }
        return null
    }

    // bản chât luôn nằm trong hàm tổng, chỉ là ẩn nó thông qua cái nút
    return (
        <div>
            {/* Pop-up content goes here */}
            <Dialog fullScreen
                    open={isPopUpOpen}
                    onClose={handleClosePopUp}
            >
                <AppBar sx={{position: 'relative'}}>
                    <Toolbar>
                        <IconButton
                            edge="start"
                            color="inherit"
                            onClick={handleClosePopUp}
                            aria-label="close"
                        >
                            <Close/>
                        </IconButton>
                        <Typography sx={{ml: 2, flex: 1}} variant="h6" component="div">
                            Create Admission Form
                        </Typography>
                    </Toolbar>
                </AppBar>

                <Box p={4}>
                    {/*form content*/}
                    <Typography
                        variant='subtitle1'
                        sx={{mb: 2, fontWeight: 'bold', fontSize: "2.5rem", textAlign: "center"}}
                    >
                        Form Information
                    </Typography>

                    {/*check id co bi null */}
                    {selectedStudentId != null && Array.isArray(studentList) && (
                        <Stack spacing={3}>
                            <Stack>
                                <FormControl fullWidth>
                                    <InputLabel>Child Name</InputLabel>
                                    <Select
                                        value={selectedStudentId}
                                        onChange={(e) => setSelectedStudentId(e.target.value)}
                                        label="Child Name"
                                        name="childName"
                                        variant={"outlined"}>
                                        {
                                            studentList.filter(student => !student.hadForm).map((student, index) => (
                                                <MenuItem key={index} value={student.id}>{student.name}</MenuItem>
                                            ))}
                                    </Select>
                                </FormControl>
                            </Stack>

                            <Stack>
                                <FormControl>
                                    <FormLabel sx={{color: 'black'}}>Gender</FormLabel>
                                    <RadioGroup row
                                                value={studentList.find(child => child.id === selectedStudentId) ? studentList.find(child => child.id === selectedStudentId).gender : ''}>
                                        <FormControlLabel value="female" control={<Radio/>} label="Female"
                                                          sx={{color: 'black'}} disabled/>
                                        <FormControlLabel value="male" control={<Radio/>} label="Male"
                                                          sx={{color: 'black'}} disabled/>
                                    </RadioGroup>
                                </FormControl>
                            </Stack>

                            <Stack>
                                <DatePicker
                                    sx={{fill: '#2c3e50'}}
                                    label="Date of birth"
                                    disabled
                                    defaultValue={dayjs(studentList.find(child => child.id === selectedStudentId) ? studentList.find(child => child.id === selectedStudentId).dateOfBirth : null)}
                                    slotProps={{textField: {fullWidth: true}}}
                                />
                            </Stack>

                            <Stack>
                                <TextField
                                    fullWidth
                                    label="Place of birth"
                                    disabled
                                    defaultValue={studentList.find(child => child.id === selectedStudentId) ? studentList.find(child => child.id === selectedStudentId).placeOfBirth : ''}
                                    name="placeOfBirth"
                                />
                            </Stack>
                            <Stack>
                                <TextField fullWidth
                                           label="Household registration address *"
                                           value={input.address}
                                           onChange={(e) => setInput({...input, address: e.target.value})}
                                           name="householdRegistrationAddress"
                                               error={isSubmit && !input.address.trim()}
                                               helperText={isSubmit && !input.address.trim() ? "This field is required" : ""}
                                />
                            </Stack>
                            <Stack>
                                <TextField fullWidth
                                           label="Note" //note là optional nên ko cần bắt buộc
                                           value={input.note}
                                           onChange={(e) => setInput({...input, note: e.target.value})}
                                           name="note"
                                />
                            </Stack>
                        </Stack>
                    )}

                    {/*form upload*/}
                    <Typography
                        variant='subtitle1'
                        sx={{mb: 3, mt: 5, fontSize: '1rem', fontWeight: 'bold'}}
                    >
                        UPLOAD DOCUMENTS
                    </Typography>

                    <Stack spacing={3}>

                        <Stack>
                            <Typography variant='body1' sx={{mb: 1}}>Profile Image: <span
                                className={'text-primary'}>{uploadedFile.profile ? uploadedFile.profile.name : ""}</span></Typography>
                            <Button component="label" sx={{width: '10%', marginTop: '2vh', height: '5vh'}}
                                    variant="contained"
                                    startIcon={<CloudUpload/>}>
                                Upload
                                <input type="file" hidden name="profileImage"
                                       onChange={(e) =>
                                           HandleUploadFile(e.target.files[0], 1) /*số 1 tham số truyền vào mấy case 1, case 2,..*/
                                       }
                                />
                            </Button>
                        </Stack>

                        <Stack>
                            <Typography variant='body1' sx={{mb: 1}}>Household Registration: <span
                                className={'text-primary'}>{uploadedFile.houseAddress ? uploadedFile.houseAddress.name : ""}</span></Typography>
                            <Button component="label" sx={{width: '10%', marginTop: '2vh', height: '5vh'}}
                                    variant="contained"
                                    startIcon={<CloudUpload/>}>
                                Upload
                                <input type="file" hidden name="householdRegistrationImg"
                                       onChange={(e) => HandleUploadFile(e.target.files[0], 2)}/>
                            </Button>
                        </Stack>

                        <Stack>
                            <Typography variant='body1' sx={{mb: 1}}>Birth Certificate: <span
                                className={'text-primary'}>{uploadedFile.birth ? uploadedFile.birth.name : ""}</span></Typography>
                            <Button component="label" sx={{width: '10%', marginTop: '2vh', height: '5vh'}}
                                    variant="contained"
                                    startIcon={<CloudUpload/>}>
                                Upload
                                <input type="file" hidden name="birthCertificateImg"
                                       onChange={(e) =>
                                           HandleUploadFile(e.target.files[0], 3)
                                       }
                                />
                            </Button>
                        </Stack>

                        <Stack>
                            <Typography variant='body1' sx={{mb: 1}}>Commitment: <span
                                className={'text-primary'}>{uploadedFile.commit ? uploadedFile.commit.name : ""}</span></Typography>
                            <Button component="label" sx={{width: '10%', marginTop: '2vh', height: '5vh'}}
                                    variant="contained"
                                    startIcon={<CloudUpload/>}>
                                Upload
                                <input type="file" hidden name="commitmentImg"
                                       onChange={(e) => HandleUploadFile(e.target.files[0], 4)}/>
                            </Button>
                        </Stack>
                    </Stack>

                    <Stack
                        sx={{
                            display: 'flex',
                            flexDirection: 'row',
                            justifyContent: 'flex-end',
                            gap: '1rem',
                            marginTop: '2vh'
                        }}
                    >
                        <Button
                            sx={{width: '10%', height: '5vh'}}
                            variant="contained"
                            color="warning"
                            onClick={handleClosePopUp}
                        >
                            Close
                        </Button>

                        <Button
                            sx={{width: '10%', height: '5vh'}}
                            variant="contained"
                            color="success"
                            onClick={() => HandleSubmit(
                                imageLink.profileLink,
                                imageLink.houseAddressLink,
                                imageLink.birthLink,
                                imageLink.commitLink,
                            )}
                        >
                            Submit
                        </Button>
                    </Stack>
                </Box>
            </Dialog>
        </div>
    )
}

function RenderPage({openFormPopUpFunc, openDetailPopUpFunc, forms, HandleSelectedForm, studentList}) {

    return (
        <div className="container">
            {/*1.tiêu đề */}
            <Box sx={{mt: 2, mb: 2}}>
                <Typography
                    variant="h4"
                    fontWeight="bold"
                    sx={{
                        textAlign: 'center',
                        fontFamily: 'inherit',
                        letterSpacing: 1,
                        mb: 1,
                        color: '#07663a'
                    }}
                >
                    Term Admission
                </Typography>
                <Typography
                    variant="subtitle1"
                    color="text.secondary"
                    sx={{
                        textAlign: 'center',
                        fontWeight: 500,
                        fontFamily: 'inherit'
                    }}
                >
                    Manage the terms for student admission
                </Typography>
            </Box>

            {/*2. button create new term */}
            <Box sx={{display: 'flex', justifyContent: 'flex-end', mb: 2}}>
                <Button
                    variant="contained"
                    endIcon={<Add/>}
                    onClick={openFormPopUpFunc}
                    sx={{
                        minWidth: 180,
                        height: 44,
                        borderRadius: '10px',
                        fontWeight: 600,
                        fontSize: 14,
                        backgroundColor: '#07663a',
                        boxShadow: 2,
                        mr: {xs: 0, md: 2}
                    }}
            
                >
                    Create new form
                </Button>
            </Box>

            {/*3. cần 1 bảng để hiện list */}
            <RenderTable
                forms={forms}
                openDetailPopUpFunc={openDetailPopUpFunc}
                HandleSelectedForm={HandleSelectedForm}//selected form moi dc
            />
        </div>
    )
}

export default function AdmissionForm() {
    //lưu những biến sài cục bộ
    const [popUp, setPopUp] = useState({
        isOpen: false,
        type: ''
    })

    //tạo useState data của BE để sài (dành cho form)
    const [data, setData] = useState({
        admissionFormList: [],
        studentList: null
    })

    const [selectedForm, setSelectedForm] = useState(null) // tuong trung cho 1 cai selected

    function HandleSelectedForm(form) {
        setSelectedForm(form)
    }

    const handleOpenPopUp = (type) => {
        setPopUp({...popUp, isOpen: true, type: type})
    }

    const handleClosePopUp = () => {
        setPopUp({...popUp, isOpen: false, type: ''})
        GetForm()
    }

    //gọi API form list //save trực tiếp data
    async function GetForm() {
        const response = await getFormInformation()
        if (response && response.success) {
            setData({
                ...data,
                admissionFormList: response?.admissionFormList,
                studentList: response?.studentList
            })
        }
         // ✅ Thêm dòng này để kiểm tra
         console.log("📦 Students loaded:", response?.studentList);
         console.log("🟢 Students chưa có form:", response?.studentList.filter(s => !s.hadForm));
    }

    //useEffcet sẽ chạy lần đầu tiên, or sẽ chạy khi có thay đổi
    useEffect(() => {
        //lấy data lên và lưu data vào getForm
        GetForm()
    }, []);

    return (
        <>
            <RenderPage
                forms={data.admissionFormList}
                openFormPopUpFunc={() => handleOpenPopUp('form')}
                openDetailPopUpFunc={() => handleOpenPopUp('detail')}
                HandleSelectedForm={HandleSelectedForm} // la 1 ham, truyen ham vao, để cập nhật form đã chọn
                studentList={data.studentList}
            />
            {
                popUp.isOpen && popUp.type === 'form' &&
                <RenderFormPopUp
                    // isPopUpOpen={popUp.isOpen && data.students && data.students.filter(student => !student.hadForm).length !== 0} // form đăng kí bị block khi parent đã điiền form hết cho con mình
                    isPopUpOpen={popUp.isOpen && data.studentList && data.studentList.filter(student => !student.hadForm).length !== 0} // form đăng kí bị block khi parent đã điiền form hết cho con mình
                    handleClosePopUp={handleClosePopUp}
                    studentList={data.studentList}
                    GetForm={GetForm}
                />
            }
            {
                popUp.isOpen && popUp.type === 'detail' &&
                <RenderDetailPopUp
                    isPopUpOpen={popUp.isOpen}
                    handleClosePopUp={handleClosePopUp}
                    selectedForm={selectedForm}
                />
            }
        </>
    )
}