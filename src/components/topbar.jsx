import { FaChevronDown } from "react-icons/fa";
import { LogOut, Settings } from "lucide-react";
import { CgProfile } from "react-icons/cg";
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

const Topbar = ({ toggleSidebar, setIsModalOpen, profile }) => {
  return (
    <header className="sticky top-0 z-30 flex items-center justify-between h-[75px] px-4 border-b border-border bg-background">
      {/* Left Section */}
      <div className="flex items-center justify-center gap-4 min-w-0">
        <Button
          variant="outline"
          size="icon"
          onClick={toggleSidebar}
          className="shrink-0"
        >
          ☰
        </Button>
        <div className="flex items-center h-10 overflow-hidden">
          <Breadcrumbs />
        </div>
      </div>

      {/* Right Section - Profile Dropdown */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="flex items-center gap-2 px-3 py-2 rounded-full hover:bg-muted"
          >
            <Avatar className="h-10 w-10 border border-border">
              <AvatarImage src={profile.image || "/images/profile.png"} />
              <AvatarFallback>U</AvatarFallback>
            </Avatar>
            <span className="hidden md:flex items-center text-sm font-medium max-w-[140px] overflow-hidden text-ellipsis whitespace-nowrap font-monstrat-hadding">
              {profile.name}
              <FaChevronDown className="ml-1" />
            </span>
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent
          align="end"
          className="w-44 rounded-md border border-border bg-background shadow-md"
        >
          <DropdownMenuItem
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 cursor-pointer"
          >
            <CgProfile size={18} />
            Profile
          </DropdownMenuItem>

          <DropdownMenuItem
            onClick={() => (window.location.href = "/setting")}
            className="flex items-center gap-2 cursor-pointer"
          >
            <Settings size={18} />
            Settings
          </DropdownMenuItem>

          <DropdownMenuSeparator />

          <DropdownMenuItem
            onClick={() => (window.location.href = "/login")}
            className="flex items-center gap-2 text-destructive cursor-pointer"
          >
            <LogOut size={18} />
            Logout
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  );
};

export default Topbar;
