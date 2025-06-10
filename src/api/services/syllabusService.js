import apiClient from "@api/apiClient";

export const getSyllabusList = async () => {
    try {
        const response = await apiClient.get("/education/syllabus/list");
        return response;
    } catch (error) {
        console.error("Get syllabus list error:", error);
        throw error;
    }
};

export const getSyllabusDetail = async (id) => {
    try {
        const response = await apiClient.get(`/education/syllabus/detail?id=${id}`);
        return response;
    } catch (error) {
        console.error("Get syllabus detail error:", error);
        throw error;
    }
};

export const createSyllabus = async (data) => {
    try {
        const response = await apiClient.post("/education/syllabus", data);
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
        
        // Use query parameter for id in update endpoint
        const response = await apiClient.put(`/education/syllabus?id=${id}`, data);
        
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
