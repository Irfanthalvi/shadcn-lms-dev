import { useState, useEffect, useRef } from "react";
import { Link, NavLink } from "react-router-dom";
import {
  NotebookPen,
  User,
  LogOut,
  Settings,
  Loader,
  Layers,
  List,
} from "lucide-react";
import { FaChevronDown } from "react-icons/fa";
import Breadcrumbs from "@/components/Breadcrumbs";
import ProfileModal from "@/components/profilemodel";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { CgProfile } from "react-icons/cg";

const DashboardLayout = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [profile, setProfile] = useState({
    name: "IRFAN ALI",
    image: null,
  });

  const [loading, setLoading] = useState(true);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      setIsSidebarOpen(!mobile);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 600);
    return () => clearTimeout(timer);
  }, []);

  const toggleSidebar = () => setIsSidebarOpen((prev) => !prev);

  return (
    <div className="flex min-h-screen bg-background text-foreground relative">
      {/* Main layout wrapper with blur on modal */}
      <div
        className={`flex flex-1 transition-all duration-300 ${
          isModalOpen ? "blur-sm opacity-30 pointer-events-none" : ""
        }`}
      >
        {/* Sidebar */}
        <aside
          className={`fixed top-0 left-0 z-50 h-full bg-background border-r border-border flex flex-col transition-all duration-300
            ${isSidebarOpen ? (isMobile ? "w-full" : "w-[260px]") : "w-[70px]"}
          `}
        >
          {/* Sidebar header */}
          <div className="flex items-center justify-between px-4 h-[75px] border-b border-border">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-muted rounded-lg border border-border">
                <Layers size={24} />
              </div>
              {isSidebarOpen && (
                <span className="font-monstrat-hadding text-lg font-semibold whitespace-nowrap">
                  School System
                </span>
              )}
            </div>
            {isMobile && isSidebarOpen && (
              <button
                onClick={toggleSidebar}
                className="p-2 text-lg font-bold bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
              >
                ✕
              </button>
            )}
          </div>

          {/* Navigation Links */}
          <nav className="flex-1 px-1 py-4 space-y-2 overflow-y-auto">
            <NavLink
              to="/subjects"
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-2 rounded-md text-sm font-medium transition-colors font-monstrat-hadding
                 ${
                   isActive
                     ? "bg-accent text-accent-foreground"
                     : "hover:bg-muted hover:text-foreground"
                 }`
              }
            >
              <NotebookPen size={20} />
              {isSidebarOpen && "Subjects"}
            </NavLink>
            <NavLink
              to="/listing"
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-2 rounded-md text-sm font-medium transition-colors font-monstrat-hadding
                 ${
                   isActive
                     ? "bg-accent text-accent-foreground "
                     : "hover:bg-muted hover:text-foreground"
                 }`
              }
            >
              <List size={20} />
              {isSidebarOpen && "Listing"}
            </NavLink>
          </nav>
        </aside>

        {/* Main Content */}
        <main
          className={`flex flex-col flex-1 min-w-0 transition-all duration-300
            ${isSidebarOpen ? (isMobile ? "ml-0" : "ml-[260px]") : "ml-[70px]"}`}
        >
          {/* Topbar */}
          <header className="sticky top-0 z-30 flex items-center justify-between h-[75px] px-4 border-b border-border bg-background">
            <div className="flex items-center justify-center gap-4 min-w-0">
              <button
                onClick={toggleSidebar}
                className="w-10 h-10 flex items-center justify-center border border-border  bg-muted rounded-md transition shrink-0"
              >
                ☰
              </button>
              <div className="flex items-center h-10 overflow-hidden">
                <Breadcrumbs />
              </div>
            </div>

            {/* Profile Dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setIsDropdownOpen((prev) => !prev)}
                className="flex items-center gap-2 px-3 py-2 rounded-full hover:bg-muted"
              >
                <div className="border border-border rounded-full">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={profile.image || "/images/profile.png"} />
                    <AvatarFallback>U</AvatarFallback>
                  </Avatar>
                </div>
                <span className="hidden md:flex items-center text-sm font-medium max-w-[140px] overflow-hidden text-ellipsis whitespace-nowrap font-monstrat-hadding">
                  {profile.name}
                  <FaChevronDown
                    className={`ml-1 transition-transform ${
                      isDropdownOpen ? "rotate-180" : "rotate-0"
                    }`}
                  />
                </span>
              </button>

              {isDropdownOpen && (
                <div
                  className="absolute right-0 mt-2 w-44 rounded-md border border-border bg-background shadow z-50"
                  onMouseDown={(e) => e.stopPropagation()}
                >
                  <button
                    onClick={() => {
                      setIsDropdownOpen(false);
                      setIsModalOpen(true);
                    }}
                    className="w-full text-left flex items-center gap-2 px-4 py-2 text-sm rounded-md hover:bg-muted transition-colors"
                  >
                    <CgProfile size={18} />
                    Profile
                  </button>
                  <Link
                    to="/setting"
                    onClick={() => setIsDropdownOpen(false)}
                    className="flex items-center gap-2 px-4 py-2 text-sm rounded-md hover:bg-muted transition-colors"
                  >
                    <Settings size={18} />
                    Settings
                  </Link>
                  <hr className="my-1 border-border" />
                  <Link
                    to="/login"
                    onClick={() => setIsDropdownOpen(false)}
                    className="flex items-center gap-2 px-4 py-2 text-sm rounded-md hover:bg-muted transition-colors"
                  >
                    <LogOut size={18} />
                    Logout
                  </Link>
                </div>
              )}
            </div>
          </header>

          {/* Scrollable Page Content */}
          <div className="flex-1 overflow-y-auto p-4">
            {loading ? (
              <div className="h-full flex items-center justify-center text-muted-foreground">
                <Loader className="w-6 h-6 mr-2 animate-spin" />
                Loading page...
              </div>
            ) : (
              children
            )}
          </div>
        </main>
      </div>

      {/* Profile Modal (Global Layer) */}
      {isModalOpen && (
        <ProfileModal
          setIsModalOpen={setIsModalOpen}
          setProfile={setProfile}
        />
      )}
    </div>
  );
};

export default DashboardLayout;
