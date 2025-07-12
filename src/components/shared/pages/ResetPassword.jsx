import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { PageTemplate } from "@templates";
import authService from "@services/authService";
import { AUTH_ROUTES } from "@/constants/routes";

const ResetPassword = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const code = searchParams.get('code'); // Reset code from URL
  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: ""
  });
  
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  // Check if code exists
  useEffect(() => {
    if (!code) {
      navigate('/forgot-password');
      return;
    }
//     console.log('Reset code from URL:', code);
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
      // Call the new API endpoint: POST /api/v1/auth/password/forgot/reset
      const response = await authService.resetPasswordWithCode({
        code: code,
        newPassword: formData.password,
        confirmPassword: formData.confirmPassword
      });
      
//       console.log('Reset password success:', response);
      setSuccess(true);
      
      // Auto redirect to login after 3 seconds
      setTimeout(() => {
        navigate(AUTH_ROUTES.LOGIN, {
          state: {
            message: 'Password has been reset successfully! Please login with your new password.'
          }
        });
      }, 3000);
      
    } catch (error) {
//       console.error('Password reset error:', error);
      
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
    } finally {
      setLoading(false);
    }
  };

  // Success state
  if (success) {
    return (
      <PageTemplate
        title="Password Reset Successful"
        showHeader={false}
        showFooter={false}
      >
        <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg p-8">
          <div className="text-center">
            <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Success!
            </h2>
            
            <p className="text-gray-600 mb-6">
              Your password has been reset successfully.
              Redirecting to login page...
            </p>
            
            <div className="flex justify-center mb-4">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
            
            <p className="text-sm text-gray-500">
              If you are not redirected automatically,
              <Link to={AUTH_ROUTES.LOGIN} className="text-blue-600 hover:underline ml-1">
                click here
              </Link>
            </p>
          </div>
        </div>
      </PageTemplate>
    );
  }

  // Invalid code state
  if (!code) {
    return (
      <PageTemplate
        title="Invalid Link"
        showHeader={false}
        showFooter={false}
      >
        <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg p-8">
          <div className="text-center">
            <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
              <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Invalid Link
            </h2>
            
            <p className="text-gray-600 mb-6">
              The password reset link is invalid or has expired.
            </p>
            
            <div className="space-y-3">
              <Link
                to="/forgot-password"
                className="block w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 text-center transition-colors"
              >
                Request a new link
              </Link>
              
              <Link
                to={AUTH_ROUTES.LOGIN}
                className="block w-full text-center text-gray-600 hover:text-gray-800 transition-colors"
              >
                Back to login
              </Link>
            </div>
          </div>
        </div>
      </PageTemplate>
    );
  }

  // Form state
  return (
    <PageTemplate
      title="Reset Password"
      subtitle="Enter your new password"
      showHeader={false}
      showFooter={false}
    >
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg">
        <div className="px-8 py-6">
          <div className="text-center mb-6">
            <div className="mx-auto w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
              </svg>
            </div>
            
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Reset Password
            </h2>
            
            <p className="text-gray-600">
              Please enter a new password for your account
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* New Password */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                New Password *
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.password ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Enter new password"
                disabled={loading}
              />
              {errors.password && (
                <p className="text-red-500 text-sm mt-1">{errors.password}</p>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                Confirm Password *
              </label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.confirmPassword ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Re-enter new password"
                disabled={loading}
              />
              {errors.confirmPassword && (
                <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>
              )}
            </div>

            {/* Submit Error */}
            {errors.submit && (
              <div className="bg-red-50 border border-red-200 rounded-md p-3">
                <p className="text-red-600 text-sm">{errors.submit}</p>
                {errors.submit.includes('expired') && (
                  <Link 
                    to="/forgot-password"
                    className="text-blue-600 hover:underline text-sm mt-2 block"
                  >
                    Request new code →
                  </Link>
                )}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Processing...
                </div>
              ) : (
                'Reset Password'
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <Link 
              to={AUTH_ROUTES.LOGIN} 
              className="text-sm text-gray-600 hover:text-gray-800"
            >
              ← Back to login
            </Link>
          </div>
        </div>
      </div>
    </PageTemplate>
  );
};

export default ResetPassword;
