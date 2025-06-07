import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { PageTemplate } from "@templates";
import { Button, Spinner, Input, Label } from "@atoms";
import { authService } from "@services/authService";
import { getCurrentTokenData } from "@services/JWTService";
import { getDashboardRoute } from "@/constants/routes";
import { executeProfileApiWithRetry } from "@/utils/apiRetryHandler";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Shield,
  Edit2,
  Save,
  X,
  Key,
  AlertCircle,
} from "lucide-react";

const UserProfile = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showPasswordReset, setShowPasswordReset] = useState(false);
  const [isFirstLogin, setIsFirstLogin] = useState(false);

  // Form data for editing
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    address: "",
  });

  // Password reset form
  const [passwordData, setPasswordData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  });

  useEffect(() => {
    loadProfile();
  }, []);
  const loadProfile = async () => {
    try {
      setLoading(true);
      setError("");

      // Use the retry handler for API call
      const response = await executeProfileApiWithRetry(() =>
        authService.getUserProfile()
      );
      setProfile(response);

      // Check if this is first login (profile incomplete or password needs reset)
      const needsPasswordReset = response.firstLogin || response.tempPassword;
      setIsFirstLogin(needsPasswordReset);
      setShowPasswordReset(needsPasswordReset);

      // Set form data
      setFormData({
        firstName: response.firstName || "",
        lastName: response.lastName || "",
        phone: response.phone || "",
        address: response.address || "",
      });

      setPasswordData((prev) => ({
        ...prev,
        email: response.email || "",
      }));
    } catch (error) {
      console.error("Failed to load profile:", error);
      setError("Không thể tải thông tin profile. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };
  const handleSaveProfile = async () => {
    try {
      setSaving(true);
      setError("");
      setSuccess("");

      // Use the retry handler for API call
      await executeProfileApiWithRetry(() =>
        authService.updateUserProfile(formData)
      );

      setSuccess("Cập nhật thông tin thành công!");
      setEditing(false);

      // Reload profile
      await loadProfile();
    } catch (error) {
      console.error("Failed to update profile:", error);
      setError("Cập nhật thất bại. Vui lòng thử lại.");
    } finally {
      setSaving(false);
    }
  };

  const handlePasswordReset = async () => {
    try {
      // Validate passwords
      if (passwordData.password !== passwordData.confirmPassword) {
        setError("Mật khẩu xác nhận không khớp!");
        return;
      }

      if (passwordData.password.length < 6) {
        setError("Mật khẩu phải có ít nhất 6 ký tự!");
        return;
      }

      setSaving(true);
      setError("");

      await authService.resetPassword({
        email: passwordData.email,
        password: passwordData.password,
        confirmPassword: passwordData.confirmPassword,
      });

      setSuccess("Đổi mật khẩu thành công!");
      setShowPasswordReset(false);
      setIsFirstLogin(false);
    } catch (error) {
      console.error("Password reset failed:", error);
      setError("Đổi mật khẩu thất bại. Vui lòng thử lại.");
    } finally {
      setSaving(false);
    }
  };

  const handleContinueToDashboard = () => {
    const tokenData = getCurrentTokenData();
    const dashboardRoute = getDashboardRoute(tokenData?.role);
    navigate(dashboardRoute);
  };

  if (loading) {
    return (
      <PageTemplate title="Thông tin cá nhân">
        <div className="text-center py-8">
          <Spinner size="lg" className="mx-auto mb-4" />
          <p className="text-gray-600">Đang tải thông tin...</p>
        </div>
      </PageTemplate>
    );
  }

  return (
    <PageTemplate
      title="Thông tin cá nhân"
      subtitle={
        isFirstLogin
          ? "Vui lòng cập nhật thông tin và đổi mật khẩu"
          : "Quản lý thông tin tài khoản của bạn"
      }
      actions={
        !isFirstLogin && (
          <div className="flex gap-3">
            {!editing ? (
              <Button
                variant="outline"
                onClick={() => setEditing(true)}
                className="flex items-center gap-2"
              >
                <Edit2 className="w-4 h-4" />
                Chỉnh sửa
              </Button>
            ) : (
              <>
                <Button
                  variant="outline"
                  onClick={() => {
                    setEditing(false);
                    setFormData({
                      firstName: profile?.firstName || "",
                      lastName: profile?.lastName || "",
                      phone: profile?.phone || "",
                      address: profile?.address || "",
                    });
                  }}
                  className="flex items-center gap-2"
                >
                  <X className="w-4 h-4" />
                  Hủy
                </Button>
                <Button
                  variant="primary"
                  onClick={handleSaveProfile}
                  loading={saving}
                  className="flex items-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  Lưu
                </Button>
              </>
            )}
            <Button
              variant="outline"
              onClick={() => setShowPasswordReset(true)}
              className="flex items-center gap-2"
            >
              <Key className="w-4 h-4" />
              Đổi mật khẩu
            </Button>
          </div>
        )
      }
    >
      {" "}
      <div className="space-y-6">
        {/* Debug Component - Only show in development */}

        {/* First Login Alert */}
        {isFirstLogin && (
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
            <div className="flex">
              <AlertCircle className="w-5 h-5 text-yellow-400 mt-0.5" />
              <div className="ml-3">
                <h4 className="text-sm font-medium text-yellow-800">
                  Đăng nhập lần đầu
                </h4>
                <p className="text-sm text-yellow-700 mt-1">
                  Vui lòng cập nhật thông tin cá nhân và đổi mật khẩu để hoàn
                  tất thiết lập tài khoản.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Success/Error Messages */}
        {success && (
          <div className="bg-green-50 border border-green-200 text-green-700 rounded-md p-3 text-sm">
            {success}
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 rounded-md p-3 text-sm">
            {error}
          </div>
        )}

        {/* Password Reset Modal */}
        {showPasswordReset && (
          <div className="bg-white border border-gray-200 rounded-lg p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                <Key className="w-5 h-5" />
                Đổi mật khẩu
              </h3>
              {!isFirstLogin && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowPasswordReset(false)}
                >
                  <X className="w-4 h-4" />
                </Button>
              )}
            </div>

            <div className="space-y-4">
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={passwordData.email}
                  disabled
                  className="bg-gray-50"
                />
              </div>

              <div>
                <Label htmlFor="password">Mật khẩu mới</Label>
                <Input
                  id="password"
                  type="password"
                  value={passwordData.password}
                  onChange={(e) =>
                    setPasswordData((prev) => ({
                      ...prev,
                      password: e.target.value,
                    }))
                  }
                  placeholder="Nhập mật khẩu mới"
                />
              </div>

              <div>
                <Label htmlFor="confirmPassword">Xác nhận mật khẩu</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={passwordData.confirmPassword}
                  onChange={(e) =>
                    setPasswordData((prev) => ({
                      ...prev,
                      confirmPassword: e.target.value,
                    }))
                  }
                  placeholder="Nhập lại mật khẩu mới"
                />
              </div>

              <Button
                variant="primary"
                onClick={handlePasswordReset}
                loading={saving}
                className="w-full"
              >
                Đổi mật khẩu
              </Button>
            </div>
          </div>
        )}

        {/* Profile Information */}
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-800">
              Thông tin cá nhân
            </h3>
          </div>

          <div className="p-6 space-y-6">
            {/* Basic Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="firstName">Họ</Label>
                {editing ? (
                  <Input
                    id="firstName"
                    value={formData.firstName}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        firstName: e.target.value,
                      }))
                    }
                    placeholder="Nhập họ"
                  />
                ) : (
                  <div className="flex items-center gap-2 p-2 bg-gray-50 rounded">
                    <User className="w-4 h-4 text-gray-500" />
                    <span className="text-gray-900">
                      {profile?.firstName || "Chưa cập nhật"}
                    </span>
                  </div>
                )}
              </div>

              <div>
                <Label htmlFor="lastName">Tên</Label>
                {editing ? (
                  <Input
                    id="lastName"
                    value={formData.lastName}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        lastName: e.target.value,
                      }))
                    }
                    placeholder="Nhập tên"
                  />
                ) : (
                  <div className="flex items-center gap-2 p-2 bg-gray-50 rounded">
                    <User className="w-4 h-4 text-gray-500" />
                    <span className="text-gray-900">
                      {profile?.lastName || "Chưa cập nhật"}
                    </span>
                  </div>
                )}
              </div>

              <div>
                <Label>Email</Label>
                <div className="flex items-center gap-2 p-2 bg-gray-50 rounded">
                  <Mail className="w-4 h-4 text-gray-500" />
                  <span className="text-gray-900">{profile?.email}</span>
                </div>
              </div>

              <div>
                <Label>Vai trò</Label>
                <div className="flex items-center gap-2 p-2 bg-gray-50 rounded">
                  <Shield className="w-4 h-4 text-gray-500" />
                  <span className="text-gray-900">{profile?.role}</span>
                </div>
              </div>

              <div>
                <Label htmlFor="phone">Số điện thoại</Label>
                {editing ? (
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        phone: e.target.value,
                      }))
                    }
                    placeholder="Nhập số điện thoại"
                  />
                ) : (
                  <div className="flex items-center gap-2 p-2 bg-gray-50 rounded">
                    <Phone className="w-4 h-4 text-gray-500" />
                    <span className="text-gray-900">
                      {profile?.phone || "Chưa cập nhật"}
                    </span>
                  </div>
                )}
              </div>

              <div>
                <Label>Ngày tạo tài khoản</Label>
                <div className="flex items-center gap-2 p-2 bg-gray-50 rounded">
                  <Calendar className="w-4 h-4 text-gray-500" />
                  <span className="text-gray-900">
                    {profile?.createdAt
                      ? new Date(profile.createdAt).toLocaleDateString("vi-VN")
                      : "N/A"}
                  </span>
                </div>
              </div>
            </div>

            <div>
              <Label htmlFor="address">Địa chỉ</Label>
              {editing ? (
                <textarea
                  id="address"
                  value={formData.address}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      address: e.target.value,
                    }))
                  }
                  placeholder="Nhập địa chỉ"
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  rows={3}
                />
              ) : (
                <div className="flex items-start gap-2 p-2 bg-gray-50 rounded">
                  <MapPin className="w-4 h-4 text-gray-500 mt-0.5" />
                  <span className="text-gray-900">
                    {profile?.address || "Chưa cập nhật"}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Continue Button for First Login */}
        {isFirstLogin && !showPasswordReset && (
          <div className="text-center">
            <Button
              variant="primary"
              size="lg"
              onClick={handleContinueToDashboard}
              className="min-w-[200px]"
            >
              Tiếp tục vào hệ thống
            </Button>
          </div>
        )}
      </div>
    </PageTemplate>
  );
};

export default UserProfile;
