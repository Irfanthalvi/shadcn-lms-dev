import React, { useState, useMemo, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useLms } from "@/context/LmsContext";
import { useAuth } from "@/context/AuthContext";
import {
  ChevronLeft,
  ChevronRight,
  Plus,
  Pencil,
  Trash2,
  BookOpen,
  PlayCircle,
  HelpCircle,
  FileText,
  Bookmark,
  BookmarkCheck,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  GraduationCap,
  Atom,
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
import { sindhBoardClasses, sindhBoardSubjects, sindhBoardChapters } from "@/data/sindhBoardCurriculum";
import toast from "react-hot-toast";

export default function SubjectChaptersPage() {
  const { classId, subjectId, bookId } = useParams();
  const navigate = useNavigate();
  const {
    classes,
    subjects,
    books,
    chapters,
    quizzes,
    loadingLms,
    bookmarks,
    toggleBookmark,
    isBookmarked,
    addChapter,
    updateChapter,
    deleteChapter,
  } = useLms();
  const { user, isAdmin, userProfile } = useAuth();

  // Strict Class Access enforcement
  useEffect(() => {
    if (!isAdmin && userProfile?.classId && classId && String(classId) !== String(userProfile.classId)) {
      toast.error("Access restricted: You can only view your enrolled class.");
      navigate(`/classes/${userProfile.classId}/subjects`, { replace: true });
    }
  }, [isAdmin, userProfile, classId, navigate]);

  const currentClass = useMemo(() => {
    return (
      classes.find((c) => String(c.id) === String(classId)) ||
      sindhBoardClasses.find((c) => String(c.id) === String(classId)) || {
        id: classId,
        name: `Class ${String(classId).replace("class-", "")}`,
      }
    );
  }, [classes, classId]);

  const currentSubject = useMemo(() => {
    return (
      subjects.find((s) => String(s.id) === String(subjectId)) ||
      sindhBoardSubjects.find((s) => String(s.id) === String(subjectId)) || {
        id: subjectId,
        name: "Subject",
      }
    );
  }, [subjects, subjectId]);

  const currentBook = books.find((b) => String(b.id) === String(bookId));
  const effectiveBookId = bookId || currentBook?.id || "stbb-book";

  // Match Chapters: check Firestore chapters, fallback to sindhBoardChapters
  const subjectChapters = useMemo(() => {
    const fromFs = chapters.filter(
      (c) =>
        String(c.subjectId) === String(subjectId) ||
        (bookId && String(c.bookId) === String(bookId))
    );

    if (fromFs.length > 0) return fromFs;

    // Fallback to official Sindh Board chapters if firestore is still empty
    if (currentSubject) {
      const fallback = sindhBoardChapters.filter(
        (c) =>
          c.classId === classId ||
          (currentSubject.name && c.subjectId.toLowerCase().includes(currentSubject.name.toLowerCase().substring(0, 3)))
      );
      if (fallback.length > 0) return fallback;
    }

    return fromFs;
  }, [chapters, subjectId, bookId, classId, currentSubject]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingChapter, setEditingChapter] = useState(null);
  const [formData, setFormData] = useState({
    chapterNumber: "",
    title: "",
    description: "",
    theoryNotes: "",
    keyFormulas: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const openAddModal = () => {
    setEditingChapter(null);
    const nextNum = subjectChapters.length + 1;
    setFormData({
      chapterNumber: String(nextNum),
      title: "",
      description: "",
      theoryNotes: "",
      keyFormulas: "",
    });
    setIsModalOpen(true);
  };

  const openEditModal = (chap, e) => {
    e.stopPropagation();
    setEditingChapter(chap);
    setFormData({
      chapterNumber: String(chap.chapterNumber || ""),
      title: chap.title || "",
      description: chap.description || "",
      theoryNotes: chap.theoryNotes || "",
      keyFormulas: chap.keyFormulas || "",
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (chapterId, title, e) => {
    e.stopPropagation();
    if (
      window.confirm(
        `Are you sure you want to delete "${title}"? This will also remove any quizzes for this chapter.`
      )
    ) {
      await deleteChapter(chapterId);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      toast.error("Please provide a chapter title.");
      return;
    }

    setIsSubmitting(true);
    try {
      if (editingChapter) {
        await updateChapter(editingChapter.id, {
          chapterNumber: Number(formData.chapterNumber) || 1,
          title: formData.title.trim(),
          description: formData.description.trim(),
          theoryNotes: formData.theoryNotes.trim(),
          keyFormulas: formData.keyFormulas.trim(),
          bookId: String(effectiveBookId),
        });
      } else {
        await addChapter({
          subjectId: String(subjectId),
          classId: String(classId),
          bookId: String(effectiveBookId),
          chapterNumber: Number(formData.chapterNumber) || 1,
          title: formData.title.trim(),
          description: formData.description.trim(),
          theoryNotes: formData.theoryNotes.trim(),
          keyFormulas: formData.keyFormulas.trim(),
        });
      }
      setIsModalOpen(false);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!currentClass || !currentSubject) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4 p-4 text-center">
        <h2 className="text-xl font-bold text-foreground">Subject Not Found</h2>
        <p className="text-sm text-muted-foreground">The requested subject or class could not be found.</p>
        <Button onClick={() => navigate("/classes")} variant="outline" className="gap-2 rounded-xl text-xs">
          <ChevronLeft className="w-4 h-4" /> Back to Classes
        </Button>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-5xl mx-auto space-y-6 animate-in fade-in duration-300">
      {/* 5-Level Hierarchy Breadcrumbs: Class → Subject → Book → Chapters */}
      <nav className="flex items-center gap-1.5 text-xs text-muted-foreground flex-wrap">
        <button onClick={() => navigate("/classes")} className="hover:text-foreground font-medium transition">
          Classes
        </button>
        <ChevronRight className="w-3.5 h-3.5" />
        <button
          onClick={() => navigate(`/classes/${classId}/subjects`)}
          className="hover:text-foreground font-medium transition"
        >
          {currentClass.name}
        </button>
        <ChevronRight className="w-3.5 h-3.5" />
        <button
          onClick={() => navigate(`/classes/${classId}/subjects/${subjectId}/books`)}
          className="hover:text-foreground font-medium transition"
        >
          {currentSubject.name}
        </button>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-primary font-bold">Chapters</span>
      </nav>

      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs px-2.5 py-0.5 rounded-full font-bold bg-primary/10 text-primary border border-primary/20">
              Sindh Board Syllabus
            </span>
            <span className="text-xs px-2.5 py-0.5 rounded-full font-medium bg-muted text-muted-foreground">
              {currentClass.name} • {currentSubject.name}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-foreground mt-1">
            {currentSubject.name} Chapters
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
            Explore chapters, study official notes & theory, formulas, and take self-assessment quizzes.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          {isAdmin && (
            <Button
              onClick={openAddModal}
              className="text-xs h-9 rounded-xl font-bold shadow-sm shadow-primary/20 gap-1.5"
            >
              <Plus className="w-4 h-4" /> Add Chapter
            </Button>
          )}

          <Button
            variant="outline"
            onClick={() => navigate(`/classes/${classId}/subjects/${subjectId}/books`)}
            className="text-xs h-9 rounded-xl font-semibold gap-1.5"
          >
            <ChevronLeft className="w-4 h-4" /> Back to Books
          </Button>
        </div>
      </div>

      {/* Chapters List */}
      {subjectChapters.length === 0 ? (
        <div className="text-center py-16 px-4 bg-card border border-dashed border-border rounded-2xl space-y-4">
          <BookOpen className="w-12 h-12 text-muted-foreground/60 mx-auto" />
          <div className="max-w-sm mx-auto space-y-1">
            <h3 className="text-base font-bold text-foreground">No chapters available</h3>
            <p className="text-xs text-muted-foreground">
              {isAdmin
                ? "Click 'Add Chapter' to create your first chapter for this subject."
                : "No chapters have been published yet for this subject."}
            </p>
          </div>
          {isAdmin && (
            <Button onClick={openAddModal} className="gap-2 text-xs rounded-xl font-bold">
              <Plus className="w-4 h-4" /> Add First Chapter
            </Button>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex items-center justify-between px-1 text-xs font-bold uppercase tracking-wider text-muted-foreground">
            <span>
              {subjectChapters.length} Chapter{subjectChapters.length !== 1 ? "s" : ""} in Syllabus
            </span>
            <span>Study & Assessment</span>
          </div>

          {subjectChapters.map((chapter) => {
            const chapterQuizzes = quizzes.filter(
              (q) => String(q.chapterId) === String(chapter.id)
            );
            const bookmarked = isBookmarked(chapter.id);

            // User passed assessment status
            const userPassedInChap = studentAttempts.filter(
              (a) =>
                String(a.chapterId) === String(chapter.id) &&
                (user ? a.userId === user.uid : true) &&
                a.passed
            ).length;
            const isCompleted = chapterQuizzes.length > 0 && userPassedInChap >= chapterQuizzes.length;

            return (
              <div
                key={chapter.id}
                className="group bg-card text-card-foreground border border-border/80 rounded-3xl p-5 sm:p-6 hover:border-primary/50 hover:shadow-lg transition-all duration-200 flex flex-col sm:flex-row sm:items-center justify-between gap-5"
              >
                <div className="flex items-start sm:items-center gap-4 min-w-0">
                  <div
                    className={`w-12 h-12 rounded-2xl font-black text-sm flex items-center justify-center shrink-0 border ${
                      isCompleted
                        ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30"
                        : "bg-primary/10 text-primary border-primary/20"
                    }`}
                  >
                    {isCompleted ? <CheckCircle2 className="w-6 h-6" /> : chapter.chapterNumber}
                  </div>

                  <div className="min-w-0 space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-bold text-base text-foreground group-hover:text-primary transition-colors">
                        {chapter.title}
                      </h3>
                      {isCompleted && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                          Assessment Passed
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground line-clamp-1">
                      {chapter.description ||
                        `Chapter ${chapter.chapterNumber} Sindh Board textbook theory notes, formulas, and tests.`}
                    </p>
                  </div>
                </div>

                {/* Actions: Read Content + Take Quiz */}
                <div className="flex items-center justify-between sm:justify-end gap-2.5 shrink-0 pt-3 sm:pt-0 border-t sm:border-t-0 border-border">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() =>
                      navigate(
                        `/classes/${classId}/subjects/${subjectId}/books/${effectiveBookId}/chapters/${chapter.id}/content`
                      )
                    }
                    className="text-xs h-8 rounded-xl font-semibold gap-1.5"
                  >
                    <BookOpen className="w-3.5 h-3.5 text-primary" /> Study Notes
                  </Button>

                  <Button
                    size="sm"
                    onClick={() =>
                      navigate(
                        `/classes/${classId}/subjects/${subjectId}/chapters/${chapter.id}/quiz`
                      )
                    }
                    className="text-xs h-8 rounded-xl font-bold gap-1.5 shadow-sm"
                  >
                    <PlayCircle className="w-3.5 h-3.5" /> Quiz ({chapterQuizzes.length})
                  </Button>

                  <button
                    onClick={() => toggleBookmark(chapter.id)}
                    className="p-1.5 text-muted-foreground hover:text-primary rounded-xl transition"
                    title={bookmarked ? "Bookmarked" : "Bookmark chapter"}
                  >
                    {bookmarked ? (
                      <BookmarkCheck className="w-4 h-4 text-primary" />
                    ) : (
                      <Bookmark className="w-4 h-4" />
                    )}
                  </button>

                  {isAdmin && (
                    <div className="flex items-center gap-1">
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={(e) => openEditModal(chapter, e)}
                        className="h-8 w-8 text-muted-foreground hover:text-primary rounded-xl"
                        title="Edit Chapter"
                      >
                        <Pencil className="w-3.5 h-3.5" />
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={(e) => handleDelete(chapter.id, chapter.title, e)}
                        className="h-8 w-8 text-muted-foreground hover:text-destructive rounded-xl"
                        title="Delete Chapter"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Admin Add / Edit Chapter Modal */}
      {isAdmin && (
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogContent className="max-w-md rounded-3xl p-6">
            <DialogHeader>
              <DialogTitle className="text-xl font-black text-foreground">
                {editingChapter ? "Edit Chapter" : "Add Chapter to Syllabus"}
              </DialogTitle>
              <p className="text-xs text-muted-foreground">
                Configure curriculum unit for {currentSubject?.name} ({currentClass?.name}).
              </p>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="space-y-4 pt-2">
              <div className="grid grid-cols-4 gap-3">
                <div className="col-span-1 space-y-1.5">
                  <Label className="text-xs font-bold">Ch #</Label>
                  <Input
                    type="number"
                    min="1"
                    value={formData.chapterNumber}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, chapterNumber: e.target.value }))
                    }
                    className="text-xs rounded-xl h-9 text-center font-bold"
                    required
                  />
                </div>

                <div className="col-span-3 space-y-1.5">
                  <Label className="text-xs font-bold">Chapter Title *</Label>
                  <Input
                    placeholder="e.g. Physical Quantities and Measurement"
                    value={formData.title}
                    onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
                    className="text-xs rounded-xl h-9"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-bold">Brief Description</Label>
                <Textarea
                  placeholder="Overview of topics and concepts covered in this chapter..."
                  value={formData.description}
                  onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                  className="text-xs rounded-xl min-h-[70px]"
                />
              </div>

              <DialogFooter className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsModalOpen(false)}
                  className="rounded-xl text-xs"
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting} className="rounded-xl text-xs font-bold">
                  {isSubmitting ? "Saving..." : editingChapter ? "Update Chapter" : "Add Chapter"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
