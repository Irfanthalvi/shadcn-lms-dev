import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useLms } from "@/context/LmsContext";
import { useAuth } from "@/context/AuthContext";
import {
  GraduationCap,
  Users,
  BookOpen,
  Layers,
  HelpCircle,
  Clock,
  CheckCircle2,
  AlertCircle,
  Plus,
  ArrowRight,
  TrendingUp,
  Sparkles,
  Award,
  Trophy,
  Calendar,
  Activity,
  PlayCircle,
  UserCheck,
  UserX,
  FileText,
  ChevronRight,
  BarChart3,
  Flame,
  ClipboardList,
  BookMarked,
  FileCheck2,
  Bell,
  Eye,
  ShieldCheck,
  Check,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import toast from "react-hot-toast";

export default function DashboardPage() {
  const navigate = useNavigate();
  const {
    classes,
    subjects,
    books,
    chapters,
    quizzes,
    students,
    studentAttempts,
    allQuizAttempts,
    announcements,
    assignments,
    addClass,
    addSubject,
    addChapter,
    updateStudentApproval,
  } = useLms();
  const { user, userProfile, isAdmin } = useAuth();

  const displayName =
    userProfile?.name ||
    user?.displayName ||
    (isAdmin ? "Administrator" : "Student");

  // Current Date string
  const currentDateStr = useMemo(() => {
    return new Date().toLocaleDateString("en-US", {
      weekday: "long",
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  }, []);

  // Admin Quick Action Modal States
  const [quickClassModal, setQuickClassModal] = useState(false);
  const [quickClassData, setQuickClassData] = useState({ name: "", grade: "" });

  const [quickSubModal, setQuickSubModal] = useState(false);
  const [quickSubData, setQuickSubData] = useState({ name: "", classId: "", code: "" });

  // Admin Calculations
  const pendingStudents = useMemo(() => (students || []).filter((s) => !s.isApproved), [students]);
  const approvedStudents = useMemo(() => (students || []).filter((s) => s.isApproved), [students]);
  const recentSubmissions = useMemo(() => (allQuizAttempts || []).slice(0, 6), [allQuizAttempts]);
  const upcomingQuizzesList = useMemo(() => (quizzes || []).slice(0, 4), [quizzes]);
  const recentStudentsList = useMemo(() => (students || []).slice(0, 5), [students]);

  // Student Calculations strictly filtered to student's class
  const studentClassId = !isAdmin ? userProfile?.classId : null;

  const studentClass = useMemo(() => {
    if (!studentClassId) return null;
    return classes.find((c) => String(c.id) === String(studentClassId)) || {
      id: studentClassId,
      name: userProfile?.className || `Class ${String(studentClassId).replace("class-", "")}`,
    };
  }, [classes, studentClassId, userProfile]);

  const studentSubjects = useMemo(() => {
    if (isAdmin) return subjects;
    if (!studentClassId) return [];
    return subjects.filter((s) => String(s.classId) === String(studentClassId));
  }, [subjects, isAdmin, studentClassId]);

  const studentBooks = useMemo(() => {
    if (isAdmin) return books;
    if (!studentClassId) return [];
    return books.filter((b) => String(b.classId) === String(studentClassId));
  }, [books, isAdmin, studentClassId]);

  const studentChapters = useMemo(() => {
    if (isAdmin) return chapters;
    if (!studentClassId) return [];
    return chapters.filter((c) => String(c.classId) === String(studentClassId));
  }, [chapters, isAdmin, studentClassId]);

  const studentQuizzes = useMemo(() => {
    if (isAdmin) return quizzes;
    if (!studentClassId) return [];
    return quizzes.filter((q) => String(q.classId) === String(studentClassId));
  }, [quizzes, isAdmin, studentClassId]);

  const studentAssignments = useMemo(() => {
    if (isAdmin) return assignments;
    if (!studentClassId) return [];
    return assignments.filter((a) => String(a.classId) === String(studentClassId));
  }, [assignments, isAdmin, studentClassId]);

  const userAttempts = useMemo(() => {
    if (!user) return [];
    return studentAttempts.filter((a) => a.userId === user.uid || !a.userId);
  }, [studentAttempts, user]);

  const totalQuizzesCount = studentQuizzes.length;
  const attemptedQuizzesCount = userAttempts.length;
  const passedQuizzesCount = userAttempts.filter((a) => a.passed).length;
  const avgQuizScore =
    attemptedQuizzesCount > 0
      ? Math.round(
          userAttempts.reduce((acc, curr) => acc + (curr.percentage || 0), 0) /
            attemptedQuizzesCount
        )
      : 0;

  const overallProgressPercentage =
    totalQuizzesCount > 0
      ? Math.min(Math.round((passedQuizzesCount / totalQuizzesCount) * 100), 100)
      : 0;

  // Student Continue Learning Target
  const continueLearningItem = useMemo(() => {
    if (studentSubjects.length === 0) return null;
    const latestAttempt = userAttempts[userAttempts.length - 1];
    if (latestAttempt) {
      const matchSubject = studentSubjects.find((s) => String(s.id) === String(latestAttempt.subjectId));
      const matchChapter = chapters.find((c) => String(c.id) === String(latestAttempt.chapterId));
      return {
        subject: matchSubject?.name || "Sindh Board Course",
        subjectId: latestAttempt.subjectId,
        classId: latestAttempt.classId || studentClassId,
        chapterTitle: matchChapter?.title || "Chapter Self-Assessment",
        chapterId: latestAttempt.chapterId,
        progress: latestAttempt.percentage || 70,
        lastActivity: "Recent Quiz Attempt",
      };
    }

    const firstSub = studentSubjects[0];
    const firstChap = chapters.find((c) => String(c.subjectId) === String(firstSub?.id));
    return {
      subject: firstSub?.name || "Mathematics",
      subjectId: firstSub?.id,
      classId: firstSub?.classId || studentClassId,
      chapterTitle: firstChap?.title || "Chapter 1: Foundational Principles",
      chapterId: firstChap?.id || "ch-1",
      progress: 0,
      lastActivity: "Ready to Start",
    };
  }, [studentSubjects, chapters, userAttempts, studentClassId]);

  const handleApproveStudent = async (uid, name) => {
    try {
      await updateStudentApproval(uid, true);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-300">
      {/* Hero Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl p-6 sm:p-8 bg-card border border-border/80 shadow-xl shadow-black/5 dark:shadow-black/20">
        {/* Glow backdrop */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-24 -right-24 w-80 h-80 rounded-full opacity-40 dark:opacity-60"
          style={{
            background:
              "radial-gradient(circle, var(--color-accent-glow) 0%, transparent 70%)",
          }}
        />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs px-3 py-1 rounded-full font-bold bg-primary/10 text-primary border border-primary/20 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                {isAdmin ? "Institutional Admin Portal" : "Student Preparation Dashboard"}
              </span>

              {!isAdmin && userProfile?.className && (
                <span className="text-xs px-3 py-1 rounded-full font-semibold bg-secondary text-secondary-foreground border border-border">
                  {userProfile.className}
                </span>
              )}

              <span className="text-xs text-muted-foreground font-medium hidden sm:inline">
                {currentDateStr}
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-foreground">
              Welcome back, <span className="gradient-accent-text">{displayName}</span>
            </h1>

            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
              {isAdmin
                ? "Oversee student admissions, official Sindh Textbook Board curriculum, virtual tests, and homework submissions."
                : `You are enrolled in ${userProfile?.className || "your class"}. All textbooks, chapters, quizzes, and assignments are customized to your syllabus.`}
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            {isAdmin ? (
              <Button
                onClick={() => navigate("/quizzes")}
                className="text-xs font-bold rounded-xl h-10 px-4 bg-gradient-to-r from-teal-600 via-teal-500 to-cyan-500 text-white shadow-[0_4px_20px_var(--color-accent-glow)] hover:shadow-[0_6px_28px_var(--color-accent-glow)] gap-2"
              >
                <Plus className="w-4 h-4" /> Create New Quiz
              </Button>
            ) : (
              <Button
                onClick={() => navigate("/quizzes")}
                className="text-xs font-bold rounded-xl h-10 px-4 bg-gradient-to-r from-teal-600 via-teal-500 to-cyan-500 text-white shadow-[0_4px_20px_var(--color-accent-glow)] hover:shadow-[0_6px_28px_var(--color-accent-glow)] gap-2"
              >
                <PlayCircle className="w-4 h-4" /> Take Quiz
              </Button>
            )}

            <Button
              variant="outline"
              onClick={() => navigate("/classes")}
              className="text-xs font-semibold rounded-xl h-10 px-4"
            >
              {isAdmin ? "Curriculum" : "My Class"}
            </Button>
          </div>
        </div>
      </div>

      {/* =========================================================================
          ADMIN DASHBOARD VIEW
         ========================================================================= */}
      {isAdmin ? (
        <div className="space-y-8">
          {/* Admin Metrics Grid (User Requirement 3) */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {/* Total Students */}
            <div
              onClick={() => navigate("/students")}
              className="p-4 rounded-2xl bg-card border border-border/80 hover:border-primary/40 hover:-translate-y-0.5 transition-all cursor-pointer shadow-xs"
            >
              <div className="w-9 h-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-2">
                <Users className="w-4 h-4" />
              </div>
              <div className="text-2xl font-black text-foreground">{students.length}</div>
              <div className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider mt-0.5">
                Total Students
              </div>
            </div>

            {/* Pending Admissions */}
            <div
              onClick={() => navigate("/students")}
              className="p-4 rounded-2xl bg-card border border-amber-500/40 bg-amber-500/5 hover:border-amber-500 hover:-translate-y-0.5 transition-all cursor-pointer shadow-xs"
            >
              <div className="w-9 h-9 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center mb-2">
                <AlertCircle className="w-4 h-4" />
              </div>
              <div className="text-2xl font-black text-amber-600 dark:text-amber-400">
                {pendingStudents.length}
              </div>
              <div className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider mt-0.5">
                Pending Admissions
              </div>
            </div>

            {/* Total Classes */}
            <div
              onClick={() => navigate("/classes")}
              className="p-4 rounded-2xl bg-card border border-border/80 hover:border-primary/40 hover:-translate-y-0.5 transition-all cursor-pointer shadow-xs"
            >
              <div className="w-9 h-9 rounded-xl bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 flex items-center justify-center mb-2">
                <GraduationCap className="w-4 h-4" />
              </div>
              <div className="text-2xl font-black text-foreground">
                {classes.length || 5}
              </div>
              <div className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider mt-0.5">
                Total Classes
              </div>
            </div>

            {/* Total Subjects */}
            <div
              onClick={() => navigate("/subjects")}
              className="p-4 rounded-2xl bg-card border border-border/80 hover:border-primary/40 hover:-translate-y-0.5 transition-all cursor-pointer shadow-xs"
            >
              <div className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-2">
                <BookOpen className="w-4 h-4" />
              </div>
              <div className="text-2xl font-black text-foreground">{subjects.length}</div>
              <div className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider mt-0.5">
                Total Subjects
              </div>
            </div>

            {/* Total Quizzes */}
            <div
              onClick={() => navigate("/quizzes")}
              className="p-4 rounded-2xl bg-card border border-border/80 hover:border-primary/40 hover:-translate-y-0.5 transition-all cursor-pointer shadow-xs"
            >
              <div className="w-9 h-9 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center mb-2">
                <HelpCircle className="w-4 h-4" />
              </div>
              <div className="text-2xl font-black text-foreground">{quizzes.length}</div>
              <div className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider mt-0.5">
                Total Quizzes
              </div>
            </div>

            {/* Total Assignments */}
            <div
              onClick={() => navigate("/assignments")}
              className="p-4 rounded-2xl bg-card border border-border/80 hover:border-primary/40 hover:-translate-y-0.5 transition-all cursor-pointer shadow-xs"
            >
              <div className="w-9 h-9 rounded-xl bg-rose-500/10 text-rose-600 dark:text-rose-400 flex items-center justify-center mb-2">
                <Award className="w-4 h-4" />
              </div>
              <div className="text-2xl font-black text-foreground">{assignments.length}</div>
              <div className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider mt-0.5">
                Total Assignments
              </div>
            </div>
          </div>

          {/* Admin Quick Actions Bar */}
          <div className="p-5 rounded-2xl bg-card border border-border/80 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Institutional Quick Actions
              </span>
            </div>
            <div className="flex items-center gap-2.5 flex-wrap">
              <Button
                size="sm"
                onClick={() => navigate("/quizzes")}
                className="text-xs font-bold rounded-xl h-9 gap-1.5 shadow-xs"
              >
                <Plus className="w-3.5 h-3.5" /> Create Quiz
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => navigate("/assignments")}
                className="text-xs font-semibold rounded-xl h-9 gap-1.5"
              >
                <Award className="w-3.5 h-3.5 text-primary" /> New Assignment
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => navigate("/books")}
                className="text-xs font-semibold rounded-xl h-9 gap-1.5"
              >
                <BookMarked className="w-3.5 h-3.5 text-primary" /> Add Textbook
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => navigate("/chapters")}
                className="text-xs font-semibold rounded-xl h-9 gap-1.5"
              >
                <Layers className="w-3.5 h-3.5 text-primary" /> Add Chapter
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => navigate("/students")}
                className="text-xs font-semibold rounded-xl h-9 gap-1.5"
              >
                <Users className="w-3.5 h-3.5 text-primary" /> Review Admissions ({pendingStudents.length})
              </Button>
            </div>
          </div>

          {/* Main 2-Column Section */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left 2 Cols: Pending Admissions + Recent Submissions */}
            <div className="lg:col-span-2 space-y-6">
              {/* Pending Admissions Panel */}
              {pendingStudents.length > 0 && (
                <div className="p-5 rounded-2xl bg-amber-500/5 border border-amber-500/30 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse" />
                      <h3 className="font-bold text-sm text-foreground">
                        Pending Student Admissions ({pendingStudents.length})
                      </h3>
                    </div>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => navigate("/students")}
                      className="text-xs text-amber-600 dark:text-amber-400 font-bold"
                    >
                      View All
                    </Button>
                  </div>

                  <div className="space-y-2">
                    {pendingStudents.slice(0, 3).map((st) => (
                      <div
                        key={st.uid}
                        className="p-3 rounded-xl bg-card border border-border/80 flex items-center justify-between gap-3 text-xs"
                      >
                        <div className="min-w-0">
                          <div className="font-bold text-foreground truncate">{st.name}</div>
                          <div className="text-[11px] text-muted-foreground truncate">{st.email}</div>
                          <div className="text-[10px] font-semibold text-primary mt-0.5">
                            Applying for: {st.className || "Class"}
                          </div>
                        </div>

                        <Button
                          size="sm"
                          onClick={() => handleApproveStudent(st.uid, st.name)}
                          className="text-xs font-bold rounded-xl h-8 px-3 bg-emerald-600 hover:bg-emerald-700 text-white gap-1 shrink-0 shadow-xs"
                        >
                          <Check className="w-3.5 h-3.5" /> Approve
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Recent Quiz Submissions Table */}
              <div className="p-5 rounded-2xl bg-card border border-border/80 shadow-sm space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Trophy className="w-4 h-4 text-primary" />
                    <h3 className="font-bold text-sm text-foreground">Recent Quiz Submissions</h3>
                  </div>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => navigate("/results")}
                    className="text-xs text-primary font-bold"
                  >
                    View All
                  </Button>
                </div>

                {recentSubmissions.length === 0 ? (
                  <div className="text-center py-8 text-xs text-muted-foreground">
                    No student quiz submissions recorded yet.
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-muted/30 text-muted-foreground uppercase text-[10px] border-b border-border">
                        <tr>
                          <th className="px-3 py-2">Student</th>
                          <th className="px-3 py-2">Quiz</th>
                          <th className="px-3 py-2">Score</th>
                          <th className="px-3 py-2">Status</th>
                          <th className="px-3 py-2">Time</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border/60">
                        {recentSubmissions.map((sub, idx) => (
                          <tr key={sub.id || idx} className="hover:bg-muted/20">
                            <td className="px-3 py-2.5 font-bold text-foreground">
                              {sub.userName}
                            </td>
                            <td className="px-3 py-2.5 text-muted-foreground">
                              {sub.quizTitle}
                            </td>
                            <td className="px-3 py-2.5 font-mono font-bold">
                              {sub.score} / {sub.totalQuestions} ({sub.percentage}%)
                            </td>
                            <td className="px-3 py-2.5">
                              <span
                                className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                                  sub.passed
                                    ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                                    : "bg-destructive/10 text-destructive"
                                }`}
                              >
                                {sub.passed ? "Pass" : "Fail"}
                              </span>
                            </td>
                            <td className="px-3 py-2.5 text-muted-foreground text-[10px]">
                              {sub.submittedAtString || "Today"}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>

            {/* Right 1 Col: Upcoming Quizzes & Recent Students */}
            <div className="space-y-6">
              {/* Upcoming Quizzes */}
              <div className="p-5 rounded-2xl bg-card border border-border/80 shadow-sm space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-sm text-foreground flex items-center gap-2">
                    <HelpCircle className="w-4 h-4 text-primary" /> Active Quizzes
                  </h3>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => navigate("/quizzes")}
                    className="text-xs text-primary font-bold"
                  >
                    Manage
                  </Button>
                </div>

                <div className="space-y-2.5">
                  {upcomingQuizzesList.map((q) => (
                    <div
                      key={q.id}
                      className="p-3 rounded-xl bg-muted/30 border border-border/60 flex items-center justify-between text-xs"
                    >
                      <div className="min-w-0">
                        <div className="font-bold text-foreground truncate">{q.title}</div>
                        <div className="text-[10px] text-muted-foreground mt-0.5">
                          {q.timeLimitMinutes || 15} mins • {q.questions?.length || 5} questions
                        </div>
                      </div>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-primary/10 text-primary font-bold">
                        {q.classId}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recent Students */}
              <div className="p-5 rounded-2xl bg-card border border-border/80 shadow-sm space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-sm text-foreground flex items-center gap-2">
                    <Users className="w-4 h-4 text-primary" /> Recent Students
                  </h3>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => navigate("/students")}
                    className="text-xs text-primary font-bold"
                  >
                    Directory
                  </Button>
                </div>

                <div className="space-y-2.5">
                  {recentStudentsList.map((st) => (
                    <div
                      key={st.uid}
                      className="p-3 rounded-xl bg-muted/30 border border-border/60 flex items-center justify-between text-xs"
                    >
                      <div className="min-w-0">
                        <div className="font-bold text-foreground truncate">{st.name}</div>
                        <div className="text-[10px] text-muted-foreground truncate">{st.email}</div>
                      </div>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          st.isApproved
                            ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                            : "bg-amber-500/10 text-amber-600 dark:text-amber-400"
                        }`}
                      >
                        {st.isApproved ? "Approved" : "Pending"}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* =========================================================================
            STUDENT DASHBOARD VIEW (Strictly Class-Filtered - User Requirement 4)
           ========================================================================= */
        <div className="space-y-8">
          {/* Continue Learning Card */}
          {continueLearningItem && (
            <div className="p-6 rounded-3xl bg-gradient-to-r from-card to-card/90 border border-border/80 shadow-md flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden">
              <div className="space-y-2 max-w-xl">
                <div className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-primary bg-primary/10 px-2.5 py-0.5 rounded-full">
                  <Flame className="w-3.5 h-3.5 text-amber-500" /> Continue Where You Left Off
                </div>
                <h2 className="text-xl sm:text-2xl font-black text-foreground">
                  {continueLearningItem.chapterTitle}
                </h2>
                <p className="text-xs text-muted-foreground">
                  {continueLearningItem.subject} • {studentClass?.name}
                </p>

                {/* Progress bar */}
                <div className="space-y-1 pt-1 max-w-xs">
                  <div className="flex justify-between text-[11px] text-muted-foreground">
                    <span>Performance Progress</span>
                    <span className="font-bold text-foreground">{continueLearningItem.progress}%</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-muted overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-teal-500 to-cyan-500 rounded-full transition-all"
                      style={{ width: `${continueLearningItem.progress}%` }}
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 shrink-0">
                <Button
                  onClick={() =>
                    navigate(
                      `/classes/${continueLearningItem.classId}/subjects/${continueLearningItem.subjectId}/chapters/${continueLearningItem.chapterId}/content`
                    )
                  }
                  className="text-xs font-bold rounded-xl h-10 px-4 bg-primary text-primary-foreground shadow-xs gap-1.5"
                >
                  <BookOpen className="w-4 h-4" /> Study Notes
                </Button>
                <Button
                  variant="outline"
                  onClick={() =>
                    navigate(
                      `/classes/${continueLearningItem.classId}/subjects/${continueLearningItem.subjectId}/chapters/${continueLearningItem.chapterId}/quiz`
                    )
                  }
                  className="text-xs font-bold rounded-xl h-10 px-4 gap-1.5"
                >
                  <PlayCircle className="w-4 h-4 text-primary" /> Take Quiz
                </Button>
              </div>
            </div>
          )}

          {/* Student Overview Cards (My Class, My Subjects, My Books, My Chapters) */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div
              onClick={() => navigate("/classes")}
              className="p-5 rounded-2xl bg-card border border-border/80 hover:border-primary/50 transition-all cursor-pointer shadow-xs"
            >
              <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-3">
                <GraduationCap className="w-5 h-5" />
              </div>
              <div className="text-xl font-black text-foreground truncate">
                {studentClass?.name || "My Class"}
              </div>
              <div className="text-xs text-muted-foreground font-semibold mt-0.5">
                Enrolled Class
              </div>
            </div>

            <div
              onClick={() => navigate("/subjects")}
              className="p-5 rounded-2xl bg-card border border-border/80 hover:border-primary/50 transition-all cursor-pointer shadow-xs"
            >
              <div className="w-10 h-10 rounded-xl bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 flex items-center justify-center mb-3">
                <BookOpen className="w-5 h-5" />
              </div>
              <div className="text-xl font-black text-foreground">
                {studentSubjects.length}
              </div>
              <div className="text-xs text-muted-foreground font-semibold mt-0.5">
                Class Subjects
              </div>
            </div>

            <div
              onClick={() => navigate("/books")}
              className="p-5 rounded-2xl bg-card border border-border/80 hover:border-primary/50 transition-all cursor-pointer shadow-xs"
            >
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-3">
                <BookMarked className="w-5 h-5" />
              </div>
              <div className="text-xl font-black text-foreground">
                {studentBooks.length || studentSubjects.length}
              </div>
              <div className="text-xs text-muted-foreground font-semibold mt-0.5">
                Sindh Board Books
              </div>
            </div>

            <div
              onClick={() => navigate("/chapters")}
              className="p-5 rounded-2xl bg-card border border-border/80 hover:border-primary/50 transition-all cursor-pointer shadow-xs"
            >
              <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center mb-3">
                <Layers className="w-5 h-5" />
              </div>
              <div className="text-xl font-black text-foreground">
                {studentChapters.length || 24}
              </div>
              <div className="text-xs text-muted-foreground font-semibold mt-0.5">
                Course Chapters
              </div>
            </div>
          </div>

          {/* Academic Progress & Scores */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl bg-card border border-border/80 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Overall Syllabus Completion
                </span>
                <Sparkles className="w-4 h-4 text-primary" />
              </div>
              <div className="text-4xl font-black text-foreground">
                {overallProgressPercentage}%
              </div>
              <div className="w-full h-2.5 rounded-full bg-muted overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-teal-500 to-cyan-500 rounded-full transition-all"
                  style={{ width: `${overallProgressPercentage}%` }}
                />
              </div>
              <p className="text-xs text-muted-foreground">
                Based on passed chapter assessment tests for {studentClass?.name}.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-card border border-border/80 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Quizzes Attempted
                </span>
                <HelpCircle className="w-4 h-4 text-cyan-500" />
              </div>
              <div className="text-4xl font-black text-foreground">
                {attemptedQuizzesCount} <span className="text-base text-muted-foreground font-semibold">/ {totalQuizzesCount}</span>
              </div>
              <div className="text-xs text-muted-foreground">
                Average score across all attempts: <strong className="text-foreground">{avgQuizScore}%</strong>
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-card border border-border/80 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Class Assignments
                </span>
                <Award className="w-4 h-4 text-amber-500" />
              </div>
              <div className="text-4xl font-black text-foreground">
                {studentAssignments.length}
              </div>
              <div className="text-xs text-muted-foreground">
                Active tasks assigned to your section for this semester.
              </div>
            </div>
          </div>

          {/* Subjects Grid */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-black text-foreground flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-primary" /> My Class Subjects
              </h2>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => navigate("/subjects")}
                className="text-xs text-primary font-bold"
              >
                View All Subjects <ChevronRight className="w-3.5 h-3.5 ml-1" />
              </Button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {studentSubjects.map((sub) => (
                <div
                  key={sub.id}
                  onClick={() => navigate(`/classes/${sub.classId}/subjects/${sub.id}/chapters`)}
                  className="p-5 rounded-2xl bg-card border border-border/80 hover:border-primary/50 hover:shadow-md transition-all cursor-pointer flex flex-col justify-between"
                >
                  <div className="space-y-2">
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-primary/10 text-primary">
                      {sub.code || "STBB"}
                    </span>
                    <h3 className="font-bold text-sm text-foreground">{sub.name}</h3>
                    <p className="text-xs text-muted-foreground line-clamp-2">
                      {sub.description || "Sindh Textbook Board approved syllabus."}
                    </p>
                  </div>
                  <div className="mt-4 pt-3 border-t border-border/60 flex items-center justify-between text-xs text-primary font-bold">
                    <span>Browse Chapters</span>
                    <ChevronRight className="w-4 h-4" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 2-Col Bottom Section: Upcoming Quizzes & Available Assignments */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Upcoming Quizzes */}
            <div className="p-5 rounded-2xl bg-card border border-border/80 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-sm text-foreground flex items-center gap-2">
                  <HelpCircle className="w-4 h-4 text-primary" /> Upcoming Quizzes
                </h3>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => navigate("/quizzes")}
                  className="text-xs text-primary font-bold"
                >
                  All Quizzes
                </Button>
              </div>

              {studentQuizzes.length === 0 ? (
                <div className="text-center py-8 text-xs text-muted-foreground">
                  No upcoming quizzes for your class currently.
                </div>
              ) : (
                <div className="space-y-3">
                  {studentQuizzes.slice(0, 4).map((q) => (
                    <div
                      key={q.id}
                      className="p-3.5 rounded-xl bg-muted/30 border border-border/60 flex items-center justify-between gap-3 text-xs"
                    >
                      <div className="min-w-0">
                        <div className="font-bold text-foreground truncate">{q.title}</div>
                        <div className="text-[11px] text-muted-foreground mt-0.5">
                          {q.timeLimitMinutes || 15} Mins • {q.questions?.length || 5} Questions
                        </div>
                      </div>

                      <Button
                        size="sm"
                        onClick={() => navigate("/quizzes")}
                        className="text-xs font-bold rounded-xl h-8 gap-1 shadow-xs shrink-0"
                      >
                        <PlayCircle className="w-3.5 h-3.5" /> Start
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Available Assignments */}
            <div className="p-5 rounded-2xl bg-card border border-border/80 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-sm text-foreground flex items-center gap-2">
                  <Award className="w-4 h-4 text-primary" /> Available Assignments
                </h3>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => navigate("/assignments")}
                  className="text-xs text-primary font-bold"
                >
                  All Tasks
                </Button>
              </div>

              {studentAssignments.length === 0 ? (
                <div className="text-center py-8 text-xs text-muted-foreground">
                  No homework assignments pending.
                </div>
              ) : (
                <div className="space-y-3">
                  {studentAssignments.slice(0, 4).map((a) => (
                    <div
                      key={a.id}
                      className="p-3.5 rounded-xl bg-muted/30 border border-border/60 flex items-center justify-between gap-3 text-xs"
                    >
                      <div className="min-w-0">
                        <div className="font-bold text-foreground truncate">{a.title}</div>
                        <div className="text-[11px] text-muted-foreground mt-0.5">
                          Due: {a.dueDate ? new Date(a.dueDate).toLocaleDateString() : "No deadline"}
                        </div>
                      </div>

                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => navigate("/assignments")}
                        className="text-xs font-semibold rounded-xl h-8 shrink-0"
                      >
                        Submit
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
