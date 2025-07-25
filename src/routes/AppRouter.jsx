import ChildList from "@/components/shared/pages/ChildList";
import {AUTH_ROUTES, ROUTES} from "@/constants/routes.js";
import UserLayout from "@/layouts/UserLayout";
import ProtectedRoute from '../auth/ProtectedRoute';
import AddChildForm from "@pages/AddChildForm";
import EditChildForm from "@pages/EditChildForm";
import EnrollmentApplicationList from "@pages/EnrollmentApplicationList";
import Login from "@pages/Login";
import SignUp from "@pages/SignUp";
import {MainTemplate} from "@templates";
import PropTypes from "prop-types";
import {lazy, Suspense} from "react";
import {AuthProvider} from "@contexts/AuthContext";
import {createBrowserRouter, RouterProvider} from "react-router-dom";
import EducationClassManage from "@/components/shared/pages/EducationClassManage";
import ViewClassByEducation from "@/components/shared/pages/ViewClassByEducation";
import ClassSchedule from "@/components/shared/pages/ClassSchedule";
import ClassDetail from "@/components/shared/pages/ClassDetail";
import EducationDashboard from "@pages/EducationDashboard.jsx";

// Lazy import pages
const Home = lazy(() => import("@pages/Home"));
const ForgotPassword = lazy(() => import("@pages/ForgotPassword"));
const ResetPassword = lazy(() => import("@pages/ResetPassword"));
const Admission = lazy(() => import("@pages/Admission"));
const Classes = lazy(() => import("@pages/Classes"));
const AboutUs = lazy(() => import("@pages/AboutUs"));
const Events = lazy(() => import("@pages/Events"));
const NotFound = lazy(() => import("@pages/NotFound"));

const EnrollmentApplication = lazy(() =>
  import("@pages/EnrollmentApplication")
);

const ParentDashboard = lazy(() => import("@pages/ParentDashboard"));
const AdmissionDashboard = lazy(() => import("@pages/AdmissionDashboard"));
const AdminDashboard = lazy(() => import("@pages/AdminDashboard"));
const HRDashboard = lazy(() => import("@pages/HRDashboard"));

const UserProfile = lazy(() => import("@pages/UserProfile"));
const ComingSoon = lazy(() => import("@pages/ComingSoon"));
const EventDetail = lazy(() => import("@pages/EventDetail"));
const EventChildExport = lazy(() => import("@pages/EventChildExport"));

// HR Components
const TeacherList = lazy(() =>
  import("@/components/none-shared/hrComponent/TeacherList")
);
const ParentList = lazy(() =>
  import("@/components/none-shared/hrComponent/ParentList")
);
const HRReports = lazy(() =>
  import("@/components/none-shared/hrComponent/HRReports")
);

const Syllabus = lazy(() => import("@pages/SyllabusManage"));
const Lesson = lazy(() => import("@pages/LessonManage"));
const Event = lazy(() => import("@pages/EventManage"));
const SyllabusAssign = lazy(() => import("@pages/SyllabusAssign"));
const UserDashboard = lazy(() => import("@pages/UserDashboard"));

const TermAdmission = lazy(() =>
  import("@/components/none-shared/admissionComponent/TermAdmission.jsx")
);
const ProcessForm = lazy(() =>
  import("@/components/none-shared/admissionComponent/ProcessForm.jsx")
);
const AdmissionForm = lazy(() =>
  import("@/components/none-shared/parentComponent/AdmissionForm.jsx")
);
const Payment = lazy(() =>
  import("@/components/none-shared/parentComponent/Payment.jsx")
);
const AdmissionChart = lazy(() =>
  import("@/components/none-shared/admissionComponent/AdmissionChart.jsx")
);
const TransactionList = lazy(() =>
  import("@/components/none-shared/admissionComponent/TransactionList.jsx")
);

const PageWrapper = ({ children, isPublic = false, requiredRoles = [] }) => {
  const content = (
    <Suspense fallback={<div>Loading...</div>}>{children}</Suspense>
  );
  if (isPublic) return <AuthProvider>{content}</AuthProvider>;
  const protectedContent =
    requiredRoles.length > 0 ? (
      <ProtectedRoute requiredRoles={requiredRoles}>{content}</ProtectedRoute>
    ) : (
      <ProtectedRoute>{content}</ProtectedRoute>
    );
  return (
    <MainTemplate>
      <AuthProvider>{protectedContent}</AuthProvider>
    </MainTemplate>
  );
};
const UserPageWrapper = ({ children, requiredRoles = [] }) => {
  const content = (
    <Suspense fallback={<div>Loading...</div>}>{children}</Suspense>
  );
  const protectedContent =
    requiredRoles.length > 0 ? (
      <ProtectedRoute requiredRoles={requiredRoles}>{content}</ProtectedRoute>
    ) : (
      <ProtectedRoute>{content}</ProtectedRoute>
    );
  return (
    <UserLayout>
      <AuthProvider>{protectedContent}</AuthProvider>
    </UserLayout>
  );
};
const PublicPageWrapper = ({ children, withLayout = true }) => {
  const content = (
    <Suspense fallback={<div>Loading...</div>}>{children}</Suspense>
  );
  return withLayout ? (
    <MainTemplate>
      <AuthProvider>{content}</AuthProvider>
    </MainTemplate>
  ) : (
    <AuthProvider>{content}</AuthProvider>
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
PublicPageWrapper.propTypes = {
  children: PropTypes.node.isRequired,
  withLayout: PropTypes.bool,
};

// ROUTE CONFIG
const router = createBrowserRouter([
  // === PUBLIC PAGES (Home, About, ...): both modern & legacy ===
  {
    path: ROUTES.HOME,
    element: (
      <PublicPageWrapper pageTitleKey="navigation.home">
        <Home />
      </PublicPageWrapper>
    ),
  },
  {
    path: ROUTES.HOMEPAGE,
    element: (
      <PublicPageWrapper pageTitleKey="navigation.home">
        <Home />
      </PublicPageWrapper>
    ),
  },
  {
    path: ROUTES.HOMEPAGE_ADMISSION,
    element: (
      <PublicPageWrapper pageTitleKey="navigation.admission">
        <Admission />
      </PublicPageWrapper>
    ),
  },
  {
    path: ROUTES.HOMEPAGE_ABOUT,
    element: (
      <PublicPageWrapper pageTitleKey="navigation.about">
        <AboutUs />
      </PublicPageWrapper>
    ),
  },
  {
    path: ROUTES.HOMEPAGE_CLASSES,
    element: (
      <PublicPageWrapper pageTitleKey="navigation.classes">
        <Classes />
      </PublicPageWrapper>
    ),
  },
  {
    path: ROUTES.HOMEPAGE_EVENTS,
    element: (
      <PublicPageWrapper pageTitleKey="navigation.events">
        <Events />
      </PublicPageWrapper>
    ),
  },
  {
    path: "/homepage/events/:id",
    element: (
      <PublicPageWrapper>
        <EventDetail />
      </PublicPageWrapper>
    ),
  },

  // === LEGACY PUBLIC (for compatibility) ===
  // {
  //   path: ROUTES.ADMISSION,
  //   element: (
  //     <PublicPageWrapper>
  //       <Admission />
  //     </PublicPageWrapper>
  //   ),
  // },
  // {
  //   path: ROUTES.ABOUT,
  //   element: (
  //     <PublicPageWrapper>
  //       <AboutUs />
  //     </PublicPageWrapper>
  //   ),
  // },
  // {
  //   path: ROUTES.CLASSES,
  //   element: (
  //     <PublicPageWrapper>
  //       <Classes />
  //     </PublicPageWrapper>
  //   ),
  // },
  // {
  //   path: ROUTES.EVENTS,
  //   element: (
  //     <PublicPageWrapper>
  //       <Events />
  //     </PublicPageWrapper>
  //   ),
  // },

  // === AUTH ROUTES (both current and legacy, no layout) ===
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
  },
  {
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
  {
    path: ROUTES.LEGACY_LOGIN,
    element: (
      <PublicPageWrapper withLayout={false}>
        <Login />
      </PublicPageWrapper>
    ),
  },
  {
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

  // === ENROLLMENT (parent self-service) ===
  {
    path: "/user/parent",
    children: [
      {
        index: true,
        element: (
          <UserPageWrapper requiredRoles={["PARENT"]}>
            <ParentDashboard />
          </UserPageWrapper>
        ),
      },
      {
        path: "dashboard",
        element: (
          <UserPageWrapper requiredRoles={["PARENT"]}>
            <ParentDashboard />
          </UserPageWrapper>
        ),
      },
      {
        path: "child-list",
        element: (
          <UserPageWrapper requiredRoles={["PARENT"]}>
            <ChildList />
          </UserPageWrapper>
        ),
      },
      {
        path: "add-child",
        element: (
          <UserPageWrapper requiredRoles={["PARENT"]}>
            <AddChildForm />
          </UserPageWrapper>
        ),
      },
      {
        path: "edit-child/:childId",
        element: (
          <UserPageWrapper requiredRoles={["PARENT"]}>
            <EditChildForm />
          </UserPageWrapper>
        ),
      },
      {
        path: "enrollment/:studentId",
        element: (
          <UserPageWrapper requiredRoles={["PARENT"]}>
            <EnrollmentApplication />
          </UserPageWrapper>
        ),
      },
      {
        path: "enrollment-list",
        element: (
          <UserPageWrapper requiredRoles={["PARENT"]}>
            <EnrollmentApplicationList />
          </UserPageWrapper>
        ),
      },
      {
        path: "profile",
        element: (
          <UserPageWrapper requiredRoles={["PARENT"]}>
            <UserProfile />
          </UserPageWrapper>
        ),
      },
      {
        path: "payment/result",
        element: (
          <UserPageWrapper requiredRoles={["PARENT"]}>
            <Payment />
          </UserPageWrapper>
        ),
      },
      {
        path: "forms",
        element: (
            <UserPageWrapper requiredRoles={["PARENT"]}>
                <AdmissionForm/>
            </UserPageWrapper>
        ),
    },
      {
        path: "class-schedule",
        element: (
          <UserPageWrapper requiredRoles={["PARENT"]}>
            <ClassSchedule />
          </UserPageWrapper>
        ),
      },
      {
        path: "class-detail/:childId",
        element: (
          <UserPageWrapper requiredRoles={["PARENT"]}>
            <ClassDetail />
            </UserPageWrapper>
        ),
      },
      // Add other routes if needed, e.g.: feedback, messages, notifications...
    ],
  },

  // === USER SHARED (for all roles) ===
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
    ],
  },

  // === USER DASHBOARD entrypoint ===
  {
    path: "/user/dashboard",
    element: (
      <UserPageWrapper>
        <Suspense fallback={<div>Loading...</div>}>
          <UserDashboard />
        </Suspense>
      </UserPageWrapper>
    ),
  },

  // ==== ADMIN ROUTES (all features grouped) ====
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
      {
        path: "users",
        element: (
          <UserPageWrapper requiredRoles={["ADMIN"]}>
            <ComingSoon
              title="User Management"
              description="Manage system users and their permissions."
            />
          </UserPageWrapper>
        ),
      },

      {
        path: "statistics",
        element: (
          <UserPageWrapper requiredRoles={["ADMIN"]}>
            <ComingSoon
              title="Statistics"
              description="View system statistics."
            />
          </UserPageWrapper>
        ),
      },
      {
        path: "settings",
        element: (
          <UserPageWrapper requiredRoles={["ADMIN"]}>
            <ComingSoon
              title="Admin Settings"
              description="Configure settings."
            />
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
  // === LEGACY ADMIN (for compatibility) ===
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

  // ==== EDUCATION ROUTES ====
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
        path: "syllabus",
        element: (
          <UserPageWrapper requiredRoles={["EDUCATION"]}>
            <Syllabus />
          </UserPageWrapper>
        ),
      },
      {
        path: "lesson",
        element: (
          <UserPageWrapper requiredRoles={["EDUCATION"]}>
            <Lesson />
          </UserPageWrapper>
        ),
      },
      {
        path: "event",
        element: (
          <UserPageWrapper requiredRoles={["EDUCATION"]}>
            <Event />
          </UserPageWrapper>
        ),
      },
      {
        path: "syllabus/assignlesson/:id",
        element: (
          <UserPageWrapper requiredRoles={["EDUCATION"]}>
            <SyllabusAssign />
          </UserPageWrapper>
        ),
      },
      {
        path: "class/view/:id",
        element: (
          <UserPageWrapper requiredRoles={["EDUCATION"]}>
            <ViewClassByEducation />
          </UserPageWrapper>
        ),
      },
      {
        path: "classes",
        element: (
          <UserPageWrapper requiredRoles={["EDUCATION"]}>
            <EducationClassManage />
          </UserPageWrapper>
        ),
      },
      {
        path: "event/students/:eventId",
        element: (
          <UserPageWrapper requiredRoles={['EDUCATION']}>
            <EventChildExport />
          </UserPageWrapper>
        ),
      },
    ],
  },

  // ==== HR ROUTES ====
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
        path: "teachers",
        element: (
          <UserPageWrapper requiredRoles={["HR"]}>
            <TeacherList />
          </UserPageWrapper>
        ),
      },
      {
        path: "parents",
        element: (
          <UserPageWrapper requiredRoles={["HR"]}>
            <ParentList />
          </UserPageWrapper>
        ),
      },
      {
        path: "employees",
        element: (
          <UserPageWrapper requiredRoles={["HR"]}>
            <TeacherList />
          </UserPageWrapper>
        ),
      },
     
      {
        path: "reports",
        element: (
          <UserPageWrapper requiredRoles={["HR"]}>
            <HRReports />
          </UserPageWrapper>
        ),
      },
    ],
  },

  // ==== ADMISSION STAFF ROUTES ====
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
      {
        path: "terms",
        element: (
          <UserPageWrapper requiredRoles={["ADMISSION"]}>
            <TermAdmission />
          </UserPageWrapper>
        ),
      },
      {
        path: "chart",
        element: (
          <UserPageWrapper requiredRoles={["ADMISSION"]}>
            <AdmissionChart />
          </UserPageWrapper>
        ),
      },
      {
        path: "forms",
        element: (
          <UserPageWrapper requiredRoles={["ADMISSION"]}>
            <ProcessForm />
          </UserPageWrapper>
        ),
      },
      {
        path: "registrations/:id/review",
        element: (
          <UserPageWrapper requiredRoles={["ADMISSION"]}>
            <ComingSoon
              title="Review Registration"
              description="Review and process registrations."
            />
          </UserPageWrapper>
        ),
      },
      {
        path: "reports",
        element: (
          <UserPageWrapper requiredRoles={["ADMISSION"]}>
            <ComingSoon
              title="Admission Reports"
              description="View admission statistics."
            />
          </UserPageWrapper>
        ),
      },
      {
        path: "transactions",
        element: (
          <UserPageWrapper requiredRoles={["ADMISSION"]}>
            <TransactionList />
          </UserPageWrapper>
        ),
      },
    ],
  },

  // ==== TEACHER ROUTES ====
  {
    path: "/user/teacher",
    children: [
      {
        path: "dashboard",
        element: (
          <UserPageWrapper requiredRoles={["TEACHER"]}>
            <AdminDashboard />
          </UserPageWrapper>
        ),
      },
      {
        path: "users",
        element: (
          <UserPageWrapper requiredRoles={["ADMIN"]}>
            <ComingSoon
              title="User Management"
              description="Manage system users and their permissions."
            />
          </UserPageWrapper>
        ),
      },
      {
        path: "attendance",
        element: (
          <UserPageWrapper requiredRoles={["TEACHER"]}>
            <ComingSoon
              title="Attendance Management"
              description="Manage attendance."
            />
          </UserPageWrapper>
        ),
      },
      {
        path: "class/:id/students",
        element: (
          <UserPageWrapper requiredRoles={["ADMIN"]}>
            <ComingSoon
              title="Statistics"
              description="View comprehensive system statistics and analytics."
            />
          </UserPageWrapper>
        ),
      },
      {
        path: "journal",
        element: (
          <UserPageWrapper requiredRoles={["ADMIN"]}>
            <ComingSoon
              title="Admin Settings"
              description="Configure system settings and preferences."
            />
          </UserPageWrapper>
        ),
      },
      {
        path: "messages",
        element: (
          <UserPageWrapper requiredRoles={["TEACHER"]}>
            <ComingSoon
              title="Teacher Messages"
              description="Communicate with parents/admin."
            />
          </UserPageWrapper>
        ),
      },
    ],
  },

  // ==== PARENT ROUTES ====

  // ==== ERROR ROUTES ====
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
  },
]);

export function AppRouter() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <RouterProvider router={router} />
    </Suspense>
  );
}