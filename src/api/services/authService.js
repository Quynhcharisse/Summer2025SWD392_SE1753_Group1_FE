import apiClient from "@api/apiClient";

export const login = async (credentials) => {
  try {
    const { email, password } = credentials;
    const response = await apiClient.post("/auth/login", {
      email,
      password,
    });
    return response.data;
  } catch (error) {
    if (error.code === "ERR_NETWORK") {
      console.error(
        "Network error: Unable to reach the server. Please check your connection or the server URL."
      );
    } else {
      console.error("Login error:", error);
    }
    throw error;
  }
};

export const logout = async () => {
  try {
    const response = await apiClient.post("/auth/logout");

    // Server will clear both cookies:
    // - Regular access token cookie
    // - HttpOnly refresh token cookie

    // Clear any client-side user data
    localStorage.removeItem("user");

    return response.data;
  } catch (error) {
    console.error("Logout error:", error);    // Even if server request fails, clear local data
    localStorage.removeItem("user");
    throw error;
  }
};

/**
 * Refresh access token using HttpOnly refresh cookie
 * This function is mainly called by the API interceptor
 */
export const refreshToken = async () => {
  try {
    const response = await apiClient.post("/auth/refresh");
    return response.data;
  } catch (error) {
    console.error("Token refresh failed:", error);
    throw error;
  }
};

export const signUp = async (userData) => {
  try {
    const response = await apiClient.post("/auth/register", {
      email: userData.email,
      password: userData.password,
      confirmPassword: userData.confirmPassword,
      name: userData.name,
      phone: userData.phone,
      gender: userData.gender,
      identityNumber: userData.identityNumber,
    });

    return response.data;
  } catch (error) {
    if (error.code === "ERR_NETWORK") {
      console.error(
        "Network error: Unable to reach the server. Please check your connection or the server URL."
      );
    } else {
      console.error("Sign up error:", error);
    }
    throw error;
  }
};

/**
 * Request password reset - sends reset email to user
 */
export const requestPasswordReset = async (email) => {
  try {
    const response = await apiClient.post("/auth/password/reset", {
      email,
    });
    return response.data;
  } catch (error) {
    console.error("Password reset request failed:", error);
    throw error;
  }
};

/**
 * Confirm password reset with token and new password
 */
export const confirmPasswordReset = async (token, email, password, confirmPassword) => {
  try {
    const response = await apiClient.post("/auth/password/reset/confirm", {
      email,
      password,
      confirmPassword
    }, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {
    console.error("Password reset confirmation failed:", error);
    throw error;
  }
};

/**
 * Get current user info from server
 * Useful for getting fresh user data when cookies exist
 */
export const getCurrentUser = async () => {
  try {
    const response = await apiClient.get("/auth/me");
    return response.data;
  } catch (error) {
    console.error("Get current user failed:", error);
    throw error;
  }
};

export const register = async (userData) => {
  try {
    console.log('🔥 register function called with:', userData);
    console.log('📤 Making POST request to /auth/register');
    const response = await apiClient.post("/auth/register", userData);
    console.log('✅ API Response:', response);
    return response.data;
  } catch (error) {
    console.log('❌ API Error:', error);
    if (error.code === "ERR_NETWORK") {
      console.error(
        "Network error: Unable to reach the server. Please check your connection or the server URL."
      );
    } else {
      console.error("Registration error:", error);
    }
    throw error;
  }
};

// Default export object for easier imports
export const authService = {
  login,
  signUp,
  logout,
  refreshToken,
  getCurrentUser,
  requestPasswordReset,
  confirmPasswordReset,
  register,
};

export default authService;
