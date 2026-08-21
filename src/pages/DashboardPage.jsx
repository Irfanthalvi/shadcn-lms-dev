import React from "react";
import { useNavigate } from "react-router-dom";
import { useLms } from "@/context/LmsContext";
import {
  GraduationCap,
  Users,
  FileText,
  Award,
  BookOpen,
  Calendar,
  Clock,
  TrendingUp,
  Plus,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  Bell,
  Layers,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function DashboardPage() {
  const navigate = useNavigate();
  const { classes, papers, students, announcements, assignments } = useLms();

  const totalStudents = students.length || 350;
  const publishedPapers = papers.filter((p) => p.status === "Published").length;
  const recentPapers = papers.slice(0, 4);

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-300">
      {/* Welcome Hero Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary via-primary/90 to-primary/80 text-primary-foreground p-6 sm:p-10 shadow-xl shadow-primary/10">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md text-xs font-semibold">
              <Sparkles className="h-3.5 w-3.5" />
              <span>Academic Session 2025-2026 • Classes 8 to 12</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
              Welcome to LMS School System
            </h1>
            <p className="text-sm sm:text-base text-primary-foreground/85 leading-relaxed">
              Comprehensive assessment and learning management platform. Manage exam papers, students, classes, and academic results across Classes 8 through 12.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => navigate("/classes/10")}
                className="font-semibold shadow-sm text-xs sm:text-sm h-9"
              >
                Go to Class 10 Hub
                <ArrowRight className="h-4 w-4 ml-1.5" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate("/papers")}
                className="bg-white/10 hover:bg-white/20 text-primary-foreground border-white/20 font-semibold text-xs sm:text-sm h-9"
              >
                <FileText className="h-4 w-4 mr-1.5" />
                View Paper Bank
              </Button>
            </div>
          </div>

          {/* Quick Stats Summary Bubble */}
          <div className="grid grid-cols-2 gap-3 p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 text-center min-w-[240px]">
            <div className="p-2">
              <div className="text-2xl sm:text-3xl font-extrabold">{classes.length}</div>
              <div className="text-xs text-primary-foreground/80 font-medium">Active Classes</div>
            </div>
            <div className="p-2 border-l border-white/15">
              <div className="text-2xl sm:text-3xl font-extrabold">{papers.length}</div>
              <div className="text-xs text-primary-foreground/80 font-medium">Exam Papers</div>
            </div>
            <div className="p-2 border-t border-white/15">
              <div className="text-2xl sm:text-3xl font-extrabold">{totalStudents}</div>
              <div className="text-xs text-primary-foreground/80 font-medium">Total Students</div>
            </div>
            <div className="p-2 border-t border-l border-white/15">
              <div className="text-2xl sm:text-3xl font-extrabold">95.2%</div>
              <div className="text-xs text-primary-foreground/80 font-medium">Avg Pass Rate</div>
            </div>
          </div>
        </div>

        {/* Decorative background glow circles */}
        <div className="absolute -top-12 -right-12 w-64 h-64 bg-white/10 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute -bottom-16 -left-16 w-80 h-80 bg-black/10 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* KPI Top Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        <div
          onClick={() => navigate("/classes")}
          className="bg-card text-card-foreground border border-border rounded-2xl p-5 hover:border-primary/40 hover:shadow-md transition cursor-pointer flex flex-col justify-between"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Enrolled Classes
            </span>
            <div className="p-2 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400">
              <GraduationCap className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold text-foreground">Classes 8 — 12</div>
            <p className="text-xs text-muted-foreground mt-0.5">
              5 Dedicated Grade Sections
            </p>
          </div>
        </div>

        <div
          onClick={() => navigate("/papers")}
          className="bg-card text-card-foreground border border-border rounded-2xl p-5 hover:border-primary/40 hover:shadow-md transition cursor-pointer flex flex-col justify-between"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Published Papers
            </span>
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
              <FileText className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold text-foreground">{publishedPapers} Papers</div>
            <p className="text-xs text-emerald-600 dark:text-emerald-400 font-medium mt-0.5">
              Across all 5 classes
            </p>
          </div>
        </div>

        <div
          onClick={() => navigate("/students")}
          className="bg-card text-card-foreground border border-border rounded-2xl p-5 hover:border-primary/40 hover:shadow-md transition cursor-pointer flex flex-col justify-between"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Registered Students
            </span>
            <div className="p-2 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400">
              <Users className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold text-foreground">{totalStudents} Students</div>
            <p className="text-xs text-muted-foreground mt-0.5">
              Active Attendance Rate 94.8%
            </p>
          </div>
        </div>

        <div
          onClick={() => navigate("/results")}
          className="bg-card text-card-foreground border border-border rounded-2xl p-5 hover:border-primary/40 hover:shadow-md transition cursor-pointer flex flex-col justify-between"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Average Score
            </span>
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400">
              <Award className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold text-foreground">84.2%</div>
            <p className="text-xs text-amber-600 dark:text-amber-400 font-medium mt-0.5">
              +4.2% from previous term
            </p>
          </div>
        </div>
      </div>

      {/* Class 8-12 Quick Navigation Cards */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-foreground">
              Class Assessment Sections
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground">
              Select a class to add, view, edit, and manage exam papers.
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate("/classes")}
            className="text-xs h-8"
          >
            View All Classes
            <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {classes.map((cls) => {
            const classPaperList = papers.filter(
              (p) => String(p.classId) === String(cls.id)
            );
            return (
              <div
                key={cls.id}
                onClick={() => navigate(`/classes/${cls.id}`)}
                className="group relative bg-card text-card-foreground border border-border hover:border-primary rounded-2xl p-5 hover:shadow-lg transition-all duration-200 cursor-pointer flex flex-col justify-between space-y-4"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-primary">
                      {cls.level.split("(")[0].trim()}
                    </span>
                    <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-muted text-muted-foreground">
                      {cls.room}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors">
                    {cls.name}
                  </h3>
                  <p className="text-xs text-muted-foreground line-clamp-2 mt-1">
                    {cls.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-border/70 space-y-2 text-xs">
                  <div className="flex items-center justify-between text-muted-foreground">
                    <span>Papers Bank:</span>
                    <span className="font-semibold text-foreground">
                      {classPaperList.length} Papers
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-muted-foreground">
                    <span>Students:</span>
                    <span className="font-semibold text-foreground">
                      {cls.studentCount} Students
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-muted-foreground">
                    <span>Avg Score:</span>
                    <span className="font-bold text-emerald-600 dark:text-emerald-400">
                      {cls.avgPerformance}%
                    </span>
                  </div>

                  <Button
                    variant="secondary"
                    size="sm"
                    className="w-full text-xs font-semibold h-8 mt-2 group-hover:bg-primary group-hover:text-primary-foreground transition-colors"
                  >
                    Manage {cls.name} Papers
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Two Column Layout: Recent Papers & Announcements/Timetable */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Recent Exam Papers */}
        <div className="lg:col-span-2 bg-card border border-border rounded-2xl p-6 space-y-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base sm:text-lg font-bold text-foreground">
                Recent Exam Papers & Tests
              </h3>
              <p className="text-xs text-muted-foreground">
                Latest assessments created across Classes 8 through 12
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate("/papers")}
              className="text-xs h-8"
            >
              All Papers
            </Button>
          </div>

          <div className="space-y-3">
            {recentPapers.map((paper) => (
              <div
                key={paper.id}
                onClick={() => navigate(`/classes/${paper.classId}`)}
                className="flex items-center justify-between gap-3 p-3.5 rounded-xl border border-border hover:border-primary/40 hover:bg-muted/30 transition cursor-pointer"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="p-2.5 rounded-lg bg-primary/10 text-primary shrink-0">
                    <FileText className="h-4 w-4" />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold px-2 py-0.5 rounded bg-muted text-foreground">
                        {paper.className}
                      </span>
                      <span className="text-xs text-muted-foreground font-medium">
                        {paper.subject}
                      </span>
                    </div>
                    <h4 className="text-sm font-semibold text-foreground truncate mt-0.5">
                      {paper.title}
                    </h4>
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0 text-right">
                  <div className="hidden sm:block text-xs text-muted-foreground">
                    <div>{paper.totalMarks} Marks</div>
                    <div>{paper.durationMins} Mins</div>
                  </div>
                  <span
                    className={`text-xs px-2.5 py-0.5 rounded-full font-medium border ${
                      paper.status === "Published"
                        ? "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-800"
                        : "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-400 dark:border-amber-800"
                    }`}
                  >
                    {paper.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right 1 Col: Urgent Notices & Upcoming Timetable */}
        <div className="space-y-6">
          {/* Announcements Card */}
          <div className="bg-card border border-border rounded-2xl p-5 space-y-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Bell className="h-4 w-4 text-primary" />
                <h3 className="text-sm font-bold text-foreground">
                  Notices & Circulars
                </h3>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate("/announcements")}
                className="text-xs h-7 px-2"
              >
                View
              </Button>
            </div>

            <div className="space-y-3">
              {announcements.slice(0, 3).map((ann) => (
                <div
                  key={ann.id}
                  className="p-3 rounded-xl border border-border/80 bg-muted/20 space-y-1 text-xs"
                >
                  <div className="flex items-center justify-between">
                    <span
                      className={`font-semibold px-2 py-0.5 rounded text-[10px] ${
                        ann.priority === "Urgent"
                          ? "bg-destructive/10 text-destructive"
                          : "bg-primary/10 text-primary"
                      }`}
                    >
                      {ann.priority}
                    </span>
                    <span className="text-muted-foreground text-[11px]">
                      {ann.date}
                    </span>
                  </div>
                  <h4 className="font-semibold text-foreground line-clamp-1">
                    {ann.title}
                  </h4>
                  <p className="text-muted-foreground line-clamp-2">
                    {ann.content}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Action Box */}
          <div className="bg-gradient-to-br from-primary/5 via-primary/10 to-transparent border border-primary/20 rounded-2xl p-5 space-y-3 text-center">
            <h4 className="text-sm font-bold text-foreground">
              Create New Assessment
            </h4>
            <p className="text-xs text-muted-foreground">
              Quickly build question papers with MCQs, short and long questions.
            </p>
            <Button
              className="w-full text-xs font-semibold shadow-md"
              onClick={() => navigate("/classes/10")}
            >
              <Plus className="h-4 w-4 mr-1" />
              Build Exam Paper
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
