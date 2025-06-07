import React, { useEffect, useState } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import authService from "@services/authService";
import { getCurrentTokenData } from "@services/JWTService";
import { getDashboardRoute, AUTH_ROUTES } from "@/constants/routes";
import Input from "../atoms/Input";

// Helper function to handle role-based navigation
const handleRoleBasedNavigation = (navigate, tokenData) => {
    if (!tokenData?.role) {
        navigate("/");
        return;
    }
    
    const role = tokenData.role.toLowerCase();
    console.log("User role:", role);
    
    // Use the centralized dashboard route logic
    const dashboardRoute = getDashboardRoute(role);
    navigate(dashboardRoute);
};

// Helper function to store user data in localStorage
const storeUserData = (userData, email) => {
    const userInfo = {
        user: {
            name: userData?.name || userData?.data?.name,
            email: userData?.email || userData?.data?.email || email,
            role: userData?.role || userData?.data?.role,
        }
    };
    localStorage.setItem('user', JSON.stringify(userInfo));
};

function Login() {
    const navigate = useNavigate();
    const location = useLocation();
    
    // Get success message and pre-filled email from signup redirect
    const successMessage = location.state?.message;
    const prefilledEmail = location.state?.email || "";
      // Get redirect parameters from URL
    const urlParams = new URLSearchParams(location.search);
    const redirectUrl = urlParams.get('redirect') || location.state?.returnUrl;
    
    const [email, setEmail] = useState(prefilledEmail);
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [errors, setErrors] = useState({});
    const [showSuccessMessage, setShowSuccessMessage] = useState(!!successMessage);

    // Auto-hide success message after 5 seconds
    useEffect(() => {
        if (successMessage) {
            const timer = setTimeout(() => {
                setShowSuccessMessage(false);
            }, 5000);
            return () => clearTimeout(timer);
        }
    }, [successMessage]);    // Display messages for enrollment redirects
    useEffect(() => {
        if (redirectUrl?.includes('enrollment')) {
            console.log('User redirected from enrollment page');
            // Could show a specific message here
        }
    }, [redirectUrl]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setErrors({});        try {
            console.log("Starting login process...");
            const response = await authService.login({ email, password });
            console.log("Login response:", response);            if (response?.success || response?.token || response?.data?.token) {
                console.log("Login successful, storing user data...");
                
                // Store user data
                storeUserData(response?.data || response, email);

                // Get current token data for navigation
                const tokenData = getCurrentTokenData();
                console.log("Token data for navigation:", tokenData);

                // Check for first login indicators
                const responseData = response?.data || response;
                const isFirstLogin = responseData?.firstLogin || 
                                   responseData?.tempPassword || 
                                   responseData?.requirePasswordChange ||
                                   responseData?.isFirstLogin;

                // Handle redirect logic
                if (redirectUrl) {
                    console.log("Redirecting to:", redirectUrl);
                    navigate(redirectUrl, { 
                        replace: true,
                        state: { 
                            loginSuccess: true,
                            message: redirectUrl.includes('enrollment') 
                                ? "Đăng nhập thành công! Bạn có thể tiếp tục đăng ký nhập học."
                                : "Đăng nhập thành công!"
                        }
                    });
                } else if (isFirstLogin) {
                    // Redirect to profile page for first login
                    console.log("First login detected, redirecting to profile...");
                    navigate('/user/shared/profile', { 
                        replace: true,
                        state: { 
                            firstLogin: true,
                            message: "Chào mừng! Vui lòng cập nhật mật khẩu và thông tin cá nhân."
                        }
                    });
                } else {
                    // Use role-based navigation
                    handleRoleBasedNavigation(navigate, tokenData);
                }
            } else {
                console.error("Login failed: Invalid response format");
                setErrors({ submit: "Đăng nhập thất bại. Vui lòng thử lại." });
            }
        } catch (error) {
            console.error("Login error:", error);
            
            if (error.response?.status === 401) {
                setErrors({ 
                    submit: "Email hoặc mật khẩu không đúng. Vui lòng thử lại." 
                });
            } else if (error.response?.data?.message) {
                setErrors({ submit: error.response.data.message });
            } else {
                setErrors({ 
                    submit: "Đã xảy ra lỗi. Vui lòng thử lại sau." 
                });
            }
        } finally {
            setIsLoading(false);
        }
    };    const loginFormProps = {
        email,
        setEmail,
        password,
        setPassword,
        handleSubmit,
        isLoading,
        errors,
        showSuccessMessage,
        successMessage,
        redirectInfo: redirectUrl ? {
            isFromEnrollment: redirectUrl.includes('enrollment'),
            message: redirectUrl.includes('enrollment') 
                ? "Vui lòng đăng nhập để tiếp tục đăng ký nhập học."
                : "Vui lòng đăng nhập để tiếp tục."
        } : null
    };    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-indigo-50 py-8 px-4">
            <div className="w-full max-w-md mx-auto bg-white/95 backdrop-blur-sm border border-gray-200/50 shadow-xl rounded-3xl p-8 space-y-8 animate-fade-in relative overflow-hidden">
                {/* Decorative Background Elements */}
                <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"></div>
                <div className="absolute -top-4 -right-4 w-24 h-24 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full blur-xl"></div>
                <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-gradient-to-br from-purple-400/15 to-pink-400/15 rounded-full blur-xl"></div>

                {/* Header */}
                <div className="text-center space-y-4 relative z-10">
                    <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-3xl mx-auto flex items-center justify-center shadow-lg">
                        <img src="/SUNSHINE.png" alt="Sunshine Preschool" className="w-12 h-12 object-contain filter brightness-0 invert" />
                    </div>
                    <div>
                        <h2 className="text-3xl font-bold text-gray-800 tracking-tight mb-2">
                            Chào mừng trở lại
                        </h2>
                        <p className="text-gray-600 text-lg font-medium mb-4">
                            Đăng nhập để tiếp tục hành trình học tập
                        </p>
                        <p className="text-gray-500 text-sm">
                            Chưa có tài khoản?{' '}
                            <Link
                                to={AUTH_ROUTES.REGISTER}
                                className="font-semibold text-blue-600 hover:text-purple-600 underline underline-offset-2 transition-colors"
                            >
                                Đăng ký ngay
                            </Link>
                        </p>
                    </div>
                </div>                {/* Success Message */}
                {showSuccessMessage && successMessage && (
                    <div className="bg-green-50/80 backdrop-blur-sm border border-green-200/60 rounded-xl p-4 relative z-10">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                                <svg className="h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                </svg>
                            </div>
                            <span className="text-sm font-medium text-green-800">{successMessage}</span>
                        </div>
                    </div>
                )}
                {/* Redirect Info */}
                {loginFormProps.redirectInfo && (
                    <div className="bg-blue-50/80 backdrop-blur-sm border border-blue-200/60 rounded-xl p-4 relative z-10">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                                <svg className="h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                                </svg>
                            </div>
                            <span className="text-sm font-medium text-blue-800">{loginFormProps.redirectInfo.message}</span>
                        </div>
                    </div>
                )}                {/* Login Form */}
                <form className="space-y-6 relative z-10" onSubmit={handleSubmit}>
                    <div className="space-y-4">
                        <div className="relative group">
                            <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none">
                                <svg className="w-5 h-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                                </svg>
                            </div>
                            <Input
                                id="email"
                                name="email"
                                type="email"
                                autoComplete="email"
                                required
                                size="md"
                                variant="default"
                                className="pl-12 pr-4 py-3.5 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:ring-3 focus:ring-blue-500/20 bg-white/80 backdrop-blur-sm text-gray-800 placeholder-gray-400 transition-all duration-300 hover:border-gray-300 group-hover:shadow-md"
                                placeholder="Địa chỉ email của bạn"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                        <div className="relative group">
                            <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none">
                                <svg className="w-5 h-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                </svg>
                            </div>
                            <Input
                                id="password"
                                name="password"
                                type="password"
                                autoComplete="current-password"
                                required
                                size="md"
                                variant="default"
                                className="pl-12 pr-4 py-3.5 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:ring-3 focus:ring-blue-500/20 bg-white/80 backdrop-blur-sm text-gray-800 placeholder-gray-400 transition-all duration-300 hover:border-gray-300 group-hover:shadow-md"
                                placeholder="Mật khẩu của bạn"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                    </div>                    {/* Error Message */}
                    {errors.submit && (
                        <div className="bg-red-50/80 backdrop-blur-sm border border-red-200/60 rounded-xl p-4 flex items-center gap-3">
                            <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center flex-shrink-0">
                                <svg className="h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                </svg>
                            </div>
                            <span className="text-sm font-medium text-red-800">{errors.submit}</span>
                        </div>
                    )}                    <div className="pt-2">
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full flex justify-center items-center py-4 px-6 text-lg font-bold rounded-2xl text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-3 focus:ring-blue-500/20 transition-all duration-300 shadow-xl transform hover:scale-[1.02] hover:shadow-2xl active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:hover:scale-100"
                        >
                            {isLoading ? (
                                <>
                                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    <span>Đang đăng nhập...</span>
                                </>
                            ) : (
                                <>
                                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                                    </svg>
                                    <span>Đăng nhập ngay</span>
                                </>
                            )}
                        </button>
                    </div>                </form>
                <div className="text-center relative z-10">
                    <Link
                        to={AUTH_ROUTES.FORGOT_PASSWORD}
                        className="font-medium text-blue-600 hover:text-purple-600 underline underline-offset-2 transition-colors text-sm"
                    >
                        Quên mật khẩu?
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default Login;