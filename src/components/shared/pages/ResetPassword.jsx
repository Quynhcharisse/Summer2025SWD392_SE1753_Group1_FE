import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
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
  Divider,
  IconButton
} from "@mui/material";
import {
  Lock,
  LockReset,
  CheckCircle,
  Warning,
  ArrowBack,
  Visibility,
  VisibilityOff
} from "@mui/icons-material";
import { useSnackbar } from 'notistack';
import authService from "@services/authService";
import { AUTH_ROUTES } from "@/constants/routes";

const ResetPassword = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const code = searchParams.get('code');
  const { enqueueSnackbar } = useSnackbar();
  
  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: ""
  });
  
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Check if code exists
  useEffect(() => {
    if (!code) {
      navigate('/forgot-password');
      return;
    }
  }, [code, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.password) {
      newErrors.password = 'New password cannot be empty';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);
    setErrors({});

    try {
      const response = await authService.resetPasswordWithCode({
        code: code,
        newPassword: formData.password,
        confirmPassword: formData.confirmPassword
      });
      
      setSuccess(true);
      enqueueSnackbar('Password reset successfully!', { variant: 'success' });
      
      // Auto redirect to login after 3 seconds
      setTimeout(() => {
        navigate(AUTH_ROUTES.LOGIN, {
          state: {
            message: 'Password has been reset successfully! Please login with your new password.'
          }
        });
      }, 3000);
      
    } catch (error) {
      const errorMessage = error.response?.data?.message;
      
      if (errorMessage?.includes('code') || errorMessage?.includes('expired') || errorMessage?.includes('invalid')) {
        setErrors({
          submit: 'Password reset code has expired or is invalid. Please request a new code.'
        });
      } else {
        setErrors({
          submit: errorMessage || 'An error occurred. Please try again.'
        });
      }
      enqueueSnackbar(errors.submit || 'Password reset failed', { variant: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleTogglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleToggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
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
                    Success!
                  </Typography>

                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                    Your password has been reset successfully.
                  </Typography>

                  <Box sx={{ my: 2 }}>
                    <CircularProgress 
                      size={32} 
                      sx={{ 
                        color: '#07663a',
                        mb: 1
                      }} 
                    />
                    <Typography variant="body2" color="text.secondary">
                      Redirecting to login page...
                    </Typography>
                  </Box>

                  <Alert
                    severity="success"
                    sx={{
                      width: '100%',
                      borderRadius: 2,
                      fontSize: '0.875rem'
                    }}
                  >
                    If you are not redirected automatically,{' '}
                    <Link
                      to={AUTH_ROUTES.LOGIN}
                      style={{
                        color: '#07663a',
                        textDecoration: 'none',
                        fontWeight: 600
                      }}
                    >
                      click here
                    </Link>
                  </Alert>
                </Stack>
              </CardContent>
            </Card>
          </Zoom>
        </Container>
      </Box>
    );
  }

  // Invalid code state
  if (!code) {
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
          <Fade in={true} timeout={500}>
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
                      bgcolor: 'error.main',
                      mb: 1
                    }}
                  >
                    <Warning sx={{ fontSize: 28 }} />
                  </Avatar>

                  <Typography
                    variant="h5"
                    fontWeight="600"
                    sx={{
                      color: '#d32f2f',
                      mb: 0.5
                    }}
                  >
                    Invalid Link
                  </Typography>

                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                    The password reset link is invalid or has expired.
                  </Typography>

                  <Stack direction="row" spacing={1.5} width="100%">
                    <Button
                      variant="contained"
                      fullWidth
                      component={Link}
                      to="/forgot-password"
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
                      Request New Link
                    </Button>

                    <Button
                      variant="outlined"
                      fullWidth
                      component={Link}
                      to={AUTH_ROUTES.LOGIN}
                      sx={{
                        borderRadius: 2,
                        py: 1,
                        fontSize: '0.875rem',
                        borderColor: '#07663a',
                        color: '#07663a',
                        '&:hover': {
                          borderColor: '#05512e',
                          bgcolor: 'rgba(7, 102, 58, 0.04)'
                        }
                      }}
                    >
                      Back to Login
                    </Button>
                  </Stack>
                </Stack>
              </CardContent>
            </Card>
          </Fade>
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
        <Fade in={true} timeout={500}>
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
                    <LockReset sx={{ fontSize: 24 }} />
                  </Avatar>

                  <Typography
                    variant="h5"
                    fontWeight="600"
                    sx={{
                      color: '#07663a',
                      mb: 0.5
                    }}
                  >
                    Reset Password
                  </Typography>

                  <Typography variant="body2" color="text.secondary">
                    Please enter a new password for your account
                  </Typography>
                </Box>

                {/* Form */}
                <Box component="form" onSubmit={handleSubmit}>
                  <Stack spacing={2}>
                    <TextField
                      fullWidth
                      type={showPassword ? 'text' : 'password'}
                      label="New Password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      error={!!errors.password}
                      helperText={errors.password}
                      disabled={loading}
                      size="medium"
                      InputProps={{
                        startAdornment: (
                          <Lock sx={{ color: 'text.secondary', mr: 1, fontSize: 20 }} />
                        ),
                        endAdornment: (
                          <IconButton
                            onClick={handleTogglePasswordVisibility}
                            edge="end"
                            size="small"
                          >
                            {showPassword ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
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
                      placeholder="Enter new password"
                    />

                    <TextField
                      fullWidth
                      type={showConfirmPassword ? 'text' : 'password'}
                      label="Confirm Password"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      error={!!errors.confirmPassword}
                      helperText={errors.confirmPassword}
                      disabled={loading}
                      size="medium"
                      InputProps={{
                        startAdornment: (
                          <Lock sx={{ color: 'text.secondary', mr: 1, fontSize: 20 }} />
                        ),
                        endAdornment: (
                          <IconButton
                            onClick={handleToggleConfirmPasswordVisibility}
                            edge="end"
                            size="small"
                          >
                            {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
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
                      placeholder="Re-enter new password"
                    />

                    {errors.submit && (
                      <Fade in={!!errors.submit}>
                        <Alert
                          severity="error"
                          sx={{
                            borderRadius: 2,
                            fontSize: '0.875rem'
                          }}
                          action={
                            errors.submit.includes('expired') && (
                              <Button
                                component={Link}
                                to="/forgot-password"
                                size="small"
                                sx={{ color: '#07663a' }}
                              >
                                Request New Code
                              </Button>
                            )
                          }
                        >
                          {errors.submit}
                        </Alert>
                      </Fade>
                    )}

                    <Button
                      type="submit"
                      variant="contained"
                      fullWidth
                      disabled={loading}
                      startIcon={loading ? <CircularProgress size={18} /> : <LockReset />}
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
                      {loading ? 'Processing...' : 'Reset Password'}
                    </Button>
                  </Stack>
                </Box>

                <Divider sx={{ my: 1 }} />

                {/* Footer */}
                <Stack spacing={1.5} alignItems="center">
                  <Button
                    variant="text"
                    component={Link}
                    to={AUTH_ROUTES.LOGIN}
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
                </Stack>
              </Stack>
            </CardContent>
          </Card>
        </Fade>
      </Container>
    </Box>
  );
};

export default ResetPassword;
