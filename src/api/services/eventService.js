import apiClient from "@api/apiClient";

export const getEventList = async () => {
    try {
        const response = await apiClient.get("/education/event/list");
        return response;
    } catch (error) {
        console.error("Get event list error:", error);
        throw error;
    }
};

export const getEventDetail = async (id) => {
    try {
        const response = await apiClient.get(`/education/event/detail?id=${id}`);
        return response;
    } catch (error) {
        console.error("Get event detail error:", error);
        throw error;
    }
};

export const createEvent = async (data) => {
    try {
        const response = await apiClient.post("/education/event", data);
        return response;
    } catch (error) {
        console.error("Create event error:", error);
        throw error;
    }
};

export const cancelEvent = async (id) => {
    try {
        const response = await apiClient.put(`/education/event/cancel?id=${id}`);
        return response;
    } catch (error) {
        console.error(`Cancel event error for ID ${id}:`, error);
        throw error;
    }
};

export const getEventTeachers = async (eventId) => {
    try {
        const response = await apiClient.get(`/education/event/assign/teachers?id=${eventId}`);
        return response.data;
    } catch (error) {
        console.error('Get event teachers error:', error);
        throw error;
    }
};


