import React, { useState, useMemo, useEffect } from "react";
import { useLms } from "@/context/LmsContext";
import { useAuth } from "@/context/AuthContext";
import {
  Award,
  Plus,
  Pencil,
  Trash2,
  Search,
  Clock,
  CheckCircle2,
  Calendar,
  Send,
  Eye,
  BookOpen,
  GraduationCap,
  AlertCircle,
  ChevronDown,
  Loader2,
  FileCheck2,
  FileText,
  User,
  Sparkles,
  Layers,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import toast from "react-hot-toast";

export default function AssignmentsPage() {
  const {
    assignments,
    classes,
    subjects,
    chapters,
    addAssignment,
    updateAssignment,
    deleteAssignment,
    submitAssignment,
    getAssignmentSubmissions,
    getUserAssignmentSubmission,
    students,
  } = useLms();
  const { isAdmin, user, userProfile } = useAuth();

  const [activeTab, setActiveTab] = useState(() => {
    const params = new URLSearchParams(window.location.search);
    return params.get("view") === "submissions" ? "submissions" : "assignments";
  });

  const [search, setSearch] = useState("");
  const [classFilter, setClassFilter] = useState("all");

  // Admin Create/Edit Modal State
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingAssignment, setEditingAssignment] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    instructions: "",
    classId: "",
    subjectId: "",
    chapterId: "",
    dueDate: "",
    dueTime: "23:59",
    totalMarks: "10",
    passingMarks: "5",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Cascading options for Admin form
  const formSubjects = useMemo(() => {
    if (!formData.classId) return [];
    return subjects.filter((s) => String(s.classId) === String(formData.classId));
  }, [subjects, formData.classId]);

  const formChapters = useMemo(() => {
    if (!formData.subjectId) return [];
    return chapters.filter((c) => String(c.subjectId) === String(formData.subjectId));
  }, [chapters, formData.subjectId]);

  // Admin Submissions View
  const [selectedAssignmentForSubmissions, setSelectedAssignmentForSubmissions] = useState(null);
  const [submissionsList, setSubmissionsList] = useState([]);
  const [loadingSubmissions, setLoadingSubmissions] = useState(false);
  const [inspectSubmissionModal, setInspectSubmissionModal] = useState(null);

  // Student Submit Modal
  const [submitModal, setSubmitModal] = useState(null);
  const [submitResponseText, setSubmitResponseText] = useState("");
  const [submittingResponse, setSubmittingResponse] = useState(false);
  const [userSubmissionsMap, setUserSubmissionsMap] = useState({});

  // Student class resolution
  const studentClassId = !isAdmin ? userProfile?.classId : null;

  // Filtered assignments
  const filteredAssignments = useMemo(() => {
    let list = assignments;

    if (!isAdmin) {
      if (studentClassId) {
        list = list.filter((a) => String(a.classId) === String(studentClassId));
      }
    } else if (classFilter !== "all") {
      list = list.filter((a) => String(a.classId) === String(classFilter));
    }

    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (a) =>
          a.title?.toLowerCase().includes(q) ||
          a.description?.toLowerCase().includes(q) ||
          a.className?.toLowerCase().includes(q)
      );
    }

    return list;
  }, [assignments, isAdmin, studentClassId, classFilter, search]);

  // Load student's own submissions
  useEffect(() => {
    if (!user || isAdmin) return;
    const fetchUserSubmissions = async () => {
      const map = {};
      for (const a of filteredAssignments) {
        try {
          const sub = await getUserAssignmentSubmission(a.id, user.uid);
          if (sub) map[a.id] = sub;
        } catch (_) {}
      }
      setUserSubmissionsMap(map);
    };
    fetchUserSubmissions();
  }, [filteredAssignments, user, isAdmin, getUserAssignmentSubmission]);

  // Load submissions for admin view
  const openSubmissionsView = async (assignment) => {
    setSelectedAssignmentForSubmissions(assignment);
    setLoadingSubmissions(true);
    try {
      const subs = await getAssignmentSubmissions(assignment.id);
      setSubmissionsList(subs || []);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load student submissions.");
    } finally {
      setLoadingSubmissions(false);
    }
  };

  const openCreateModal = () => {
    setEditingAssignment(null);
    const initialClassId = classFilter !== "all" ? classFilter : classes[0]?.id || "";
    const initialSub = subjects.find((s) => String(s.classId) === String(initialClassId));
    setFormData({
      title: "",
      description: "",
      instructions: "Submit detailed handwritten or typed answers addressing the key syllabus questions.",
      classId: initialClassId,
      subjectId: initialSub?.id || "",
      chapterId: "",
      dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
      dueTime: "23:59",
      totalMarks: "10",
      passingMarks: "5",
    });
    setIsFormOpen(true);
  };

  const openEditModal = (a, e) => {
    e.stopPropagation();
    setEditingAssignment(a);
    setFormData({
      title: a.title || "",
      description: a.description || "",
      instructions: a.instructions || "",
      classId: a.classId || "",
      subjectId: a.subjectId || "",
      chapterId: a.chapterId || "",
      dueDate: a.dueDate ? a.dueDate.split("T")[0] : "",
      dueTime: a.dueTime || "23:59",
      totalMarks: String(a.totalMarks || "10"),
      passingMarks: String(a.passingMarks || "5"),
    });
    setIsFormOpen(true);
  };

  const handleDelete = async (id, title, e) => {
    e.stopPropagation();
    if (window.confirm(`Are you sure you want to delete assignment "${title}"?`)) {
      await deleteAssignment(id);
    }
  };

  const handleSaveAssignment = async (e) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      toast.error("Please enter an assignment title.");
      return;
    }
    if (!formData.classId) {
      toast.error("Please select a target class.");
      return;
    }

    const targetClass = classes.find((c) => String(c.id) === String(formData.classId));
    const targetSubject = subjects.find((s) => String(s.id) === String(formData.subjectId));

    setIsSubmitting(true);
    try {
      const payload = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        instructions: formData.instructions.trim(),
        classId: formData.classId,
        className: targetClass?.name || formData.classId,
        subjectId: formData.subjectId || "",
        subjectName: targetSubject?.name || "",
        chapterId: formData.chapterId || "",
        dueDate: formData.dueDate ? `${formData.dueDate}T${formData.dueTime || "23:59"}:00` : "",
        dueTime: formData.dueTime || "23:59",
        totalMarks: Number(formData.totalMarks) || 10,
        passingMarks: Number(formData.passingMarks) || 5,
      };

      if (editingAssignment) {
        await updateAssignment(editingAssignment.id, payload);
      } else {
        await addAssignment(payload);
      }
      setIsFormOpen(false);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmitStudentResponse = async (e) => {
    e.preventDefault();
    if (!submitResponseText.trim()) {
      toast.error("Please enter your assignment response.");
      return;
    }

    setSubmittingResponse(true);
    try {
      await submitAssignment(submitModal.id, {
        response: submitResponseText.trim(),
        classId: submitModal.classId,
        userName: userProfile?.name || user?.displayName || "Student",
        userEmail: user?.email || userProfile?.email || "",
      });

      setUserSubmissionsMap((prev) => ({
        ...prev,
        [submitModal.id]: {
          assignmentId: submitModal.id,
          response: submitResponseText.trim(),
          submittedAt: new Date().toISOString(),
        },
      }));
      setSubmitModal(null);
      setSubmitResponseText("");
    } catch (err) {
      console.error(err);
    } finally {
      setSubmittingResponse(false);
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs px-2.5 py-0.5 rounded-full font-bold bg-primary/10 text-primary border border-primary/20">
              Sindh Board Academic Tasks &amp; Homework
            </span>
            {!isAdmin && userProfile?.className && (
              <span className="text-xs px-2.5 py-0.5 rounded-full font-semibold bg-secondary text-secondary-foreground border border-border">
                {userProfile.className}
              </span>
            )}
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-foreground mt-1.5">
            {isAdmin ? "Institutional Assignments" : "My Class Assignments"}
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
            {isAdmin
              ? "Create homework assignments, set submission deadlines, and evaluate student responses."
              : "Review your class course assignments and submit your completed homework on time."}
          </p>
        </div>

        {isAdmin && (
          <div className="flex items-center gap-2.5">
            <Button
              onClick={openCreateModal}
              className="text-xs h-9 rounded-xl font-bold bg-primary text-primary-foreground shadow-sm shadow-primary/20 gap-1.5"
            >
              <Plus className="w-4 h-4" /> Create Assignment
            </Button>
          </div>
        )}
      </div>

      {/* Tabs Switcher for Admin: Assignments vs All Submissions */}
      {isAdmin && (
        <div className="flex items-center gap-2 border-b border-border/70 pb-3">
          <button
            onClick={() => {
              setActiveTab("assignments");
              setSelectedAssignmentForSubmissions(null);
            }}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === "assignments" && !selectedAssignmentForSubmissions
                ? "bg-gradient-to-r from-teal-600 via-teal-500 to-cyan-500 text-white shadow-sm"
                : "text-muted-foreground hover:text-foreground hover:bg-muted/60"
            }`}
          >
            <Award className="w-4 h-4" /> Published Assignments
            <span className="ml-1 px-2 py-0.5 rounded-full text-[10px] bg-black/20 text-white font-mono">
              {filteredAssignments.length}
            </span>
          </button>
        </div>
      )}

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-3.5 rounded-2xl bg-card border border-border/80 shadow-sm">
        <div className="relative flex-1 w-full max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search assignments by title or keyword..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 h-9 text-xs rounded-xl"
          />
        </div>

        {isAdmin && (
          <div className="flex items-center gap-2.5 w-full sm:w-auto">
            <select
              value={classFilter}
              onChange={(e) => setClassFilter(e.target.value)}
              className="h-9 rounded-xl border border-input bg-background px-3 text-xs text-foreground focus:outline-none font-medium"
            >
              <option value="all">All Classes (8–12)</option>
              {classes.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Assignments Grid */}
      {filteredAssignments.length === 0 ? (
        <div className="text-center py-16 px-4 bg-card border border-dashed border-border rounded-2xl space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mx-auto">
            <Award className="w-7 h-7" />
          </div>
          <div>
            <h3 className="text-base font-bold text-foreground">No assignments available</h3>
            <p className="text-xs text-muted-foreground max-w-md mx-auto mt-1">
              {!isAdmin
                ? "There are currently no active assignments due for your class. Great job staying up to date!"
                : "No assignments have been created yet. Click 'Create Assignment' to assign work."}
            </p>
          </div>
          {isAdmin && (
            <Button
              onClick={openCreateModal}
              size="sm"
              className="rounded-xl font-bold text-xs gap-1.5"
            >
              <Plus className="w-4 h-4" /> Create Assignment
            </Button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredAssignments.map((assignment) => {
            const hasSubmitted = Boolean(userSubmissionsMap[assignment.id]);
            const matchSubject = subjects.find((s) => String(s.id) === String(assignment.subjectId));
            const matchClass = classes.find((c) => String(c.id) === String(assignment.classId));

            const isPastDue = assignment.dueDate && new Date(assignment.dueDate) < new Date();

            return (
              <div
                key={assignment.id}
                className="group p-5 rounded-2xl bg-card border border-border/80 hover:border-primary/50 hover:shadow-lg transition-all duration-200 flex flex-col justify-between relative overflow-hidden"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20">
                      {matchClass?.name || assignment.className || "Class"}
                    </span>

                    {!isAdmin ? (
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 ${
                          hasSubmitted
                            ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20"
                            : isPastDue
                            ? "bg-destructive/10 text-destructive border border-destructive/20"
                            : "bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20"
                        }`}
                      >
                        {hasSubmitted ? (
                          <>
                            <CheckCircle2 className="w-3 h-3" /> Submitted
                          </>
                        ) : isPastDue ? (
                          <>
                            <Clock className="w-3 h-3" /> Overdue
                          </>
                        ) : (
                          <>
                            <Clock className="w-3 h-3" /> Pending
                          </>
                        )}
                      </span>
                    ) : (
                      <span className="text-[10px] font-mono text-muted-foreground">
                        Marks: {assignment.totalMarks || 10}
                      </span>
                    )}
                  </div>

                  <h3 className="font-bold text-sm sm:text-base text-foreground group-hover:text-primary transition-colors line-clamp-1">
                    {assignment.title}
                  </h3>

                  {matchSubject && (
                    <div className="text-xs font-semibold text-primary">
                      {matchSubject.name}
                    </div>
                  )}

                  <p className="text-xs text-muted-foreground line-clamp-2">
                    {assignment.description || "Course assignment syllabus work."}
                  </p>

                  <div className="flex items-center gap-3 pt-2 text-[11px] text-muted-foreground border-t border-border/60">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-primary" />
                      Due: {assignment.dueDate ? new Date(assignment.dueDate).toLocaleDateString() : "No Deadline"}
                    </span>
                    <span>•</span>
                    <span>Max Marks: {assignment.totalMarks || 10}</span>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-border/60 flex items-center justify-between gap-2">
                  {!isAdmin ? (
                    <Button
                      size="sm"
                      onClick={() => {
                        setSubmitModal(assignment);
                        setSubmitResponseText(
                          userSubmissionsMap[assignment.id]?.response || ""
                        );
                      }}
                      className={`text-xs font-bold rounded-xl h-8 gap-1.5 flex-1 ${
                        hasSubmitted
                          ? "bg-muted text-foreground hover:bg-muted/80 border border-border"
                          : "bg-primary text-primary-foreground shadow-xs"
                      }`}
                    >
                      <Send className="w-3.5 h-3.5" />
                      {hasSubmitted ? "View / Edit Submission" : "Submit Assignment"}
                    </Button>
                  ) : (
                    <>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => openSubmissionsView(assignment)}
                        className="text-xs font-bold rounded-xl h-8 gap-1.5 flex-1"
                      >
                        <Eye className="w-3.5 h-3.5 text-primary" /> View Submissions
                      </Button>

                      <div className="flex items-center gap-1">
                        <button
                          onClick={(e) => openEditModal(assignment, e)}
                          className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted"
                          title="Edit Assignment"
                        >
                          <Pencil className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={(e) => handleDelete(assignment.id, assignment.title, e)}
                          className="p-1.5 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                          title="Delete Assignment"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Admin Submissions Modal / Sheet */}
      <Dialog
        open={!!selectedAssignmentForSubmissions}
        onOpenChange={(open) => !open && setSelectedAssignmentForSubmissions(null)}
      >
        <DialogContent className="max-w-2xl rounded-2xl max-h-[85vh] overflow-y-auto">
          {selectedAssignmentForSubmissions && (
            <div className="space-y-4">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <FileCheck2 className="w-5 h-5 text-primary" />
                  Student Submissions — {selectedAssignmentForSubmissions.title}
                </DialogTitle>
                <p className="text-xs text-muted-foreground">
                  Class: {selectedAssignmentForSubmissions.className || selectedAssignmentForSubmissions.classId} • Total Marks: {selectedAssignmentForSubmissions.totalMarks || 10}
                </p>
              </DialogHeader>

              {loadingSubmissions ? (
                <div className="py-12 flex flex-col items-center justify-center gap-2 text-xs text-muted-foreground">
                  <Loader2 className="w-6 h-6 animate-spin text-primary" />
                  <span>Loading submissions...</span>
                </div>
              ) : submissionsList.length === 0 ? (
                <div className="text-center py-10 px-4 bg-muted/20 border border-dashed border-border rounded-xl space-y-2">
                  <FileText className="w-10 h-10 text-muted-foreground/60 mx-auto" />
                  <p className="text-xs font-semibold text-foreground">No students have submitted this assignment yet.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {submissionsList.map((sub, idx) => (
                    <div
                      key={sub.id || idx}
                      className="p-4 rounded-xl bg-card border border-border shadow-xs space-y-2 text-xs"
                    >
                      <div className="flex items-center justify-between">
                        <div className="font-bold text-foreground flex items-center gap-2">
                          <User className="w-3.5 h-3.5 text-primary" />
                          <span>{sub.userName || "Student"}</span>
                          <span className="text-[11px] text-muted-foreground font-normal">
                            ({sub.userEmail})
                          </span>
                        </div>
                        <span className="text-[11px] text-muted-foreground">
                          {sub.submittedAt ? new Date(sub.submittedAt).toLocaleString() : "Submitted"}
                        </span>
                      </div>

                      <div className="p-3 rounded-lg bg-muted/40 border border-border font-mono text-[11px] text-foreground whitespace-pre-wrap">
                        {sub.response}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <DialogFooter>
                <Button
                  onClick={() => setSelectedAssignmentForSubmissions(null)}
                  className="text-xs font-bold rounded-xl"
                >
                  Close Submissions
                </Button>
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Student Submit Response Modal */}
      <Dialog open={!!submitModal} onOpenChange={(open) => !open && setSubmitModal(null)}>
        <DialogContent className="max-w-md sm:max-w-lg rounded-2xl">
          {submitModal && (
            <form onSubmit={handleSubmitStudentResponse} className="space-y-4">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <Send className="w-5 h-5 text-primary" />
                  Submit Assignment: {submitModal.title}
                </DialogTitle>
                <p className="text-xs text-muted-foreground">
                  Class: {submitModal.className || submitModal.classId} • Due: {submitModal.dueDate ? new Date(submitModal.dueDate).toLocaleString() : "No Deadline"}
                </p>
              </DialogHeader>

              {submitModal.instructions && (
                <div className="p-3 rounded-xl bg-primary/5 border border-primary/20 text-xs text-muted-foreground space-y-1">
                  <span className="font-bold text-primary">Instructions:</span>
                  <p>{submitModal.instructions}</p>
                </div>
              )}

              <div className="space-y-1.5">
                <Label className="text-xs font-bold">Your Response / Solution</Label>
                <Textarea
                  rows={6}
                  placeholder="Type your solution, summary, or response notes here..."
                  value={submitResponseText}
                  onChange={(e) => setSubmitResponseText(e.target.value)}
                  className="text-xs rounded-xl"
                  required
                />
              </div>

              <DialogFooter className="gap-2 sm:gap-0">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setSubmitModal(null)}
                  className="text-xs rounded-xl"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={submittingResponse}
                  className="text-xs font-bold rounded-xl bg-primary text-primary-foreground gap-1.5 shadow-sm"
                >
                  {submittingResponse ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" /> Submitting...
                    </>
                  ) : (
                    <>
                      <Send className="w-3.5 h-3.5" /> Submit Response
                    </>
                  )}
                </Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>

      {/* Admin Add/Edit Assignment Modal */}
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="max-w-lg rounded-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Award className="w-5 h-5 text-primary" />
              {editingAssignment ? "Edit Assignment" : "Create New Assignment"}
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSaveAssignment} className="space-y-3.5 py-2 text-xs">
            <div className="space-y-1">
              <Label className="text-xs font-bold">Assignment Title</Label>
              <Input
                placeholder="e.g. Chapter 2 Exercise Numerical Problems"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="h-9 text-xs rounded-xl"
                required
              />
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div className="space-y-1">
                <Label className="text-xs font-bold">Class</Label>
                <select
                  value={formData.classId}
                  onChange={(e) => setFormData({ ...formData, classId: e.target.value, subjectId: "", chapterId: "" })}
                  className="w-full h-9 rounded-xl border border-input bg-background px-3 text-xs text-foreground focus:outline-none"
                  required
                >
                  <option value="" disabled>Select Class...</option>
                  {classes.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <Label className="text-xs font-bold">Subject</Label>
                <select
                  value={formData.subjectId}
                  onChange={(e) => setFormData({ ...formData, subjectId: e.target.value, chapterId: "" })}
                  className="w-full h-9 rounded-xl border border-input bg-background px-3 text-xs text-foreground focus:outline-none"
                >
                  <option value="">Select Subject...</option>
                  {formSubjects.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <Label className="text-xs font-bold">Chapter</Label>
                <select
                  value={formData.chapterId}
                  onChange={(e) => setFormData({ ...formData, chapterId: e.target.value })}
                  className="w-full h-9 rounded-xl border border-input bg-background px-3 text-xs text-foreground focus:outline-none"
                >
                  <option value="">General / All</option>
                  {formChapters.map((ch) => (
                    <option key={ch.id} value={ch.id}>
                      Ch {ch.chapterNumber}: {ch.title}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label className="text-xs font-bold">Due Date</Label>
                <Input
                  type="date"
                  value={formData.dueDate}
                  onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                  className="h-9 text-xs rounded-xl"
                  required
                />
              </div>

              <div className="space-y-1">
                <Label className="text-xs font-bold">Due Time</Label>
                <Input
                  type="time"
                  value={formData.dueTime}
                  onChange={(e) => setFormData({ ...formData, dueTime: e.target.value })}
                  className="h-9 text-xs rounded-xl"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label className="text-xs font-bold">Total Marks</Label>
                <Input
                  type="number"
                  min={1}
                  value={formData.totalMarks}
                  onChange={(e) => setFormData({ ...formData, totalMarks: e.target.value })}
                  className="h-9 text-xs rounded-xl"
                  required
                />
              </div>

              <div className="space-y-1">
                <Label className="text-xs font-bold">Passing Marks</Label>
                <Input
                  type="number"
                  min={1}
                  value={formData.passingMarks}
                  onChange={(e) => setFormData({ ...formData, passingMarks: e.target.value })}
                  className="h-9 text-xs rounded-xl"
                  required
                />
              </div>
            </div>

            <div className="space-y-1">
              <Label className="text-xs font-bold">Assignment Overview</Label>
              <Textarea
                rows={2}
                placeholder="Brief summary of assignment tasks..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="text-xs rounded-xl"
              />
            </div>

            <div className="space-y-1">
              <Label className="text-xs font-bold">Instructions for Students</Label>
              <Textarea
                rows={3}
                placeholder="Detailed submission guidelines, formatting rules, etc..."
                value={formData.instructions}
                onChange={(e) => setFormData({ ...formData, instructions: e.target.value })}
                className="text-xs rounded-xl"
              />
            </div>

            <DialogFooter className="pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsFormOpen(false)}
                className="text-xs rounded-xl"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="text-xs font-bold rounded-xl"
              >
                {isSubmitting ? "Saving..." : editingAssignment ? "Save Changes" : "Create Assignment"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
