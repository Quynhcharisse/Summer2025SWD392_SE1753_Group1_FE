import { Badge, Button, Spinner } from "@atoms";
import { PageTemplate } from "@templates";
import {
  AlertCircle,
  CheckCircle,
  FileText,
  Filter,
  Search,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const EnrollmentApplicationList = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [applications, setApplications] = useState([]);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("ALL");

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        setLoading(true);
        const response = await parentService.getEnrollmentForms();
        if (response.data && response.data.data) {
          setApplications(response.data.data);
        } else {
          setApplications([]);
        }
      } catch (err) {
        setError("Error loading application list");
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, []);
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
    navigate(`/user/parent/forms/${applicationId}`);
  };

  const handleNewApplication = () => {
    navigate("/user/parent/child-list");
  };

  // Filter applications based on search term and status
  const filteredApplications = applications.filter((app) => {
    const matchesSearch =
      app.child?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.program?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.applicationId?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = filterStatus === "ALL" || app.status === filterStatus;

    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return (
      <PageTemplate title="My Applications">
        <div className="text-center py-8">
          <Spinner size="lg" className="mx-auto mb-4" />
          <p className="text-gray-600">Loading application list...</p>
        </div>
      </PageTemplate>
    );
  }

  return (
    <PageTemplate
      title="My Applications"
      subtitle="Manage and track all your enrollment applications"
      actions={
        <Button variant="primary" size="md" onClick={handleNewApplication}>
          <FileText className="w-4 h-4 mr-2" />
          Create New Application
        </Button>
      }
    >
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6 flex items-center">
          <AlertCircle className="w-5 h-5 mr-2" />
          {error}
        </div>
      )}

      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          {" "}
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search by child name, program, application ID..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="sm:w-48">
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <select
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              {" "}
              <option value="ALL">All Statuses</option>
              <option value="SUBMITTED">Submitted</option>
              <option value="UNDER_REVIEW">Under Review</option>
              <option value="APPROVED">Approved</option>
              <option value="REJECTED">Rejected</option>
              <option value="WAITLISTED">Waitlisted</option>
            </select>
          </div>
        </div>
      </div>

      {applications.length === 0 && (
        <div className="text-center py-12 bg-white rounded-lg border shadow-sm">
          <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-medium text-gray-700 mb-2">
            No Applications Yet
          </h3>
          <p className="text-gray-500 mb-6 max-w-md mx-auto">
            You don't have any enrollment applications yet. Create a new
            application to get started.
          </p>
          <Button variant="primary" onClick={handleNewApplication}>
            Create New Application
          </Button>
        </div>
      )}

      {applications.length > 0 && filteredApplications.length === 0 && (
        <div className="text-center py-8 bg-white rounded-lg border shadow-sm">
          <Search className="w-12 h-12 text-gray-400 mx-auto mb-3" />
          <p className="text-gray-500">
            No applications found matching your search criteria
          </p>
        </div>
      )}

      {applications.length > 0 && filteredApplications.length > 0 && (
        <div className="bg-white rounded-lg border shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 text-left">
                  <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Application ID
                  </th>
                  <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Child Name
                  </th>
                  <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Program
                  </th>
                  <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Submission Date
                  </th>
                  <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredApplications.map((application) => (
                  <tr key={application.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800">
                      {application.applicationId || `ENR-${application.id}`}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {application.child?.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {application.program}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {new Date(application.applicationDate).toLocaleDateString(
                        "en-US"
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(application.status)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleViewApplication(application.id)}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        View Details
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Help Information */}
      <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm">
        <div className="flex">
          <CheckCircle className="w-5 h-5 text-blue-500 mr-3 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="font-medium text-blue-800 mb-1">
              Useful Information
            </h3>
            <ul className="space-y-1 text-blue-700 list-disc list-inside pl-1">
              <li>Applications will be reviewed within 5-7 business days</li>
              <li>
                You will receive email notifications when the application status
                changes
              </li>
              <li>
                Contact the admissions department for more details:{" "}
                <span className="font-medium">1900-1234</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </PageTemplate>
  );
};

export default EnrollmentApplicationList;
