import React from "react";
import { useNavigate } from "react-router-dom";
import { useLms } from "@/context/LmsContext";
import {
  GraduationCap,
  Users,
  FileText,
  Award,
  BookOpen,
  ArrowRight,
  Plus,
  CheckCircle2,
  School,
  Clock,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function ClassesPage() {
  const navigate = useNavigate();
  const { classes, papers, students } = useLms();

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs px-2.5 py-0.5 rounded-full font-semibold bg-primary/10 text-primary border border-primary/20">
              Grades 8 — 12
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground mt-1">
            Classes Directory & Exam Centers
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Browse and manage dedicated paper repositories, subject curriculums, and student rosters for each class.
          </p>
        </div>

        <Button
          onClick={() => navigate("/classes/10")}
          className="gap-2 shadow-sm font-semibold self-start sm:self-auto"
        >
          <Plus className="h-4 w-4" />
          Create Exam Paper
        </Button>
      </div>

      {/* Grid of Classes 8 to 12 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {classes.map((cls) => {
          const classPapers = papers.filter(
            (p) => String(p.classId) === String(cls.id)
          );
          const publishedCount = classPapers.filter(
            (p) => p.status === "Published"
          ).length;

          return (
            <div
              key={cls.id}
              onClick={() => navigate(`/classes/${cls.id}`)}
              className="group relative bg-card text-card-foreground border border-border rounded-2xl p-6 hover:border-primary hover:shadow-xl transition-all duration-300 cursor-pointer flex flex-col justify-between space-y-5"
            >
              <div className="space-y-4">
                {/* Top Badge Row */}
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-primary/10 text-primary border border-primary/20">
                    {cls.name}
                  </span>
                  <span className="text-xs text-muted-foreground font-mono font-medium">
                    {cls.room}
                  </span>
                </div>

                {/* Title & Level */}
                <div>
                  <h2 className="text-2xl font-black tracking-tight text-foreground group-hover:text-primary transition-colors">
                    {cls.name}
                  </h2>
                  <p className="text-xs font-semibold text-primary/80 mt-0.5">
                    {cls.level}
                  </p>
                  <p className="text-xs text-muted-foreground leading-relaxed mt-2 line-clamp-2">
                    {cls.description}
                  </p>
                </div>

                {/* Subjects Offered Tags */}
                <div>
                  <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider block mb-1.5">
                    Curriculum Subjects:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {cls.subjects.slice(0, 4).map((sub) => (
                      <span
                        key={sub}
                        className="text-[11px] px-2 py-0.5 rounded-md bg-muted text-muted-foreground border border-border/60"
                      >
                        {sub}
                      </span>
                    ))}
                    {cls.subjects.length > 4 && (
                      <span className="text-[11px] px-2 py-0.5 rounded-md bg-primary/5 text-primary font-semibold">
                        +{cls.subjects.length - 4} more
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Class Metrics Footer */}
              <div className="pt-4 border-t border-border space-y-3 text-xs">
                <div className="grid grid-cols-3 gap-2 text-center p-2.5 rounded-xl bg-muted/40 border border-border/50">
                  <div>
                    <div className="font-bold text-foreground text-sm">
                      {classPapers.length}
                    </div>
                    <div className="text-[10px] text-muted-foreground">Papers</div>
                  </div>
                  <div className="border-x border-border/80">
                    <div className="font-bold text-foreground text-sm">
                      {cls.studentCount}
                    </div>
                    <div className="text-[10px] text-muted-foreground">Students</div>
                  </div>
                  <div>
                    <div className="font-bold text-emerald-600 dark:text-emerald-400 text-sm">
                      {cls.avgPerformance}%
                    </div>
                    <div className="text-[10px] text-muted-foreground">Avg Score</div>
                  </div>
                </div>

                <div className="flex items-center justify-between text-muted-foreground pt-1">
                  <span>Incharge: {cls.teacher}</span>
                  <span className="flex items-center font-semibold text-primary group-hover:translate-x-1 transition-transform">
                    Enter Hub <ArrowRight className="h-3.5 w-3.5 ml-1" />
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
