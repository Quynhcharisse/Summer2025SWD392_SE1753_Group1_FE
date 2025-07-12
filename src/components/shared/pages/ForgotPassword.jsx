import React, { useState } from "react";
import { Link } from "react-router-dom";
import { PageTemplate } from "@templates";
import authService from "@services/authService";
import { AUTH_ROUTES } from "@/constants/routes";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!email.trim()) {
      setError("Vui lòng nhập email");
      return;
    }

    if (!validateEmail(email)) {
      setError("Email không hợp lệ");
      return;
    }

    setLoading(true);

    try {
      await authService.requestPasswordReset(email);
      setSuccess(true);
    } catch (error) {
//       console.error("Password reset error:", error);
      setError(
        error.response?.data?.message || "Có lỗi xảy ra. Vui lòng thử lại sau."
      );
    } finally {
      setLoading(false);
    }
  };

  // Success state
  if (success) {
    return (
      <PageTemplate
        title="Kiểm tra email của bạn"
        showHeader={false}
        showFooter={false}
      >
        <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg p-8">
          <div className="text-center">
            <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
              <svg
                className="w-8 h-8 text-blue-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 8l7.89 7.89c.39.39 1.02.39 1.41 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
            </div>

            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Email đã được gửi!
            </h2>

            <p className="text-gray-600 mb-6">
              Chúng tôi đã gửi liên kết đặt lại mật khẩu đến email:
            </p>

            <div className="bg-gray-50 rounded-lg p-3 mb-6">
              <p className="font-medium text-gray-900">{email}</p>
            </div>

            <p className="text-sm text-gray-500 mb-6">
              Vui lòng kiểm tra hộp thư của bạn và làm theo hướng dẫn để đặt lại
              mật khẩu. Email có thể ở trong thư mục spam.
            </p>

            <div className="space-y-3">
              <button
                onClick={() => {
                  setSuccess(false);
                  setEmail("");
                }}
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
              >
                Gửi lại email
              </button>

              <Link
                to={AUTH_ROUTES.LOGIN}
                className="block w-full text-center text-gray-600 hover:text-gray-800 transition-colors"
              >
                Quay lại đăng nhập
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
      title="Quên mật khẩu"
      subtitle="Đặt lại mật khẩu của bạn"
      showHeader={false}
      showFooter={false}
    >
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg">
        <div className="px-8 py-6">
          <div className="text-center mb-6">
            <div className="mx-auto w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
              <svg
                className="w-6 h-6 text-blue-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                />
              </svg>
            </div>

            <p className="text-gray-600">
              Nhập email của bạn và chúng tôi sẽ gửi liên kết đặt lại mật khẩu
            </p>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Email *
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  error ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="Nhập email của bạn"
                disabled={loading}
              />
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-md p-3">
                <p className="text-red-600 text-sm">{error}</p>
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
                  Đang gửi...
                </div>
              ) : (
                "Gửi liên kết đặt lại"
              )}
            </button>
          </form>{" "}
          <div className="mt-6 text-center space-y-2">
            <Link
              to={AUTH_ROUTES.LOGIN}
              className="text-sm text-gray-600 hover:text-gray-800 block"
            >
              ← Quay lại đăng nhập
            </Link>

            <p className="text-sm text-gray-500">
              Chưa có tài khoản?{" "}
              <Link
                to="/auth/register"
                className="text-blue-600 hover:underline"
              >
                Đăng ký ngay
              </Link>
            </p>
          </div>
        </div>
      </div>
    </PageTemplate>
  );
};

export default ForgotPassword;
