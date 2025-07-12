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
//       console.error(
     
    } else {
//       console.error("Login error:", error);
    }
    throw error;
  }
};

export const logout = async () => {
  const response = await apiClient.get("/auth/logout");
  return response ? response.data : null;
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
//     console.error("Token refresh failed:", error);
    throw error;
  }
};

export const signUp = async (userData) => {
  try {
    const response = await apiClient.post("/auth/register", {
      code: userData.code,
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
//       console.error(
     
    } else {
//       console.error("Sign up error:", error);
    }
    throw error;
  }
};

/**
 * Request password reset - sends reset email to user
 */
export const requestPasswordReset = async (email) => {
  try {
    const response = await apiClient.post("/auth/password/forgot", {
      email,
    });
    return response.data;
  } catch (error) {
//     console.error("Password reset request failed:", error);
    throw error;
  }
};

/**
 * Confirm password reset with token and new password
 */
export const confirmPasswordReset = async (
  token,
  email,
  password,
  confirmPassword
) => {
  try {
    const response = await apiClient.post(
      "/auth/password/reset/confirm",
      {
        email,
        password,
        confirmPassword,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
//     console.error("Password reset confirmation failed:", error);
    throw error;
  }
};

export const register = async (userData) => {
  try {
//     console.log("🔥 register function called with:", userData);
//     console.log("📤 Making POST request to /auth/register");
    const response = await apiClient.post("/auth/register", userData);
//     console.log("✅ API Response:", response);
    return response.data;
  } catch (error) {
//     console.log("❌ API Error:", error);
    if (error.code === "ERR_NETWORK") {
//       console.error(
      
    } else {
//       console.error("Registration error:", error);
    }
    throw error;
  }
};

/**
 * Reset user password
 */
export const resetPassword = async (passwordData) => {
  try {
    const response = await apiClient.post("/auth/password/reset", passwordData);
    return response.data;
  } catch (error) {
//     console.error("Password reset failed:", error);
    throw error;
  }
};

/**
 * Reset user password with code from email
 */
export const resetPasswordWithCode = async (resetData) => {
  try {
    const response = await apiClient.post(
      "/auth/password/forgot/reset",
      resetData
    );
    return response.data;
  } catch (error) {
//     console.error("Password reset with code failed:", error);
    throw error;
  }
};

/**
 * Get user profile information
 */
export const getUserProfile = async () => {
  try {
    const response = await apiClient.get("/account/profile");
    return response.data;
  } catch (error) {
//     console.error("Get user profile failed:", error);
    throw error;
  }
};

/**
 * Update user profile
 */
export const updateUserProfile = async (profileData) => {
  try {
    const response = await apiClient.put("/account/profile", profileData);
    return response.data;
  } catch (error) {
//     console.error("Update user profile failed:", error);
    throw error;
  }
};

export const requestOTP = async (data) => {
  const response = await apiClient.post("/auth/register/otp/verify", data);
  return response.data;
};

export const verifyOTP = async (data) => {
  const response = await apiClient.post("/auth/register", data);
  return response.data;
};

/**
 * Request verification code for registration
 * @param {string} email - The email to send verification code to
 */
export const requestVerificationCode = async (email) => {
  try {
    const response = await apiClient.post("/auth/register/code/verify", {
      email,
    });
    return response.data;
  } catch (error) {
//     console.error("Failed to request verification code:", error);
    throw error;
  }
};

// Default export object for easier imports
export const authService = {
  login,
  signUp,
  logout,
  refreshToken,
  requestPasswordReset,
  confirmPasswordReset,
  register,
  resetPassword,
  resetPasswordWithCode, // Add the new function
  getUserProfile,
  getCurrentUser: getUserProfile, // Alias for backward compatibility
  updateUserProfile,
  requestOTP,
  verifyOTP,
  requestVerificationCode, // Add the new function
};

export default authService;
