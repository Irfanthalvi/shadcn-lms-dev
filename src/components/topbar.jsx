import React from "react";
import { useNavigate } from "react-router-dom";
import {
  Menu,
  Sun,
  Moon,
  Bell,
  Search,
  LogOut,
  Settings,
  User,
  GraduationCap,
  ChevronDown,
  Sparkles,
} from "lucide-react";
import { useLms } from "@/context/LmsContext";
import Breadcrumbs from "@/components/subject/breadcrumbs";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Topbar = ({ toggleSidebar, setIsModalOpen, profile }) => {
  const navigate = useNavigate();
  const { theme, toggleTheme, classes, announcements } = useLms();

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

      {/* Right Section: Quick Switcher, Theme, Notifications & Profile */}
      <div className="flex items-center gap-2 sm:gap-3 shrink-0">
        {/* Quick Class Switcher Dropdown */}
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
            <DropdownMenuLabel className="text-[11px] text-muted-foreground uppercase font-bold">
              Classes 8 to 12
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            {classes.map((cls) => (
              <DropdownMenuItem
                key={cls.id}
                onClick={() => navigate(`/classes/${cls.id}`)}
                className="cursor-pointer text-xs font-medium"
              >
                {cls.name} ({cls.level.split("(")[0].trim()})
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

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

        {/* Notifications Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="relative h-9 w-9 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted"
            >
              <Bell className="h-4 w-4" />
              <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-primary" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-72 p-2">
            <div className="flex items-center justify-between px-2 py-1.5 border-b border-border mb-1">
              <span className="text-xs font-bold text-foreground">
                School Notifications
              </span>
              <span className="text-[10px] text-primary font-medium cursor-pointer" onClick={() => navigate("/announcements")}>
                View all
              </span>
            </div>
            <div className="space-y-1 max-h-60 overflow-y-auto">
              {announcements.slice(0, 3).map((ann) => (
                <div
                  key={ann.id}
                  onClick={() => navigate("/announcements")}
                  className="p-2 rounded-lg hover:bg-muted text-xs cursor-pointer space-y-0.5"
                >
                  <div className="font-semibold text-foreground truncate">
                    {ann.title}
                  </div>
                  <div className="text-[11px] text-muted-foreground truncate">
                    {ann.content}
                  </div>
                </div>
              ))}
            </div>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* User Profile Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="flex items-center gap-2 p-1 sm:px-2 sm:py-1.5 rounded-xl hover:bg-muted h-auto"
            >
              <Avatar className="h-8 w-8 border border-border">
                <AvatarImage src={profile?.image || "/images/profile.png"} />
                <AvatarFallback className="bg-primary/10 text-primary font-bold text-xs">
                  IA
                </AvatarFallback>
              </Avatar>
              <div className="hidden lg:flex flex-col text-left">
                <span className="text-xs font-bold text-foreground leading-none">
                  {profile?.name || "IRFAN ALI"}
                </span>
                <span className="text-[10px] text-muted-foreground leading-none mt-0.5">
                  LMS Admin
                </span>
              </div>
              <ChevronDown className="hidden lg:block h-3 w-3 text-muted-foreground" />
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent
            align="end"
            className="w-52 rounded-xl border border-border bg-card shadow-lg p-1"
          >
            <div className="px-3 py-2 border-b border-border/80">
              <div className="text-xs font-bold text-foreground">
                {profile?.name || "IRFAN ALI"}
              </div>
              <div className="text-[10px] text-muted-foreground">
                admin@schoolsystem.edu
              </div>
            </div>

            <DropdownMenuItem
              onClick={() => setIsModalOpen(true)}
              className="cursor-pointer gap-2 text-xs font-medium py-2 rounded-lg"
            >
              <User className="h-4 w-4 text-primary" />
              Edit Profile
            </DropdownMenuItem>

            <DropdownMenuItem
              onClick={() => navigate("/settings")}
              className="cursor-pointer gap-2 text-xs font-medium py-2 rounded-lg"
            >
              <Settings className="h-4 w-4 text-blue-500" />
              LMS Settings
            </DropdownMenuItem>

            <DropdownMenuSeparator />

            <DropdownMenuItem
              onClick={() => navigate("/login")}
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
