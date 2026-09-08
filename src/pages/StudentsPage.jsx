import React, { useState, useMemo } from "react";
import { useLms } from "@/context/LmsContext";
import {
  Users,
  Search,
  CheckCircle2,
  Trash2,
  Clock,
  UserCheck,
  UserX,
  Eye,
  BarChart3,
  LayoutGrid,
  List,
  GraduationCap,
  Trophy,
  RefreshCw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export default function StudentsPage() {
  const {
    students,
    classes,
    studentAttempts,
    updateStudentApproval,
    updateStudentClass,
    deleteStudent,
  } = useLms();

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [classFilter, setClassFilter] = useState("all");
  const [viewMode, setViewMode] = useState("table");

  // Selected student for Profile / Performance / Class Assignment
  const [selectedStudentProfile, setSelectedStudentProfile] = useState(null);
  const [selectedStudentPerformance, setSelectedStudentPerformance] = useState(null);
  const [selectedStudentClass, setSelectedStudentClass] = useState(null);

  const [selectedClassId, setSelectedClassId] = useState("");
  const [isUpdatingClass, setIsUpdatingClass] = useState(false);

  const filteredStudents = useMemo(() => {
    return students.filter((s) => {
      const searchQuery = search.toLowerCase();

      const matchesSearch =
        (s.name || "").toLowerCase().includes(searchQuery) ||
        (s.email || "").toLowerCase().includes(searchQuery) ||
        (s.uid || "").toLowerCase().includes(searchQuery);

      const matchesApproval =
        filter === "all"
          ? true
          : filter === "approved"
            ? s.isApproved === true
            : s.isApproved !== true;

      const matchesClass =
        classFilter === "all"
          ? true
          : String(s.classId || "") === String(classFilter);

      return matchesSearch && matchesApproval && matchesClass;
    });
  }, [students, search, filter, classFilter]);

  const handleToggleApproval = async (student) => {
    const nextStatus = !student.isApproved;
    await updateStudentApproval(student.uid, nextStatus);
  };

  const handleDelete = async (student) => {
    if (
      window.confirm(
        `Are you sure you want to remove student "${student.name || student.email}"?`
      )
    ) {
      await deleteStudent(student.uid);
    }
  };

  const openClassDialog = (student) => {
    setSelectedStudentClass(student);
    setSelectedClassId(student.classId || "");
  };

  const closeClassDialog = () => {
    if (isUpdatingClass) return;

    setSelectedStudentClass(null);
    setSelectedClassId("");
  };

  const handleAssignClass = async () => {
    if (!selectedStudentClass) return;

    if (!selectedClassId) {
      window.alert("Please select a class.");
      return;
    }

    const selectedClass = classes.find(
      (c) => String(c.id) === String(selectedClassId)
    );

    if (!selectedClass) {
      window.alert("Selected class was not found.");
      return;
    }

    try {
      setIsUpdatingClass(true);

      await updateStudentClass(
        selectedStudentClass.uid,
        selectedClass.id,
        selectedClass.name
      );

      closeClassDialog();
    } catch (error) {
      console.error("Failed to update student class:", error);
    } finally {
      setIsUpdatingClass(false);
    }
  };

  // Student specific attempts for performance modal
  const studentQuizAttempts = useMemo(() => {
    if (!selectedStudentPerformance) return [];

    return studentAttempts.filter(
      (a) => a.userId === selectedStudentPerformance.uid
    );
  }, [selectedStudentPerformance, studentAttempts]);

  const avgStudentScore = useMemo(() => {
    if (studentQuizAttempts.length === 0) return 0;

    const total = studentQuizAttempts.reduce(
      (acc, curr) => acc + (curr.percentage || 0),
      0
    );

    return Math.round(total / studentQuizAttempts.length);
  }, [studentQuizAttempts]);

  const pendingCount = students.filter((s) => !s.isApproved).length;
  const approvedCount = students.filter((s) => s.isApproved).length;

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs px-2.5 py-0.5 rounded-full font-bold bg-primary/10 text-primary border border-primary/20">
              Admin Student Directory
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-foreground mt-1">
            Student Management
          </h1>

          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
            Review registered accounts, grant curriculum access, and inspect
            student examination performance.
          </p>
        </div>

        {/* Counter Pills */}
        <div className="flex items-center gap-2">
          <div className="px-3 py-1.5 rounded-xl bg-card border border-border text-xs flex items-center gap-2">
            <span className="text-muted-foreground">Total:</span>
            <span className="font-bold text-foreground">
              {students.length}
            </span>
          </div>

          <div className="px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-semibold">
            <span>Approved:</span>
            <span className="font-bold">{approvedCount}</span>
          </div>

          {pendingCount > 0 && (
            <div className="px-3 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-xs flex items-center gap-2 text-amber-600 dark:text-amber-400 font-bold animate-pulse">
              <span>Pending:</span>
              <span>{pendingCount}</span>
            </div>
          )}
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3 p-4 rounded-2xl bg-card border border-border/80 shadow-sm">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />

          <Input
            placeholder="Search by student name, email, or ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 h-9 text-xs rounded-xl"
          />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Class Filter */}
          <select
            value={classFilter}
            onChange={(e) => setClassFilter(e.target.value)}
            className="h-9 rounded-xl border border-input bg-background px-3 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
          >
            <option value="all">All Classes</option>

            {classes.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>

          {/* Approval Filter */}
          <div className="flex items-center bg-muted/60 p-0.5 rounded-xl border border-border">
            <button
              onClick={() => setFilter("all")}
              className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all ${filter === "all"
                  ? "bg-card text-foreground shadow-xs"
                  : "text-muted-foreground hover:text-foreground"
                }`}
            >
              All ({students.length})
            </button>

            <button
              onClick={() => setFilter("approved")}
              className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all ${filter === "approved"
                  ? "bg-card text-emerald-600 dark:text-emerald-400 shadow-xs"
                  : "text-muted-foreground hover:text-foreground"
                }`}
            >
              Approved ({approvedCount})
            </button>

            <button
              onClick={() => setFilter("pending")}
              className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all ${filter === "pending"
                  ? "bg-card text-amber-600 dark:text-amber-400 shadow-xs"
                  : "text-muted-foreground hover:text-foreground"
                }`}
            >
              Pending ({pendingCount})
            </button>
          </div>

          {/* Grid/Table Switcher */}
          <div className="hidden sm:flex items-center bg-muted/60 p-0.5 rounded-xl border border-border">
            <button
              onClick={() => setViewMode("table")}
              className={`p-1.5 rounded-lg transition-all ${viewMode === "table"
                  ? "bg-card text-foreground shadow-xs"
                  : "text-muted-foreground"
                }`}
              title="Table View"
            >
              <List className="w-4 h-4" />
            </button>

            <button
              onClick={() => setViewMode("grid")}
              className={`p-1.5 rounded-lg transition-all ${viewMode === "grid"
                  ? "bg-card text-foreground shadow-xs"
                  : "text-muted-foreground"
                }`}
              title="Card Grid View"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Student Display */}
      {filteredStudents.length === 0 ? (
        <div className="text-center py-16 px-4 bg-card border border-dashed border-border rounded-2xl space-y-3">
          <Users className="w-12 h-12 text-muted-foreground/60 mx-auto" />

          <h3 className="text-base font-bold text-foreground">
            No students match your filter
          </h3>

          <p className="text-xs text-muted-foreground">
            {search
              ? "Try clearing search query or adjusting your filters."
              : "No student accounts are currently registered."}
          </p>
        </div>
      ) : viewMode === "grid" ? (
        /* ================= CARD GRID VIEW ================= */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredStudents.map((student) => (
            <div
              key={student.uid}
              className={`p-5 rounded-2xl bg-card border transition-all duration-200 shadow-sm flex flex-col justify-between ${!student.isApproved
                  ? "border-amber-500/40 bg-amber-500/5 hover:border-amber-500"
                  : "border-border/80 hover:border-primary/50"
                }`}
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span
                    className={`inline-flex items-center gap-1 text-[11px] px-2.5 py-0.5 rounded-full font-bold border ${student.isApproved
                        ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20"
                        : "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30 animate-pulse"
                      }`}
                  >
                    {student.isApproved ? (
                      <>
                        <CheckCircle2 className="w-3 h-3" />
                        Approved
                      </>
                    ) : (
                      <>
                        <Clock className="w-3 h-3" />
                        Pending Authorization
                      </>
                    )}
                  </span>

                  <span className="text-[10px] text-muted-foreground font-mono">
                    ID: {student.uid.slice(0, 6)}...
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-2xl bg-primary/10 text-primary font-black text-sm flex items-center justify-center shrink-0 border border-primary/20">
                    {(student.name || "ST").slice(0, 2).toUpperCase()}
                  </div>

                  <div className="min-w-0">
                    <h3 className="font-bold text-sm text-foreground truncate">
                      {student.name || "Unnamed Student"}
                    </h3>

                    <p className="text-xs text-muted-foreground truncate">
                      {student.email}
                    </p>
                  </div>
                </div>

                {/* Assigned Class */}
                <div className="flex items-center gap-2 text-xs pt-1 text-muted-foreground">
                  <GraduationCap className="w-3.5 h-3.5 text-primary" />

                  <span
                    className={
                      student.className
                        ? "text-foreground font-medium"
                        : "italic"
                    }
                  >
                    {student.className || "Not Assigned"}
                  </span>
                </div>
              </div>

              {/* Card Actions Footer */}
              <div className="mt-4 pt-3 border-t border-border/60 flex flex-col gap-2">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => setSelectedStudentProfile(student)}
                      className="h-8 px-2 text-xs text-muted-foreground hover:text-foreground"
                      title="View Profile"
                    >
                      <Eye className="w-3.5 h-3.5 mr-1" />
                      Profile
                    </Button>

                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => setSelectedStudentPerformance(student)}
                      className="h-8 px-2 text-xs text-primary"
                      title="View Quiz Scores"
                    >
                      <BarChart3 className="w-3.5 h-3.5 mr-1" />
                      Scores
                    </Button>
                  </div>

                  <Button
                    size="sm"
                    variant={student.isApproved ? "outline" : "default"}
                    onClick={() => handleToggleApproval(student)}
                    className="h-8 text-xs font-semibold rounded-xl"
                  >
                    {student.isApproved ? "Revoke" : "Approve"}
                  </Button>
                </div>

                {/* Change Class */}
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => openClassDialog(student)}
                  className="h-8 w-full text-xs font-semibold rounded-xl"
                >
                  <RefreshCw className="w-3.5 h-3.5 mr-1.5" />
                  {student.classId ? "Change Class" : "Assign Class"}
                </Button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* ================= TABLE VIEW ================= */
        <div className="bg-card border border-border/80 rounded-2xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-muted/30 text-muted-foreground text-[11px] uppercase tracking-wider border-b border-border font-bold">
                <tr>
                  <th className="px-5 py-3.5">Student Name</th>
                  <th className="px-5 py-3.5">Email</th>
                  <th className="px-4 py-3.5">Selected Class</th>
                  <th className="px-4 py-3.5">Registration Date</th>
                  <th className="px-4 py-3.5">Approval Status</th>
                  <th className="px-5 py-3.5 text-right">Actions</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-border/60">
                {filteredStudents.map((student) => {
                  const regDateStr = student.createdAt?.toDate
                    ? student.createdAt
                      .toDate()
                      .toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })
                    : student.createdAt
                      ? new Date(student.createdAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })
                      : "Enrolled";

                  return (
                    <tr
                      key={student.uid}
                      className={`hover:bg-muted/25 transition-colors ${!student.isApproved ? "bg-amber-500/5" : ""
                        }`}
                    >
                      {/* Student Name */}
                      <td className="px-5 py-3.5 font-bold text-foreground">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-xl bg-primary/10 text-primary font-black text-xs flex items-center justify-center shrink-0 border border-primary/20">
                            {(student.name || "ST").slice(0, 2).toUpperCase()}
                          </div>

                          <div className="min-w-0">
                            <div className="truncate text-xs sm:text-sm">
                              {student.name || "Unnamed Student"}
                            </div>

                            <div className="text-[10px] text-muted-foreground font-mono">
                              {student.uid.slice(0, 10)}...
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Email */}
                      <td className="px-5 py-3.5 text-muted-foreground text-xs">
                        {student.email || "No email provided"}
                      </td>

                      {/* Class */}
                      <td className="px-4 py-3.5 text-xs">
                        {student.className ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-primary/10 text-primary font-semibold border border-primary/20">
                            <GraduationCap className="w-3 h-3" />
                            {student.className}
                          </span>
                        ) : (
                          <span className="text-muted-foreground italic text-[11px]">
                            Not assigned
                          </span>
                        )}
                      </td>

                      {/* Registration Date */}
                      <td className="px-4 py-3.5 text-xs text-muted-foreground">
                        {regDateStr}
                      </td>

                      {/* Approval Status */}
                      <td className="px-4 py-3.5">
                        <span
                          className={`inline-flex items-center gap-1 text-[11px] px-2.5 py-0.5 rounded-full font-bold border ${student.isApproved
                              ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20"
                              : "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30 font-extrabold"
                            }`}
                        >
                          {student.isApproved ? (
                            <>
                              <CheckCircle2 className="w-3 h-3" />
                              Approved
                            </>
                          ) : (
                            <>
                              <Clock className="w-3 h-3" />
                              Pending Authorization
                            </>
                          )}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="px-5 py-3.5 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() =>
                              setSelectedStudentPerformance(student)
                            }
                            className="h-8 px-2 text-xs text-primary"
                            title="View Performance"
                          >
                            <BarChart3 className="w-3.5 h-3.5" />
                          </Button>

                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => setSelectedStudentProfile(student)}
                            className="h-8 px-2 text-xs text-muted-foreground hover:text-foreground"
                            title="View Profile"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </Button>

                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => openClassDialog(student)}
                            className="h-8 px-2 text-xs font-semibold rounded-xl"
                            title="Assign or Change Class"
                          >
                            <GraduationCap className="w-3.5 h-3.5 mr-1" />
                            Class
                          </Button>

                          <Button
                            size="sm"
                            variant={
                              student.isApproved ? "outline" : "default"
                            }
                            className="h-8 text-xs font-semibold rounded-xl"
                            onClick={() => handleToggleApproval(student)}
                          >
                            {student.isApproved ? (
                              <>
                                <UserX className="w-3.5 h-3.5 mr-1" />
                                Revoke
                              </>
                            ) : (
                              <>
                                <UserCheck className="w-3.5 h-3.5 mr-1" />
                                Approve
                              </>
                            )}
                          </Button>

                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-xl"
                            onClick={() => handleDelete(student)}
                            title="Delete Account"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ================= MODAL: ASSIGN / CHANGE CLASS ================= */}
      {selectedStudentClass && (
        <Dialog
          open={!!selectedStudentClass}
          onOpenChange={closeClassDialog}
        >
          <DialogContent className="sm:max-w-md rounded-2xl">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <GraduationCap className="w-5 h-5 text-primary" />
                Assign Student Class
              </DialogTitle>
            </DialogHeader>

            <div className="space-y-5 py-2">
              {/* Student Info */}
              <div className="flex items-center gap-3 p-3 rounded-xl bg-muted/30 border border-border">
                <div className="w-11 h-11 rounded-xl bg-primary/10 text-primary font-black text-sm flex items-center justify-center">
                  {(selectedStudentClass.name || "ST")
                    .slice(0, 2)
                    .toUpperCase()}
                </div>

                <div className="min-w-0">
                  <div className="font-bold text-sm text-foreground truncate">
                    {selectedStudentClass.name || "Unnamed Student"}
                  </div>

                  <div className="text-xs text-muted-foreground truncate">
                    {selectedStudentClass.email}
                  </div>
                </div>
              </div>

              {/* Current Class */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-muted-foreground">
                  Current Class
                </label>

                <div className="h-10 px-3 rounded-xl border border-border bg-muted/30 flex items-center text-sm">
                  {selectedStudentClass.className || "Not Assigned"}
                </div>
              </div>

              {/* New Class */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">
                  Select Class
                </label>

                <select
                  value={selectedClassId}
                  onChange={(e) => setSelectedClassId(e.target.value)}
                  disabled={isUpdatingClass}
                  className="w-full h-10 rounded-xl border border-input bg-background px-3 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary disabled:opacity-60"
                >
                  <option value="">Select a class...</option>

                  {classes.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>

                <p className="text-[11px] text-muted-foreground">
                  The student's class ID will be linked to this Firestore class
                  document.
                </p>
              </div>

              {/* Actions */}
              <div className="flex justify-end gap-2 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={closeClassDialog}
                  disabled={isUpdatingClass}
                  className="rounded-xl"
                >
                  Cancel
                </Button>

                <Button
                  type="button"
                  onClick={handleAssignClass}
                  disabled={isUpdatingClass || !selectedClassId}
                  className="rounded-xl"
                >
                  {isUpdatingClass ? (
                    <>
                      <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-4 h-4 mr-2" />
                      Save Class
                    </>
                  )}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* ================= MODAL: STUDENT PROFILE ================= */}
      {selectedStudentProfile && (
        <Dialog
          open={!!selectedStudentProfile}
          onOpenChange={() => setSelectedStudentProfile(null)}
        >
          <DialogContent className="sm:max-w-md rounded-2xl">
            <DialogHeader>
              <DialogTitle>Student Profile Details</DialogTitle>
            </DialogHeader>

            <div className="space-y-4 py-2 text-xs sm:text-sm">
              <div className="flex items-center gap-3 p-3 rounded-xl bg-muted/30 border border-border">
                <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary font-black text-base flex items-center justify-center">
                  {(selectedStudentProfile.name || "ST")
                    .slice(0, 2)
                    .toUpperCase()}
                </div>

                <div>
                  <h3 className="font-bold text-base text-foreground">
                    {selectedStudentProfile.name || "Student"}
                  </h3>

                  <p className="text-xs text-muted-foreground">
                    {selectedStudentProfile.email}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded-xl bg-muted/20 border border-border/60">
                  <div className="text-muted-foreground text-[11px]">
                    System UID
                  </div>

                  <div className="font-mono font-bold text-xs truncate mt-0.5">
                    {selectedStudentProfile.uid}
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-muted/20 border border-border/60">
                  <div className="text-muted-foreground text-[11px]">
                    Assigned Role
                  </div>

                  <div className="font-bold text-xs capitalize mt-0.5">
                    {selectedStudentProfile.role || "Student"}
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-muted/20 border border-border/60">
                  <div className="text-muted-foreground text-[11px]">
                    Approval State
                  </div>

                  <div
                    className={`font-bold text-xs mt-0.5 ${selectedStudentProfile.isApproved
                        ? "text-emerald-600 dark:text-emerald-400"
                        : "text-amber-600 dark:text-amber-400"
                      }`}
                  >
                    {selectedStudentProfile.isApproved
                      ? "Approved"
                      : "Pending Authorization"}
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-muted/20 border border-border/60">
                  <div className="text-muted-foreground text-[11px]">
                    Class Curriculum
                  </div>

                  <div className="font-bold text-xs mt-0.5">
                    {selectedStudentProfile.className || "Not Assigned"}
                  </div>
                </div>
              </div>

              {/* Change Class from Profile */}
              <Button
                type="button"
                variant="outline"
                className="w-full rounded-xl"
                onClick={() => {
                  const student = selectedStudentProfile;
                  setSelectedStudentProfile(null);
                  openClassDialog(student);
                }}
              >
                <GraduationCap className="w-4 h-4 mr-2" />
                Assign / Change Class
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* ================= MODAL: STUDENT PERFORMANCE ================= */}
      {selectedStudentPerformance && (
        <Dialog
          open={!!selectedStudentPerformance}
          onOpenChange={() => setSelectedStudentPerformance(null)}
        >
          <DialogContent className="sm:max-w-lg rounded-2xl">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Trophy className="w-5 h-5 text-primary" />
                <span>
                  Performance Scorecard: {selectedStudentPerformance.name}
                </span>
              </DialogTitle>
            </DialogHeader>

            <div className="space-y-4 py-2">
              {/* Scorecard Quick Stats */}
              <div className="grid grid-cols-3 gap-3 text-center">
                <div className="p-3 rounded-xl bg-muted/30 border border-border">
                  <div className="text-lg font-black text-foreground">
                    {studentQuizAttempts.length}
                  </div>

                  <div className="text-[10px] text-muted-foreground font-bold uppercase">
                    Attempts
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-muted/30 border border-border">
                  <div className="text-lg font-black text-primary">
                    {avgStudentScore}%
                  </div>

                  <div className="text-[10px] text-muted-foreground font-bold uppercase">
                    Avg Score
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-muted/30 border border-border">
                  <div className="text-lg font-black text-emerald-500">
                    {studentQuizAttempts.filter((a) => a.passed).length}
                  </div>

                  <div className="text-[10px] text-muted-foreground font-bold uppercase">
                    Quizzes Passed
                  </div>
                </div>
              </div>

              {/* Attempt History */}
              <div className="space-y-2">
                <div className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                  Assessment History
                </div>

                {studentQuizAttempts.length === 0 ? (
                  <div className="py-6 text-center text-xs text-muted-foreground">
                    No quiz submissions on record for this student yet.
                  </div>
                ) : (
                  <div className="max-h-60 overflow-y-auto space-y-2">
                    {studentQuizAttempts.map((att, i) => (
                      <div
                        key={att.id || i}
                        className="p-3 rounded-xl bg-card border border-border/80 flex items-center justify-between text-xs"
                      >
                        <div>
                          <div className="font-bold text-foreground">
                            {att.quizTitle}
                          </div>

                          <div className="text-[11px] text-muted-foreground">
                            Score: {att.score}/{att.totalQuestions} (
                            {att.percentage}%)
                          </div>
                        </div>

                        <span
                          className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${att.passed
                              ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                              : "bg-destructive/10 text-destructive"
                            }`}
                        >
                          {att.passed ? "Passed" : "Failed"}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}