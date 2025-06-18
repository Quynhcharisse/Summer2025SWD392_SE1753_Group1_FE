import apiClient from "@api/apiClient.js";

export const getFormTracking = async () => {
    const response = await apiClient.get("/admission/form/list")
    return response ? response.data : null
}

export const processAdmissionForm = async (id, isApproved, reason) => {
    const response = await apiClient.put("/admission/form/process", {
        id: id,
        approved: isApproved,
        reason: reason,
    })
    return response ? response.data : null
}

export const getTermList = async () => {
    try {
        const response = await
           apiClient.get("/admission/term")
        return response.data
    } catch (error) {
        console.error("Get term list error:", error);
        throw error;
    }
}

export const createTerm = async (
    grade,
    startDate,
    endDate,
    maxNumberRegistration,
    reservationFee,
    serviceFee,
    uniformFee,
    learningMaterialFee,
    facilityFee
) => {

    try {
        const response = await
            apiClient.post("/admission/term", {
                grade: grade,
                startDate: startDate,
                endDate: endDate,
                maxNumberRegistration: maxNumberRegistration,
                reservationFee: reservationFee,
                serviceFee: serviceFee,
                uniformFee: uniformFee,
                learningMaterialFee: learningMaterialFee,
                facilityFee: facilityFee
            }
        );
        return response.data;
    } catch (error) {
        console.error("Create term error:", error);
        throw error;
    }
}

export const getDefaultGrade = async (grade) => {
    try {
        const response = await apiClient.get(`/admission/default/fee`, {
            params: { grade } //Gửi grade vào query
        });
        return response.data;
    } catch (error) {
        console.error("Error fetching default fee for grade:", grade, error);
        throw error;
    }
};

export const cancelAdmission = async (id, reason) => {
    try {
        const response = await apiClient.put("/admission/form/cancel", {
            id: id,
            reason: reason
        });
        return response ? response.data : null;
    } catch (error) {
        console.error("Cancel admission error:", error);
        throw error;
    }
}

// Extra Term APIs
export const createExtraTerm = async (admissionTermId, startDate, endDate, reason) => {
    try {
        const response = await apiClient.post('/admission/extra/term', {
            admissionTermId,
            startDate,
            endDate,
            reason
        });
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const getExtraTermList = async () => {
    try {
        const response = await apiClient.get('/admission/extra/term');
        return response.data;
    } catch (error) {
        throw error;
    }
};

