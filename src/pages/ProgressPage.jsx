import React, { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useLms } from "@/context/LmsContext";
import { useAuth } from "@/context/AuthContext";
import {
  BarChart3,
  Trophy,
  CheckCircle2,
  XCircle,
  TrendingUp,
  AlertCircle,
  BookOpen,
  ArrowRight,
  Flame,
  Clock,
  Sparkles,
  Layers,
  Award,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ProgressPage() {
  const navigate = useNavigate();
  const { classes, subjects, chapters, quizzes, studentAttempts } = useLms();
  const { user, userProfile, isAdmin } = useAuth();

  const displayName = userProfile?.name || user?.displayName || "Student";

  // Filter attempts for current user
  const userAttempts = useMemo(() => {
    if (!user) return [];
    return studentAttempts.filter((a) => a.userId === user.uid || !a.userId);
  }, [studentAttempts, user]);

  // Class-specific filtering for students
  const studentClassId = !isAdmin && userProfile?.classId ? String(userProfile.classId) : null;
  const relevantQuizzes = studentClassId
    ? quizzes.filter((q) => String(q.classId) === studentClassId)
    : quizzes;
  const relevantSubjects = studentClassId
    ? subjects.filter((s) => String(s.classId) === studentClassId)
    : subjects;

  const totalQuizzes = relevantQuizzes.length;
  const attemptedQuizzes = userAttempts.length;
  const passedQuizzes = userAttempts.filter((a) => a.passed).length;
  const avgScore =
    attemptedQuizzes > 0
      ? Math.round(
          userAttempts.reduce((acc, curr) => acc + (curr.percentage || 0), 0) / attemptedQuizzes
        )
      : 0;

  const overallProgress =
    totalQuizzes > 0 ? Math.min(Math.round((passedQuizzes / totalQuizzes) * 100), 100) : 0;

  // Subject-wise performance breakdown
  const subjectStats = useMemo(() => {
    return relevantSubjects.map((sub) => {
      const subQuizzes = relevantQuizzes.filter((q) => String(q.subjectId) === String(sub.id));
      const subChapters = chapters.filter((c) => String(c.subjectId) === String(sub.id));
      const subAttempts = userAttempts.filter((a) => String(a.subjectId) === String(sub.id));

      const passedCount = subAttempts.filter((a) => a.passed).length;
      const subAvg =
        subAttempts.length > 0
          ? Math.round(
              subAttempts.reduce((acc, c) => acc + (c.percentage || 0), 0) / subAttempts.length
            )
          : 0;

      const completionRate =
        subQuizzes.length > 0
          ? Math.min(Math.round((passedCount / subQuizzes.length) * 100), 100)
          : 0;

      return {
        ...sub,
        totalQuizzes: subQuizzes.length,
        totalChapters: subChapters.length,
        attemptsCount: subAttempts.length,
        passedCount,
        avgScore: subAvg,
        completionRate,
      };
    });
  }, [relevantSubjects, chapters, relevantQuizzes, userAttempts]);

  // Strong vs Weak subjects
  const strongSubjects = useMemo(() => {
    return subjectStats.filter((s) => s.avgScore >= 75 || s.completionRate >= 60);
  }, [subjectStats]);

  const weakSubjects = useMemo(() => {
    return subjectStats.filter((s) => s.avgScore < 75 && s.attemptsCount > 0);
  }, [subjectStats]);

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs px-2.5 py-0.5 rounded-full font-bold bg-primary/10 text-primary border border-primary/20">
              Learning Analytics
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-foreground mt-1">
            Student Performance & Progress
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
            Track your curriculum completion, chapter quiz mastery, and academic subject benchmarks.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate("/classes")}
            className="text-xs h-9 rounded-xl font-semibold"
          >
            Explore Syllabus
          </Button>
          <Button
            size="sm"
            onClick={() => navigate("/quizzes")}
            className="text-xs h-9 rounded-xl font-bold shadow-sm"
          >
            Take a Quiz
          </Button>
        </div>
      </div>

      {/* Top High-End Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        {/* Metric 1: Overall Progress */}
        <div className="p-5 rounded-2xl bg-card border border-border/80 shadow-sm space-y-3">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-[11px] font-bold uppercase tracking-wider">Overall Mastery</span>
            <div className="p-1.5 rounded-xl bg-primary/10 text-primary">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-black text-foreground">{overallProgress}%</div>
          <div className="w-full h-2 rounded-full bg-muted overflow-hidden">
            <div
              className="h-full bg-primary rounded-full transition-all duration-700"
              style={{ width: `${overallProgress}%` }}
            />
          </div>
          <div className="text-[11px] text-muted-foreground">
            {passedQuizzes} of {totalQuizzes} quizzes passed
          </div>
        </div>

        {/* Metric 2: Quiz Average Score */}
        <div className="p-5 rounded-2xl bg-card border border-border/80 shadow-sm space-y-3">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-[11px] font-bold uppercase tracking-wider">Average Score</span>
            <div className="p-1.5 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
              <Trophy className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-black text-foreground">{avgScore}%</div>
          <div className="w-full h-2 rounded-full bg-muted overflow-hidden">
            <div
              className="h-full bg-emerald-500 rounded-full transition-all duration-700"
              style={{ width: `${avgScore}%` }}
            />
          </div>
          <div className="text-[11px] text-muted-foreground">Across all chapter assessments</div>
        </div>

        {/* Metric 3: Quizzes Completed */}
        <div className="p-5 rounded-2xl bg-card border border-border/80 shadow-sm space-y-3">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-[11px] font-bold uppercase tracking-wider">Assessments</span>
            <div className="p-1.5 rounded-xl bg-primary/10 text-primary">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-black text-foreground">{attemptedQuizzes}</div>
          <div className="text-[11px] text-muted-foreground font-medium pt-3">
            {passedQuizzes} Passed • {attemptedQuizzes - passedQuizzes} Retries Needed
          </div>
        </div>

        {/* Metric 4: Study Streak */}
        <div className="p-5 rounded-2xl bg-card border border-border/80 shadow-sm space-y-3">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-[11px] font-bold uppercase tracking-wider">Study Streak</span>
            <div className="p-1.5 rounded-xl bg-amber-500/10 text-amber-500">
              <Flame className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-black text-foreground">7 Days</div>
          <div className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold pt-3">
            Consistent learning streak!
          </div>
        </div>
      </div>

      {/* Strong vs Weak Subjects Analytics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Strong Subjects */}
        <div className="p-6 rounded-2xl bg-card border border-border/80 shadow-sm space-y-4">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-foreground">Strong Subjects</h2>
              <p className="text-xs text-muted-foreground">Areas where you excel with high accuracy</p>
            </div>
          </div>

          {strongSubjects.length === 0 ? (
            <div className="py-6 text-center text-xs text-muted-foreground">
              Take more chapter quizzes to highlight your strongest subjects.
            </div>
          ) : (
            <div className="space-y-3">
              {strongSubjects.slice(0, 3).map((s) => (
                <div
                  key={s.id}
                  className="p-3.5 rounded-xl bg-muted/25 border border-border/60 flex items-center justify-between"
                >
                  <div className="space-y-0.5">
                    <div className="font-bold text-sm text-foreground">{s.name}</div>
                    <div className="text-[11px] text-muted-foreground">
                      {s.passedCount} Passed Quizzes • {s.completionRate}% Done
                    </div>
                  </div>
                  <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20">
                    {s.avgScore > 0 ? `${s.avgScore}% Avg` : "High Mastery"}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Subjects Requiring Revision */}
        <div className="p-6 rounded-2xl bg-card border border-border/80 shadow-sm space-y-4">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-500">
              <AlertCircle className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-foreground">Focus & Revision Areas</h2>
              <p className="text-xs text-muted-foreground">Topics that need an extra round of practice</p>
            </div>
          </div>

          {weakSubjects.length === 0 ? (
            <div className="py-6 text-center text-xs text-muted-foreground">
              Great work! No weak subject areas flagged below 70%.
            </div>
          ) : (
            <div className="space-y-3">
              {weakSubjects.slice(0, 3).map((s) => (
                <div
                  key={s.id}
                  className="p-3.5 rounded-xl bg-muted/25 border border-border/60 flex items-center justify-between"
                >
                  <div className="space-y-0.5">
                    <div className="font-bold text-sm text-foreground">{s.name}</div>
                    <div className="text-[11px] text-muted-foreground">
                      Current Score: {s.avgScore}%
                    </div>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() =>
                      navigate(`/classes/${s.classId}/subjects/${s.id}/chapters`)
                    }
                    className="h-8 text-xs font-semibold rounded-xl"
                  >
                    Practice <ArrowRight className="w-3 h-3 ml-1" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Subject-wise Progress Grid */}
      <div className="space-y-4">
        <div>
          <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-primary" />
            Subject-wise Curriculum Breakdown
          </h2>
          <p className="text-xs text-muted-foreground">
            Track chapter progress and assessment scores across each syllabus course.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {subjectStats.map((sub) => (
            <div
              key={sub.id}
              className="p-5 rounded-2xl bg-card border border-border/80 shadow-sm space-y-4 flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-lg bg-primary/10 text-primary border border-primary/20">
                    {sub.code || "SUB"}
                  </span>
                  <span className="text-xs font-bold text-foreground">{sub.completionRate}%</span>
                </div>

                <div>
                  <h3 className="text-base font-bold text-foreground">{sub.name}</h3>
                  <div className="flex items-center gap-3 text-xs text-muted-foreground mt-1">
                    <span>{sub.totalChapters} Chapters</span>
                    <span>•</span>
                    <span>{sub.totalQuizzes} Quizzes</span>
                  </div>
                </div>

                <div className="w-full h-2 rounded-full bg-muted overflow-hidden">
                  <div
                    className="h-full bg-primary rounded-full transition-all duration-500"
                    style={{ width: `${sub.completionRate}%` }}
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-border/60 flex items-center justify-between text-xs">
                <span className="text-muted-foreground">
                  Score: {sub.avgScore > 0 ? `${sub.avgScore}%` : "Not attempted"}
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() =>
                    navigate(`/classes/${sub.classId}/subjects/${sub.id}/chapters`)
                  }
                  className="text-xs font-bold text-primary p-0 h-auto gap-1 hover:underline"
                >
                  View Chapters <ArrowRight className="w-3.5 h-3.5" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Quiz Performance History */}
      <div className="space-y-4">
        <div>
          <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
            <Trophy className="w-5 h-5 text-primary" />
            Assessment History & Past Attempts
          </h2>
          <p className="text-xs text-muted-foreground">
            Complete record of your chapter test attempts and accuracy metrics.
          </p>
        </div>

        {userAttempts.length === 0 ? (
          <div className="p-8 text-center bg-card border border-dashed border-border rounded-2xl text-xs text-muted-foreground space-y-2">
            <div>No assessment attempts recorded yet.</div>
            <Button
              size="sm"
              onClick={() => navigate("/classes")}
              className="rounded-xl text-xs font-semibold"
            >
              Start First Quiz
            </Button>
          </div>
        ) : (
          <div className="bg-card border border-border/80 rounded-2xl overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs sm:text-sm">
                <thead className="bg-muted/30 text-muted-foreground text-[11px] uppercase tracking-wider border-b border-border font-bold">
                  <tr>
                    <th className="px-5 py-3.5">Assessment Title</th>
                    <th className="px-4 py-3.5">Score</th>
                    <th className="px-4 py-3.5">Percentage</th>
                    <th className="px-4 py-3.5">Status</th>
                    <th className="px-5 py-3.5 text-right">Time Taken</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60">
                  {userAttempts.map((att, i) => (
                    <tr key={att.id || i} className="hover:bg-muted/25 transition-colors">
                      <td className="px-5 py-3.5 font-bold text-foreground">
                        {att.quizTitle}
                      </td>
                      <td className="px-4 py-3.5 text-muted-foreground">
                        {att.score} / {att.totalQuestions}
                      </td>
                      <td className="px-4 py-3.5 font-black text-foreground">
                        {att.percentage}%
                      </td>
                      <td className="px-4 py-3.5">
                        <span
                          className={`inline-flex items-center gap-1 text-[11px] px-2.5 py-0.5 rounded-full font-bold border ${
                            att.passed
                              ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20"
                              : "bg-destructive/10 text-destructive border-destructive/20"
                          }`}
                        >
                          {att.passed ? "Passed" : "Needs Revision"}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 text-right text-muted-foreground font-mono text-xs">
                        {att.timeTaken || "12m 40s"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
