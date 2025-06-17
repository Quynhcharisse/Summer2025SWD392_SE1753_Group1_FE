import {
    AppBar,
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    FormControl,
    FormControlLabel,
    FormLabel,
    IconButton,
    Paper,
    RadioGroup,
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
    Tooltip,
    Typography
} from "@mui/material";
import {Add, Close, Edit, Visibility} from '@mui/icons-material';
import {useEffect, useState} from "react";
import Radio from '@mui/material/Radio';
import {createTerm, getDefaultGrade, getTermList, updateTerm} from "@services/admissionService.js";
import {useSnackbar} from "notistack";
import {format} from 'date-fns';
import {ValidateTermFormData} from "../validation/ValidateTermFormData.jsx";

function RenderTable({openDetailPopUpFunc, terms, HandleSelectedTerm}) {
    const [page, setPage] = useState(0); // Trang hiện tại
    const [rowsPerPage, setRowsPerPage] = useState(5); //số dòng trang

    const columns = [
        {label: 'No', minWidth: 80, align: 'center', key: 'no'},
        {label: 'Grade', minWidth: 100, align: 'center', key: 'grade'},
        {label: 'Max number registration', minWidth: 160, align: 'center', key: 'maxNumberRegistration'},
        {label: 'Year', minWidth: 100, align: 'center', key: 'year'},
        {label: 'Status', minWidth: 120, align: 'center', key: 'status'},
        {label: 'Action', minWidth: 80, align: 'center', key: 'action'},
    ];

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    }

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(event.target.value)
        setPage(0)
    }

    const handleDetailClick = (term, type) => {
        HandleSelectedTerm(term)
        openDetailPopUpFunc(type);
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
                            {columns.map(col => (
                                <TableCell
                                    key={col.key}
                                    align={col.align}
                                    sx={{minWidth: col.minWidth, fontWeight: 'bold'}}
                                >
                                    {col.label}
                                </TableCell>
                            ))}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {terms.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                            .map((term, idx) => (
                                <TableRow key={term.id}>
                                    <TableCell align="center" sx={{minWidth: 80}}>{idx + 1}</TableCell>
                                    <TableCell align="center" sx={{minWidth: 100}}>{term.grade}</TableCell>
                                    <TableCell align="center"
                                               sx={{minWidth: 160}}>{term.maxNumberRegistration}</TableCell>
                                    <TableCell align="center" sx={{minWidth: 100}}>{term.year}</TableCell>
                                    <TableCell align="center" sx={{
                                        minWidth: 120,
                                        fontWeight: 700,
                                        color:
                                            term.status === 'active'
                                                ? '#219653' // xanh lá
                                                : term.status === 'inactive'
                                                    ? '#bdbdbd' // xám nhạt
                                                    : term.status === 'locked'
                                                        ? '#d32f2f' // đỏ
                                                        : '#2c3e50',
                                        borderRadius: 2,
                                        letterSpacing: 1,
                                        textTransform: 'uppercase'
                                    }}>
                                        {term.status}
                                    </TableCell>
                                    <TableCell align="center" sx={{minWidth: 80}}>
                                        <Tooltip title="View">
                                            <IconButton
                                                color="primary"
                                                onClick={() => handleDetailClick(term, 'view')}
                                                sx={{mr: 1}}
                                            >
                                                <Visibility/>
                                            </IconButton>
                                        </Tooltip>
                                        <Tooltip title="Update">
                                            <IconButton
                                                color="success"
                                                onClick={() => handleDetailClick(term, 'edit')}
                                            >
                                                <Edit/>
                                            </IconButton>
                                        </Tooltip>
                                    </TableCell>
                                </TableRow>
                            ))}
                    </TableBody>
                </Table>
            </TableContainer>
            <TablePagination
                component="div"
                rowsPerPageOptions={[5, 10, 15]}
                count={terms?.length}
                page={page}
                onPageChange={handleChangePage}
                rowsPerPage={rowsPerPage}
                onRowsPerPageChange={handleChangeRowsPerPage}
            />
        </Paper>
    )
}

function RenderDetailPopUp({handleClosePopUp, isPopUpOpen, selectedTerm, GetTerm, mode}) {

    const isViewMode = mode === 'view'; // TRUE nếu đang xem

    const {enqueueSnackbar} = useSnackbar();

    const [formData, setFormData] = useState({
        grade: null,
        startDate: null,
        endDate: null,
        maxNumberRegistration: 0,
        reservationFee: 0,
        serviceFee: 0,
        uniformFee: 0,
        learningMaterialFee: 0,
        facilityFee: 0
    });

    //Đồng bộ formData từ selectedTerm
    useEffect(() => {
        console.log("selectedTerm: ", selectedTerm);
        if (selectedTerm) {
            setFormData({
                grade: selectedTerm.grade ?? '',
                startDate: selectedTerm.startDate
                    ? format(new Date(selectedTerm.startDate), "yyyy-MM-dd'T'HH:mm")
                    : '',
                endDate: selectedTerm.endDate
                    ? format(new Date(selectedTerm.endDate), "yyyy-MM-dd'T'HH:mm")
                    : '',
                maxNumberRegistration: selectedTerm.maxNumberRegistration ?? 0,
                reservationFee: selectedTerm.reservationFee ?? 0,
                serviceFee: selectedTerm.serviceFee ?? 0,
                uniformFee: selectedTerm.uniformFee ?? 0,
                learningMaterialFee: selectedTerm.learningMaterialFee ?? 0,
                facilityFee: selectedTerm.facilityFee ?? 0
            });
        }
    }, [selectedTerm]);


    const handleUpdateTerm = async () => {
        try {
            const response = await updateTerm(
                selectedTerm.id,
                formData.grade,
                formData.startDate,
                formData.endDate,
                formData.maxNumberRegistration,
                selectedTerm.reservationFee, // Giữ nguyên giá trị cũ
                selectedTerm.serviceFee, // Giữ nguyên giá trị cũ
                selectedTerm.uniformFee, // Giữ nguyên giá trị cũ
                selectedTerm.learningMaterialFee, // Giữ nguyên giá trị cũ
                selectedTerm.facilityFee // Giữ nguyên giá trị cũ
            );
            enqueueSnackbar("Term updated successfully!", {variant: "success"});
            handleClosePopUp();
            GetTerm();
        } catch (error) {
            enqueueSnackbar("Failed to update term", {variant: "error"});
        }
    };

    // hàm cập nhật liên tục, onChange sẽ đc gọi, môix khi có thông tin thay đổi
    function HandleOnChange(e) {
        console.log('e.target.name: ', e.target.name)
        console.log('e.target.value: ', e.target.value)
        setFormData({...formData, [e.target.name]: e.target.value})
    }


    return (
        <Dialog
            fullScreen
            open={isPopUpOpen}
            onClose={handleClosePopUp}
        >
            <AppBar sx={{position: 'relative', backgroundColor: '#07663a'}}>
                <Toolbar>
                    <IconButton edge="start"
                                color="inherit"
                                onClick={handleClosePopUp}
                                aria-label="close">
                        <Close/>
                    </IconButton>
                    <Typography sx={{ml: 2, flex: 1}} variant="h6" component="div">
                        Admission Term Detail
                    </Typography>
                </Toolbar>
            </AppBar>

            <Box p={4}>
                <Typography
                    variant='subtitle1'
                    sx={{mb: 2, fontWeight: 'bold', fontSize: "2.5rem", textAlign: "center", color: '#07663a'}}
                >
                    Term Information
                </Typography>

                <Stack spacing={3}>
                    <Stack>
                        <TextField
                            label="Start Date"
                            type="datetime-local"
                            required
                            fullWidth
                            name="startDate"
                            value={formData.startDate}
                            onChange={(e) => HandleOnChange(e)}
                            InputProps={{readOnly: isViewMode}}
                        />
                    </Stack>
                    <Stack>
                        <TextField
                            label="End Date"
                            type="datetime-local"
                            name="endDate"
                            value={formData.endDate}
                            onChange={(e) => HandleOnChange(e)}
                            InputProps={{readOnly: isViewMode}}
                            required
                            fullWidth
                        />
                    </Stack>

                    <Stack>
                        <TextField
                            label="Max number registration"
                            type="number"
                            name="maxNumberRegistration"
                            value={formData.maxNumberRegistration}
                            onChange={(e) => HandleOnChange(e)}
                            InputProps={{readOnly: isViewMode}}
                            required
                            fullWidth
                        />
                    </Stack>

                    <Typography fontWeight="bold" sx={{mt: 1, mb: 0, color: '#07663a'}}>Fees</Typography>

                    <Stack>
                        <TextField label="Reservation Fee"
                                   type="number"
                                   name="reservationFee"
                                   value={formData.reservationFee}
                                   InputProps={{readOnly: true}}
                                   required
                                   fullWidth
                        />
                    </Stack>

                    <Stack>
                        <TextField label="Service Fee"
                                   type="number"
                                   name="serviceFee"
                                   value={formData.serviceFee}
                                   InputProps={{readOnly: true}}
                                   required
                                   fullWidth
                        />
                    </Stack>

                    <Stack>
                        <TextField label="Uniform Fee"
                                   type="number"
                                   name="uniformFee"
                                   value={formData.uniformFee}
                                   InputProps={{readOnly: true}}
                                   required
                                   fullWidth
                        />
                    </Stack>

                    <Stack>
                        <TextField label="Learning Material Fee"
                                   type="number"
                                   name="learningMaterialFee"
                                   value={formData.learningMaterialFee}
                                   InputProps={{readOnly: true}}
                                   required
                                   fullWidth
                        />
                    </Stack>

                    <Stack>
                        <TextField label="Facility Fee"
                                   type="number"
                                   name="facilityFee"
                                   value={formData.facilityFee}
                                   InputProps={{readOnly: true}}
                                   required
                                   fullWidth
                        />
                    </Stack>
                </Stack>
            </Box>
            <DialogActions sx={{justifyContent: 'flex-end', px: 4, py: 3, gap: '1rem'}}>
                <Button
                    sx={{minWidth: 120, height: '44px'}}
                    variant="contained"
                    color="warning"
                    onClick={handleClosePopUp}
                >
                    Close
                </Button>

                {/* Chỉ hiện nếu không phải chế độ view */}
                {!isViewMode && (
                    <Button
                        sx={{minWidth: 120, height: '44px'}}
                        variant="contained"
                        color="success"
                        onClick={handleUpdateTerm}
                    >
                        Update
                    </Button>
                )}

            </DialogActions>

        </Dialog>

    )
}

function RenderFormPopUp({isPopUpOpen, handleClosePopUp, GetTerm, terms}) {

    const {enqueueSnackbar} = useSnackbar();

    const [formData, setFormData] = useState({
        grade: null,
        startDate: null,
        endDate: null,
        maxNumberRegistration: 0,
        reservationFee: 0,
        serviceFee: 0,
        uniformFee: 0,
        learningMaterialFee: 0,
        facilityFee: 0
    });


    const handleCreate = async (formData) => {
        const errorMsg = ValidateTermFormData(formData, terms);
        console.log("Validate result:", errorMsg);
        if (errorMsg) {
            enqueueSnackbar(errorMsg, { variant: "warning" });
            return;
        }

        const response = await createTerm( // CHỈ GỌI KHI HỢP LỆ
            formData.grade,
            formData.startDate,
            formData.endDate,
            formData.maxNumberRegistration,
            formData.reservationFee,
            formData.serviceFee,
            formData.uniformFee,
            formData.learningMaterialFee,
            formData.facilityFee
        );

        if (response.success) {
            enqueueSnackbar("Term created successfully!", {variant: "success"});
            handleClosePopUp(); //đóng popup
            GetTerm(); //  load lại danh sách
        } else {
            enqueueSnackbar(response.message || "Failed to create term", {variant: "error"});
        }
    };

    console.log("Form data: ", formData)

    // hàm cập nhật liên tục, onChange sẽ đc gọi, môix khi có thông tin thay đổi
    async function HandleOnChange(e) {
        const {name, value} = e.target;

        if (name === "grade") {
            try {
                console.log("Calling getDefaultGrade with value:", value);
                const response = await getDefaultGrade(value); // Gọi API theo grade
                console.log("getDefaultGrade response:", response);

                if (response && response.success && response.data) {
                    console.log("Updating form data with fees:", response.data);
                    setFormData(prev => ({
                        ...prev,
                        grade: value,
                        ...response.data // Cập nhật phí theo grade
                    }));
                    return;
                } else {
                    console.warn("Invalid response format from getDefaultGrade:", response);
                    enqueueSnackbar("Failed to load default fees. Please check the values manually.", {variant: "warning"});
                }
            } catch (err) {
                console.error("Error loading default fees:", err);
                enqueueSnackbar("Error loading default fees. Please check the values manually.", {variant: "error"});
            }
        }

        // Trường khác thì cập nhật như bình thường
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    }

    return (
        <Dialog open={isPopUpOpen} onClose={handleClosePopUp} maxWidth="sm" fullWidth>
            <DialogTitle sx={{fontWeight: 'bold', fontSize: 26, color: '#2c684f'}}>
                Create New Term
            </DialogTitle>
            <DialogContent>
                <Box sx={{mt: 2, display: 'flex', flexDirection: 'column', gap: 2}}>
                    <FormControl sx={{pl: 1}}>
                        <FormLabel

                            sx={{
                                color: '#2c684f !important',
                                '&.Mui-focused': {
                                    color: '#2c684f !important'
                                }
                            }}>Grade</FormLabel>
                        <RadioGroup
                            row
                            name="grade"
                            value={formData.grade}
                            onChange={(e) => HandleOnChange(e)}
                        >
                            <FormControlLabel value="seed" control={<Radio sx={{
                                color: '#2c684f',
                                '&.Mui-checked': {
                                    color: '#2c684f',
                                },
                                '&.Mui-focusVisible': {
                                    outline: 'none',
                                }
                            }}
                            />} label="Seed"/>
                            <FormControlLabel value="bud" control={<Radio sx={{
                                color: '#2c684f',
                                '&.Mui-checked': {
                                    color: '#2c684f',
                                },
                                '&.Mui-focusVisible': {
                                    outline: 'none',
                                }
                            }}/>} label="Bud"/>
                            <FormControlLabel value="leaf" control={<Radio sx={{
                                color: '#2c684f',
                                '&.Mui-checked': {
                                    color: '#2c684f',
                                },
                                '&.Mui-focusVisible': {
                                    outline: 'none',
                                }
                            }}/>} label="Leaf"/>
                        </RadioGroup>
                    </FormControl>

                    <Box sx={{display: 'flex', gap: 2}}>
                        <TextField
                            label="Start Date"
                            type="datetime-local"
                            name="startDate"
                            value={formData.startDate}
                            onChange={(e) => HandleOnChange(e)}
                            required
                            fullWidth
                            InputLabelProps={{shrink: true}}
                            sx={{
                                '& .MuiOutlinedInput-root': {
                                    borderRadius: '12px',
                                    '& fieldset': {
                                        borderColor: '#2c684f',
                                        borderWidth: 2,
                                    },
                                    '&:hover fieldset': {
                                        borderColor: '#2c684f',
                                    },
                                    '&.Mui-focused fieldset': {
                                        borderColor: '#2c684f',
                                        boxShadow: '0 0 0 2px #eaf3ed'
                                    },
                                }
                            }}
                        />
                        <TextField
                            label="End Date"
                            type="datetime-local"
                            required
                            fullWidth
                            name="endDate"
                            value={formData.endDate}
                            onChange={(e) => HandleOnChange(e)}
                            InputLabelProps={{shrink: true}}
                            sx={{
                                '& .MuiOutlinedInput-root': {
                                    borderRadius: '12px',
                                    '& fieldset': {
                                        borderColor: '#2c684f',
                                        borderWidth: 2,
                                    },
                                    '&:hover fieldset': {
                                        borderColor: '#2c684f',
                                    },
                                    '&.Mui-focused fieldset': {
                                        borderColor: '#2c684f',
                                        boxShadow: '0 0 0 2px #eaf3ed'
                                    },
                                }
                            }}
                        />
                    </Box>

                    <TextField
                        label="Max Registrations"
                        type="number"
                        required
                        fullWidth
                        name="maxNumberRegistration"
                        value={formData.maxNumberRegistration}
                        onChange={(e) => HandleOnChange(e)}
                        sx={{
                            '& .MuiOutlinedInput-root': {
                                borderRadius: '12px',
                                '& fieldset': {
                                    borderColor: '#2c684f',
                                    borderWidth: 2,
                                },
                                '&:hover fieldset': {
                                    borderColor: '#2c684f',
                                },
                                '&.Mui-focused fieldset': {
                                    borderColor: '#2c684f',
                                    boxShadow: '0 0 0 2px #eaf3ed'
                                },
                            }
                        }}
                    />
                    <Typography fontWeight="bold" sx={{mt: 1, mb: 0}}>Fees</Typography>
                    <TextField label="Reservation Fee"
                               type="number"
                               required
                               fullWidth
                               name="reservationFee"
                               value={formData.reservationFee}
                               onChange={(e) => HandleOnChange(e)}
                               sx={{
                                   '& .MuiOutlinedInput-root': {
                                       borderRadius: '12px',
                                       '& fieldset': {
                                           borderColor: '#2c684f',
                                           borderWidth: 2,
                                       },
                                       '&:hover fieldset': {
                                           borderColor: '#2c684f',
                                       },
                                       '&.Mui-focused fieldset': {
                                           borderColor: '#2c684f',
                                           boxShadow: '0 0 0 2px #eaf3ed'
                                       },
                                   }
                               }}
                    />
                    <TextField label="Service Fee"
                               type="number"
                               required
                               fullWidth
                               name="serviceFee"
                               value={formData.serviceFee}
                               onChange={(e) => HandleOnChange(e)}
                               sx={{
                                   '& .MuiOutlinedInput-root': {
                                       borderRadius: '12px',
                                       '& fieldset': {
                                           borderColor: '#2c684f',
                                           borderWidth: 2,
                                       },
                                       '&:hover fieldset': {
                                           borderColor: '#2c684f',
                                       },
                                       '&.Mui-focused fieldset': {
                                           borderColor: '#2c684f',
                                           boxShadow: '0 0 0 2px #eaf3ed'
                                       },
                                   }
                               }}
                    />
                    <TextField label="Uniform Fee"
                               type="number"
                               required
                               fullWidth
                               name="uniformFee"
                               value={formData.uniformFee}
                               onChange={(e) => HandleOnChange(e)}
                               sx={{
                                   '& .MuiOutlinedInput-root': {
                                       borderRadius: '12px',
                                       '& fieldset': {
                                           borderColor: '#2c684f',
                                           borderWidth: 2,
                                       },
                                       '&:hover fieldset': {
                                           borderColor: '#2c684f',
                                       },
                                       '&.Mui-focused fieldset': {
                                           borderColor: '#2c684f',
                                           boxShadow: '0 0 0 2px #eaf3ed'
                                       },
                                   }
                               }}
                    />
                    <TextField label="Learning Material Fee"
                               type="number"
                               required
                               fullWidth
                               name="learningMaterialFee"
                               value={formData.learningMaterialFee}
                               onChange={(e) => HandleOnChange(e)}
                               sx={{
                                   '& .MuiOutlinedInput-root': {
                                       borderRadius: '12px',
                                       '& fieldset': {
                                           borderColor: '#2c684f',
                                           borderWidth: 2,
                                       },
                                       '&:hover fieldset': {
                                           borderColor: '#2c684f',
                                       },
                                       '&.Mui-focused fieldset': {
                                           borderColor: '#2c684f',
                                           boxShadow: '0 0 0 2px #eaf3ed'
                                       },
                                   }
                               }}
                    />
                    <TextField label="Facility Fee"
                               type="number"
                               required
                               fullWidth
                               name="facilityFee"
                               value={formData.facilityFee}
                               onChange={(e) => HandleOnChange(e)}
                               sx={{
                                   '& .MuiOutlinedInput-root': {
                                       borderRadius: '12px',
                                       '& fieldset': {
                                           borderColor: '#2c684f',
                                           borderWidth: 2,
                                       },
                                       '&:hover fieldset': {
                                           borderColor: '#2c684f',
                                       },
                                       '&.Mui-focused fieldset': {
                                           borderColor: '#2c684f',
                                           boxShadow: '0 0 0 2px #eaf3ed'
                                       },
                                   }
                               }}
                    />
                </Box>
            </DialogContent>
            <DialogActions sx={{pb: 3, pr: 3}}>
                <Button
                    onClick={handleClosePopUp}
                    variant="outlined"
                    sx={{
                        borderRadius: '12px',
                        fontWeight: 600,
                        fontSize: 18,
                        px: 4,
                        color: '#2c684f',
                        borderColor: '#2c684f',
                        '&:hover': {backgroundColor: '#eaf3ed', borderColor: '#22513c'}
                    }}
                >
                    Cancel
                </Button>
                <Button
                    variant="contained"
                    sx={{
                        borderRadius: '12px',
                        fontWeight: 600,
                        fontSize: 18,
                        px: 4,
                        backgroundColor: '#2c684f',
                        '&:hover': {backgroundColor: '#22513c'}
                    }}
                    onClick={() => handleCreate(formData)}
                >
                    Save Change
                </Button>
            </DialogActions>
        </Dialog>
    )
}


function RenderPage({openFormPopUpFunc, openDetailPopUpFunc, terms, HandleSelectedTerm}) {
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
                    Create new term
                </Button>
            </Box>

            {/*3. cần 1 bảng để hiện list */}
            <RenderTable
                terms={terms}
                openDetailPopUpFunc={openDetailPopUpFunc}
                HandleSelectedTerm={HandleSelectedTerm}
            />
        </div>
    )
}


export default function TermAdmission() {
    const [popUp, setPopUp] = useState({
        isOpen: false,
        type: '', // 'view' or 'update'
        term: null
    });

    const handleOpenPopUp = (type) => {
        setPopUp({...popUp, isOpen: true, type: type})
    }

    const handleClosePopUp = () => {
        setPopUp({...popUp, isOpen: false, type: ''})
        GetTerm(); //gọi lại api để cập nhật data
    }

    //tạo useState data của BE để sài (dành cho form)
    const [data, setData] = useState({
        terms: [],
    })

    const [selectedTerm, setSelectedTerm] = useState(null) // tuong trung cho 1 cai selected

    function HandleSelectedTerm(term) {
        setSelectedTerm(term)
    }

    //useEffcet sẽ chạy lần đầu tiên, or sẽ chạy khi có thay đổi
    useEffect(() => {
        //lấy data lên và lưu data vào getForm
        GetTerm()
    }, []);

    //gọi API form list //save trực tiếp data
    async function GetTerm() {
        const response = await getTermList()
        if (response && response.success) {
            setData({
                ...data,
                terms: response.data
            })
        }
    }

    return (
        <>
            <RenderPage
                terms={data.terms}
                openFormPopUpFunc={() => handleOpenPopUp('form')}
                openDetailPopUpFunc={(type) => handleOpenPopUp(type)}
                HandleSelectedTerm={HandleSelectedTerm}
            />

            {
                popUp.isOpen && popUp.type === 'form' &&
                <RenderFormPopUp
                    isPopUpOpen={popUp.isOpen}
                    handleClosePopUp={handleClosePopUp}
                    GetTerm={GetTerm}
                    terms={data.terms}
                />
            }
            {
                popUp.isOpen && (popUp.type === 'view' || popUp.isOpen && popUp.type === 'edit') &&
                <RenderDetailPopUp
                    isPopUpOpen={popUp.isOpen}
                    handleClosePopUp={handleClosePopUp}
                    selectedTerm={selectedTerm}
                    GetTerm={GetTerm}
                    mode={popUp.type}
                />
            }
        </>
    );
}