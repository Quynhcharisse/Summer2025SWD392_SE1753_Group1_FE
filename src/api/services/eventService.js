import apiClient from "@api/apiClient";

export const getEventList = async () => {
    try {
        const response = await apiClient.get("/education/event/list");
        return response;
    } catch (error) {
//         console.error("Get event list error:", error);
        throw error;
    }
};

export const getEventDetail = async (id) => {
    try {
        const response = await apiClient.get(`/education/event/detail?id=${id}`);
        return response;
    } catch (error) {
//         console.error("Get event detail error:", error);
        throw error;
    }
};

export const createEvent = async (data) => {
    try {
        const response = await apiClient.post("/education/event", data);
        return response;
    } catch (error) {
//         console.error("Create event error:", error);
        throw error;
    }
};

export const cancelEvent = async ({ id, reason }) => {
    try {
        const response = await apiClient.put(`/education/event/cancel?id=${id}`, { reason });
        return response;
    } catch (error) {
//         console.error(`Cancel event error for ID ${id}:`, error);
        throw error;
    }
};

export const getEventTeachers = async (eventId) => {
    try {
        const response = await apiClient.get(`/education/event/assign/teachers?id=${eventId}`);
        return response.data;
    } catch (error) {
//         console.error('Get event teachers error:', error);
        throw error;
    }
};

export const getEventActive = async () => {
    try {
        const response = await apiClient.get("/auth/event/active");
        return response;
    } catch (error) {
//         console.error("Get event list error:", error);
        throw error;
    }
};

export const getEventActiveDetail = async (id) => {
    try {
        const response = await apiClient.get(`/auth/event/detail?id=${id}`);
        return response;
    } catch (error) {
//         console.error("Get event active detail error:", error);
        throw error;
    }
};

export const registerEvent = async ({ eventId, studentIds }) => {
    try {
        const response = await apiClient.post(`/parent/event/register`, {
            eventId,
            studentIds,
        });
        return response;
    } catch (error) {
//         console.error("Register event error:", error);
        throw error;
    }
};

export const getChildren = async () => {
    try {
        const response = await apiClient.get("/parent/child");
        if (!response?.data) {
            throw new Error("Failed to fetch children");
        }
        return response.data;
    } catch (error) {
//         console.error("Error fetching children:", error);
        throw error;
    }
};

export const getRegisteredEvents = async () => {
    try {
        const response = await apiClient.get("/parent/event/register");
        return response;
    } catch (error) {
//         console.error("Get registered events error:", error);
        throw error;
    }
};

export const getEventStudents = async (eventId) => {
    try {
        const response = await apiClient.get(`/education/event/assign/students?id=${eventId}`);
        return response.data;
    } catch (error) {
        console.error('Get event students error:', error);
        throw error;
    }
};

export const exportEventParticipants = async (eventId) => {
    try {
        const response = await apiClient.get(`/education/event/participants/export`, {
            params: { id: eventId },
            responseType: 'blob',
        });
        return response;
    } catch (error) {
        console.error('Export event participants error:', error);
        throw error;
    }
};



