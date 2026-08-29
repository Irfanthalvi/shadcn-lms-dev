import React from "react";
import { useNavigate } from "react-router-dom";
import { useLms } from "@/context/LmsContext";
import { useAuth } from "@/context/AuthContext";
import {
  GraduationCap,
  Users,
  BookOpen,
  ArrowRight,
  Sparkles,
  Trophy,
  CheckCircle2,
  Layers,
  Clock,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export default function DashboardPage() {
  const navigate = useNavigate();
  const { classes, subjects, quizzes, students, studentAttempts } = useLms();
  const { user, userProfile, isAdmin } = useAuth();

  const displayName = userProfile?.name || user?.displayName || (isAdmin ? "Administrator" : "Student");

  // Student specific stats
  const completedCount = studentAttempts.length;
  const passedCount = studentAttempts.filter((a) => a.passed).length;
  const avgScore =
    completedCount > 0
      ? Math.round(
          studentAttempts.reduce((acc, curr) => acc + (curr.percentage || 0), 0) /
            completedCount
        )
      : 0;

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6 animate-in fade-in duration-300">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-primary via-primary/95 to-primary/80 text-primary-foreground p-6 sm:p-8 shadow-sm">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 text-xs font-semibold backdrop-blur-sm">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{isAdmin ? "Admin Portal" : "Student Learning Portal"}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Welcome, {displayName}!
            </h1>
            <p className="text-sm text-primary-foreground/90 leading-relaxed">
              {isAdmin
                ? "Manage your school curriculum hierarchy, classes, subjects, and online chapter quizzes."
                : "Select your class to browse syllabus subjects, chapters, and take chapter quizzes."}
            </p>
            <div className="pt-2 flex flex-wrap items-center gap-3">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => navigate("/classes")}
                className="gap-2 font-bold shadow-sm"
              >
                <GraduationCap className="w-4 h-4" />
                {isAdmin ? "Manage Classes" : "Browse Classes"}
                <ArrowRight className="w-4 h-4" />
              </Button>
              {isAdmin && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigate("/students")}
                  className="bg-white/10 hover:bg-white/20 text-white border-white/20 font-semibold"
                >
                  <Users className="w-4 h-4 mr-1.5" />
                  View Students
                </Button>
              )}
            </div>
          </div>

          {/* Quick Summary Counter Box */}
          <div className="grid grid-cols-2 gap-3 p-4 rounded-2xl bg-white/10 border border-white/15 text-center min-w-[220px]">
            <div>
              <div className="text-2xl sm:text-3xl font-extrabold">{classes.length}</div>
              <div className="text-xs text-primary-foreground/80 font-medium">Classes</div>
            </div>
            <div className="border-l border-white/15">
              <div className="text-2xl sm:text-3xl font-extrabold">{subjects.length}</div>
              <div className="text-xs text-primary-foreground/80 font-medium">Subjects</div>
            </div>
            <div className="border-t border-white/15 pt-2">
              <div className="text-2xl sm:text-3xl font-extrabold">
                {isAdmin ? students.length : completedCount}
              </div>
              <div className="text-xs text-primary-foreground/80 font-medium">
                {isAdmin ? "Students" : "Attempts"}
              </div>
            </div>
            <div className="border-t border-l border-white/15 pt-2">
              <div className="text-2xl sm:text-3xl font-extrabold">
                {isAdmin ? quizzes.length : `${avgScore}%`}
              </div>
              <div className="text-xs text-primary-foreground/80 font-medium">
                {isAdmin ? "Quizzes" : "Avg Score"}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
            <GraduationCap className="w-5 h-5 text-primary" />
            {isAdmin ? "Academic Classes" : "Your Classes"}
          </h2>
          <Button
            variant="link"
            onClick={() => navigate("/classes")}
            className="text-xs font-semibold text-primary p-0 h-auto gap-1"
          >
            View All <ArrowRight className="w-3.5 h-3.5" />
          </Button>
        </div>

        {/* Classes Quick Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {classes.map((cls) => {
            const classSubs = subjects.filter((s) => s.classId === cls.id);

            return (
              <div
                key={cls.id}
                onClick={() => navigate(`/classes/${cls.id}/subjects`)}
                className="group p-5 rounded-2xl bg-card border border-border hover:border-primary/50 hover:shadow-md transition-all duration-200 cursor-pointer flex items-center justify-between"
              >
                <div className="space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-primary/10 text-primary">
                    Grade {cls.grade || cls.name}
                  </span>
                  <h3 className="font-bold text-base text-foreground group-hover:text-primary transition-colors">
                    {cls.name}
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    {classSubs.length} Subject{classSubs.length !== 1 ? "s" : ""}
                  </p>
                </div>
                <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-muted-foreground group-hover:bg-primary group-hover:text-primary-foreground transition-colors shrink-0">
                  <ArrowRight className="w-4 h-4" />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Recent Quiz Attempts (Student View) */}
      {!isAdmin && studentAttempts.length > 0 && (
        <div className="space-y-4 pt-2">
          <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
            <Trophy className="w-5 h-5 text-primary" />
            Recent Quiz Attempts
          </h2>

          <div className="space-y-2.5">
            {studentAttempts.slice(0, 5).map((attempt, i) => (
              <div
                key={attempt.id || i}
                className="p-4 rounded-xl bg-card border border-border flex items-center justify-between text-xs"
              >
                <div className="space-y-0.5">
                  <div className="font-bold text-sm text-foreground">{attempt.quizTitle}</div>
                  <div className="text-muted-foreground">
                    Score: {attempt.score}/{attempt.totalQuestions} ({attempt.percentage}%)
                  </div>
                </div>

                <span
                  className={`px-2.5 py-1 rounded-full font-bold ${
                    attempt.passed
                      ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20"
                      : "bg-destructive/10 text-destructive border border-destructive/20"
                  }`}
                >
                  {attempt.passed ? "Passed" : "Failed"}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
