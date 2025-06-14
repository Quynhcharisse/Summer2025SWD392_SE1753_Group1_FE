import apiClient from "@api/apiClient.js";

export const getFormInformation = async () => {
    const response = await apiClient.get("/parent/form/list")
    return response ? response.data : null
}

export const submittedForm = async (
    studentId,
    householdRegistrationAddress,
    profileImage,
    birthCertificateImg,
    householdRegistrationImg,
    commitmentImg,
    note) => {
    const response = await apiClient.post("/parent/form/submit", {
        studentId: studentId,
        householdRegistrationAddress: householdRegistrationAddress,
        profileImage: profileImage,
        birthCertificateImg: birthCertificateImg,
        householdRegistrationImg: householdRegistrationImg,
        commitmentImg: commitmentImg,
        note: note
    })
    return response ? response.data : null
}

// thêm headers : Content-Type: application/json bắt buộc để Spring hiểu đây là raw JSON
// nếu ko co headers : nó bị sai định dạng gây lỗi null..
export const cancelAdmission = async (id) => {
    const response = await apiClient.put("/parent/form/cancel", id, {
        headers: {
            "Content-Type": "application/json"
        }
    });
    return response ? response.data : null;
};