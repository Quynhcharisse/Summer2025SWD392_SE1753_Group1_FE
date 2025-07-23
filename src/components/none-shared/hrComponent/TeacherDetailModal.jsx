import React from 'react';
import { X } from 'lucide-react';

const TeacherDetailModal = ({ isOpen, onClose, teacher }) => {
  if (!isOpen || !teacher) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-900">Teacher Details</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        {/* Body */}
        <div className="p-6 space-y-4">
          <div className="flex flex-col items-center mb-4">
            <div className="w-20 h-20 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center mb-2">
              {teacher.avatarUrl ? (
                <img
                  src={teacher.avatarUrl}
                  alt={teacher.name}
                  className="w-20 h-20 rounded-full object-cover"
                />
              ) : (
                <span className="text-white font-semibold text-3xl">
                  {teacher.name?.charAt(0)?.toUpperCase() || 'T'}
                </span>
              )}
            </div>
            <h3 className="text-lg font-bold text-gray-900">{teacher.name}</h3>
            <p className="text-gray-500">{teacher.email}</p>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="font-medium text-gray-700">Phone:</span>
              <span>{teacher.phone || 'N/A'}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium text-gray-700">Gender:</span>
              <span>{teacher.gender ? teacher.gender.charAt(0).toUpperCase() + teacher.gender.slice(1) : 'N/A'}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium text-gray-700">Status:</span>
              <span className={`text-xs px-2 py-1 rounded-full ${teacher.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>{teacher.status || 'Active'}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium text-gray-700">Address:</span>
              <span>{teacher.address || 'N/A'}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium text-gray-700">Identity Number:</span>
              <span>{
                teacher.identityNumber && teacher.identityNumber.length > 3
                  ? teacher.identityNumber.slice(0, 3) + '*'.repeat(teacher.identityNumber.length - 3)
                  : (teacher.identityNumber || 'N/A')
              }</span>
            </div>
          </div>
        </div>
        {/* Footer */}
        <div className="flex justify-end p-4 border-t">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default TeacherDetailModal; 