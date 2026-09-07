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
import ErrorBoundary from "@/components/ErrorBoundary";

// Lazy loaded layout components
const DashboardLayout = lazy(() => import("@/layouts/dashboard-layout.jsx"));
const LoginPage = lazy(() => import("@/Auth-layout/layout.jsx"));

// LMS Pages
const DashboardPage = lazy(() => import("@/pages/DashboardPage.jsx"));
const ClassesPage = lazy(() => import("@/pages/ClassesPage.jsx"));
const ClassSubjectsPage = lazy(() => import("@/pages/ClassSubjectsPage.jsx"));
const SubjectBooksPage = lazy(() => import("@/pages/SubjectBooksPage.jsx"));
const SubjectChaptersPage = lazy(() => import("@/pages/SubjectChaptersPage.jsx"));
const ChapterContentPage = lazy(() => import("@/pages/ChapterContentPage.jsx"));
const ClassQuizPage = lazy(() => import("@/pages/ClassQuizPage.jsx"));
const StudentsPage = lazy(() => import("@/pages/StudentsPage.jsx"));
const ProfilePage = lazy(() => import("@/pages/ProfilePage.jsx"));
const ProgressPage = lazy(() => import("@/pages/ProgressPage.jsx"));
const QuizzesPage = lazy(() => import("@/pages/QuizzesPage.jsx"));
const AnalyticsPage = lazy(() => import("@/pages/AnalyticsPage.jsx"));
const LeaderboardPage = lazy(() => import("@/pages/LeaderboardPage.jsx"));
const AssignmentsPage = lazy(() => import("@/pages/AssignmentsPage.jsx"));
const AnnouncementsPage = lazy(() => import("@/pages/AnnouncementsPage.jsx"));
const StudyMaterialPage = lazy(() => import("@/pages/StudyMaterialPage.jsx"));
const ResultsPage = lazy(() => import("@/pages/ResultsPage.jsx"));
const SettingsPage = lazy(() => import("@/pages/SettingsPage.jsx"));
const BooksPage = lazy(() => import("@/pages/BooksPage.jsx"));
const ChaptersPage = lazy(() => import("@/pages/ChaptersPage.jsx"));

// Dynamic Page Titles Manager
function TitleManager() {
  const location = useLocation();

  useEffect(() => {
    const path = location.pathname;
    let title = "LMS Academy";

    if (path === "/" || path === "/dashboard") {
      title = "Dashboard — LMS Academy";
    } else if (path === "/classes") {
      title = "Classes — LMS Academy";
    } else if (path.includes("/subjects") && path.includes("/chapters") && path.includes("/quiz")) {
      title = "Quiz Assessment — LMS Academy";
    } else if (path.includes("/content")) {
      title = "Chapter Learning Content — LMS Academy";
    } else if (path.includes("/books")) {
      title = "Sindh Board Textbooks — LMS Academy";
    } else if (path.includes("/subjects") && path.includes("/chapters")) {
      title = "Chapters — LMS Academy";
    } else if (path.includes("/subjects")) {
      title = "Subjects — LMS Academy";
    } else if (path === "/students") {
      title = "Student Directory — LMS Academy";
    } else if (path === "/quizzes") {
      title = "Quizzes Bank — LMS Academy";
    } else if (path === "/progress") {
      title = "Progress & Performance — LMS Academy";
    } else if (path === "/analytics") {
      title = "Analytics & Reports — LMS Academy";
    } else if (path === "/leaderboard") {
      title = "Leaderboard — LMS Academy";
    } else if (path === "/assignments") {
      title = "Assignments — LMS Academy";
    } else if (path === "/announcements") {
      title = "Notice Board — LMS Academy";
    } else if (path === "/materials" || path === "/study-materials") {
      title = "Study Materials — LMS Academy";
    } else if (path === "/results") {
      title = "Examination Results — LMS Academy";
    } else if (path === "/settings") {
      title = "Settings — LMS Academy";
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
      <ErrorBoundary>
        <Suspense
          fallback={
            <div className="flex items-center justify-center h-screen text-base text-muted-foreground bg-background">
              <div className="flex flex-col items-center gap-3">
                <div className="w-9 h-9 border-3 border-primary border-t-transparent rounded-full animate-spin" />
                <span className="text-xs font-semibold tracking-wide">Loading LMS Portal...</span>
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

          {/* Academic Classes Hierarchy: Class -> Subject -> Book -> Chapters -> Content */}
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

          {/* Sindh Board Books */}
          <Route
            path="/classes/:classId/subjects/:subjectId/books"
            element={
              <ProtectedRoute requireAdmin={false}>
                <DashboardLayout>
                  <SubjectBooksPage />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />

          {/* Book Chapters */}
          <Route
            path="/classes/:classId/subjects/:subjectId/books/:bookId/chapters"
            element={
              <ProtectedRoute requireAdmin={false}>
                <DashboardLayout>
                  <SubjectChaptersPage />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />

          {/* Direct Chapters Route (backward compatible) */}
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

          {/* Chapter Content (Learning Outcomes, Theory, Formulas, STBB Notes) */}
          <Route
            path="/classes/:classId/subjects/:subjectId/books/:bookId/chapters/:chapterId/content"
            element={
              <ProtectedRoute requireAdmin={false}>
                <DashboardLayout>
                  <ChapterContentPage />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/classes/:classId/subjects/:subjectId/chapters/:chapterId/content"
            element={
              <ProtectedRoute requireAdmin={false}>
                <DashboardLayout>
                  <ChapterContentPage />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />

          {/* Chapter Assessment Quiz (Both direct and book-nested routes) */}
          <Route
            path="/classes/:classId/subjects/:subjectId/books/:bookId/chapters/:chapterId/quiz"
            element={
              <ProtectedRoute requireAdmin={false}>
                <DashboardLayout>
                  <ClassQuizPage />
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

          {/* Sindh Board Books & Chapters Directory Pages */}
          <Route
            path="/books"
            element={
              <ProtectedRoute requireAdmin={false}>
                <DashboardLayout>
                  <BooksPage />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/chapters"
            element={
              <ProtectedRoute requireAdmin={false}>
                <DashboardLayout>
                  <ChaptersPage />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />

          {/* Subjects Overview */}
          <Route
            path="/subjects"
            element={
              <ProtectedRoute requireAdmin={false}>
                <DashboardLayout>
                  <ClassSubjectsPage />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />

          {/* Quizzes Bank */}
          <Route
            path="/quizzes"
            element={
              <ProtectedRoute requireAdmin={false}>
                <DashboardLayout>
                  <QuizzesPage />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />

          {/* Student Progress & Performance */}
          <Route
            path="/progress"
            element={
              <ProtectedRoute requireAdmin={false}>
                <DashboardLayout>
                  <ProgressPage />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />

          {/* Admin Analytics */}
          <Route
            path="/analytics"
            element={
              <ProtectedRoute requireAdmin={true}>
                <DashboardLayout>
                  <AnalyticsPage />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />

          {/* Leaderboard */}
          <Route
            path="/leaderboard"
            element={
              <ProtectedRoute requireAdmin={false}>
                <DashboardLayout>
                  <LeaderboardPage />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />

          {/* Assignments */}
          <Route
            path="/assignments"
            element={
              <ProtectedRoute requireAdmin={false}>
                <DashboardLayout>
                  <AssignmentsPage />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />

          {/* Announcements */}
          <Route
            path="/announcements"
            element={
              <ProtectedRoute requireAdmin={false}>
                <DashboardLayout>
                  <AnnouncementsPage />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />

          {/* Study Materials */}
          <Route
            path="/materials"
            element={
              <ProtectedRoute requireAdmin={false}>
                <DashboardLayout>
                  <StudyMaterialPage />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/study-materials"
            element={<Navigate to="/materials" replace />}
          />

          {/* Examination Results */}
          <Route
            path="/results"
            element={
              <ProtectedRoute requireAdmin={false}>
                <DashboardLayout>
                  <ResultsPage />
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

          {/* Settings */}
          <Route
            path="/settings"
            element={
              <ProtectedRoute requireAdmin={false}>
                <DashboardLayout>
                  <SettingsPage />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />

          {/* Authentication Routes */}
          <Route path="/login" element={<LoginPage defaultForm="login" />} />
          <Route path="/register" element={<LoginPage defaultForm="register" />} />
          <Route path="/forget" element={<LoginPage defaultForm="forget" />} />

          {/* Fallback 404 Route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
        </Suspense>
      </ErrorBoundary>
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
