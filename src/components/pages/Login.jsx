import {Box, Button, Link, Paper, Stack, TextField, Typography} from "@mui/material";
import '@/styles/login.css'
import {Key, Mail} from "lucide-react";
import {login, logout} from "@/services/AuthService.jsx";
import {useEffect, useState} from "react";
import Cookies from "js-cookie";
import {jwtDecode} from "jwt-decode";
import {enqueueSnackbar} from "notistack";

const provider = [{
    id: "credentials",
    name: "Email and Password",
}]

async function handleSignIn(email, password) {
    const response = await login(email, password)
    if (response) {
        console.log(response)
        return response
    }
}

const signInPage = async (provider, email, password) => {

    if (provider === 'credentials') {

        handleSignIn(email, password).then(res => {
            if (res && res.success) {
              alert("Successfully logged in")

                const userAcc = {
                    user: {
                        name: res.data.name,
                        email: res.data.email,
                    }
                }
                localStorage.setItem('user', JSON.stringify(userAcc));
                const accessToken = Cookies.get('access');
                if (accessToken) {
                    const decode = jwtDecode(accessToken);
                    const role = decode.role;

                    switch (role.toLowerCase()) {
                        case 'admission':
                            window.location.href = "/admission/view/profile";
                            break;

                        default:
                            window.location.href = "/login";
                    }
                    return role;
                }
            } else {
                enqueueSnackbar(res.message, {variant: 'error'});
            }
        });
    }
}


function Login() {
   const [email, setEmail] = useState("");
   const [password, setPassword] = useState("");

    if (localStorage.length > 0) {
        localStorage.clear()
    }
    console.log("email: ",  email , " password: " , password);
    // chay 1 lan duy nhat
    useEffect(() => {
        async function signOut() {
            return await logout();
        }

        signOut().then(res => {
            console.log(res);
        });
    }, [])

    return (
        <Paper elevation={3} sx={{p: 4, borderRadius: 3, border: "2px solid #2e7d32"}} className="container">
            <Box textAlign="center" mb={3}>
                <img src="/SUNSHINE.png" alt="logo" style={{ maxHeight: "60px" }} />
            </Box>

            <Typography variant="h5" sx={{mb: 3, fontWeight: "medium"}}>
                SIGN IN
            </Typography>
            <form className="form-login">
                <Stack spacing={3}>
                    {/* Email */}
                    <TextField
                        label={
                            <span style={{display: "flex", alignItems: "center", gap: 4}}>
                        <Mail size={16}/>Email: <span style={{color: "red"}}>*</span>
                         </span>
                        }
                        placeholder="Enter your passwword"
                        fullWidth
                        variant="outlined"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        sx={{
                            "& .MuiOutlinedInput-root": {
                                borderRadius: "12px",
                            },
                            input: {
                                "::placeholder": {
                                    color: "#999",
                                    fontStyle: "italic",
                                },
                            },
                        }}
                    />

                    {/* Password */}
                    <TextField
                        label={
                            <span style={{display: "flex", alignItems: "center", gap: 4}}>
                        <Key size={16}/>Password: <span style={{color: "red"}}>*</span>
                         </span>
                        }
                        placeholder="Enter your password"
                        fullWidth
                        variant="outlined"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        sx={{
                            "& .MuiOutlinedInput-root": {
                                borderRadius: "12px",
                            },
                            input: {
                                "::placeholder": {
                                    color: "#999",
                                    fontStyle: "italic",
                                },
                            },
                        }}
                    />
                    {/* Buttons */}
                    <Box display="flex" flexDirection="row" justifyContent="center" gap={2}>
                        <Button
                            variant="contained"
                            color="warning"
                            onClick={() => {
                                if (!email || !password) {
                                    enqueueSnackbar("Please enter both email and password", {variant: "warning"});
                                    return;
                                }
                                signInPage('credentials', email, password);
                            }}
                        >
                            SIGN UP
                        </Button>
                    </Box>

                    {/* Links dưới nút */}
                    <Box display="flex" justifyContent="space-between" mt={1}>
                        <Link href="/forgot-password" variant="body2">
                            Forgot password?
                        </Link>
                        <Link href="/signup" variant="body2">
                            Don't have an account? Sign up
                        </Link>
                    </Box>
                </Stack>
            </form>
        </Paper>
    )
}

export default Login