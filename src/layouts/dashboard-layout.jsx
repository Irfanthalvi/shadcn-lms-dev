"use client";
import { useState, useEffect, useRef } from "react";
import { Loader } from "lucide-react";
import ProfileModal from "@/components/subject/profile-model";
import Topbar from "@/components/topbar";
import Sidebar from "@/components/sidebar";

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

  // Handle resize
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (!mobile) {
        setIsSidebarOpen(true);
      } else {
        setIsSidebarOpen(false);
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Fake loading effect
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 600);
    return () => clearTimeout(timer);
  }, []);

  const toggleSidebar = () => setIsSidebarOpen((prev) => !prev);
  const closeSidebar = () => isMobile && setIsSidebarOpen(false);

  return (
    <div className="flex min-h-screen bg-background text-foreground relative">
      {/* Sidebar (Fixed) */}
      <Sidebar
        isSidebarOpen={isSidebarOpen}
        isMobile={isMobile}
        toggleSidebar={toggleSidebar}
        closeSidebar={closeSidebar}
        className="fixed left-0 top-0 h-full z-40"
      />

      {/* Overlay (Mobile) */}
      {isMobile && isSidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/40"
          onClick={toggleSidebar}
        />
      )}

      {/* Main Content */}
      <main
        className={`flex flex-col flex-1 min-w-0 transition-all duration-300 ml-0
          ${!isMobile && (isSidebarOpen ? "ml-[260px]" : "ml-[70px]")}
        `}
      >
        {/* Topbar (Sticky) */}
        <div className="sticky top-0 z-30 bg-background border-b">
          <Topbar
            toggleSidebar={toggleSidebar}
            dropdownRef={dropdownRef}
            isDropdownOpen={isDropdownOpen}
            setIsDropdownOpen={setIsDropdownOpen}
            setIsModalOpen={setIsModalOpen}
            profile={profile}
            isMobile={isMobile}
          />
        </div>

        {/* Page Content (Scrollable) */}
        <div className="flex-1 overflow-y-auto">
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

      {/* Profile Modal */}
      {isModalOpen && (
        <ProfileModal setIsModalOpen={setIsModalOpen} setProfile={setProfile} />
      )}
    </div>
  );
};

export default DashboardLayout;
