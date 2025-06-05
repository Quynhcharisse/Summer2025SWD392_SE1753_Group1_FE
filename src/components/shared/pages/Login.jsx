import React, { useEffect, useState } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import authService from "@services/authService";
import { getCurrentTokenData } from "@services/JWTService";
import { getDashboardRoute, ROUTES, AUTH_ROUTES } from "@/constants/routes";

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
            console.log("Login response:", response);

            if (response?.success || response?.token || response?.data?.token) {
                console.log("Login successful, storing user data...");
                
                // Store user data
                storeUserData(response?.data || response, email);

                // Get current token data for navigation
                const tokenData = getCurrentTokenData();
                console.log("Token data for navigation:", tokenData);

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
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8">
                <div>                    <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                        Đăng nhập vào tài khoản
                    </h2>                    <p className="mt-2 text-center text-sm text-gray-600">
                        Hoặc{" "}
                        <Link
                            to={AUTH_ROUTES.REGISTER}
                            className="font-medium text-indigo-600 hover:text-indigo-500"
                        >
                            tạo tài khoản mới
                        </Link>
                    </p>
                </div>
                
                {/* Success Message */}
                {showSuccessMessage && successMessage && (
                    <div className="bg-green-50 border border-green-200 rounded-md p-4">
                        <div className="flex">
                            <div className="flex-shrink-0">
                                <svg className="h-5 w-5 text-green-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                </svg>
                            </div>
                            <div className="ml-3">
                                <p className="text-sm font-medium text-green-800">{successMessage}</p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Redirect Info */}
                {loginFormProps.redirectInfo && (
                    <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
                        <div className="flex">
                            <div className="flex-shrink-0">
                                <svg className="h-5 w-5 text-blue-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                                </svg>
                            </div>
                            <div className="ml-3">
                                <p className="text-sm font-medium text-blue-800">{loginFormProps.redirectInfo.message}</p>
                            </div>
                        </div>
                    </div>
                )}
                
                {/* Login Form */}
                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    <div className="rounded-md shadow-sm -space-y-px">
                        <div>
                            <label htmlFor="email" className="sr-only">
                                Email
                            </label>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                autoComplete="email"
                                required
                                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                                placeholder="Địa chỉ email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                        <div>
                            <label htmlFor="password" className="sr-only">
                                Mật khẩu
                            </label>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                autoComplete="current-password"
                                required
                                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                                placeholder="Mật khẩu"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                    </div>

                    {/* Error Message */}
                    {errors.submit && (
                        <div className="bg-red-50 border border-red-200 rounded-md p-4">
                            <div className="flex">
                                <div className="flex-shrink-0">
                                    <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                    </svg>
                                </div>
                                <div className="ml-3">
                                    <p className="text-sm font-medium text-red-800">{errors.submit}</p>
                                </div>
                            </div>
                        </div>
                    )}

                    <div>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isLoading ? (
                                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                            ) : null}
                            {isLoading ? "Đang đăng nhập..." : "Đăng nhập"}
                        </button>
                    </div>
                </form>                  <div className="text-center">
                    <Link
                        to={AUTH_ROUTES.FORGOT_PASSWORD}
                        className="font-medium text-indigo-600 hover:text-indigo-500"
                    >
                        Quên mật khẩu?
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default Login;