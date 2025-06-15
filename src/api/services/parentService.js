import apiClient from "@api/apiClient.js";

export const getFormInformation = async () => {
    try {
        const response = await apiClient.get("/parent/form/list");
        if (!response || !response.data) {
            throw new Error("Failed to fetch form information");
        }
        return response.data;
    } catch (error) {
        console.error("Error fetching form information:", error);
        throw error;
    }
}

export const submittedForm = async (formData) => {
    try {
        if (!formData || !formData.studentId || !formData.householdRegistrationAddress) {
            throw new Error("Missing required form data");
        }

        const response = await apiClient.post("/parent/form/submit", {
            studentId: formData.studentId,
            householdRegistrationAddress: formData.householdRegistrationAddress,
            profileImage: formData.profileImage,
            birthCertificateImg: formData.birthCertificateImg,
            householdRegistrationImg: formData.householdRegistrationImg,
            commitmentImg: formData.commitmentImg,
            note: formData.note
        });

        if (!response || !response.data) {
            throw new Error("Failed to submit form");
        }
        return response.data;
    } catch (error) {
        console.error("Error submitting form:", error);
        throw error;
    }
}


export const cancelAdmission = async (formId) => {
    try {
        if (!formId) throw new Error("Form ID is required");

        const response = await apiClient.put("/parent/form/cancel", { 
            formId: parseInt(formId) 
        });
        
        return response.data;
    } catch (error) {
        // Handle 403 Forbidden (session expired) specially
        if (error.response?.status === 403) throw error;
        
        // Return backend error message or fallback
        return error.response?.data || {
            success: false,
            message: error.message || "Failed to cancel admission",
            data: null
        };
    }
};