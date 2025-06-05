import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { PageTemplate } from "@templates";
import { Button, Badge, Spinner } from "@atoms";
import { enrollmentService } from "../../../api/services/enrollmentService";
import { isAuthenticated } from "../../../api/services/JWTService";
import { 
  FileText, 
  Clock, 
  CheckCircle, 
  AlertTriangle, 
  XCircle,
  Eye,
  Calendar,
  Plus,
  Phone
} from "lucide-react";

const MyApplications = () => {
  const navigate = useNavigate();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    // Check authentication
    if (!isAuthenticated()) {
      navigate('/login', { 
        state: { 
          returnUrl: '/enrollment/my-applications',
          message: 'Vui lòng đăng nhập để xem đơn đăng ký của bạn.'
        }
      });
      return;
    }

    loadApplications();
  }, [navigate]);

  const loadApplications = async () => {
    try {
      setLoading(true);
      setError("");
      
      const response = await enrollmentService.getUserEnrollmentApplications();
      setApplications(response.applications || []);
      
    } catch (error) {
      console.error("Failed to load applications:", error);
      setError("Không thể tải danh sách đơn đăng ký. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      DRAFT: { variant: "secondary", label: "Nháp", icon: FileText },
      SUBMITTED: { variant: "primary", label: "Đã gửi", icon: Clock },
      UNDER_REVIEW: { variant: "warning", label: "Đang xét duyệt", icon: Clock },
      APPROVED: { variant: "success", label: "Đã phê duyệt", icon: CheckCircle },
      REJECTED: { variant: "error", label: "Bị từ chối", icon: XCircle },
      WAITLISTED: { variant: "secondary", label: "Danh sách chờ", icon: AlertTriangle }
    };

    const config = statusConfig[status] || statusConfig.DRAFT;
    const Icon = config.icon;

    return (
      <Badge variant={config.variant} className="flex items-center gap-1">
        <Icon className="w-3 h-3" />
        {config.label}
      </Badge>
    );
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getProgramName = (program) => {
    const programNames = {
      toddler: "Toddler Program (18 tháng - 2 tuổi)",
      preschool: "Preschool Program (3 - 4 tuổi)",
      prekindergarten: "Pre-K Program (4 - 5 tuổi)"
    };
    return programNames[program] || program;
  };

  if (loading) {
    return (
      <PageTemplate
        title="Đơn đăng ký của tôi"
        subtitle="Quản lý các đơn đăng ký nhập học"
      >
        <div className="text-center py-12">
          <Spinner size="lg" className="mx-auto mb-4" />
          <p className="text-gray-600">Đang tải danh sách đơn đăng ký...</p>
        </div>
      </PageTemplate>
    );
  }

  if (error) {
    return (
      <PageTemplate
        title="Đơn đăng ký của tôi"
        subtitle="Quản lý các đơn đăng ký nhập học"
      >
        <div className="text-center py-12">
          <AlertTriangle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <p className="text-red-600 mb-4">{error}</p>
          <Button onClick={loadApplications}>Thử lại</Button>
        </div>
      </PageTemplate>
    );
  }

  return (
    <PageTemplate
      title="Đơn đăng ký của tôi"
      subtitle="Quản lý các đơn đăng ký nhập học"
      actions={
        <Button 
          variant="primary" 
          onClick={() => navigate('/enrollment')}
          className="flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Tạo đơn mới
        </Button>
      }
    >
      <div className="space-y-6">
        {applications.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              Chưa có đơn đăng ký nào
            </h3>
            <p className="text-gray-600 mb-6">
              Bạn chưa có đơn đăng ký nhập học nào. Hãy tạo đơn đăng ký đầu tiên!
            </p>
            <Button 
              variant="primary" 
              onClick={() => navigate('/enrollment')}
              className="flex items-center gap-2 mx-auto"
            >
              <Plus className="w-4 h-4" />
              Tạo đơn đăng ký
            </Button>
          </div>
        ) : (
          <div className="grid gap-6">
            {applications.map((application) => (
              <div 
                key={application.id} 
                className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <h3 className="text-lg font-semibold text-gray-800">
                        {application.child?.firstName} {application.child?.lastName}
                      </h3>
                      {getStatusBadge(application.status)}
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <FileText className="w-4 h-4" />
                        <span>Mã đơn: {application.applicationId}</span>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        <span>Ngày nộp: {formatDate(application.applicationDate)}</span>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4" />
                        <span>Chương trình: {getProgramName(application.program)}</span>
                      </div>
                      
                      {application.child?.dateOfBirth && (
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4" />
                          <span>Ngày sinh: {formatDate(application.child.dateOfBirth)}</span>
                        </div>
                      )}
                    </div>

                    {application.notes && (
                      <div className="mt-3 p-3 bg-blue-50 border-l-4 border-blue-400 rounded">
                        <p className="text-sm text-blue-700">{application.notes}</p>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex flex-col sm:flex-row gap-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => navigate(`/enrollment/application/${application.id}`)}
                      className="flex items-center gap-2"
                    >
                      <Eye className="w-4 h-4" />
                      Xem chi tiết
                    </Button>
                    
                    {application.status === 'DRAFT' && (
                      <Button 
                        variant="primary" 
                        size="sm"
                        onClick={() => navigate(`/enrollment/edit/${application.id}`)}
                      >
                        Tiếp tục
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Help Section */}
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-3">
            Cần hỗ trợ?
          </h3>
          <p className="text-gray-600 mb-4">
            Nếu bạn có câu hỏi về đơn đăng ký hoặc cần hỗ trợ, vui lòng liên hệ với chúng tôi.
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <Button variant="outline" className="flex items-center gap-2">
              <Phone className="w-4 h-4" />
              Gọi: 1900-1234
            </Button>
            <Button variant="outline">
              Email: admissions@sunshinepreschool.com
            </Button>
          </div>
        </div>
      </div>
    </PageTemplate>
  );
};

export default MyApplications;
