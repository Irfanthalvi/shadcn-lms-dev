import { BrowserRouter as Router, Routes, Route } from "react-router"
import DashboardLayout from "./layouts/DashboardLayout";
import AuthLayout from "./layouts/AuthLayout";
import LoginPage from "./Auth-layout/component";
import Subject from "./student/Subject";
import SubjectChapters from "./components/Chapter";
import Chapter1Test from "./components/Assessment";

function App() {
  return (
    <Routes>
      <Route path="/" element={<AuthLayout><LoginPage /></AuthLayout>}>
        {/* All auth routes under AuthLayout */}
        <Route path="login" element={<LoginPage activeForm="login" />} />
        <Route path="register" element={<LoginPage activeForm="register" />} />
        <Route path="forget" element={<LoginPage activeForm="forget" />} />
        <Route path="otp" element={<LoginPage activeForm="otp" />} />
      </Route>

      {/* Dashboard layout with nested content */}
      <Route path="/subjects" element={<DashboardLayout><Subject /></DashboardLayout>} />
      <Route path="/chapter/:id" element={<DashboardLayout><SubjectChapters /></DashboardLayout>} />
      <Route path="/chapter/assessment/:id" element={<DashboardLayout><Chapter1Test /></DashboardLayout>} />

    </Routes>
  );
}

export default App;
