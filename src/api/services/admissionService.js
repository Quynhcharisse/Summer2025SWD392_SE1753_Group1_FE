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

// Extra Term APIs
export const createExtraTerm = async (data) => {
    try {
        console.log('🚀 Creating Extra Term - Request Data:', {
            admissionTermId: data.termId,
            startDate: data.startDate,
            endDate: data.endDate,
            maxNumberRegistration: data.maxNumberRegistration
        });

        const response = await apiClient.post('/admission/extra/term', {
            admissionTermId: data.termId,
            startDate: data.startDate,
            endDate: data.endDate,
            maxNumberRegistration: data.maxNumberRegistration
        });

        console.log('✅ Extra Term Creation Response:', response.data);
        return response.data;
    } catch (error) {
        console.error('❌ Extra Term Creation Error:', {
            message: error.message,
            response: error.response?.data,
            status: error.response?.status,
            headers: error.response?.headers
        });
        throw error;
    }
};

