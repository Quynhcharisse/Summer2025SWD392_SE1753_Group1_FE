// Cloudinary configuration
export const cloudinaryConfig = {
  cloudName: 'dhr7c8yhp',
  apiKey: '541248638169695',
  apiSecret: 'b_ykmMTcQoi6LNScfMTpyFbWYRo',
  uploadPreset: 'ml_default', // Using the default unsigned upload preset
  folder: 'event_images'
};

// Cloudinary upload URL
export const CLOUDINARY_UPLOAD_URL = `https://api.cloudinary.com/v1_1/${cloudinaryConfig.cloudName}/image/upload`; 