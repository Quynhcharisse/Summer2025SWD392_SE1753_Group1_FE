import {Badge, Button, Spinner} from "@atoms";
import {StatCard} from "@molecules";
import {getCurrentTokenData, isAuthenticated} from "@services/JWTService.jsx";
import {PageTemplate} from "@templates";
import {
  AlertCircle,
  Baby,
  Bell,
  Calendar,
  CheckCircle,
  CreditCard,
  FileText,
  MessageSquare,
  Settings,
} from "lucide-react";
import {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";

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
          navigate("/auth/login", {
            state: {
              returnUrl: "/user/parent/dashboard",
              message: "Vui lòng đăng nhập để truy cập dashboard phụ huynh.",
            },
          });
          return;
        } // Get current user
        const tokenData = getCurrentTokenData();
        setUser(tokenData);

        // Load applications
        // const userApplications =
        //   await enrollmentService.getUserEnrollmentApplications();
        // setApplications(userApplications);

        // Mock notifications and events for now
        setNotifications([
          {
            id: 1,
            type: "info",
            title: "New Notification",
            message: "Lịch phỏng vấn đã được sắp xếp cho ngày 10/06/2025",
            date: "2025-06-05",
            read: false,
          },
          {
            id: 2,
            type: "success",
            title: "Application Approved",
            message: "Your child's application has been reviewed and approved",
            date: "2025-06-04",
            read: true,
          },
        ]);

        setUpcomingEvents([
          {
            id: 1,
            title: "Enrollment Interview",
            date: "2025-06-10",
            time: "09:00 AM",
            location: "Room 101",
          },
          {
            id: 2,
            title: "Parent Meeting",
            date: "2025-06-15",
            time: "02:00 PM",
            location: "Auditorium",
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
      SUBMITTED: { variant: "default", text: "Submitted" },
      UNDER_REVIEW: { variant: "warning", text: "Under Review" },
      APPROVED: { variant: "success", text: "Approved" },
      REJECTED: { variant: "destructive", text: "Rejected" },
      WAITLISTED: { variant: "secondary", text: "Waitlisted" },
    };

    const config = statusConfig[status] || { variant: "default", text: status };
    return <Badge variant={config.variant}>{config.text}</Badge>;
  };

  const handleViewApplication = (applicationId) => {
    navigate(`/user/parent/forms`); // Xem danh sách đơn
  };
  const handleNewApplication = () => {
    navigate("/user/parent/child-list"); // Đăng ký mới: chuyển sang danh sách child để chọn hoặc thêm child
  };

  if (loading) {
    return (
      <PageTemplate title="Parent Dashboard">
        <div className="text-center py-8">
          <Spinner size="lg" className="mx-auto mb-4" />
          <p className="text-gray-600">Loading information...</p>
        </div>
      </PageTemplate>
    );
  }

  return (
    <PageTemplate
      title={`Welcome, ${user?.name || "Parent"}`}
      subtitle="Manage information and track enrollment application process"
      actions={
        <div className="flex gap-4">
          <Button
            variant="outline"
            size="md"
            onClick={() => navigate("/user/parent/forms")}
          >
            <FileText className="w-4 h-4 mr-2" />
            My Applications
          </Button>
          <Button variant="primary" size="md" onClick={handleNewApplication}>
            <Baby className="w-4 h-4 mr-2" />
            Create New Application
          </Button>
        </div>
      }
    >
      <div className="space-y-8">
        {/* Quick Stats */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="Applications"
            value={applications.length}
            description="Total applications"
            icon={FileText}
            trend={{ value: 0, isPositive: true }}
          />
          <StatCard
            title="New Notifications"
            value={notifications.filter((n) => !n.read).length}
            description="Unread"
            icon={Bell}
            trend={{ value: 0, isPositive: true }}
          />
          <StatCard
            title="Events"
            value={upcomingEvents.length}
            description="Upcoming"
            icon={Calendar}
            trend={{ value: 0, isPositive: true }}
          />
          <StatCard
            title="Messages"
            value={0}
            description="New messages"
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
                  Recent Applications
                </h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() =>
                    navigate("/user/parent/forms")
                  }
                >
                  View All
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
                            Program: {application.program}
                          </p>
                          <p className="text-xs text-gray-500">
                            Submitted on:{" "}
                            {new Date(
                              application.applicationDate
                            ).toLocaleDateString("en-US")}
                          </p>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleViewApplication(application.id)}
                        >
                          View Details
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <FileText className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-500 mb-4">
                    You have no applications yet
                  </p>
                  <Button variant="primary" onClick={handleNewApplication}>
                    Create New Application
                  </Button>
                </div>
              )}
            </div>

            {/* Upcoming Events */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                Upcoming Events
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
                          {new Date(event.date).toLocaleDateString("en-US")} •{" "}
                          {event.time}
                        </p>
                        <p className="text-xs text-gray-500">
                          {event.location}
                        </p>
                      </div>
                      <Button variant="ghost" size="sm">
                        Details
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-4">
                  No upcoming events
                </p>
              )}
            </div>
          </div>

          {/* Right Column - Notifications and Quick Actions */}
          <div className="space-y-6">
            {/* Notifications */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                Notifications
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
                              "en-US"
                            )}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-4">
                  No new notifications
                </p>
              )}
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                Quick Actions
              </h3>
              <div className="space-y-3">
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => navigate("/user/parent/child-list")}
                >
                  <Baby className="w-4 h-4 mr-3" />
                  Manage Children
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => navigate("/user/parent/forms")}
                >
                  <FileText className="w-4 h-4 mr-3" />
                  My Applications
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => navigate("/user/parent/schedule")}
                >
                  <Calendar className="w-4 h-4 mr-3" />
                  Book Appointment
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => navigate("/user/parent/payments")}
                >
                  <CreditCard className="w-4 h-4 mr-3" />
                  Payments
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => navigate("/user/parent/profile")}
                >
                  <Settings className="w-4 h-4 mr-3" />
                  Account Settings
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
