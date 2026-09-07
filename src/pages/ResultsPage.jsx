import React, { useState, useMemo } from "react";
import { useLms } from "@/context/LmsContext";
import { useAuth } from "@/context/AuthContext";
import {
  Award,
  Trophy,
  CheckCircle2,
  XCircle,
  TrendingUp,
  BarChart3,
  Search,
  Download,
  Calendar,
  Clock,
  HelpCircle,
  GraduationCap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import toast from "react-hot-toast";

export default function ResultsPage() {
  const { classes, studentAttempts, allQuizAttempts } = useLms();
  const { user, userProfile, isAdmin } = useAuth();

  const [selectedClass, setSelectedClass] = useState(
    !isAdmin && userProfile?.classId ? userProfile.classId : "all"
  );
  const [search, setSearch] = useState("");

  // Determine which attempts to display: Admin sees all (filtered), Student sees ONLY their own
  const sourceAttempts = useMemo(() => {
    if (isAdmin) {
      return allQuizAttempts;
    }
    // Student: ONLY their own attempts for their assigned class
    return studentAttempts.filter(
      (a) =>
        (user ? a.userId === user.uid : true) &&
        (!userProfile?.classId || !a.classId || String(a.classId) === String(userProfile.classId))
    );
  }, [isAdmin, allQuizAttempts, studentAttempts, user, userProfile]);

  const filteredResults = useMemo(() => {
    return sourceAttempts.filter((res) => {
      if (isAdmin && selectedClass !== "all" && String(res.classId) !== String(selectedClass)) {
        return false;
      }

      if (search.trim()) {
        const q = search.toLowerCase();
        const matchTitle = (res.quizTitle || "").toLowerCase().includes(q);
        const matchUser = (res.userName || "").toLowerCase().includes(q);
        return matchTitle || matchUser;
      }

      return true;
    });
  }, [sourceAttempts, isAdmin, selectedClass, search]);

  // Statistics
  const totalCount = filteredResults.length;
  const passedCount = filteredResults.filter((r) => r.passed).length;
  const passRate = totalCount > 0 ? Math.round((passedCount / totalCount) * 100) : 0;
  const avgScore =
    totalCount > 0
      ? Math.round(
          filteredResults.reduce((acc, curr) => acc + (curr.percentage || 0), 0) / totalCount
        )
      : 0;

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs px-2.5 py-0.5 rounded-full font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
              Exam Analytics & Scorecards
            </span>
            {!isAdmin && userProfile?.className && (
              <span className="text-xs px-2.5 py-0.5 rounded-full font-semibold bg-muted text-muted-foreground border border-border">
                {userProfile.className} Only
              </span>
            )}
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-foreground mt-1">
            {isAdmin ? "Academic Examination Results" : "My Assessment Results"}
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
            {isAdmin
              ? "Official student scorecards, passing percentages, and class-wise submissions."
              : "Comprehensive scorecard of your chapter assessments and tests."}
          </p>
        </div>

        <Button
          variant="outline"
          onClick={() => toast.success("Exporting grade report sheet...")}
          className="gap-2 self-start sm:self-auto text-xs h-9 rounded-xl font-semibold"
        >
          <Download className="h-4 w-4" />
          Export Grade Sheet
        </Button>
      </div>

      {/* Summary Scorecards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="bg-gradient-to-br from-primary/15 via-primary/5 to-transparent border border-primary/30 rounded-3xl p-5 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-primary uppercase tracking-wider">
              {isAdmin ? "Total Attempts" : "Assessments Taken"}
            </span>
            <HelpCircle className="h-5 w-5 text-primary" />
          </div>
          <div className="text-3xl font-black text-foreground">{totalCount}</div>
          <p className="text-xs text-muted-foreground">
            {passedCount} passed successfully
          </p>
        </div>

        <div className="bg-gradient-to-br from-emerald-500/15 via-emerald-500/5 to-transparent border border-emerald-500/30 rounded-3xl p-5 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
              Pass Rate
            </span>
            <CheckCircle2 className="h-5 w-5 text-emerald-500" />
          </div>
          <div className="text-3xl font-black text-foreground">{passRate}%</div>
          <p className="text-xs text-muted-foreground">
            Based on completed assessments
          </p>
        </div>

        <div className="bg-gradient-to-br from-amber-500/15 via-amber-500/5 to-transparent border border-amber-500/30 rounded-3xl p-5 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider">
              Average Performance
            </span>
            <Trophy className="h-5 w-5 text-amber-500" />
          </div>
          <div className="text-3xl font-black text-foreground">{avgScore}%</div>
          <p className="text-xs text-muted-foreground">
            Cumulative average score
          </p>
        </div>
      </div>

      {/* Class Results Table with Toolbar */}
      <div className="bg-card border border-border rounded-3xl overflow-hidden shadow-sm">
        <div className="p-4 border-b border-border flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder={isAdmin ? "Search by student or quiz..." : "Search your tests..."}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 h-9 text-xs rounded-xl"
            />
          </div>

          {/* Admin Class Selector (Students cannot see other classes) */}
          {isAdmin && (
            <div className="flex items-center gap-1.5 text-xs overflow-x-auto w-full sm:w-auto py-1">
              <button
                onClick={() => setSelectedClass("all")}
                className={`px-3 py-1 rounded-xl font-bold transition text-xs ${
                  selectedClass === "all"
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "bg-muted text-muted-foreground hover:text-foreground"
                }`}
              >
                All Classes
              </button>
              {classes.map((c) => (
                <button
                  key={c.id}
                  onClick={() => setSelectedClass(String(c.id))}
                  className={`px-3 py-1 rounded-xl font-bold transition text-xs whitespace-nowrap ${
                    selectedClass === String(c.id)
                      ? "bg-primary text-primary-foreground shadow-sm"
                      : "bg-muted text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {c.name}
                </button>
              ))}
            </div>
          )}
        </div>

        {filteredResults.length === 0 ? (
          <div className="text-center py-16 px-4 space-y-3">
            <Trophy className="w-10 h-10 text-muted-foreground/40 mx-auto" />
            <h3 className="text-sm font-bold text-foreground">No examination results found</h3>
            <p className="text-xs text-muted-foreground">
              {!isAdmin
                ? "You have not attempted any assessment quizzes for your class yet."
                : "No student submissions match your filter."}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-muted/50 text-muted-foreground uppercase border-b border-border text-[10px] font-bold tracking-wider">
                <tr>
                  <th className="px-5 py-3.5">Assessment Title</th>
                  {isAdmin && <th className="px-4 py-3.5">Student</th>}
                  <th className="px-4 py-3.5">Class</th>
                  <th className="px-4 py-3.5 text-center">Score</th>
                  <th className="px-4 py-3.5 text-center">Percentage</th>
                  <th className="px-4 py-3.5 text-center">Status</th>
                  <th className="px-5 py-3.5 text-right">Date & Time</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredResults.map((res, index) => {
                  const matchClass = classes.find((c) => String(c.id) === String(res.classId));
                  return (
                    <tr key={res.id || index} className="hover:bg-muted/30 transition">
                      <td className="px-5 py-3.5 font-bold text-foreground">
                        {res.quizTitle || "Chapter Assessment"}
                      </td>
                      {isAdmin && (
                        <td className="px-4 py-3.5 font-medium text-foreground">
                          <div>{res.userName || "Student"}</div>
                          <div className="text-[10px] text-muted-foreground">{res.userEmail}</div>
                        </td>
                      )}
                      <td className="px-4 py-3.5">
                        <Badge variant="outline" className="rounded-lg text-[10px]">
                          {matchClass?.name || res.classId || "Class"}
                        </Badge>
                      </td>
                      <td className="px-4 py-3.5 text-center font-bold text-foreground">
                        {res.score} / {res.totalQuestions}
                      </td>
                      <td className="px-4 py-3.5 text-center font-bold">
                        <span
                          className={
                            res.passed
                              ? "text-emerald-600 dark:text-emerald-400"
                              : "text-destructive"
                          }
                        >
                          {res.percentage}%
                        </span>
                      </td>
                      <td className="px-4 py-3.5 text-center">
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full inline-flex items-center gap-1 ${
                            res.passed
                              ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20"
                              : "bg-destructive/10 text-destructive border border-destructive/20"
                          }`}
                        >
                          {res.passed ? (
                            <>
                              <CheckCircle2 className="w-3 h-3" /> Passed
                            </>
                          ) : (
                            <>
                              <XCircle className="w-3 h-3" /> Failed
                            </>
                          )}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 text-right text-xs text-muted-foreground">
                        {res.submittedAtString ||
                          (res.submittedAt?.toDate
                            ? res.submittedAt.toDate().toLocaleString()
                            : "Recent")}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
