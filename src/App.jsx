import { Suspense, lazy, useRef, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
  Navigate,
} from "react-router-dom";
import LoadingBar from "react-top-loading-bar";
import { LmsProvider } from "@/context/LmsContext";
import { AuthProvider } from "@/context/AuthContext";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import NotFound from "@/components/subject/not-found";

// Lazy loaded layout components
const DashboardLayout = lazy(() => import("@/layouts/dashboard-layout.jsx"));
const LoginPage = lazy(() => import("@/Auth-layout/layout.jsx"));

// LMS Pages
const DashboardPage = lazy(() => import("@/pages/DashboardPage.jsx"));
const ClassesPage = lazy(() => import("@/pages/ClassesPage.jsx"));
const ClassSubjectsPage = lazy(() => import("@/pages/ClassSubjectsPage.jsx"));
const SubjectChaptersPage = lazy(() => import("@/pages/SubjectChaptersPage.jsx"));
const ClassQuizPage = lazy(() => import("@/pages/ClassQuizPage.jsx"));
const StudentsPage = lazy(() => import("@/pages/StudentsPage.jsx"));
const ProfilePage = lazy(() => import("@/pages/ProfilePage.jsx"));

// Dynamic Page Titles Manager
function TitleManager() {
  const location = useLocation();

  useEffect(() => {
    const path = location.pathname;
    let title = "LMS Portal";

    if (path === "/" || path === "/dashboard") {
      title = "Dashboard — LMS Academy";
    } else if (path === "/classes") {
      title = "Classes — LMS Academy";
    } else if (path.includes("/subjects") && path.includes("/chapters") && path.includes("/quiz")) {
      title = "Quiz Assessment — LMS Academy";
    } else if (path.includes("/subjects") && path.includes("/chapters")) {
      title = "Chapters — LMS Academy";
    } else if (path.includes("/subjects")) {
      title = "Subjects — LMS Academy";
    } else if (path === "/students") {
      title = "Students Directory — LMS Academy";
    } else if (path === "/profile") {
      title = "Profile — LMS Academy";
    } else if (path === "/login") {
      title = "Sign In — LMS Academy";
    }

    document.title = title;
  }, [location]);

  return null;
}

// Route Change Loading Bar
function RouteChangeLoader({ loadingBarRef }) {
  const location = useLocation();

  useEffect(() => {
    loadingBarRef.current?.continuousStart();
    const timeout = setTimeout(() => {
      loadingBarRef.current?.complete();
    }, 250);
    return () => clearTimeout(timeout);
  }, [location, loadingBarRef]);

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
              <span>Loading Portal...</span>
            </div>
          </div>
        }
      >
        <Routes>
          {/* Main Dashboard (Both Admin & Student) */}
          <Route
            path="/"
            element={
              <ProtectedRoute requireAdmin={false}>
                <DashboardLayout>
                  <DashboardPage />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute requireAdmin={false}>
                <DashboardLayout>
                  <DashboardPage />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />

          {/* Academic Classes Hierarchy */}
          <Route
            path="/classes"
            element={
              <ProtectedRoute requireAdmin={false}>
                <DashboardLayout>
                  <ClassesPage />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/classes/:classId/subjects"
            element={
              <ProtectedRoute requireAdmin={false}>
                <DashboardLayout>
                  <ClassSubjectsPage />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/classes/:classId/subjects/:subjectId/chapters"
            element={
              <ProtectedRoute requireAdmin={false}>
                <DashboardLayout>
                  <SubjectChaptersPage />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/classes/:classId/subjects/:subjectId/chapters/:chapterId/quiz"
            element={
              <ProtectedRoute requireAdmin={false}>
                <DashboardLayout>
                  <ClassQuizPage />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />

          {/* Admin Only: Students Directory */}
          <Route
            path="/students"
            element={
              <ProtectedRoute requireAdmin={true}>
                <DashboardLayout>
                  <StudentsPage />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />

          {/* User Profile */}
          <Route
            path="/profile"
            element={
              <ProtectedRoute requireAdmin={false}>
                <DashboardLayout>
                  <ProfilePage />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />

          {/* Legacy Subject Shortcut */}
          <Route
            path="/subjects"
            element={<Navigate to="/classes" replace />}
          />

          {/* Authentication Routes */}
          <Route path="/login" element={<LoginPage defaultForm="login" />} />
          <Route path="/register" element={<LoginPage defaultForm="register" />} />
          <Route path="/forget" element={<LoginPage defaultForm="forget" />} />

          {/* Fallback 404 Route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </>
  );
}

export default function App() {
  const loadingBarRef = useRef(null);

  return (
    <Router>
      <AuthProvider>
        <LmsProvider>
          <LoadingBar color="var(--primary)" ref={loadingBarRef} height={3} />
          <AppRoutes loadingBarRef={loadingBarRef} />
        </LmsProvider>
      </AuthProvider>
    </Router>
  );
}
