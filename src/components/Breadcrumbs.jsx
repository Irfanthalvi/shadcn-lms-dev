import { useEffect, useState } from "react";
import { useLocation, useParams, Link } from "react-router-dom";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { subjectsData } from "@/components/subject-data";

export default function Breadcrumbs() {
  const location = useLocation();
  const { id, subject, chapterId } = useParams();
  const [chapterTitle, setChapterTitle] = useState("");

  const pathnames = location.pathname.split("/").filter(Boolean);

  useEffect(() => {
    if (id) {
      const matched = subjectsData.find((s) => s.slug === `/chapter/${id}`);
      setChapterTitle(matched?.title || `Chapter: ${id}`);
    }
  }, [id]);

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

        {/* Subject (English) */}
        {location.pathname.includes("/assessment/") && subject && (
          <>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link to={`/chapter/${subject}`} className="text-muted-foreground">
                  {subject.charAt(0).toUpperCase() + subject.slice(1)}
                </Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
          </>
        )}

        {/* Chapter (Chapter 1) */}
        {location.pathname.includes("/assessment/") && chapterId && (
          <>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <span className="text-muted-foreground font-medium cursor-default">
                {chapterId.replace("chapter", "Chapter ")}
              </span>
            </BreadcrumbItem>
          </>
        )}

        {/* ❌ Assessment (do NOT link) */}
        {location.pathname.includes("/assessment/") && (
          <>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <span className="text-muted-foreground font-medium cursor-default">
                Assessment
              </span>
            </BreadcrumbItem>
          </>
        )}

        {/* Fallback: direct chapter page */}
        {location.pathname.startsWith("/chapter/") && id && chapterTitle && (
          <>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <span className="text-muted-foreground font-medium cursor-default">
                {chapterTitle}
              </span>
            </BreadcrumbItem>
          </>
        )}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
