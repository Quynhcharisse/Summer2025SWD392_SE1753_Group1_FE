import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { PageTemplate } from "@templates";
import { Button, Badge, Spinner } from "@atoms";
import { StatCard } from "@molecules";
import { 
  FileText, 
  Users, 
  CheckCircle, 
  Clock, 
  Eye,
  UserCheck,
  AlertCircle,
  TrendingUp,
  CreditCard
} from "lucide-react";
import { isAuthenticated, getCurrentTokenData } from "@services/JWTService.jsx";
import { authService } from "@services/authService.js";
import { getAdmissionFormStatusSummary } from "@services/admissionService.js";

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
          navigate('/auth/login', { 
            state: { 
              returnUrl: '/user/admission/dashboard',
              message: 'Vui lòng đăng nhập để truy cập dashboard tuyển sinh.'
            }
          });
          return;
        }

        // Get current user
        const tokenData = getCurrentTokenData();
        const currentUser = await authService.getCurrentUser();
        setUser(currentUser || tokenData);

        // Get real admission form status summary
        try {
          const statusSummary = await getAdmissionFormStatusSummary();
          if (statusSummary && statusSummary.success) {
            const data = statusSummary.data;
            // Map backend status to frontend stats
            setStats({
              total:
                  (data.pendingApprovalCount || 0) +
                  (data.refilledCount || 0) +
                  (data.approvedCount || 0) +
                  (data.rejectedCount || 0) +
                  (data.paymentCount || 0),
              pending: data.pendingApprovalCount || 0,
              underReview: data.refilledCount || 0, // giả sử đang xem xét là refilled
              approved: data.approvedCount || 0,
              rejected: data.rejectedCount || 0,
              payment: data.paymentCount || 0, // Thêm payment count      
            });

          } else {
            // Fallback to empty stats if API fails
            setStats({
              total: 0,
              pending: 0,
              underReview: 0,
              approved: 0,
              rejected: 0,
              payment: 0
            });
          }
        } catch (error) {
          console.error('Failed to fetch admission form status summary:', error);
          // Fallback to empty stats if API fails
          setStats({
            total: 0,
            pending: 0,
            underReview: 0,
            approved: 0,
            rejected: 0,
            payment: 0
          });
        }

        // Mock registration data for now
        setRegistrations([
          {
            id: 'REG-001',
            childName: 'Emma Johnson',
            program: 'Toddler Program',
            status: 'PENDING_REVIEW',
            submittedDate: '2025-06-01',
            parentName: 'Sarah Johnson',
            parentEmail: 'sarah@example.com',
            priority: 'high'
          },
          {
            id: 'REG-002',
            childName: 'Liam Smith',
            program: 'Pre-K Program',
            status: 'UNDER_REVIEW',
            submittedDate: '2025-06-02',
            parentName: 'Mike Smith',
            parentEmail: 'mike@example.com',
            priority: 'normal'
          },
          {
            id: 'REG-003',
            childName: 'Sophia Brown',
            program: 'Preschool Program',
            status: 'APPROVED',
            submittedDate: '2025-05-28',
            parentName: 'Lisa Brown',
            parentEmail: 'lisa@example.com',
            priority: 'normal'
          }
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
      'PENDING_REVIEW': { variant: 'warning', text: 'Chờ xem xét' },
      'UNDER_REVIEW': { variant: 'default', text: 'Đang xem xét' },
      'APPROVED': { variant: 'success', text: 'Đã duyệt' },
      'REJECTED': { variant: 'destructive', text: 'Từ chối' },
      'WAITLISTED': { variant: 'secondary', text: 'Danh sách chờ' }
    };

    const config = statusConfig[status] || { variant: 'default', text: status };
    return <Badge variant={config.variant}>{config.text}</Badge>;
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'text-red-600';
      case 'normal': return 'text-gray-600';
      case 'low': return 'text-gray-400';
      default: return 'text-gray-600';
    }
  };

  const handleViewRegistration = (registrationId) => {
    navigate(`/user/admission/registrations/${registrationId}`);
  };

  const handleReviewRegistration = (registrationId) => {
    navigate(`/user/admission/registrations/${registrationId}/review`);
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
      title={`Welcome, ${user?.data?.name || user?.fullName || 'User'}`}
      subtitle="Manage admission applications and registration approvals"
      actions={
        <div className="flex gap-4">
          <Button 
            variant="outline" 
            size="md"
            onClick={() => navigate('/user/admission/registrations')}
          >
            <FileText className="w-4 h-4 mr-2" />
            All Applications
          </Button>
          <Button 
            variant="primary" 
            size="md"
            onClick={() => navigate('/user/admission/reports')}
          >
            <TrendingUp className="w-4 h-4 mr-2" />
            Reports
          </Button>
        </div>
      }
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
          <div className="lg:col-span-2 space-y-6">
            {/* Pending Review Applications */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-800">Applications Needing Review</h3>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => navigate('/user/admission/registrations?status=pending')}
                >
                  View all
                </Button>
              </div>
              
              {registrations.filter(r => r.status === 'PENDING_REVIEW' || r.status === 'UNDER_REVIEW').length > 0 ? (
                <div className="space-y-4">
                  {registrations
                    .filter(r => r.status === 'PENDING_REVIEW' || r.status === 'UNDER_REVIEW')
                    .map((registration) => (
                    <div key={registration.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h4 className="font-medium text-gray-800">{registration.childName}</h4>
                            {getStatusBadge(registration.status)}
                            {registration.priority === 'high' && (
                              <AlertCircle className="w-4 h-4 text-red-500" />
                            )}
                          </div>
                          <p className="text-sm text-gray-600 mb-1">
                            Program: {registration.program}
                          </p>
                          <p className="text-sm text-gray-600 mb-1">
                            Parent: {registration.parentName}
                          </p>
                          <p className="text-xs text-gray-500">
                            Submitted on: {new Date(registration.submittedDate).toLocaleDateString('en-US')}
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleViewRegistration(registration.id)}
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button 
                            variant="primary" 
                            size="sm"
                            onClick={() => handleReviewRegistration(registration.id)}
                          >
                            Review
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-4">No applications need review</p>
              )}
            </div>

            {/* Recent Activities */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Recent Activities</h3>
              <div className="space-y-3">
                {registrations.slice(0, 3).map((registration) => (
                  <div key={registration.id} className="flex items-center gap-4 p-3 border rounded-lg">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <FileText className="w-5 h-5 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-800">{registration.childName}</h4>
                      <p className="text-sm text-gray-600">Application {registration.status.toLowerCase()}</p>
                      <p className="text-xs text-gray-500">
                        {new Date(registration.submittedDate).toLocaleDateString('en-US')}
                      </p>
                    </div>
                    {getStatusBadge(registration.status)}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - Stats and Quick Actions */}
          <div className="space-y-6">
            {/* Status Summary */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Status Overview</h3>
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

            {/* Quick Actions */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => navigate('/user/admission/registrations?status=pending')}
                >
                  <Clock className="w-4 h-4 mr-3" />
                  Pending Applications
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => navigate('/user/admission/registrations')}
                >
                  <FileText className="w-4 h-4 mr-3" />
                  All Applications
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => navigate('/user/admission/reports')}
                >
                  <TrendingUp className="w-4 h-4 mr-3" />
                  Statistical Reports
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => navigate('/user/shared/notifications')}
                >
                  <AlertCircle className="w-4 h-4 mr-3" />
                  Notifications
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageTemplate>
  );
};

export default AdmissionDashboard;
