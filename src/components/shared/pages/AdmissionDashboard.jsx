import { Badge, Spinner } from "@atoms";
import { StatCard } from "@molecules";
import { getCurrentTokenData, isAuthenticated } from "@services/JWTService.jsx";
import { getAdmissionFormStatusSummary } from "@services/admissionService.js";
import { authService } from "@services/authService.js";
import { PageTemplate } from "@templates";
import { Clock, CreditCard, FileText, UserCheck } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const AdmissionDashboard = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [registrations, setRegistrations] = useState([]);
  const [stats, setStats] = useState({});

  useEffect(() => {
    const checkAuthAndLoadData = async () => {
      try {
        if (!isAuthenticated()) {
          navigate("/auth/login", {
            state: {
              returnUrl: "/user/admission/dashboard",
              message: "Vui lòng đăng nhập để truy cập dashboard tuyển sinh.",
            },
          });
          return;
        }

        // Get current user
        const tokenData = getCurrentTokenData();
        const currentUser = await authService.getCurrentUser();
        setUser(currentUser || tokenData);

        // Get real admission form status summary
        try {
          const data = await getAdmissionFormStatusSummary();
          setStats({
            total:
              (data.pendingApprovalCount || 0) +
              (data.refilledCount || 0) +
              (data.approvedCount || 0) +
              (data.rejectedCount || 0) +
              (data.paymentCount || 0) +
              (data.waitingPaymentCount || 0),
            pending: data.pendingApprovalCount || 0,
            underReview: data.refilledCount || 0,
            approved: data.approvedCount || 0,
            rejected: data.rejectedCount || 0,
            payment: data.paymentCount || 0,
            waitingPayment: data.waitingPaymentCount || 0,
          });
        } catch (error) {
          console.error(
            "Failed to fetch admission form status summary:",
            error
          );
          // Fallback to empty stats if API fails
          setStats({
            total: 0,
            pending: 0,
            underReview: 0,
            approved: 0,
            rejected: 0,
            payment: 0,
            waitingPayment: 0,
          });
        }

        // Mock registration data for now
        setRegistrations([
          {
            id: "REG-001",
            childName: "Emma Johnson",
            program: "Toddler Program",
            status: "PENDING_REVIEW",
            submittedDate: "2025-06-01",
            parentName: "Sarah Johnson",
            parentEmail: "sarah@example.com",
            priority: "high",
          },
          {
            id: "REG-002",
            childName: "Liam Smith",
            program: "Pre-K Program",
            status: "UNDER_REVIEW",
            submittedDate: "2025-06-02",
            parentName: "Mike Smith",
            parentEmail: "mike@example.com",
            priority: "normal",
          },
          {
            id: "REG-003",
            childName: "Sophia Brown",
            program: "Preschool Program",
            status: "APPROVED",
            submittedDate: "2025-05-28",
            parentName: "Lisa Brown",
            parentEmail: "lisa@example.com",
            priority: "normal",
          },
        ]);
      } catch (error) {
        //         console.error('Failed to load admission dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    checkAuthAndLoadData();
  }, [navigate]);

  const getStatusBadge = (status) => {
    const statusConfig = {
      PENDING_REVIEW: { variant: "warning", text: "Pending Review" },
      UNDER_REVIEW: { variant: "default", text: "Under Review" },
      APPROVED: { variant: "success", text: "Approved" },
      REJECTED: { variant: "destructive", text: "Rejected" },
      WAITLISTED: { variant: "secondary", text: "Waitlisted" },
    };

    const config = statusConfig[status] || { variant: "default", text: status };
    return <Badge variant={config.variant}>{config.text}</Badge>;
  };

  if (loading) {
    return (
      <PageTemplate title="Dashboard tuyển sinh">
        <div className="text-center py-8">
          <Spinner size="lg" className="mx-auto mb-4" />
          <p className="text-gray-600">Loading information...</p>
        </div>
      </PageTemplate>
    );
  }

  if (!user) {
    return (
      <PageTemplate title="Dashboard tuyển sinh">
        <div className="text-center py-8">
          <Spinner size="lg" className="mx-auto mb-4" />
          <p className="text-gray-600">Loading user information...</p>
        </div>
      </PageTemplate>
    );
  }

  return (
    <PageTemplate
      title={`Welcome, ${user?.data?.name || user?.fullName || "User"}`}
      subtitle="Manage admission applications and registration approvals"
    >
      <div className="space-y-8">
        {/* Quick Stats */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="Total Applications"
            value={stats.total}
            description="All registrations"
            icon={FileText}
            trend={{ value: 0, isPositive: true }}
          />
          <StatCard
            title="Pending Review"
            value={stats.pending}
            description="Need processing"
            icon={Clock}
            trend={{ value: 0, isPositive: true }}
          />
          <StatCard
            title="Under Review"
            value={stats.underReview}
            description="In progress"
            icon={UserCheck}
            trend={{ value: 0, isPositive: true }}
          />
          <StatCard
            title="Payment Required"
            value={stats.payment}
            description="Awaiting payment"
            icon={CreditCard}
            trend={{ value: 0, isPositive: true }}
          />
        </section>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Recent Registrations */}

          {/* Right Column - Stats and Quick Actions */}
          <div className="space-y-6">
            {/* Status Summary */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                Status Overview
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Pending Review:</span>
                  <Badge variant="warning">{stats.pending}</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Under Review:</span>
                  <Badge variant="default">{stats.underReview}</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Approved:</span>
                  <Badge variant="success">{stats.approved}</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Rejected:</span>
                  <Badge variant="destructive">{stats.rejected}</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Payment Required:</span>
                  <Badge variant="secondary">{stats.payment}</Badge>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageTemplate>
  );
};

export default AdmissionDashboard;
