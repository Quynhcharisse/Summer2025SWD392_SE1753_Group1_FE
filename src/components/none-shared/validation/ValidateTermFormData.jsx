// Helper function to calculate academic year (same as in TermAdmission.jsx)
const calculateAcademicYear = (date) => {
    if (!date) {
        const currentYear = new Date().getFullYear();
        return currentYear;
    }
    
    const dateObj = new Date(date);
    const year = dateObj.getFullYear();
    const month = dateObj.getMonth() + 1; // Convert to 1-12
    
    // If date is June or later, use current year as base
    // If date is Jan-May, use previous year as base (part of academic year that started previous calendar year)
    return month >= 6 ? year : year - 1;
};

// Main validation function that can handle both single grade and multiple grades
export const ValidateTermFormData = (formData, existingTerms = []) => {
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

    // Validate Start Date must be in the future (match backend validation)
    if (startDate <= new Date()) {
        return "Start date must be in the future (after today)";
    }

    // Validate Start Date and End Date must be in the same calendar year (match backend validation)
    if (startDate.getFullYear() !== endDate.getFullYear()) {
        return "Start date and end date must be in the same year";
    }

    // Handle multiple grades (termItemList) validation
    if (formData.termItemList && Array.isArray(formData.termItemList)) {
        if (formData.termItemList.length === 0) {
            return "At least one grade must be included in the term";
        }

        // Validate each term item
        const validGrades = ['SEED', 'BUD', 'LEAF'];
        const gradesInTerm = new Set();

        for (const item of formData.termItemList) {
            // Validate grade enum
            if (!validGrades.includes(item.grade)) {
                return `Invalid grade: ${item.grade}`;
            }

            // Check for duplicate grades within the same term
            if (gradesInTerm.has(item.grade)) {
                return `Duplicate grade found: ${item.grade}`;
            }
            gradesInTerm.add(item.grade);

            // Validate expected classes
            if (!item.expectedClasses || item.expectedClasses <= 0) {
                return `Expected classes must be greater than 0 for grade: ${item.grade}`;
            }
        }

        // Check if term already exists for calculated academic year and any grade
        const calculatedAcademicYear = calculateAcademicYear(formData.startDate);
        
        // Check against existing terms using academic year (not calendar year)
        const existingTermsForYear = existingTerms.filter(term => {
            // Extract academic year from existing term's year string (e.g., "2024-2025" -> 2024)
            let termAcademicYear;
            if (typeof term.year === 'string' && term.year.includes('-')) {
                termAcademicYear = parseInt(term.year.split('-')[0]);
            } else {
                // Fallback to direct year comparison if format is different
                termAcademicYear = parseInt(term.year);
            }
            return termAcademicYear === calculatedAcademicYear;
        });

        for (const item of formData.termItemList) {
            const termExists = existingTermsForYear.some(term =>
                term.termItemList?.some(termItem => 
                    termItem.grade === item.grade
                )
            );

            if (termExists) {
                return `Admission term already exists for academic year ${calculatedAcademicYear}-${calculatedAcademicYear + 1} and grade ${item.grade}`;
            }
        }
    }
    // Handle single grade validation (backward compatibility)
    else if (formData.grade) {
        // Validate Grade
        if (!formData.grade || formData.grade.trim() === '') {
            return "Grade is required";
        }

        // Validate grade enum (match backend validation)
        const validGrades = ['SEED', 'BUD', 'LEAF'];
        if (!validGrades.includes(formData.grade)) {
            return `Invalid grade: ${formData.grade}`;
        }

        // Validate Expected Classes
        if (!formData.expectedClasses || formData.expectedClasses === '') {
            return "Expected classes is required";
        }
        if (parseInt(formData.expectedClasses) <= 0) {
            return "Expected classes must be greater than 0";
        }

        // Check for overlapping terms (this validation is frontend-specific and reasonable to keep)
        for (const term of existingTerms) {
            if (term.grade && term.grade.toLowerCase() !== formData.grade.toLowerCase()) {
                continue;
            }

            const termStart = new Date(term.startDate);
            const termEnd = new Date(term.endDate);

            // Check for overlap
            if (!(endDate <= termStart || startDate >= termEnd)) {
                return `Time period overlaps with existing term "${term.name}"`;
            }
        }

        // Check if term already exists for this grade and academic year (match backend logic)
        const calculatedAcademicYear = calculateAcademicYear(formData.startDate);
        
        const termExists = existingTerms.some(term => {
            // Extract academic year from existing term's year string (e.g., "2024-2025" -> 2024)
            let termAcademicYear;
            if (typeof term.year === 'string' && term.year.includes('-')) {
                termAcademicYear = parseInt(term.year.split('-')[0]);
            } else {
                // Fallback to direct year comparison if format is different
                termAcademicYear = parseInt(term.year);
            }
            
            return term.grade && term.grade.toLowerCase() === formData.grade.toLowerCase() && 
                   termAcademicYear === calculatedAcademicYear;
        });

        if (termExists) {
            return `Admission term already exists for academic year ${calculatedAcademicYear}-${calculatedAcademicYear + 1} and grade ${formData.grade.toUpperCase()}`;
        }
    }

    return null; // All validations passed
};
