import apiClient from "@api/apiClient.js";

export const getTermList = async () => {
  try {
    const response = await apiClient.get("/admission/term");

    return response.data;
  } catch (error) {
    console.error("Get term list error:", error);
    throw error;
  }
};

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
  console.log("Grade: ", grade);

  try {
    const response = await apiClient.post("/admission/term", {
      grade: grade,
      startDate: startDate,
      endDate: endDate,
      maxNumberRegistration: maxNumberRegistration,
      reservationFee: reservationFee,
      serviceFee: serviceFee,
      uniformFee: uniformFee,
      learningMaterialFee: learningMaterialFee,
      facilityFee: facilityFee,
    });

    console.log(response);

    return response.data;
  } catch (error) {
    console.log(response);
    console.error("Create term error:", error);
    throw error;
  }
};
