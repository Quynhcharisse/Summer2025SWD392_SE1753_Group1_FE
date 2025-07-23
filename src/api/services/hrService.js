import apiClient from '@/api/apiClient';

/**
 * HR Service - Handles teacher and parent management for HR role
 */

// Teacher Management APIs
export const teacherService = {
  /**
   * Get all teachers
   * @returns {Promise} List of teachers
   */
  getAllTeachers: async () => {
    try {
      const response = await apiClient.get('/hr/teacher');
      return response.data;
    } catch (error) {
//       console.error('Error fetching teachers:', error);
      throw error;
    }
  },

  /**
   * Update teacher information
   * @param {string} id - Teacher ID
   * @param {Object} teacherData - Teacher data to update
   * @param {string} teacherData.name - Teacher name
   * @param {string} teacherData.phone - Teacher phone
   * @param {string} teacherData.gender - Teacher gender
   * @param {string} teacherData.avatarUrl - Teacher avatar URL
   * @returns {Promise} Updated teacher data
   */
  updateTeacher: async (id, teacherData) => {
    try {

      if (!id) {
        throw new Error('Teacher ID is required for update');
      }
      const response = await apiClient.put(`/hr/teacher?id=${encodeURIComponent(id)}`, teacherData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Create new teacher
   * @param {Object} teacherData - Teacher data
   * @param {string} teacherData.name - Teacher name
   * @param {string} teacherData.avatarUrl - Teacher avatar URL
   * @param {string} teacherData.gender - Teacher gender
   * @returns {Promise} Created teacher data
   */
  createTeacher: async (teacherData) => {
    try {
      const response = await apiClient.post('/hr/teacher', teacherData);
      return response.data;
    } catch (error) {
//       console.error('Error creating teacher:', error);
      throw error;
    }
  },

  /**
   * Export teachers data
   * @returns {Promise<string>} Exported data (likely CSV/Excel format)
   */
  exportTeachers: async () => {
    try {
      const response = await apiClient.get('/hr/teacher/export', {
        responseType: 'blob', // For file download
      });
      return response.data;
    } catch (error) {
//       console.error('Error exporting teachers:', error);
      throw error;
    }
  },
};

// Parent Management APIs
export const parentService = {
  /**
   * Get all parents
   * @returns {Promise} List of parents
   */
  getAllParents: async () => {
    try {
      const response = await apiClient.get('/hr/parent');
      return response.data;
    } catch (error) {
//       console.error('Error fetching parents:', error);
      throw error;
    }
  },

  /**
   * Export parents data
   * @returns {Promise<string>} Exported data (likely CSV/Excel format)
   */
  exportParents: async () => {
    try {
      const response = await apiClient.get('/hr/parent/export', {
        responseType: 'blob', // For file download
      });
      return response.data;
    } catch (error) {
//       console.error('Error exporting parents:', error);
      throw error;
    }
  },
};

// Combined HR Service
export const hrService = {
  // Teacher management
  teachers: teacherService,
  
  // Parent management
  parents: parentService,

  /**
   * Download file helper for exports
   * @param {Blob} blob - File blob data
   * @param {string} filename - Name for downloaded file
   */
  downloadFile: (blob, filename) => {
    const url = window.URL.createObjectURL(new Blob([blob]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
  },
};

export default hrService;