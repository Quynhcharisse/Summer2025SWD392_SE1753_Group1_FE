import { cloudinaryConfig, CLOUDINARY_UPLOAD_URL } from '../config/cloudinary.config';

/**
 * Uploads an image file to Cloudinary
 * @param {File} file - The image file to upload
 * @returns {Promise<string>} - The URL of the uploaded image
 */
export const uploadImageToCloudinary = async (file) => {
  try {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('api_key', cloudinaryConfig.apiKey);
    formData.append('folder', cloudinaryConfig.folder);
    
    const timestamp = Math.round((new Date).getTime() / 1000);
    formData.append('timestamp', timestamp);

    // Generate signature
    const params = {
      timestamp: timestamp,
      folder: cloudinaryConfig.folder,
    };
    const signature = await generateSignature(params);
    formData.append('signature', signature);

    const response = await fetch(CLOUDINARY_UPLOAD_URL, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'X-Requested-With': 'XMLHttpRequest',
      },
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json();
      console.error('Cloudinary upload error:', error);
      throw new Error(error.message || 'Failed to upload image');
    }

    const data = await response.json();
    return data.secure_url;
  } catch (error) {
    console.error('Error uploading image to Cloudinary:', error);
    throw error;
  }
};

/**
 * Extracts the public ID from a Cloudinary URL
 * @param {string} url - The Cloudinary URL
 * @returns {string|null} - The public ID or null if not found
 */
export const getPublicIdFromUrl = (url) => {
  if (!url) return null;
  
  try {
    // Extract the public ID from the URL
    // Example URL: https://res.cloudinary.com/cloudName/image/upload/v1234567890/folder/publicId.jpg
    const regex = /\/v\d+\/(?:.*\/)?(.+)\./;
    const match = url.match(regex);
    return match ? match[1] : null;
  } catch (error) {
    console.error('Error extracting public ID from URL:', error);
    return null;
  }
};

/**
 * Validates if a file is an acceptable image
 * @param {File} file - The file to validate
 * @returns {boolean} - Whether the file is valid
 */
export const validateImage = (file) => {
  // Check file type
  const acceptedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
  if (!acceptedTypes.includes(file.type)) {
    throw new Error('Invalid file type. Please upload a JPEG, PNG, GIF, or WebP image.');
  }

  // Check file size (max 5MB)
  const maxSize = 5 * 1024 * 1024; // 5MB in bytes
  if (file.size > maxSize) {
    throw new Error('File size too large. Maximum size is 5MB.');
  }

  return true;
};

/**
 * Deletes an image from Cloudinary using its public ID
 * @param {string} publicId - The public ID of the image to delete
 * @returns {Promise<boolean>} - True if deletion was successful
 */
export const deleteImageFromCloudinary = async (publicId) => {
  if (!publicId) return false;

  try {
    const timestamp = new Date().getTime();
    const signature = await generateSignature(publicId, timestamp);

    const formData = new FormData();
    formData.append('public_id', publicId);
    formData.append('api_key', cloudinaryConfig.apiKey);
    formData.append('timestamp', timestamp);
    formData.append('signature', signature);

    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudinaryConfig.cloudName}/image/destroy`,
      {
        method: 'POST',
        body: formData,
      }
    );

    if (!response.ok) {
      throw new Error('Failed to delete image');
    }

    const data = await response.json();
    return data.result === 'ok';
  } catch (error) {
    console.error('Error deleting image from Cloudinary:', error);
    return false;
  }
};

/**
 * Generates a signature for Cloudinary API requests
 * @param {Object} params - Parameters to include in the signature
 * @returns {Promise<string>} - The generated signature
 */
const generateSignature = async (params) => {
  // Sort parameters alphabetically
  const sortedParams = Object.keys(params)
    .sort()
    .map(key => `${key}=${params[key]}`)
    .join('&');

  const signatureStr = sortedParams + cloudinaryConfig.apiSecret;
  const msgUint8 = new TextEncoder().encode(signatureStr);
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgUint8);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}; 