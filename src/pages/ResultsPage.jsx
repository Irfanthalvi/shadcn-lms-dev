import React, { useState } from "react";
import { useLms } from "@/context/LmsContext";
import {
  Award,
  Trophy,
  CheckCircle2,
  TrendingUp,
  BarChart3,
  Search,
  FileSpreadsheet,
  Download,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

export default function ResultsPage() {
  const { results, classes, students } = useLms();
  const [selectedClass, setSelectedClass] = useState("all");

  const filteredResults =
    selectedClass === "all"
      ? results
      : results.filter((r) => String(r.classId) === String(selectedClass));

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs px-2.5 py-0.5 rounded-full font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
              Exam Analytics & Scorecards
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground mt-1">
            Academic Examination Results
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Scoreboard, class rankings, and term pass percentages for Classes 8 through 12.
          </p>
        </div>

        <Button
          variant="outline"
          onClick={() => toast.success("Exporting combined grade report sheet...")}
          className="gap-2 self-start sm:self-auto text-xs h-9"
        >
          <Download className="h-4 w-4" />
          Export All Grade Sheets
        </Button>
      </div>

      {/* Top Rankers Honor Board */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="bg-gradient-to-br from-amber-500/15 via-amber-500/5 to-transparent border border-amber-500/30 rounded-2xl p-5 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider">
              Class 12 Valedictorian
            </span>
            <Trophy className="h-5 w-5 text-amber-500" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-foreground">Irfan Ali</h3>
            <p className="text-xs text-muted-foreground">Pre-Engineering • 98.0% Score</p>
          </div>
          <div className="text-xs font-semibold text-amber-600 dark:text-amber-400">
            Rank 1 Overall (GPA 4.00)
          </div>
        </div>

        <div className="bg-gradient-to-br from-blue-500/15 via-blue-500/5 to-transparent border border-blue-500/30 rounded-2xl p-5 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider">
              Class 10 Board High Scorer
            </span>
            <Award className="h-5 w-5 text-blue-500" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-foreground">Daniyal Qasim</h3>
            <p className="text-xs text-muted-foreground">Pre-Engineering • 96.0% Score</p>
          </div>
          <div className="text-xs font-semibold text-blue-600 dark:text-blue-400">
            Rank 1 Overall (GPA 3.98)
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-500/15 via-purple-500/5 to-transparent border border-purple-500/30 rounded-2xl p-5 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-purple-600 dark:text-purple-400 uppercase tracking-wider">
              Class 11 Pre-Med Topper
            </span>
            <Trophy className="h-5 w-5 text-purple-500" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-foreground">Mahnoor Asif</h3>
            <p className="text-xs text-muted-foreground">Pre-Medical • 95.0% Score</p>
          </div>
          <div className="text-xs font-semibold text-purple-600 dark:text-purple-400">
            Rank 1 Overall (GPA 3.96)
          </div>
        </div>
      </div>

      {/* Class Results Table */}
      <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm">
        <div className="p-4 border-b border-border flex items-center justify-between">
          <h3 className="text-base font-bold text-foreground">
            Term Examination Scorecards
          </h3>
          <div className="flex items-center gap-1.5 text-xs">
            <button
              onClick={() => setSelectedClass("all")}
              className={`px-3 py-1 rounded-full font-medium transition ${
                selectedClass === "all"
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:text-foreground"
              }`}
            >
              All Classes
            </button>
            {classes.map((c) => (
              <button
                key={c.id}
                onClick={() => setSelectedClass(String(c.id))}
                className={`px-3 py-1 rounded-full font-medium transition ${
                  selectedClass === String(c.id)
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground hover:text-foreground"
                }`}
              >
                {c.name}
              </button>
            ))}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-muted/50 text-muted-foreground text-xs uppercase border-b border-border">
              <tr>
                <th className="px-5 py-3.5 font-semibold">Assessment Title</th>
                <th className="px-4 py-3.5 font-semibold">Class</th>
                <th className="px-4 py-3.5 font-semibold">Top Ranker</th>
                <th className="px-4 py-3.5 font-semibold">Class Average</th>
                <th className="px-4 py-3.5 font-semibold">Pass Rate</th>
                <th className="px-4 py-3.5 font-semibold">Status</th>
                <th className="px-5 py-3.5 font-semibold text-right">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredResults.map((res) => (
                <tr key={res.id} className="hover:bg-muted/30 transition">
                  <td className="px-5 py-3.5 font-semibold text-foreground">
                    {res.exam}
                  </td>
                  <td className="px-4 py-3.5">
                    <Badge variant="outline">{res.className}</Badge>
                  </td>
                  <td className="px-4 py-3.5 font-medium text-foreground text-xs">
                    {res.topStudent}
                  </td>
                  <td className="px-4 py-3.5 font-semibold text-xs text-foreground">
                    {res.avgMarks}
                  </td>
                  <td className="px-4 py-3.5">
                    <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
                      {res.passPercentage}%
                    </span>
                  </td>
                  <td className="px-4 py-3.5">
                    <span className="text-xs px-2.5 py-0.5 rounded-full font-medium bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-800">
                      {res.status}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-right text-xs text-muted-foreground">
                    {res.date}
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
