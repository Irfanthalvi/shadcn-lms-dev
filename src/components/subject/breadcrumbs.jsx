import React from "react";
import { useLocation, Link } from "react-router-dom";
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
  const path = location.pathname;

  const getBreadcrumbs = () => {
    const crumbs = [];

    if (path === "/" || path === "/dashboard") {
      crumbs.push({ label: "Dashboard", link: null });
      return crumbs;
    }

    if (path === "/classes") {
      crumbs.push({ label: "Classes", link: null });
      return crumbs;
    }

    if (path === "/students") {
      crumbs.push({ label: "Students Directory", link: null });
      return crumbs;
    }

    if (path === "/profile") {
      crumbs.push({ label: "Profile", link: null });
      return crumbs;
    }

    // Nested Class Routes: /classes/:classId/subjects/...
    if (path.startsWith("/classes/")) {
      const parts = path.split("/").filter(Boolean); // ['classes', classId, 'subjects', subjectId, 'chapters', chapterId, 'quiz']
      crumbs.push({ label: "Classes", link: "/classes" });

      if (parts.length >= 3 && parts[2] === "subjects") {
        crumbs.push({ label: "Subjects", link: `/classes/${parts[1]}/subjects` });
      }

      if (parts.length >= 5 && parts[4] === "chapters") {
        crumbs.push({
          label: "Chapters",
          link: `/classes/${parts[1]}/subjects/${parts[3]}/chapters`,
        });
      }

      if (parts.length >= 7 && parts[6] === "quiz") {
        crumbs.push({ label: "Quizzes", link: null });
      }

      return crumbs;
    }

    return [{ label: "Portal", link: null }];
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
