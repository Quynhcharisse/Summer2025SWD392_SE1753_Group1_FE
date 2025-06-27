import axios from "axios";
import Cookies from "js-cookie";

const apiClient = axios.create({
  baseURL: "http://localhost:8080/api/v1",
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // Quan trọng: cho phép gửi cookies trong cross-origin requests
});

// Debug function to check token
const getToken = () => {
  // Try to get from cookie first
  let token = Cookies.get("access");
  
  // If not in cookie, try localStorage
  if (!token) {
    token = localStorage.getItem('accessToken');
  }
  
  console.log('Current token:', token ? 'Present' : 'Not found');
  return token;
};

const validateToken = (token) => {
  try {
    if (!token) {
      console.warn('No token found in both cookie and localStorage');
      return false;
    }
    // Log token info for debugging
    console.log('Token present in request');
    return true;
  } catch (error) {
    console.error('Token validation error:', error);
    return false;
  }
};

// Add request interceptor to handle token
apiClient.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (validateToken(token)) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log('Request config:', {
        url: config.url,
        method: config.method,
        headers: {
          Authorization: config.headers.Authorization ? 'Bearer [HIDDEN]' : 'None',
          'Content-Type': config.headers['Content-Type']
        }
      });
    } else {
      console.warn('No valid token found for request');
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor to handle errors
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    if (error.response) {
      // Log detailed error information
      console.error('API Error Details:', {
        status: error.response.status,
        data: error.response.data,
        headers: error.response.headers,
        config: error.config
      });

      // Handle specific error codes
      switch (error.response.status) {
        case 403:
          if (!originalRequest._retry) {
            originalRequest._retry = true;
            try {
              console.log('Attempting token refresh...');
              const response = await apiClient.post("/auth/refresh");
              if (response && response.data) {
                const newToken = response.data.accessToken;
                localStorage.setItem('accessToken', newToken);
                console.log('Token refreshed successfully');
                
                // Retry the original request with new token
                originalRequest.headers.Authorization = `Bearer ${newToken}`;
                return apiClient(originalRequest);
              }
            } catch (refreshError) {
              console.error("Token refresh failed:", refreshError);
              localStorage.removeItem('accessToken');
              window.location.href = '/auth/login';
              return Promise.reject(refreshError);
            }
          }
          break;
        case 401:
          console.log('Unauthorized access, redirecting to login...');
          localStorage.removeItem('accessToken');
          window.location.href = '/auth/login';
          break;
        default:
          console.error('Unhandled API Error:', error.response.data);
      }
    }
    return Promise.reject(error);
  }
);

export default apiClient;
