import apiClient from "@api/apiClient.js";
import dayjs from "dayjs";

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
        const response = await apiClient.get("/admission/term")
        return response.data
    } catch (error) {
        throw error;
    }
}

export const createTerm = async (
    startDate,
    endDate,
    termItemList
) => {
    try {
        const response = await apiClient.post('/admission/term', {
            startDate: startDate,
            endDate: endDate,
            termItemList: termItemList
        });
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const getDefaultGrade = async (grade) => {
    try {
        const response = await apiClient.get('/admission/default/fee', {
            params: {grade}
        });
        return response.data;
    } catch (error) {
        throw error;
    }
};

// Extra Term APIs
export const createExtraTerm = async (formData) => {
    try {
        const response = await apiClient.post('/admission/extra/term', {
            parentTermId: formData.parentTermId,
            startDate: formData.startDate,
            endDate: formData.endDate,
            maxNumberRegistration: formData.maxNumberRegistration,
            expectedClasses: formData.expectedClasses
        });
        return response.data;
    } catch (error) {
//         console.error('Error creating extra term:', error);
        throw error;
    }
};

export const getTermYears = async () => {
    try {
        const response = await apiClient.get('/admission/years');
        if (!response.data.success) {
            throw new Error(response.data.message || 'Failed to fetch years');
        }
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const updateTermStatus = async (termId) => {
    try {
        const response = await apiClient.put('/admission/term', {
            termId: termId,
        });
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const getTransactionList = async () => {
    try {
        const response = await apiClient.get('/admission/transactions');
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const exportTransactions = async () => {
    try {
        const response = await apiClient.get('/admission/export', {
            responseType: 'blob'
        });
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const getDailyTotal = async () => {
    try {
        const response = await apiClient.post('/admission/daily/total/transaction', {
            date: dayjs().format('YYYY-MM-DD'),
            totalAmount: 0
        });
//         console.log('API Response:', response);
        return response.data;
    } catch (error) {
//         console.error('Error in getDailyTotal:', error.response || error);
        throw error;
    }
};


