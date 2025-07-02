import axios from "axios";
import Cookies from "js-cookie";

const apiClient = axios.create({
  baseURL: "http://localhost:8080/api/v1",
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // Important: allows sending cookies in cross-origin requests
});

// Debug function to check token
const getToken = () => {
  // Get token from cookie only
  const token = Cookies.get("access");
  console.log('Current token:', token ? 'Present' : 'Not found');
  return token;
};

const validateToken = (token) => {
  try {
    if (!token) {
      console.warn('No token found in cookie');
      return false;
    }
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
              // The server will automatically set the new access token cookie in the response
              await apiClient.post("/auth/refresh");
              console.log('Token refreshed successfully');
              
              // No need to manually set token since it's handled by cookies
              // Just retry the original request - cookies will be sent automatically
              return apiClient(originalRequest);
            } catch (refreshError) {
              console.error("Token refresh failed:", refreshError);
              // Check if we're already on the login page to avoid refresh
              if (!window.location.pathname.includes('/login')) {
                window.location.href = '/auth/login';
              }
              return Promise.reject(refreshError);
            }
          }
          break;
        case 401:
          console.log('Unauthorized access detected');
          // Check if we're already on the login page to avoid refresh
          if (!window.location.pathname.includes('/login')) {
            window.location.href = '/auth/login';
          }
          break;
        default:
          console.error('Unhandled API Error:', error.response.data);
      }
    }
    return Promise.reject(error);
  }
);

export default apiClient;
