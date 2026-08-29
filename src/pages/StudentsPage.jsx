import React, { useState } from "react";
import { useLms } from "@/context/LmsContext";
import {
  Users,
  Search,
  CheckCircle2,
  XCircle,
  Trash2,
  ShieldCheck,
  Clock,
  UserCheck,
  UserX,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function StudentsPage() {
  const { students, updateStudentApproval, deleteStudent } = useLms();
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all"); // "all" | "approved" | "pending"

  const filteredStudents = students.filter((s) => {
    const matchesSearch =
      (s.name || "").toLowerCase().includes(search.toLowerCase()) ||
      (s.email || "").toLowerCase().includes(search.toLowerCase());

    if (filter === "approved") return matchesSearch && s.isApproved === true;
    if (filter === "pending") return matchesSearch && s.isApproved !== true;
    return matchesSearch;
  });

  const handleToggleApproval = async (student) => {
    const nextStatus = !student.isApproved;
    await updateStudentApproval(student.uid, nextStatus);
  };

  const handleDelete = async (student) => {
    if (window.confirm(`Are you sure you want to remove student "${student.name || student.email}"?`)) {
      await deleteStudent(student.uid);
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs px-2.5 py-0.5 rounded-full font-bold bg-primary/10 text-primary border border-primary/20">
              Admin Control
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground mt-1">
            Registered Students
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Review registered student accounts and authorize access to curriculum content.
          </p>
        </div>
      </div>

      {/* Search & Filter Toolbar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-4 rounded-2xl bg-card border border-border">
        <div className="relative flex-1 w-full max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search by student name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 h-9 text-xs"
          />
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 text-xs">
          <Button
            variant={filter === "all" ? "default" : "outline"}
            size="sm"
            onClick={() => setFilter("all")}
            className="h-8 text-xs rounded-full"
          >
            All ({students.length})
          </Button>
          <Button
            variant={filter === "approved" ? "default" : "outline"}
            size="sm"
            onClick={() => setFilter("approved")}
            className="h-8 text-xs rounded-full"
          >
            Approved ({students.filter((s) => s.isApproved).length})
          </Button>
          <Button
            variant={filter === "pending" ? "default" : "outline"}
            size="sm"
            onClick={() => setFilter("pending")}
            className="h-8 text-xs rounded-full"
          >
            Pending ({students.filter((s) => !s.isApproved).length})
          </Button>
        </div>
      </div>

      {/* Students Table / Card List */}
      {filteredStudents.length === 0 ? (
        <div className="text-center py-16 px-4 bg-card border border-dashed border-border rounded-2xl space-y-3">
          <Users className="w-12 h-12 text-muted-foreground mx-auto" />
          <h3 className="text-base font-bold text-foreground">No students found</h3>
          <p className="text-xs text-muted-foreground">
            {search ? "No students matching your search criteria." : "No student accounts are registered yet."}
          </p>
        </div>
      ) : (
        <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-muted/40 text-muted-foreground text-xs uppercase border-b border-border font-semibold">
                <tr>
                  <th className="px-5 py-3.5">Student</th>
                  <th className="px-5 py-3.5">Email</th>
                  <th className="px-4 py-3.5">Role</th>
                  <th className="px-4 py-3.5">Status</th>
                  <th className="px-5 py-3.5 text-right">Access Control</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border text-xs sm:text-sm">
                {filteredStudents.map((student) => (
                  <tr key={student.uid} className="hover:bg-muted/30 transition-colors">
                    <td className="px-5 py-4 font-bold text-foreground">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-primary/10 text-primary font-bold text-xs flex items-center justify-center shrink-0">
                          {(student.name || "ST").slice(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <div>{student.name || "Unnamed Student"}</div>
                          <div className="text-[11px] text-muted-foreground font-mono truncate max-w-[140px]">
                            {student.uid}
                          </div>
                        </div>
                      </div>
                    </td>

                    <td className="px-5 py-4 text-muted-foreground">
                      {student.email || "No email provided"}
                    </td>

                    <td className="px-4 py-4">
                      <span className="capitalize font-medium text-foreground">
                        {student.role || "student"}
                      </span>
                    </td>

                    <td className="px-4 py-4">
                      <span
                        className={`inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full font-semibold border ${
                          student.isApproved
                            ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20"
                            : "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20"
                        }`}
                      >
                        {student.isApproved ? (
                          <>
                            <CheckCircle2 className="w-3.5 h-3.5" /> Approved
                          </>
                        ) : (
                          <>
                            <Clock className="w-3.5 h-3.5" /> Pending
                          </>
                        )}
                      </span>
                    </td>

                    <td className="px-5 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          size="sm"
                          variant={student.isApproved ? "outline" : "default"}
                          className="h-8 text-xs gap-1.5"
                          onClick={() => handleToggleApproval(student)}
                        >
                          {student.isApproved ? (
                            <>
                              <UserX className="w-3.5 h-3.5" /> Revoke
                            </>
                          ) : (
                            <>
                              <UserCheck className="w-3.5 h-3.5" /> Approve
                            </>
                          )}
                        </Button>

                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                          onClick={() => handleDelete(student)}
                          title="Delete Account"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
