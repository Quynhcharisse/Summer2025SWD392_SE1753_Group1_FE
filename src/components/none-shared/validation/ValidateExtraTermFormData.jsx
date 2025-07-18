// Validation function for Extra Term creation in TermAdmission
export const ValidateExtraTermFormData = (formData, parentTerm) => {
    // 1. Validate basic fields
    if (!formData.startDate) {
        return "Start date is required";
    }
    
    if (!formData.endDate) {
        return "End date is required";
    }

    if (!formData.parentTermId) {
        return "Parent term is required";
    }

    // 2. Validate dates
    const startDate = new Date(formData.startDate);
    const endDate = new Date(formData.endDate);

    // Check if dates are valid
    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
        return "Invalid date format";
    }

    // Check if endDate is after startDate
    if (endDate <= startDate) {
        return "End date must be after start date";
    }

    // 3. Validate against parent term dates (specific to extra term)
    if (parentTerm) {
        const parentStartDate = new Date(parentTerm.startDate);
        const parentEndDate = new Date(parentTerm.endDate);

        if (startDate < parentStartDate || endDate > parentEndDate) {
            return "Extra term dates must be within parent term dates";
        }
    }

    // 4. Validate business logic
    if (formData.maxNumberRegistration && formData.maxNumberRegistration < 0) {
        return "Max number registration must be greater than or equal to 0";
    }

    if (formData.expectedClasses && formData.expectedClasses < 0) {
        return "Expected classes must be greater than or equal to 0";
    }

    // All validations passed
    return null;
}; 