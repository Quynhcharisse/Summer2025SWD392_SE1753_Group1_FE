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

export const updateEvent = async (id, data) => {
    try {
        // Log the update operation
        console.log(`Editing event ${id} with data:`, data);
        
        // Use query parameter for id in update endpoint
        const response = await apiClient.put(`/education/event?id=${id}`, data);
        
        // Log the response
        console.log(`Edit response for event ${id}:`, response);
        
        return response;
    } catch (error) {
        console.error(`Edit event error for ID ${id}:`, error);
        throw error;
    }
};


