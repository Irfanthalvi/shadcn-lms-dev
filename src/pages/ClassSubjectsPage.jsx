import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useLms } from "@/context/LmsContext";
import { useAuth } from "@/context/AuthContext";
import {
  ChevronLeft,
  ChevronRight,
  BookOpen,
  Plus,
  Pencil,
  Trash2,
  Layers,
  Sparkles,
  ArrowRight,
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

export default function ClassSubjectsPage() {
  const { classId } = useParams();
  const navigate = useNavigate();
  const { classes, subjects, chapters, addSubject, updateSubject, deleteSubject } = useLms();
  const { isAdmin } = useAuth();

  const currentClass = classes.find((c) => String(c.id) === String(classId));
  const classSubjects = subjects.filter((s) => String(s.classId) === String(classId));

  // Modal State for Add/Edit Subject
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSubject, setEditingSubject] = useState(null);
  const [formData, setFormData] = useState({ name: "", code: "", description: "", color: "blue" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const openAddModal = () => {
    setEditingSubject(null);
    setFormData({ name: "", code: "", description: "", color: "blue" });
    setIsModalOpen(true);
  };

  const openEditModal = (subject, e) => {
    e.stopPropagation();
    setEditingSubject(subject);
    setFormData({
      name: subject.name || "",
      code: subject.code || "",
      description: subject.description || "",
      color: subject.color || "blue",
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (subjectId, subjectName, e) => {
    e.stopPropagation();
    if (window.confirm(`Are you sure you want to delete "${subjectName}"? This will remove all chapters and quizzes under this subject.`)) {
      await deleteSubject(subjectId);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    setIsSubmitting(true);
    try {
      if (editingSubject) {
        await updateSubject(editingSubject.id, {
          name: formData.name.trim(),
          code: formData.code.trim().toUpperCase(),
          description: formData.description.trim(),
          color: formData.color,
        });
      } else {
        await addSubject({
          classId: String(classId),
          name: formData.name.trim(),
          code: formData.code.trim().toUpperCase(),
          description: formData.description.trim(),
          color: formData.color,
        });
      }
      setIsModalOpen(false);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!currentClass) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4 p-4 text-center">
        <h2 className="text-xl font-bold text-foreground">Class Not Found</h2>
        <p className="text-sm text-muted-foreground">The requested class does not exist or has been removed.</p>
        <Button onClick={() => navigate("/classes")} variant="outline" className="gap-2">
          <ChevronLeft className="w-4 h-4" /> Back to Classes
        </Button>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6 animate-in fade-in duration-300">
      {/* Breadcrumb Navigation */}
      <nav className="flex items-center gap-1.5 text-xs text-muted-foreground">
        <button
          onClick={() => navigate("/classes")}
          className="hover:text-foreground transition-colors font-medium flex items-center gap-1"
        >
          Classes
        </button>
        <ChevronRight className="h-3.5 w-3.5" />
        <span className="text-foreground font-semibold">{currentClass.name}</span>
        <ChevronRight className="h-3.5 w-3.5" />
        <span className="text-foreground font-semibold">Subjects</span>
      </nav>

      {/* Class Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-2xl bg-card border border-border">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs px-2.5 py-0.5 rounded-full font-bold bg-primary/10 text-primary border border-primary/20">
              Grade {currentClass.grade || currentClass.name}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground mt-1">
            {currentClass.name} — Subjects
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            {isAdmin
              ? `Manage subjects for ${currentClass.name}. Add chapters and quizzes inside each subject.`
              : `Select a subject to view chapters and quizzes for ${currentClass.name}.`}
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <Button variant="outline" size="sm" onClick={() => navigate("/classes")} className="gap-1 text-xs">
            <ChevronLeft className="w-4 h-4" /> Back
          </Button>
          {isAdmin && (
            <Button size="sm" onClick={openAddModal} className="gap-1.5 text-xs">
              <Plus className="w-4 h-4" /> Add Subject
            </Button>
          )}
        </div>
      </div>

      {/* Subjects Grid */}
      {classSubjects.length === 0 ? (
        <div className="text-center py-16 px-4 bg-card border border-dashed border-border rounded-2xl space-y-4">
          <BookOpen className="w-12 h-12 text-muted-foreground mx-auto" />
          <div className="max-w-sm mx-auto space-y-1">
            <h3 className="text-lg font-bold text-foreground">No subjects added yet</h3>
            <p className="text-sm text-muted-foreground">
              {isAdmin
                ? "Click 'Add Subject' to create the first curriculum subject for this class."
                : "No subjects are currently published for this class."}
            </p>
          </div>
          {isAdmin && (
            <Button onClick={openAddModal} className="gap-2">
              <Plus className="w-4 h-4" /> Add Subject
            </Button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {classSubjects.map((subject) => {
            const subjectChapterCount = chapters.filter((c) => String(c.subjectId) === String(subject.id)).length;

            return (
              <div
                key={subject.id}
                onClick={() => navigate(`/classes/${classId}/subjects/${subject.id}/chapters`)}
                className="group relative bg-card text-card-foreground border border-border rounded-2xl p-6 hover:border-primary/50 hover:shadow-lg transition-all duration-200 cursor-pointer flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-md bg-primary/10 text-primary border border-primary/20">
                      {subject.code || "SUB"}
                    </span>

                    {isAdmin && (
                      <div className="flex items-center gap-1 opacity-90 group-hover:opacity-100 transition">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-muted-foreground hover:text-foreground"
                          onClick={(e) => openEditModal(subject, e)}
                          title="Edit Subject"
                        >
                          <Pencil className="w-3.5 h-3.5" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                          onClick={(e) => handleDelete(subject.id, subject.name, e)}
                          title="Delete Subject"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </Button>
                      </div>
                    )}
                  </div>

                  <h2 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors">
                    {subject.name}
                  </h2>
                  <p className="text-xs text-muted-foreground mt-1 line-clamp-2 leading-relaxed">
                    {subject.description || "Core subject syllabus and chapter assessments."}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-border flex items-center justify-between text-xs">
                  <span className="text-muted-foreground font-medium flex items-center gap-1">
                    <Layers className="w-4 h-4 text-primary" />
                    {subjectChapterCount} Chapter{subjectChapterCount !== 1 ? "s" : ""}
                  </span>

                  <span className="font-semibold text-primary inline-flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                    View Chapters <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add / Edit Subject Modal (Admin Only) */}
      {isAdmin && (
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>{editingSubject ? "Edit Subject" : "Add New Subject"}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4 py-2">
              <div className="space-y-1.5">
                <Label htmlFor="subjectName">Subject Name *</Label>
                <Input
                  id="subjectName"
                  placeholder="e.g. Physics or Chemistry"
                  value={formData.name}
                  onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                  required
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="subjectCode">Subject Code (e.g. PHY, MATH)</Label>
                <Input
                  id="subjectCode"
                  placeholder="e.g. PHY"
                  value={formData.code}
                  onChange={(e) => setFormData((prev) => ({ ...prev, code: e.target.value }))}
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="subjectDesc">Description</Label>
                <Input
                  id="subjectDesc"
                  placeholder="e.g. Mechanics, Waves, and Modern Physics"
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
                  {isSubmitting ? "Saving..." : editingSubject ? "Save Changes" : "Create Subject"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
