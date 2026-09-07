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
  const { classes, subjects, students, addClass, updateClass, deleteClass, loadingLms } = useLms();
  const { isAdmin, userProfile } = useAuth();

  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingClass, setEditingClass] = useState(null);
  const [formData, setFormData] = useState({ name: "", grade: "", description: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Student: find their assigned class
  const studentClass = useMemo(() => {
    if (isAdmin) return null;
    if (!userProfile?.classId) return null;
    return classes.find((c) => c.id === userProfile.classId) || null;
  }, [isAdmin, classes, userProfile]);

  const filteredClasses = useMemo(() => {
    // Admin sees all (with search filter)
    if (isAdmin) {
      return classes.filter(
        (c) =>
          c.name.toLowerCase().includes(search.toLowerCase()) ||
          String(c.grade || "").includes(search) ||
          (c.description || "").toLowerCase().includes(search.toLowerCase())
      );
    }
    // Students only see their own class
    return studentClass ? [studentClass] : [];
  }, [isAdmin, classes, search, studentClass]);

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
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6 animate-in fade-in duration-300">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs px-2.5 py-0.5 rounded-full font-bold bg-primary/10 text-primary border border-primary/20">
              {isAdmin ? "Admin Curriculum Setup" : "Student Academic Portal"}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-foreground mt-1">
            Academic Classes
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
            {isAdmin
              ? "Structure and configure standard school classes (Grade 8 through 12) with syllabus subjects."
              : "Select your enrolled class to access syllabus subjects, study notes, and chapter assessments."}
          </p>
        </div>

        {isAdmin && (
          <Button onClick={openAddModal} className="gap-2 shrink-0 shadow-sm rounded-xl font-bold text-xs h-9">
            <Plus className="w-4 h-4" />
            Add New Class
          </Button>
        )}
      </div>

      {/* Student — no class assigned yet */}
      {!isAdmin && !loadingLms && !userProfile?.classId && (
        <div className="text-center py-16 bg-card border border-dashed border-border rounded-2xl p-8 space-y-4">
          <Lock className="w-12 h-12 text-muted-foreground/60 mx-auto" />
          <div>
            <h3 className="text-base font-bold text-foreground">No Class Assigned</h3>
            <p className="text-xs text-muted-foreground mt-1">
              Your account has not been assigned to a class yet. Please wait for an admin to approve
              your account and assign your class access.
            </p>
          </div>
        </div>
      )}

      {/* Filter / Search Toolbar */}
      <div className="flex items-center justify-between gap-4 p-3.5 rounded-2xl bg-card border border-border/80 shadow-sm">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Filter classes by grade or title..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 h-9 text-xs rounded-xl"
          />
        </div>

        <div className="text-xs text-muted-foreground font-medium">
          Showing {filteredClasses.length} of {classes.length} Classes
        </div>
      </div>

      {/* Loading Skeletons */}
      {loadingLms ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-48 rounded-2xl bg-card border border-border animate-pulse p-6 space-y-4">
              <div className="w-20 h-5 bg-muted rounded-full" />
              <div className="w-36 h-6 bg-muted rounded-lg" />
              <div className="w-full h-10 bg-muted rounded-lg" />
            </div>
          ))}
        </div>
      ) : filteredClasses.length === 0 ? (
        <div className="text-center py-16 bg-card border border-dashed border-border rounded-2xl p-8 space-y-4">
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

            return (
              <div
                key={cls.id}
                onClick={() => navigate(`/classes/${cls.id}/subjects`)}
                className="group relative bg-card text-card-foreground border border-border/80 rounded-2xl p-6 hover:border-primary/50 hover:shadow-lg transition-all duration-200 cursor-pointer flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-primary/10 text-primary border border-primary/20">
                      Grade {cls.grade || cls.name}
                    </span>

                    {isAdmin && (
                      <div className="flex items-center gap-1 opacity-90 group-hover:opacity-100 transition">
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

                  <h2 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors">
                    {cls.name}
                  </h2>
                  <p className="text-xs text-muted-foreground mt-1.5 line-clamp-2 leading-relaxed">
                    {cls.description || "Foundational academic curriculum, core textbook guides, and chapter tests."}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-border/60 flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-medium">
                    <BookOpen className="w-4 h-4 text-primary" />
                    <span>
                      {classSubjectCount} Subject{classSubjectCount !== 1 ? "s" : ""}
                    </span>
                  </div>

                  <span className="inline-flex items-center gap-1 text-xs font-semibold text-primary group-hover:translate-x-0.5 transition-transform">
                    Explore Syllabus <ArrowRight className="w-3.5 h-3.5" />
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
