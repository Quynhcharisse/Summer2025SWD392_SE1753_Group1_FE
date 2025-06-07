import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { PageTemplate } from "@templates";
import { Button, Badge, Spinner } from "@atoms";
import { StatCard } from "@molecules";
import {
  Bell,
  Calendar,
  FileText,
  MessageSquare,
  CreditCard,
  Settings,
  Baby,
  AlertCircle,
  CheckCircle,
} from "lucide-react";
import { enrollmentService } from "../../../api/services/enrollmentService";
import {
  isAuthenticated,
  getCurrentTokenData,
} from "../../../api/services/JWTService";
import { authService } from "../../../api/services/authService";

const ParentDashboard = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [applications, setApplications] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [upcomingEvents, setUpcomingEvents] = useState([]);

  useEffect(() => {
    const checkAuthAndLoadData = async () => {
      try {
        if (!isAuthenticated()) {
          navigate("/login", {
            state: {
              returnUrl: "/parent/dashboard",
              message: "Vui lòng đăng nhập để truy cập dashboard phụ huynh.",
            },
          });
          return;
        } // Get current user
        const tokenData = getCurrentTokenData();
        const currentUser = await authService.getCurrentUser();
        setUser(currentUser || tokenData);

        // Load applications
        const userApplications =
          await enrollmentService.getUserEnrollmentApplications();
        setApplications(userApplications);

        // Mock notifications and events for now
        setNotifications([
          {
            id: 1,
            type: "info",
            title: "Thông báo mới",
            message: "Lịch phỏng vấn đã được sắp xếp cho ngày 10/06/2025",
            date: "2025-06-05",
            read: false,
          },
          {
            id: 2,
            type: "success",
            title: "Đơn đăng ký được duyệt",
            message: "Đơn đăng ký của bé đã được xem xét và chấp thuận",
            date: "2025-06-04",
            read: true,
          },
        ]);

        setUpcomingEvents([
          {
            id: 1,
            title: "Phỏng vấn nhập học",
            date: "2025-06-10",
            time: "09:00 AM",
            location: "Phòng 101",
          },
          {
            id: 2,
            title: "Họp phụ huynh",
            date: "2025-06-15",
            time: "02:00 PM",
            location: "Hội trường",
          },
        ]);
      } catch (error) {
        console.error("Failed to load dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    checkAuthAndLoadData();
  }, [navigate]);

  const getStatusBadge = (status) => {
    const statusConfig = {
      SUBMITTED: { variant: "default", text: "Đã nộp" },
      UNDER_REVIEW: { variant: "warning", text: "Đang xem xét" },
      APPROVED: { variant: "success", text: "Đã duyệt" },
      REJECTED: { variant: "destructive", text: "Bị từ chối" },
      WAITLISTED: { variant: "secondary", text: "Danh sách chờ" },
    };

    const config = statusConfig[status] || { variant: "default", text: status };
    return <Badge variant={config.variant}>{config.text}</Badge>;
  };

  const handleViewApplication = (applicationId) => {
    navigate(`/enrollment/application/${applicationId}`);
  };

  const handleNewApplication = () => {
    navigate("/enrollment/application/new");
  };

  if (loading) {
    return (
      <PageTemplate title="Dashboard phụ huynh">
        <div className="text-center py-8">
          <Spinner size="lg" className="mx-auto mb-4" />
          <p className="text-gray-600">Đang tải thông tin...</p>
        </div>
      </PageTemplate>
    );
  }

  return (
    <PageTemplate
      title={`Chào mừng, ${user?.name || "Phụ huynh"}`}
      subtitle="Quản lý thông tin và theo dõi quá trình đăng ký nhập học"
      actions={
        <div className="flex gap-4">
          <Button
            variant="outline"
            size="md"
            onClick={() => navigate("/enrollment/my-applications")}
          >
            <FileText className="w-4 h-4 mr-2" />
            Đơn đăng ký
          </Button>
          <Button variant="primary" size="md" onClick={handleNewApplication}>
            <Baby className="w-4 h-4 mr-2" />
            Đăng ký mới
          </Button>
        </div>
      }
    >
      <div className="space-y-8">
        {/* Quick Stats */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="Đơn đăng ký"
            value={applications.length}
            description="Tổng số đơn"
            icon={FileText}
            trend={{ value: 0, isPositive: true }}
          />
          <StatCard
            title="Thông báo mới"
            value={notifications.filter((n) => !n.read).length}
            description="Chưa đọc"
            icon={Bell}
            trend={{ value: 0, isPositive: true }}
          />
          <StatCard
            title="Sự kiện"
            value={upcomingEvents.length}
            description="Sắp tới"
            icon={Calendar}
            trend={{ value: 0, isPositive: true }}
          />
          <StatCard
            title="Tin nhắn"
            value={0}
            description="Tin mới"
            icon={MessageSquare}
            trend={{ value: 0, isPositive: true }}
          />
        </section>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Applications and Events */}
          <div className="lg:col-span-2 space-y-6">
            {/* Recent Applications */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-800">
                  Đơn đăng ký gần đây
                </h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigate("/enrollment/my-applications")}
                >
                  Xem tất cả
                </Button>
              </div>

              {applications.length > 0 ? (
                <div className="space-y-4">
                  {applications.slice(0, 3).map((application) => (
                    <div
                      key={application.id}
                      className="border rounded-lg p-4 hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h4 className="font-medium text-gray-800">
                              {application.child?.firstName}{" "}
                              {application.child?.lastName}
                            </h4>
                            {getStatusBadge(application.status)}
                          </div>
                          <p className="text-sm text-gray-600">
                            Chương trình: {application.program}
                          </p>
                          <p className="text-xs text-gray-500">
                            Ngày nộp:{" "}
                            {new Date(
                              application.applicationDate
                            ).toLocaleDateString("vi-VN")}
                          </p>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleViewApplication(application.id)}
                        >
                          Xem chi tiết
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <FileText className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-500 mb-4">
                    Bạn chưa có đơn đăng ký nào
                  </p>
                  <Button variant="primary" onClick={handleNewApplication}>
                    Tạo đơn đăng ký mới
                  </Button>
                </div>
              )}
            </div>

            {/* Upcoming Events */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                Sự kiện sắp tới
              </h3>
              {upcomingEvents.length > 0 ? (
                <div className="space-y-3">
                  {upcomingEvents.map((event) => (
                    <div
                      key={event.id}
                      className="flex items-center gap-4 p-3 border rounded-lg"
                    >
                      <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                        <Calendar className="w-6 h-6 text-blue-600" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-800">
                          {event.title}
                        </h4>
                        <p className="text-sm text-gray-600">
                          {new Date(event.date).toLocaleDateString("vi-VN")} •{" "}
                          {event.time}
                        </p>
                        <p className="text-xs text-gray-500">
                          {event.location}
                        </p>
                      </div>
                      <Button variant="ghost" size="sm">
                        Chi tiết
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-4">
                  Không có sự kiện nào sắp tới
                </p>
              )}
            </div>
          </div>

          {/* Right Column - Notifications and Quick Actions */}
          <div className="space-y-6">
            {/* Notifications */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                Thông báo
              </h3>
              {notifications.length > 0 ? (
                <div className="space-y-3">
                  {notifications.slice(0, 5).map((notification) => (
                    <div
                      key={notification.id}
                      className={`p-3 rounded-lg border ${
                        !notification.read
                          ? "bg-blue-50 border-blue-200"
                          : "bg-gray-50"
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        {notification.type === "success" ? (
                          <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
                        ) : (
                          <AlertCircle className="w-5 h-5 text-blue-500 mt-0.5" />
                        )}
                        <div className="flex-1">
                          <h4 className="font-medium text-sm text-gray-800">
                            {notification.title}
                          </h4>
                          <p className="text-xs text-gray-600 mt-1">
                            {notification.message}
                          </p>
                          <p className="text-xs text-gray-500 mt-2">
                            {new Date(notification.date).toLocaleDateString(
                              "vi-VN"
                            )}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-4">
                  Không có thông báo mới
                </p>
              )}
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                Thao tác nhanh
              </h3>
              <div className="space-y-3">
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => navigate("/enrollment")}
                >
                  <Baby className="w-4 h-4 mr-3" />
                  Đăng ký nhập học mới
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => navigate("/enrollment/my-applications")}
                >
                  <FileText className="w-4 h-4 mr-3" />
                  Quản lý đơn đăng ký
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => navigate("/schedule")}
                >
                  <Calendar className="w-4 h-4 mr-3" />
                  Đặt lịch hẹn
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => navigate("/payments")}
                >
                  <CreditCard className="w-4 h-4 mr-3" />
                  Thanh toán
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => navigate("/profile")}
                >
                  <Settings className="w-4 h-4 mr-3" />
                  Cài đặt tài khoản
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageTemplate>
  );
};

export default ParentDashboard;
