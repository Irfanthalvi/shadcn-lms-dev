import { useEffect, useState } from "react";
import { useLocation, useParams, Link } from "react-router-dom";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { subjectsData } from "@/components/subject/subject-data";

export default function Breadcrumbs() {
  const location = useLocation();
  const { id, subject, chapterId } = useParams();
  const [chapterTitle, setChapterTitle] = useState("");

  useEffect(() => {
    if (id) {
      const matched = subjectsData.find((s) => s.slug === `/chapter/${id}`);
      setChapterTitle(matched?.title || `Chapter: ${id}`);
    }
  }, [id]);

  // 👉 Split current path into parts
  const pathParts = location.pathname.split("/").filter(Boolean);

  // 👉 Map to breadcrumb items
  const items = pathParts.map((part, index) => {
    const to = "/" + pathParts.slice(0, index + 1).join("/");

    // Human readable labels
    let label = part;

    if (part === "subjects") label = "Subjects";
    else if (part === "chapter" && chapterTitle) label = chapterTitle;
    else if (part === "chapter") label = "Chapter";
    else if (part === "assessment") label = "Assessment";
    else if (part === "assessment-page") label = "Assessment Page";
    else if (subject && part === subject)
      label = subject.charAt(0).toUpperCase() + subject.slice(1);
    else if (chapterId && part === chapterId)
      label = chapterId.replace("chapter", "Chapter ");

    return {
      label,
      link: index < pathParts.length - 1 ? to : null, // last item no link
    };
  });

  return (
    <Breadcrumb className="w-full">
      <BreadcrumbList className="flex items-center gap-1 w-full overflow-x-auto whitespace-nowrap scrollbar-hide">
        {/* Desktop: full breadcrumb */}
        <div className="hidden sm:flex items-center gap-1">
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link to="/subjects" className="text-muted-foreground">
                Home
              </Link>
            </BreadcrumbLink>
          </BreadcrumbItem>

          {items.map((item, index) => (
            <span key={index} className="flex items-center gap-1">
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                {item.link ? (
                  <BreadcrumbLink asChild>
                    <Link to={item.link} className="text-muted-foreground">
                      {item.label}
                    </Link>
                  </BreadcrumbLink>
                ) : (
                  <span className="text-muted-foreground font-medium">
                    {item.label}
                  </span>
                )}
              </BreadcrumbItem>
            </span>
          ))}
        </div>

        {/* Mobile: only last item */}
        <div className="sm:hidden block font-medium text-sm text-muted-foreground truncate">
          {items.length > 0 ? items[items.length - 1].label : "Home"}
        </div>
      </BreadcrumbList>
    </Breadcrumb>
  );
}
