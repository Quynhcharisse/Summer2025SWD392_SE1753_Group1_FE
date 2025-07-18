import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  Alert,
  CircularProgress,
  Container,
  Stack,
  Avatar,
  Fade,
  Zoom,
  IconButton,
  Divider
} from "@mui/material";
import {
  Email,
  Lock,
  ArrowBack,
  CheckCircle,
  Send,
  Refresh
} from "@mui/icons-material";
import { useSnackbar } from 'notistack';
import authService from "@services/authService";
import { AUTH_ROUTES } from "@/constants/routes";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!email.trim()) {
      setError("Please enter your email");
      return;
    }

    if (!validateEmail(email)) {
      setError("Invalid email format");
      return;
    }

    setLoading(true);

    try {
      await authService.requestPasswordReset(email);
      setSuccess(true);
      enqueueSnackbar("Password reset email sent successfully!", { variant: "success" });
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Something went wrong. Please try again later.";
      setError(errorMessage);
      enqueueSnackbar(errorMessage, { variant: "error" });
    } finally {
      setLoading(false);
    }
  };

  const handleResendEmail = () => {
    setSuccess(false);
    setEmail("");
    setError("");
  };

  const handleBackToLogin = () => {
    navigate(AUTH_ROUTES.LOGIN);
  };

  // Success state
  if (success) {
    return (
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          padding: 2
        }}
      >
        <Container maxWidth="xs">
          <Zoom in={success} timeout={600}>
            <Card
              elevation={12}
              sx={{
                borderRadius: 3,
                overflow: 'hidden',
                background: 'rgba(255, 255, 255, 0.95)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.2)'
              }}
            >
              <CardContent sx={{ p: 3 }}>
                <Stack spacing={2.5} alignItems="center" textAlign="center">
                  <Avatar
                    sx={{
                      width: 56,
                      height: 56,
                      bgcolor: 'success.main',
                      mb: 1
                    }}
                  >
                    <CheckCircle sx={{ fontSize: 28 }} />
                  </Avatar>

                  <Typography
                    variant="h5"
                    fontWeight="600"
                    sx={{
                      color: '#07663a',
                      mb: 0.5
                    }}
                  >
                    Email Sent Successfully!
                  </Typography>

                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                    We've sent a password reset link to:
                  </Typography>

                  <Box
                    sx={{
                      bgcolor: 'grey.50',
                      borderRadius: 2,
                      p: 1.5,
                      border: '1px solid',
                      borderColor: 'success.main',
                      width: '100%'
                    }}
                  >
                    <Typography variant="body2" color="success.main" fontWeight="600">
                      {email}
                    </Typography>
                  </Box>

                  <Alert
                    severity="info"
                    sx={{
                      width: '100%',
                      borderRadius: 2,
                      fontSize: '0.875rem'
                    }}
                  >
                    Please check your inbox and spam folder for the reset link.
                  </Alert>

                  <Stack direction="row" spacing={1.5} width="100%">
                    <Button
                      variant="outlined"
                      fullWidth
                      onClick={handleResendEmail}
                      startIcon={<Refresh />}
                      sx={{
                        borderRadius: 2,
                        py: 1,
                        fontSize: '0.875rem',
                        borderColor: 'primary.main',
                        color: 'primary.main',
                        '&:hover': {
                          borderColor: 'primary.dark',
                          bgcolor: 'primary.50'
                        }
                      }}
                >
                      Resend
                    </Button>

                    <Button
                      variant="contained"
                      fullWidth
                      onClick={handleBackToLogin}
                      startIcon={<ArrowBack />}
                      sx={{
                        borderRadius: 2,
                        py: 1,
                        fontSize: '0.875rem',
                        bgcolor: '#07663a',
                        '&:hover': {
                          bgcolor: '#05512e'
                        }
                      }}
                >
                  Back to Login
                    </Button>
                  </Stack>
                </Stack>
              </CardContent>
            </Card>
          </Zoom>
        </Container>
      </Box>
    );
  }

  // Form state
  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        padding: 2
      }}
    >
      <Container maxWidth="xs">
        <Fade in={!success} timeout={500}>
          <Card
            elevation={12}
            sx={{
              borderRadius: 3,
              overflow: 'hidden',
              background: 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.2)'
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <Stack spacing={2.5}>
                {/* Header */}
                <Box textAlign="center">
                  <Avatar
                    sx={{
                      width: 48,
                      height: 48,
                      bgcolor: '#07663a',
                      mx: 'auto',
                      mb: 1.5
                    }}
                  >
                    <Lock sx={{ fontSize: 24 }} />
                  </Avatar>

                  <Typography
                    variant="h5"
                    fontWeight="600"
                    sx={{
                      color: '#07663a',
                      mb: 0.5
                    }}
                  >
                    Forgot Password?
                  </Typography>

                  <Typography variant="body2" color="text.secondary">
                    Enter your email and we'll send you a reset link
                  </Typography>
                </Box>

                {/* Form */}
                <Box component="form" onSubmit={handleSubmit}>
                  <Stack spacing={2}>
                    <TextField
                      fullWidth
                    type="email"
                      label="Email Address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                      error={!!error}
                    disabled={loading}
                      size="medium"
                      InputProps={{
                        startAdornment: (
                          <Email sx={{ color: 'text.secondary', mr: 1, fontSize: 20 }} />
                        )
                      }}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 2,
                          '& fieldset': {
                            borderColor: 'rgba(0, 0, 0, 0.23)'
                          },
                          '&:hover fieldset': {
                            borderColor: '#07663a'
                          },
                          '&.Mui-focused fieldset': {
                            borderColor: '#07663a'
                          }
                        },
                        '& .MuiInputLabel-root': {
                          '&.Mui-focused': {
                            color: '#07663a'
                          }
                        }
                      }}
                      placeholder="Enter your email address"
                    />

              {error && (
                      <Fade in={!!error}>
                        <Alert
                          severity="error"
                          sx={{
                            borderRadius: 2,
                            fontSize: '0.875rem'
                          }}
                        >
                          {error}
                        </Alert>
                      </Fade>
              )}

                    <Button
                  type="submit"
                      variant="contained"
                      fullWidth
                  disabled={loading}
                      startIcon={loading ? <CircularProgress size={18} /> : <Send />}
                      sx={{
                        borderRadius: 2,
                        py: 1.2,
                        fontSize: '0.875rem',
                        fontWeight: 600,
                        bgcolor: '#07663a',
                        '&:hover': {
                          bgcolor: '#05512e'
                        },
                        '&.Mui-disabled': {
                          bgcolor: 'grey.300'
                        }
                      }}
                    >
                      {loading ? 'Sending...' : 'Send Reset Link'}
                    </Button>
                  </Stack>
                </Box>

                <Divider sx={{ my: 1 }} />

                {/* Footer */}
                <Stack spacing={1.5} alignItems="center">
                  <Button
                    variant="text"
                    onClick={handleBackToLogin}
                    startIcon={<ArrowBack />}
                    sx={{
                      color: 'text.secondary',
                      fontSize: '0.875rem',
                      '&:hover': {
                        color: '#07663a',
                        bgcolor: 'transparent'
                      }
                    }}
                  >
                    Back to Login
                  </Button>

                  <Typography variant="body2" color="text.secondary" textAlign="center">
                    Don't have an account?{' '}
                    <Link
                      to="/auth/register"
                      style={{
                        color: '#07663a',
                        textDecoration: 'none',
                        fontWeight: 600
                      }}
                    >
                  Register now
                </Link>
                  </Typography>
                </Stack>
              </Stack>
            </CardContent>
          </Card>
        </Fade>
      </Container>
    </Box>
  );
};

export default ForgotPassword;
