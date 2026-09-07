import React, { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useLms } from "@/context/LmsContext";
import { useAuth } from "@/context/AuthContext";
import {
  Layers,
  BookOpen,
  PlayCircle,
  Search,
  Plus,
  Pencil,
  Trash2,
  ChevronRight,
  GraduationCap,
  Sparkles,
  Bookmark,
  BookmarkCheck,
  FileText,
  ListOrdered,
  BookMarked,
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
import { sindhBoardChapters } from "@/data/sindhBoardCurriculum";
import toast from "react-hot-toast";

export default function ChaptersPage() {
  const navigate = useNavigate();
  const {
    classes,
    subjects,
    books,
    chapters,
    quizzes,
    addChapter,
    updateChapter,
    deleteChapter,
    bookmarks,
    toggleBookmark,
    isBookmarked,
  } = useLms();
  const { userProfile, isAdmin } = useAuth();

  const [search, setSearch] = useState("");
  const [selectedClass, setSelectedClass] = useState("all");
  const [selectedSubject, setSelectedSubject] = useState("all");

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingChapter, setEditingChapter] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    chapterNumber: 1,
    classId: "",
    subjectId: "",
    description: "",
    theoryNotes: "",
    keyFormulas: "",
    learningObjectives: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Student class resolution
  const studentClassId = !isAdmin ? userProfile?.classId : null;

  useEffect(() => {
    if (!isAdmin && studentClassId) {
      setSelectedClass(studentClassId);
    }
  }, [isAdmin, studentClassId]);

  // Combine Firestore chapters with Sindh Board Curriculum chapters
  const allChaptersList = useMemo(() => {
    let list = [...chapters];
    if (list.length === 0) {
      list = [...sindhBoardChapters];
    }
    return list;
  }, [chapters]);

  // Filtered Chapters
  const filteredChapters = useMemo(() => {
    return allChaptersList.filter((ch) => {
      if (!isAdmin) {
        if (studentClassId && String(ch.classId) !== String(studentClassId)) {
          return false;
        }
      } else {
        if (selectedClass !== "all" && String(ch.classId) !== String(selectedClass)) {
          return false;
        }
      }

      if (selectedSubject !== "all" && String(ch.subjectId) !== String(selectedSubject)) {
        return false;
      }

      if (search.trim()) {
        const q = search.toLowerCase();
        return (
          ch.title?.toLowerCase().includes(q) ||
          ch.description?.toLowerCase().includes(q) ||
          String(ch.chapterNumber).includes(q)
        );
      }

      return true;
    });
  }, [allChaptersList, isAdmin, studentClassId, selectedClass, selectedSubject, search]);

  const openAddModal = () => {
    setEditingChapter(null);
    const initialClassId = selectedClass !== "all" ? selectedClass : classes[0]?.id || "class-9";
    const initialSub = subjects.find((s) => String(s.classId) === String(initialClassId));
    setFormData({
      title: "",
      chapterNumber: filteredChapters.length + 1,
      classId: initialClassId,
      subjectId: initialSub?.id || "",
      description: "",
      theoryNotes: "",
      keyFormulas: "",
      learningObjectives: "",
    });
    setIsModalOpen(true);
  };

  const openEditModal = (chapter, e) => {
    e.stopPropagation();
    setEditingChapter(chapter);
    setFormData({
      title: chapter.title || "",
      chapterNumber: chapter.chapterNumber || 1,
      classId: chapter.classId || "",
      subjectId: chapter.subjectId || "",
      description: chapter.description || "",
      theoryNotes: chapter.theoryNotes || "",
      keyFormulas: chapter.keyFormulas || "",
      learningObjectives: Array.isArray(chapter.learningObjectives)
        ? chapter.learningObjectives.join("\n")
        : chapter.learningObjectives || "",
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (chapterId, title, e) => {
    e.stopPropagation();
    if (window.confirm(`Are you sure you want to delete chapter "${title}"?`)) {
      try {
        await deleteChapter(chapterId);
      } catch (err) {
        console.error("Delete chapter failed:", err);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      toast.error("Please provide a chapter title.");
      return;
    }
    if (!formData.classId) {
      toast.error("Please select a target class.");
      return;
    }
    if (!formData.subjectId) {
      toast.error("Please select a target subject.");
      return;
    }

    const sloArray = formData.learningObjectives
      .split("\n")
      .map((s) => s.trim())
      .filter(Boolean);

    setIsSubmitting(true);
    try {
      if (editingChapter) {
        await updateChapter(editingChapter.id, {
          title: formData.title.trim(),
          chapterNumber: Number(formData.chapterNumber) || 1,
          classId: formData.classId,
          subjectId: formData.subjectId,
          description: formData.description.trim(),
          theoryNotes: formData.theoryNotes.trim(),
          keyFormulas: formData.keyFormulas.trim(),
          learningObjectives: sloArray,
        });
      } else {
        await addChapter({
          title: formData.title.trim(),
          chapterNumber: Number(formData.chapterNumber) || 1,
          classId: formData.classId,
          subjectId: formData.subjectId,
          description: formData.description.trim(),
          theoryNotes: formData.theoryNotes.trim(),
          keyFormulas: formData.keyFormulas.trim(),
          learningObjectives: sloArray,
        });
      }
      setIsModalOpen(false);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs px-2.5 py-0.5 rounded-full font-bold bg-primary/10 text-primary border border-primary/20">
              Sindh Textbook Board • Chapters &amp; Learning Outcomes
            </span>
            {!isAdmin && userProfile?.className && (
              <span className="text-xs px-2.5 py-0.5 rounded-full font-semibold bg-secondary text-secondary-foreground border border-border">
                {userProfile.className}
              </span>
            )}
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-foreground mt-1.5">
            {isAdmin ? "Curriculum Chapters Bank" : "My Course Chapters"}
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
            {isAdmin
              ? "Publish, organize, and manage chapter notes, formulas, and assessments across all subjects."
              : "Review chapter-by-chapter theory, formulas, and self-assessment quizzes for your enrolled class."}
          </p>
        </div>

        {isAdmin && (
          <Button
            onClick={openAddModal}
            className="text-xs h-9 rounded-xl font-bold bg-primary text-primary-foreground shadow-sm shadow-primary/20 gap-1.5 shrink-0"
          >
            <Plus className="w-4 h-4" /> Add Chapter
          </Button>
        )}
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-3.5 rounded-2xl bg-card border border-border/80 shadow-sm">
        <div className="relative flex-1 w-full max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search chapters by title or keyword..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 h-9 text-xs rounded-xl"
          />
        </div>

        <div className="flex items-center gap-2.5 w-full sm:w-auto flex-wrap">
          {isAdmin && (
            <select
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              className="h-9 rounded-xl border border-input bg-background px-3 text-xs text-foreground focus:outline-none font-medium"
            >
              <option value="all">All Classes (8–12)</option>
              {classes.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          )}

          <select
            value={selectedSubject}
            onChange={(e) => setSelectedSubject(e.target.value)}
            className="h-9 rounded-xl border border-input bg-background px-3 text-xs text-foreground focus:outline-none font-medium"
          >
            <option value="all">All Subjects</option>
            {subjects.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name} ({s.code || s.classId})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Chapters Grid */}
      {filteredChapters.length === 0 ? (
        <div className="text-center py-16 px-4 bg-card border border-dashed border-border rounded-2xl space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mx-auto">
            <Layers className="w-7 h-7" />
          </div>
          <div>
            <h3 className="text-base font-bold text-foreground">No chapters available</h3>
            <p className="text-xs text-muted-foreground max-w-md mx-auto mt-1">
              {!isAdmin
                ? "No chapters match your current criteria. Check your enrolled class or notify your teacher."
                : "No chapters have been registered matching your criteria. Click 'Add Chapter' to create one."}
            </p>
          </div>
          {isAdmin && (
            <Button
              onClick={openAddModal}
              size="sm"
              className="rounded-xl font-bold text-xs gap-1.5"
            >
              <Plus className="w-4 h-4" /> Add Chapter
            </Button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredChapters.map((chapter) => {
            const matchClass = classes.find((c) => String(c.id) === String(chapter.classId));
            const matchSubject = subjects.find((s) => String(s.id) === String(chapter.subjectId));
            const chapterQuizzes = quizzes.filter(
              (q) => String(q.chapterId) === String(chapter.id)
            );
            const bookmarked = isBookmarked ? isBookmarked(chapter.id) : false;

            return (
              <div
                key={chapter.id}
                className="group p-5 rounded-2xl bg-card border border-border/80 hover:border-primary/50 hover:shadow-lg transition-all duration-200 flex flex-col justify-between relative overflow-hidden"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-md bg-primary/10 text-primary border border-primary/20">
                        {matchSubject?.name || "Subject"}
                      </span>
                      <span className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-muted text-muted-foreground">
                        {matchClass?.name || chapter.classId || "Class"}
                      </span>
                    </div>

                    <button
                      onClick={() => toggleBookmark && toggleBookmark(chapter.id)}
                      className="p-1 text-muted-foreground hover:text-primary transition-colors"
                      title={bookmarked ? "Remove Bookmark" : "Save Bookmark"}
                    >
                      {bookmarked ? (
                        <BookmarkCheck className="w-4 h-4 text-primary" />
                      ) : (
                        <Bookmark className="w-4 h-4" />
                      )}
                    </button>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-teal-600/15 to-cyan-500/15 text-primary border border-primary/20 flex items-center justify-center shrink-0 font-black text-xs shadow-xs">
                      Ch {chapter.chapterNumber}
                    </div>
                    <div className="min-w-0">
                      <h3 className="font-bold text-sm text-foreground group-hover:text-primary transition-colors line-clamp-1">
                        {chapter.title}
                      </h3>
                      <p className="text-xs text-muted-foreground line-clamp-2 mt-0.5">
                        {chapter.description || "Sindh Textbook Board curriculum syllabus chapter notes."}
                      </p>
                    </div>
                  </div>

                  {/* Highlights */}
                  <div className="flex items-center gap-3 pt-2 text-[11px] text-muted-foreground border-t border-border/60">
                    <span className="flex items-center gap-1">
                      <FileText className="w-3.5 h-3.5 text-primary" />
                      {Array.isArray(chapter.learningObjectives)
                        ? `${chapter.learningObjectives.length} SLOs`
                        : "Detailed Notes"}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <PlayCircle className="w-3.5 h-3.5 text-cyan-500" />
                      {chapterQuizzes.length} Quizzes
                    </span>
                  </div>
                </div>

                {/* Card Action Buttons */}
                <div className="mt-4 pt-3 border-t border-border/60 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 flex-1">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() =>
                        navigate(
                          `/classes/${chapter.classId || "class-9"}/subjects/${chapter.subjectId || "sub"}/chapters/${chapter.id}/content`
                        )
                      }
                      className="text-xs font-semibold rounded-xl h-8 gap-1.5 flex-1"
                    >
                      <BookOpen className="w-3.5 h-3.5 text-primary" /> Study Notes
                    </Button>

                    <Button
                      size="sm"
                      onClick={() =>
                        navigate(
                          `/classes/${chapter.classId || "class-9"}/subjects/${chapter.subjectId || "sub"}/chapters/${chapter.id}/quiz`
                        )
                      }
                      className="text-xs font-bold rounded-xl h-8 gap-1.5 shadow-xs"
                    >
                      <PlayCircle className="w-3.5 h-3.5" /> Quiz
                    </Button>
                  </div>

                  {isAdmin && (
                    <div className="flex items-center gap-1">
                      <button
                        onClick={(e) => openEditModal(chapter, e)}
                        className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted"
                        title="Edit Chapter"
                      >
                        <Pencil className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={(e) => handleDelete(chapter.id, chapter.title, e)}
                        className="p-1.5 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                        title="Delete Chapter"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Admin Add/Edit Chapter Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-md sm:max-w-lg rounded-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Layers className="w-5 h-5 text-primary" />
              {editingChapter ? "Edit Chapter" : "Add Chapter"}
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-3.5 py-2 text-xs">
            <div className="grid grid-cols-3 gap-3">
              <div className="col-span-2 space-y-1">
                <Label className="text-xs font-bold">Chapter Title</Label>
                <Input
                  placeholder="e.g. Physical Quantities & Measurement"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="h-9 text-xs rounded-xl"
                  required
                />
              </div>

              <div className="space-y-1">
                <Label className="text-xs font-bold">Number</Label>
                <Input
                  type="number"
                  min={1}
                  value={formData.chapterNumber}
                  onChange={(e) => setFormData({ ...formData, chapterNumber: e.target.value })}
                  className="h-9 text-xs rounded-xl"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label className="text-xs font-bold">Target Class</Label>
                <select
                  value={formData.classId}
                  onChange={(e) => setFormData({ ...formData, classId: e.target.value })}
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
                  onChange={(e) => setFormData({ ...formData, subjectId: e.target.value })}
                  className="w-full h-9 rounded-xl border border-input bg-background px-3 text-xs text-foreground focus:outline-none"
                  required
                >
                  <option value="" disabled>Select Subject...</option>
                  {subjects.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name} ({s.code || s.classId})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="space-y-1">
              <Label className="text-xs font-bold">Description / Summary</Label>
              <Textarea
                rows={2}
                placeholder="Overview of the chapter..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="text-xs rounded-xl"
              />
            </div>

            <div className="space-y-1">
              <Label className="text-xs font-bold">Student Learning Outcomes (SLOs - one per line)</Label>
              <Textarea
                rows={3}
                placeholder="Define physical quantities&#10;Differentiate between base and derived units&#10;Describe vernier calipers and screw gauge"
                value={formData.learningObjectives}
                onChange={(e) => setFormData({ ...formData, learningObjectives: e.target.value })}
                className="text-xs rounded-xl font-mono"
              />
            </div>

            <div className="space-y-1">
              <Label className="text-xs font-bold">Key Formulas / Expressions</Label>
              <Input
                placeholder="e.g. Least Count = Pitch / Total Divisions"
                value={formData.keyFormulas}
                onChange={(e) => setFormData({ ...formData, keyFormulas: e.target.value })}
                className="h-9 text-xs rounded-xl"
              />
            </div>

            <DialogFooter className="pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsModalOpen(false)}
                className="text-xs rounded-xl"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="text-xs font-bold rounded-xl"
              >
                {isSubmitting ? "Saving..." : editingChapter ? "Save Changes" : "Create Chapter"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
