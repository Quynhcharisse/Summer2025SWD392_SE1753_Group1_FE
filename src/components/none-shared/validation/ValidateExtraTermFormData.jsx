export const ValidateExtraTermFormData = (formData) => {
    // 1. Validate basic fields (empty check)
    if (!formData.admissionTermId) {
        return "Admission Term is required";
    }
    if (!formData.startDate) {
        return "Start date is required";
    }
    if (!formData.endDate) {
        return "End date is required";
    }
    if (!formData.reason) {
        return "Reason is required";
    }

    // 2. Validate dates
    const startDate = new Date(formData.startDate);
    const endDate = new Date(formData.endDate);

    // Check if endDate is after startDate
    if (endDate <= startDate) {
        return "End date must be after start date";
    }

    // All validations passed
    return "";
}; 