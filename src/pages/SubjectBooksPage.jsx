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
  FileText,
  ExternalLink,
  GraduationCap,
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

export default function SubjectBooksPage() {
  const { classId, subjectId } = useParams();
  const navigate = useNavigate();
  const {
    classes,
    subjects,
    books,
    chapters,
    addBook,
    updateBook,
    deleteBook,
  } = useLms();
  const { userProfile, isAdmin } = useAuth();

  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBook, setEditingBook] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    author: "Sindh Textbook Board",
    board: "Sindh Textbook Board, Jamshoro",
    edition: "Single National Curriculum Edition",
    description: "",
    totalChapters: 8,
    pdfUrl: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const currentClass = classes.find((c) => String(c.id) === String(classId));
  const currentSubject = subjects.find((s) => String(s.id) === String(subjectId));

  const subjectBooks = useMemo(() => {
    // Firestore books for this subject
    let list = books.filter(
      (b) => String(b.subjectId) === String(subjectId)
    );

    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (b) =>
          b.title?.toLowerCase().includes(q) ||
          b.author?.toLowerCase().includes(q) ||
          b.description?.toLowerCase().includes(q)
      );
    }

    return list;
  }, [books, subjectId, classId, search]);

  const openAddModal = () => {
    setEditingBook(null);
    setFormData({
      title: `${currentSubject?.name || "Subject"} (Sindh Textbook Board)`,
      author: "Sindh Textbook Board Panel",
      board: "Sindh Textbook Board, Jamshoro",
      edition: "Single National Curriculum Edition",
      description: `Official prescribed textbook for ${currentClass?.name || "Class"} ${currentSubject?.name || ""}.`,
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
      author: book.author || "Sindh Textbook Board",
      board: book.board || "Sindh Textbook Board, Jamshoro",
      edition: book.edition || "Latest Revised Edition",
      description: book.description || "",
      totalChapters: book.totalChapters || 8,
      pdfUrl: book.pdfUrl || "",
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (bookId, bookTitle, e) => {
    e.stopPropagation();
    if (
      window.confirm(
        `Are you sure you want to remove "${bookTitle}"? This will unlink its chapters.`
      )
    ) {
      await deleteBook(bookId);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      toast.error("Please enter a book title.");
      return;
    }

    setIsSubmitting(true);
    try {
      if (editingBook) {
        await updateBook(editingBook.id, {
          title: formData.title.trim(),
          author: formData.author.trim(),
          board: formData.board.trim(),
          edition: formData.edition.trim(),
          description: formData.description.trim(),
          totalChapters: Number(formData.totalChapters) || 0,
          pdfUrl: formData.pdfUrl.trim(),
        });
      } else {
        await addBook({
          classId: String(classId),
          subjectId: String(subjectId),
          title: formData.title.trim(),
          author: formData.author.trim(),
          board: formData.board.trim(),
          edition: formData.edition.trim(),
          description: formData.description.trim(),
          totalChapters: Number(formData.totalChapters) || 0,
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
      {/* Breadcrumb Navigation: Class → Subject → Book */}
      <div className="flex items-center gap-1.5 text-xs text-muted-foreground flex-wrap">
        <button
          onClick={() => navigate("/classes")}
          className="hover:text-foreground font-medium transition"
        >
          Classes
        </button>
        <ChevronRight className="w-3.5 h-3.5" />
        <button
          onClick={() => navigate(`/classes/${classId}/subjects`)}
          className="hover:text-foreground font-medium transition"
        >
          {currentClass?.name || "Class"}
        </button>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-foreground font-bold">{currentSubject?.name || "Subject"}</span>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-primary font-bold">Books</span>
      </div>

      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs px-2.5 py-0.5 rounded-full font-bold bg-primary/10 text-primary border border-primary/20">
              Sindh Textbook Board (Jamshoro)
            </span>
            <span className="text-xs px-2.5 py-0.5 rounded-full font-medium bg-muted text-muted-foreground">
              {currentClass?.name || "Academic Class"}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-foreground mt-1">
            {currentSubject?.name} Textbooks
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
            Prescribed books, reference syllabus volumes, and curriculum literature published by STBB.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          {isAdmin && (
            <Button
              onClick={openAddModal}
              className="text-xs h-9 rounded-xl font-bold shadow-sm shadow-primary/20 gap-1.5"
            >
              <Plus className="w-4 h-4" /> Add Book
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

      {/* Toolbar: Search */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-3.5 rounded-2xl bg-card border border-border/80 shadow-sm">
        <div className="relative flex-1 w-full max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search textbooks by title or publisher..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 h-9 text-xs rounded-xl"
          />
        </div>

        <div className="text-xs text-muted-foreground font-medium">
          {subjectBooks.length} Book{subjectBooks.length !== 1 ? "s" : ""} Prescribed
        </div>
      </div>

      {/* Books Grid */}
      {subjectBooks.length === 0 ? (
        <div className="text-center py-16 px-4 bg-card border border-dashed border-border rounded-2xl space-y-4">
          <BookOpen className="w-12 h-12 text-muted-foreground/60 mx-auto" />
          <div>
            <h3 className="text-base font-bold text-foreground">No textbooks found</h3>
            <p className="text-xs text-muted-foreground max-w-sm mx-auto mt-1">
              {isAdmin
                ? "Click 'Add Book' to register the Sindh Textbook Board book for this subject."
                : "No textbook has been published for this subject yet."}
            </p>
          </div>
          {isAdmin && (
            <Button onClick={openAddModal} className="text-xs rounded-xl font-bold gap-1.5">
              <Plus className="w-4 h-4" /> Add Sindh Board Book
            </Button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {subjectBooks.map((book) => {
            const bookChapters = chapters.filter(
              (c) => String(c.bookId) === String(book.id) || String(c.subjectId) === String(subjectId)
            );

            return (
              <div
                key={book.id}
                onClick={() =>
                  navigate(
                    `/classes/${classId}/subjects/${subjectId}/books/${book.id}/chapters`
                  )
                }
                className="group p-6 rounded-3xl bg-card border border-border/80 hover:border-primary/50 hover:shadow-xl transition-all duration-200 cursor-pointer flex flex-col justify-between relative overflow-hidden"
              >
                <div className="space-y-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                      <BookOpen className="w-6 h-6" />
                    </div>

                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                      Official STBB
                    </span>
                  </div>

                  <div>
                    <h3 className="text-lg font-black text-foreground group-hover:text-primary transition-colors line-clamp-2">
                      {book.title}
                    </h3>
                    <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                      {book.description ||
                        "Official curriculum textbook published by the Sindh Textbook Board, Jamshoro."}
                    </p>
                  </div>

                  {/* Book Metadata */}
                  <div className="p-3 rounded-2xl bg-muted/40 border border-border/60 space-y-1.5 text-xs">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-muted-foreground">Board:</span>
                      <span className="font-semibold text-foreground">
                        {book.board || "Sindh Textbook Board, Jamshoro"}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-muted-foreground">Edition:</span>
                      <span className="font-semibold text-foreground">
                        {book.edition || "National Curriculum"}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-muted-foreground">Syllabus Chapters:</span>
                      <span className="font-bold text-primary">
                        {bookChapters.length > 0 ? bookChapters.length : book.totalChapters || 8} Chapters
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-border/60 flex items-center justify-between">
                  <span className="text-xs font-bold text-primary inline-flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                    Explore Chapters <ArrowRight className="w-3.5 h-3.5" />
                  </span>

                  {isAdmin && (
                    <div className="flex items-center gap-1">
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={(e) => openEditModal(book, e)}
                        className="h-8 w-8 text-muted-foreground hover:text-primary rounded-xl"
                        title="Edit Book Details"
                      >
                        <Pencil className="w-3.5 h-3.5" />
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={(e) => handleDelete(book.id, book.title, e)}
                        className="h-8 w-8 text-muted-foreground hover:text-destructive rounded-xl"
                        title="Delete Book"
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

      {/* Admin Add / Edit Book Dialog */}
      {isAdmin && (
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogContent className="max-w-md rounded-3xl p-6">
            <DialogHeader>
              <DialogTitle className="text-xl font-black text-foreground">
                {editingBook ? "Edit Sindh Board Book" : "Add Sindh Board Book"}
              </DialogTitle>
              <p className="text-xs text-muted-foreground">
                Configure textbook volume for {currentSubject?.name || "Subject"} ({currentClass?.name}).
              </p>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="space-y-4 pt-2">
              <div className="space-y-1.5">
                <Label className="text-xs font-bold">Book Title *</Label>
                <Input
                  placeholder="e.g. Secondary Stage Physics (Class IX)"
                  value={formData.title}
                  onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
                  className="text-xs rounded-xl h-9"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label className="text-xs font-bold">Publishing Board</Label>
                  <Input
                    placeholder="Sindh Textbook Board, Jamshoro"
                    value={formData.board}
                    onChange={(e) => setFormData((prev) => ({ ...prev, board: e.target.value }))}
                    className="text-xs rounded-xl h-9"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs font-bold">Edition</Label>
                  <Input
                    placeholder="e.g. Revised Edition"
                    value={formData.edition}
                    onChange={(e) => setFormData((prev) => ({ ...prev, edition: e.target.value }))}
                    className="text-xs rounded-xl h-9"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-bold">Author / Editorial Panel</Label>
                <Input
                  placeholder="Sindh Textbook Board Panel"
                  value={formData.author}
                  onChange={(e) => setFormData((prev) => ({ ...prev, author: e.target.value }))}
                  className="text-xs rounded-xl h-9"
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-bold">Book Description</Label>
                <Textarea
                  placeholder="Official textbook curriculum syllabus and student learning outcomes..."
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
                  {isSubmitting ? "Saving..." : editingBook ? "Update Book" : "Add Book"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
