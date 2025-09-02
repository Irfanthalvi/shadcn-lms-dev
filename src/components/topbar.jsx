import { Link } from "react-router-dom";
import { FaChevronDown } from "react-icons/fa";
import { LogOut, Settings } from "lucide-react";
import { CgProfile } from "react-icons/cg";
import Breadcrumbs from "@/components/subject/breadcrumbs";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

const Topbar = ({
  toggleSidebar,
  dropdownRef,
  isDropdownOpen,
  setIsDropdownOpen,
  setIsModalOpen,
  profile,
}) => {
  return (
    <header className="sticky top-0 z-30 flex items-center justify-between h-[75px] px-4 border-b border-border bg-background">
      <div className="flex items-center justify-center gap-4 min-w-0">
        <button
          onClick={toggleSidebar}
          className="cursor-pointer w-10 h-10 flex items-center justify-center border border-border bg-muted rounded-md transition shrink-0"
        >
          ☰
        </button>
        <div className="flex items-center h-10 overflow-hidden">
          <Breadcrumbs />
        </div>
      </div>

      {/* Profile Dropdown */}
      <div className="relative " ref={dropdownRef}>
        <button
          onClick={() => setIsDropdownOpen((prev) => !prev)}
          className="flex items-center gap-2 px-3 py-2 rounded-full hover:bg-muted cursor-pointer"
        >
          <div className="border border-border rounded-full ">
            <Avatar className="h-10 w-10 ">
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
            <Link
              onClick={() => {
                setIsDropdownOpen(false);
                setIsModalOpen(true);
              }}
              className="w-full text-left flex items-center gap-2 px-4 py-2 text-sm rounded-md hover:bg-muted transition-colors"
            >
              <CgProfile size={18} />
              Profile
            </Link>
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
  );
};

export default Topbar;
