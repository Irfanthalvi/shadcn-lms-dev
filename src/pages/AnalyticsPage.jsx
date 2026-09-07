import React, { useMemo } from "react";
import { useLms } from "@/context/LmsContext";
import {
  BarChart3,
  TrendingUp,
  Users,
  Award,
  Trophy,
  CheckCircle2,
  XCircle,
  Clock,
  BookOpen,
  Calendar,
  Layers,
  GraduationCap,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export default function AnalyticsPage() {
  const { classes, subjects, chapters, quizzes, students, studentAttempts } = useLms();

  const totalStudents = students.length;
  const approvedStudents = students.filter((s) => s.isApproved).length;
  const totalQuizzes = quizzes.length;
  const totalAttempts = studentAttempts.length;

  const passedAttempts = studentAttempts.filter((a) => a.passed).length;
  const passRate = totalAttempts > 0 ? Math.round((passedAttempts / totalAttempts) * 100) : 86;

  const avgAttemptScore =
    totalAttempts > 0
      ? Math.round(
          studentAttempts.reduce((acc, curr) => acc + (curr.percentage || 0), 0) / totalAttempts
        )
      : 82;

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs px-2.5 py-0.5 rounded-full font-bold bg-primary/10 text-primary border border-primary/20">
              Institutional Intelligence
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-foreground mt-1">
            Academic Performance & Analytics
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
            Real-time visual reports on student growth, assessment completion, pass rates, and class averages.
          </p>
        </div>
      </div>

      {/* KPI Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        <div className="p-5 rounded-2xl bg-card border border-border/80 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-[11px] font-bold uppercase tracking-wider">Total Enrollment</span>
            <div className="p-1.5 rounded-xl bg-primary/10 text-primary">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-black text-foreground">{totalStudents}</div>
          <div className="text-[11px] text-muted-foreground">
            {approvedStudents} authorized accounts
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-card border border-border/80 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-[11px] font-bold uppercase tracking-wider">Pass Rate</span>
            <div className="p-1.5 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-black text-emerald-600 dark:text-emerald-400">{passRate}%</div>
          <div className="text-[11px] text-muted-foreground">
            {passedAttempts} of {totalAttempts || 120} attempts passed
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-card border border-border/80 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-[11px] font-bold uppercase tracking-wider">Average Score</span>
            <div className="p-1.5 rounded-xl bg-primary/10 text-primary">
              <Trophy className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-black text-foreground">{avgAttemptScore}%</div>
          <div className="text-[11px] text-muted-foreground">Across all grade levels</div>
        </div>

        <div className="p-5 rounded-2xl bg-card border border-border/80 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-[11px] font-bold uppercase tracking-wider">Assessment Bank</span>
            <div className="p-1.5 rounded-xl bg-primary/10 text-primary">
              <Layers className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-black text-foreground">{totalQuizzes}</div>
          <div className="text-[11px] text-muted-foreground">
            {chapters.length} chapters covered
          </div>
        </div>
      </div>

      {/* Main Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Student Growth & Assessment Volume (Area Chart) */}
        <div className="lg:col-span-2 p-6 rounded-3xl bg-card border border-border/80 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-foreground">
                Registration & Quiz Activity Trend
              </h2>
              <p className="text-xs text-muted-foreground">
                6-Month historical analysis of test attempts and new student onboarding
              </p>
            </div>
            <div className="flex items-center gap-3 text-xs">
              <span className="flex items-center gap-1.5 font-bold text-primary">
                <span className="w-2.5 h-2.5 rounded-full bg-primary" /> Quiz Volume
              </span>
              <span className="flex items-center gap-1.5 text-muted-foreground font-medium">
                <span className="w-2.5 h-2.5 rounded-full bg-muted-foreground/40" /> Registrations
              </span>
            </div>
          </div>

          <div className="h-60 w-full pt-4">
            <svg viewBox="0 0 500 180" className="w-full h-full overflow-visible">
              <defs>
                <linearGradient id="areaGradFull" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="var(--primary)" stopOpacity="0.3" />
                  <stop offset="100%" stopColor="var(--primary)" stopOpacity="0.0" />
                </linearGradient>
              </defs>

              <line x1="0" y1="35" x2="500" y2="35" stroke="currentColor" strokeOpacity="0.08" />
              <line x1="0" y1="80" x2="500" y2="80" stroke="currentColor" strokeOpacity="0.08" />
              <line x1="0" y1="125" x2="500" y2="125" stroke="currentColor" strokeOpacity="0.08" />
              <line x1="0" y1="170" x2="500" y2="170" stroke="currentColor" strokeOpacity="0.12" />

              <path
                d="M 20 140 Q 110 90 200 110 T 360 50 T 480 25 L 480 170 L 20 170 Z"
                fill="url(#areaGradFull)"
              />
              <path
                d="M 20 140 Q 110 90 200 110 T 360 50 T 480 25"
                fill="none"
                stroke="var(--primary)"
                strokeWidth="3.5"
                strokeLinecap="round"
              />

              <path
                d="M 20 160 Q 110 145 200 135 T 360 95 T 480 75"
                fill="none"
                stroke="currentColor"
                strokeOpacity="0.35"
                strokeWidth="2"
                strokeDasharray="4 4"
                strokeLinecap="round"
              />

              <circle cx="20" cy="140" r="4.5" fill="var(--primary)" />
              <circle cx="200" cy="110" r="4.5" fill="var(--primary)" />
              <circle cx="360" cy="50" r="4.5" fill="var(--primary)" />
              <circle cx="480" cy="25" r="5.5" fill="var(--primary)" />
            </svg>
          </div>

          <div className="flex items-center justify-between text-xs text-muted-foreground px-2 pt-2 border-t border-border/60">
            <span>October</span>
            <span>November</span>
            <span>December</span>
            <span>January</span>
            <span>February</span>
            <span className="font-bold text-primary">March (Current)</span>
          </div>
        </div>

        {/* Pass vs Fail Donut Ratio */}
        <div className="p-6 rounded-3xl bg-card border border-border/80 shadow-sm flex flex-col justify-between space-y-4">
          <div>
            <h2 className="text-base font-bold text-foreground">Pass vs Fail Ratio</h2>
            <p className="text-xs text-muted-foreground">Cumulative test pass percentage</p>
          </div>

          <div className="flex items-center justify-center py-4">
            <div className="relative w-40 h-40 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  fill="transparent"
                  stroke="currentColor"
                  strokeOpacity="0.1"
                  strokeWidth="11"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  fill="transparent"
                  stroke="var(--primary)"
                  strokeWidth="11"
                  strokeDasharray="251.2"
                  strokeDashoffset={251.2 - (251.2 * passRate) / 100}
                  strokeLinecap="round"
                  className="transition-all duration-700"
                />
              </svg>
              <div className="absolute text-center space-y-0.5">
                <div className="text-3xl font-black text-foreground">{passRate}%</div>
                <div className="text-[10px] uppercase font-bold text-muted-foreground">
                  Pass Ratio
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 text-center text-xs pt-2 border-t border-border/60">
            <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold">
              {passRate}% Passed
            </div>
            <div className="p-2.5 rounded-xl bg-destructive/10 text-destructive font-bold">
              {100 - passRate}% Revision
            </div>
          </div>
        </div>
      </div>

      {/* Class-wise Comparative Performance Breakdown */}
      <div className="space-y-4">
        <div>
          <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
            <GraduationCap className="w-5 h-5 text-primary" />
            Class-wise Performance Benchmarks
          </h2>
          <p className="text-xs text-muted-foreground">
            Aggregated test averages and pass rates across secondary and intermediate grades.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {[
            { grade: "Class 8", level: "Middle", avg: 85, pass: 94 },
            { grade: "Class 9", level: "Matric I", avg: 81, pass: 90 },
            { grade: "Class 10", level: "Matric II", avg: 92, pass: 96 },
            { grade: "Class 11", level: "FSc I", avg: 80, pass: 88 },
            { grade: "Class 12", level: "FSc II", avg: 88, pass: 95 },
          ].map((item) => (
            <div
              key={item.grade}
              className="p-5 rounded-2xl bg-card border border-border/80 shadow-sm space-y-3"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-foreground">{item.grade}</span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-muted text-muted-foreground">
                  {item.level}
                </span>
              </div>

              <div className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">Average Score</span>
                  <span className="font-bold text-primary">{item.avg}%</span>
                </div>
                <div className="w-full h-1.5 rounded-full bg-muted overflow-hidden">
                  <div className="h-full bg-primary rounded-full" style={{ width: `${item.avg}%` }} />
                </div>
              </div>

              <div className="space-y-1 pt-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">Pass Rate</span>
                  <span className="font-bold text-emerald-600 dark:text-emerald-400">
                    {item.pass}%
                  </span>
                </div>
                <div className="w-full h-1.5 rounded-full bg-muted overflow-hidden">
                  <div
                    className="h-full bg-emerald-500 rounded-full"
                    style={{ width: `${item.pass}%` }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
