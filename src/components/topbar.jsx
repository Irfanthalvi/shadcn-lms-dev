import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Menu,
  Sun,
  Moon,
  LogOut,
  User,
  GraduationCap,
  ChevronDown,
  Search,
  Bell,
  Check,
  Sparkles,
  BarChart3,
  Settings,
  X,
} from "lucide-react";
import { useLms } from "@/context/LmsContext";
import { useAuth } from "@/context/AuthContext";
import Breadcrumbs from "@/components/subject/breadcrumbs";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export default function Topbar({ toggleSidebar, profile: layoutProfile }) {
  const navigate = useNavigate();
  const {
    theme,
    toggleTheme,
    classes,
    notifications,
    markNotificationRead,
    clearAllNotifications,
    setIsSearchOpen,
  } = useLms();
  const { user, userProfile, isAdmin, logout } = useAuth();

  const displayName =
    userProfile?.name ||
    user?.displayName ||
    layoutProfile?.name ||
    (isAdmin ? "Administrator" : "Student");
  const displayEmail = userProfile?.email || user?.email || "";
  const displayRole = isAdmin ? "Administrator" : "Student";

  const unreadCount = notifications.filter((n) => !n.read).length;

  const getInitials = (name) => {
    if (!name) return "LM";
    const parts = name.trim().split(" ");
    if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    return name.slice(0, 2).toUpperCase();
  };

  const handleSignOut = async () => {
    try {
      await logout();
      navigate("/login");
    } catch (err) {
      console.error("Sign out error:", err);
    }
  };

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between h-[68px] px-3 sm:px-6 border-b border-border/80 bg-card/85 backdrop-blur-md">
      {/* Left Section: Sidebar Toggle & Breadcrumbs */}
      <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1 mr-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleSidebar}
          className="shrink-0 h-9 w-9 rounded-xl hover:bg-muted text-muted-foreground hover:text-foreground"
          title="Toggle Navigation Menu"
        >
          <Menu className="h-5 w-5" />
        </Button>

        <div className="hidden sm:flex items-center min-w-0 overflow-hidden">
          <Breadcrumbs />
        </div>
      </div>

      {/* Center/Right Section: Search Trigger, Notifications, Theme, Profile */}
      <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
        {/* Omni-Search Trigger Button */}
        <button
          onClick={() => setIsSearchOpen(true)}
          className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-muted/50 hover:bg-muted text-muted-foreground hover:text-foreground border border-border/70 transition-all text-xs max-w-[200px] sm:max-w-xs"
        >
          <Search className="w-3.5 h-3.5 shrink-0 text-primary" />
          <span className="hidden md:inline font-medium">Search anything...</span>
          <span className="md:hidden font-medium">Search...</span>
          <kbd className="hidden lg:inline-flex items-center text-[10px] px-1.5 py-0.5 rounded bg-background border border-border text-muted-foreground/80 ml-2 font-mono">
            ⌘K
          </kbd>
        </button>

        {/* Admin Class Switcher or Student Class Badge */}
        {isAdmin ? (
          classes.length > 0 && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="hidden xl:flex items-center gap-1.5 h-8 text-xs font-semibold rounded-xl bg-background border-border"
                >
                  <GraduationCap className="h-3.5 w-3.5 text-primary" />
                  <span>Classes</span>
                  <ChevronDown className="h-3 w-3 text-muted-foreground ml-0.5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48 rounded-xl border border-border bg-card shadow-lg p-1">
                <div className="px-2 py-1.5 text-[10px] font-bold uppercase text-muted-foreground">
                  Sindh Board Classes
                </div>
                {classes.map((cls) => (
                  <DropdownMenuItem
                    key={cls.id}
                    onClick={() => navigate(`/classes/${cls.id}/subjects`)}
                    className="cursor-pointer text-xs font-medium rounded-lg"
                  >
                    {cls.name} (Grade {cls.grade || cls.name})
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          )
        ) : (
          userProfile?.className && (
            <div className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary border border-primary/25 text-xs font-bold shadow-[0_0_12px_var(--color-accent-glow)]">
              <GraduationCap className="w-3.5 h-3.5" />
              <span>{userProfile.className}</span>
            </div>
          )
        )}

        {/* Notifications Popover */}
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="relative h-9 w-9 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted"
              title="Notifications"
            >
              <Bell className="h-4 w-4" />
              {unreadCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-primary ring-2 ring-card animate-pulse" />
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent
            align="end"
            className="w-80 sm:w-96 p-0 rounded-2xl border border-border bg-card shadow-xl overflow-hidden"
          >
            <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-muted/20">
              <div className="flex items-center gap-2">
                <span className="font-bold text-xs sm:text-sm text-foreground">Notifications</span>
                {unreadCount > 0 && (
                  <span className="px-2 py-0.5 rounded-full bg-primary/10 text-primary text-[10px] font-bold">
                    {unreadCount} new
                  </span>
                )}
              </div>
              {unreadCount > 0 && (
                <button
                  onClick={clearAllNotifications}
                  className="text-[11px] font-medium text-primary hover:underline flex items-center gap-1"
                >
                  <Check className="w-3 h-3" /> Mark all read
                </button>
              )}
            </div>

            <div className="max-h-80 overflow-y-auto divide-y divide-border/60">
              {notifications.length === 0 ? (
                <div className="py-8 text-center text-xs text-muted-foreground">
                  No notifications yet
                </div>
              ) : (
                notifications.map((n) => (
                  <div
                    key={n.id}
                    onClick={() => markNotificationRead(n.id)}
                    className={`p-3.5 cursor-pointer transition-colors hover:bg-muted/40 ${
                      !n.read ? "bg-primary/5" : ""
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="space-y-1 min-w-0">
                        <div className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                          {!n.read && (
                            <span className="w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                          )}
                          <span className="truncate">{n.title}</span>
                        </div>
                        <p className="text-[11px] text-muted-foreground line-clamp-2 leading-relaxed">
                          {n.message}
                        </p>
                      </div>
                      <span className="text-[10px] text-muted-foreground/80 shrink-0 mt-0.5">
                        {n.time}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="p-2 border-t border-border bg-muted/20 text-center">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate("/announcements")}
                className="w-full text-xs font-semibold text-primary h-8"
              >
                View Notice Board
              </Button>
            </div>
          </PopoverContent>
        </Popover>

        {/* Theme Toggle Button */}
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleTheme}
          className="h-9 w-9 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted"
          title={theme === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode"}
        >
          {theme === "dark" ? (
            <Sun className="h-4 w-4 text-amber-400 transition-transform rotate-0" />
          ) : (
            <Moon className="h-4 w-4 text-slate-700 transition-transform rotate-0" />
          )}
        </Button>

        {/* User Profile Dropdown Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="flex items-center gap-2 p-1 sm:px-2.5 sm:py-1.5 rounded-xl hover:bg-muted h-auto transition-all"
            >
              <Avatar className="h-8 w-8 border border-border ring-1 ring-primary/10">
                <AvatarImage src={userProfile?.photoURL || layoutProfile?.image} />
                <AvatarFallback className="bg-primary/10 text-primary font-bold text-xs">
                  {getInitials(displayName)}
                </AvatarFallback>
              </Avatar>
              <div className="hidden md:flex flex-col text-left max-w-[120px]">
                <span className="text-xs font-bold text-foreground leading-none truncate">
                  {displayName}
                </span>
                <span className="text-[10px] text-muted-foreground leading-none mt-1 capitalize truncate">
                  {displayRole}
                </span>
              </div>
              <ChevronDown className="hidden md:block h-3 w-3 text-muted-foreground shrink-0" />
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent
            align="end"
            className="w-60 rounded-2xl border border-border bg-card shadow-xl p-1.5"
          >
            <div className="px-3 py-2.5 border-b border-border/80">
              <div className="text-xs font-bold text-foreground truncate">
                {displayName}
              </div>
              <div className="text-[10px] text-muted-foreground truncate mt-0.5">
                {displayEmail}
              </div>
              <div className="mt-2 inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-primary/10 text-primary text-[10px] font-bold capitalize">
                <Sparkles className="w-3 h-3" />
                {displayRole} Account
              </div>
            </div>

            <div className="py-1">
              <DropdownMenuItem
                onClick={() => navigate("/profile")}
                className="cursor-pointer gap-2.5 text-xs font-medium py-2 rounded-xl"
              >
                <User className="h-4 w-4 text-primary" />
                My Profile
              </DropdownMenuItem>

              {!isAdmin && (
                <DropdownMenuItem
                  onClick={() => navigate("/progress")}
                  className="cursor-pointer gap-2.5 text-xs font-medium py-2 rounded-xl"
                >
                  <BarChart3 className="h-4 w-4 text-primary" />
                  My Learning Progress
                </DropdownMenuItem>
              )}

              <DropdownMenuItem
                onClick={() => navigate("/settings")}
                className="cursor-pointer gap-2.5 text-xs font-medium py-2 rounded-xl"
              >
                <Settings className="h-4 w-4 text-primary" />
                Settings & Preferences
              </DropdownMenuItem>
            </div>

            <DropdownMenuSeparator />

            <DropdownMenuItem
              onClick={handleSignOut}
              className="cursor-pointer gap-2.5 text-xs font-medium text-destructive focus:text-destructive py-2 rounded-xl"
            >
              <LogOut className="h-4 w-4" />
              Sign Out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
