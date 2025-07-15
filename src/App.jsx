import { Suspense, lazy, useRef, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import LoadingBar from 'react-top-loading-bar';

// Lazy loaded components
const AuthLayout = lazy(() => import('./layouts/AuthLayout'));
const DashboardLayout = lazy(() => import('./layouts/DashboardLayout'));
const LoginPage = lazy(() => import('./Auth-layout/component'));
const Subject = lazy(() => import('./student/Subject'));
const SubjectChapters = lazy(() => import('./components/Chapter'));
const ChapterAssessment = lazy(() => import('./components/Assessment'));

// Loading bar controller on route change
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

function App() {
  const loadingBarRef = useRef(null);

  return (
    <Router>
      {/* Top loading bar */}
      <LoadingBar color="var(--primary)" ref={loadingBarRef} height={2} shadow={true} />
      <RouteChangeLoader loadingBarRef={loadingBarRef} />

      {/* Lazy loading fallback */}
      <Suspense fallback={<div className="flex items-center justify-center h-screen text-xl">Loading...</div>}>
        <Routes>
          {/* Auth routes inside AuthLayout */}
          <Route path="/" element={<AuthLayout><LoginPage /></AuthLayout>} />
          <Route path="/login" element={<AuthLayout><LoginPage activeForm="login" /></AuthLayout>} />
          <Route path="/register" element={<AuthLayout><LoginPage activeForm="register" /></AuthLayout>} />
          <Route path="/forget" element={<AuthLayout><LoginPage activeForm="forget" /></AuthLayout>} />
          <Route path="/otp" element={<AuthLayout><LoginPage activeForm="otp" /></AuthLayout>} />

          {/* Dashboard routes */}
          <Route path="/subjects" element={<DashboardLayout><Subject /></DashboardLayout>} />
          <Route path="/chapter/:id" element={<DashboardLayout><SubjectChapters /></DashboardLayout>} />
          <Route path="/assessment/:subject/:chapterId" element={<DashboardLayout><ChapterAssessment /></DashboardLayout>} />
        </Routes>
      </Suspense>
    </Router>
  );
}

export default App;
