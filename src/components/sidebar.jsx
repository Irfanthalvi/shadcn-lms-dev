"use client";
import { NavLink } from "react-router-dom";
import { Layers, NotebookPen, List } from "lucide-react";

const Sidebar = ({ isSidebarOpen, isMobile, toggleSidebar, closeSidebar }) => {
  return (
    <aside
      className={`fixed top-0 left-0 z-50 h-full bg-background border-r border-border flex flex-col transition-all duration-300
        ${
          isMobile
            ? isSidebarOpen
              ? "translate-x-0 w-full max-w-[500px]"
              : "-translate-x-full w-full max-w-[260px]"
            : isSidebarOpen
            ? "w-[260px]"
            : "w-[70px]"
        }
      `}
    >
      {/* Sidebar Header */}
      <div className="flex items-center justify-between px-4 h-[75px] border-b border-border">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-muted rounded-lg border border-border">
            <Layers size={24} />
          </div>
          {isSidebarOpen && !isMobile && (
            <span className="font-monstrat-hadding text-lg font-semibold whitespace-nowrap">
              School System
            </span>
          )}
        </div>
        {isMobile && isSidebarOpen && (
          <button onClick={toggleSidebar} className="text-lg font-bold">
            ✕
          </button>
        )}
      </div>

      {/* Nav Links */}
      <nav className="flex-1 px-1 py-4 space-y-2 overflow-y-auto">
        <NavLink
          to="/subjects"
          onClick={closeSidebar}
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
          to="/assessment"
          onClick={closeSidebar}
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
          {isSidebarOpen && "Assessment"}
        </NavLink>
      </nav>
    </aside>
  );
};

export default Sidebar;
