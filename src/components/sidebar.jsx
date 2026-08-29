"use client";
import React from "react";
import { NavLink, useLocation } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import {
  LayoutDashboard,
  GraduationCap,
  Users,
  User,
  LogOut,
  Layers,
  X,
  ShieldCheck,
  UserCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const Sidebar = ({ isSidebarOpen, isMobile, toggleSidebar, closeSidebar }) => {
  const location = useLocation();
  const { user, userProfile, isAdmin, logout } = useAuth();

  const displayName = userProfile?.name || user?.displayName || (isAdmin ? "IRFAN ALI" : "Student");
  const displayEmail = userProfile?.email || user?.email || "";
  const displayRole = isAdmin ? "Administrator" : "Student";

  const getInitials = (name) => {
    if (!name) return "LM";
    const parts = name.trim().split(" ");
    if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    return name.slice(0, 2).toUpperCase();
  };

  // Simplified Navigation items per Role
  const navItems = isAdmin
    ? [
        { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
        { to: "/classes", label: "Classes", icon: GraduationCap },
        { to: "/students", label: "Students", icon: Users },
      ]
    : [
        { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
        { to: "/classes", label: "Classes", icon: GraduationCap },
        { to: "/profile", label: "Profile", icon: User },
      ];

  const handleLogout = async () => {
    try {
      await logout();
    } catch (err) {
      console.error("Logout error:", err);
    }
  };

  return (
    <aside
      className={`fixed top-0 left-0 z-50 h-full bg-card text-card-foreground border-r border-border flex flex-col transition-all duration-300 shadow-sm
        ${
          isMobile
            ? isSidebarOpen
              ? "translate-x-0 w-72 max-w-[85vw]"
              : "-translate-x-full w-72"
            : isSidebarOpen
            ? "w-[240px]"
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
          <div className="p-2 bg-primary text-primary-foreground rounded-xl shadow-sm shrink-0">
            <Layers className="h-5 w-5" />
          </div>
          {(isSidebarOpen || isMobile) && (
            <div className="min-w-0">
              <div className="font-bold text-sm tracking-tight text-foreground truncate">
                LMS ACADEMY
              </div>
              <div className="text-[11px] font-medium text-muted-foreground truncate">
                {isAdmin ? "Admin Control" : "Student Portal"}
              </div>
            </div>
          )}
        </NavLink>

        {isMobile && isSidebarOpen && (
          <button
            onClick={toggleSidebar}
            className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted"
          >
            <X className="h-5 w-5" />
          </button>
        )}
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-3 py-4 space-y-1.5 overflow-y-auto">
        {(isSidebarOpen || isMobile) && (
          <div className="px-3 text-[10px] font-bold uppercase tracking-wider text-muted-foreground/70 mb-2">
            {isAdmin ? "Admin Navigation" : "Student Menu"}
          </div>
        )}

        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive =
            location.pathname === item.to ||
            (item.to === "/dashboard" && location.pathname === "/");

          return (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={closeSidebar}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium text-sm transition-all duration-200 ${
                isActive
                  ? "bg-primary text-primary-foreground font-semibold shadow-sm"
                  : "text-muted-foreground hover:text-foreground hover:bg-accent/70"
              }`}
            >
              <Icon className="h-5 w-5 shrink-0" />
              {(isSidebarOpen || isMobile) && (
                <span className="truncate">{item.label}</span>
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* Bottom User Profile & Sign Out Card */}
      <div className="p-3 border-t border-border bg-muted/20 shrink-0">
        <div className="flex items-center gap-3 p-2 rounded-xl bg-card border border-border/60">
          <div className="w-9 h-9 rounded-full bg-primary/10 text-primary font-bold text-xs flex items-center justify-center shrink-0">
            {getInitials(displayName)}
          </div>
          {(isSidebarOpen || isMobile) && (
            <div className="min-w-0 flex-1">
              <div className="font-semibold text-xs text-foreground truncate flex items-center gap-1">
                {displayName}
                {isAdmin && <ShieldCheck className="w-3 h-3 text-primary inline" />}
              </div>
              <div className="text-[10px] text-muted-foreground truncate capitalize">
                {displayRole}
              </div>
            </div>
          )}
          {(isSidebarOpen || isMobile) && (
            <button
              onClick={handleLogout}
              title="Sign Out"
              className="p-1.5 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition"
            >
              <LogOut className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
