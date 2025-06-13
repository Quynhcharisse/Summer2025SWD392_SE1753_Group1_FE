
export function ValidateTermFormData(formData, existingTerms = []) {
    const now = new Date();

    if (!formData.grade) return "Grade is required";
    if (!formData.startDate || !formData.endDate) return "Start and end dates are required";

    const start = new Date(formData.startDate);
    const end = new Date(formData.endDate);

    if (start >= end) return "Start date must be before end date";
    if (start < now) return "Start date must not be in the past";

    if (
        formData.maxNumberRegistration <= 0 ||
        formData.maxNumberRegistration > 1000
    ) {
        return "Max registrations must be between 1 and 1000";
    }

    const fees = [
        formData.reservationFee,
        formData.serviceFee,
        formData.uniformFee,
        formData.learningMaterialFee,
        formData.facilityFee,
    ];
    if (fees.some(fee => fee < 0)) return "Fees must be non-negative";

    // Rule: Trùng thời gian cùng grade
    const overlaps = existingTerms.some(term => {
        if (term.grade !== formData.grade) return false;
        const termStart = new Date(term.startDate);
        const termEnd = new Date(term.endDate);
        return !(end < termStart || start > termEnd);
    });
    if (overlaps) return "Time period overlaps with another term of the same grade";

    // Rule: Tối đa 3 term/năm
    const currentYear = new Date().getFullYear();
    const termsThisYear = existingTerms.filter(term => term.year === currentYear);
    if (termsThisYear.length >= 3) return `Cannot create more than 3 terms in year ${currentYear}`;

    return null;
}
