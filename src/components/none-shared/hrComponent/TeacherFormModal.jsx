import React, { useState, useEffect } from 'react';
import { X, Upload, User } from 'lucide-react';

const TeacherFormModal = ({ isOpen, onClose, onSubmit, teacher, isEditing }) => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    gender: '',
    avatarUrl: '',
    email: '',
    address: '',
    identityNumber: ''
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (teacher && isEditing) {
      setFormData({
        name: teacher.name || '',
        phone: teacher.phone || '',
        gender: teacher.gender || '',
        avatarUrl: teacher.avatarUrl || '',
        email: teacher.email || '',
        address: teacher.address || '',
        identityNumber: teacher.identityNumber || ''
      });
    } else {
      setFormData({
        name: '',
        phone: '',
        gender: '',
        avatarUrl: '',
        email: '',
        address: '',
        identityNumber: ''
      });
    }
    setErrors({});
  }, [teacher, isEditing, isOpen]);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.gender) {
      newErrors.gender = 'Gender is required';
    } else if (!['male', 'female', 'other'].includes(formData.gender)) {
      newErrors.gender = 'Please select a valid gender';
    }

    // Chỉ validate phone/email khi isEditing (chỉnh sửa)
    if (isEditing) {
      if (!formData.phone.trim()) {
        newErrors.phone = 'Phone number is required';
      } else if (!/^\d{10,11}$/.test(formData.phone.replace(/\s/g, ''))) {
        newErrors.phone = 'Please enter a valid phone number';
      }
      if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        newErrors.email = 'Please enter a valid email address';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
//     console.log('Form submitted with data:', formData); // Debug log
    
    if (!validateForm()) {
//       console.log('Form validation failed:', errors); // Debug log
      return;
    }

//     console.log('Form validation passed, submitting...'); // Debug log
    setLoading(true);
    try {
      await onSubmit(formData);
//       console.log('Form submission successful'); // Debug log
    } catch (error) {
//       console.error('Error submitting teacher:', error);
      // You might want to show error message here
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      // For now, we'll just create a placeholder URL
      // In a real app, you'd upload to Cloudinary or another service
      const reader = new FileReader();
      reader.onload = (e) => {
        setFormData(prev => ({
          ...prev,
          avatarUrl: e.target.result
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-900">
            {isEditing ? 'Edit Teacher' : 'Add New Teacher'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Full Name *
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.name ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Enter teacher's full name"
            />
            {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
          </div>

          {/* Gender */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Gender *
            </label>
            <select
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.gender ? 'border-red-500' : 'border-gray-300'
              }`}
            >
              <option value="">Select gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
            {errors.gender && <p className="text-red-500 text-xs mt-1">{errors.gender}</p>}
          </div>

          {/* Chỉ hiển thị các trường khác khi isEditing === true */}
          {isEditing && (
            <>
              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.email ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Enter email address"
                />
                {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
              </div>
              {/* Phone */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.phone ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Enter phone number"
                />
                {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
              </div>
              {/* Avatar URL (manual input) */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Avatar URL (optional)
                </label>
                <input
                  type="url"
                  name="avatarUrl"
                  value={formData.avatarUrl}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter avatar URL"
                />
              </div>
              {/* Address */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Address (optional)
                </label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter address"
                />
              </div>
              {/* Identity Number */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Identity Number (optional)
                </label>
                <input
                  type="text"
                  name="identityNumber"
                  value={formData.identityNumber}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter identity number"
                />
              </div>
            </>
          )}

          {/* Action Buttons */}
          <div className="flex space-x-3 pt-4 border-t">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Saving...' : (isEditing ? 'Update' : 'Add Teacher')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TeacherFormModal;
