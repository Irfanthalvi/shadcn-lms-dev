"use client";
import React from "react";
import { NavLink, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  GraduationCap,
  Layers,
  BookOpen,
  FileText,
  Users,
  UserCheck,
  Award,
  CheckSquare,
  Bookmark,
  Bell,
  Settings,
  X,
  ChevronRight,
  Sparkles,
} from "lucide-react";

const navGroups = [
  {
    label: "Main",
    items: [
      { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
      { to: "/classes", label: "Classes", icon: GraduationCap },
    ],
  },
  {
    label: "Classes 8 — 12",
    items: [
      { to: "/classes/8", label: "Class 8", badge: "Middle", number: "8" },
      { to: "/classes/9", label: "Class 9", badge: "Matric I", number: "9" },
      { to: "/classes/10", label: "Class 10", badge: "Matric II", number: "10" },
      { to: "/classes/11", label: "Class 11", badge: "FSc I", number: "11" },
      { to: "/classes/12", label: "Class 12", badge: "FSc II", number: "12" },
    ],
  },
  {
    label: "Academic & Exam Hub",
    items: [
      { to: "/subjects", label: "Subjects", icon: BookOpen },
      { to: "/papers", label: "Papers", icon: FileText },
      { to: "/assignments", label: "Assignments", icon: CheckSquare },
      { to: "/study-material", label: "Study Material", icon: Bookmark },
    ],
  },
  {
    label: "People & Performance",
    items: [
      { to: "/students", label: "Students", icon: Users },
      { to: "/teachers", label: "Teachers", icon: UserCheck },
      { to: "/results", label: "Results", icon: Award },
    ],
  },
  {
    label: "System",
    items: [
      { to: "/announcements", label: "Announcements", icon: Bell },
      { to: "/settings", label: "Settings", icon: Settings },
    ],
  },
];

const Sidebar = ({ isSidebarOpen, isMobile, toggleSidebar, closeSidebar }) => {
  const location = useLocation();

  return (
    <aside
      className={`fixed top-0 left-0 z-50 h-full bg-card text-card-foreground border-r border-border flex flex-col transition-all duration-300 shadow-sm
        ${
          isMobile
            ? isSidebarOpen
              ? "translate-x-0 w-72 max-w-[85vw]"
              : "-translate-x-full w-72"
            : isSidebarOpen
            ? "w-[260px]"
            : "w-[72px]"
        }
      `}
    >
      {/* Sidebar Header */}
      <div className="flex items-center justify-between px-4 h-[70px] border-b border-border bg-card shrink-0">
        <NavLink
          to="/dashboard"
          onClick={closeSidebar}
          className="flex items-center gap-3 min-w-0"
        >
          <div className="p-2 bg-primary text-primary-foreground rounded-xl shadow-md shadow-primary/20 shrink-0">
            <Layers className="h-5 w-5" />
          </div>
          {(isSidebarOpen || isMobile) && (
            <div className="min-w-0">
              <div className="font-extrabold text-sm tracking-tight text-foreground truncate">
                LMS ACADEMY
              </div>
              <div className="text-[11px] font-medium text-muted-foreground truncate">
                School Management
              </div>
            </div>
          )}
        </NavLink>

        {isMobile && isSidebarOpen && (
          <button
            onClick={toggleSidebar}
            className="p-1 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted"
          >
            <X className="h-5 w-5" />
          </button>
        )}
      </div>

      {/* Navigation Scrollable Body */}
      <nav className="flex-1 px-3 py-3 space-y-5 overflow-y-auto scrollbar-none">
        {navGroups.map((group, gIdx) => (
          <div key={gIdx} className="space-y-1">
            {/* Section Header Label */}
            {(isSidebarOpen || isMobile) && (
              <div className="px-3 text-[10px] font-bold uppercase tracking-wider text-muted-foreground/70 mb-1">
                {group.label}
              </div>
            )}

            {/* Section Items */}
            <div className="space-y-0.5">
              {group.items.map((item) => {
                const Icon = item.icon;
                const isActive =
                  location.pathname === item.to ||
                  (item.to === "/dashboard" && location.pathname === "/");

                return (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    onClick={closeSidebar}
                    className={`flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold transition-all duration-150 relative group
                      ${
                        isActive
                          ? "bg-primary text-primary-foreground shadow-sm shadow-primary/25"
                          : "text-muted-foreground hover:text-foreground hover:bg-muted/60"
                      }
                    `}
                    title={!isSidebarOpen && !isMobile ? item.label : undefined}
                  >
                    {/* Icon or Class Number Avatar */}
                    {Icon ? (
                      <Icon
                        className={`h-4 w-4 shrink-0 transition-transform group-hover:scale-110 ${
                          isActive ? "text-primary-foreground" : "text-muted-foreground group-hover:text-foreground"
                        }`}
                      />
                    ) : (
                      <div
                        className={`h-5 w-5 rounded-md flex items-center justify-center font-bold text-[11px] shrink-0 border ${
                          isActive
                            ? "bg-primary-foreground text-primary border-primary-foreground/30"
                            : "bg-muted text-foreground border-border group-hover:border-primary/40"
                        }`}
                      >
                        {item.number}
                      </div>
                    )}

                    {/* Label & Badge */}
                    {(isSidebarOpen || isMobile) && (
                      <div className="flex items-center justify-between flex-1 min-w-0">
                        <span className="truncate">{item.label}</span>
                        {item.badge && (
                          <span
                            className={`text-[10px] px-1.5 py-0.2 rounded-full font-medium ${
                              isActive
                                ? "bg-primary-foreground/20 text-primary-foreground"
                                : "bg-muted text-muted-foreground"
                            }`}
                          >
                            {item.badge}
                          </span>
                        )}
                      </div>
                    )}
                  </NavLink>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Sidebar Footer User Info */}
      {(isSidebarOpen || isMobile) && (
        <div className="p-3 border-t border-border bg-muted/20 shrink-0">
          <div className="flex items-center justify-between p-2 rounded-xl bg-card border border-border text-xs">
            <div className="flex items-center gap-2 min-w-0">
              <div className="h-7 w-7 rounded-full bg-primary/10 text-primary font-bold flex items-center justify-center text-xs shrink-0">
                IA
              </div>
              <div className="min-w-0">
                <div className="font-bold truncate text-foreground">IRFAN ALI</div>
                <div className="text-[10px] text-muted-foreground truncate">LMS Admin</div>
              </div>
            </div>
            <span className="h-2 w-2 rounded-full bg-emerald-500 shrink-0" title="Online" />
          </div>
        </div>
      )}
    </aside>
  );
};

export default Sidebar;
