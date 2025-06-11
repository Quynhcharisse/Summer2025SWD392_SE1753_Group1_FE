import {executeWithRetry} from "@utils/apiRetryHandler.js";
import apiClient from "@api/apiClient.js";

export const getTermList = async () => {
    try {
        const response = await executeWithRetry(
            () => apiClient.get("/admission/term"))
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

    console.log("Grade: ", grade)

    try {
        const response = await executeWithRetry(() =>
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
            })
        );
        return response.data;
    } catch (error) {
        console.error("Create term error:", error);
        throw error;
    }
}