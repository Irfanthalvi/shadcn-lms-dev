import React, { useState } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import {
  LayoutDashboard,
  GraduationCap,
  Users,
  HelpCircle,
  BarChart3,
  Menu,
  X,
  BookOpen,
  FileText,
  Bell,
  Trophy,
  Award,
  Settings,
  User,
  LogOut,
  Sparkles,
  ChevronRight,
  Layers,
} from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";

export default function MobileNav() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, userProfile, isAdmin, logout } = useAuth();
  const [drawerOpen, setDrawerOpen] = useState(false);

  const displayName = userProfile?.name || user?.displayName || (isAdmin ? "Administrator" : "Student");

  // Primary mobile bottom navigation items (5 tabs)
  const primaryTabs = isAdmin
    ? [
      { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
      { to: "/classes", label: "Classes", icon: GraduationCap },
      { to: "/students", label: "Students", icon: Users },
      { to: "/quizzes", label: "Quizzes", icon: HelpCircle },
    ]
    : [
      { to: "/dashboard", label: "Home", icon: LayoutDashboard },
      { to: "/classes", label: "Classes", icon: GraduationCap },
      { to: "/quizzes", label: "Quizzes", icon: HelpCircle },
      { to: "/progress", label: "Progress", icon: BarChart3 },
    ];

  // Secondary drawer items
  const drawerSections = isAdmin
    ? [
      { to: "/students", label: "Students & Admissions", icon: Users },
      { to: "/subjects", label: "All Subjects", icon: BookOpen },
      { to: "/books", label: "Sindh Board Books", icon: BookOpen },
      { to: "/chapters", label: "Chapters Bank", icon: Layers },
      { to: "/assignments", label: "Assignments", icon: Award },
      { to: "/results", label: "Quiz Results", icon: Trophy },
      { to: "/materials", label: "Study Materials", icon: FileText },
      { to: "/analytics", label: "Analytics", icon: BarChart3 },
      { to: "/settings", label: "Settings", icon: Settings },
      { to: "/profile", label: "Admin Profile", icon: User },
    ]
    : [
      { to: "/subjects", label: "My Subjects", icon: BookOpen },
      { to: "/books", label: "My Textbooks", icon: BookOpen },
      { to: "/chapters", label: "My Chapters", icon: Layers },
      { to: "/assignments", label: "Assignments", icon: Award },
      { to: "/results", label: "Results & Scorecards", icon: Trophy },
      { to: "/leaderboard", label: "Leaderboard", icon: Sparkles },
      { to: "/materials", label: "Study Notes & Materials", icon: FileText },
      { to: "/announcements", label: "Announcements", icon: Bell },
      { to: "/profile", label: "My Profile", icon: User },
    ];

  const handleSignOut = async () => {
    try {
      setDrawerOpen(false);
      await logout();
      navigate("/login");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <>
      {/* Fixed Bottom Bar on Mobile (hidden on md and above) */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-card/95 backdrop-blur-xl border-t border-border shadow-lg px-2 py-1.5 flex items-center justify-around safe-area-pb">
        {primaryTabs.map((tab) => {
          const Icon = tab.icon;
          const isActive =
            location.pathname === tab.to ||
            (tab.to === "/dashboard" && location.pathname === "/");

          return (
            <NavLink
              key={tab.to}
              to={tab.to}
              className={`flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-all duration-150 ${isActive
                  ? "text-primary font-bold"
                  : "text-muted-foreground hover:text-foreground"
                }`}
            >
              <div
                className={`p-1 rounded-lg transition-transform ${isActive ? "scale-110 bg-primary/10" : ""
                  }`}
              >
                <Icon className="w-5 h-5" />
              </div>
              <span className="text-[10px] mt-0.5 tracking-tight font-medium">
                {tab.label}
              </span>
            </NavLink>
          );
        })}

        {/* More Menu Sheet Trigger */}
        <Sheet open={drawerOpen} onOpenChange={setDrawerOpen}>
          <SheetTrigger asChild>
            <button className="flex flex-col items-center justify-center py-1 px-3 rounded-xl text-muted-foreground hover:text-foreground transition-all">
              <div className="p-1 rounded-lg">
                <Menu className="w-5 h-5" />
              </div>
              <span className="text-[10px] mt-0.5 font-medium">More</span>
            </button>
          </SheetTrigger>

          <SheetContent side="bottom" className="rounded-t-3xl border-t border-border bg-card px-4 pb-8 max-h-[85vh] overflow-y-auto">
            <SheetHeader className="text-left pb-4 border-b border-border">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-primary/10 text-primary font-bold text-sm flex items-center justify-center">
                    {(displayName || "ST").slice(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <SheetTitle className="text-base font-bold text-foreground">
                      {displayName}
                    </SheetTitle>
                    <div className="text-xs text-muted-foreground capitalize">
                      {isAdmin ? "Administrator" : "Student"} • LMS Portal
                    </div>
                  </div>
                </div>
              </div>
            </SheetHeader>

            {/* Menu Links */}
            <div className="py-4 space-y-1">
              <div className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground/70 px-2 mb-2">
                All Navigation
              </div>
              {drawerSections.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.to;

                return (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    onClick={() => setDrawerOpen(false)}
                    className={`flex items-center justify-between px-3 py-2.5 rounded-xl font-medium text-xs transition-colors ${isActive
                        ? "bg-primary text-primary-foreground font-semibold"
                        : "text-foreground hover:bg-muted"
                      }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className="w-4 h-4 text-primary" />
                      <span>{item.label}</span>
                    </div>
                    <ChevronRight className="w-4 h-4 opacity-50" />
                  </NavLink>
                );
              })}
            </div>

            {/* Sign out */}
            <div className="pt-2 border-t border-border">
              <Button
                variant="outline"
                onClick={handleSignOut}
                className="w-full text-destructive hover:text-destructive hover:bg-destructive/10 border-border text-xs justify-center gap-2 h-10 rounded-xl"
              >
                <LogOut className="w-4 h-4" />
                Sign Out
              </Button>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </>
  );
}
