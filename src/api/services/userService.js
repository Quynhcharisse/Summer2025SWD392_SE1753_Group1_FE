import apiClient from "@api/apiClient";

export const getUserProfile = async () => {
  try {
    const response = await apiClient.get("/user/profile");
    return response.data;
  } catch (error) {
    console.error("Get user profile error:", error);
    throw error;
  }
};
