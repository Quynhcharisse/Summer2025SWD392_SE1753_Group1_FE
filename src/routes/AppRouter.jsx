import ChildList from "@/components/shared/pages/ChildList";
import {AUTH_ROUTES, ROUTES} from "@/constants/routes.js";
import UserLayout from "@/layouts/UserLayout";
import {ProtectedRoute} from "@auth/ProtectedRoute.jsx";
import {MainTemplate} from "@templates";
import PropTypes from "prop-types";
import { lazy, Suspense, useEffect } from "react";
import { createBrowserRouter, RouterProvider, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { routeToTranslationKey } from "@/utils/i18nRoutes.js";
import EditChildForm from "@pages/EditChildForm";
import AddChildForm from "@pages/AddChildForm";
import EnrollmentApplicationList from "@pages/EnrollmentApplicationList";
import 'bootstrap/dist/css/bootstrap.min.css'
import Login from "@pages/Login";
import SignUp from "@pages/SignUp";
import Unauthorized from "@pages/Unauthorized";

// Lazy import pages
const Home = lazy(() => import("@pages/Home"));
const Login = lazy(() => import("@pages/Login"));
const SignUp = lazy(() => import("@pages/SignUp"));
const ForgotPassword = lazy(() => import("@pages/ForgotPassword"));
const ResetPassword = lazy(() => import("@pages/ResetPassword"));
const Admission = lazy(() => import("@pages/Admission"));
const Classes = lazy(() => import("@pages/Classes"));
const AboutUs = lazy(() => import("@pages/AboutUs"));
const Events = lazy(() => import("@pages/Events"));
const NotFound = lazy(() => import("@pages/NotFound"));
const BookStoryDemo = lazy(() => import("@pages/BookStoryDemo"));
const ThemeTest = lazy(() => import("@pages/ThemeTest"));
const EnrollmentApplication = lazy(() =>
    import("@pages/EnrollmentApplication")
);
const MyApplications = lazy(() => import("@pages/MyApplications"));
const ParentDashboard = lazy(() => import("@pages/ParentDashboard"));
const TeacherDashboard = lazy(() => import("@pages/TeacherDashboard"));
const AdmissionDashboard = lazy(() => import("@pages/AdmissionDashboard"));
const AdminDashboard = lazy(() => import("@pages/AdminDashboard"));
const HRDashboard = lazy(() => import("@pages/HRDashboard"));
const EducationDashboard = lazy(() => import("@pages/EducationDashboard"));
const UserProfile = lazy(() => import("@pages/UserProfile"));
const ComingSoon = lazy(() => import("@pages/ComingSoon"));
const EventDetail = lazy(() => import("@pages/EventDetail"));


const Syllabus = lazy(() => import("@pages/SyllabusManage"));
const Lesson = lazy(() => import("@pages/LessonManage"));
const Event = lazy(() => import("@pages/EventManage"));
const SyllabusAssign = lazy(() => import("@pages/SyllabusAssign"));

const UserDashboard = lazy(() => import("@pages/UserDashboard"));

const TermAdmission = lazy(() => import("@/components/none-shared/admissionComponent/TermAdmission"));
const ProcessForm = lazy(() => import("@/components/none-shared/admissionComponent/ProcessForm.jsx"));
const AdmissionForm = lazy(() => import("@/components/none-shared/parentComponent/AdmissionForm.jsx"));
const Payment = lazy(() => import("@/components/none-shared/parentComponent/Payment.jsx"));


const PageWrapper = ({ children, isPublic = false, requiredRoles = [] }) => {
  const content = (
      <Suspense fallback={<div>Loading...</div>}>{children}</Suspense>
  );
  if (isPublic) return content;
  const protectedContent =
      requiredRoles.length > 0 ? (
          <ProtectedRoute allowedRoles={requiredRoles}>{content}</ProtectedRoute>
      ) : (
          <ProtectedRoute>{content}</ProtectedRoute>
      );
  return <MainTemplate>{protectedContent}</MainTemplate>;
};
const UserPageWrapper = ({ children, requiredRoles = [] }) => {
  const content = (
      <Suspense fallback={<div>Loading...</div>}>{children}</Suspense>
  );
  const protectedContent =
      requiredRoles.length > 0 ? (
          <ProtectedRoute allowedRoles={requiredRoles}>{content}</ProtectedRoute>
      ) : (
          <ProtectedRoute>{content}</ProtectedRoute>
      );
  return <UserLayout>{protectedContent}</UserLayout>;
};
const PublicPageWrapper = ({ children, withLayout = true, isLoginPage = false, pageTitleKey }) => {
  const { t } = useTranslation('home');
  const location = useLocation();
  
  // Update the page title based on the translation key or route
  useEffect(() => { 
    let title = "Sunshine Preschool";
    
    if (pageTitleKey) {
      title = t(pageTitleKey) + " - " + title;
    } else {
      // Fallback to route path mapping if no explicit title key provided
      const path = location.pathname;
      const translationKey = routeToTranslationKey[path];
      if (translationKey) {
        title = t(translationKey) + " - " + title;
      }
    }
    
    document.title = title;
  }, [location.pathname, pageTitleKey, t]);
  
  const content = isLoginPage
    ? children
    : <Suspense fallback={<div>Loading...</div>}>{children}</Suspense>;
  return withLayout ? <MainTemplate>{content}</MainTemplate> : content;
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
  isLoginPage: PropTypes.bool,
  pageTitleKey: PropTypes.string,
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
  {
    path: ROUTES.ADMISSION,
    element: (
      <PublicPageWrapper pageTitleKey="navigation.admission">
        <Admission />
      </PublicPageWrapper>
    ),
  },
  {
    path: ROUTES.ABOUT,
    element: (
      <PublicPageWrapper pageTitleKey="navigation.about">
        <AboutUs />
      </PublicPageWrapper>
    ),
  },
  {
    path: ROUTES.CLASSES,
    element: (
      <PublicPageWrapper pageTitleKey="navigation.classes">
        <Classes />
      </PublicPageWrapper>
    ),
  },
  {
    path: ROUTES.EVENTS,
    element: (
      <PublicPageWrapper pageTitleKey="navigation.events">
        <Events />
      </PublicPageWrapper>
    ),
  },

  // === AUTH ROUTES (both current and legacy, no layout) ===
  {
    path: AUTH_ROUTES.LOGIN,
    element: (
      <PublicPageWrapper withLayout={false} isLoginPage>
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
      <PublicPageWrapper withLayout={false} isLoginPage>
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

  // === DEMO/TEST ===
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
                  <Payment/>
              </UserPageWrapper>
          )
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
        path: "calendar",
        element: (
          <UserPageWrapper>
            <ComingSoon
              title="Shared Calendar"
              description="View school-wide calendar and events."
            />
          </UserPageWrapper>
        ),
      },
      {
        path: "meals",
        element: (
          <UserPageWrapper>
            <ComingSoon
              title="Shared Meals"
              description="View meal schedules and nutrition information."
            />
          </UserPageWrapper>
        ),
      },
      {
        path: "gallery",
        element: (

          <UserPageWrapper>
            <ComingSoon
              title="Shared Gallery"
              description="View school photos and activity galleries."

            />
          </UserPageWrapper>
        ),
      },
      {
        path: "notifications",
        element: (

          <UserPageWrapper>
            <ComingSoon
              title="Notifications"
              description="View all system notifications and announcements."
            />

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
                    <UserDashboard/>
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
                        <AdminDashboard/>
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
                path: "classes",
                element: (
                    <UserPageWrapper requiredRoles={["ADMIN"]}>
                        <Classes/>
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
                        <Admission/>
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
                        <Admission/>
                    </UserPageWrapper>
                ),
            },
            {
                path: "classes",
                element: (
                    <UserPageWrapper requiredRoles={["ADMIN"]}>
                        <Classes/>
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
        path: "",
        element: (
          <UserPageWrapper requiredRoles={["EDUCATION"]}>
            <ComingSoon
              title="Student Assessment"
              description="Track and evaluate student progress."

            />
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
        path: "employees",
        element: (
          <UserPageWrapper requiredRoles={["HR"]}>
            <ComingSoon
              title="Employee Management"

              description="Manage staff information."

            />
          </UserPageWrapper>
        ),
      },
      {
        path: "recruitment",
        element: (
          <UserPageWrapper requiredRoles={["HR"]}>
            <ComingSoon
              title="Recruitment"

              description="Manage job postings."

            />
          </UserPageWrapper>
        ),
      },
      {
        path: "reports",
        element: (
          <UserPageWrapper requiredRoles={["HR"]}>
            <ComingSoon
              title="HR Reports"

              description="View HR statistics and reports."

            />
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
            <TeacherDashboard />

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

          <UserPageWrapper requiredRoles={["TEACHER"]}>
            <ComingSoon
              title="Class Students"
              description="Manage students in your class."

            />
          </UserPageWrapper>
        ),
      },
      {
        path: "journal",
        element: (

          <UserPageWrapper requiredRoles={["TEACHER"]}>
            <ComingSoon
              title="Teacher Journal"
              description="Daily activities and observations."

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
      {

        path: "child/:id/profile",

        element: (
          <UserPageWrapper requiredRoles={["PARENT"]}>
            <ComingSoon
              title="Child Profile"
              description="View your child's progress."
            />
          </UserPageWrapper>
        ),
      },
      {
        path: "calendar",
        element: (
          <UserPageWrapper requiredRoles={["PARENT"]}>
            <ComingSoon
              title="Parent Calendar"
              description="Your child's schedule."
            />
          </UserPageWrapper>
        ),
      },
      {
        path: "forms",
        element: (
          <UserPageWrapper requiredRoles={["PARENT"]}>
            <AdmissionForm />
          </UserPageWrapper>
        ),
      },
      {
        path: "gallery",
        element: (
          <UserPageWrapper requiredRoles={["PARENT"]}>
            <ComingSoon
              title="Photo Gallery"
              description="Photos of activities."
            />
          </UserPageWrapper>
        ),
      },
      {
        path: "messages",
        element: (
          <UserPageWrapper requiredRoles={["PARENT"]}>
            <ComingSoon
              title="Parent Messages"
              description="Communicate with teachers."
            />
          </UserPageWrapper>
        ),
      },
      {
        path: "feedback",
        element: (
          <UserPageWrapper requiredRoles={["PARENT"]}>
            <ComingSoon
              title="Parent Feedback"
              description="Provide feedback."
            />
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
      {
        path: "admission",
        element: (
          <UserPageWrapper requiredRoles={["PARENT"]}>
            <Admission />
          </UserPageWrapper>
        ),
      },
    ],
  }, // === LEGACY PARENT (compatibility) ===
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
      {
        path: "admission",
        element: (
          <UserPageWrapper requiredRoles={["PARENT"]}>
            <Admission />
          </UserPageWrapper>
        ),
      },
    ],
  },

  // ==== ERROR ROUTES ====
  {
    path: ROUTES.UNAUTHORIZED,
    element: (
      <Unauthorized />
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
    return <RouterProvider router={router}/>;
}
