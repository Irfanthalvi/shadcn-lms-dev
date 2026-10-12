import React, { useState, useMemo, useEffect, useRef, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useLms } from "@/context/LmsContext";
import { useAuth } from "@/context/AuthContext";
import {
  ChevronLeft,
  ChevronRight,
  BookOpen,
  HelpCircle,
  PlayCircle,
  Bookmark,
  BookmarkCheck,
  CheckCircle2,
  Sparkles,
  Pencil,
  Atom,
  GraduationCap,
  ArrowRight,
  Video,
  FileText,
  StickyNote,
  ExternalLink,
  Save,
  RotateCcw,
  Maximize2,
  Minimize2,
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

// Converts a YouTube URL or bare video ID to a clean 11-char video ID
function extractYouTubeId(urlOrId) {
  if (!urlOrId) return null;
  const str = String(urlOrId).trim();
  if (/^[a-zA-Z0-9_-]{11}$/.test(str)) return str;
  const match = str.match(
    /(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=)|youtube-nocookie\.com\/embed\/)([a-zA-Z0-9_-]{11})/
  );
  if (match && match[1]) return match[1];
  return null;
}

// Panel IDs for the 3-column layout
const PANELS = {
  VIDEO: "video",
  TEXTBOOK: "textbook",
  NOTES: "notes",
};

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

  // ─── Resolve entities from real Firestore data only ─────────────────────────
  const currentClass = useMemo(
    () => classes.find((c) => String(c.id) === String(classId)) || { id: classId, name: `Class ${classId}` },
    [classes, classId]
  );

  const currentSubject = useMemo(
    () => subjects.find((s) => String(s.id) === String(subjectId)) || { id: subjectId, name: "Subject" },
    [subjects, subjectId]
  );

  const currentBook = useMemo(
    () => books.find((b) => String(b.id) === String(bookId)),
    [books, bookId]
  );

  const currentChapter = useMemo(
    () => chapters.find((c) => String(c.id) === String(chapterId)) || null,
    [chapters, chapterId]
  );

  // Sibling chapters for prev/next navigation (same subject, sorted by chapterNumber)
  const siblingChapters = useMemo(() => {
    return chapters
      .filter(
        (c) =>
          String(c.subjectId) === String(subjectId) ||
          (bookId && String(c.bookId) === String(bookId))
      )
      .sort((a, b) => Number(a.chapterNumber || 0) - Number(b.chapterNumber || 0));
  }, [chapters, subjectId, bookId]);

  const currentIndex = useMemo(
    () => siblingChapters.findIndex((c) => String(c.id) === String(chapterId)),
    [siblingChapters, chapterId]
  );

  const prevChapter = currentIndex > 0 ? siblingChapters[currentIndex - 1] : null;
  const nextChapter = currentIndex < siblingChapters.length - 1 ? siblingChapters[currentIndex + 1] : null;

  const navigateToChapter = useCallback(
    (chap) => {
      if (bookId) {
        navigate(
          `/classes/${classId}/subjects/${subjectId}/books/${bookId}/chapters/${chap.id}/content`,
          { replace: false }
        );
      } else {
        navigate(
          `/classes/${classId}/subjects/${subjectId}/chapters/${chap.id}/content`,
          { replace: false }
        );
      }
    },
    [navigate, classId, subjectId, bookId]
  );

  // ─── Quizzes for this chapter ────────────────────────────────────────────────
  const chapterQuizzes = useMemo(() => {
    return quizzes.filter(
      (q) =>
        String(q.chapterId) === String(chapterId) ||
        (String(q.subjectId) === String(subjectId) && String(q.classId) === String(classId))
    );
  }, [quizzes, chapterId, subjectId, classId]);

  // ─── YouTube video ID ────────────────────────────────────────────────────────
  const videoId = useMemo(() => extractYouTubeId(currentChapter?.videoUrl), [currentChapter]);

  // ─── Active panel state ──────────────────────────────────────────────────────
  const [activePanel, setActivePanel] = useState(PANELS.VIDEO);
  const [expandedPanel, setExpandedPanel] = useState(null); // null = 3-col layout
  const [notesTab, setNotesTab] = useState("curriculum"); // "curriculum" | "personal"

  // ─── Personal Notes (per-user per-chapter, stored in localStorage) ──────────
  const notesKey = `chapter_notes_${user?.uid || "guest"}_${chapterId}`;
  const [personalNotes, setPersonalNotes] = useState(() => {
    try {
      return localStorage.getItem(notesKey) || "";
    } catch {
      return "";
    }
  });
  const [notesDirty, setNotesDirty] = useState(false);

  const saveNotes = useCallback(() => {
    try {
      localStorage.setItem(notesKey, personalNotes);
      setNotesDirty(false);
      toast.success("Notes saved!", { duration: 1500 });
    } catch {
      toast.error("Could not save notes.");
    }
  }, [notesKey, personalNotes]);

  const clearNotes = useCallback(() => {
    if (!window.confirm("Clear all your notes for this chapter?")) return;
    setPersonalNotes("");
    setNotesDirty(true);
    localStorage.removeItem(notesKey);
  }, [notesKey]);

  // Reload notes when chapter changes
  useEffect(() => {
    try {
      setPersonalNotes(localStorage.getItem(notesKey) || "");
      setNotesDirty(false);
    } catch {
      setPersonalNotes("");
    }
  }, [notesKey]);

  // ─── Admin Edit Modal ────────────────────────────────────────────────────────
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    theoryNotes: "",
    keyFormulas: "",
    learningObjectives: "",
    resourceLink: "",
    videoUrl: "",
    textbookContent: "",
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
      videoUrl: currentChapter.videoUrl || "",
      textbookContent: currentChapter.textbookContent || "",
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
        videoUrl: formData.videoUrl.trim(),
        textbookContent: formData.textbookContent.trim(),
      });
      setIsEditModalOpen(false);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  // ─── Bookmark ────────────────────────────────────────────────────────────────
  const bookmarked = currentChapter ? isBookmarked(currentChapter.id) : false;

  // ─── Panel toggle helper ─────────────────────────────────────────────────────
  const toggleExpand = (panel) => {
    setExpandedPanel((prev) => (prev === panel ? null : panel));
  };

  // ─── Render helpers ──────────────────────────────────────────────────────────
  const renderVideoPanel = () => {
    const isExpanded = expandedPanel === PANELS.VIDEO;
    return (
      <div
        className={`flex flex-col bg-card border border-border/80 rounded-2xl overflow-hidden transition-all duration-300 ${
          isExpanded ? "col-span-3" : ""
        }`}
      >
        {/* Panel header */}
        <div className="flex items-center justify-between px-4 py-2.5 border-b border-border/60 bg-muted/30">
          <div className="flex items-center gap-2 text-xs font-bold text-foreground">
            <Video className="w-3.5 h-3.5 text-red-500" />
            Video Lecture
          </div>
          <button
            onClick={() => toggleExpand(PANELS.VIDEO)}
            className="p-1 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition"
            title={isExpanded ? "Collapse" : "Expand"}
          >
            {isExpanded ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
          </button>
        </div>

        {/* Video content */}
        <div className="flex-1 bg-black/90">
          {videoId ? (
            <div className="relative w-full" style={{ paddingTop: "56.25%" }}>
              <iframe
                className="absolute inset-0 w-full h-full"
                src={`https://www.youtube-nocookie.com/embed/${videoId}?rel=0&modestbranding=1`}
                title={currentChapter?.title || "Chapter Video"}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center min-h-[220px] gap-3 text-center p-6 bg-card">
              <div className="w-12 h-12 rounded-2xl bg-red-500/10 text-red-500 flex items-center justify-center">
                <Video className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs font-bold text-foreground">No Video Lecture Linked</p>
                <p className="text-[11px] text-muted-foreground mt-1 max-w-xs">
                  {isAdmin
                    ? "Click 'Edit Content' above to attach a YouTube video URL or ID."
                    : "A video lecture has not been attached to this chapter yet."}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Learning objectives */}
        {currentChapter?.learningObjectives?.length > 0 && (
          <div className="p-4 border-t border-border/60 space-y-2">
            <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> Student Learning Outcomes (SLOs)
            </p>
            <ul className="space-y-1.5">
              {currentChapter.learningObjectives.map((obj, i) => (
                <li key={i} className="flex items-start gap-2 text-xs text-foreground/80 leading-relaxed">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0 mt-1.5" />
                  <span>{obj}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    );
  };

  const renderTextbookPanel = () => {
    const isExpanded = expandedPanel === PANELS.TEXTBOOK;
    return (
      <div
        className={`flex flex-col bg-card border border-border/80 rounded-2xl overflow-hidden transition-all duration-300 ${
          isExpanded ? "col-span-3" : ""
        }`}
      >
        <div className="flex items-center justify-between px-4 py-2.5 border-b border-border/60 bg-muted/30">
          <div className="flex items-center gap-2 text-xs font-bold text-foreground">
            <BookOpen className="w-3.5 h-3.5 text-primary" />
            Textbook Reading
          </div>
          <button
            onClick={() => toggleExpand(PANELS.TEXTBOOK)}
            className="p-1 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition"
            title={isExpanded ? "Collapse" : "Expand"}
          >
            {isExpanded ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-5 space-y-4 max-h-[520px]">
          {currentChapter?.textbookContent ? (
            <div className="prose prose-sm dark:prose-invert max-w-none text-xs sm:text-sm text-foreground/90 leading-relaxed whitespace-pre-line">
              {currentChapter.textbookContent}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center min-h-[220px] text-center p-6 space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center">
                <BookOpen className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs font-bold text-foreground">No Textbook Content Added</p>
                <p className="text-[11px] text-muted-foreground mt-1 max-w-xs">
                  {isAdmin
                    ? "Click 'Edit Content' above to transcribe or paste the textbook reading material for this chapter."
                    : "Textbook reading material has not been uploaded for this chapter yet."}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderNotesPanel = () => {
    const isExpanded = expandedPanel === PANELS.NOTES;
    const hasTheory = Boolean(currentChapter?.theoryNotes?.trim());
    const hasFormulas = Boolean(currentChapter?.keyFormulas?.trim());
    const hasCurriculumNotes = hasTheory || hasFormulas;

    return (
      <div
        className={`flex flex-col bg-card border border-border/80 rounded-2xl overflow-hidden transition-all duration-300 ${
          isExpanded ? "col-span-3" : ""
        }`}
      >
        <div className="flex items-center justify-between px-4 py-2 border-b border-border/60 bg-muted/30">
          {/* Sub-tabs: Curriculum Notes vs Personal Notes */}
          <div className="flex items-center gap-1 bg-muted/60 p-0.5 rounded-lg border border-border/40">
            <button
              onClick={() => setNotesTab("curriculum")}
              className={`px-2.5 py-1 text-[11px] font-bold rounded-md transition ${
                notesTab === "curriculum"
                  ? "bg-card text-foreground shadow-xs"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Teacher Notes & Formulas
            </button>
            <button
              onClick={() => setNotesTab("personal")}
              className={`px-2.5 py-1 text-[11px] font-bold rounded-md transition flex items-center gap-1 ${
                notesTab === "personal"
                  ? "bg-card text-foreground shadow-xs"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              My Notes
              {notesDirty && <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />}
            </button>
          </div>

          <div className="flex items-center gap-1">
            {notesTab === "personal" && (
              <>
                <button
                  onClick={clearNotes}
                  className="p-1 rounded-lg text-muted-foreground hover:text-destructive hover:bg-muted transition"
                  title="Clear personal notes"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={saveNotes}
                  className="p-1 rounded-lg text-muted-foreground hover:text-emerald-500 hover:bg-muted transition"
                  title="Save personal notes"
                >
                  <Save className="w-3.5 h-3.5" />
                </button>
              </>
            )}
            <button
              onClick={() => toggleExpand(PANELS.NOTES)}
              className="p-1 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition"
              title={isExpanded ? "Collapse" : "Expand"}
            >
              {isExpanded ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-5 space-y-4 max-h-[520px]">
          {notesTab === "curriculum" ? (
            hasCurriculumNotes ? (
              <div className="space-y-4">
                {/* Theory Notes */}
                {hasTheory && (
                  <div className="space-y-2">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                      <Sparkles className="w-3 h-3 text-primary" /> Theory & Key Concepts
                    </p>
                    <div className="prose prose-sm dark:prose-invert max-w-none text-xs text-foreground/90 leading-relaxed whitespace-pre-line bg-muted/20 p-3.5 rounded-xl border border-border/50">
                      {currentChapter.theoryNotes}
                    </div>
                  </div>
                )}

                {/* Key Formulas */}
                {hasFormulas && (
                  <div className="space-y-2">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                      <Atom className="w-3 h-3 text-amber-500" /> Key Formulas & Equations
                    </p>
                    <div className="p-3.5 rounded-xl bg-muted/40 border border-border/60 font-mono text-xs text-foreground whitespace-pre-line leading-loose">
                      {currentChapter.keyFormulas}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center min-h-[220px] text-center p-6 space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-500 flex items-center justify-center">
                  <StickyNote className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-xs font-bold text-foreground">No Notes or Formulas Uploaded</p>
                  <p className="text-[11px] text-muted-foreground mt-1 max-w-xs">
                    {isAdmin
                      ? "Click 'Edit Content' to add teacher theory notes and key formulas."
                      : "Teacher notes and summary formulas have not been uploaded for this chapter yet."}
                  </p>
                </div>
              </div>
            )
          ) : (
            <div className="flex-1 flex flex-col h-full min-h-[260px]">
              <textarea
                className="flex-1 w-full resize-none bg-transparent text-xs text-foreground placeholder:text-muted-foreground/50 focus:outline-none leading-relaxed min-h-[220px]"
                placeholder={`Take your personal study notes for "${currentChapter?.title || "this chapter"}"...\n\nYour notes are saved privately on this device.`}
                value={personalNotes}
                onChange={(e) => {
                  setPersonalNotes(e.target.value);
                  setNotesDirty(true);
                }}
              />
              <div className="pt-3 border-t border-border/60 flex items-center justify-between">
                <span className="text-[10px] text-muted-foreground/60">
                  Saved locally on this device
                </span>
                <Button
                  size="sm"
                  variant={notesDirty ? "default" : "outline"}
                  onClick={saveNotes}
                  className="h-7 text-[10px] rounded-lg gap-1"
                >
                  <Save className="w-3 h-3" />
                  {notesDirty ? "Save Now" : "Saved"}
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  // ─── Loading state ───────────────────────────────────────────────────────────
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

  if (!currentChapter) {
    return (
      <div className="p-8 text-center space-y-4">
        <BookOpen className="w-12 h-12 text-muted-foreground/40 mx-auto" />
        <h2 className="text-xl font-bold text-foreground">Chapter Not Found</h2>
        <p className="text-xs text-muted-foreground">
          This chapter could not be found in the curriculum. It may have been deleted or not yet added.
        </p>
        <Button
          onClick={() =>
            navigate(
              bookId
                ? `/classes/${classId}/subjects/${subjectId}/books/${bookId}/chapters`
                : `/classes/${classId}/subjects/${subjectId}/chapters`
            )
          }
          variant="outline"
          className="rounded-xl text-xs gap-1.5"
        >
          <ChevronLeft className="w-4 h-4" /> Back to Chapters
        </Button>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 max-w-[1400px] mx-auto space-y-5 animate-in fade-in duration-300">
      {/* ── Breadcrumb ── */}
      <nav className="flex items-center gap-1.5 text-xs text-muted-foreground flex-wrap">
        <button onClick={() => navigate("/classes")} className="hover:text-foreground font-medium transition">
          Classes
        </button>
        <ChevronRight className="w-3.5 h-3.5" />
        <button onClick={() => navigate(`/classes/${classId}/subjects`)} className="hover:text-foreground font-medium transition">
          {currentClass.name}
        </button>
        <ChevronRight className="w-3.5 h-3.5" />
        <button onClick={() => navigate(`/classes/${classId}/subjects/${subjectId}/chapters`)} className="hover:text-foreground font-medium transition">
          {currentSubject.name}
        </button>
        {bookId && (
          <>
            <ChevronRight className="w-3.5 h-3.5" />
            <button
              onClick={() => navigate(`/classes/${classId}/subjects/${subjectId}/books/${bookId}/chapters`)}
              className="hover:text-foreground font-medium transition"
            >
              {currentBook?.title || "Chapters"}
            </button>
          </>
        )}
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-primary font-bold line-clamp-1 max-w-[160px]">
          Ch {currentChapter.chapterNumber}: {currentChapter.title}
        </span>
      </nav>

      {/* ── Chapter header ── */}
      <div className="relative overflow-hidden rounded-2xl bg-card border border-border/80 p-5 sm:p-6 shadow-sm">
        <div className="absolute top-0 right-0 -mt-8 -mr-8 w-48 h-48 bg-primary/8 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div className="space-y-2 flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs px-2.5 py-0.5 rounded-full font-bold bg-primary/10 text-primary border border-primary/20">
                Chapter {currentChapter.chapterNumber}
              </span>
              <span className="text-xs px-2.5 py-0.5 rounded-full font-medium bg-muted text-muted-foreground">
                {currentSubject.name} • {currentClass.name}
              </span>
              {videoId && (
                <span className="text-xs px-2 py-0.5 rounded-full font-medium bg-red-500/10 text-red-500 border border-red-500/20 flex items-center gap-1">
                  <Video className="w-3 h-3" /> Video
                </span>
              )}
            </div>

            <h1 className="text-xl sm:text-2xl font-black tracking-tight text-foreground line-clamp-2">
              {currentChapter.title}
            </h1>

            {currentChapter.description && (
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                {currentChapter.description}
              </p>
            )}

            <div className="flex items-center gap-2 pt-1 flex-wrap">
              <Button
                onClick={() => navigate(`/classes/${classId}/subjects/${subjectId}/chapters/${chapterId}/quiz`)}
                className="text-xs h-8 rounded-xl font-bold shadow-sm shadow-primary/20 gap-1.5"
                size="sm"
              >
                <PlayCircle className="w-3.5 h-3.5" /> Start Assessment Quiz {chapterQuizzes.length > 0 ? `(${chapterQuizzes.length})` : ""}
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={() => currentChapter && toggleBookmark(currentChapter.id)}
                className="text-xs h-8 rounded-xl font-semibold gap-1.5"
              >
                {bookmarked ? (
                  <><BookmarkCheck className="w-3.5 h-3.5 text-primary" /> Bookmarked</>
                ) : (
                  <><Bookmark className="w-3.5 h-3.5" /> Bookmark</>
                )}
              </Button>

              {isAdmin && (
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={openEditModal}
                  className="text-xs h-8 rounded-xl font-semibold gap-1.5"
                >
                  <Pencil className="w-3 h-3 text-primary" /> Edit Content
                </Button>
              )}
            </div>
          </div>

          {/* Prev / Next navigation */}
          <div className="flex items-center gap-2 shrink-0">
            <Button
              variant="outline"
              size="sm"
              disabled={!prevChapter}
              onClick={() => prevChapter && navigateToChapter(prevChapter)}
              className="text-xs h-8 rounded-xl gap-1 font-semibold"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
              {prevChapter ? `Ch ${prevChapter.chapterNumber}` : "First"}
            </Button>
            <span className="text-xs text-muted-foreground font-medium">
              {currentIndex + 1} / {siblingChapters.length}
            </span>
            <Button
              variant="outline"
              size="sm"
              disabled={!nextChapter}
              onClick={() => nextChapter && navigateToChapter(nextChapter)}
              className="text-xs h-8 rounded-xl gap-1 font-semibold"
            >
              {nextChapter ? `Ch ${nextChapter.chapterNumber}` : "Last"}
              <ChevronRight className="w-3.5 h-3.5" />
            </Button>
          </div>
        </div>
      </div>

      {/* ── Mobile tab selector ── */}
      <div className="flex sm:hidden items-center gap-1 bg-muted/50 border border-border/60 rounded-xl p-1">
        {[
          { id: PANELS.VIDEO, label: "Video", Icon: Video },
          { id: PANELS.TEXTBOOK, label: "Textbook", Icon: BookOpen },
          { id: PANELS.NOTES, label: "My Notes", Icon: StickyNote },
        ].map(({ id, label, Icon }) => (
          <button
            key={id}
            onClick={() => setActivePanel(id)}
            className={`flex-1 flex items-center justify-center gap-1.5 text-xs font-bold py-2 px-3 rounded-lg transition-all ${
              activePanel === id
                ? "bg-card text-foreground shadow-sm border border-border/60"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Icon className="w-3.5 h-3.5" />
            {label}
          </button>
        ))}
      </div>

      {/* ── 3-column learning layout (desktop) / single panel (mobile) ── */}
      {/* Desktop */}
      <div
        className={`hidden sm:grid gap-4 ${
          expandedPanel ? "grid-cols-3" : "grid-cols-3"
        }`}
        style={{ minHeight: "460px" }}
      >
        {(!expandedPanel || expandedPanel === PANELS.VIDEO) && renderVideoPanel()}
        {(!expandedPanel || expandedPanel === PANELS.TEXTBOOK) && renderTextbookPanel()}
        {(!expandedPanel || expandedPanel === PANELS.NOTES) && renderNotesPanel()}
      </div>

      {/* Mobile: show active panel only */}
      <div className="sm:hidden">
        {activePanel === PANELS.VIDEO && renderVideoPanel()}
        {activePanel === PANELS.TEXTBOOK && renderTextbookPanel()}
        {activePanel === PANELS.NOTES && renderNotesPanel()}
      </div>

      {/* ── Chapter Quiz section ── */}
      <div className="p-5 rounded-2xl bg-gradient-to-br from-primary/5 via-card to-card border border-border/80 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-sm font-bold text-foreground flex items-center gap-2">
              <HelpCircle className="w-4 h-4 text-primary" />
              Chapter Assessment
            </h2>
            <p className="text-xs text-muted-foreground">
              Timed self-assessments to test your understanding.
            </p>
          </div>
          <Button
            size="sm"
            onClick={() => navigate(`/classes/${classId}/subjects/${subjectId}/chapters/${chapterId}/quiz`)}
            className="text-xs font-bold rounded-xl gap-1.5 shadow-sm"
          >
            <PlayCircle className="w-3.5 h-3.5" /> Start Test
          </Button>
        </div>

        {chapterQuizzes.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {chapterQuizzes.map((quiz) => {
              const attempt = (studentAttempts || []).find(
                (a) => String(a.quizId) === String(quiz.id) && (user ? a.userId === user.uid : true)
              );
              return (
                <div
                  key={quiz.id}
                  onClick={() => navigate(`/classes/${classId}/subjects/${subjectId}/chapters/${chapterId}/quiz`)}
                  className="p-4 rounded-xl bg-card border border-border hover:border-primary/50 cursor-pointer transition flex items-center justify-between shadow-xs"
                >
                  <div className="space-y-0.5">
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
          <div className="p-4 rounded-xl bg-muted/40 border border-border/60 text-xs text-muted-foreground flex items-center justify-between">
            <span>No quiz published for this chapter yet.</span>
            <Button
              size="sm"
              variant="outline"
              onClick={() => navigate("/quizzes")}
              className="text-xs h-7 rounded-lg font-semibold"
            >
              Browse All Quizzes
            </Button>
          </div>
        )}
      </div>

      {/* ── Prev / Next chapter navigation bar ── */}
      <div className="flex items-center justify-between gap-3 border-t border-border/60 pt-5">
        <div className="flex-1">
          {prevChapter ? (
            <button
              onClick={() => navigateToChapter(prevChapter)}
              className="group flex items-center gap-3 p-3 rounded-xl border border-border/60 hover:border-primary/40 hover:bg-primary/5 transition-all w-full sm:w-auto text-left"
            >
              <ChevronLeft className="w-5 h-5 text-muted-foreground group-hover:text-primary shrink-0" />
              <div>
                <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider">Previous Chapter</p>
                <p className="text-xs font-bold text-foreground group-hover:text-primary transition line-clamp-1">
                  Ch {prevChapter.chapterNumber}: {prevChapter.title}
                </p>
              </div>
            </button>
          ) : <div />}
        </div>

        <div className="flex-1 flex justify-end">
          {nextChapter ? (
            <button
              onClick={() => navigateToChapter(nextChapter)}
              className="group flex items-center gap-3 p-3 rounded-xl border border-border/60 hover:border-primary/40 hover:bg-primary/5 transition-all w-full sm:w-auto text-right justify-end"
            >
              <div>
                <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider">Next Chapter</p>
                <p className="text-xs font-bold text-foreground group-hover:text-primary transition line-clamp-1">
                  Ch {nextChapter.chapterNumber}: {nextChapter.title}
                </p>
              </div>
              <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-primary shrink-0" />
            </button>
          ) : <div />}
        </div>
      </div>

      {/* ── Admin Edit Modal ── */}
      {isAdmin && (
        <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
          <DialogContent className="max-w-2xl max-h-[92vh] overflow-y-auto rounded-3xl p-6">
            <DialogHeader>
              <DialogTitle className="text-xl font-black text-foreground">
                Edit Chapter Content
              </DialogTitle>
              <p className="text-xs text-muted-foreground">
                Update notes, textbook, video, formulas, and objectives for Chapter {currentChapter?.chapterNumber}.
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
                <Label className="text-xs font-bold">Brief Description</Label>
                <Input
                  value={formData.description}
                  onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                  className="text-xs rounded-xl h-9"
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-bold flex items-center gap-1.5">
                  <Video className="w-3.5 h-3.5 text-red-500" /> YouTube Video URL
                </Label>
                <Input
                  placeholder="https://www.youtube.com/watch?v=... or 11-char video ID"
                  value={formData.videoUrl}
                  onChange={(e) => setFormData((prev) => ({ ...prev, videoUrl: e.target.value }))}
                  className="text-xs rounded-xl h-9"
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-bold flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5 text-primary" /> Textbook Content
                </Label>
                <Textarea
                  value={formData.textbookContent}
                  onChange={(e) => setFormData((prev) => ({ ...prev, textbookContent: e.target.value }))}
                  className="text-xs rounded-xl min-h-[120px]"
                  placeholder="Paste the textbook reading content here..."
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-bold">Learning Objectives (one per line)</Label>
                <Textarea
                  value={formData.learningObjectives}
                  onChange={(e) => setFormData((prev) => ({ ...prev, learningObjectives: e.target.value }))}
                  className="text-xs rounded-xl min-h-[80px]"
                  placeholder={"Understand basic principles...\nSolve numerical problems...\nDerive formulas..."}
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-bold">Theory Notes & Key Concepts</Label>
                <Textarea
                  value={formData.theoryNotes}
                  onChange={(e) => setFormData((prev) => ({ ...prev, theoryNotes: e.target.value }))}
                  className="text-xs rounded-xl min-h-[120px]"
                  placeholder="Detailed theoretical notes and explanations..."
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-bold">Key Formulas & Equations</Label>
                <Textarea
                  value={formData.keyFormulas}
                  onChange={(e) => setFormData((prev) => ({ ...prev, keyFormulas: e.target.value }))}
                  className="text-xs rounded-xl min-h-[70px] font-mono"
                  placeholder={"v = s / t\na = (vf - vi) / t\nF = ma"}
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
                  {isSubmitting ? "Saving..." : "Save Content"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
