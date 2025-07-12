import React, { useState, useEffect } from 'react';
import { Users, Plus, Edit, Download, Search } from 'lucide-react';
import { hrService } from '@/api/services/hrService';
import TeacherFormModal from './TeacherFormModal';
import LoadingOverlay from '../LoadingOverlay';

const TeacherList = () => {
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [selectedTeacher, setSelectedTeacher] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    fetchTeachers();
  }, []);

  const fetchTeachers = async () => {
    try {
      setLoading(true);
      const data = await hrService.teachers.getAllTeachers();
//       console.log('Teachers API response:', data); // Debug log
//       console.log('Teachers data array:', data.data); // Debug log
      
      if (data.data && data.data.length > 0) {
//         console.log('Sample teacher object keys:', Object.keys(data.data[0])); // Debug log to see structure
//         console.log('Full sample teacher object:', data.data[0]); // Debug log
      }
      
      setTeachers(data.data || []);
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
      hrService.downloadFile(blob, `teachers-${new Date().toISOString().split('T')[0]}.xlsx`);
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

  const handleModalClose = () => {
    setShowModal(false);
    setSelectedTeacher(null);
    setIsEditing(false);
  };

  const handleTeacherSubmit = async (teacherData) => {
    try {
      if (isEditing && selectedTeacher) {
        // Try different possible ID field names
        const teacherId = selectedTeacher.id || selectedTeacher.teacherId || selectedTeacher._id || selectedTeacher.userId || selectedTeacher.email;
//         console.log('Teacher ID for update:', teacherId); // Debug log
//         console.log('Available teacher fields:', Object.keys(selectedTeacher)); // Debug log
        
        if (!teacherId) {
//           console.error('No teacher ID found in:', selectedTeacher);
          // Try using email as identifier if no ID is available
          if (selectedTeacher.email) {
//             console.log('Using email as identifier:', selectedTeacher.email);
            await hrService.teachers.updateTeacher(selectedTeacher.email, teacherData);
          } else {
            throw new Error('No unique identifier found for teacher update. The API response is missing ID fields.');
          }
        } else {
          await hrService.teachers.updateTeacher(teacherId, teacherData);
        }
      } else {
        await hrService.teachers.createTeacher(teacherData);
      }
      await fetchTeachers();
      handleModalClose();
    } catch (error) {
//       console.error('Error saving teacher:', error);
      throw error; // Let the modal handle the error
    }
  };

  const filteredTeachers = teachers.filter(teacher =>
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
            <p className="text-blue-100">Manage teacher information and records</p>
          </div>
          <div className="text-right">
            <p className="text-3xl font-bold">{teachers.length}</p>
            <p className="text-blue-100">Total Teachers</p>
          </div>
        </div>
      </div>

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
        {filteredTeachers.map((teacher) => (
          <div key={teacher.id} className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow">
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
                        {teacher.name?.charAt(0)?.toUpperCase() || 'T'}
                      </span>
                    )}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{teacher.name}</h3>
                    <p className="text-sm text-gray-500">{teacher.email}</p>
                  </div>
                </div>
                <button
                  onClick={() => handleEditTeacher(teacher)}
                  className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <Edit className="w-4 h-4" />
                </button>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">Phone:</span>
                  <span className="text-sm font-medium">{teacher.phone || 'N/A'}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">Gender:</span>
                  <span className="text-sm font-medium">
                    {teacher.gender ? teacher.gender.charAt(0).toUpperCase() + teacher.gender.slice(1) : 'N/A'}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">Status:</span>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    teacher.status === 'active' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {teacher.status || 'Active'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredTeachers.length === 0 && !loading && (
        <div className="text-center py-12">
          <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No teachers found</h3>
          <p className="text-gray-500 mb-4">
            {searchTerm ? 'No teachers match your search criteria.' : 'Get started by adding your first teacher.'}
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
    </div>
  );
};

export default TeacherList;