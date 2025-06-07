import { MainTemplate } from "@templates";
import UserLayout from "@/layouts/UserLayout";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { ProtectedRoute } from "@auth/ProtectedRoute.jsx";
import React, { lazy, Suspense } from "react";
import PropTypes from "prop-types";
import { ROUTES, AUTH_ROUTES } from "@/constants/routes.js";

// Lazy-loaded components
const Home = lazy(() => import("@pages/Home"));
// Make sure to use consistent path aliases for auth components
const Login = lazy(() => import("@pages/Login"));
const SignUp = lazy(() => import("@pages/SignUp"));
const ForgotPassword = lazy(() => import("@pages/ForgotPassword"));
const ResetPassword = lazy(() => import("@pages/ResetPassword"));

// Regular pages
const Admission = lazy(() => import("@pages/Admission"));
const Classes = lazy(() => import("@pages/Classes"));
const AboutUs = lazy(() => import("@pages/AboutUs"));
const Events = lazy(() => import("@pages/Events"));
const NotFound = lazy(() => import("@pages/NotFound"));
const BookStoryDemo = lazy(() => import("@pages/BookStoryDemo"));
const ThemeTest = lazy(() => import("@pages/ThemeTest"));
const EnrollmentApplication = lazy(() => import("@pages/EnrollmentApplication"));
const MyApplications = lazy(() => import("@pages/MyApplications"));

// Dashboard components
const ParentDashboard = lazy(() => import("@pages/ParentDashboard"));
const TeacherDashboard = lazy(() => import("@pages/TeacherDashboard"));
const AdmissionDashboard = lazy(() => import("@pages/AdmissionDashboard"));
const AdminDashboard = lazy(() => import("@pages/AdminDashboard"));
const HRDashboard = lazy(() => import("@pages/HRDashboard"));
const EducationDashboard = lazy(() => import("@pages/EducationDashboard"));
const UserProfile = lazy(() => import("@pages/UserProfile"));
const ComingSoon = lazy(() => import("@pages/ComingSoon"));

// Reusable component wrappers
const PageWrapper = ({ children, isPublic = false, requiredRoles = [] }) => {
  const content = (
    <Suspense fallback={<div>Loading...</div>}>
      {children}
    </Suspense>
  );

  if (isPublic) {
    return content;
  }

  const protectedContent = requiredRoles.length > 0 
    ? <ProtectedRoute requiredRoles={requiredRoles}>{content}</ProtectedRoute>
    : <ProtectedRoute>{content}</ProtectedRoute>;

  return (
    <MainTemplate>
      {protectedContent}
    </MainTemplate>
  );
};

// User Layout Wrapper for /user/* routes
const UserPageWrapper = ({ children, requiredRoles = [] }) => {
  const content = (
    <Suspense fallback={<div>Loading...</div>}>
      {children}
    </Suspense>
  );

  const protectedContent = requiredRoles.length > 0 
    ? <ProtectedRoute requiredRoles={requiredRoles}>{content}</ProtectedRoute>
    : <ProtectedRoute>{content}</ProtectedRoute>;

  return (
    <UserLayout>
      {protectedContent}
    </UserLayout>
  );
};

PageWrapper.propTypes = {
  children: PropTypes.node.isRequired,
  isPublic: PropTypes.bool,
  requiredRoles: PropTypes.arrayOf(PropTypes.string),
};

UserPageWrapper.propTypes = {
  children: PropTypes.node.isRequired,
  requiredRoles: PropTypes.arrayOf(PropTypes.string),
};

const PublicPageWrapper = ({ children, withLayout = true }) => {
  // Ensure children is properly wrapped in Suspense
  const content = (
    <Suspense fallback={<div>Loading...</div>}>
      {children}
    </Suspense>
  );

  // Return the content with or without layout
  return withLayout ? <MainTemplate>{content}</MainTemplate> : content;
};

PublicPageWrapper.propTypes = {
  children: PropTypes.node.isRequired,
  withLayout: PropTypes.bool,
};

const router = createBrowserRouter([
  // =====================================================
  // PUBLIC ROUTES (HOMEPAGE) - No Authentication Required
  // =====================================================
  {
    path: ROUTES.HOME,
    element: (
      <PublicPageWrapper>
        <Home />
      </PublicPageWrapper>
    ),
  },
  {
    path: ROUTES.HOMEPAGE,
    element: (
      <PublicPageWrapper>
        <Home />
      </PublicPageWrapper>
    ),
  },
  {
    path: ROUTES.HOMEPAGE_ADMISSION,
    element: (
      <PublicPageWrapper>
        <Admission />
      </PublicPageWrapper>
    ),
  },
  {
    path: ROUTES.HOMEPAGE_ABOUT,
    element: (
      <PublicPageWrapper>
        <AboutUs />
      </PublicPageWrapper>
    ),
  },
  {
    path: ROUTES.HOMEPAGE_CLASSES,
    element: (
      <PublicPageWrapper>
        <Classes />
      </PublicPageWrapper>
    ),
  },
  {
    path: ROUTES.HOMEPAGE_EVENTS,
    element: (
      <PublicPageWrapper>
        <Events />
      </PublicPageWrapper>
    ),
  },
  
  // Legacy public routes for compatibility
  {
    path: ROUTES.ADMISSION,
    element: (
      <PublicPageWrapper>
        <Admission />
      </PublicPageWrapper>
    ),
  },
  {
    path: ROUTES.ABOUT,
    element: (
      <PublicPageWrapper>
        <AboutUs />
      </PublicPageWrapper>
    ),
  },
  {
    path: ROUTES.CLASSES,
    element: (
      <PublicPageWrapper>
        <Classes />
      </PublicPageWrapper>
    ),
  },
  {
    path: ROUTES.EVENTS,
    element: (
      <PublicPageWrapper>
        <Events />
      </PublicPageWrapper>
    ),
  },  // =====================================================
  // AUTHENTICATION ROUTES - Standalone Pages
  // =====================================================
  {
    path: AUTH_ROUTES.LOGIN,
    element: (
      <PublicPageWrapper withLayout={false}>
        <Login />
      </PublicPageWrapper>
    ),
  },  
  {
    path: AUTH_ROUTES.REGISTER,
    element: (
      <PublicPageWrapper withLayout={false}>
        <SignUp />
      </PublicPageWrapper>
    ),
  },  {
    path: AUTH_ROUTES.FORGOT_PASSWORD,
    element: (
      <PublicPageWrapper withLayout={false}>
        <ForgotPassword />
      </PublicPageWrapper>
    ),
  },
  {
    path: AUTH_ROUTES.RESET_PASSWORD,
    element: (
      <PublicPageWrapper withLayout={false}>
        <ResetPassword />
      </PublicPageWrapper>
    ),
  },

  // Legacy auth routes for compatibility
  {
    path: ROUTES.LEGACY_LOGIN,
    element: (
      <PublicPageWrapper withLayout={false}>
        <Login />
      </PublicPageWrapper>
    ),
  },  {
    path: ROUTES.LEGACY_SIGNUP,
    element: (
      <PublicPageWrapper withLayout={false}>
        <SignUp />
      </PublicPageWrapper>
    ),
  },
  {
    path: ROUTES.LEGACY_FORGOT_PASSWORD,
    element: (
      <PublicPageWrapper withLayout={false}>
        <ForgotPassword />
      </PublicPageWrapper>
    ),
  },
  {
    path: ROUTES.LEGACY_RESET_PASSWORD,
    element: (
      <PublicPageWrapper withLayout={false}>
        <ResetPassword />
      </PublicPageWrapper>
    ),
  },
  // =====================================================
  // TEACHER PROTECTED ROUTES
  // =====================================================
  {
    path: "/user/teacher",
    children: [
      {
        path: "dashboard",
        element: (
          <UserPageWrapper requiredRoles={["TEACHER"]}>
            <TeacherDashboard />
          </UserPageWrapper>
        ),
      },
      {        path: "attendance",
        element: (
          <UserPageWrapper requiredRoles={["TEACHER"]}>
            <ComingSoon title="Attendance Management" description="Manage student attendance and daily records." />
          </UserPageWrapper>
        ),
      },
      {
        path: "class/:id/students",
        element: (
          <UserPageWrapper requiredRoles={["TEACHER"]}>
            <ComingSoon title="Class Students" description="View and manage students in your class." />
          </UserPageWrapper>
        ),
      },
      {
        path: "journal",
        element: (
          <UserPageWrapper requiredRoles={["TEACHER"]}>
            <ComingSoon title="Teacher Journal" description="Keep track of daily activities and observations." />
          </UserPageWrapper>
        ),
      },
      {
        path: "messages",
        element: (
          <UserPageWrapper requiredRoles={["TEACHER"]}>
            <ComingSoon title="Teacher Messages" description="Communicate with parents and administration." />
          </UserPageWrapper>
        ),
      },
    ],
  },
  // =====================================================
  // PARENT PROTECTED ROUTES
  // =====================================================
  {
    path: "/user/parent",
    children: [
      {
        path: "dashboard",
        element: (
          <UserPageWrapper requiredRoles={["PARENT"]}>
            <ParentDashboard />
          </UserPageWrapper>
        ),
      },
      {        path: "child/:id/profile",
        element: (
          <UserPageWrapper requiredRoles={["PARENT"]}>
            <ComingSoon title="Child Profile" description="View your child's profile and development progress." />
          </UserPageWrapper>
        ),
      },
      {
        path: "calendar",
        element: (
          <UserPageWrapper requiredRoles={["PARENT"]}>
            <ComingSoon title="Parent Calendar" description="View school calendar and your child's schedule." />
          </UserPageWrapper>
        ),
      },
      {
        path: "meals",
        element: (
          <UserPageWrapper requiredRoles={["PARENT"]}>
            <ComingSoon title="Meals Schedule" description="View weekly meal plans and dietary information." />
          </UserPageWrapper>
        ),
      },
      {
        path: "gallery",
        element: (
          <UserPageWrapper requiredRoles={["PARENT"]}>
            <ComingSoon title="Photo Gallery" description="View photos and videos of your child's activities." />
          </UserPageWrapper>
        ),
      },
      {
        path: "messages",
        element: (
          <UserPageWrapper requiredRoles={["PARENT"]}>
            <ComingSoon title="Parent Messages" description="Communicate with teachers and school staff." />
          </UserPageWrapper>
        ),
      },
      {
        path: "feedback",
        element: (
          <UserPageWrapper requiredRoles={["PARENT"]}>
            <ComingSoon title="Parent Feedback" description="Provide feedback about your child's experience." />
          </UserPageWrapper>
        ),
      },
      {
        path: "enrollment",
        element: (
          <UserPageWrapper requiredRoles={["PARENT"]}>
            <EnrollmentApplication />
          </UserPageWrapper>
        ),
      },
      {
        path: "enrollment/application",
        element: (
          <UserPageWrapper requiredRoles={["PARENT"]}>
            <EnrollmentApplication />
          </UserPageWrapper>
        ),
      },
      {
        path: "enrollment/my-applications",
        element: (
          <UserPageWrapper requiredRoles={["PARENT"]}>
            <MyApplications />
          </UserPageWrapper>
        ),
      },
    ],
  },
  // Legacy parent route for compatibility
  {
    path: "/parent",
    children: [
      {
        path: "dashboard",
        element: (
          <UserPageWrapper requiredRoles={["PARENT"]}>
            <ParentDashboard />
          </UserPageWrapper>
        ),
      },
    ],
  },
  // =====================================================
  // ADMISSION STAFF PROTECTED ROUTES
  // =====================================================
  {
    path: "/user/admission",
    children: [
      {
        path: "dashboard",
        element: (
          <UserPageWrapper requiredRoles={["ADMISSION"]}>
            <AdmissionDashboard />
          </UserPageWrapper>
        ),
      },
      {        path: "registrations",
        element: (
          <UserPageWrapper requiredRoles={["ADMISSION"]}>
            <ComingSoon title="Registrations List" description="View and manage all student registrations." />
          </UserPageWrapper>
        ),
      },
      {
        path: "registrations/:id",
        element: (
          <UserPageWrapper requiredRoles={["ADMISSION"]}>
            <ComingSoon title="Registration Detail" description="View detailed information about a registration." />
          </UserPageWrapper>
        ),
      },
      {
        path: "registrations/:id/review",
        element: (
          <UserPageWrapper requiredRoles={["ADMISSION"]}>
            <ComingSoon title="Registration Review" description="Review and process student applications." />
          </UserPageWrapper>
        ),
      },
      {
        path: "reports",
        element: (
          <UserPageWrapper requiredRoles={["ADMISSION"]}>
            <ComingSoon title="Admission Reports" description="Generate and view admission statistics and reports." />
          </UserPageWrapper>
        ),
      },
    ],
  },
  // =====================================================
  // HR PROTECTED ROUTES
  // =====================================================
  {
    path: "/user/hr",
    children: [
      {
        path: "dashboard",
        element: (
          <UserPageWrapper requiredRoles={["HR"]}>
            <HRDashboard />
          </UserPageWrapper>
        ),
      },
      {
        path: "employees",
        element: (
          <UserPageWrapper requiredRoles={["HR"]}>
            <ComingSoon title="Employee Management" description="Manage staff information and records." />
          </UserPageWrapper>
        ),
      },
      {
        path: "recruitment",
        element: (
          <UserPageWrapper requiredRoles={["HR"]}>
            <ComingSoon title="Recruitment" description="Manage job postings and applications." />
          </UserPageWrapper>
        ),
      },
      {
        path: "reports",
        element: (
          <UserPageWrapper requiredRoles={["HR"]}>
            <ComingSoon title="HR Reports" description="Generate and view HR statistics and reports." />
          </UserPageWrapper>
        ),
      },
    ],
  },
  // =====================================================
  // EDUCATION PROTECTED ROUTES
  // =====================================================
  {
    path: "/user/education",
    children: [
      {
        path: "dashboard",
        element: (
          <UserPageWrapper requiredRoles={["EDUCATION"]}>
            <EducationDashboard />
          </UserPageWrapper>
        ),
      },
      {
        path: "curriculum",
        element: (
          <UserPageWrapper requiredRoles={["EDUCATION"]}>
            <ComingSoon title="Curriculum Management" description="Manage educational programs and curricula." />
          </UserPageWrapper>
        ),
      },
      {
        path: "assessment",
        element: (
          <UserPageWrapper requiredRoles={["EDUCATION"]}>
            <ComingSoon title="Student Assessment" description="Track and evaluate student progress." />
          </UserPageWrapper>
        ),
      },
      {
        path: "resources",
        element: (
          <UserPageWrapper requiredRoles={["EDUCATION"]}>
            <ComingSoon title="Educational Resources" description="Manage learning materials and resources." />
          </UserPageWrapper>
        ),
      },
    ],
  },
  // =====================================================
  // ADMIN PROTECTED ROUTES
  // =====================================================
  {
    path: "/user/admin",
    children: [
      {
        path: "dashboard",
        element: (
          <UserPageWrapper requiredRoles={["ADMIN"]}>
            <AdminDashboard />
          </UserPageWrapper>
        ),
      },
      {        path: "users",
        element: (
          <UserPageWrapper requiredRoles={["ADMIN"]}>
            <ComingSoon title="User Management" description="Manage system users and their permissions." />
          </UserPageWrapper>
        ),
      },
      {
        path: "classes",
        element: (
          <UserPageWrapper requiredRoles={["ADMIN"]}>
            <Classes />
          </UserPageWrapper>
        ),
      },
      {
        path: "statistics",
        element: (
          <UserPageWrapper requiredRoles={["ADMIN"]}>
            <ComingSoon title="Statistics" description="View comprehensive system statistics and analytics." />
          </UserPageWrapper>
        ),
      },
      {
        path: "settings",
        element: (
          <UserPageWrapper requiredRoles={["ADMIN"]}>
            <ComingSoon title="Admin Settings" description="Configure system settings and preferences." />
          </UserPageWrapper>
        ),
      },
      {
        path: "admissions",
        element: (
          <UserPageWrapper requiredRoles={["ADMIN"]}>
            <Admission />
          </UserPageWrapper>
        ),
      },
    ],
  },
  // Legacy admin routes for compatibility
  {
    path: "/admin",
    children: [
      {
        path: "admission",
        element: (
          <UserPageWrapper requiredRoles={["ADMISSION", "ADMIN"]}>
            <Admission />
          </UserPageWrapper>
        ),
      },
      {
        path: "classes",
        element: (
          <UserPageWrapper requiredRoles={["ADMIN"]}>
            <Classes />
          </UserPageWrapper>
        ),
      },
    ],
  },
  // =====================================================
  // SHARED ROUTES - Available to all authenticated users
  // =====================================================
  {
    path: "/user/shared",
    children: [
      {
        path: "profile",
        element: (
          <UserPageWrapper>
            <UserProfile />
          </UserPageWrapper>
        ),
      },
      {        path: "calendar",
        element: (
          <UserPageWrapper>
            <ComingSoon title="Shared Calendar" description="View school-wide calendar and events." />
          </UserPageWrapper>
        ),
      },
      {
        path: "meals",
        element: (
          <UserPageWrapper>
            <ComingSoon title="Shared Meals" description="View meal schedules and nutrition information." />
          </UserPageWrapper>
        ),
      },
      {
        path: "gallery",
        element: (
          <UserPageWrapper>
            <ComingSoon title="Shared Gallery" description="View school photos and activity galleries." />
          </UserPageWrapper>
        ),
      },
      {
        path: "notifications",
        element: (
          <UserPageWrapper>
            <ComingSoon title="Notifications" description="View all system notifications and announcements." />
          </UserPageWrapper>
        ),
      },
    ],
  },

  // =====================================================
  // ENROLLMENT ROUTES - For application process
  // =====================================================
  {
    path: "/enrollment",
    children: [
      {
        index: true,
        element: (
          <PageWrapper>
            <EnrollmentApplication />
          </PageWrapper>
        ),
      },
      {
        path: "application",
        element: (
          <PageWrapper>
            <EnrollmentApplication />
          </PageWrapper>
        ),
      },
      {
        path: "my-applications",
        element: (
          <PageWrapper>
            <MyApplications />
          </PageWrapper>
        ),
      },
    ],
  },

  // =====================================================
  // DEMO & TEST ROUTES - Public Access
  // =====================================================
  {
    path: "/demo",
    children: [
      {
        path: "book-story",
        element: (
          <PublicPageWrapper withLayout={false}>
            <BookStoryDemo />
          </PublicPageWrapper>
        ),
      },
      {
        path: "theme-test",
        element: (
          <PublicPageWrapper>
            <ThemeTest />
          </PublicPageWrapper>
        ),
      },
    ],
  },
  // =====================================================
  // ERROR & FALLBACK ROUTES - Standalone pages without layout
  // =====================================================
  {
    path: ROUTES.UNAUTHORIZED,
    element: (
      <Suspense fallback={<div>Loading...</div>}>
        <NotFound />
      </Suspense>
    ),
  },
  {
    path: "*",
    element: (
      <Suspense fallback={<div>Loading...</div>}>
        <NotFound />
      </Suspense>
    ),
  },// Dashboard for ADMIN, ADMISSION, HR, and EDUCATION roles (with UserLayout)
  {
    path: "/user/dashboard",
    element: (
      <UserPageWrapper>
        <Suspense fallback={<div>Loading...</div>}>
          {React.createElement(lazy(() => import("@pages/UserDashboard")))}
        </Suspense>
      </UserPageWrapper>
    ),
  },
]);

export function AppRouter() {
    return <RouterProvider router={router} />;
}
