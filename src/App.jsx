import { Suspense, lazy, useRef, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
  useParams,
} from "react-router-dom";
import LoadingBar from "react-top-loading-bar";
import { LmsProvider } from "@/context/LmsContext";
import NotFound from "@/components/subject/not-found";
import AssessmentPage from "@/components/create-subject-mcqs/assessment-page";
import ChapterAssessment from "@/components/subject/test-subject-assessment";

// Lazy loaded layout components
const AuthLayout = lazy(() => import("@/layouts/auth-layout.jsx"));
const DashboardLayout = lazy(() => import("@/layouts/dashboard-layout.jsx"));
const LoginPage = lazy(() => import("@/Auth-layout/layout.jsx"));

// LMS Pages
const DashboardPage = lazy(() => import("@/pages/DashboardPage.jsx"));
const ClassesPage = lazy(() => import("@/pages/ClassesPage.jsx"));
const ClassDetailPage = lazy(() => import("@/pages/ClassDetailPage.jsx"));
const PapersMasterPage = lazy(() => import("@/pages/PapersMasterPage.jsx"));
const StudentsPage = lazy(() => import("@/pages/StudentsPage.jsx"));
const TeachersPage = lazy(() => import("@/pages/TeachersPage.jsx"));
const ResultsPage = lazy(() => import("@/pages/ResultsPage.jsx"));
const AssignmentsPage = lazy(() => import("@/pages/AssignmentsPage.jsx"));
const StudyMaterialPage = lazy(() => import("@/pages/StudyMaterialPage.jsx"));
const AnnouncementsPage = lazy(() => import("@/pages/AnnouncementsPage.jsx"));
const SettingsPage = lazy(() => import("@/pages/SettingsPage.jsx"));

// Existing Components
const Subject = lazy(() => import("@/student-layout/subject.jsx"));
const Assessment = lazy(() =>
  import("@/student-layout/create-subjects-mcqs.jsx")
);
const SubjectChapters = lazy(() => import("@/components/subject/chapter.jsx"));

// Centralized Titles + Descriptions
const titlesConfig = [
  {
    path: "/",
    title: "LMS Dashboard",
    description: "Overview of your School Learning Management System.",
  },
  {
    path: "/dashboard",
    title: "LMS Dashboard",
    description: "Overview of your School Learning Management System.",
  },
  {
    path: "/classes",
    title: "Classes (8 - 12)",
    description: "Manage classes 8 through 12 and class paper banks.",
  },
  {
    path: "/papers",
    title: "Exam Papers Bank",
    description: "Browse, view, edit and manage assessment papers.",
  },
  {
    path: "/students",
    title: "Students Directory",
    description: "Manage student enrollments and academic performance.",
  },
  {
    path: "/teachers",
    title: "Teachers Directory",
    description: "Faculty directory and subject assignments.",
  },
  {
    path: "/results",
    title: "Examination Results",
    description: "View term results, scoreboards, and grade reports.",
  },
  {
    path: "/assignments",
    title: "Assignments",
    description: "Manage student coursework and project submissions.",
  },
  {
    path: "/study-material",
    title: "Study Material",
    description: "Download curriculum textbooks, notes, and past papers.",
  },
  {
    path: "/announcements",
    title: "Announcements",
    description: "Official school notices and circulars.",
  },
  {
    path: "/settings",
    title: "LMS Settings",
    description: "Configure system themes and academic preferences.",
  },
  {
    path: "/login",
    title: "Login",
    description: "Login to access your School System dashboard.",
  },
  {
    path: "/register",
    title: "Register",
    description: "Create your School System account.",
  },
  {
    path: "/forget",
    title: "Forgot Password",
    description: "Recover your School System account.",
  },
  {
    path: "/otp",
    title: "Verify OTP",
    description: "Verify your identity using OTP.",
  },
  {
    path: "/subjects",
    title: "Subjects",
    description: "Browse all available subjects.",
  },
  {
    path: "/assessment-page",
    title: "Assessment Builder",
    description: "Manage and create assessment page.",
  },
  {
    path: "/create-assessment",
    title: "Create Assessment",
    description: "Manage and create assessments.",
  },
];

// Title Manager Component
function TitleManager() {
  const location = useLocation();
  const params = useParams();

  useEffect(() => {
    const path = location.pathname;
    let title = "LMS School System";
    let description = "School System dashboard and learning platform.";

    // Exact matches first
    const found = titlesConfig.find((item) => item.path === path);
    if (found) {
      title = found.title;
      description = found.description;
    }
    // Dynamic Class Route
    else if (path.startsWith("/classes/")) {
      const classId = path.split("/")[2];
      title = `Class ${classId} Assessment Hub`;
      description = `Exam papers and assessments for Class ${classId}.`;
    }
    // Dynamic Subject Chapters
    else if (path.startsWith("/chapter/")) {
      title = `Chapter ${params.id || ""}`;
      description = `Study materials for chapter ${params.id || ""}.`;
    }
    // Dynamic Assessment
    else if (path.startsWith("/assessment/")) {
      title = "Assessment";
      description = "Take assessments to test your knowledge.";
    }

    document.title = title;

    const metaDescription = document.querySelector("meta[name='description']");
    if (metaDescription) {
      metaDescription.setAttribute("content", description);
    } else {
      const meta = document.createElement("meta");
      meta.name = "description";
      meta.content = description;
      document.head.appendChild(meta);
    }
  }, [location, params]);

  return null;
}

// Route Change Loading Bar
function RouteChangeLoader({ loadingBarRef }) {
  const location = useLocation();

  useEffect(() => {
    loadingBarRef.current?.continuousStart();
    const timeout = setTimeout(() => {
      loadingBarRef.current?.complete();
    }, 300);
    return () => clearTimeout(timeout);
  }, [location]);

  return null;
}

// App Router Wrapper
function AppRoutes({ loadingBarRef }) {
  return (
    <>
      <RouteChangeLoader loadingBarRef={loadingBarRef} />
      <TitleManager />
      <Suspense
        fallback={
          <div className="flex items-center justify-center h-screen text-base text-muted-foreground">
            <div className="flex flex-col items-center gap-3">
              <div className="w-8 h-8 border-3 border-primary border-t-transparent rounded-full animate-spin" />
              <span>Loading LMS Dashboard...</span>
            </div>
          </div>
        }
      >
        <Routes>
          {/* LMS Main Dashboard */}
          <Route
            path="/"
            element={
              <DashboardLayout>
                <DashboardPage />
              </DashboardLayout>
            }
          />
          <Route
            path="/dashboard"
            element={
              <DashboardLayout>
                <DashboardPage />
              </DashboardLayout>
            }
          />

          {/* Classes 8 through 12 Routes */}
          <Route
            path="/classes"
            element={
              <DashboardLayout>
                <ClassesPage />
              </DashboardLayout>
            }
          />
          <Route
            path="/classes/:classId"
            element={
              <DashboardLayout>
                <ClassDetailPage />
              </DashboardLayout>
            }
          />

          {/* Global Papers Bank */}
          <Route
            path="/papers"
            element={
              <DashboardLayout>
                <PapersMasterPage />
              </DashboardLayout>
            }
          />

          {/* Students Directory */}
          <Route
            path="/students"
            element={
              <DashboardLayout>
                <StudentsPage />
              </DashboardLayout>
            }
          />

          {/* Teachers Directory */}
          <Route
            path="/teachers"
            element={
              <DashboardLayout>
                <TeachersPage />
              </DashboardLayout>
            }
          />

          {/* Examination Results */}
          <Route
            path="/results"
            element={
              <DashboardLayout>
                <ResultsPage />
              </DashboardLayout>
            }
          />

          {/* Assignments */}
          <Route
            path="/assignments"
            element={
              <DashboardLayout>
                <AssignmentsPage />
              </DashboardLayout>
            }
          />

          {/* Study Material */}
          <Route
            path="/study-material"
            element={
              <DashboardLayout>
                <StudyMaterialPage />
              </DashboardLayout>
            }
          />

          {/* Announcements */}
          <Route
            path="/announcements"
            element={
              <DashboardLayout>
                <AnnouncementsPage />
              </DashboardLayout>
            }
          />

          {/* Settings */}
          <Route
            path="/settings"
            element={
              <DashboardLayout>
                <SettingsPage />
              </DashboardLayout>
            }
          />

          {/* Existing Student Subject & Chapter Routes */}
          <Route
            path="/subjects"
            element={
              <DashboardLayout>
                <Subject />
              </DashboardLayout>
            }
          />
          <Route
            path="/chapter/:id"
            element={
              <DashboardLayout>
                <SubjectChapters />
              </DashboardLayout>
            }
          />
          <Route
            path="/assessment/:subject/:chapterId"
            element={
              <DashboardLayout>
                <ChapterAssessment />
              </DashboardLayout>
            }
          />
          <Route
            path="/create-assessment"
            element={
              <DashboardLayout>
                <Assessment />
              </DashboardLayout>
            }
          />
          <Route
            path="/assessment-page"
            element={
              <DashboardLayout>
                <AssessmentPage />
              </DashboardLayout>
            }
          />

          {/* Auth Layout Routes */}
          <Route
            path="/login"
            element={
              <AuthLayout>
                <LoginPage activeForm="login" />
              </AuthLayout>
            }
          />
          <Route
            path="/register"
            element={
              <AuthLayout>
                <LoginPage activeForm="register" />
              </AuthLayout>
            }
          />
          <Route
            path="/forget"
            element={
              <AuthLayout>
                <LoginPage activeForm="forget" />
              </AuthLayout>
            }
          />
          <Route
            path="/otp"
            element={
              <AuthLayout>
                <LoginPage activeForm="otp" />
              </AuthLayout>
            }
          />

          {/* 404 Fallback */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </>
  );
}

// Final App component wrapped in LmsProvider
function App() {
  const loadingBarRef = useRef(null);

  return (
    <LmsProvider>
      <Router>
        <LoadingBar
          color="var(--primary)"
          ref={loadingBarRef}
          height={3}
          shadow={true}
        />
        <AppRoutes loadingBarRef={loadingBarRef} />
      </Router>
    </LmsProvider>
  );
}

export default App;
