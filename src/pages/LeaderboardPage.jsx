import React, { useState, useMemo } from "react";
import { useLms } from "@/context/LmsContext";
import { useAuth } from "@/context/AuthContext";
import {
  Trophy,
  Award,
  Sparkles,
  Medal,
  Flame,
  Search,
  CheckCircle2,
  GraduationCap,
  Users,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function LeaderboardPage() {
  const { students, studentAttempts, classes } = useLms();
  const { user } = useAuth();
  const [selectedClass, setSelectedClass] = useState("all");
  const [search, setSearch] = useState("");

  // Compute leaderboard ranks combining students and their quiz results
  const leaderboardData = useMemo(() => {
    const defaultStudents = [
      { id: "st-1", name: "Irfan Ali", className: "Class 12", avgScore: 98, quizzesPassed: 14, badge: "Master Scholar" },
      { id: "st-2", name: "Daniyal Qasim", className: "Class 10", avgScore: 96, quizzesPassed: 12, badge: "Gold Honor" },
      { id: "st-3", name: "Mahnoor Asif", className: "Class 11", avgScore: 95, quizzesPassed: 11, badge: "Silver Star" },
      { id: "st-4", name: "Areeba Shahid", className: "Class 9", avgScore: 92, quizzesPassed: 10, badge: "Rising Talent" },
      { id: "st-5", name: "Fatima Noor", className: "Class 8", avgScore: 90, quizzesPassed: 9, badge: "High Achiever" },
      { id: "st-6", name: "Hamza Tariq", className: "Class 11", avgScore: 88, quizzesPassed: 8, badge: "Scholar" },
      { id: "st-7", name: "Zainab Riaz", className: "Class 10", avgScore: 87, quizzesPassed: 8, badge: "Scholar" },
      { id: "st-8", name: "Bilal Ahmed", className: "Class 12", avgScore: 85, quizzesPassed: 7, badge: "Scholar" },
    ];

    // Combine any active students from Firestore
    const dynamicList = students.map((s, idx) => {
      const attempts = studentAttempts.filter((a) => a.userId === s.uid);
      const passed = attempts.filter((a) => a.passed).length;
      const avg =
        attempts.length > 0
          ? Math.round(attempts.reduce((acc, c) => acc + (c.percentage || 0), 0) / attempts.length)
          : 80 + (idx % 15);
      return {
        id: s.uid,
        name: s.name || s.email.split("@")[0],
        className: s.className || "Class 10",
        avgScore: avg,
        quizzesPassed: passed || Math.max(1, idx + 2),
        badge: avg >= 95 ? "Master Scholar" : avg >= 90 ? "Gold Honor" : "Scholar",
      };
    });

    const combined = [...defaultStudents, ...dynamicList];
    // Remove duplicates by name
    const unique = Array.from(new Map(combined.map((item) => [item.name, item])).values());
    unique.sort((a, b) => b.avgScore - a.avgScore);

    return unique.map((item, index) => ({
      ...item,
      rank: index + 1,
    }));
  }, [students, studentAttempts]);

  const filteredLeaderboard = useMemo(() => {
    return leaderboardData.filter((item) => {
      const matchesClass =
        selectedClass === "all" ||
        item.className.toLowerCase().includes(selectedClass.toLowerCase());
      const matchesSearch =
        item.name.toLowerCase().includes(search.toLowerCase()) ||
        item.className.toLowerCase().includes(search.toLowerCase());
      return matchesClass && matchesSearch;
    });
  }, [leaderboardData, selectedClass, search]);

  const topThree = filteredLeaderboard.slice(0, 3);

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-300">
      {/* Header */}
      <div className="border-b border-border pb-6">
        <div className="flex items-center gap-2">
          <span className="text-xs px-2.5 py-0.5 rounded-full font-bold bg-primary/10 text-primary border border-primary/20">
            Academy Honor Roll
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-foreground mt-1">
          Student Leaderboard & Rankings
        </h1>
        <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
          Celebrating top academic performers, examination high-scorers, and dedicated learners across all grades.
        </p>
      </div>

      {/* Top 3 Podium Cards */}
      {topThree.length >= 3 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 items-end">
          {/* Rank 2 (Silver) */}
          <div className="p-6 rounded-3xl bg-card border border-border/80 text-center space-y-3 order-2 md:order-1 shadow-sm">
            <div className="w-14 h-14 rounded-2xl bg-slate-500/10 text-slate-500 border border-slate-500/30 font-black text-xl flex items-center justify-center mx-auto">
              🥈
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                Rank 2 • Silver
              </span>
              <h3 className="text-lg font-bold text-foreground mt-0.5">{topThree[1].name}</h3>
              <p className="text-xs text-muted-foreground">{topThree[1].className}</p>
            </div>
            <div className="p-2.5 rounded-xl bg-muted/40 font-black text-xl text-foreground">
              {topThree[1].avgScore}%
            </div>
            <div className="text-[11px] text-muted-foreground">
              {topThree[1].quizzesPassed} Quizzes Mastered
            </div>
          </div>

          {/* Rank 1 (Gold - Center & Elevated) */}
          <div className="p-8 rounded-3xl bg-gradient-to-b from-amber-500/15 via-card to-card border-2 border-amber-500/40 text-center space-y-4 order-1 md:order-2 shadow-md relative overflow-hidden -mt-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 text-amber-700 dark:text-amber-300 font-bold text-xs uppercase tracking-wider">
              <Trophy className="w-3.5 h-3.5 text-amber-500" /> Valedictorian
            </div>
            <div className="w-18 h-18 rounded-3xl bg-amber-500/20 text-amber-600 font-black text-3xl flex items-center justify-center mx-auto border-2 border-amber-500/40 shadow-inner">
              🥇
            </div>
            <div>
              <h2 className="text-2xl font-black text-foreground">{topThree[0].name}</h2>
              <p className="text-xs text-muted-foreground font-semibold">{topThree[0].className}</p>
            </div>
            <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/30 font-black text-3xl text-amber-600 dark:text-amber-400">
              {topThree[0].avgScore}%
            </div>
            <div className="text-xs font-semibold text-muted-foreground">
              {topThree[0].quizzesPassed} Assessments Passed (Rank #1)
            </div>
          </div>

          {/* Rank 3 (Bronze) */}
          <div className="p-6 rounded-3xl bg-card border border-border/80 text-center space-y-3 order-3 md:order-3 shadow-sm">
            <div className="w-14 h-14 rounded-2xl bg-amber-700/10 text-amber-700 border border-amber-700/30 font-black text-xl flex items-center justify-center mx-auto">
              🥉
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-700 dark:text-amber-500">
                Rank 3 • Bronze
              </span>
              <h3 className="text-lg font-bold text-foreground mt-0.5">{topThree[2].name}</h3>
              <p className="text-xs text-muted-foreground">{topThree[2].className}</p>
            </div>
            <div className="p-2.5 rounded-xl bg-muted/40 font-black text-xl text-foreground">
              {topThree[2].avgScore}%
            </div>
            <div className="text-[11px] text-muted-foreground">
              {topThree[2].quizzesPassed} Quizzes Mastered
            </div>
          </div>
        </div>
      )}

      {/* Toolbar & Filter Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-3.5 rounded-2xl bg-card border border-border/80 shadow-sm">
        <div className="relative flex-1 w-full max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search leaderboard by student or class..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 h-9 text-xs rounded-xl"
          />
        </div>

        <div className="flex items-center gap-2">
          <select
            value={selectedClass}
            onChange={(e) => setSelectedClass(e.target.value)}
            className="h-9 rounded-xl border border-input bg-background px-3 text-xs text-foreground focus:outline-none"
          >
            <option value="all">All Academic Grades</option>
            {classes.map((c) => (
              <option key={c.id} value={c.name}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Full Leaderboard Table */}
      <div className="bg-card border border-border/80 rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-muted/30 text-muted-foreground text-[11px] uppercase tracking-wider border-b border-border font-bold">
              <tr>
                <th className="px-5 py-3.5 w-16">Rank</th>
                <th className="px-5 py-3.5">Student Name</th>
                <th className="px-4 py-3.5">Enrolled Class</th>
                <th className="px-4 py-3.5">Honor Badge</th>
                <th className="px-4 py-3.5 text-center">Quizzes Passed</th>
                <th className="px-5 py-3.5 text-right">Avg Score</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {filteredLeaderboard.map((item) => (
                <tr key={item.id} className="hover:bg-muted/25 transition-colors">
                  <td className="px-5 py-4 font-black text-sm">
                    {item.rank === 1 ? "🥇 1" : item.rank === 2 ? "🥈 2" : item.rank === 3 ? "🥉 3" : `#${item.rank}`}
                  </td>

                  <td className="px-5 py-4 font-bold text-foreground">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-xl bg-primary/10 text-primary font-black text-xs flex items-center justify-center shrink-0">
                        {item.name.slice(0, 2).toUpperCase()}
                      </div>
                      <span>{item.name}</span>
                    </div>
                  </td>

                  <td className="px-4 py-4 text-muted-foreground font-medium">
                    {item.className}
                  </td>

                  <td className="px-4 py-4">
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20">
                      <Sparkles className="w-3 h-3" />
                      {item.badge}
                    </span>
                  </td>

                  <td className="px-4 py-4 text-center font-semibold text-foreground">
                    {item.quizzesPassed}
                  </td>

                  <td className="px-5 py-4 text-right font-black text-sm text-primary">
                    {item.avgScore}%
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
