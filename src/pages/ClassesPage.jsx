import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useLms } from "@/context/LmsContext";
import { useAuth } from "@/context/AuthContext";
import {
  GraduationCap,
  BookOpen,
  ArrowRight,
  Plus,
  Pencil,
  Trash2,
  Layers,
  Sparkles,
  Loader2,
  Search,
  Users,
  CheckCircle2,
  Lock,
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

export default function ClassesPage() {
  const navigate = useNavigate();
  const { classes, subjects, chapters, students, addClass, updateClass, deleteClass, loadingLms } = useLms();
  const { isAdmin, userProfile } = useAuth();

  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingClass, setEditingClass] = useState(null);
  const [formData, setFormData] = useState({ name: "", grade: "", description: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Student: find their assigned class
  const studentClass = useMemo(() => {
    if (!userProfile?.classId) return null;
    return classes.find((c) => String(c.id) === String(userProfile.classId)) || null;
  }, [classes, userProfile]);

  // All users can browse all academic classes (sorted by grade)
  const filteredClasses = useMemo(() => {
    return classes
      .filter((c) => {
        if (!search.trim()) return true;
        const q = search.toLowerCase();
        return (
          (c.name || "").toLowerCase().includes(q) ||
          String(c.grade || "").includes(q) ||
          (c.description || "").toLowerCase().includes(q)
        );
      })
      .sort((a, b) => Number(a.grade || 0) - Number(b.grade || 0));
  }, [classes, search]);

  const openAddModal = () => {
    setEditingClass(null);
    setFormData({ name: "", grade: "", description: "" });
    setIsModalOpen(true);
  };

  const openEditModal = (cls, e) => {
    e.stopPropagation();
    setEditingClass(cls);
    setFormData({
      name: cls.name || "",
      grade: cls.grade?.toString() || "",
      description: cls.description || "",
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (classId, className, e) => {
    e.stopPropagation();
    if (window.confirm(`Are you sure you want to delete ${className}? This will remove all its subjects and quizzes.`)) {
      await deleteClass(classId);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    setIsSubmitting(true);
    try {
      if (editingClass) {
        await updateClass(editingClass.id, {
          name: formData.name.trim(),
          grade: Number(formData.grade) || 0,
          description: formData.description.trim(),
        });
      } else {
        await addClass({
          name: formData.name.trim(),
          grade: Number(formData.grade) || 0,
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

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-300">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/80 pb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs px-3 py-1 rounded-full font-bold bg-primary/10 text-primary border border-primary/20 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              {isAdmin ? "Admin Curriculum Setup" : "Sindh Board Academic Classes"}
            </span>
            {!isAdmin && studentClass && (
              <span className="text-xs px-2.5 py-0.5 rounded-full font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                Enrolled: {studentClass.name}
              </span>
            )}
          </div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-foreground mt-2">
            Academic Classes
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1 max-w-2xl leading-relaxed">
            {isAdmin
              ? "Structure and configure standard school classes (Grade 8 through 12) with syllabus subjects and textbooks."
              : "Select any class to explore its official Sindh Textbook Board syllabus, textbook chapters, and test assessments."}
          </p>
        </div>

        {isAdmin && (
          <Button onClick={openAddModal} className="gap-2 shrink-0 shadow-sm rounded-xl font-bold text-xs h-10 px-4">
            <Plus className="w-4 h-4" />
            Add New Class
          </Button>
        )}
      </div>

      {/* Filter / Search Toolbar */}
      <div className="flex items-center justify-between gap-4 p-4 rounded-2xl bg-card border border-border/80 shadow-sm">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Filter classes by grade or title..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 h-10 text-xs rounded-xl"
          />
        </div>

        <div className="text-xs text-muted-foreground font-semibold">
          Showing {filteredClasses.length} of {classes.length} Classes
        </div>
      </div>

      {/* Loading Skeletons */}
      {loadingLms ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-52 rounded-3xl bg-card border border-border animate-pulse p-6 space-y-4">
              <div className="w-20 h-5 bg-muted rounded-full" />
              <div className="w-36 h-6 bg-muted rounded-lg" />
              <div className="w-full h-10 bg-muted rounded-lg" />
            </div>
          ))}
        </div>
      ) : filteredClasses.length === 0 ? (
        <div className="text-center py-16 bg-card border border-dashed border-border rounded-3xl p-8 space-y-4">
          <GraduationCap className="w-12 h-12 text-muted-foreground/60 mx-auto" />
          <div>
            <h3 className="text-base font-bold text-foreground">No classes found</h3>
            <p className="text-xs text-muted-foreground">
              {search ? "No classes match your search query." : "No classes have been added to the syllabus yet."}
            </p>
          </div>
          {isAdmin && (
            <Button onClick={openAddModal} className="gap-2 text-xs rounded-xl">
              <Plus className="w-4 h-4" /> Add First Class
            </Button>
          )}
        </div>
      ) : (
        /* Classes Grid */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredClasses.map((cls) => {
            const classSubjectCount = subjects.filter((s) => String(s.classId) === String(cls.id)).length;
            const classChapterCount = (chapters || []).filter((ch) => String(ch.classId) === String(cls.id)).length;
            const isEnrolled = !isAdmin && userProfile?.classId && String(userProfile.classId) === String(cls.id);

            return (
              <div
                key={cls.id}
                onClick={() => navigate(`/classes/${cls.id}/subjects`)}
                className={`group relative bg-card text-card-foreground border rounded-3xl p-6 sm:p-7 transition-all duration-300 cursor-pointer flex flex-col justify-between hover:shadow-xl hover:-translate-y-1 ${
                  isEnrolled ? "border-primary/50 shadow-md shadow-primary/5" : "border-border/80 hover:border-primary/40"
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-primary/10 text-primary border border-primary/20">
                        Grade {cls.grade || cls.name}
                      </span>
                      {isEnrolled && (
                        <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" /> Enrolled
                        </span>
                      )}
                    </div>

                    {isAdmin && (
                      <div className="flex items-center gap-1 opacity-90 group-hover:opacity-100 transition" onClick={(e) => e.stopPropagation()}>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-muted-foreground hover:text-foreground rounded-lg"
                          onClick={(e) => openEditModal(cls, e)}
                          title="Edit Class"
                        >
                          <Pencil className="w-3.5 h-3.5" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg"
                          onClick={(e) => handleDelete(cls.id, cls.name, e)}
                          title="Delete Class"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </Button>
                      </div>
                    )}
                  </div>

                  <h2 className="text-2xl font-black text-foreground group-hover:text-primary transition-colors">
                    {cls.name}
                  </h2>
                  <p className="text-xs text-muted-foreground mt-2 line-clamp-2 leading-relaxed">
                    {cls.description || "Foundational Sindh Textbook Board curriculum, core subjects, and assessments."}
                  </p>
                </div>

                <div className="mt-7 pt-5 border-t border-border/60 flex items-center justify-between">
                  <div className="flex items-center gap-3 text-xs text-muted-foreground font-semibold">
                    <span className="flex items-center gap-1">
                      <BookOpen className="w-3.5 h-3.5 text-primary" />
                      {classSubjectCount} Subject{classSubjectCount !== 1 ? "s" : ""}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Layers className="w-3.5 h-3.5 text-primary" />
                      {classChapterCount} Chapters
                    </span>
                  </div>

                  <span className="inline-flex items-center gap-1 text-xs font-bold text-primary group-hover:translate-x-1 transition-transform">
                    View Subjects <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add / Edit Class Modal (Admin Only) */}
      {isAdmin && (
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogContent className="sm:max-w-md rounded-2xl">
            <DialogHeader>
              <DialogTitle>{editingClass ? "Edit Class" : "Add New Class"}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4 py-2">
              <div className="space-y-1.5">
                <Label htmlFor="className">Class Name *</Label>
                <Input
                  id="className"
                  placeholder="e.g. Class 9 or Matric I"
                  value={formData.name}
                  onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                  required
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="classGrade">Grade Number (for sorting) *</Label>
                <Input
                  id="classGrade"
                  type="number"
                  placeholder="e.g. 9"
                  value={formData.grade}
                  onChange={(e) => setFormData((prev) => ({ ...prev, grade: e.target.value }))}
                  required
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="classDesc">Description (Optional)</Label>
                <Input
                  id="classDesc"
                  placeholder="e.g. Secondary School Science Curriculum"
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
                  {isSubmitting ? "Saving..." : editingClass ? "Save Changes" : "Create Class"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
