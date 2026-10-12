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
  Bookmark,
  BookmarkCheck,
  CheckCircle2,
  Link2,
  Video,
  FileText,
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

export default function SubjectChaptersPage() {
  const { classId, subjectId, bookId } = useParams();
  const navigate = useNavigate();
  const {
    classes,
    subjects,
    books,
    chapters,
    quizzes,
    studentAttempts,
    loadingLms,
    bookmarks,
    toggleBookmark,
    isBookmarked,
    addChapter,
    updateChapter,
    deleteChapter,
  } = useLms();
  const { user, isAdmin, userProfile } = useAuth();

  // Resolve entities from real Firestore data
  const currentClass = useMemo(() => {
    return classes.find((c) => String(c.id) === String(classId)) || { id: classId, name: `Class ${classId}` };
  }, [classes, classId]);

  const currentSubject = useMemo(() => {
    return subjects.find((s) => String(s.id) === String(subjectId)) || { id: subjectId, name: "Subject" };
  }, [subjects, subjectId]);

  const currentBook = books.find((b) => String(b.id) === String(bookId));
  const effectiveBookId = bookId || currentBook?.id || "";

  // Real Firestore chapters only — no sindhBoard fallbacks
  const subjectChapters = useMemo(() => {
    return chapters
      .filter(
        (c) =>
          String(c.subjectId) === String(subjectId) ||
          (bookId && String(c.bookId) === String(bookId))
      )
      .sort((a, b) => Number(a.chapterNumber || 0) - Number(b.chapterNumber || 0));
  }, [chapters, subjectId, bookId]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingChapter, setEditingChapter] = useState(null);
  const [formData, setFormData] = useState({
    chapterNumber: "",
    title: "",
    description: "",
    theoryNotes: "",
    keyFormulas: "",
    videoUrl: "",
    textbookContent: "",
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
      videoUrl: "",
      textbookContent: "",
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
      videoUrl: chap.videoUrl || "",
      textbookContent: chap.textbookContent || "",
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
          videoUrl: formData.videoUrl.trim(),
          textbookContent: formData.textbookContent.trim(),
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
          videoUrl: formData.videoUrl.trim(),
          textbookContent: formData.textbookContent.trim(),
        });
      }
      setIsModalOpen(false);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loadingLms) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center space-y-3">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-sm text-muted-foreground">Loading chapters…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-5xl mx-auto space-y-6 animate-in fade-in duration-300">
      {/* Breadcrumb */}
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
        <span className="text-foreground font-medium">{currentSubject.name}</span>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-primary font-bold">Chapters</span>
      </nav>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs px-2.5 py-0.5 rounded-full font-medium bg-muted text-muted-foreground">
              {currentClass.name} • {currentSubject.name}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-foreground mt-1">
            {currentSubject.name} Chapters
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
            Study notes, textbook content, videos & self-assessment quizzes for each chapter.
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
            onClick={() => navigate(`/classes/${classId}/subjects`)}
            className="text-xs h-9 rounded-xl font-semibold gap-1.5"
          >
            <ChevronLeft className="w-4 h-4" /> Back to Subjects
          </Button>
        </div>
      </div>

      {/* Chapters List */}
      {subjectChapters.length === 0 ? (
        <div className="text-center py-16 px-4 bg-card border border-dashed border-border rounded-2xl space-y-4">
          <BookOpen className="w-12 h-12 text-muted-foreground/60 mx-auto" />
          <div className="max-w-sm mx-auto space-y-1">
            <h3 className="text-base font-bold text-foreground">No chapters added yet</h3>
            <p className="text-xs text-muted-foreground">
              {isAdmin
                ? `Click 'Add Chapter' to create the first syllabus chapter for ${currentSubject?.name || "this subject"}.`
                : `No chapters have been published yet for ${currentSubject?.name || "this subject"}. Check back soon.`}
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
            <span>{subjectChapters.length} Chapter{subjectChapters.length !== 1 ? "s" : ""}</span>
            <span>Study & Assessment</span>
          </div>

          {subjectChapters.map((chapter) => {
            const chapterQuizzes = quizzes.filter((q) => String(q.chapterId) === String(chapter.id));
            const bookmarked = isBookmarked(chapter.id);
            const userPassedInChap = (studentAttempts || []).filter(
              (a) =>
                String(a.chapterId) === String(chapter.id) &&
                (user ? a.userId === user.uid : true) &&
                a.passed
            ).length;
            const isCompleted = chapterQuizzes.length > 0 && userPassedInChap >= chapterQuizzes.length;

            return (
              <div
                key={chapter.id}
                onClick={() =>
                  navigate(
                    `/classes/${classId}/subjects/${subjectId}/chapters/${chapter.id}/content`
                  )
                }
                className="group bg-card text-card-foreground border border-border/80 rounded-3xl p-5 sm:p-6 hover:border-primary/50 hover:shadow-lg transition-all duration-200 cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-5"
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
                      {chapter.videoUrl && (
                        <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded-full bg-red-500/10 text-red-500 border border-red-500/20 flex items-center gap-0.5">
                          <Video className="w-2.5 h-2.5" /> Video
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground line-clamp-1">
                      {chapter.description || `Chapter ${chapter.chapterNumber} — study notes and assessment.`}
                    </p>
                  </div>
                </div>

                {/* Actions */}
                <div
                  onClick={(e) => e.stopPropagation()}
                  className="flex items-center justify-between sm:justify-end gap-2.5 shrink-0 pt-3 sm:pt-0 border-t sm:border-t-0 border-border"
                >
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() =>
                      navigate(
                        `/classes/${classId}/subjects/${subjectId}/chapters/${chapter.id}/content`
                      )
                    }
                    className="text-xs h-8 rounded-xl font-semibold gap-1.5"
                  >
                    <BookOpen className="w-3.5 h-3.5 text-primary" /> Study
                  </Button>

                  <Button
                    size="sm"
                    onClick={() =>
                      navigate(`/classes/${classId}/subjects/${subjectId}/chapters/${chapter.id}/quiz`)
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
          <DialogContent className="max-w-lg rounded-3xl p-6 max-h-[92vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-xl font-black text-foreground">
                {editingChapter ? "Edit Chapter" : "Add Chapter"}
              </DialogTitle>
              <p className="text-xs text-muted-foreground">
                Configure chapter for {currentSubject?.name} ({currentClass?.name}).
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
                    onChange={(e) => setFormData((prev) => ({ ...prev, chapterNumber: e.target.value }))}
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
                  placeholder="Overview of topics covered in this chapter..."
                  value={formData.description}
                  onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                  className="text-xs rounded-xl min-h-[60px]"
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-bold flex items-center gap-1.5">
                  <Video className="w-3.5 h-3.5 text-red-500" /> YouTube Video URL (optional)
                </Label>
                <Input
                  placeholder="https://www.youtube.com/watch?v=... or video ID"
                  value={formData.videoUrl}
                  onChange={(e) => setFormData((prev) => ({ ...prev, videoUrl: e.target.value }))}
                  className="text-xs rounded-xl h-9"
                />
                <p className="text-[10px] text-muted-foreground">
                  Paste a full YouTube URL or just the 11-character video ID.
                </p>
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-bold flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5 text-primary" /> Textbook Content (optional)
                </Label>
                <Textarea
                  placeholder="Paste or type the chapter's textbook reading content here..."
                  value={formData.textbookContent}
                  onChange={(e) => setFormData((prev) => ({ ...prev, textbookContent: e.target.value }))}
                  className="text-xs rounded-xl min-h-[80px]"
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-bold">Theory Notes & Key Concepts</Label>
                <Textarea
                  placeholder="Detailed notes, theoretical explanations, and key definitions..."
                  value={formData.theoryNotes}
                  onChange={(e) => setFormData((prev) => ({ ...prev, theoryNotes: e.target.value }))}
                  className="text-xs rounded-xl min-h-[80px]"
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-bold">Key Formulas & Equations</Label>
                <Textarea
                  placeholder={"v = s / t\na = (vf - vi) / t\nF = ma"}
                  value={formData.keyFormulas}
                  onChange={(e) => setFormData((prev) => ({ ...prev, keyFormulas: e.target.value }))}
                  className="text-xs rounded-xl min-h-[60px] font-mono"
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
