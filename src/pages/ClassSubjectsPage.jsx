import React, { useState, useMemo, useEffect } from "react";
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
  Search,
  Sparkles,
  ArrowRight,
  HelpCircle,
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

import { sindhBoardSubjects } from "@/data/sindhBoardCurriculum";
import toast from "react-hot-toast";

export default function ClassSubjectsPage() {
  const { classId } = useParams();
  const navigate = useNavigate();
  const { classes, subjects, chapters, quizzes, studentAttempts, addSubject, updateSubject, deleteSubject } = useLms();
  const { user, isAdmin, userProfile } = useAuth();

  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSubject, setEditingSubject] = useState(null);
  const [formData, setFormData] = useState({ name: "", code: "", description: "", classId: classId || "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Strict Class Protection for Students
  useEffect(() => {
    if (!isAdmin && userProfile?.classId && classId && String(classId) !== String(userProfile.classId)) {
      toast.error("Access restricted: You can only view your enrolled class.");
      navigate(`/classes/${userProfile.classId}/subjects`, { replace: true });
    }
  }, [isAdmin, userProfile, classId, navigate]);

  // If classId is in route, use that class; for students always default to their enrolled class
  const effectiveClassId = !isAdmin && userProfile?.classId ? userProfile.classId : classId;
  const currentClass = classes.find((c) => String(c.id) === String(effectiveClassId));
  const activeClassId = effectiveClassId || (classes[0] ? classes[0].id : "");

  const classSubjects = useMemo(() => {
    let list = subjects;
    if (effectiveClassId) {
      list = list.filter((s) => String(s.classId) === String(effectiveClassId));
    }

    // If no subjects found yet for this class, fallback to Sindh Board curriculum subjects
    if (list.length === 0 && effectiveClassId) {
      list = sindhBoardSubjects.filter(
        (s) => s.classId === effectiveClassId || s.classId.includes(effectiveClassId)
      );
    }

    if (search.trim()) {
      list = list.filter(
        (s) =>
          s.name.toLowerCase().includes(search.toLowerCase()) ||
          (s.code || "").toLowerCase().includes(search.toLowerCase()) ||
          (s.description || "").toLowerCase().includes(search.toLowerCase())
      );
    }
    return list;
  }, [subjects, effectiveClassId, search]);

  const openAddModal = () => {
    setEditingSubject(null);
    setFormData({
      name: "",
      code: "",
      description: "",
      classId: activeClassId,
    });
    setIsModalOpen(true);
  };

  const openEditModal = (subject, e) => {
    e.stopPropagation();
    setEditingSubject(subject);
    setFormData({
      name: subject.name || "",
      code: subject.code || "",
      description: subject.description || "",
      classId: subject.classId || activeClassId,
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (subjectId, subjectName, e) => {
    e.stopPropagation();
    if (
      window.confirm(
        `Are you sure you want to delete "${subjectName}"? This will remove all chapters and quizzes under this subject.`
      )
    ) {
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
        });
      } else {
        await addSubject({
          classId: String(formData.classId || activeClassId),
          name: formData.name.trim(),
          code: formData.code.trim().toUpperCase(),
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
      {/* Breadcrumb Navigation */}
      <nav className="flex items-center gap-1.5 text-xs text-muted-foreground flex-wrap">
        <button
          onClick={() => navigate("/classes")}
          className="hover:text-foreground transition-colors font-medium flex items-center gap-1"
        >
          Classes
        </button>
        <ChevronRight className="h-3.5 w-3.5" />
        {currentClass ? (
          <>
            <span className="text-muted-foreground font-medium">{currentClass.name}</span>
            <ChevronRight className="h-3.5 w-3.5" />
            <span className="text-foreground font-bold">Subjects</span>
          </>
        ) : (
          <span className="text-foreground font-bold">All Curriculum Subjects</span>
        )}
      </nav>

      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-2xl bg-card border border-border/80 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs px-2.5 py-0.5 rounded-full font-bold bg-primary/10 text-primary border border-primary/20">
              {currentClass ? `Grade ${currentClass.grade || currentClass.name}` : "Curriculum Catalog"}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-foreground mt-1">
            {currentClass ? `${currentClass.name} — Subjects` : "All Subjects Directory"}
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
            {isAdmin
              ? "Manage academic course subjects, chapter sequences, and self-assessment test banks."
              : "Select a subject to view syllabus chapters, formula guides, and chapter quizzes."}
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate("/classes")}
            className="gap-1 text-xs h-9 rounded-xl"
          >
            <ChevronLeft className="w-4 h-4" /> Classes
          </Button>
          {isAdmin && (
            <Button size="sm" onClick={openAddModal} className="gap-1.5 text-xs font-bold h-9 rounded-xl">
              <Plus className="w-4 h-4" /> Add Subject
            </Button>
          )}
        </div>
      </div>

      {/* Search / Filter Bar */}
      <div className="flex items-center justify-between gap-4 p-3.5 rounded-2xl bg-card border border-border/80 shadow-sm">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search subjects by name or code..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 h-9 text-xs rounded-xl"
          />
        </div>

        <div className="text-xs text-muted-foreground font-medium">
          {classSubjects.length} Subject{classSubjects.length !== 1 ? "s" : ""}
        </div>
      </div>

      {/* Subjects Grid */}
      {classSubjects.length === 0 ? (
        <div className="text-center py-16 px-4 bg-card border border-dashed border-border rounded-2xl space-y-4">
          <BookOpen className="w-12 h-12 text-muted-foreground/60 mx-auto" />
          <div className="max-w-sm mx-auto space-y-1">
            <h3 className="text-base font-bold text-foreground">No subjects found</h3>
            <p className="text-xs text-muted-foreground">
              {isAdmin
                ? "Click 'Add Subject' to configure the first subject."
                : "No subjects are currently listed for this view."}
            </p>
          </div>
          {isAdmin && (
            <Button onClick={openAddModal} className="gap-2 text-xs rounded-xl">
              <Plus className="w-4 h-4" /> Add Subject
            </Button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {classSubjects.map((subject) => {
            const subjectChapters = chapters.filter((c) => String(c.subjectId) === String(subject.id));
            const subjectQuizzes = quizzes.filter((q) => String(q.subjectId) === String(subject.id));
            const parentClass = classes.find((c) => String(c.id) === String(subject.classId));

            return (
              <div
                key={subject.id}
                onClick={() =>
                  navigate(
                    `/classes/${subject.classId || classId}/subjects/${subject.id}/books`
                  )
                }
                className="group relative bg-card text-card-foreground border border-border/80 rounded-2xl p-6 hover:border-primary/50 hover:shadow-lg transition-all duration-200 cursor-pointer flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-lg bg-primary/10 text-primary border border-primary/20">
                        {subject.code || "SUB"}
                      </span>
                      {parentClass && !classId && (
                        <span className="text-[10px] font-bold text-muted-foreground">
                          {parentClass.name}
                        </span>
                      )}
                    </div>

                    {isAdmin && (
                      <div className="flex items-center gap-1 opacity-90 group-hover:opacity-100 transition">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-muted-foreground hover:text-foreground rounded-lg"
                          onClick={(e) => openEditModal(subject, e)}
                          title="Edit Subject"
                        >
                          <Pencil className="w-3.5 h-3.5" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg"
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
                    {subject.description || "Core curriculum syllabus, chapter test banks, and exercises."}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-border/60 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-3 text-muted-foreground font-medium">
                    <span className="flex items-center gap-1">
                      <Layers className="w-3.5 h-3.5 text-primary" />
                      {subjectChapters.length} Chapter{subjectChapters.length !== 1 ? "s" : ""}
                    </span>
                    <span className="flex items-center gap-1">
                      <HelpCircle className="w-3.5 h-3.5 text-primary" />
                      {subjectQuizzes.length} Quiz{subjectQuizzes.length !== 1 ? "zes" : ""}
                    </span>
                  </div>

                  <span className="font-semibold text-primary inline-flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                    Chapters <ArrowRight className="w-3.5 h-3.5" />
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
          <DialogContent className="sm:max-w-md rounded-2xl">
            <DialogHeader>
              <DialogTitle>{editingSubject ? "Edit Subject" : "Add New Subject"}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4 py-2">
              <div className="space-y-1.5">
                <Label htmlFor="subClass">Target Class *</Label>
                <select
                  id="subClass"
                  value={formData.classId}
                  onChange={(e) => setFormData((prev) => ({ ...prev, classId: e.target.value }))}
                  className="w-full h-9 rounded-md border border-input bg-background px-3 text-xs"
                  required
                >
                  {classes.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

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
                  placeholder="e.g. Mechanics, Waves, and Atomic Structure"
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
