import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getCurrentTokenData } from "@services/JWTService.jsx";
import { Button, Badge } from "@atoms";
import { StatCard } from "@molecules";
import { 
  Users, 
  Calendar, 
  FileText, 
  TrendingUp,
  Bell,
  Settings,
  ArrowRight
} from "lucide-react";

const UserDashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUserData = () => {
      try {
        const tokenData = getCurrentTokenData();
        setUser(tokenData);
        
        // Redirect to role-specific dashboard if available
        if (tokenData?.role) {
          const role = tokenData.role.toLowerCase();
          switch (role) {
            case 'parent':
              navigate('/user/parent/dashboard', { replace: true });
              return;
            case 'teacher':
              navigate('/user/teacher/dashboard', { replace: true });
              return;
            case 'admission':
              navigate('/user/admission/dashboard', { replace: true });
              return;
            case 'admin':
              navigate('/user/admin/dashboard', { replace: true });
              return;
            default:
              break;
          }
        }
      } catch (error) {
        console.error('Error loading user data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadUserData();
  }, [navigate]);

  const getRoleDisplayName = (role) => {
    switch (role?.toLowerCase()) {
      case 'parent': return 'Phụ huynh';
      case 'teacher': return 'Giáo viên';
      case 'admission': return 'Tuyển sinh';
      case 'admin': return 'Quản trị viên';
      default: return 'Người dùng';
    }
  };

  const getQuickActions = () => {
    const role = user?.role?.toLowerCase();
    switch (role) {
      case 'parent':
        return [
          { label: 'Đơn đăng ký', path: '/enrollment', icon: FileText },
          { label: 'Lịch học', path: '/user/parent/calendar', icon: Calendar },
          { label: 'Tin nhắn', path: '/user/parent/messages', icon: Bell }
        ];
      case 'teacher':
        return [
          { label: 'Điểm danh', path: '/user/teacher/attendance', icon: Users },
          { label: 'Nhật ký', path: '/user/teacher/journal', icon: FileText },
          { label: 'Tin nhắn', path: '/user/teacher/messages', icon: Bell }
        ];
      case 'admission':
        return [
          { label: 'Hồ sơ đăng ký', path: '/user/admission/registrations', icon: FileText },
          { label: 'Báo cáo', path: '/user/admission/reports', icon: TrendingUp },
          { label: 'Cài đặt', path: '/user/shared/notifications', icon: Settings }
        ];
      case 'admin':
        return [
          { label: 'Quản lý người dùng', path: '/user/admin/users', icon: Users },
          { label: 'Thống kê', path: '/user/admin/statistics', icon: TrendingUp },
          { label: 'Cài đặt', path: '/user/admin/settings', icon: Settings }
        ];
      default:
        return [
          { label: 'Thông báo', path: '/user/shared/notifications', icon: Bell },
          { label: 'Lịch chung', path: '/user/shared/calendar', icon: Calendar }
        ];
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Đang tải...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-100 rounded-lg p-8">
        <div className="max-w-4xl">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Chào mừng, {user?.name || 'Người dùng'}!
          </h1>
          <p className="text-lg text-gray-600 mb-4">
            Chào mừng bạn đến với hệ thống quản lý mầm non Sunshine
          </p>
          <div className="flex items-center gap-4">
            <Badge variant="primary" className="text-sm px-3 py-1">
              {getRoleDisplayName(user?.role)}
            </Badge>
            <span className="text-sm text-gray-500">
              Đăng nhập lúc: {new Date().toLocaleString('vi-VN')}
            </span>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Thông báo mới"
          value={0}
          description="Chưa đọc"
          icon={Bell}
          trend={{ value: 0, isPositive: true }}
        />
        <StatCard
          title="Hoạt động hôm nay"
          value={0}
          description="Đã hoàn thành"
          icon={Calendar}
          trend={{ value: 0, isPositive: true }}
        />
        <StatCard
          title="Tài liệu"
          value={0}
          description="Cần xử lý"
          icon={FileText}
          trend={{ value: 0, isPositive: true }}
        />
        <StatCard
          title="Hiệu suất"
          value="100%"
          description="Tuần này"
          icon={TrendingUp}
          trend={{ value: 0, isPositive: true }}
        />
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-6">Thao tác nhanh</h3>        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {getQuickActions().map((action) => {
            const IconComponent = action.icon;
            return (
              <Button
                key={action.path}
                variant="outline"
                className="h-auto p-4 justify-start group hover:bg-blue-50 hover:border-blue-200"
                onClick={() => navigate(action.path)}
              >
                <div className="flex items-center gap-3 w-full">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center group-hover:bg-blue-200">
                    <IconComponent className="w-5 h-5 text-blue-600" />
                  </div>
                  <div className="flex-1 text-left">
                    <span className="font-medium text-gray-900">{action.label}</span>
                  </div>
                  <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-blue-600" />
                </div>
              </Button>
            );
          })}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Hoạt động gần đây</h3>
        <div className="text-center py-8">
          <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500">Chưa có hoạt động nào gần đây</p>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
