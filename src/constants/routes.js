
/**
 * Application Route Constants
 * Centralized route definitions for better maintainability
 * Updated structure based on preschool system requirements
 */

// =====================================================
// PUBLIC ROUTES (HOMEPAGE) - No Authentication Required
// =====================================================
export const PUBLIC_ROUTES = {
  // Main homepage routes
  HOMEPAGE: '/homepage',
  HOMEPAGE_ADMISSION: '/homepage/admission',
  HOMEPAGE_ADMISSION_FORM: '/homepage/admission/form',
  HOMEPAGE_ABOUT: '/homepage/about-us',
  HOMEPAGE_CLASSES: '/homepage/classes',
  HOMEPAGE_EVENTS: '/homepage/events',
  HOMEPAGE_CONTACT: '/homepage/contact',
  
  // Legacy routes for compatibility
  HOME: '/',
  ADMISSION: '/admission',
  ABOUT: '/about-us',
  CLASSES: '/classes',
  EVENTS: '/events',
  
  // Demo routes
  DEMO_BOOK_STORY: '/demo/book-story',
  DEMO_THEME_TEST: '/demo/theme-test',
};

// =====================================================
// AUTHENTICATION ROUTES - Standalone Pages
// =====================================================
export const AUTH_ROUTES = {
  LOGIN: '/auth/login',
  REGISTER: '/auth/register', // Primary route for registration
  FORGOT_PASSWORD: '/auth/forgot-password',
  RESET_PASSWORD: '/auth/reset-password',
  
  // Legacy routes for compatibility
  LEGACY_LOGIN: '/login',
  LEGACY_SIGNUP: '/signup',
  LEGACY_REGISTER: '/register',
  LEGACY_FORGOT_PASSWORD: '/forgot-password',
  LEGACY_RESET_PASSWORD: '/reset-password',
};

// =====================================================
// TEACHER PROTECTED ROUTES
// =====================================================
export const TEACHER_ROUTES = {
  DASHBOARD: '/user/teacher/dashboard',
  ATTENDANCE: '/user/teacher/attendance',
  CLASS_STUDENTS: '/user/teacher/class/:id/students',
  JOURNAL: '/user/teacher/journal',
  MESSAGES: '/user/teacher/messages',
};

// =====================================================
// PARENT PROTECTED ROUTES
// =====================================================
export const PARENT_ROUTES = {
  DASHBOARD: '/user/parent/dashboard',
  CHILD_PROFILE: '/user/parent/child/:id/profile',
  CALENDAR: '/user/parent/calendar',
  MEALS: '/user/parent/meals',
  GALLERY: '/user/parent/gallery',
  MESSAGES: '/user/parent/messages',
  FEEDBACK: '/user/parent/feedback',
  
  // Legacy route for compatibility
  LEGACY_DASHBOARD: '/parent/dashboard',
};

// =====================================================
// ADMISSION STAFF PROTECTED ROUTES
// =====================================================
export const ADMISSION_ROUTES = {
  DASHBOARD: '/user/admission/dashboard',
  REGISTRATIONS: '/user/admission/registrations',
  REGISTRATION_DETAIL: '/user/admission/registrations/:id',
  REGISTRATION_REVIEW: '/user/admission/registrations/:id/review',
  REPORTS: '/user/admission/reports',
};

// =====================================================
// ADMIN PROTECTED ROUTES
// =====================================================
export const ADMIN_ROUTES = {
  DASHBOARD: '/user/admin/dashboard',
  USERS: '/user/admin/users',
  CLASSES: '/user/admin/classes',
  STATISTICS: '/user/admin/statistics',
  SETTINGS: '/user/admin/settings',
  ADMISSIONS: '/user/admin/admissions',
  
  // Legacy routes for compatibility
  LEGACY_ADMISSION: '/admin/admission',
  LEGACY_CLASSES: '/admin/classes',
};

// =====================================================
// SHARED ROUTES - Available to all authenticated users
// =====================================================
export const SHARED_ROUTES = {
  CALENDAR: '/user/shared/calendar',
  MEALS: '/user/shared/meals',
  GALLERY: '/user/shared/gallery',
  NOTIFICATIONS: '/user/shared/notifications',
};

// =====================================================
// ENROLLMENT ROUTES - For application process
// =====================================================
export const ENROLLMENT_ROUTES = {
  INDEX: '/enrollment',
  APPLICATION: '/enrollment/application',
  MY_APPLICATIONS: '/enrollment/my-applications',
};

// =====================================================
// ERROR & UTILITY ROUTES
// =====================================================
export const ERROR_ROUTES = {
  UNAUTHORIZED: '/unauthorized',
  NOT_FOUND: '*',
};

// =====================================================
// ROUTE HELPERS
// =====================================================

/**
 * Generate login URL with redirect parameter
 * @param {string} redirectPath - Path to redirect after login
 * @param {string} fromPath - Current path where redirect originated
 * @returns {string} Login URL with parameters
 */
export const getLoginURL = (redirectPath = '/', fromPath = '') => {
  const params = new URLSearchParams();
  params.set('redirect', redirectPath);
  
  if (fromPath) {
    params.set('from', fromPath);
  }
  
  return `${AUTH_ROUTES.LOGIN}?${params.toString()}`;
};

/**
 * Check if a route requires authentication
 * @param {string} path - Route path to check
 * @returns {boolean} Whether route requires authentication
 */
export const isProtectedRoute = (path) => {
  const protectedPaths = [
    ...Object.values(TEACHER_ROUTES),
    ...Object.values(PARENT_ROUTES),
    ...Object.values(ADMISSION_ROUTES),
    ...Object.values(ADMIN_ROUTES),
    ...Object.values(SHARED_ROUTES),
    ...Object.values(ENROLLMENT_ROUTES),
  ];
  
  return protectedPaths.some(protectedPath => 
    path.startsWith(protectedPath.replace('/:id', ''))
  );
};

/**
 * Check if a route requires admin/staff role
 * @param {string} path - Route path to check
 * @returns {boolean} Whether route requires admin/staff role
 */
export const isAdminRoute = (path) => {
  return Object.values(ADMIN_ROUTES).some(adminPath => 
    path.startsWith(adminPath.replace('/:id', ''))
  );
};

/**
 * Check if a route requires teacher role
 * @param {string} path - Route path to check
 * @returns {boolean} Whether route requires teacher role
 */
export const isTeacherRoute = (path) => {
  return Object.values(TEACHER_ROUTES).some(teacherPath => 
    path.startsWith(teacherPath.replace('/:id', ''))
  );
};

/**
 * Check if a route requires admission role
 * @param {string} path - Route path to check
 * @returns {boolean} Whether route requires admission role
 */
export const isAdmissionRoute = (path) => {
  return Object.values(ADMISSION_ROUTES).some(admissionPath => 
    path.startsWith(admissionPath.replace('/:id', ''))
  );
};

/**
 * Get the appropriate dashboard route for a user role
 * @param {string} role - User role (teacher, parent, admin, admission)
 * @returns {string} Dashboard route for the role
 */
export const getDashboardRoute = (role) => {
  switch (role?.toLowerCase()) {
    case 'teacher':
      return TEACHER_ROUTES.DASHBOARD;
    case 'parent':
      return PARENT_ROUTES.DASHBOARD;
    case 'admission':
      return ADMISSION_ROUTES.DASHBOARD;
    case 'admin':
      return ADMIN_ROUTES.DASHBOARD;
    default:
      return SHARED_ROUTES.CALENDAR;
  }
};

// Export all routes as a single object for convenience
export const ROUTES = {
  ...PUBLIC_ROUTES,
  ...AUTH_ROUTES,
  ...TEACHER_ROUTES,
  ...PARENT_ROUTES,
  ...ADMISSION_ROUTES,
  ...ADMIN_ROUTES,
  ...SHARED_ROUTES,
  ...ENROLLMENT_ROUTES,
  ...ERROR_ROUTES,
};
