import React, { useEffect, useState } from "react";
import { ArrowRight, Loader } from "lucide-react";
import { subjectsData } from "@/components/subject-data";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

const Subject = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  // Simulate data loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 800); // optional delay
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-muted-foreground">
        <Loader className="w-6 h-6 mr-2 animate-spin" />
        Loading subjects...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground p-10">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {subjectsData.map((subject, index) => (
          <div
            key={index}
            onClick={() => navigate(subject.slug)}
            className="bg-card text-card-foreground border border-border rounded-xl h-72 flex flex-col overflow-hidden cursor-pointer hover:shadow-md transition"
          >
            <div className="h-32 bg-gray-100">
              <img
                src={subject.img}
                alt={subject.title}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src = "/fallback-image.png";
                }}
              />
            </div>
            <div className="p-4 flex flex-col flex-1">
              <h2 className="text-base font-semibold mb-1 line-clamp-1">{subject.title}</h2>
              <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{subject.description}</p>
              {/* <div className="mt-auto inline-flex items-center justify-center gap-1 bg-primary text-primary-foreground text-sm font-medium px-4 py-2 rounded-md hover:opacity-90 transition w-fit">
                Continue Study <ArrowRight size={16} />
              </div> */}
              <Button>Continue Study <ArrowRight size={16}/></Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Subject;
