import React, { useState } from "react";
import PropTypes from "prop-types";
import { useNavigate, Link } from "react-router-dom";
import authService from "@services/authService";
import { ROUTES, AUTH_ROUTES } from "@/constants/routes";
import { Spinner } from "../atoms";
import SignUpForm from "../molecules/forms/SignUpForm";
import { CheckCircle } from "lucide-react";

// Success message component following Atomic Design principles
const SuccessMessage = ({ onContinue }) => (
  <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 via-white to-emerald-50 py-8 px-4">
    <div className="w-full max-w-md mx-auto space-y-8">
      {/* Logo and Header */}
      <div className="text-center">
        <div className="flex justify-center mb-6">
          <img
            src="/SUNSHINE.png"
            alt="Sunshine Preschool"
            className="h-16 w-auto"
          />
        </div>
        
        <h2 className="text-3xl font-bold text-gray-900 mb-2">
          Đăng ký thành công!
        </h2>
        
        <p className="text-sm text-gray-600">
          Tài khoản của bạn đã được tạo thành công
        </p>
      </div>
      
      {/* Success Content */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="text-center space-y-6">
          <div className="mx-auto w-20 h-20 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full flex items-center justify-center">
            <CheckCircle className="w-10 h-10 text-white" />
          </div>
          
          <div className="space-y-3">
            <p className="text-gray-600">
              Chúc mừng! Tài khoản của bạn đã được tạo thành công.
            </p>
            <p className="text-sm text-gray-500">
              Đang chuyển hướng đến trang đăng nhập...
            </p>
          </div>
          
          <div className="flex justify-center">
            <Spinner size="md" className="text-green-500" />
          </div>
          
          <p className="text-sm text-gray-500">
            Nếu không tự động chuyển hướng,{" "}
            <button
              onClick={onContinue}
              className="text-green-600 hover:underline font-medium"
            >
              nhấn vào đây
            </button>
          </p>
        </div>
      </div>
      
      {/* Footer */}
      <div className="text-center text-sm text-gray-500">
        © 2025 Sunshine Preschool. All rights reserved.
      </div>
    </div>
  </div>
);

SuccessMessage.propTypes = {
  onContinue: PropTypes.func.isRequired,
};

// Error Alert component (Atom)
const ErrorAlert = ({ message, onDismiss }) => {
  if (!message) return null;
  
  return (
    <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-md text-sm flex items-center justify-between">
      <span>{message}</span>
      {onDismiss && (
        <button
          onClick={onDismiss}
          className="ml-2 text-red-500 hover:text-red-700"
        >
          ×
        </button>
      )}
    </div>
  );
};

ErrorAlert.propTypes = {
  message: PropTypes.string,
  onDismiss: PropTypes.func,
};

// SignUp Footer component (Molecule)
const SignUpFooter = () => (
  <div className="mt-6 text-center space-y-4">
    <div className="flex items-center">
      <div className="flex-1 border-t border-gray-200"></div>
      <span className="px-4 text-gray-500 text-sm">hoặc</span>
      <div className="flex-1 border-t border-gray-200"></div>
    </div>
      <p className="text-gray-600">
      Đã có tài khoản?{" "}      <Link
        to={ROUTES.LOGIN}
        className="text-blue-600 hover:text-blue-700 font-semibold hover:underline transition-colors"
      >
        Đăng nhập ngay
      </Link>
    </p>
    
    <p className="text-xs text-gray-500 leading-relaxed">
      Bằng việc tạo tài khoản, bạn đồng ý với{" "}
      <button className="text-blue-600 hover:underline">
        Điều khoản dịch vụ
      </button>{" "}
      và{" "}
      <button className="text-blue-600 hover:underline">
        Chính sách bảo mật
      </button>{" "}
      của chúng tôi.
    </p>
  </div>
);

const SignUp = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const handleSubmit = async (formData) => {
    console.log("🚀 SignUp handleSubmit called with formData:", formData);
    
    // Reset previous errors
    setSubmitError("");
    setLoading(true);

    try {
      console.log("📡 Calling authService.register...");
      
      // Call the registration API
      const response = await authService.register(formData);
      
      console.log("✅ Registration successful:", response);

      // Show success message
      setShowSuccess(true);

      // Auto redirect to login after 3 seconds
      setTimeout(() => {
        handleContinueToLogin(formData.email);
      }, 3000);

    } catch (error) {
      console.error("❌ Registration failed:", error);
      
      // Set appropriate error message
      if (error.response?.data?.message) {
        setSubmitError(error.response.data.message);
      } else if (error.message) {
        setSubmitError(error.message);
      } else {
        setSubmitError("Đăng ký thất bại. Vui lòng thử lại.");
      }
    } finally {
      setLoading(false);
    }
  };  const handleContinueToLogin = (email) => {
    navigate(ROUTES.LOGIN, {
      state: {
        message: "Đăng ký thành công! Vui lòng đăng nhập.",
        email: email
      }
    });
  };

  const clearError = () => {
    setSubmitError("");
  };

  // Show success screen if registration was successful
  if (showSuccess) {
    return (
      <SuccessMessage
        onContinue={() => handleContinueToLogin()}
      />
    );
  }  // Main signup page with compact layout for 3/4 screen
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-indigo-50 py-4 px-4">
      <div className="w-full max-w-6xl mx-auto space-y-4">
        {/* Logo and Header - Compact */}
        <div className="text-center">
          <div className="flex justify-center mb-3">
            <img
              src="/SUNSHINE.png"
              alt="Sunshine Preschool"
              className="h-12 w-auto"
            />
          </div>
          
          <h2 className="text-2xl font-bold text-gray-900 mb-1">
            Tạo tài khoản mới
          </h2>
          
          <p className="text-sm text-gray-600">
            Tham gia cùng chúng tôi để bắt đầu hành trình học tập thú vị
          </p>
        </div>
        
        {/* Error Alert */}
        <div className="flex justify-center">
          <div className="w-full max-w-5xl">
            <ErrorAlert 
              message={submitError} 
              onDismiss={clearError}
            />
          </div>
        </div>

        {/* SignUp Form */}
        <SignUpForm
          onSubmit={handleSubmit}
          loading={loading}
          className=""
        />

        {/* Footer - Compact */}
        <div className="flex justify-center">
          <div className="w-full max-w-md text-center space-y-2">
            <div className="flex items-center">
              <div className="flex-1 border-t border-gray-200"></div>
              <span className="px-3 text-gray-500 text-xs">hoặc</span>
              <div className="flex-1 border-t border-gray-200"></div>
            </div>
            <p className="text-gray-600 text-sm">
              Đã có tài khoản?{" "}      
              <Link
                to={ROUTES.LOGIN}
                className="text-blue-600 hover:text-blue-700 font-semibold hover:underline transition-colors"
              >
                Đăng nhập ngay
              </Link>
            </p>
            
            <p className="text-xs text-gray-500 leading-relaxed">
              Bằng việc tạo tài khoản, bạn đồng ý với{" "}
              <button className="text-blue-600 hover:underline">
                Điều khoản dịch vụ
              </button>{" "}
              và{" "}
              <button className="text-blue-600 hover:underline">
                Chính sách bảo mật
              </button>{" "}
              của chúng tôi.
            </p>
          </div>
        </div>
        
        {/* Copyright - Smaller */}
        <div className="text-center text-xs text-gray-500">
          © 2025 Sunshine Preschool. All rights reserved.
        </div>
      </div>
    </div>
  );
};

export default SignUp;
