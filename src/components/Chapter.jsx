import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  englishChapters,
  urduChapters,
  islamiatChapters,
  pakstudiesChapters,
  mathChapters,
  physicsChapters,
  chemistryChapters,
  biologyChapters,
  computerChapters,
} from "./subject-name";
import { Loader } from "lucide-react";
import { Button } from "@/components/ui/button";

const SubjectChapters = () => {
  const { id } = useParams(); // subjectId
  const navigate = useNavigate();

  const [chapters, setChapters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [visibleCount, setVisibleCount] = useState(6); // Initial chapters to show

  useEffect(() => {
    const chapterMap = {
      english: englishChapters,
      urdu: urduChapters,
      islamiat: islamiatChapters,
      pakstudies: pakstudiesChapters,
      math: mathChapters,
      physics: physicsChapters,
      chemistry: chemistryChapters,
      biology: biologyChapters,
      cs: computerChapters,
    };

    const selected = chapterMap[id] || [];

    const withLabels = selected.map((ch, idx) => ({
      ...ch,
      label: ch.label || `Chapter ${idx + 1}`,
    }));

    setTimeout(() => {
      setChapters(withLabels);
      setLoading(false);
    }, 800); // Simulated loading time
  }, [id]);

  const handleAssessment = (chapter) => {
    const chapterId = chapter.path.split("/").pop(); // e.g. "chapter1"
    navigate(`/assessment/${id}/${chapterId}`);
  };

  const handleLoadMore = () => {
    setVisibleCount((prev) => prev + 6);
  };

  const visibleChapters = chapters.slice(0, visibleCount);
  const hasMore = visibleCount < chapters.length;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-muted-foreground">
        <Loader className="w-6 h-6 mr-2 animate-spin" />
        Loading chapters...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground px-4 sm:px-6 md:px-8 py-10 max-w-[1440px] mx-auto">
      <div className="space-y-4">
        {visibleChapters.map((chapter, idx) => (
          <div
            key={idx}
            onClick={() => handleAssessment(chapter)}
            className="bg-card text-card-foreground border border-border rounded-lg flex flex-wrap md:flex-nowrap items-center justify-between gap-4 p-4 cursor-pointer hover:shadow-sm transition"
          >
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <div className="bg-secondary text-secondary-foreground p-2 rounded-full text-lg shrink-0">📘</div>
              <div className="min-w-0">
                <h2 className="font-semibold text-base truncate">{chapter.title}</h2>
                <div className="text-muted-foreground text-xs flex flex-wrap gap-4 mt-0.5">
                  <span>📝 35 Marks</span>
                  <span>⏱ 35 Minutes</span>
                </div>
              </div>
            </div>
            <Button className="shrink-0 w-full sm:w-auto">Start</Button>
          </div>
        ))}
      </div>

      {/* Load More Button */}
      {hasMore && (
        <div className="flex justify-center mt-6">
          <Button
            variant="ghost"
            onClick={handleLoadMore}
            className="bg-muted text-muted-foreground hover:bg-muted/80"
          >
            Load More
          </Button>
        </div>
      )}
    </div>
  );
};

export default SubjectChapters;
