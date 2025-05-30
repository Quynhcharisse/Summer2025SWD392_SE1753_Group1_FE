import React, { useState } from 'react';
import { Mail, Lock, User, Sun, Flower, Rainbow, Bug } from 'lucide-react';

const LoginSignup = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    fullName: ''
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    // Trim whitespace for certain fields
    let processedValue = value;
    if (name === 'email') {
      processedValue = value.trim();
    } else if (name === 'fullName') {
      // Remove extra spaces and capitalize first letters
      processedValue = value.replace(/\s+/g, ' ').replace(/^\w/, c => c.toUpperCase());
    }
    
    setFormData(prev => ({
      ...prev,
      [name]: processedValue
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

    // Email validation
    if (!formData.email) {
      newErrors.email = 'Email là bắt buộc';
    } else if (formData.email.trim() === '') {
      newErrors.email = 'Email không được để trống';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      newErrors.email = 'Định dạng email không hợp lệ (vd: name@domain.com)';
    } else if (formData.email.length > 254) {
      newErrors.email = 'Email quá dài (tối đa 254 ký tự)';
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = 'Mật khẩu là bắt buộc';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Mật khẩu phải có ít nhất 6 ký tự';
    } else if (formData.password.length > 128) {
      newErrors.password = 'Mật khẩu quá dài (tối đa 128 ký tự)';
    } else if (!/(?=.*[a-z])/.test(formData.password)) {
      newErrors.password = 'Mật khẩu phải có ít nhất 1 chữ thường';
    } else if (!/(?=.*[A-Z])/.test(formData.password)) {
      newErrors.password = 'Mật khẩu phải có ít nhất 1 chữ hoa';
    } else if (!/(?=.*\d)/.test(formData.password)) {
      newErrors.password = 'Mật khẩu phải có ít nhất 1 số';
    } else if (/\s/.test(formData.password)) {
      newErrors.password = 'Mật khẩu không được chứa khoảng trắng';
    }

    // Signup specific validations
    if (!isLogin) {
      // Full name validation
      if (!formData.fullName) {
        newErrors.fullName = 'Họ tên là bắt buộc';
      } else if (formData.fullName.trim() === '') {
        newErrors.fullName = 'Họ tên không được để trống';
      } else if (formData.fullName.trim().length < 2) {
        newErrors.fullName = 'Họ tên phải có ít nhất 2 ký tự';
      } else if (formData.fullName.length > 100) {
        newErrors.fullName = 'Họ tên quá dài (tối đa 100 ký tự)';
      } else if (!/^[a-zA-ZÀ-ỹ\s]+$/.test(formData.fullName.trim())) {
        newErrors.fullName = 'Họ tên chỉ được chứa chữ cái và khoảng trắng';
      } else if (/\s{2,}/.test(formData.fullName)) {
        newErrors.fullName = 'Họ tên không được có nhiều khoảng trắng liên tiếp';
      }

      // Confirm password validation
      if (!formData.confirmPassword) {
        newErrors.confirmPassword = 'Xác nhận mật khẩu là bắt buộc';
      } else if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Mật khẩu xác nhận không khớp';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const endpoint = isLogin ? '/api/login' : '/api/signup';
      const payload = isLogin 
        ? { email: formData.email.trim(), password: formData.password }
        : { 
            email: formData.email.trim(), 
            password: formData.password, 
            fullName: formData.fullName.trim() 
          };

      // Simulate API call
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Success:', data);
        // Handle success (e.g., redirect, store token, etc.)
        alert(isLogin ? 'Đăng nhập thành công!' : 'Đăng ký thành công!');
      } else {
        const errorData = await response.json();
        
        // Handle specific error cases
        if (response.status === 400) {
          setErrors({ general: 'Dữ liệu không hợp lệ' });
        } else if (response.status === 401) {
          setErrors({ general: 'Email hoặc mật khẩu không đúng' });
        } else if (response.status === 409) {
          setErrors({ email: 'Email này đã được sử dụng' });
        } else if (response.status === 429) {
          setErrors({ general: 'Quá nhiều lần thử, vui lòng đợi một lúc' });
        } else {
          setErrors({ general: errorData.message || 'Có lỗi xảy ra từ máy chủ' });
        }
      }
    } catch (error) {
      console.error('Error:', error);
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        setErrors({ general: 'Không thể kết nối đến máy chủ. Vui lòng kiểm tra kết nối internet.' });
      } else {
        setErrors({ general: 'Có lỗi không xác định xảy ra, vui lòng thử lại' });
      }
    } finally {
      setLoading(false);
    }
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setFormData({
      email: '',
      password: '',
      confirmPassword: '',
      fullName: ''
    });
    setErrors({});
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-2 sm:p-4 relative overflow-hidden" 
         style={{ background: 'linear-gradient(135deg, #fef7ed 0%, #fed7aa 50%, #fbbf24 100%)' }}>
      
      {/* Floating flower decorations */}
      <div className="absolute top-8 left-8 text-pink-400 opacity-30 animate-bounce">
        <Flower size={28} className="transform rotate-12" />
      </div>
      <div className="absolute top-16 right-12 text-rose-400 opacity-25 animate-pulse">
        <Flower size={36} className="transform -rotate-12" />
      </div>
      <div className="absolute top-32 left-20 text-purple-400 opacity-20 animate-bounce" style={{animationDelay: '1s'}}>
        <Flower size={24} className="transform rotate-45" />
      </div>
      <div className="absolute bottom-24 left-8 text-pink-500 opacity-30 animate-pulse" style={{animationDelay: '2s'}}>
        <Flower size={32} className="transform -rotate-45" />
      </div>
      <div className="absolute bottom-16 right-16 text-red-400 opacity-25 animate-bounce" style={{animationDelay: '3s'}}>
        <Flower size={30} className="transform rotate-90" />
      </div>
      <div className="absolute top-1/3 left-4 text-orange-400 opacity-20 animate-pulse" style={{animationDelay: '1.5s'}}>
        <Flower size={26} className="transform -rotate-30" />
      </div>
      <div className="absolute top-2/3 right-8 text-yellow-400 opacity-25 animate-bounce" style={{animationDelay: '2.5s'}}>
        <Flower size={34} className="transform rotate-60" />
      </div>
      
      {/* Additional scattered flowers */}
      <div className="hidden sm:block absolute top-40 left-1/4 text-pink-300 opacity-15 animate-pulse" style={{animationDelay: '0.5s'}}>
        <Flower size={20} className="transform rotate-180" />
      </div>
      <div className="hidden sm:block absolute bottom-32 left-1/3 text-rose-300 opacity-20 animate-bounce" style={{animationDelay: '4s'}}>
        <Flower size={22} className="transform -rotate-90" />
      </div>
      <div className="hidden sm:block absolute top-1/2 right-1/4 text-purple-300 opacity-15 animate-pulse" style={{animationDelay: '3.5s'}}>
        <Flower size={28} className="transform rotate-135" />
      </div>
      
      {/* Cute sun in corner */}
      <div className="absolute top-6 right-6 text-yellow-500 opacity-40 animate-spin" style={{animationDuration: '10s'}}>
        <Sun size={32} />
      </div>
      
      {/* Small decorative elements */}
      <div className="absolute top-24 left-1/2 w-2 h-2 bg-pink-300 rounded-full opacity-30 animate-ping"></div>
      <div className="absolute bottom-40 left-12 w-1.5 h-1.5 bg-rose-400 rounded-full opacity-25 animate-ping" style={{animationDelay: '1s'}}></div>
      <div className="absolute top-1/2 right-12 w-2.5 h-2.5 bg-purple-300 rounded-full opacity-20 animate-ping" style={{animationDelay: '2s'}}></div>

      <div className="w-full max-w-xs sm:max-w-sm p-4 sm:p-5 bg-white bg-opacity-90 rounded-2xl sm:rounded-3xl border-2 sm:border-4 border-pink-200 shadow-2xl backdrop-blur-sm relative z-10">
        {/* Header */}
        <div className="text-center mb-4 sm:mb-6 relative">
          {/* Small decorative flowers around header */}
          <div className="absolute -top-2 -left-2 text-pink-400 opacity-40">
            <Flower size={16} className="transform rotate-45" />
          </div>
          <div className="absolute -top-2 -right-2 text-rose-400 opacity-40">
            <Flower size={16} className="transform -rotate-45" />
          </div>
          
          <h1 className="text-xl sm:text-2xl font-bold text-pink-600 mb-1">SUNSHINE</h1>
          <p className="text-xs text-gray-600 uppercase tracking-wide">PRESCHOOL</p>
          <div className="w-12 h-0.5 bg-gradient-to-r from-pink-400 to-rose-400 mx-auto mt-1 rounded-full"></div>
        </div>

        {/* Toggle Buttons */}
        <div className="flex mb-4 bg-gray-100 rounded-lg p-1">
          <button
            type="button"
            onClick={() => setIsLogin(true)}
            className={`flex-1 py-1.5 px-3 rounded-md text-sm font-medium transition-all ${
              isLogin 
                ? 'bg-white text-pink-600 shadow-md' 
                : 'text-gray-600 hover:text-pink-600'
            }`}
          >
            Đăng Nhập
          </button>
          <button
            type="button"
            onClick={() => setIsLogin(false)}
            className={`flex-1 py-1.5 px-3 rounded-md text-sm font-medium transition-all ${
              !isLogin 
                ? 'bg-white text-pink-600 shadow-md' 
                : 'text-gray-600 hover:text-pink-600'
            }`}
          >
            Đăng Ký
          </button>
        </div>

        {/* Form */}
        <div className="space-y-3">
          {/* General Error Message */}
          {errors.general && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-2">
              <p className="text-red-600 text-xs text-center">{errors.general}</p>
            </div>
          )}

          {/* Full Name (only for signup) */}
          {!isLogin && (
            <div>
              <label className="flex items-center text-xs text-gray-700 mb-1">
                <User className="mr-1.5 h-3 w-3 text-gray-500" />
                Họ tên *
              </label>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleInputChange}
                placeholder="Nhập họ tên"
                className={`w-full px-3 py-2 text-sm border-2 rounded-lg focus:outline-none transition-all ${
                  errors.fullName 
                    ? 'border-red-300 focus:border-red-400' 
                    : 'border-pink-200 focus:border-pink-400'
                } bg-white`}
              />
              {errors.fullName && (
                <p className="text-red-500 text-xs mt-0.5">{errors.fullName}</p>
              )}
            </div>
          )}

          {/* Email Field */}
          <div>
            <label className="flex items-center text-xs text-gray-700 mb-1">
              <Mail className="mr-1.5 h-3 w-3 text-gray-500" />
              Email *
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="Nhập email"
              className={`w-full px-3 py-2 text-sm border-2 rounded-lg focus:outline-none transition-all ${
                errors.email 
                  ? 'border-red-300 focus:border-red-400' 
                  : 'border-pink-200 focus:border-pink-400'
              } bg-white`}
            />
            {errors.email && (
              <p className="text-red-500 text-xs mt-0.5">{errors.email}</p>
            )}
          </div>

          {/* Password Field */}
          <div>
            <label className="flex items-center text-xs text-gray-700 mb-1">
              <Lock className="mr-1.5 h-3 w-3 text-gray-500" />
              Mật khẩu *
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              placeholder="Nhập mật khẩu"
              className={`w-full px-3 py-2 text-sm border-2 rounded-lg focus:outline-none transition-all ${
                errors.password 
                  ? 'border-red-300 focus:border-red-400' 
                  : 'border-pink-200 focus:border-pink-400'
              } bg-white`}
            />
            {errors.password && (
              <p className="text-red-500 text-xs mt-0.5">{errors.password}</p>
            )}
          </div>

          {/* Confirm Password (only for signup) */}
          {!isLogin && (
            <div>
              <label className="flex items-center text-xs text-gray-700 mb-1">
                <Lock className="mr-1.5 h-3 w-3 text-gray-500" />
                Xác nhận mật khẩu *
              </label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                placeholder="Nhập lại mật khẩu"
                className={`w-full px-3 py-2 text-sm border-2 rounded-lg focus:outline-none transition-all ${
                  errors.confirmPassword 
                    ? 'border-red-300 focus:border-red-400' 
                    : 'border-pink-200 focus:border-pink-400'
                } bg-white`}
              />
              {errors.confirmPassword && (
                <p className="text-red-500 text-xs mt-0.5">{errors.confirmPassword}</p>
              )}
            </div>
          )}

          {/* Submit Button */}
          <button
            onClick={handleSubmit}
            disabled={loading}
            className={`w-full py-2.5 px-4 text-sm text-white font-semibold rounded-lg transition-all ${
              loading
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 hover:shadow-lg hover:-translate-y-0.5'
            } focus:outline-none focus:ring-4 focus:ring-pink-300`}
          >
            {loading 
              ? (isLogin ? 'Đang đăng nhập...' : 'Đang đăng ký...') 
              : (isLogin ? 'Đăng Nhập' : 'Đăng Ký')
            }
          </button>

          {/* Forgot Password (only for login) */}
          {isLogin && (
            <div className="text-center mt-3">
              <a href="#" className="text-xs text-pink-600 hover:text-pink-800 hover:underline">
                Quên mật khẩu?
              </a>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="text-center mt-4 text-xs text-gray-600">
          {isLogin ? 'Chưa có tài khoản?' : 'Đã có tài khoản?'}
          <button
            type="button"
            onClick={toggleMode}
            className="ml-1 text-pink-600 hover:text-pink-800 font-medium hover:underline"
          >
            {isLogin ? 'Đăng ký ngay' : 'Đăng nhập'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginSignup;