import apiClient from "@api/apiClient";

export const getUnassignedLessons = async (id) => {
    try {
        const response = await apiClient.get(`/education/syllabus/unassign/lessons?id=${id}`);
        return response;
    } catch (error) {
        console.error("Get unassigned lessons error:", error);
        throw error;
    }
};

export const getAssignedLessons = async (id) => {
    try {
        const response = await apiClient.get(`/education/syllabus/assign/lessons?id=${id}`);
        return response;
    } catch (error) {
        console.error("Get assigned lessons error:", error);
        throw error;
    }
};

export const assignLessons = async (id, lessonNames) => {
    try {
        console.log('Assigning lessons:', { id, lessonNames });
        const response = await apiClient.put(`/education/syllabus/assign/lessons?id=${id}`, {
            lessonNames: lessonNames
        });
        return response;
    } catch (error) {
        console.error("Assign lessons error:", error);
        throw error;
    }
};

export const unassignLessons = async (id, lessonNames) => {
    try {
        console.log('Unassigning lessons:', { id, lessonNames });
        const response = await apiClient.put(`/education/syllabus/unassign/lessons?id=${id}`, {
            lessonNames: lessonNames
        });
        return response;
    } catch (error) {
        console.error("Unassign lessons error:", error);
        throw error;
    }
}; 