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
};

export const submittedForm = async (formData) => {
    try {
        if (
            !formData ||
            !formData.studentId ||
            !formData.householdRegistrationAddress
        ) {
            throw new Error("Missing required form data");
        }

        const response = await apiClient.post("/parent/form/submit", {
            studentId: formData.studentId,
            householdRegistrationAddress: formData.householdRegistrationAddress,
            childCharacteristicsFormImg: formData.childCharacteristicsFormImg,
            commitmentImg: formData.commitmentImg,
            note: formData.note,
        });

        if (!response || !response.data) {
            throw new Error("Failed to submit form");
        }
        return response.data;
    } catch (error) {
        console.error("Error submitting form:", error);
        throw error;
    }
};

export const cancelAdmission = async (formId) => {
    try {
        if (!formId) throw new Error("Form ID is required");

        const response = await apiClient.put("/parent/form/cancel", {
            formId: parseInt(formId),
        });

        return response.data;
    } catch (error) {
        // Handle 403 Forbidden (session expired) specially
        if (error.response?.status === 403) throw error;

        // Return backend error message or fallback
        return (
            error.response?.data || {
                success: false,
                message: error.message || "Failed to cancel admission",
                data: null,
            }
        );
    }
};

export const createChild = async (childData) => {
    try {
        if (!childData?.name || !childData?.dateOfBirth) {
            throw new Error("Missing required child data");
        }

        const response = await apiClient.post("/parent/child", childData);

        if (!response?.data) {
            throw new Error("Failed to create child");
        }
        return response.data;
    } catch (error) {
        console.error("Error creating child:", error);
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
        console.error("Error fetching children:", error);
        throw error;
    }
};

export const refillForm = async (formData) => {
    try {
        if (!formData || !formData.studentId || !formData.householdRegistrationAddress || !formData.childCharacteristicsFormImg || !formData.commitmentImg) {
            throw new Error("Missing required form data");
        }

        const response = await apiClient.post("/parent/form/refill", {
            formId: formData.formId,
            studentId: formData.studentId,
            householdRegistrationAddress: formData.householdRegistrationAddress,
            childCharacteristicsFormImg: formData.childCharacteristicsFormImg,
            commitmentImg: formData.commitmentImg,
            note: formData.note || ""
        });

        if (!response || !response.data) {
            throw new Error("Failed to resubmit form");
        }
        return response.data;
    } catch (error) {
        console.error("Error resubmitting form:", error);
        throw error;
    }
};

// Update child info (PUT)
export const updateChild = async (childData) => {
    try {
        if (!childData?.id) throw new Error("Missing child ID");
        const response = await apiClient.put("/parent/child", childData);
        if (!response?.data) throw new Error("Failed to update child");
        return response.data;
    } catch (error) {
        console.error("Error updating child:", error);
        throw error;
    }
};

// Delete child (DELETE)
export const deleteChild = async (childId) => {
    try {
        if (!childId) throw new Error("Missing child ID");
        const response = await apiClient.delete(`/parent/child/${childId}`);
        if (!response?.data) throw new Error("Failed to delete child");
        return response.data;
    } catch (error) {
        console.error("Error deleting child:", error);
        throw error;
    }
};


export const getURL = async (formId) => {
    try {
        const response = await apiClient.post("/parent/payment", {
            formId: formId
        }, {
            // If you need to send cookies/JWT for auth:
            withCredentials: true
        });
        if (response.data && response.data.success) {
            return response.data.data;
        } else {
            throw new Error(response.data?.message || "Unknown error");
        }
    } catch (err) {
        throw new Error(err.response?.data?.message || err.message || "Failed to get URL");
    }
};


export const createTransaction = async (
    formId,
    description,
    transactionInfo,
    responseCode
) => {
    try {
        const response = await apiClient.post("/parent/payment/initiate", {
            formId: formId,
            description: description,
            transactionInfo: transactionInfo,
            responseCode: responseCode
        }, {
            // If you need to send cookies/JWT for auth:
            withCredentials: true
        });
        if (response.data && response.data.success) {
            return response.data.data;
        } else {
            throw new Error(response.data?.message || "Unknown error");
        }
    } catch (err) {
        throw new Error(err.response?.data?.message || err.message || "Failed to create transaction");
    }
};

