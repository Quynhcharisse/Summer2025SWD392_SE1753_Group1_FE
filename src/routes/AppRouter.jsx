import { MainLayout } from "@layouts/MainLayout.jsx";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { ProtectedRoute } from "@auth/ProtectedRoute.jsx";
import { lazy, Suspense } from "react";
import PropTypes from "prop-types";
import { ROUTES, AUTH_ROUTES, PUBLIC_ROUTES } from "@/constants/routes.js";

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
const ComingSoon = lazy(() => import("@pages/ComingSoon"));

// Reusable component wrappers
const PageWrapper = ({ children, isPublic = false, requiredRoles = [] }) => {
  try {
    const content = (
      <Suspense fallback={<div>Loading...</div>}>
        {children}
      </Suspense>
    );

    if (isPublic) {
      return content;
    }

    const protectedContent = requiredRoles.length > 0 
      ? <ProtectedRoute allowedRoles={requiredRoles}>{content}</ProtectedRoute>
      : <ProtectedRoute>{content}</ProtectedRoute>;

    return (
      <MainLayout>
        {protectedContent}
      </MainLayout>
    );
  } catch (error) {
    console.error("Error in PageWrapper:", error);
    return <div>Something went wrong. Please try again.</div>;
  }
};

PageWrapper.propTypes = {
  children: PropTypes.node.isRequired,
  isPublic: PropTypes.bool,
  requiredRoles: PropTypes.arrayOf(PropTypes.string),
};

const PublicPageWrapper = ({ children, withLayout = true }) => {
  try {
    // Ensure children is properly wrapped in Suspense
    const content = (
      <Suspense fallback={<div>Loading...</div>}>
        {children}
      </Suspense>
    );

    // Return the content with or without layout
    return withLayout ? <MainLayout>{content}</MainLayout> : content;
  } catch (error) {
    console.error("Error in PublicPageWrapper:", error);
    return <div>Something went wrong. Please try again.</div>;
  }
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
    path: AUTH_ROUTES.LEGACY_LOGIN,
    element: (
      <PublicPageWrapper withLayout={false}>
        <Login />
      </PublicPageWrapper>
    ),
  },  
  {
    path: AUTH_ROUTES.LEGACY_SIGNUP,
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
          <PageWrapper requiredRoles={["TEACHER"]}>
            <TeacherDashboard />
          </PageWrapper>
        ),
      },
      {        path: "attendance",
        element: (
          <PageWrapper requiredRoles={["TEACHER"]}>
            <ComingSoon title="Attendance Management" description="Manage student attendance and daily records." />
          </PageWrapper>
        ),
      },
      {
        path: "class/:id/students",
        element: (
          <PageWrapper requiredRoles={["TEACHER"]}>
            <ComingSoon title="Class Students" description="View and manage students in your class." />
          </PageWrapper>
        ),
      },
      {
        path: "journal",
        element: (
          <PageWrapper requiredRoles={["TEACHER"]}>
            <ComingSoon title="Teacher Journal" description="Keep track of daily activities and observations." />
          </PageWrapper>
        ),
      },
      {
        path: "messages",
        element: (
          <PageWrapper requiredRoles={["TEACHER"]}>
            <ComingSoon title="Teacher Messages" description="Communicate with parents and administration." />
          </PageWrapper>
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
          <PageWrapper requiredRoles={["PARENT"]}>
            <ParentDashboard />
          </PageWrapper>
        ),
      },
      {        path: "child/:id/profile",
        element: (
          <PageWrapper requiredRoles={["PARENT"]}>
            <ComingSoon title="Child Profile" description="View your child's profile and development progress." />
          </PageWrapper>
        ),
      },
      {
        path: "calendar",
        element: (
          <PageWrapper requiredRoles={["PARENT"]}>
            <ComingSoon title="Parent Calendar" description="View school calendar and your child's schedule." />
          </PageWrapper>
        ),
      },
      {
        path: "meals",
        element: (
          <PageWrapper requiredRoles={["PARENT"]}>
            <ComingSoon title="Meals Schedule" description="View weekly meal plans and dietary information." />
          </PageWrapper>
        ),
      },
      {
        path: "gallery",
        element: (
          <PageWrapper requiredRoles={["PARENT"]}>
            <ComingSoon title="Photo Gallery" description="View photos and videos of your child's activities." />
          </PageWrapper>
        ),
      },
      {
        path: "messages",
        element: (
          <PageWrapper requiredRoles={["PARENT"]}>
            <ComingSoon title="Parent Messages" description="Communicate with teachers and school staff." />
          </PageWrapper>
        ),
      },
      {
        path: "feedback",
        element: (
          <PageWrapper requiredRoles={["PARENT"]}>
            <ComingSoon title="Parent Feedback" description="Provide feedback about your child's experience." />
          </PageWrapper>
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
          <PageWrapper requiredRoles={["PARENT"]}>
            <ParentDashboard />
          </PageWrapper>
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
          <PageWrapper requiredRoles={["ADMISSION"]}>
            <AdmissionDashboard />
          </PageWrapper>
        ),
      },
      {        path: "registrations",
        element: (
          <PageWrapper requiredRoles={["ADMISSION"]}>
            <ComingSoon title="Registrations List" description="View and manage all student registrations." />
          </PageWrapper>
        ),
      },
      {
        path: "registrations/:id",
        element: (
          <PageWrapper requiredRoles={["ADMISSION"]}>
            <ComingSoon title="Registration Detail" description="View detailed information about a registration." />
          </PageWrapper>
        ),
      },
      {
        path: "registrations/:id/review",
        element: (
          <PageWrapper requiredRoles={["ADMISSION"]}>
            <ComingSoon title="Registration Review" description="Review and process student applications." />
          </PageWrapper>
        ),
      },
      {
        path: "reports",
        element: (
          <PageWrapper requiredRoles={["ADMISSION"]}>
            <ComingSoon title="Admission Reports" description="Generate and view admission statistics and reports." />
          </PageWrapper>
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
          <PageWrapper requiredRoles={["ADMIN"]}>
            <AdminDashboard />
          </PageWrapper>
        ),
      },
      {        path: "users",
        element: (
          <PageWrapper requiredRoles={["ADMIN"]}>
            <ComingSoon title="User Management" description="Manage system users and their permissions." />
          </PageWrapper>
        ),
      },
      {
        path: "classes",
        element: (
          <PageWrapper requiredRoles={["ADMIN"]}>
            <Classes />
          </PageWrapper>
        ),
      },
      {
        path: "statistics",
        element: (
          <PageWrapper requiredRoles={["ADMIN"]}>
            <ComingSoon title="Statistics" description="View comprehensive system statistics and analytics." />
          </PageWrapper>
        ),
      },
      {
        path: "settings",
        element: (
          <PageWrapper requiredRoles={["ADMIN"]}>
            <ComingSoon title="Admin Settings" description="Configure system settings and preferences." />
          </PageWrapper>
        ),
      },
      {
        path: "admissions",
        element: (
          <PageWrapper requiredRoles={["ADMIN"]}>
            <Admission />
          </PageWrapper>
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
          <PageWrapper requiredRoles={["ADMISSION", "ADMIN"]}>
            <Admission />
          </PageWrapper>
        ),
      },
      {
        path: "classes",
        element: (
          <PageWrapper requiredRoles={["ADMIN"]}>
            <Classes />
          </PageWrapper>
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
      {        path: "calendar",
        element: (
          <PageWrapper>
            <ComingSoon title="Shared Calendar" description="View school-wide calendar and events." />
          </PageWrapper>
        ),
      },
      {
        path: "meals",
        element: (
          <PageWrapper>
            <ComingSoon title="Shared Meals" description="View meal schedules and nutrition information." />
          </PageWrapper>
        ),
      },
      {
        path: "gallery",
        element: (
          <PageWrapper>
            <ComingSoon title="Shared Gallery" description="View school photos and activity galleries." />
          </PageWrapper>
        ),
      },
      {
        path: "notifications",
        element: (
          <PageWrapper>
            <ComingSoon title="Notifications" description="View all system notifications and announcements." />
          </PageWrapper>
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
  // ERROR & FALLBACK ROUTES
  // =====================================================
  {
    path: ROUTES.UNAUTHORIZED,
    element: (
      <PublicPageWrapper>
        <NotFound />
      </PublicPageWrapper>
    ),
  },
  {
    path: "*",
    element: (
      <PublicPageWrapper>
        <NotFound />
      </PublicPageWrapper>
    ),
  },
]);

export function AppRouter() {
    return <RouterProvider router={router} />;
}
