import { Suspense, lazy, useRef, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
  useParams,
} from "react-router-dom";
import LoadingBar from "react-top-loading-bar";
import NotFound from "@/components/subject/not-found";
import AssessmentPage from "@/components/create-subject-mcqs/assessment-page";
import ChapterAssessment from "@/components/subject/test-subject-assessment";

// Lazy loaded components
const AuthLayout = lazy(() => import("@/layouts/auth-layout"));
const DashboardLayout = lazy(() => import("@/layouts/dashboard-layout"));
const LoginPage = lazy(() => import("@/auth-layout/component"));
const Subject = lazy(() => import("@/student-layout/subject"));
const Assessment = lazy(() => import("@/student-layout/create-subjects-mcqs"));
const SubjectChapters = lazy(() => import("@/components/subject/chapter"));

// 📌 Centralized Titles + Descriptions
const titlesConfig = [
  {
    path: "/",
    title: "Login",
    description: "Login to access your School System dashboard.",
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
    title: "Assessment Page",
    description: "Manage and create assessment page.",
  },
  {
    path: "/create-assessment",
    title: "Create-Assessment",
    description: "Manage and create assessments.",
  },
];

// 📌 Title Manager Component
function TitleManager() {
  const location = useLocation();
  const params = useParams();

  useEffect(() => {
    const path = location.pathname;
    let title = "School System";
    let description = "School System dashboard and learning platform.";

    // Exact matches first
    const found = titlesConfig.find((item) => item.path === path);
    if (found) {
      title = found.title;
      description = found.description;
    }

    // Dynamic routes
    else if (path.startsWith("/chapter/")) {
      title = `Chapter ${params.id || ""}`;
      description = `Study materials for chapter ${params.id || ""}.`;
    } else if (path.startsWith("/assessment/")) {
      title = "Assessment";
      description = "Take assessments to test your knowledge.";
    }

    // ✅ Set document.title
    document.title = title;

    // ✅ Update meta description
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

// 📌 Route Change Loading Bar
function RouteChangeLoader({ loadingBarRef }) {
  const location = useLocation();

  useEffect(() => {
    loadingBarRef.current?.continuousStart();
    const timeout = setTimeout(() => {
      loadingBarRef.current?.complete();
    }, 400);
    return () => clearTimeout(timeout);
  }, [location]);

  return null;
}

// 📌 App Router Wrapper
function AppRoutes({ loadingBarRef }) {
  return (
    <>
      <RouteChangeLoader loadingBarRef={loadingBarRef} />
      <TitleManager />
      <Suspense
        fallback={
          <div className="flex items-center justify-center h-screen text-xl">
            Loading...
          </div>
        }
      >
        <Routes>
          <Route
            path="/"
            element={
              <AuthLayout>
                <LoginPage />
              </AuthLayout>
            }
          />
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
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </>
  );
}

// ✅ Final App component
function App() {
  const loadingBarRef = useRef(null);

  return (
    <Router>
      <LoadingBar
        color="var(--primary)"
        ref={loadingBarRef}
        height={2}
        shadow={true}
      />
      <AppRoutes loadingBarRef={loadingBarRef} />
    </Router>
  );
}

export default App;
