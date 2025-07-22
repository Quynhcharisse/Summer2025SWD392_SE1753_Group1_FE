
const calculateAcademicYear = (date) => {
    if (!date) return new Date().getFullYear();
    const d = date.toDate ? date.toDate() : new Date(date);
    const year = d.getFullYear();
    const month = d.getMonth() + 1;
    return month >= 6 ? year : year - 1;
};

// Main validator
export const ValidateTermFormData = (formData, existingTerms = []) => {
    const validGrades = ['SEED', 'BUD', 'LEAF'];
    const now = new Date();

    // --- 1. Validate Date fields ---
    if (!formData.startDate) return "Start date is required.";
    if (!formData.endDate) return "End date is required.";

    const startDate = formData.startDate.toDate ? formData.startDate.toDate() : new Date(formData.startDate);
    const endDate = formData.endDate.toDate ? formData.endDate.toDate() : new Date(formData.endDate);

    if (startDate >= endDate) return "Start date must be before end date.";
    if (startDate <= now) return "Start date must be in the future (after today).";
    if (startDate.getFullYear() !== endDate.getFullYear()) {
        return "Start and end dates must be in the same calendar year.";
    }

    const academicYear = calculateAcademicYear(startDate);

    // --- 2. Validate multi-grade mode ---
    if (Array.isArray(formData.termItemList)) {
        if (formData.termItemList.length === 0) {
            return "At least one grade must be included in the term.";
        }

        const gradesSet = new Set();

        for (const item of formData.termItemList) {
            if (!validGrades.includes(item.grade)) {
                return `Invalid grade: ${item.grade}`;
            }

            if (gradesSet.has(item.grade)) {
                return `Duplicate grade found: ${item.grade}`;
            }

            gradesSet.add(item.grade);

            if (!item.expectedClasses || item.expectedClasses <= 0) {
                return `Expected classes must be greater than 0 for grade: ${item.grade}`;
            }

            if (item.expectedClasses > 1000) {
                return `Expected classes is too large for grade: ${item.grade} (maximum is 1000).`;
            }

            // Check if admission term already exists for this grade and academic year
            const exists = existingTerms.some(term => {
                let termYear = typeof term.year === 'string' && term.year.includes('-')
                    ? parseInt(term.year.split('-')[0])
                    : parseInt(term.year);

                return termYear === academicYear &&
                    term.termItemList?.some(t => t.grade?.toLowerCase() === item.grade.toLowerCase());
            });

            if (exists) {
                return `An admission term already exists for academic year ${academicYear}-${academicYear + 1} and grade ${item.grade}.\n\n` +
                    "Note: Each grade level is allowed only one admission term per academic year. " +
                    "If you need to add more classes or adjust the timeline, please edit the existing term instead of creating a new one.";
            }
        }
    }

    // --- 3. Validate single-grade mode (backward compatibility) ---
    else if (formData.grade) {
        const grade = formData.grade.trim().toUpperCase();
        if (!validGrades.includes(grade)) return `Invalid grade: ${grade}`;

        if (!formData.expectedClasses || parseInt(formData.expectedClasses) <= 0) {
            return `Expected classes must be greater than 0 for grade: ${grade}`;
        }

        // Check for overlapping term date
        for (const term of existingTerms) {
            if (term.grade?.toUpperCase() !== grade) continue;

            const termStart = new Date(term.startDate);
            const termEnd = new Date(term.endDate);
            if (!(endDate <= termStart || startDate >= termEnd)) {
                return `Time period overlaps with existing term "${term.name}" for grade ${grade}`;
            }
        }

        // Duplicate term check
        const exists = existingTerms.some(term => {
            let termYear = typeof term.year === 'string' && term.year.includes('-')
                ? parseInt(term.year.split('-')[0])
                : parseInt(term.year);
            return term.grade?.toUpperCase() === grade && termYear === academicYear;
        });

        if (exists) {
            return `An admission term already exists for academic year ${academicYear}-${academicYear + 1} and grade ${grade}.\n\n` +
                "Note: Each grade level is allowed only one admission term per academic year. " +
                "If you need to add more classes or adjust the timeline, please edit the existing term instead of creating a new one.";
        }
    }

    return null; // ✅ All validations passed
};
