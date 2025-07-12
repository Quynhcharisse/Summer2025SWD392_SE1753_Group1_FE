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
//         console.error('Error loading user data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadUserData();
  }, [navigate]);

  const getRoleDisplayName = (role) => {
    switch (role) {
      case 'parent': return 'Parent';
      case 'teacher': return 'Teacher';
      case 'admission': return 'Admission Staff';
      case 'admin': return 'Administrator';
      default: return 'User';
    }
  };

  const getQuickActions = () => {
    const role = user?.role?.toLowerCase();
    switch (role) {
      case 'parent':
        return [
          { label: 'Application', path: '/enrollment', icon: FileText },
          { label: 'Class Schedule', path: '/user/parent/calendar', icon: Calendar },
          { label: 'Messages', path: '/user/parent/messages', icon: Bell }
        ];
      case 'teacher':
        return [
          { label: 'Attendance', path: '/user/teacher/attendance', icon: Users },
          { label: 'Journal', path: '/user/teacher/journal', icon: FileText },
          { label: 'Messages', path: '/user/teacher/messages', icon: Bell }
        ];
      case 'admission':
        return [
          { label: 'Registration Records', path: '/user/admission/registrations', icon: FileText },
          { label: 'Reports', path: '/user/admission/reports', icon: TrendingUp },
          { label: 'Settings', path: '/user/shared/notifications', icon: Settings }
        ];
      case 'admin':
        return [
          { label: 'User Management', path: '/user/admin/users', icon: Users },
          { label: 'Statistics', path: '/user/admin/statistics', icon: TrendingUp },
          { label: 'Settings', path: '/user/admin/settings', icon: Settings }
        ];
      default:
        return [
          { label: 'Notifications', path: '/user/shared/notifications', icon: Bell },
          { label: 'Shared Calendar', path: '/user/shared/calendar', icon: Calendar }
        ];
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
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
            Welcome, {user?.name || 'User'}!
          </h1>
          <p className="text-lg text-gray-600 mb-4">
            Welcome to Sunshine Preschool Management System
          </p>
          <div className="flex items-center gap-4">
            <Badge variant="primary" className="text-sm px-3 py-1">
              {getRoleDisplayName(user?.role)}
            </Badge>
            <span className="text-sm text-gray-500">
              Login time: {new Date().toLocaleString('en-US')}
            </span>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="New Notifications"
          value="3"
          description="Unread"
          icon={Bell}
          trend={{ value: 0, isPositive: true }}
        />
        <StatCard
          title="Today's Activities"
          value="5"
          description="Completed"
          icon={Calendar}
          trend={{ value: 0, isPositive: true }}
        />
        <StatCard
          title="Documents"
          value="12"
          description="Need Processing"
          icon={FileText}
          trend={{ value: 0, isPositive: true }}
        />
        <StatCard
          title="Performance"
          value="85%"
          description="This Week"
          icon={TrendingUp}
          trend={{ value: 0, isPositive: true }}
        />
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-6">Quick Actions</h3>        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Recent Activities</h3>
        <div className="text-center py-8">
          <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500">No recent activities</p>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
