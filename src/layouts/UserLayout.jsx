import React, { useState } from "react";
import { Outlet, useNavigate, useLocation, Link } from "react-router-dom";
import { themeClasses } from "@theme/colors";
import { getCurrentTokenData } from "@services/JWTService.jsx";
import PropTypes from "prop-types";
import {
  Users,
  BookOpen,
  Calendar,
  MessageSquare,
  Settings,
  FileText,
  UserCheck,
  TrendingUp,
  Bell,
  Menu,
  X,
  LogOut,
  Home,
  User,
  RotateCcw,
  ListTodo
} from "lucide-react";

const UserLayout = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Get user info from token
  const tokenData = getCurrentTokenData();
  const userRole = tokenData?.role?.toLowerCase();
  const userName = tokenData?.name || "User";

  // Navigation items based on user role
  const getNavigationItems = () => {
    switch (userRole) {
      case "parent":
        return [
          {
            key: "/user/parent/dashboard",
            icon: Home,
            label: "Dashboard",
            path: "/user/parent/dashboard",
          },
          {
            key: "/user/parent/calendar",
            icon: Calendar,
            label: "Class Schedule",
            path: "/user/parent/calendar",
          },
          {
<<<<<<< Updated upstream
            key: "/user/parent/forms",
            icon: ListTodo,
            label: "Đơn nhâp học",
            path: "/user/parent/forms",
=======
            key: "/user/parent/meals",
            icon: FileText,
            label: "Meal Menu",
            path: "/user/parent/meals",
          },
          {
            key: "/user/parent/gallery",
            icon: BookOpen,
            label: "Photo Gallery",
            path: "/user/parent/gallery",
>>>>>>> Stashed changes
          },
          {
            key: "/user/parent/messages",
            icon: MessageSquare,
            label: "Messages",
            path: "/user/parent/messages",
          },
          {
            key: "/user/shared/profile",
            icon: User,
            label: "Profile",
            path: "/user/shared/profile",
          },
        ];

      case "teacher":
        return [
          {
            key: "/user/teacher/dashboard",
            icon: Home,
            label: "Dashboard",
            path: "/user/teacher/dashboard",
          },
          {
            key: "/user/teacher/attendance",
            icon: UserCheck,
            label: "Attendance",
            path: "/user/teacher/attendance",
          },
          {
            key: "/user/teacher/journal",
            icon: BookOpen,
            label: "Class Journal",
            path: "/user/teacher/journal",
          },
          {
            key: "/user/teacher/messages",
            icon: MessageSquare,
            label: "Messages",
            path: "/user/teacher/messages",
          },
          {
            key: "/user/shared/profile",
            icon: User,
            label: "Profile",
            path: "/user/shared/profile",
          },
        ];

      case "admission":
        return [
          {
            key: '/user/admission/dashboard',
            icon: Home,
            label: 'Dashboard',
            path: '/user/admission/dashboard'
          },
<<<<<<< Updated upstream
          {
            key: '/user/admission/terms',
            icon: Calendar,
            label: 'Kỳ tuyển sinh',
            path: '/user/admission/terms'
          },          {
            key: '/user/admission/forms',
            icon: RotateCcw,
            label: 'Đơn xét duyệt',
            path: '/user/admission/forms'
          },
          {
            key: '/user/shared/profile',
            icon: User,
            label: 'Thông tin cá nhân',
=======
          { 
            key: '/user/admission/registrations', 
            icon: FileText, 
            label: 'Registration Records',
            path: '/user/admission/registrations'
          },          { 
            key: '/user/admission/reports', 
            icon: TrendingUp, 
            label: 'Reports',
            path: '/user/admission/reports'
          },
          { 
            key: '/user/shared/profile', 
            icon: User, 
            label: 'Profile',
>>>>>>> Stashed changes
            path: '/user/shared/profile'
          }        ];
        
      case 'hr':
        return [
          { 
            key: '/user/hr/dashboard', 
            icon: Home, 
            label: 'Dashboard',
            path: '/user/hr/dashboard'
          },
          { 
            key: '/user/hr/staff', 
            icon: Users, 
            label: 'Staff Management',
            path: '/user/hr/staff'
          },
          { 
            key: '/user/hr/reports', 
            icon: TrendingUp, 
            label: 'HR Reports',
            path: '/user/hr/reports'
          },
          {
            key: "/user/shared/profile",
            icon: User,
            label: "Profile",
            path: "/user/shared/profile",
          },
        ];
        
      case 'education':
        return [
          { 
            key: '/user/education/dashboard', 
            icon: Home, 
            label: 'Dashboard',
            path: '/user/education/dashboard'
          },
          { 
            key: '/user/education/syllabus', 
            icon: BookOpen, 
            label: 'Curriculum',
            path: '/user/education/syllabus'
          },
          { 
            key: '/user/education/lesson', 
            icon: BookOpen, 
            label: 'Lessons',
            path: '/user/education/lesson'
          },
          { 
            key: '/user/education/event', 
            icon: BookOpen, 
            label: 'Events',
            path: '/user/education/event'
          },
          { 
            key: '/user/education/classes', 
            icon: Users, 
            label: 'Class Management',
            path: '/user/education/classes'
          },
          { 
            key: '/user/education/reports', 
            icon: TrendingUp, 
            label: 'Education Reports',
            path: '/user/education/reports'
          },
          {
            key: "/user/shared/profile",
            icon: User,
            label: "Profile",
            path: "/user/shared/profile",
          },
        ];

      case "admin":
        return [
          {
            key: "/user/admin/dashboard",
            icon: Home,
            label: "Dashboard",
            path: "/user/admin/dashboard",
          },
          {
            key: "/user/admin/users",
            icon: Users,
            label: "User Management",
            path: "/user/admin/users",
          },
          {
            key: "/user/admin/classes",
            icon: BookOpen,
            label: "Class Management",
            path: "/user/admin/classes",
          },
          {
            key: "/user/admin/statistics",
            icon: TrendingUp,
            label: "Statistics",
            path: "/user/admin/statistics",
          },
          {
            key: "/user/admin/settings",
            icon: Settings,
            label: "Settings",
            path: "/user/admin/settings",
          },
          {
            key: "/user/shared/profile",
            icon: User,
            label: "Profile",
            path: "/user/shared/profile",
          },
        ];

      default:
        return [
          {
            key: "/user/dashboard",
            icon: Home,
            label: "Dashboard",
            path: "/user/dashboard",
          },
        ];
    }
  };

  const navigationItems = getNavigationItems();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/auth/login");
  };

  const handleNavigation = (path) => {
    navigate(path);
    setSidebarOpen(false); // Close mobile sidebar
  };

  const isActiveRoute = (path) => {
    return (
      location.pathname === path || location.pathname.startsWith(path + "/")
    );
  };
  const getRoleDisplayName = () => {
    switch (userRole) {
      case "parent":
        return "Parent";
      case "teacher":
        return "Teacher";
      case "admission":
        return "Admission Staff";
      case "hr":
        return "HR Staff";
      case "education":
        return "Education Staff";
      case "admin":
        return "Administrator";
      default:
        return "User";
    }
  };

  return (
    <div className={`min-h-screen flex ${themeClasses.backgroundSurface}`}>
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
          onKeyDown={(e) => {
            if (e.key === "Escape") {
              setSidebarOpen(false);
            }
          }}
          role="button"
          tabIndex={0}
          aria-label="Close sidebar"
        />
      )}
      {/* Sidebar */}
      <div
        className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out
        lg:translate-x-0 lg:static lg:inset-0
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
      `}
      >
        {/* Sidebar Header */}
        <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200">
          <Link to="/">
            <div className="flex flex-col items-center gap-0">
              <img
                src="/SUNSHINE.png"
                alt="Sunshine Preschool"
                className="h-8 w-auto"
              />
              <span className="font-bold text-lg text-blue-600">PreSchool</span>
            </div>
          </Link>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-1 rounded-md text-gray-400 hover:text-gray-600"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* User Info */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
              <span className="text-blue-600 font-semibold">
                {userName.charAt(0).toUpperCase()}
              </span>
            </div>
            <div>
              <p className="font-medium text-gray-900">{userName}</p>
              <p className="text-sm text-gray-500">{getRoleDisplayName()}</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4">
          <ul className="space-y-2">
            {navigationItems.map((item) => {
              const IconComponent = item.icon;
              const isActive = isActiveRoute(item.path);

              return (
                <li key={item.key}>
                  <button
                    onClick={() => handleNavigation(item.path)}
                    className={`
                      w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors
                      ${
                        isActive
                          ? "bg-blue-50 text-blue-700 border-l-4 border-blue-500"
                          : "text-gray-700 hover:bg-gray-50"
                      }
                    `}
                  >
                    <IconComponent
                      className={`w-5 h-5 ${
                        isActive ? "text-blue-600" : "text-gray-500"
                      }`}
                    />
                    <span className="font-medium">{item.label}</span>
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-gray-200">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2 text-gray-700 hover:bg-red-50 hover:text-red-600 rounded-lg transition-colors"
          >
            <LogOut className="w-5 h-5" />
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </div>
      {/* Main Content */}
      <div className="flex-1 flex flex-col lg:ml-0">
        {/* Top Header */}
        <header className="h-16 bg-white shadow-sm border-b border-gray-200 flex items-center justify-between px-6">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 rounded-md text-gray-400 hover:text-gray-600"
            >
              <Menu className="w-5 h-5" />
            </button>
            <h1 className="text-xl font-semibold text-gray-900">
              {getRoleDisplayName()} Portal
            </h1>
          </div>

          <div className="flex items-center gap-4">
            <button className="p-2 text-gray-400 hover:text-gray-600 rounded-lg">
              <Bell className="w-5 h-5" />
            </button>
            <div className="hidden sm:flex items-center gap-3">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-blue-600 font-semibold text-sm">
                  {userName.charAt(0).toUpperCase()}
                </span>
              </div>
              <span className="text-sm font-medium text-gray-900">
                {userName}
              </span>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className={`flex-1 p-6 ${themeClasses.backgroundSurface}`}>
          {children || <Outlet />}
        </main>
      </div>
    </div>
  );
};

UserLayout.propTypes = {
  children: PropTypes.node,
};

export default UserLayout;
