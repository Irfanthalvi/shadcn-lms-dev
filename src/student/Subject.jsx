import React, { useEffect, useState } from "react";
import { ArrowRight } from "lucide-react";
import { subjectsData } from "@/components/subject/subject-data";
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
    <div className="min-h-screen w-full bg-background text-foreground px-4 sm:px-6 md:px-8 py-10 max-w-[1440px] mx-auto">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {loading
          ? Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className="bg-card border border-border rounded-xl h-72 flex flex-col"
              >
                <Skeleton className="h-32 w-full rounded-t-md" />
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
                onClick={() => navigate(subject.id)}
                className="bg-card text-card-foreground border border-border rounded-md flex flex-col  hover:shadow-md transition overflow-hidden"
              >
                <div className=" aspect-[320/200] w-full">
                  <img
                    src={subject.img}
                    alt={subject.title}
                    className="w-full h-full object-cover "
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src = "/fallback-image.png";
                    }}
                  />
                </div>
                <div className="font-monstrat-hadding p-4 flex flex-col flex-1">
                  <h2 className=" text-base font-semibold">
                    {subject.title}
                  </h2>
                  <p className="font-roboto-para text-primary mb-3">
                    {subject.description}
                  </p>
                  <Button className="font-roboto-hadding mt-auto inline-flex items-center justify-center cursor-pointer gap-1 bg-primary text-primary-foreground text-sm font-medium px-4 py-2 rounded-md transition w-fit">
                    Continue Study <ArrowRight size={16} />
                  </Button>
                </div>
              </div>
            ))}
      </div>

      {/* Load More Button */}
      {!loading && hasMore && (
        <div className="flex justify-center mt-8">
          <Button
            variant="ghost"
            onClick={handleLoadMore}
            className="bg-muted text-muted-foreground cursor-pointer hover:bg-muted/80 transition"
          >
            Load More
          </Button>
        </div>
      )}
    </div>
  );
};

export default Subject;
