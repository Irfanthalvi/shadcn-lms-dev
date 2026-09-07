import React, { useState, useEffect } from "react";
import Topbar from "@/components/topbar";
import Sidebar from "@/components/sidebar";
import MobileNav from "@/components/mobile-nav";
import GlobalSearchModal from "@/components/global-search-modal";

export default function DashboardLayout({ children }) {
  const [screen, setScreen] = useState("desktop");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  useEffect(() => {
    const handleResize = () => {
      const w = window.innerWidth;
      if (w < 768) {
        setScreen("mobile");
        setIsSidebarOpen(false);
      } else if (w < 1024) {
        setScreen("tablet");
        setIsSidebarOpen(false);
      } else {
        setScreen("desktop");
        setIsSidebarOpen(true);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const toggleSidebar = () => setIsSidebarOpen((prev) => !prev);
  const closeSidebar = () => {
    if (screen === "mobile" || screen === "tablet") {
      setIsSidebarOpen(false);
    }
  };

  const mainMargin = (() => {
    if (screen === "desktop") return isSidebarOpen ? "lg:ml-[240px]" : "lg:ml-[72px]";
    if (screen === "tablet") return isSidebarOpen ? "md:ml-[240px]" : "md:ml-0";
    return "ml-0";
  })();

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col relative antialiased">
      {/* Global Search Modal */}
      <GlobalSearchModal />

      {/* Sidebar for Desktop & Tablet */}
      <Sidebar
        isSidebarOpen={isSidebarOpen}
        isMobile={screen === "mobile" || screen === "tablet"}
        toggleSidebar={toggleSidebar}
        closeSidebar={closeSidebar}
      />

      {/* Backdrop overlay for mobile/tablet when sidebar is open */}
      {(screen === "mobile" || screen === "tablet") && isSidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-xs transition-opacity"
          onClick={closeSidebar}
        />
      )}

      {/* Main Content Area */}
      <div
        className={`flex-1 flex flex-col min-w-0 transition-all duration-300 ${mainMargin} pb-16 md:pb-0`}
      >
        <Topbar toggleSidebar={toggleSidebar} />

        <main className="flex-1 min-w-0">
          {children}
        </main>
      </div>

      {/* Mobile Bottom Navigation Bar */}
      <MobileNav />
    </div>
  );
}
