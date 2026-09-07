import React, { useState, useMemo, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useLms } from "@/context/LmsContext";
import { useAuth } from "@/context/AuthContext";
import {
  ChevronLeft,
  ChevronRight,
  BookOpen,
  HelpCircle,
  Clock,
  Trophy,
  PlayCircle,
  FileText,
  Bookmark,
  BookmarkCheck,
  CheckCircle2,
  Sparkles,
  ExternalLink,
  Download,
  Pencil,
  Plus,
  Atom,
  GraduationCap,
  Layers,
  ArrowRight,
  Share2,
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

export default function ChapterContentPage() {
  const { classId, subjectId, bookId, chapterId } = useParams();
  const navigate = useNavigate();
  const {
    classes,
    subjects,
    books,
    chapters,
    quizzes,
    studentAttempts,
    updateChapter,
    bookmarks,
    toggleBookmark,
    isBookmarked,
  } = useLms();
  const { user, userProfile, isAdmin } = useAuth();

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

  // Match Chapter: check Firestore chapters, fallback to sindhBoardChapters
  const currentChapter = useMemo(() => {
    const fromFs = chapters.find((c) => String(c.id) === String(chapterId));
    if (fromFs) return fromFs;

    const fallback = sindhBoardChapters.find(
      (c) =>
        String(c.id) === String(chapterId) ||
        (c.chapterNumber === 1 && currentSubject?.name && c.subjectId.includes("phy"))
    );
    return fallback || null;
  }, [chapters, chapterId, currentSubject]);

  // Quizzes matching this chapter
  const chapterQuizzes = useMemo(() => {
    return quizzes.filter(
      (q) =>
        String(q.chapterId) === String(chapterId) ||
        (String(q.subjectId) === String(subjectId) && String(q.classId) === String(classId))
    );
  }, [quizzes, chapterId, subjectId, classId]);

  // Admin Edit Chapter Content Modal
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    theoryNotes: "",
    keyFormulas: "",
    learningObjectives: "",
    resourceLink: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const openEditModal = () => {
    if (!currentChapter) return;
    setFormData({
      title: currentChapter.title || "",
      description: currentChapter.description || "",
      theoryNotes: currentChapter.theoryNotes || "",
      keyFormulas: currentChapter.keyFormulas || "",
      learningObjectives: (currentChapter.learningObjectives || []).join("\n"),
      resourceLink: currentChapter.resourceLink || "",
    });
    setIsEditModalOpen(true);
  };

  const handleSaveContent = async (e) => {
    e.preventDefault();
    if (!currentChapter) return;

    setIsSubmitting(true);
    try {
      const objectivesArray = formData.learningObjectives
        .split("\n")
        .map((s) => s.trim())
        .filter(Boolean);

      await updateChapter(currentChapter.id, {
        title: formData.title.trim(),
        description: formData.description.trim(),
        theoryNotes: formData.theoryNotes.trim(),
        keyFormulas: formData.keyFormulas.trim(),
        learningObjectives: objectivesArray,
        resourceLink: formData.resourceLink.trim(),
      });
      setIsEditModalOpen(false);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!currentClass || !currentSubject) {
    return (
      <div className="p-8 text-center space-y-4">
        <h2 className="text-xl font-bold text-foreground">Content Not Found</h2>
        <p className="text-xs text-muted-foreground">The requested curriculum section could not be loaded.</p>
        <Button onClick={() => navigate("/classes")} variant="outline" className="rounded-xl text-xs">
          Return to Classes
        </Button>
      </div>
    );
  }

  const bookmarked = currentChapter ? isBookmarked(currentChapter.id) : false;

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-5xl mx-auto space-y-8 animate-in fade-in duration-300">
      {/* 5-Level Hierarchy Breadcrumbs: Class → Subject → Book → Chapters → Content */}
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
        {bookId && (
          <>
            <ChevronRight className="w-3.5 h-3.5" />
            <button
              onClick={() =>
                navigate(`/classes/${classId}/subjects/${subjectId}/books/${bookId}/chapters`)
              }
              className="hover:text-foreground font-medium transition"
            >
              {currentBook?.title ? "Book Volume" : "Chapters"}
            </button>
          </>
        )}
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-primary font-bold">
          Chapter {currentChapter?.chapterNumber || 1} Learning Content
        </span>
      </nav>

      {/* Main Chapter Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-card border border-border/80 p-6 sm:p-8 shadow-sm">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-56 h-56 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs px-2.5 py-0.5 rounded-full font-bold bg-primary/10 text-primary border border-primary/20">
                Chapter {currentChapter?.chapterNumber || 1}
              </span>
              <span className="text-xs px-2.5 py-0.5 rounded-full font-medium bg-muted text-muted-foreground">
                Sindh Textbook Board
              </span>
              <span className="text-xs px-2.5 py-0.5 rounded-full font-medium bg-muted text-muted-foreground">
                {currentSubject.name} • {currentClass.name}
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-foreground">
              {currentChapter?.title || "Chapter Overview"}
            </h1>

            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
              {currentChapter?.description ||
                "Official Sindh Board curriculum lesson notes, formulas, learning outcomes, and assessment questions."}
            </p>

            <div className="flex items-center gap-3 pt-2">
              {/* Direct Quiz Trigger */}
              <Button
                onClick={() =>
                  navigate(
                    `/classes/${classId}/subjects/${subjectId}/chapters/${chapterId}/quiz`
                  )
                }
                className="text-xs h-9 rounded-xl font-bold shadow-sm shadow-primary/20 gap-1.5"
              >
                <PlayCircle className="w-4 h-4" /> Start Chapter Assessment
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={() => currentChapter && toggleBookmark(currentChapter.id)}
                className="text-xs h-9 rounded-xl font-semibold gap-1.5"
              >
                {bookmarked ? (
                  <>
                    <BookmarkCheck className="w-4 h-4 text-primary" /> Bookmarked
                  </>
                ) : (
                  <>
                    <Bookmark className="w-4 h-4" /> Save Bookmark
                  </>
                )}
              </Button>

              {isAdmin && (
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={openEditModal}
                  className="text-xs h-9 rounded-xl font-semibold gap-1.5"
                >
                  <Pencil className="w-3.5 h-3.5 text-primary" /> Edit Notes
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Section 1: Student Learning Objectives (SLOs) */}
      <div className="p-6 rounded-3xl bg-card border border-border/80 shadow-sm space-y-4">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-primary/10 text-primary">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-base font-bold text-foreground">
              Student Learning Outcomes (SLOs)
            </h2>
            <p className="text-xs text-muted-foreground">
              Core competencies and skills expected by the Sindh Board syllabus.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
          {(currentChapter?.learningObjectives && currentChapter.learningObjectives.length > 0
            ? currentChapter.learningObjectives
            : [
                "Understand fundamental principles and theoretical definitions",
                "Apply mathematical relations and physical formulas to solve problems",
                "Explain real-world scientific applications and experimental procedures",
                "Prepare for Sindh Board annual and model examination papers",
              ]
          ).map((objective, idx) => (
            <div
              key={idx}
              className="p-3.5 rounded-2xl bg-muted/40 border border-border/60 flex items-start gap-3"
            >
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
              <span className="text-xs text-foreground font-medium leading-relaxed">
                {objective}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Section 2: Sindh Board Theory Notes & Key Concepts */}
      <div className="p-6 sm:p-8 rounded-3xl bg-card border border-border/80 shadow-sm space-y-5">
        <div className="flex items-center justify-between border-b border-border/80 pb-4">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-primary/10 text-primary">
              <BookOpen className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-foreground">
                Sindh Board Textbook Theory & Explanations
              </h2>
              <p className="text-xs text-muted-foreground">
                Prescribed conceptual summaries based on the Jamshoro Sindh Textbook.
              </p>
            </div>
          </div>
        </div>

        <div className="prose prose-sm dark:prose-invert max-w-none text-xs sm:text-sm text-foreground/90 leading-relaxed whitespace-pre-line font-normal">
          {currentChapter?.theoryNotes ||
            `This chapter provides foundational knowledge according to the Sindh Textbook Board syllabus.
Review the key definitions, principles, and diagrams outlined in your textbook before attempting the self-assessment test.`}
        </div>
      </div>

      {/* Section 3: Key Formulas & Mathematical Equations */}
      {currentChapter?.keyFormulas && (
        <div className="p-6 rounded-3xl bg-card border border-border/80 shadow-sm space-y-4">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-500">
              <Atom className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-foreground">
                Key Formulas & Mathematical Relations
              </h2>
              <p className="text-xs text-muted-foreground">
                Essential equations for numerical problems and board examinations.
              </p>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-muted/30 border border-border/60 font-mono text-xs text-foreground whitespace-pre-line leading-loose">
            {currentChapter.keyFormulas}
          </div>
        </div>
      )}

      {/* Section 4: Self-Assessment Quizzes */}
      <div className="p-6 rounded-3xl bg-gradient-to-br from-primary/5 via-card to-card border border-border/80 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-foreground flex items-center gap-2">
              <HelpCircle className="w-5 h-5 text-primary" />
              Chapter Assessment Tests
            </h2>
            <p className="text-xs text-muted-foreground">
              Timed self-assessments to test your conceptual clarity on this chapter.
            </p>
          </div>

          <Button
            size="sm"
            onClick={() =>
              navigate(
                `/classes/${classId}/subjects/${subjectId}/chapters/${chapterId}/quiz`
              )
            }
            className="text-xs font-bold rounded-xl gap-1.5 shadow-sm"
          >
            <PlayCircle className="w-4 h-4" /> Take Test
          </Button>
        </div>

        {chapterQuizzes.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            {chapterQuizzes.map((quiz) => {
              const attempt = studentAttempts.find(
                (a) => String(a.quizId) === String(quiz.id) && (user ? a.userId === user.uid : true)
              );

              return (
                <div
                  key={quiz.id}
                  onClick={() =>
                    navigate(
                      `/classes/${classId}/subjects/${subjectId}/chapters/${chapterId}/quiz`
                    )
                  }
                  className="p-4 rounded-2xl bg-card border border-border hover:border-primary/50 cursor-pointer transition flex items-center justify-between shadow-xs"
                >
                  <div className="space-y-1">
                    <h4 className="text-xs font-bold text-foreground">{quiz.title}</h4>
                    <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
                      <span>{quiz.questions?.length || 5} Questions</span>
                      <span>•</span>
                      <span>{quiz.timeLimitMinutes || 15} Mins</span>
                    </div>
                  </div>

                  {attempt ? (
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        attempt.passed
                          ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                          : "bg-destructive/10 text-destructive"
                      }`}
                    >
                      {attempt.percentage}% ({attempt.passed ? "Passed" : "Failed"})
                    </span>
                  ) : (
                    <span className="text-xs font-bold text-primary flex items-center gap-1">
                      Start <ArrowRight className="w-3 h-3" />
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <div className="p-4 rounded-2xl bg-muted/40 border border-border/60 text-xs text-muted-foreground flex items-center justify-between">
            <span>No standalone quiz published for this specific chapter yet.</span>
            <Button
              size="sm"
              variant="outline"
              onClick={() => navigate("/quizzes")}
              className="text-xs h-8 rounded-xl font-semibold"
            >
              Browse Quizzes Bank
            </Button>
          </div>
        )}
      </div>

      {/* Admin Edit Content Modal */}
      {isAdmin && (
        <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl p-6">
            <DialogHeader>
              <DialogTitle className="text-xl font-black text-foreground">
                Edit Sindh Board Learning Content
              </DialogTitle>
              <p className="text-xs text-muted-foreground">
                Update lesson notes, formulas, learning outcomes, and resources for Chapter {currentChapter?.chapterNumber}.
              </p>
            </DialogHeader>

            <form onSubmit={handleSaveContent} className="space-y-4 pt-2">
              <div className="space-y-1.5">
                <Label className="text-xs font-bold">Chapter Title</Label>
                <Input
                  value={formData.title}
                  onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
                  className="text-xs rounded-xl h-9"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-bold">Chapter Brief Description</Label>
                <Input
                  value={formData.description}
                  onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                  className="text-xs rounded-xl h-9"
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-bold">
                  Learning Objectives (One objective per line)
                </Label>
                <Textarea
                  value={formData.learningObjectives}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, learningObjectives: e.target.value }))
                  }
                  className="text-xs rounded-xl min-h-[80px]"
                  placeholder="Understand basic principles...&#10;Solve numerical problems...&#10;Derive formulas..."
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-bold">Textbook Theory Notes & Key Concepts</Label>
                <Textarea
                  value={formData.theoryNotes}
                  onChange={(e) => setFormData((prev) => ({ ...prev, theoryNotes: e.target.value }))}
                  className="text-xs rounded-xl min-h-[140px]"
                  placeholder="Enter detailed notes and theoretical explanations..."
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-bold">Key Formulas & Equations</Label>
                <Textarea
                  value={formData.keyFormulas}
                  onChange={(e) => setFormData((prev) => ({ ...prev, keyFormulas: e.target.value }))}
                  className="text-xs rounded-xl min-h-[70px] font-mono"
                  placeholder="v = s / t&#10;a = (vf - vi) / t&#10;F = ma"
                />
              </div>

              <DialogFooter className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsEditModalOpen(false)}
                  className="rounded-xl text-xs"
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting} className="rounded-xl text-xs font-bold">
                  {isSubmitting ? "Saving..." : "Save Learning Content"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
