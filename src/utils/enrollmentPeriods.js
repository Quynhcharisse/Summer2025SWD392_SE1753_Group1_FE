/**
 * Enrollment Period Utilities
 * Helper functions for managing 4-month enrollment periods
 */

/**
 * Define enrollment periods for the year
 * Each period is 4 months long
 */
export const ENROLLMENT_PERIODS = {
  FALL: {
    name: 'Fall Period',
    months: 'September - December',
    duration: 4,
    registrationOffset: -2 // Registration opens 2 months before
  },
  WINTER: {
    name: 'Winter Period', 
    months: 'January - April',
    duration: 4,
    registrationOffset: -2
  },
  SPRING: {
    name: 'Spring Period',
    months: 'May - August', 
    duration: 4,
    registrationOffset: -2
  }
};

/**
 * Get current enrollment period based on date
 * @param {Date} date - Current date (defaults to now)
 * @returns {Object} Current period information
 */
export const getCurrentEnrollmentPeriod = (date = new Date()) => {
  const month = date.getMonth() + 1; // JavaScript months are 0-indexed
  const year = date.getFullYear();
  
  if (month >= 9 && month <= 12) {
    return {
      ...ENROLLMENT_PERIODS.FALL,
      year,
      startMonth: 9,
      endMonth: 12,
      registrationStart: new Date(year, 6, 1), // July 1st
      registrationEnd: new Date(year, 7, 15), // August 15th
      periodStart: new Date(year, 8, 1), // September 1st
      periodEnd: new Date(year, 11, 31) // December 31st
    };
  } else if (month >= 1 && month <= 4) {
    return {
      ...ENROLLMENT_PERIODS.WINTER,
      year,
      startMonth: 1,
      endMonth: 4,
      registrationStart: new Date(year - 1, 10, 1), // November 1st previous year
      registrationEnd: new Date(year - 1, 11, 15), // December 15th previous year
      periodStart: new Date(year, 0, 1), // January 1st
      periodEnd: new Date(year, 3, 30) // April 30th
    };
  } else {
    return {
      ...ENROLLMENT_PERIODS.SPRING,
      year,
      startMonth: 5,
      endMonth: 8,
      registrationStart: new Date(year, 2, 1), // March 1st
      registrationEnd: new Date(year, 3, 15), // April 15th
      periodStart: new Date(year, 4, 1), // May 1st
      periodEnd: new Date(year, 7, 31) // August 31st
    };
  }
};

/**
 * Get next enrollment period
 * @param {Date} date - Current date (defaults to now)
 * @returns {Object} Next period information
 */
export const getNextEnrollmentPeriod = (date = new Date()) => {
  const current = getCurrentEnrollmentPeriod(date);
  const nextDate = new Date(current.periodEnd);
  nextDate.setDate(nextDate.getDate() + 1); // Day after current period ends
  
  return getCurrentEnrollmentPeriod(nextDate);
};

/**
 * Get all enrollment periods for a year
 * @param {number} year - Year to get periods for
 * @returns {Array} Array of all periods in the year
 */
export const getYearEnrollmentPeriods = (year) => {
  return [
    {
      ...ENROLLMENT_PERIODS.WINTER,
      year,
      startMonth: 1,
      endMonth: 4,
      registrationStart: new Date(year - 1, 10, 1),
      registrationEnd: new Date(year - 1, 11, 15),
      periodStart: new Date(year, 0, 1),
      periodEnd: new Date(year, 3, 30)
    },
    {
      ...ENROLLMENT_PERIODS.SPRING,
      year,
      startMonth: 5,
      endMonth: 8,
      registrationStart: new Date(year, 2, 1),
      registrationEnd: new Date(year, 3, 15),
      periodStart: new Date(year, 4, 1),
      periodEnd: new Date(year, 7, 31)
    },
    {
      ...ENROLLMENT_PERIODS.FALL,
      year,
      startMonth: 9,
      endMonth: 12,
      registrationStart: new Date(year, 6, 1),
      registrationEnd: new Date(year, 7, 15),
      periodStart: new Date(year, 8, 1),
      periodEnd: new Date(year, 11, 31)
    }
  ];
};

/**
 * Check if registration is currently open for a period
 * @param {Object} period - Period object
 * @param {Date} date - Current date (defaults to now)
 * @returns {boolean} Whether registration is open
 */
export const isRegistrationOpen = (period, date = new Date()) => {
  return date >= period.registrationStart && date <= period.registrationEnd;
};

/**
 * Check if a period is currently active
 * @param {Object} period - Period object
 * @param {Date} date - Current date (defaults to now)
 * @returns {boolean} Whether period is active
 */
export const isPeriodActive = (period, date = new Date()) => {
  return date >= period.periodStart && date <= period.periodEnd;
};

/**
 * Get registration status for a period
 * @param {Object} period - Period object
 * @param {Date} date - Current date (defaults to now)
 * @returns {string} Registration status: 'open', 'closed', 'upcoming'
 */
export const getRegistrationStatus = (period, date = new Date()) => {
  if (isRegistrationOpen(period, date)) {
    return 'open';
  } else if (date > period.registrationEnd) {
    return 'closed';
  } else {
    return 'upcoming';
  }
};

/**
 * Format period date range for display
 * @param {Object} period - Period object
 * @returns {string} Formatted date range
 */
export const formatPeriodRange = (period) => {
  const startMonth = period.periodStart.toLocaleDateString('en-US', { month: 'long' });
  const endMonth = period.periodEnd.toLocaleDateString('en-US', { month: 'long' });
  const year = period.periodStart.getFullYear();
  
  return `${startMonth} ${year} - ${endMonth} ${year}`;
};

/**
 * Format registration dates for display
 * @param {Object} period - Period object
 * @returns {Object} Formatted registration dates
 */
export const formatRegistrationDates = (period) => {
  return {
    start: period.registrationStart.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    }),
    end: period.registrationEnd.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    })
  };
};

export default {
  ENROLLMENT_PERIODS,
  getCurrentEnrollmentPeriod,
  getNextEnrollmentPeriod,
  getYearEnrollmentPeriods,
  isRegistrationOpen,
  isPeriodActive,
  getRegistrationStatus,
  formatPeriodRange,
  formatRegistrationDates
};
