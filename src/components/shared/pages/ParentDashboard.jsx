import {Badge, Button, Spinner} from "@atoms";
import {StatCard} from "@molecules";
import {getCurrentTokenData, isAuthenticated} from "@services/JWTService.jsx";
import {PageTemplate} from "@templates";
import {
  Baby,
  CreditCard,
  FileText,
  Settings,
} from "lucide-react";
import {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";

const ParentDashboard = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [applications, setApplications] = useState([]);

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

      } catch (error) {
//         console.error("Failed to load dashboard data:", error);
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
      {/* <div className="space-y-8"> */}
       

        {/* Main Content Grid */}
        {/* <div className="grid grid-cols-1 lg:grid-cols-3 gap-8"> */}
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
                    You have no forms yet
                  </p>
                  <Button variant="primary" onClick={handleNewApplication}>
                    Create New Form
                  </Button>
                </div>
              )}
            </div>
          </div>

          {/* Right Column - Notifications and Quick Actions */}
          <div className="space-y-6">
        
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
                  My Children
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => navigate("/user/parent/forms")}
                >
                  <FileText className="w-4 h-4 mr-3" />
                  My Form
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => navigate("/user/parent/schedule")}
                >
                  {/* Calendar icon removed */}
                  Schedule Student
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => navigate("/user/parent/payments")}
                >
                  <CreditCard className="w-4 h-4 mr-3" />
                  Payment
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => navigate("/user/parent/profile")}
                >
                  <Settings className="w-4 h-4 mr-3" />
                  Account Profile
                </Button>
              </div>
            </div>
          </div>
        {/* </div> */}
      {/* </div> */}
    </PageTemplate>
  );
};

export default ParentDashboard;
