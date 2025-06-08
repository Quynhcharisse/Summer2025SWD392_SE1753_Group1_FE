import apiClient from "@api/apiClient";
import { executeWithRetry } from "@utils/apiRetryHandler";

export const getSyllabusList = async () => {
    try {
        const response = await executeWithRetry(() => 
            apiClient.get("/education/syllabus/list")
        );
        return response;
    } catch (error) {
        console.error("Get syllabus list error:", error);
        throw error;
    }
};

export const getSyllabusDetail = async (id) => {
    try {
        const response = await executeWithRetry(() => 
            apiClient.get(`/education/syllabus/detail/${id}`)
        );
        return response;
    } catch (error) {
        console.error("Get syllabus detail error:", error);
        throw error;
    }
};

export const createSyllabus = async (data) => {
    try {
        const response = await executeWithRetry(() => 
            apiClient.post("/education/syllabus", data)
        );
        return response;
    } catch (error) {
        console.error("Create syllabus error:", error);
        throw error;
    }
};

export const updateSyllabus = async (id, data) => {
    try {
        // Log the update operation
        console.log(`Editing syllabus ${id} with data:`, data);
        
        // Use a different endpoint for update to avoid conflict with create
        const response = await executeWithRetry(() => 
            apiClient.put(`/education/syllabus/${id}`, {
                ...data,
                id // Include ID in request body
            })
        );
        
        // Log the response
        console.log(`Edit response for syllabus ${id}:`, response);
        
        return response;
    } catch (error) {
        console.error(`Edit syllabus error for ID ${id}:`, error);
        throw error;
    }
};

export const createClass = async (data) => {
    try {
        const response = await apiClient.post("/education/classes", data);
        return response.data;
    } catch (error) {
        console.error("Create class error:", error);
        throw error;
    }
};

export const deleteSyllabus = async (id) => {
    try {
        const response = await executeWithRetry(() => 
            apiClient.delete(`/education/syllabus/${id}`)
        );
        return response;
    } catch (error) {
        console.error("Delete syllabus error:", error);
        throw error;
    }
};
