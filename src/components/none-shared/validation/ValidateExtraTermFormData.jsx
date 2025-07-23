// Validation function for Extra Term creation in TermAdmission
export const ValidateExtraTermFormData = (formData, parentTerm) => {
    // 1. Validate basic fields
    if (!formData.startDate) {
        return "Start date is required and must be after today";
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
        // Check parentTerm status
        if (parentTerm.status && parentTerm.status.toLowerCase() !== 'locked') {
            return "Only locked parent terms can have extra terms.";
        }
        // Check overlap with other extra terms (if any)
        if (parentTerm.extraTerms && Array.isArray(parentTerm.extraTerms)) {
            for (const extra of parentTerm.extraTerms) {
                // Bỏ qua extra term đang tạo (chưa có id)
                if (!extra.startDate || !extra.endDate) continue;
                // Nếu extra term này đã bị lock thì bỏ qua
                if (extra.status && extra.status.toLowerCase() === 'locked') continue;
                const extraStart = new Date(extra.startDate);
                const extraEnd = new Date(extra.endDate);
                // Kiểm tra overlap
                const overlap = !(endDate < extraStart || startDate > extraEnd);
                if (overlap) {
                    console.log('[ExtraTerm][Validate] Overlap với extra term:', extra);
                    return `Extra term time overlaps with existing extra term: ${extra.name || ''}`;
                }
            }
            // Chỉ cho phép 1 extra term active/inactive cùng lúc
            const activeExtra = parentTerm.extraTerms.find(et => et.status && et.status.toLowerCase() !== 'locked');
            if (activeExtra) {
                return "Only one active extra term can exist at a time.";
            }
        }
    }

    // 4. Validate business logic
    if (!formData.maxNumberRegistration || formData.maxNumberRegistration <= 0) {
        return "Maximum number of registrations must be greater than 0.";
    }

    if (formData.expectedClasses && formData.expectedClasses < 0) {
        return "Expected classes must be greater than or equal to 0";
    }

    // All validations passed
    return null;
}; 