import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { authService } from "@/api/services/authService";
import SignUpForm from "@/components/shared/molecules/forms/SignUpForm";
import { CheckCircle } from "lucide-react";

// Success message component - following atomic design principles
const SuccessMessage = () => (
  <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50 flex items-center justify-center py-12 px-4">
    <div className="max-w-md mx-auto bg-white rounded-2xl shadow-2xl p-8">
      <div className="text-center">
        <div className="mx-auto w-20 h-20 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full flex items-center justify-center mb-6">
          <CheckCircle className="w-10 h-10 text-white" />
        </div>
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Chúc mừng!</h2>
        <p className="text-gray-600 mb-6 text-lg">
          Tài khoản của bạn đã được tạo thành công. 
          <br />Đang chuyển hướng đến trang đăng nhập...
        </p>
        
        <div className="flex justify-center mb-6">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-green-500"></div>
        </div>
        
        <p className="text-sm text-gray-500">
          Nếu không tự động chuyển hướng, 
          <Link to="/login" className="text-green-600 hover:underline ml-1 font-medium">
            nhấn vào đây
          </Link>
        </p>
      </div>
    </div>
  </div>
);

// Header component - following atomic design
const SignUpHeader = () => (
  <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-orange-500 px-8 py-12 text-center relative overflow-hidden">
    {/* Background Pattern */}
    <div className="absolute inset-0 opacity-10">
      <div className="absolute top-10 left-10 w-20 h-20 bg-white rounded-full"></div>
      <div className="absolute top-32 right-16 w-16 h-16 bg-white rounded-full"></div>
      <div className="absolute bottom-10 left-1/3 w-12 h-12 bg-white rounded-full"></div>
      <div className="absolute bottom-20 right-10 w-8 h-8 bg-white rounded-full"></div>
    </div>
    
    <div className="relative z-10">
      <div className="mx-auto w-24 h-24 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mb-6 transform rotate-12">
        <svg className="w-12 h-12 text-white transform -rotate-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
        </svg>
      </div>
      <h1 className="text-4xl font-bold text-white mb-4">Tham gia cùng chúng tôi!</h1>
      <p className="text-blue-100 text-lg max-w-md mx-auto">
        Tạo tài khoản để bắt đầu hành trình học tập đầy thú vị cho bé yêu
      </p>
    </div>
  </div>
);

// Footer component - following atomic design
const SignUpFooter = () => (
  <div className="mt-8 text-center">
    <div className="flex items-center justify-center mb-4">
      <div className="flex-1 border-t border-gray-200"></div>
      <span className="px-4 text-gray-500 text-sm">hoặc</span>
      <div className="flex-1 border-t border-gray-200"></div>
    </div>
    
    <p className="text-gray-600">
      Đã có tài khoản?{' '}
      <Link 
        to="/login" 
        className="text-blue-600 hover:text-blue-700 font-semibold hover:underline transition-colors duration-200"
      >
        Đăng nhập ngay
      </Link>
    </p>
    <p className="text-xs text-gray-500 max-w-md mx-auto mt-4">
      Bằng việc tạo tài khoản, bạn đồng ý với{' '}
      <button className="text-blue-600 hover:underline">Điều khoản dịch vụ</button> và{' '}
      <button className="text-blue-600 hover:underline">Chính sách bảo mật</button> của chúng tôi.
    </p>
  </div>
);

// Theme Switcher Atom
const ThemeSwitcher = ({ theme, setTheme }) => (
  <div className="flex items-center gap-2 justify-end mb-2">
    <label className="text-xs text-gray-500">Giao diện:</label>
    <select
      value={theme}
      onChange={e => setTheme(e.target.value)}
      className="rounded px-2 py-1 text-xs border border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 bg-white dark:bg-gray-800 playfull:bg-pink-50 text-gray-700 dark:text-gray-100 playfull:text-pink-900"
    >
      <option value="light">Sáng</option>
      <option value="dark">Tối</option>
      <option value="playfull">Trẻ em</option>
    </select>
  </div>
);

const SignUp = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [theme, setTheme] = useState('light');
  const [submitError, setSubmitError] = useState('');

  const handleSubmit = async (formData) => {
    console.log('🚀 handleSubmit called with formData:', formData);
    
    // Reset previous errors
    setSubmitError('');
    setLoading(true);

    try {
      console.log('📡 Calling authService.register...');
      
      // Call the API
      const response = await authService.register(formData);
      
      console.log('✅ Registration successful:', response);

      // Show success message
      setShowSuccess(true);

      // Auto redirect to login after 3 seconds
      setTimeout(() => {
        navigate('/login', {
          state: {
            message: 'Đăng ký thành công! Vui lòng đăng nhập.',
            email: formData.email
          }
        });
      }, 3000);

    } catch (error) {
      console.error('❌ Registration failed:', error);
      
      // Set error message
      if (error.response?.data?.message) {
        setSubmitError(error.response.data.message);
      } else if (error.message) {
        setSubmitError(error.message);
      } else {
        setSubmitError('Đăng ký thất bại. Vui lòng thử lại.');
      }
    } finally {
      setLoading(false);
    }
  };

  // Show success message if signup was successful
  if (showSuccess) {
    return <SuccessMessage />;
  }

  // Main signup page using atomic design principles
  return (
    <div className={`min-h-screen bg-gradient-to-br from-blue-50 via-white to-orange-50 flex items-center justify-center py-8 px-2 theme-${theme}`}>
      <div className="w-full max-w-lg bg-white dark:bg-gray-900 playfull:bg-pink-50 rounded-2xl shadow-xl overflow-hidden">
        {/* Header Section - Atomic Design: Organism */}
        <SignUpHeader />
        {/* Theme Switcher - move to top right corner */}
        <div className="absolute top-4 right-4 z-20">
       
        </div>
        {/* Form Section - Atomic Design: Using SignUpForm Molecule */}        <div className="px-4 sm:px-8 py-8 sm:py-10">
          <div className="max-w-md mx-auto">
            {/* Display submit error if exists */}
            {submitError && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-md text-sm">
                {submitError}
              </div>
            )}
            
            {/* Test button for debugging */}
            <button 
              type="button"
              onClick={async () => {
                console.log('🧪 Testing API call directly...');
                try {
                  const testData = {
                    name: "Test User",
                    email: "test@example.com",
                    password: "123456",
                    confirmPassword: "123456",
                    phone: "0123456789",
                    gender: "male",
                    identityNumber: "123456789"
                  };
                  
                  const response = await authService.register(testData);
                  console.log('✅ Test API call successful:', response);
                } catch (error) {
                  console.error('❌ Test API call failed:', error);
                }
              }}
              className="mb-4 px-4 py-2 bg-blue-500 text-white rounded"
            >
              Test API Call
            </button>
            
            <SignUpForm 
              onSubmit={handleSubmit}
              loading={loading}
              className="space-y-5"
            />
            
            {/* Footer Section - Atomic Design: Organism */}
            <SignUpFooter />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
