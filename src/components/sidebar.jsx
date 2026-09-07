import React from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { useLms } from "@/context/LmsContext";
import {
  LayoutDashboard,
  GraduationCap,
  Users,
  BookOpen,
  Layers,
  FileText,
  HelpCircle,
  Award,
  Bell,
  BarChart3,
  Settings,
  User,
  LogOut,
  Sparkles,
  Trophy,
  ChevronLeft,
  BookMarked,
  FileCheck2,
  FolderOpen,
  ClipboardList,
  ShieldCheck,
  CheckCircle2,
  Clock,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Sidebar({
  isSidebarOpen,
  isMobile,
  toggleSidebar,
  closeSidebar,
}) {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, userProfile, isAdmin, logout } = useAuth();
  const { students, assignments, quizzes } = useLms();

  const displayName =
    userProfile?.name ||
    user?.displayName ||
    (isAdmin ? "Administrator" : "Student");
  const displayEmail = userProfile?.email || user?.email || "";
  const displayRole = isAdmin ? "Administrator" : "Student";

  const pendingStudentsCount = (students || []).filter((s) => !s.isApproved).length;

  const getInitials = (name) => {
    if (!name) return "LM";
    const parts = name.trim().split(" ");
    if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    return name.slice(0, 2).toUpperCase();
  };

  // Admin Navigation per prompt requirements
  const adminNav = [
    { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    {
      to: "/students",
      label: "Students / Admissions",
      icon: Users,
      badge: pendingStudentsCount > 0 ? `${pendingStudentsCount}` : null,
      badgeColor: "bg-amber-500 text-white",
    },
    { to: "/classes", label: "Classes", icon: GraduationCap },
    { to: "/subjects", label: "Subjects", icon: BookOpen },
    { to: "/books", label: "Books", icon: BookMarked },
    { to: "/chapters", label: "Chapters", icon: Layers },
    { to: "/quizzes", label: "Quizzes", icon: HelpCircle },
    { to: "/assignments", label: "Assignments", icon: Award },
    { to: "/results", label: "Quiz Results", icon: Trophy },
    { to: "/assignments?view=submissions", label: "Assignment Submissions", icon: FileCheck2 },
    { to: "/materials", label: "Study Materials", icon: FileText },
    { to: "/analytics", label: "Analytics", icon: BarChart3 },
    { to: "/settings", label: "Settings", icon: Settings },
  ];

  // Student Navigation strictly aligned with their class per prompt requirements
  const studentNav = [
    { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { to: "/classes", label: "My Class", icon: GraduationCap },
    { to: "/subjects", label: "My Subjects", icon: BookOpen },
    { to: "/books", label: "My Books", icon: BookMarked },
    { to: "/chapters", label: "My Chapters", icon: Layers },
    { to: "/quizzes", label: "Upcoming Quizzes", icon: HelpCircle },
    { to: "/assignments", label: "Available Assignments", icon: Award },
    { to: "/results", label: "Recent Results", icon: Trophy },
    { to: "/progress", label: "Academic Progress", icon: BarChart3 },
    { to: "/materials", label: "Study Materials", icon: FileText },
    { to: "/profile", label: "Student Profile", icon: User },
    { to: "/settings", label: "Settings", icon: Settings },
  ];

  const navItems = isAdmin ? adminNav : studentNav;

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/login");
    } catch (err) {
      console.error("Logout error:", err);
    }
  };

  const isExpanded = isMobile ? isSidebarOpen : isSidebarOpen;

  return (
    <aside
      className={`fixed top-0 left-0 z-50 h-full bg-card/95 backdrop-blur-xl text-card-foreground border-r border-border/80 flex flex-col transition-all duration-300 shadow-sm select-none ${
        isMobile
          ? isSidebarOpen
            ? "translate-x-0 w-72 max-w-[85vw]"
            : "-translate-x-full w-72"
          : isSidebarOpen
          ? "w-[248px]"
          : "w-[72px]"
      }`}
    >
      {/* Brand Header */}
      <div className="flex items-center justify-between px-4 h-[68px] border-b border-border/70 bg-card/50 shrink-0">
        <NavLink
          to="/dashboard"
          onClick={closeSidebar}
          className="flex items-center gap-3 min-w-0"
        >
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-teal-600 via-teal-500 to-cyan-500 text-white flex items-center justify-center font-extrabold text-sm shadow-[0_2px_14px_var(--color-accent-glow)] shrink-0 tracking-tighter">
            LM
          </div>
          {(isExpanded || isMobile) && (
            <div className="min-w-0">
              <div className="font-black text-sm tracking-tight text-foreground truncate flex items-center gap-1.5">
                LMS ACADEMY
              </div>
              <div className="text-[10px] font-bold text-primary uppercase tracking-wider truncate flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-primary inline-block animate-pulse" />
                {isAdmin ? "Admin Portal" : userProfile?.className || "Student Portal"}
              </div>
            </div>
          )}
        </NavLink>

        {isMobile ? (
          <button
            onClick={toggleSidebar}
            className="p-1.5 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted/80 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        ) : (
          <button
            onClick={toggleSidebar}
            className={`p-1.5 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted/80 transition-all ${
              !isSidebarOpen ? "rotate-180" : ""
            }`}
            title={isSidebarOpen ? "Collapse sidebar" : "Expand sidebar"}
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Navigation List */}
      <nav className="flex-1 px-2.5 py-3 space-y-1 overflow-y-auto">
        {(isExpanded || isMobile) && (
          <div className="px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-muted-foreground/70">
            {isAdmin ? "Administration" : "Academics"}
          </div>
        )}

        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive =
            location.pathname === item.to ||
            (item.to !== "/dashboard" &&
              !item.to.includes("?") &&
              location.pathname.startsWith(item.to)) ||
            (item.to.includes("?") &&
              location.pathname + location.search === item.to);

          return (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={closeSidebar}
              className={({ isActive: matchActive }) => {
                const activeState = isActive || matchActive;
                return `flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all duration-200 group relative ${
                  activeState
                    ? "bg-gradient-to-r from-teal-600 via-teal-500 to-cyan-500 text-white font-bold shadow-[0_4px_16px_var(--color-accent-glow)] -translate-y-0.2"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/70"
                }`;
              }}
              title={!isExpanded && !isMobile ? item.label : undefined}
            >
              <Icon className="h-4 w-4 shrink-0 transition-transform group-hover:scale-110" />

              {(isExpanded || isMobile) && (
                <span className="truncate flex-1">{item.label}</span>
              )}

              {(isExpanded || isMobile) && item.badge && (
                <span
                  className={`text-[10px] px-1.5 py-0.5 rounded-full font-black ${
                    item.badgeColor || "bg-primary/20 text-primary"
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* Bottom User Card */}
      <div className="p-3 border-t border-border/70 bg-card/30 shrink-0">
        <div
          className={`flex items-center gap-2.5 p-2 rounded-2xl bg-muted/40 border border-border/60 ${
            !isExpanded && !isMobile ? "justify-center" : "justify-between"
          }`}
        >
          <div
            onClick={() => navigate("/profile")}
            className="flex items-center gap-2.5 min-w-0 cursor-pointer"
          >
            <div className="w-8 h-8 rounded-xl bg-primary/15 text-primary border border-primary/30 flex items-center justify-center text-xs font-black shrink-0">
              {getInitials(displayName)}
            </div>
            {(isExpanded || isMobile) && (
              <div className="min-w-0">
                <div className="text-xs font-bold text-foreground truncate max-w-[120px]">
                  {displayName}
                </div>
                <div className="text-[10px] text-muted-foreground truncate">
                  {isAdmin ? "Admin" : userProfile?.className || "Student"}
                </div>
              </div>
            )}
          </div>

          {(isExpanded || isMobile) && (
            <button
              onClick={handleLogout}
              className="p-1.5 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
              title="Sign Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </aside>
  );
}
