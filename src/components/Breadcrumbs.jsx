import { useEffect, useState } from "react";
import { useLocation, useParams, Link } from "react-router-dom";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { subjectsData } from "./subject-data";

const breadcrumbNameMap = {
  subjects: "All Subjects",
  assessment: "Assessment",
  test: "Test",
  quiz: "Quiz",
};

export default function Breadcrumbs() {
  const location = useLocation();
  const { slug } = useParams();
  const [chapterTitle, setChapterTitle] = useState("");

  const pathnames = location.pathname.split("/").filter(Boolean); // ['chapter', 'english', 'assessment']

  useEffect(() => {
    if (slug) {
      const matched = subjectsData.find((s) => s.slug === `/chapter/${slug}`);
      setChapterTitle(matched?.title || `Chapter: ${slug}`);
    }
  }, [slug]);

  return (
    <Breadcrumb className="mb-4">
      <BreadcrumbList>
        {/* Home */}
        <BreadcrumbItem>
          <BreadcrumbLink asChild>
            <Link to="/subjects" className="text-muted-foreground">
              Home
            </Link>
          </BreadcrumbLink>
        </BreadcrumbItem>

        {/* Always show the book name if it's a chapter path */}
        {location.pathname.startsWith("/chapter/") && slug && chapterTitle && (
          <>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link
                  to={`/chapter/${slug}`}
                  className={pathnames.length === 2 ? "text-muted-foreground font-medium" : ""}
                >
                  {chapterTitle}
                </Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
          </>
        )}

        {/* Loop for the rest of the segments after slug */}
        {pathnames.map((segment, index) => {
          // Skip static 'chapter' and the slug itself (already handled above)
          if (segment === "chapter" || segment === slug) return null;

          const isLast = index === pathnames.length - 1;
          const routeTo = "/" + pathnames.slice(0, index + 1).join("/");

          let label = breadcrumbNameMap[segment] || segment.replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());

          return (
            <div key={index} className="flex items-center">
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link
                    to={routeTo}
                    className={isLast ? "text-muted-foreground font-medium" : ""}
                  >
                    {label}
                  </Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
            </div>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
