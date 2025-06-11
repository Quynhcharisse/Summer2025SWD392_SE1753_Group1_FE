
import apiClient from "@api/apiClient.js";

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


export const updateTerm = async (
    id,
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
            apiClient.put("/admission/term", {
                id: id,
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
        console.error("Update term error:", error);
        throw error;
    }
}