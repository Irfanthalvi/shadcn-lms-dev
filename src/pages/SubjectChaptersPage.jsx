import React, { useState } from "react";
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
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

export default function SubjectChaptersPage() {
  const { classId, subjectId } = useParams();
  const navigate = useNavigate();
  const { classes, subjects, chapters, quizzes, addChapter, updateChapter, deleteChapter } = useLms();
  const { isAdmin } = useAuth();

  const currentClass = classes.find((c) => String(c.id) === String(classId));
  const currentSubject = subjects.find((s) => String(s.id) === String(subjectId));
  const subjectChapters = chapters.filter((c) => String(c.subjectId) === String(subjectId));

  // Modal State for Add / Edit Chapter
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingChapter, setEditingChapter] = useState(null);
  const [formData, setFormData] = useState({ chapterNumber: "", title: "", description: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const openAddModal = () => {
    setEditingChapter(null);
    const nextNum = subjectChapters.length + 1;
    setFormData({ chapterNumber: String(nextNum), title: "", description: "" });
    setIsModalOpen(true);
  };

  const openEditModal = (chap, e) => {
    e.stopPropagation();
    setEditingChapter(chap);
    setFormData({
      chapterNumber: String(chap.chapterNumber || ""),
      title: chap.title || "",
      description: chap.description || "",
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (chapterId, title, e) => {
    e.stopPropagation();
    if (window.confirm(`Are you sure you want to delete "${title}"? This will remove all quizzes under this chapter.`)) {
      await deleteChapter(chapterId);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim()) return;

    setIsSubmitting(true);
    try {
      if (editingChapter) {
        await updateChapter(editingChapter.id, {
          chapterNumber: Number(formData.chapterNumber) || 1,
          title: formData.title.trim(),
          description: formData.description.trim(),
        });
      } else {
        await addChapter({
          subjectId: String(subjectId),
          classId: String(classId),
          chapterNumber: Number(formData.chapterNumber) || 1,
          title: formData.title.trim(),
          description: formData.description.trim(),
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
        <h2 className="text-xl font-bold text-foreground">Content Not Found</h2>
        <p className="text-sm text-muted-foreground">The requested subject or class does not exist.</p>
        <Button onClick={() => navigate(`/classes/${classId}/subjects`)} variant="outline" className="gap-2">
          <ChevronLeft className="w-4 h-4" /> Back to Subjects
        </Button>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-5xl mx-auto space-y-6 animate-in fade-in duration-300">
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-1.5 text-xs text-muted-foreground flex-wrap">
        <button
          onClick={() => navigate("/classes")}
          className="hover:text-foreground transition-colors font-medium"
        >
          Classes
        </button>
        <ChevronRight className="h-3.5 w-3.5" />
        <button
          onClick={() => navigate(`/classes/${classId}/subjects`)}
          className="hover:text-foreground transition-colors font-medium"
        >
          {currentClass.name}
        </button>
        <ChevronRight className="h-3.5 w-3.5" />
        <span className="text-foreground font-semibold">{currentSubject.name}</span>
        <ChevronRight className="h-3.5 w-3.5" />
        <span className="text-foreground font-semibold">Chapters</span>
      </nav>

      {/* Subject Header Card */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-2xl bg-card border border-border">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs px-2.5 py-0.5 rounded-full font-bold bg-primary/10 text-primary border border-primary/20">
              {currentSubject.code || "SUBJECT"}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground mt-1">
            {currentSubject.name} — Chapters
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            {isAdmin
              ? `Manage syllabus chapters and quizzes for ${currentSubject.name}.`
              : `Select a chapter to take quizzes and test your knowledge.`}
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate(`/classes/${classId}/subjects`)}
            className="gap-1 text-xs"
          >
            <ChevronLeft className="w-4 h-4" /> Back
          </Button>
          {isAdmin && (
            <Button size="sm" onClick={openAddModal} className="gap-1.5 text-xs">
              <Plus className="w-4 h-4" /> Add Chapter
            </Button>
          )}
        </div>
      </div>

      {/* Chapters List */}
      {subjectChapters.length === 0 ? (
        <div className="text-center py-16 px-4 bg-card border border-dashed border-border rounded-2xl space-y-4">
          <FileText className="w-12 h-12 text-muted-foreground mx-auto" />
          <div className="max-w-sm mx-auto space-y-1">
            <h3 className="text-lg font-bold text-foreground">No chapters available</h3>
            <p className="text-sm text-muted-foreground">
              {isAdmin
                ? "Click 'Add Chapter' to create your first chapter for this subject."
                : "No chapters have been added yet for this subject."}
            </p>
          </div>
          {isAdmin && (
            <Button onClick={openAddModal} className="gap-2">
              <Plus className="w-4 h-4" /> Add Chapter
            </Button>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground px-1">
            {subjectChapters.length} Chapter{subjectChapters.length !== 1 ? "s" : ""} Available
          </div>

          {subjectChapters.map((chapter) => {
            const chapterQuizCount = quizzes.filter((q) => String(q.chapterId) === String(chapter.id)).length;

            return (
              <div
                key={chapter.id}
                onClick={() =>
                  navigate(
                    `/classes/${classId}/subjects/${subjectId}/chapters/${chapter.id}/quiz`
                  )
                }
                className="group bg-card text-card-foreground border border-border rounded-2xl p-5 hover:border-primary/50 hover:shadow-md transition-all duration-200 cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="flex items-start sm:items-center gap-4 min-w-0">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary font-black text-sm flex items-center justify-center shrink-0 border border-primary/20">
                    {chapter.chapterNumber}
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-bold text-base text-foreground group-hover:text-primary transition-colors truncate">
                      {chapter.title}
                    </h3>
                    <p className="text-xs text-muted-foreground line-clamp-1 mt-0.5">
                      {chapter.description || `Chapter ${chapter.chapterNumber} learning topics and quiz tests.`}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-border">
                  <span className="text-xs text-muted-foreground font-medium flex items-center gap-1">
                    <HelpCircle className="w-3.5 h-3.5 text-primary" />
                    {chapterQuizCount} Quiz{chapterQuizCount !== 1 ? "zes" : ""}
                  </span>

                  {isAdmin ? (
                    <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-muted-foreground hover:text-foreground"
                        onClick={(e) => openEditModal(chapter, e)}
                        title="Edit Chapter"
                      >
                        <Pencil className="w-3.5 h-3.5" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                        onClick={(e) => handleDelete(chapter.id, chapter.title, e)}
                        title="Delete Chapter"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                      <Button
                        size="sm"
                        className="gap-1.5 text-xs h-8 ml-1"
                        onClick={() =>
                          navigate(
                            `/classes/${classId}/subjects/${subjectId}/chapters/${chapter.id}/quiz`
                          )
                        }
                      >
                        Manage Quizzes
                      </Button>
                    </div>
                  ) : (
                    <Button
                      size="sm"
                      className="gap-1.5 text-xs h-8"
                      onClick={() =>
                        navigate(
                          `/classes/${classId}/subjects/${subjectId}/chapters/${chapter.id}/quiz`
                        )
                      }
                    >
                      <PlayCircle className="w-3.5 h-3.5" /> Start Quiz
                    </Button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add / Edit Chapter Modal (Admin Only) */}
      {isAdmin && (
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>{editingChapter ? "Edit Chapter" : "Add New Chapter"}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4 py-2">
              <div className="space-y-1.5">
                <Label htmlFor="chapterNum">Chapter Number *</Label>
                <Input
                  id="chapterNum"
                  type="number"
                  placeholder="e.g. 1"
                  value={formData.chapterNumber}
                  onChange={(e) => setFormData((prev) => ({ ...prev, chapterNumber: e.target.value }))}
                  required
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="chapterTitle">Chapter Title *</Label>
                <Input
                  id="chapterTitle"
                  placeholder="e.g. Physical Quantities and Measurement"
                  value={formData.title}
                  onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
                  required
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="chapterDesc">Description</Label>
                <Input
                  id="chapterDesc"
                  placeholder="e.g. Fundamental Units, Scalars and Vectors"
                  value={formData.description}
                  onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                />
              </div>

              <DialogFooter className="pt-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsModalOpen(false)}
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Saving..." : editingChapter ? "Save Changes" : "Create Chapter"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
