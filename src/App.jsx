import { Suspense, lazy, useRef, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, useParams } from 'react-router-dom';
import LoadingBar from 'react-top-loading-bar';

// Lazy loaded components
const AuthLayout = lazy(() => import('./layouts/AuthLayout'));
const DashboardLayout = lazy(() => import('./layouts/DashboardLayout'));
const LoginPage = lazy(() => import('./Auth-layout/component'));
const Subject = lazy(() => import('./student/Subject'));
const Listing = lazy(() => import('./student/Listing'));
const Profile = lazy(() => import('./components/Profile'));
const SubjectChapters = lazy(() => import('./components/Chapter'));
const ChapterAssessment = lazy(() => import('./components/Assessment'));

// 📌 Title Manager Component (Inline)
function TitleManager() {
  const location = useLocation();
  const params = useParams();

  useEffect(() => {
    const path = location.pathname;
    let title = "School System";

    if (path === "/" || path === "/login") title = "Login";
    else if (path === "/register") title = "Register";
    else if (path === "/forget") title = "Forgot Password";
    else if (path === "/otp") title = "Verify OTP";
    else if (path === "/subjects") title = "Subjects";
    else if (path.startsWith("/chapter/")) title = `Chapter `;
    else if (path.startsWith("/assessment/")) title = `Assessment`;

    document.title = title;
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

// 📌 App Router Wrapper (required to use `useLocation`)
function AppRoutes({ loadingBarRef }) {
  return (
    <>
      <RouteChangeLoader loadingBarRef={loadingBarRef} />
      <TitleManager />
      <Suspense fallback={<div className="flex items-center justify-center h-screen text-xl">Loading...</div>}>
        <Routes>
          <Route path="/" element={<AuthLayout><LoginPage /></AuthLayout>} />
          <Route path="/login" element={<AuthLayout><LoginPage activeForm="login" /></AuthLayout>} />
          <Route path="/register" element={<AuthLayout><LoginPage activeForm="register" /></AuthLayout>} />
          <Route path="/forget" element={<AuthLayout><LoginPage activeForm="forget" /></AuthLayout>} />
          <Route path="/otp" element={<AuthLayout><LoginPage activeForm="otp" /></AuthLayout>} />
          <Route path="/subjects" element={<DashboardLayout><Subject /></DashboardLayout>} />
          <Route path="/chapter/:id" element={<DashboardLayout><SubjectChapters /></DashboardLayout>} />
          <Route path="/assessment/:subject/:chapterId" element={<DashboardLayout><ChapterAssessment /></DashboardLayout>} />
          <Route path="/listing" element={<DashboardLayout><Listing /></DashboardLayout>} />
          <Route path="/profile" element={<Profile />} />
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
      <LoadingBar color="var(--primary)" ref={loadingBarRef} height={2} shadow={true} />
      <AppRoutes loadingBarRef={loadingBarRef} />
    </Router>
  );
}

export default App;
