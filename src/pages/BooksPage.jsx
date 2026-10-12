import React, { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useLms } from "@/context/LmsContext";
import { useAuth } from "@/context/AuthContext";
import {
  BookMarked,
  BookOpen,
  Search,
  Plus,
  Pencil,
  Trash2,
  ChevronRight,
  GraduationCap,
  Layers,
  FileText,
  ExternalLink,
  Sparkles,
  Download,
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

export default function BooksPage() {
  const navigate = useNavigate();
  const { classes, subjects, books, chapters, addBook, updateBook, deleteBook, loadingLms } = useLms();
  const { userProfile, isAdmin } = useAuth();

  const [search, setSearch] = useState("");
  const [selectedClass, setSelectedClass] = useState("all");
  const [selectedSubject, setSelectedSubject] = useState("all");

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBook, setEditingBook] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    classId: "",
    subjectId: "",
    author: "Sindh Textbook Board",
    board: "Sindh Textbook Board, Jamshoro",
    edition: "Single National Curriculum Edition",
    description: "",
    totalChapters: 8,
    pdfUrl: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Student class resolution
  const studentClassId = !isAdmin ? userProfile?.classId : null;

  useEffect(() => {
    if (!isAdmin && studentClassId) {
      setSelectedClass(studentClassId);
    }
  }, [isAdmin, studentClassId]);

  const allBooksList = useMemo(() => {
    return [...books];
  }, [books]);

  // Filtered books
  const filteredBooks = useMemo(() => {
    return allBooksList.filter((book) => {
      // Students can ONLY view their assigned class
      if (!isAdmin) {
        if (studentClassId && String(book.classId) !== String(studentClassId)) {
          return false;
        }
      } else {
        if (selectedClass !== "all" && String(book.classId) !== String(selectedClass)) {
          return false;
        }
      }

      if (selectedSubject !== "all" && String(book.subjectId) !== String(selectedSubject)) {
        return false;
      }

      if (search.trim()) {
        const q = search.toLowerCase();
        return (
          book.title?.toLowerCase().includes(q) ||
          book.author?.toLowerCase().includes(q) ||
          book.description?.toLowerCase().includes(q)
        );
      }

      return true;
    });
  }, [allBooksList, isAdmin, studentClassId, selectedClass, selectedSubject, search]);

  const openAddModal = () => {
    setEditingBook(null);
    const initialClassId = selectedClass !== "all" ? selectedClass : classes[0]?.id || "";
    const initialSub = subjects.find((s) => String(s.classId) === String(initialClassId));
    setFormData({
      title: "",
      classId: initialClassId,
      subjectId: initialSub?.id || "",
      author: "Sindh Textbook Board",
      board: "Sindh Textbook Board, Jamshoro",
      edition: "Single National Curriculum Edition",
      description: "",
      totalChapters: 8,
      pdfUrl: "",
    });
    setIsModalOpen(true);
  };

  const openEditModal = (book, e) => {
    e.stopPropagation();
    setEditingBook(book);
    setFormData({
      title: book.title || "",
      classId: book.classId || "",
      subjectId: book.subjectId || "",
      author: book.author || "Sindh Textbook Board",
      board: book.board || "Sindh Textbook Board, Jamshoro",
      edition: book.edition || "Single National Curriculum Edition",
      description: book.description || "",
      totalChapters: book.totalChapters || 8,
      pdfUrl: book.pdfUrl || "",
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (bookId, title, e) => {
    e.stopPropagation();
    if (window.confirm(`Are you sure you want to delete textbook "${title}"?`)) {
      try {
        await deleteBook(bookId);
      } catch (err) {
        console.error("Delete book failed:", err);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      toast.error("Please provide a book title.");
      return;
    }
    if (!formData.classId) {
      toast.error("Please select a target class.");
      return;
    }

    setIsSubmitting(true);
    try {
      if (editingBook) {
        await updateBook(editingBook.id, {
          title: formData.title.trim(),
          classId: formData.classId,
          subjectId: formData.subjectId || "",
          author: formData.author.trim(),
          board: formData.board.trim(),
          edition: formData.edition.trim(),
          description: formData.description.trim(),
          totalChapters: Number(formData.totalChapters) || 8,
          pdfUrl: formData.pdfUrl.trim(),
        });
      } else {
        await addBook({
          title: formData.title.trim(),
          classId: formData.classId,
          subjectId: formData.subjectId || "",
          author: formData.author.trim(),
          board: formData.board.trim(),
          edition: formData.edition.trim(),
          description: formData.description.trim(),
          totalChapters: Number(formData.totalChapters) || 8,
          pdfUrl: formData.pdfUrl.trim(),
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
              Official Textbooks • Sindh Textbook Board Jamshoro
            </span>
            {!isAdmin && userProfile?.className && (
              <span className="text-xs px-2.5 py-0.5 rounded-full font-semibold bg-secondary text-secondary-foreground border border-border">
                {userProfile.className}
              </span>
            )}
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-foreground mt-1.5">
            {isAdmin ? "Sindh Board Textbook Bank" : "My Class Textbooks"}
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
            {isAdmin
              ? "Manage authorized Sindh Textbook Board course books across Classes 8 through 12."
              : "Read curriculum-approved textbooks and prepare for your board examinations."}
          </p>
        </div>

        {isAdmin && (
          <Button
            onClick={openAddModal}
            className="text-xs h-9 rounded-xl font-bold bg-primary text-primary-foreground shadow-sm shadow-primary/20 gap-1.5 shrink-0"
          >
            <Plus className="w-4 h-4" /> Add Textbook
          </Button>
        )}
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-3.5 rounded-2xl bg-card border border-border/80 shadow-sm">
        <div className="relative flex-1 w-full max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search books by title, author, or board..."
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

      {/* Books Grid */}
      {filteredBooks.length === 0 ? (
        <div className="text-center py-16 px-4 bg-card border border-dashed border-border rounded-2xl space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mx-auto">
            <BookMarked className="w-7 h-7" />
          </div>
          <div>
            <h3 className="text-base font-bold text-foreground">No textbooks found</h3>
            <p className="text-xs text-muted-foreground max-w-md mx-auto mt-1">
              {!isAdmin
                ? "No textbooks are currently available for your selected filters. Please verify with your instructor."
                : "No textbooks have been registered matching your criteria. Click 'Add Textbook' above to upload one."}
            </p>
          </div>
          {isAdmin && (
            <Button
              onClick={openAddModal}
              size="sm"
              className="rounded-xl font-bold text-xs gap-1.5"
            >
              <Plus className="w-4 h-4" /> Add Textbook
            </Button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredBooks.map((book) => {
            const matchClass = classes.find((c) => String(c.id) === String(book.classId));
            const matchSubject = subjects.find((s) => String(s.id) === String(book.subjectId));
            const bookChaptersCount = chapters.filter(
              (ch) => String(ch.bookId) === String(book.id) || String(ch.subjectId) === String(book.subjectId)
            ).length || book.totalChapters || 8;

            return (
              <div
                key={book.id}
                className="group p-5 rounded-2xl bg-card border border-border/80 hover:border-primary/50 hover:shadow-lg transition-all duration-200 flex flex-col justify-between relative overflow-hidden"
              >
                <div className="space-y-3.5">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20">
                      {matchClass?.name || book.classId || "Sindh Board"}
                    </span>
                    <span className="text-[10px] font-mono text-muted-foreground">
                      {book.edition || "Single National Curriculum"}
                    </span>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-12 h-14 rounded-xl bg-gradient-to-tr from-teal-600/20 to-cyan-500/20 text-primary border border-primary/20 flex items-center justify-center shrink-0 shadow-xs">
                      <BookOpen className="w-6 h-6" />
                    </div>
                    <div className="min-w-0">
                      <h3 className="font-black text-sm text-foreground group-hover:text-primary transition-colors line-clamp-1">
                        {book.title}
                      </h3>
                      <p className="text-xs text-muted-foreground truncate">
                        {book.author || "Sindh Textbook Board, Jamshoro"}
                      </p>
                      <div className="text-[11px] font-semibold text-primary mt-1">
                        {matchSubject?.name || "General Course"}
                      </div>
                    </div>
                  </div>

                  <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                    {book.description ||
                      "Official Sindh Textbook Board published edition covering syllabus learning outcomes and examination topics."}
                  </p>

                  <div className="flex items-center gap-3 pt-2 text-[11px] text-muted-foreground border-t border-border/60">
                    <span className="flex items-center gap-1 font-semibold text-foreground">
                      <Layers className="w-3.5 h-3.5 text-primary" /> {bookChaptersCount} Chapters
                    </span>
                    <span>•</span>
                    <span>{book.board || "STBB Jamshoro"}</span>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-border/60 flex items-center justify-between gap-2">
                  <Button
                    size="sm"
                    onClick={() =>
                      navigate(
                        `/classes/${book.classId}/subjects/${book.subjectId}/books/${book.id}/chapters`
                      )
                    }
                    className="text-xs font-bold rounded-xl h-8 gap-1.5 flex-1 shadow-xs"
                  >
                    <BookOpen className="w-3.5 h-3.5" /> View Chapters <ChevronRight className="w-3.5 h-3.5" />
                  </Button>

                  {isAdmin && (
                    <div className="flex items-center gap-1">
                      <button
                        onClick={(e) => openEditModal(book, e)}
                        className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted"
                        title="Edit Book"
                      >
                        <Pencil className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={(e) => handleDelete(book.id, book.title, e)}
                        className="p-1.5 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                        title="Delete Book"
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

      {/* Admin Add/Edit Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-md rounded-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <BookMarked className="w-5 h-5 text-primary" />
              {editingBook ? "Edit Sindh Board Textbook" : "Add Sindh Board Textbook"}
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-3.5 py-2 text-xs">
            <div className="space-y-1">
              <Label className="text-xs font-bold">Book Title</Label>
              <Input
                placeholder="e.g. Physics for Class IX"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="h-9 text-xs rounded-xl"
                required
              />
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
                >
                  <option value="">Select Subject...</option>
                  {subjects.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name} ({s.code || s.classId})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label className="text-xs font-bold">Author / Publisher</Label>
                <Input
                  value={formData.author}
                  onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                  className="h-9 text-xs rounded-xl"
                />
              </div>

              <div className="space-y-1">
                <Label className="text-xs font-bold">Total Chapters</Label>
                <Input
                  type="number"
                  min={1}
                  value={formData.totalChapters}
                  onChange={(e) => setFormData({ ...formData, totalChapters: e.target.value })}
                  className="h-9 text-xs rounded-xl"
                />
              </div>
            </div>

            <div className="space-y-1">
              <Label className="text-xs font-bold">Board / Edition</Label>
              <Input
                value={formData.edition}
                onChange={(e) => setFormData({ ...formData, edition: e.target.value })}
                className="h-9 text-xs rounded-xl"
              />
            </div>

            <div className="space-y-1">
              <Label className="text-xs font-bold">Description / Overview</Label>
              <Textarea
                rows={2}
                placeholder="Brief summary of syllabus and topics covered..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="text-xs rounded-xl"
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
                {isSubmitting ? "Saving..." : editingBook ? "Save Changes" : "Create Book"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
