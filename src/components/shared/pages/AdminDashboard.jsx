import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { PageTemplate } from "@templates";
import { Button, Badge, Spinner } from "@atoms";
import { StatCard } from "@molecules";
import { 
  Users, 
  BookOpen, 
  TrendingUp, 
  Settings, 
  UserCheck,
  FileText,
  Calendar,
  AlertTriangle
} from "lucide-react";
import { isAuthenticated, getCurrentTokenData } from "../../../api/services/JWTService";
import { authService } from "../../../api/services/authService";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [systemStats, setSystemStats] = useState({});
  const [recentActivities, setRecentActivities] = useState([]);
  const [alerts, setAlerts] = useState([]);

  useEffect(() => {
    const checkAuthAndLoadData = async () => {
      try {
        if (!isAuthenticated()) {
          navigate('/auth/login', { 
            state: { 
              returnUrl: '/user/admin/dashboard',
              message: 'Vui lòng đăng nhập để truy cập dashboard quản trị.'
            }
          });
          return;
        }

        // Get current user
        const tokenData = getCurrentTokenData();
        const currentUser = await authService.getCurrentUser();
        setUser(currentUser || tokenData);

        // Mock system stats for now
        setSystemStats({
          totalUsers: 485,
          totalStudents: 120,
          totalTeachers: 25,
          totalClasses: 8,
          activeApplications: 45,
          pendingApprovals: 12,
          systemUptime: '99.9%',
          monthlyGrowth: 8
        });

        setRecentActivities([
          {
            id: 1,
            type: 'user_registration',
            message: 'Phụ huynh mới đăng ký tài khoản',
            user: 'Sarah Johnson',
            timestamp: '2025-06-05 14:30',
            status: 'success'
          },
          {
            id: 2,
            type: 'application_submitted',
            message: 'Đơn đăng ký nhập học mới',
            user: 'Mike Smith',
            timestamp: '2025-06-05 13:15',
            status: 'info'
          },
          {
            id: 3,
            type: 'class_created',
            message: 'Lớp học mới được tạo',
            user: 'Admin',
            timestamp: '2025-06-05 10:45',
            status: 'success'
          }
        ]);

        setAlerts([
          {
            id: 1,
            type: 'warning',
            title: 'Cập nhật hệ thống',
            message: 'Hệ thống sẽ được bảo trì vào 23:00 ngày 10/06/2025',
            priority: 'medium'
          },
          {
            id: 2,
            type: 'info',
            title: 'Báo cáo tháng',
            message: 'Báo cáo tháng 5 đã sẵn sàng để xem',
            priority: 'low'
          }
        ]);

      } catch (error) {
        console.error('Failed to load admin dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    checkAuthAndLoadData();
  }, [navigate]);

  const getActivityIcon = (type) => {
    switch (type) {
      case 'user_registration': return <Users className="w-5 h-5 text-blue-600" />;
      case 'application_submitted': return <FileText className="w-5 h-5 text-green-600" />;
      case 'class_created': return <BookOpen className="w-5 h-5 text-purple-600" />;
      default: return <AlertTriangle className="w-5 h-5 text-gray-600" />;
    }
  };

  const getAlertBadge = (type) => {
    switch (type) {
      case 'warning': return <Badge variant="warning">Cảnh báo</Badge>;
      case 'error': return <Badge variant="destructive">Lỗi</Badge>;
      case 'info': return <Badge variant="default">Thông tin</Badge>;
      case 'success': return <Badge variant="success">Thành công</Badge>;
      default: return <Badge variant="default">Khác</Badge>;
    }
  };

  if (loading) {
    return (
      <PageTemplate title="Dashboard quản trị">
        <div className="text-center py-8">
          <Spinner size="lg" className="mx-auto mb-4" />
          <p className="text-gray-600">Đang tải thông tin...</p>
        </div>
      </PageTemplate>
    );
  }

  return (
    <PageTemplate
      title={`Chào mừng, ${user?.name || 'Quản trị viên'}`}
      subtitle="Tổng quan hệ thống và quản lý toàn bộ hoạt động"
      actions={
        <div className="flex gap-4">
          <Button 
            variant="outline" 
            size="md"
            onClick={() => navigate('/user/admin/statistics')}
          >
            <TrendingUp className="w-4 h-4 mr-2" />
            Thống kê
          </Button>
          <Button 
            variant="primary" 
            size="md"
            onClick={() => navigate('/user/admin/settings')}
          >
            <Settings className="w-4 h-4 mr-2" />
            Cài đặt
          </Button>
        </div>
      }
    >
      <div className="space-y-8">
        {/* Quick Stats */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="Tổng người dùng"
            value={systemStats.totalUsers}
            description="Trong hệ thống"
            icon={Users}
            trend={{ value: systemStats.monthlyGrowth, isPositive: true }}
          />
          <StatCard
            title="Học sinh"
            value={systemStats.totalStudents}
            description="Đang theo học"
            icon={UserCheck}
            trend={{ value: 5, isPositive: true }}
          />
          <StatCard
            title="Giáo viên"
            value={systemStats.totalTeachers}
            description="Đang hoạt động"
            icon={BookOpen}
            trend={{ value: 2, isPositive: true }}
          />
          <StatCard
            title="Lớp học"
            value={systemStats.totalClasses}
            description="Đang vận hành"
            icon={Calendar}
            trend={{ value: 1, isPositive: true }}
          />
        </section>

        {/* System Alerts */}
        {alerts.length > 0 && (
          <section className="bg-amber-50 border border-amber-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-amber-800 mb-4 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5" />
              Cảnh báo hệ thống
            </h3>
            <div className="space-y-3">
              {alerts.map((alert) => (
                <div key={alert.id} className="bg-white rounded-lg p-4 border border-amber-200">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h4 className="font-medium text-gray-800">{alert.title}</h4>
                        {getAlertBadge(alert.type)}
                      </div>
                      <p className="text-sm text-gray-600">{alert.message}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Recent Activities */}
          <div className="lg:col-span-2 space-y-6">
            {/* Recent System Activities */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-800">Hoạt động gần đây</h3>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => navigate('/user/admin/logs')}
                >
                  Xem tất cả
                </Button>
              </div>
              
              <div className="space-y-3">
                {recentActivities.map((activity) => (
                  <div key={activity.id} className="flex items-center gap-4 p-3 border rounded-lg">
                    <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                      {getActivityIcon(activity.type)}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-800">{activity.message}</h4>
                      <p className="text-sm text-gray-600">Bởi: {activity.user}</p>
                      <p className="text-xs text-gray-500">{activity.timestamp}</p>
                    </div>
                    <Badge variant={activity.status === 'success' ? 'success' : 'default'}>
                      {activity.status}
                    </Badge>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Stats Overview */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Tổng quan hệ thống</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-blue-50 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-blue-600 font-medium">Đơn đăng ký</p>
                      <p className="text-2xl font-bold text-blue-700">{systemStats.activeApplications}</p>
                    </div>
                    <FileText className="w-8 h-8 text-blue-600" />
                  </div>
                </div>
                <div className="bg-yellow-50 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-yellow-600 font-medium">Chờ duyệt</p>
                      <p className="text-2xl font-bold text-yellow-700">{systemStats.pendingApprovals}</p>
                    </div>
                    <UserCheck className="w-8 h-8 text-yellow-600" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - System Info and Quick Actions */}
          <div className="space-y-6">
            {/* System Status */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Trạng thái hệ thống</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Uptime:</span>
                  <Badge variant="success">{systemStats.systemUptime}</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Người dùng online:</span>
                  <span className="font-medium">{Math.floor(systemStats.totalUsers * 0.15)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Cơ sở dữ liệu:</span>
                  <Badge variant="success">Hoạt động tốt</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Phiên bản:</span>
                  <span className="font-medium">v2.1.0</span>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Thao tác nhanh</h3>
              <div className="space-y-3">
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => navigate('/user/admin/users')}
                >
                  <Users className="w-4 h-4 mr-3" />
                  Quản lý người dùng
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => navigate('/user/admin/classes')}
                >
                  <BookOpen className="w-4 h-4 mr-3" />
                  Quản lý lớp học
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => navigate('/user/admin/admissions')}
                >
                  <FileText className="w-4 h-4 mr-3" />
                  Quản lý tuyển sinh
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => navigate('/user/admin/statistics')}
                >
                  <TrendingUp className="w-4 h-4 mr-3" />
                  Thống kê báo cáo
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => navigate('/user/admin/settings')}
                >
                  <Settings className="w-4 h-4 mr-3" />
                  Cài đặt hệ thống
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageTemplate>
  );
};

export default AdminDashboard;
