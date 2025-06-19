import apiClient from "@api/apiClient";

export const getTeacherList = async () => {
    try {
        const response = await apiClient.get("/hr/teacher");
        return response;
    } catch (error) {
        console.error("Get teacher list error:", error);
        throw error;
    }
};
