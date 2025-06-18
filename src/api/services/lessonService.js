import apiClient from "@api/apiClient";

export const getLessonList = async () => {
    try {
        const response = await apiClient.get("/education/lesson/list");
        return response;
    } catch (error) {
        console.error("Get lesson list error:", error);
        throw error;
    }
};

export const createLesson = async (data) => {
    try {
        const response = await apiClient.post("/education/lesson", data);
        return response;
    } catch (error) {
        console.error("Create lesson error:", error);
        throw error;
    }
};

export const updateLesson = async (id, data) => {
    try {
        // Log the update operation
        console.log(`Editing lesson ${id} with data:`, data);
        
        const response = await apiClient.put(`/education/lesson?id=${id}`, data);
        
        // Log the response
        console.log(`Edit response for lesson ${id}:`, response);
        
        return response;
    } catch (error) {
        console.error(`Edit lesson error for ID ${id}:`, error);
        throw error;
    }
};

export const getLessonSyllabuses = async (id) => {
    try {
        const response = await apiClient.get(`/education/lesson/assign/syllabuses?id=${id}`);
        return response;
    } catch (error) {
        console.error("Get lesson syllabuses error:", error);
        throw error;
    }
};
