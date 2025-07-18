export const ValidateTermFormData = (formData, existingTerms) => {
    // Validate Grade
    if (!formData.grade || formData.grade.trim() === '') {
        return "Grade is required";
    }

    // Validate Start Date
    if (!formData.startDate) {
        return "Start date is required";
    }

    // Validate End Date
    if (!formData.endDate) {
        return "End date is required";
    }

    // Validate Start Date must be before End Date
    const startDate = new Date(formData.startDate);
    const endDate = new Date(formData.endDate);
    if (startDate >= endDate) {
        return "Start date must be before end date";
    }

    // Validate Expected Classes
    if (!formData.expectedClasses || formData.expectedClasses === '') {
        return "Expected classes is required";
    }
    if (parseInt(formData.expectedClasses) <= 0) {
        return "Expected classes must be greater than 0";
    }

    // Check for overlapping terms
    for (const term of existingTerms) {
        if (term.grade.toLowerCase() !== formData.grade.toLowerCase()) {
            continue;
        }

        const termStart = new Date(term.startDate);
        const termEnd = new Date(term.endDate);

        // Check for overlap
        if (!(endDate <= termStart || startDate >= termEnd)) {
            return `Time period overlaps with existing term "${term.name}"`;
        }
    }

    // Check if term already exists for this grade and year
    const year = new Date(formData.startDate).getFullYear();
    const termExists = existingTerms.some(term => 
        term.grade.toLowerCase() === formData.grade.toLowerCase() && 
        term.year === year
    );

    if (termExists) {
        return `A term for grade ${formData.grade.toUpperCase()} in year ${year} already exists`;
    }

    return null;
};
