import React from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { ShieldAlert, LogOut, ArrowLeft, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ProtectedRoute({ children, requireAdmin = true }) {
  const { user, userProfile, isAdmin, loading, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  // Show loading indicator while Firebase auth state & Firestore profile are resolving
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-background text-foreground gap-4">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-10 h-10 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground font-medium">
            Verifying security credentials...
          </p>
        </div>
      </div>
    );
  }

  // Not authenticated -> redirect to login
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // User is authenticated but Firestore profile hasn't loaded yet — show spinner
  if (!userProfile) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-background text-foreground gap-4">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-10 h-10 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground font-medium">
            Loading your profile...
          </p>
        </div>
      </div>
    );
  }

  // Admin route requested but user is not an approved admin
  if (requireAdmin && !isAdmin) {
    const role = userProfile?.role || "user";
    const isApproved = userProfile?.isApproved === true;

    return (
      <div className="flex items-center justify-center min-h-screen bg-background px-4 py-12">
        <div className="w-full max-w-md bg-card border border-border rounded-2xl p-6 sm:p-8 shadow-xl space-y-6 text-center">
          <div className="mx-auto w-14 h-14 rounded-full bg-destructive/10 text-destructive flex items-center justify-center">
            <ShieldAlert className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-foreground tracking-tight">
              Access Restricted
            </h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              This area is restricted to approved LMS Administrators. Your current account permissions do not allow access.
            </p>
          </div>

          <div className="bg-muted/40 border border-border rounded-xl p-4 text-xs space-y-2 text-left">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Account:</span>
              <span className="font-semibold text-foreground truncate max-w-[200px]">
                {user.email}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Assigned Role:</span>
              <span className="font-semibold capitalize text-foreground">{role}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Approval Status:</span>
              <span
                className={`font-semibold ${
                  isApproved ? "text-emerald-500" : "text-amber-500"
                }`}
              >
                {isApproved ? "Approved" : "Pending Approval"}
              </span>
            </div>
          </div>

          <div className="space-y-2 pt-2">
            <Button
              variant="default"
              className="w-full gap-2"
              onClick={() => navigate("/dashboard")}
            >
              <ArrowLeft className="w-4 h-4" />
              Go to Student Portal
            </Button>
            <Button
              variant="outline"
              className="w-full gap-2 text-destructive hover:text-destructive hover:bg-destructive/10"
              onClick={async () => {
                await logout();
                navigate("/login");
              }}
            >
              <LogOut className="w-4 h-4" />
              Sign Out & Switch Account
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return children;
}
