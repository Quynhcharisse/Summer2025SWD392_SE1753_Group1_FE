export const ValidateTermFormData = (formData, existingTerms) => {
    // Check empty fields
    if (!formData.grade) {
        return "Grade is required";
    }
    if (!formData.startDate) {
        return "Start date is required";
    }
    if (!formData.endDate) {
        return "End date is required";
    }
    if (!formData.maxNumberRegistration || formData.maxNumberRegistration <= 0) {
        return "Max number of registrations must be greater than 0";
    }

    // Validate grade format
    const validGrades = ['SEED', 'BUD', 'LEAF'];
    if (!validGrades.includes(formData.grade.toUpperCase())) {
        return "Invalid grade. Grade must be one of: Seed, Bud, Leaf";
    }

    // Convert dates to Date objects for comparison
    const startDate = new Date(formData.startDate);
    const endDate = new Date(formData.endDate);
    const currentYear = new Date().getFullYear();

    // Check if end date is after start date
    if (endDate <= startDate) {
        return "End date must be after start date";
    }

    // Check if there's already a term for this grade in current year
    const termsThisYear = existingTerms.filter(term => {
        return term.grade.toUpperCase() === formData.grade.toUpperCase() && 
               term.year === currentYear;
    });

    if (termsThisYear.length > 0) {
        return `An admission term already exists for grade ${formData.grade} in year ${currentYear}`;
    }

    // Check for time overlap with same grade
    const sameGradeTerms = existingTerms.filter(term => 
        term.grade.toUpperCase() === formData.grade.toUpperCase()
    );

    for (const term of sameGradeTerms) {
        const termStart = new Date(term.startDate);
        const termEnd = new Date(term.endDate);

        if (!(endDate <= termStart || startDate >= termEnd)) {
            return "Time period overlaps with another term of the same grade";
        }
    }

    return ""; // Return empty string if validation passes
};
