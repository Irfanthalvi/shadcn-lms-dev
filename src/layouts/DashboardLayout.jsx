import { useState, useEffect, useRef } from "react";
import { Link, NavLink } from "react-router-dom";
import {
    BookOpenCheck,
    User,
    LogOut,
    Settings,
    Loader,
    LandPlot,
} from "lucide-react";
import { CgProfile } from "react-icons/cg";
import { FaChevronDown } from "react-icons/fa";
import Breadcrumbs from "@/components/Breadcrumbs";

const DashboardLayout = ({ children }) => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [loading, setLoading] = useState(true); // ✅ new state
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

    // ✅ Simulate page loading — optional
    useEffect(() => {
        const timer = setTimeout(() => setLoading(false), 600); // simulate 600ms
        return () => clearTimeout(timer);
    }, []);

    const toggleSidebar = () => setIsSidebarOpen((prev) => !prev);

    return (
        <div className="flex h-screen bg-background text-foreground">
            {isMobile && isSidebarOpen && (
                <div
                    className="fixed inset-0 z-40 bg-black/50"
                    onClick={toggleSidebar}
                />
            )}

            {/* Sidebar */}
            <aside
                className={`fixed top-0 left-0 z-50 h-full bg-background border-r border-gray-200 flex flex-col transition-all duration-300 ease-in-out
        ${isSidebarOpen ? (isMobile ? "w-full" : "w-[260px]") : "w-[70px]"}`}
            >
                <div className="flex items-center justify-between px-4 h-[75px] border-b border-border">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-muted rounded-lg border border-border ">
                            <LandPlot size={24} />
                        </div>
                        {isSidebarOpen && (
                            <span className="text-lg font-semibold whitespace-nowrap">
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

                <nav className="flex-1 px-1 py-4 space-y-2 overflow-y-auto">
                    <NavLink
                        to="/subjects"
                        className={({ isActive }) =>
                            `flex items-center gap-3 px-4 py-2 rounded-md text-sm font-medium transition-colors
                               ${isActive
                                ? "bg-accent text-accent-foreground"
                                : "hover:bg-muted hover:text-foreground"
                            }`
                        }
                    >
                        <BookOpenCheck size={25} />
                        {isSidebarOpen && "Subjects"}
                    </NavLink>
                </nav>
            </aside>

            {/* Main content area */}
            <main
                className={`flex flex-col flex-1 min-w-0 transition-all duration-300
        ${isSidebarOpen ? (isMobile ? "ml-0" : "ml-[260px]") : "ml-[70px]"}`}
            >
                {/* Topbar */}
                <header className="flex items-center justify-between h-[75px] px-4 border-b border-border bg-background">
                    <div className="flex items-center justify-center gap-4 min-w-0">
                        <button
                            onClick={toggleSidebar}
                            className="w-10 h-10 flex items-center justify-center border border-border rounded-md  transition shrink-0"
                        >
                            ☰
                        </button>
                        <div className="flex items-center h-10 translate-y-[7px] overflow-hidden ">
                            <Breadcrumbs />
                        </div>
                    </div>

                    {/* Profile */}
                    <div className="relative" ref={dropdownRef}>
                        <button
                            onClick={() => setIsDropdownOpen((prev) => !prev)}
                            className="flex items-center gap-2 px-3 py-2 rounded-full hover:bg-muted"
                        >
                            <div className="p-2 border border-border rounded-full">
                                <User size={20} />
                            </div>
                            <span className="hidden md:flex items-center text-sm font-medium">
                                IRFAN ALI
                                <FaChevronDown
                                    className={`ml-1 transition-transform ${isDropdownOpen ? "rotate-180" : "rotate-0"
                                        }`}
                                />
                            </span>
                        </button>

                        {isDropdownOpen && (
                            <div className="absolute right-0 mt-2 w-44 rounded-md border border-border bg-background shadow z-50">
                                <Link
                                    to="/profile"
                                    className="flex items-center gap-2 px-4 py-2 text-sm rounded-md hover:bg-muted active:bg-muted/70 focus-visible:ring-1 focus-visible:ring-ring focus:outline-none transition-colors"
                                >
                                    <CgProfile size={18} />
                                    Profile
                                </Link>
                                <Link
                                    to="/setting"
                                    className="flex items-center gap-2 px-4 py-2 text-sm rounded-md hover:bg-muted active:bg-muted/70 focus-visible:ring-1 focus-visible:ring-ring focus:outline-none transition-colors"
                                >
                                    <Settings size={18} />
                                    Settings
                                </Link>
                                <hr className="my-1 border-border" />
                                <Link
                                    to="/login"
                                    className="flex items-center gap-2 px-4 py-2 text-sm rounded-md hover:bg-muted active:bg-muted/70 focus-visible:ring-1 focus-visible:ring-ring focus:outline-none transition-colors"
                                >
                                    <LogOut size={18} />
                                    Logout
                                </Link>
                            </div>
                        )}
                    </div>
                </header>

                {/* Page Content */}
                <div className="flex-1 overflow-auto p-4">
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
    );
};

export default DashboardLayout;
