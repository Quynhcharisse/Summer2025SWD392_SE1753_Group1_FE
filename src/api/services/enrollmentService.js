import apiClient from '../apiClient';

/**
 * Enrollment Service
 * Handles all enrollment/admission related API calls
 */

// Get enrollment requirements and information
export const getEnrollmentInfo = async () => {
  try {
    const response = await apiClient.get('/enrollment/info');
    return response.data;
  } catch (error) {
    console.error('Get enrollment info failed:', error);
    throw error;
  }
};

// Check if user can enroll (must be authenticated)
export const checkEnrollmentEligibility = async () => {
  try {
    const response = await apiClient.get('/enrollment/eligibility');
    return response.data;
  } catch (error) {
    console.error('Check enrollment eligibility failed:', error);
    throw error;
  }
};

// Submit enrollment application
export const submitEnrollmentApplication = async (applicationData) => {
  try {
    console.log('📝 Submitting enrollment application:', applicationData);
    
    const response = await apiClient.post('/enrollment/apply', applicationData);
    
    console.log('✅ Enrollment application submitted successfully:', response.data);
    return response.data;
  } catch (error) {
    console.error('❌ Enrollment application submission failed:', error);
    throw error;
  }
};

// Get user's enrollment applications
export const getUserEnrollmentApplications = async () => {
  try {
    const response = await apiClient.get('/user/parent/forms');
    return response.data;
  } catch (error) {
    console.error('Get user enrollment applications failed:', error);
    throw error;
  }
};

// Upload documents for enrollment
export const uploadEnrollmentDocument = async (applicationId, documentType, file) => {
  try {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('documentType', documentType);
    
    const response = await apiClient.post(`/enrollment/${applicationId}/documents`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    
    return response.data;
  } catch (error) {
    console.error('Upload enrollment document failed:', error);
    throw error;
  }
};

// Get available programs
export const getAvailablePrograms = async () => {
  try {
    const response = await apiClient.get('/enrollment/programs');
    return response.data;
  } catch (error) {
    console.error('Get available programs failed:', error);
    throw error;
  }
};

export const enrollmentService = {
  getEnrollmentInfo,
  checkEnrollmentEligibility,
  submitEnrollmentApplication,
  getUserEnrollmentApplications,
  uploadEnrollmentDocument,
  getAvailablePrograms,
};
