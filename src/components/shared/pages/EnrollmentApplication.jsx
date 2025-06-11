import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AuthTemplate } from "@templates";
import { Button, Spinner } from "@atoms";
import EnrollmentForm from "../molecules/forms/EnrollmentForm";
import { enrollmentService } from "../../../api/services/enrollmentService";
import { isAuthenticated } from "@services/JWTService.jsx";
import { CheckCircle, FileText, AlertTriangle } from "lucide-react";
import PropTypes from "prop-types";

// Success Message Component
const EnrollmentSuccess = ({ applicationData, onContinue }) => (
  <AuthTemplate
    title="Đăng ký thành công!"
    subtitle="Đơn đăng ký nhập học đã được gửi thành công"
  >
    <div className="text-center space-y-6">
      <div className="mx-auto w-20 h-20 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full flex items-center justify-center">
        <CheckCircle className="w-10 h-10 text-white" />
      </div>
      
      <div className="space-y-3">
        <p className="text-gray-600">
          Cảm ơn bạn đã gửi đơn đăng ký nhập học cho <strong>{applicationData?.childName}</strong>!
        </p>
        <p className="text-sm text-gray-500">
          Mã đơn đăng ký: <span className="font-mono bg-gray-100 px-2 py-1 rounded">{applicationData?.applicationId}</span>
        </p>
      </div>

      <div className="bg-blue-50 border-l-4 border-blue-400 p-4 text-left">
        <div className="flex">
          <FileText className="w-5 h-5 text-blue-400 mt-0.5" />
          <div className="ml-3">
            <h4 className="text-sm font-medium text-blue-800">Bước tiếp theo:</h4>
            <p className="text-sm text-blue-700 mt-1">
              Chúng tôi sẽ liên hệ với bạn trong vòng 2-3 ngày làm việc để hướng dẫn về việc nộp giấy tờ và lịch phỏng vấn.
            </p>
            <ul className="mt-2 text-sm text-blue-600 list-disc list-inside">
              <li>Kiểm tra email để nhận thông tin chi tiết</li>
              <li>Chuẩn bị các giấy tờ cần thiết</li>
              <li>Chờ lịch hẹn phỏng vấn</li>
            </ul>
          </div>
        </div>
      </div>
      
      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <Button
          variant="primary"
          onClick={onContinue}
          className="flex items-center gap-2"
        >
          <FileText className="w-4 h-4" />
          Quản lý đơn đăng ký
        </Button>
        <Button
          variant="outline"
          onClick={() => window.location.href = '/'}
        >
          Về trang chủ
        </Button>
      </div>
    </div>
  </AuthTemplate>
);

EnrollmentSuccess.propTypes = {
  applicationData: PropTypes.object,
  onContinue: PropTypes.func.isRequired,
};

// Login Required Message
const LoginRequired = ({ onLogin }) => (
  <AuthTemplate
    title="Yêu cầu đăng nhập"
    subtitle="Bạn cần đăng nhập để tiếp tục đăng ký nhập học"
  >
    <div className="text-center space-y-6">
      <div className="mx-auto w-20 h-20 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
        <AlertTriangle className="w-10 h-10 text-white" />
      </div>
      
      <div className="space-y-3">
        <p className="text-gray-600">
          Để đảm bảo thông tin chính xác và bảo mật, bạn cần có tài khoản để đăng ký nhập học.
        </p>
        <p className="text-sm text-gray-500">
          Nếu chưa có tài khoản, bạn có thể đăng ký miễn phí.
        </p>
      </div>

      <div className="bg-blue-50 border-l-4 border-blue-400 p-4 text-left">
        <div className="flex">
          <FileText className="w-5 h-5 text-blue-400 mt-0.5" />
          <div className="ml-3">
            <h4 className="text-sm font-medium text-blue-800">Tại sao cần đăng nhập?</h4>
            <ul className="mt-2 text-sm text-blue-700 list-disc list-inside">
              <li>Theo dõi trạng thái đơn đăng ký</li>
              <li>Nhận thông báo cập nhật qua email</li>
              <li>Quản lý thông tin và giấy tờ</li>
              <li>Liên hệ trực tiếp với nhà trường</li>
            </ul>
          </div>
        </div>
      </div>
      
      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <Button
          variant="primary"
          onClick={onLogin}
        >
          Đăng nhập
        </Button>
        <Button
          variant="outline"
          onClick={() => window.location.href = '/signup'}
        >
          Đăng ký tài khoản
        </Button>
      </div>
    </div>
  </AuthTemplate>
);

LoginRequired.propTypes = {
  onLogin: PropTypes.func.isRequired,
};

const EnrollmentApplication = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [applicationData, setApplicationData] = useState(null);
  const [submitError, setSubmitError] = useState("");
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [isUserAuthenticated, setIsUserAuthenticated] = useState(false);

  useEffect(() => {
    // Check if user is authenticated
    const checkAuthentication = async () => {
      try {
        const authenticated = isAuthenticated();
        setIsUserAuthenticated(authenticated);
        
        if (authenticated) {
          // Optional: Check enrollment eligibility
          await enrollmentService.checkEnrollmentEligibility();
        }
      } catch (error) {
        console.error('Authentication check failed:', error);
        setIsUserAuthenticated(false);
      } finally {
        setCheckingAuth(false);
      }
    };

    checkAuthentication();
  }, []);

  const handleSubmit = async (formData) => {
    console.log("🚀 EnrollmentApplication handleSubmit called with:", formData);
    
    setSubmitError("");
    setLoading(true);

    try {
      console.log("📡 Calling enrollmentService.submitEnrollmentApplication...");
      
      // Prepare enrollment data
      const enrollmentData = {
        // Child information
        child: {
          firstName: formData.childFirstName,
          lastName: formData.childLastName,
          dateOfBirth: formData.childDateOfBirth,
          gender: formData.childGender,
          address: formData.childAddress,
        },
        // Parent/Guardian information
        parent: {
          firstName: formData.parentFirstName,
          lastName: formData.parentLastName,
          relationship: formData.relationship,
          phone: formData.parentPhone,
          email: formData.parentEmail,
          idNumber: formData.parentIdNumber,
          address: formData.parentAddress,
        },
        // Program selection
        program: formData.program,
        // Additional data
        applicationDate: new Date().toISOString(),
        status: 'SUBMITTED'
      };

      const response = await enrollmentService.submitEnrollmentApplication(enrollmentData);
      
      console.log("✅ Enrollment application submitted successfully:", response);

      // Set success data
      setApplicationData({
        applicationId: response.applicationId || 'ENR-' + Date.now(),
        childName: `${formData.childFirstName} ${formData.childLastName}`,
        program: formData.program,
        parentEmail: formData.parentEmail
      });

      setShowSuccess(true);

    } catch (error) {
      console.error("❌ Enrollment application submission failed:", error);
      
      if (error.response?.data?.message) {
        setSubmitError(error.response.data.message);
      } else if (error.message) {
        setSubmitError(error.message);
      } else {
        setSubmitError("Gửi đơn đăng ký thất bại. Vui lòng thử lại.");
      }
    } finally {
      setLoading(false);
    }
  };
  const handleLogin = () => {
    // Redirect to login with return URL
    navigate('/login', { 
      state: { 
        returnUrl: '/enrollment',
        message: 'Vui lòng đăng nhập để tiếp tục đăng ký nhập học.'
      }
    });
  };
  const handleManageApplications = () => {
    navigate('/enrollment/my-applications');
  };

  // Show loading while checking authentication
  if (checkingAuth) {
    return (
      <AuthTemplate title="Đang kiểm tra...">
        <div className="text-center py-8">
          <Spinner size="lg" className="mx-auto mb-4" />
          <p className="text-gray-600">Đang kiểm tra trạng thái đăng nhập...</p>
        </div>
      </AuthTemplate>
    );
  }

  // Show login required if user is not authenticated
  if (!isUserAuthenticated) {
    return <LoginRequired onLogin={handleLogin} />;
  }

  // Show success screen if application was submitted
  if (showSuccess) {
    return (
      <EnrollmentSuccess
        applicationData={applicationData}
        onContinue={handleManageApplications}
      />
    );
  }

  // Main enrollment application form
  return (
    <AuthTemplate
      title="Đăng ký nhập học"
      subtitle="Vui lòng điền đầy đủ thông tin để đăng ký nhập học cho trẻ"
      showLogo={false}
    >
      <div className="space-y-6">
        {/* Error Alert */}
        {submitError && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-md text-sm flex items-center justify-between">
            <span>{submitError}</span>
            <button
              onClick={() => setSubmitError("")}
              className="ml-2 text-red-500 hover:text-red-700"
            >
              ×
            </button>
          </div>
        )}

        {/* Enrollment Form */}
        <EnrollmentForm
          onSubmit={handleSubmit}
          loading={loading}
          className="bg-white rounded-lg p-6 shadow-sm"
        />

        {/* Help Information */}
        <div className="text-center text-sm text-gray-500 mt-6">
          <p>
            Cần hỗ trợ? Liên hệ:{" "}
            <a href="tel:1900-1234" className="text-blue-600 hover:underline">
              1900-1234
            </a>{" "}
            hoặc{" "}
            <a href="mailto:admissions@sunshinepreschool.com" className="text-blue-600 hover:underline">
              admissions@sunshinepreschool.com
            </a>
          </p>
        </div>
      </div>
    </AuthTemplate>
  );
};

export default EnrollmentApplication;
