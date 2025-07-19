import React, { useEffect, useState } from "react";
import { ArrowRight } from "lucide-react";
import { subjectsData } from "@/components/subject-data";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

const Subject = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [visibleCount, setVisibleCount] = useState(8); // show 8 initially

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  const handleLoadMore = () => {
    setVisibleCount((prev) => prev + 8); // load 8 more on click
  };

  const visibleSubjects = subjectsData.slice(0, visibleCount);
  const hasMore = visibleCount < subjectsData.length;

  return (
    <div className="min-h-screen bg-background text-foreground p-10">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {loading
          ? Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className="bg-card border border-border rounded-xl h-72 flex flex-col "
              >
                <Skeleton className="h-32 w-full" />
                <div className="p-4 flex flex-col flex-1">
                  <Skeleton className="h-4 w-3/4 mb-2" />
                  <Skeleton className="h-3 w-full mb-2" />
                  <Skeleton className="h-3 w-5/6 mb-4" />
                  <Skeleton className="h-9 w-28 mt-auto" />
                </div>
              </div>
            ))
          : visibleSubjects.map((subject, index) => (
              <div
                key={index}
                onClick={() => navigate(subject.slug)}
                className="bg-card text-card-foreground border border-border rounded-md flex flex-col gap-4  cursor-pointer hover:shadow-md transition"
              >
                <div className=" bg-gray-100 aspect-[320/200] rounded-md">
                  <img
                    src={subject.img}
                    alt={subject.title}
                    className="w-full h-full object-cover rounded-t-md"
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src = "/fallback-image.png";
                    }}
                  />
                </div>
                <div className="p-4 flex flex-col flex-1">
                  <h2 className="text-base font-semibold mb-1 line-clamp-1">
                    {subject.title}
                  </h2>
                  <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                    {subject.description}
                  </p>
                  <Button className="mt-auto inline-flex items-center justify-center gap-1 bg-primary text-primary-foreground text-sm font-medium px-4 py-2 rounded-md hover:opacity-90 transition w-fit">
                    Continue Study <ArrowRight size={16} />
                  </Button>
                </div>
              </div>
            ))}
      </div>

      {/* Load More Button */}
      {!loading && hasMore && (
        <div className="flex justify-center mt-8">
          <Button variant="ghost"
            onClick={handleLoadMore}
            className="bg-muted text-muted-foreground hover:bg-muted/80 transition"
          > 
            Load More
          </Button>
        </div>
      )}
    </div>
  );
};

export default Subject;
