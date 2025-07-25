import { useEffect, useState } from "react";

import { hrService } from "@/api/services/hrService";
import {
  AlertTriangle,
  Download,
  Edit,
  Eye,
  Lock,
  Plus,
  Search,
  Unlock,
  Users,
} from "lucide-react";
import LoadingOverlay from "../LoadingOverlay";
import TeacherDetailModal from "./TeacherDetailModal";
import TeacherFormModal from "./TeacherFormModal";

const TeacherList = () => {
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [selectedTeacher, setSelectedTeacher] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  // Add states for ban/unban functionality
  const [actionLoading, setActionLoading] = useState("");
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [pendingAction, setPendingAction] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    fetchTeachers();
  }, []);

  const fetchTeachers = async () => {
    try {
      setLoading(true);
      const data = await hrService.teachers.getAllTeachers();

      if (data.data && data.data.length > 0) {
        //         console.log('Sample teacher object keys:', Object.keys(data.data[0])); // Debug log to see structure
        //         console.log('Full sample teacher object:', data.data[0]); // Debug log
      }

      setTeachers(
        (data.data || []).sort(
          (a, b) => new Date(b.createAt) - new Date(a.createAt)
        )
      );
    } catch (error) {
      //       console.error('Error fetching teachers:', error);
      // You might want to show a toast notification here
    } finally {
      setLoading(false);
    }
  };

  const handleExport = async () => {
    try {
      const blob = await hrService.teachers.exportTeachers();
      hrService.downloadFile(
        blob,
        `teachers-${new Date().toISOString().split("T")[0]}.xlsx`
      );
    } catch (error) {
      //       console.error('Error exporting teachers:', error);
      // You might want to show a toast notification here
    }
  };

  const handleAddTeacher = () => {
    setSelectedTeacher(null);
    setIsEditing(false);
    setShowModal(true);
  };

  const handleEditTeacher = (teacher) => {
    //     console.log('Editing teacher:', teacher); // Debug log to see teacher structure
    setSelectedTeacher(teacher);
    setIsEditing(true);
    setShowModal(true);
  };

  const handleViewTeacher = (teacher) => {
    setSelectedTeacher(teacher);
    setShowDetailModal(true);
  };

  const handleModalClose = () => {
    setShowModal(false);
    setSelectedTeacher(null);
    setIsEditing(false);
  };

  const handleTeacherSubmit = async (teacherData) => {
    try {
      console.log("handleTeacherSubmit called", {
        teacherData,
        selectedTeacher,
        isEditing,
      });
      if (isEditing && selectedTeacher) {
        const teacherId =
          selectedTeacher.id ||
          selectedTeacher.teacherId ||
          selectedTeacher._id ||
          selectedTeacher.userId;
        console.log("teacherId:", teacherId);
        if (!teacherId || isNaN(Number(teacherId))) {
          throw new Error(
            "No unique numeric identifier found for teacher update. The API response is missing ID fields."
          );
        }
        // Truyền đủ các trường backend hỗ trợ
        const {
          name,
          phone,
          gender,
          avatarUrl,
          address,
          identityNumber,
          email,
        } = teacherData;
        await hrService.teachers.updateTeacher(teacherId, {
          name,
          phone,
          gender,
          avatarUrl,
          address,
          identityNumber,
          email,
        });
        console.log("Update API called");
      } else {
        const { name, gender } = teacherData;
        await hrService.teachers.createTeacher({ name, gender });
        console.log("Create API called");
      }
      await fetchTeachers();
      handleModalClose();
    } catch (error) {
      console.error("Error in handleTeacherSubmit:", error);
      alert(error.message || "An error occurred while updating the teacher!");
    }
  };

  // Add ban/unban functionality
  const showConfirmation = (action, teacher) => {
    setPendingAction({ action, teacher });
    setShowConfirmDialog(true);
  };

  const executeAction = async () => {
    if (!pendingAction) return;

    const { action, teacher } = pendingAction;
    setActionLoading(teacher.email);
    setError("");
    setSuccess("");

    try {
      if (action === "ban") {
        await hrService.banUser(teacher.email);
        setSuccess(`Account locked: ${teacher.email}`);
      } else {
        await hrService.unbanUser(teacher.email);
        setSuccess(`Account unlocked: ${teacher.email}`);
      }
      await fetchTeachers();
    } catch (err) {
      setError(`Unable to ${action === "ban" ? "lock" : "unlock"} account.`);
    } finally {
      setActionLoading("");
      setShowConfirmDialog(false);
      setPendingAction(null);
    }
  };

  const handleBanTeacher = (teacher) => {
    showConfirmation("ban", teacher);
  };

  const handleUnbanTeacher = (teacher) => {
    showConfirmation("unban", teacher);
  };

  const filteredTeachers = teachers.filter(
    (teacher) =>
      teacher.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      teacher.phone?.includes(searchTerm) ||
      teacher.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return <LoadingOverlay />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 rounded-lg shadow-lg">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold mb-2 flex items-center">
              <Users className="w-8 h-8 mr-3" />
              Teacher Management
            </h1>
            <p className="text-blue-100">
              Manage teacher information and records
            </p>
          </div>
          <div className="text-right">
            <p className="text-3xl font-bold">{teachers.length}</p>
            <p className="text-blue-100">Total Teachers</p>
          </div>
        </div>
      </div>

      {/* Messages */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-2 rounded mb-4">
          {error}
        </div>
      )}
      {success && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-2 rounded mb-4">
          {success}
        </div>
      )}

      {/* Action Bar */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 bg-white p-4 rounded-lg shadow-md">
        <div className="flex items-center space-x-4 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-80">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search teachers by name, phone, or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={handleExport}
            className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            <Download className="w-4 h-4 mr-2" />
            Export
          </button>
          <button
            onClick={handleAddTeacher}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Teacher
          </button>
        </div>
      </div>

      {/* Teachers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTeachers.map((teacher) => {
          const isBanned =
            teacher.status === "ban" || teacher.status === "banned";
          const isActionLoading = actionLoading === teacher.email;

          return (
            <div
              key={teacher.id}
              className={`bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow ${
                isBanned ? "border-l-4 border-red-500" : ""
              }`}
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                      {teacher.avatarUrl ? (
                        <img
                          src={teacher.avatarUrl}
                          alt={teacher.name}
                          className="w-12 h-12 rounded-full object-cover"
                        />
                      ) : (
                        <span className="text-white font-semibold text-lg">
                          {teacher.name?.charAt(0)?.toUpperCase() || "T"}
                        </span>
                      )}
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        {teacher.name}
                      </h3>
                      <p className="text-sm text-gray-500">{teacher.email}</p>
                    </div>
                  </div>

                  {/* Action buttons */}
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleViewTeacher(teacher)}
                    className="p-2 text-gray-400 hover:text-blue-600 hover:bg-gray-100 rounded-lg transition-colors"
                    title="View details"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleEditTeacher(teacher)}
                    className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                    disabled={isActionLoading}
                  >
                    <Edit className="w-4 h-4" />
                  </button>

                  {isBanned ? (
                    <button
                      onClick={() => handleUnbanTeacher(teacher)}
                      disabled={isActionLoading}
                      className="p-2 text-green-600 hover:text-green-700 hover:bg-green-50 rounded-lg transition-colors disabled:opacity-50"
                      title="Unlock Account"
                    >
                      <Unlock className="w-4 h-4" />
                    </button>
                  ) : (
                    <button
                      onClick={() => handleBanTeacher(teacher)}
                      disabled={isActionLoading}
                      className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                      title="Lock Account"
                    >
                      <Lock className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>

              <div className="space-y-2 px-6 pb-6">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">Phone:</span>
                  <span className="text-sm font-medium">
                    {teacher.phone || "N/A"}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">Gender:</span>
                  <span className="text-sm font-medium">
                    {teacher.gender
                      ? teacher.gender.charAt(0).toUpperCase() +
                        teacher.gender.slice(1)
                      : "N/A"}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">Status:</span>
                  <span
                    className={`text-xs px-2 py-1 rounded-full ${
                      teacher.status === "active"
                        ? "bg-green-100 text-green-800"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {teacher.status || "Active"}
                  </span>
                </div>

                {/* Loading indicator */}
                {isActionLoading && (
                  <div className="mt-3 flex items-center justify-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                    <span className="ml-2 text-sm text-gray-600">
                      Processing...
                    </span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {filteredTeachers.length === 0 && !loading && (
        <div className="text-center py-12">
          <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No teachers found
          </h3>
          <p className="text-gray-500 mb-4">
            {searchTerm
              ? "No teachers match your search criteria."
              : "Get started by adding your first teacher."}
          </p>
          {!searchTerm && (
            <button
              onClick={handleAddTeacher}
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Teacher
            </button>
          )}
        </div>
      )}

      {/* Confirmation Dialog */}
      {showConfirmDialog && pendingAction && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex items-center mb-4">
              <AlertTriangle className="w-6 h-6 text-orange-500 mr-3" />
              <h3 className="text-lg font-medium text-gray-900">
                Confirm {pendingAction.action === "ban" ? "Lock" : "Unlock"}{" "}
                Account
              </h3>
            </div>
            <p className="text-gray-600 mb-6">
              Are you sure you want to{" "}
              {pendingAction.action === "ban" ? "lock" : "unlock"} the account
              for <strong>{pendingAction.teacher.name}</strong> (
              {pendingAction.teacher.email})?
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => {
                  setShowConfirmDialog(false);
                  setPendingAction(null);
                }}
                className="px-4 py-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={executeAction}
                className={`px-4 py-2 text-white rounded-lg transition-colors ${
                  pendingAction.action === "ban"
                    ? "bg-red-600 hover:bg-red-700"
                    : "bg-green-600 hover:bg-green-700"
                }`}
              >
                {pendingAction.action === "ban"
                  ? "Lock Account"
                  : "Unlock Account"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Teacher Form Modal */}
      {showModal && (
        <TeacherFormModal
          isOpen={showModal}
          onClose={handleModalClose}
          onSubmit={handleTeacherSubmit}
          teacher={selectedTeacher}
          isEditing={isEditing}
        />
      )}

      {showDetailModal && (
        <TeacherDetailModal
          isOpen={showDetailModal}
          onClose={() => setShowDetailModal(false)}
          teacher={selectedTeacher}
        />
      )}
    </div>
  );
};

export default TeacherList;
