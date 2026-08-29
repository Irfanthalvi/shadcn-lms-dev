import React from "react";
import { useNavigate } from "react-router-dom";
import {
  Menu,
  Sun,
  Moon,
  LogOut,
  User,
  GraduationCap,
  ChevronDown,
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

const Topbar = ({ toggleSidebar, setIsModalOpen, profile: layoutProfile }) => {
  const navigate = useNavigate();
  const { theme, toggleTheme, classes } = useLms();
  const { user, userProfile, isAdmin, logout } = useAuth();

  const displayName = userProfile?.name || user?.displayName || layoutProfile?.name || (isAdmin ? "Administrator" : "Student");
  const displayEmail = userProfile?.email || user?.email || "";
  const displayRole = isAdmin ? "Administrator" : "Student";

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
    <header className="sticky top-0 z-30 flex items-center justify-between h-[70px] px-4 sm:px-6 border-b border-border bg-card/80 backdrop-blur-md">
      {/* Left Section: Sidebar Toggle & Breadcrumbs */}
      <div className="flex items-center gap-3 min-w-0 flex-1">
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleSidebar}
          className="shrink-0 h-9 w-9 rounded-xl hover:bg-muted text-muted-foreground hover:text-foreground"
          title="Toggle Sidebar"
        >
          <Menu className="h-5 w-5" />
        </Button>

        <div className="flex items-center min-w-0 overflow-hidden">
          <Breadcrumbs />
        </div>
      </div>

      {/* Right Section: Theme Toggle & Profile Menu */}
      <div className="flex items-center gap-2 sm:gap-3 shrink-0">
        {/* Quick Class Switcher Dropdown */}
        {classes.length > 0 && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="hidden md:flex items-center gap-1.5 h-8 text-xs font-semibold rounded-xl bg-background border-border"
              >
                <GraduationCap className="h-3.5 w-3.5 text-primary" />
                <span>Switch Class</span>
                <ChevronDown className="h-3 w-3 text-muted-foreground ml-0.5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              {classes.map((cls) => (
                <DropdownMenuItem
                  key={cls.id}
                  onClick={() => navigate(`/classes/${cls.id}/subjects`)}
                  className="cursor-pointer text-xs font-medium"
                >
                  {cls.name} (Grade {cls.grade || cls.name})
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        )}

        {/* Theme Toggle Button */}
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleTheme}
          className="h-9 w-9 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted"
          title={theme === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode"}
        >
          {theme === "dark" ? (
            <Sun className="h-4 w-4 text-amber-400" />
          ) : (
            <Moon className="h-4 w-4 text-slate-700" />
          )}
        </Button>

        {/* User Profile Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="flex items-center gap-2 p-1 sm:px-2 sm:py-1.5 rounded-xl hover:bg-muted h-auto"
            >
              <Avatar className="h-8 w-8 border border-border">
                <AvatarImage src={userProfile?.photoURL || layoutProfile?.image} />
                <AvatarFallback className="bg-primary/10 text-primary font-bold text-xs">
                  {getInitials(displayName)}
                </AvatarFallback>
              </Avatar>
              <div className="hidden lg:flex flex-col text-left">
                <span className="text-xs font-bold text-foreground leading-none">
                  {displayName}
                </span>
                <span className="text-[10px] text-muted-foreground leading-none mt-0.5 capitalize">
                  {displayRole}
                </span>
              </div>
              <ChevronDown className="hidden lg:block h-3 w-3 text-muted-foreground" />
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent
            align="end"
            className="w-56 rounded-xl border border-border bg-card shadow-lg p-1"
          >
            <div className="px-3 py-2 border-b border-border/80">
              <div className="text-xs font-bold text-foreground truncate">
                {displayName}
              </div>
              <div className="text-[10px] text-muted-foreground truncate">
                {displayEmail}
              </div>
            </div>

            <DropdownMenuItem
              onClick={() => navigate("/profile")}
              className="cursor-pointer gap-2 text-xs font-medium py-2 rounded-lg"
            >
              <User className="h-4 w-4 text-primary" />
              My Profile
            </DropdownMenuItem>

            <DropdownMenuSeparator />

            <DropdownMenuItem
              onClick={handleSignOut}
              className="cursor-pointer gap-2 text-xs font-medium text-destructive focus:text-destructive py-2 rounded-lg"
            >
              <LogOut className="h-4 w-4" />
              Sign Out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};

export default Topbar;
