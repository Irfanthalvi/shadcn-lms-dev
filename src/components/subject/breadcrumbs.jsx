import React from "react";
import { useLocation, useParams, Link } from "react-router-dom";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Home, ChevronRight } from "lucide-react";

export default function Breadcrumbs() {
  const location = useLocation();
  const { id, subject, chapterId, classId } = useParams();
  const path = location.pathname;

  const getBreadcrumbs = () => {
    const crumbs = [];

    if (path === "/" || path === "/dashboard") {
      crumbs.push({ label: "Dashboard", link: null });
      return crumbs;
    }

    // Classes Routes
    if (path === "/classes") {
      crumbs.push({ label: "Classes", link: null });
      return crumbs;
    }

    if (path.startsWith("/classes/") && classId) {
      crumbs.push({ label: "Classes", link: "/classes" });
      crumbs.push({ label: `Class ${classId}`, link: null });
      return crumbs;
    }

    // Standard LMS Section Routes
    if (path === "/papers") crumbs.push({ label: "Exam Papers", link: null });
    else if (path === "/students") crumbs.push({ label: "Students Directory", link: null });
    else if (path === "/teachers") crumbs.push({ label: "Faculty Directory", link: null });
    else if (path === "/results") crumbs.push({ label: "Exam Results", link: null });
    else if (path === "/assignments") crumbs.push({ label: "Assignments", link: null });
    else if (path === "/study-material") crumbs.push({ label: "Study Material", link: null });
    else if (path === "/announcements") crumbs.push({ label: "Announcements", link: null });
    else if (path === "/settings") crumbs.push({ label: "Settings", link: null });
    else if (path === "/subjects") crumbs.push({ label: "Subjects", link: null });
    else if (path === "/create-assessment") crumbs.push({ label: "Create Assessment", link: null });
    else if (path === "/assessment-page") crumbs.push({ label: "Assessment Builder", link: null });

    // Dynamic routes for subject chapters
    else if (path.startsWith("/chapter/") && id) {
      crumbs.push({ label: "Subjects", link: "/subjects" });
      crumbs.push({
        label: id.charAt(0).toUpperCase() + id.slice(1) + " Chapters",
        link: null,
      });
    }

    // Dynamic routes for taking assessment
    else if (path.startsWith("/assessment/") && subject && chapterId) {
      crumbs.push({ label: "Subjects", link: "/subjects" });
      crumbs.push({
        label: subject.charAt(0).toUpperCase() + subject.slice(1),
        link: `/chapter/${subject}`,
      });
      crumbs.push({
        label: chapterId.replace("chapter", "Chapter "),
        link: null,
      });
    }

    return crumbs;
  };

  const crumbs = getBreadcrumbs();

  return (
    <Breadcrumb className="w-full">
      <BreadcrumbList className="flex items-center gap-1.5 text-xs text-muted-foreground whitespace-nowrap overflow-x-auto scrollbar-none">
        <BreadcrumbItem>
          <BreadcrumbLink asChild>
            <Link
              to="/dashboard"
              className="flex items-center gap-1 text-muted-foreground hover:text-foreground font-medium transition-colors"
            >
              <Home className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">LMS</span>
            </Link>
          </BreadcrumbLink>
        </BreadcrumbItem>

        {crumbs.map((crumb, idx) => (
          <React.Fragment key={idx}>
            <BreadcrumbSeparator className="text-muted-foreground/50">
              <ChevronRight className="h-3.5 w-3.5" />
            </BreadcrumbSeparator>
            <BreadcrumbItem>
              {crumb.link ? (
                <BreadcrumbLink asChild>
                  <Link
                    to={crumb.link}
                    className="text-muted-foreground hover:text-foreground font-medium transition-colors"
                  >
                    {crumb.label}
                  </Link>
                </BreadcrumbLink>
              ) : (
                <span className="font-semibold text-foreground">
                  {crumb.label}
                </span>
              )}
            </BreadcrumbItem>
          </React.Fragment>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
