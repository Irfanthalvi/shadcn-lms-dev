import React, { useState, useMemo, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useLms } from "@/context/LmsContext";
import { useAuth } from "@/context/AuthContext";
import {
  HelpCircle,
  Clock,
  BookOpen,
  PlayCircle,
  Search,
  Plus,
  Pencil,
  Trash2,
  CheckCircle2,
  XCircle,
  AlertCircle,
  ChevronRight,
  ChevronLeft,
  ArrowRight,
  Layers,
  GraduationCap,
  Sparkles,
  Trophy,
  RotateCcw,
  Send,
  Flag,
  Check,
  X,
  Eye,
  Calendar,
  Filter,
  ShieldCheck,
  User,
  ExternalLink,
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

export default function QuizzesPage() {
  const navigate = useNavigate();
  const {
    classes,
    subjects,
    chapters,
    quizzes,
    addQuiz,
    updateQuiz,
    deleteQuiz,
    studentAttempts,
    allQuizAttempts,
    submitQuizAttempt,
    loadingLms,
  } = useLms();
  const { user, userProfile, isAdmin } = useAuth();

  // Active View Tab: "quizzes" or "results"
  const [activeTab, setActiveTab] = useState("quizzes");
  const [search, setSearch] = useState("");
  const [selectedClassFilter, setSelectedClassFilter] = useState("all");
  const [selectedSubjectFilter, setSelectedSubjectFilter] = useState("all");

  // Student class resolution
  const studentClassId = !isAdmin ? userProfile?.classId : null;

  // Set default class filter for students
  useEffect(() => {
    if (!isAdmin && studentClassId) {
      setSelectedClassFilter(studentClassId);
    }
  }, [isAdmin, studentClassId]);

  // Admin Create / Edit Quiz Modal State
  const [isQuizModalOpen, setIsQuizModalOpen] = useState(false);
  const [editingQuiz, setEditingQuiz] = useState(null);
  const [quizForm, setQuizForm] = useState({
    classId: "",
    subjectId: "",
    chapterId: "",
    title: "",
    description: "",
    timeLimitMinutes: 15,
    passingScore: 50,
    totalMarks: 5,
    startDate: "",
    endDate: "",
    questions: [
      {
        id: "q1",
        question: "",
        options: ["", "", "", ""],
        correctAnswer: 0,
        explanation: "",
      },
    ],
  });
  const [isSubmittingQuiz, setIsSubmittingQuiz] = useState(false);

  const formSubjects = useMemo(() => {
    if (!quizForm.classId) return [];
    return subjects.filter((s) => String(s.classId) === String(quizForm.classId));
  }, [subjects, quizForm.classId]);

  const formChapters = useMemo(() => {
    if (!quizForm.subjectId) return [];
    return chapters.filter((c) => String(c.subjectId) === String(quizForm.subjectId));
  }, [chapters, quizForm.subjectId]);

  // Student Active Quiz Taking State
  const [preQuizModal, setPreQuizModal] = useState(null);
  const [activeQuiz, setActiveQuiz] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [markedForReview, setMarkedForReview] = useState({});
  const [timeLeftSeconds, setTimeLeftSeconds] = useState(0);
  const [initialTimeSeconds, setInitialTimeSeconds] = useState(0);
  const [quizFinished, setQuizFinished] = useState(false);
  const [quizResult, setQuizResult] = useState(null);
  const [confirmSubmitOpen, setConfirmSubmitOpen] = useState(false);
  const [showAnswerReview, setShowAnswerReview] = useState(false);
  const [inspectAttemptModal, setInspectAttemptModal] = useState(null);
  const timerRef = useRef(null);

  // Countdown timer for active quiz
  useEffect(() => {
    if (activeQuiz && !quizFinished && timeLeftSeconds > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeftSeconds((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current);
            handleAutoSubmit();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timerRef.current);
  }, [activeQuiz, quizFinished, timeLeftSeconds]);

  // Filtered Quizzes calculation (Strict Class Separation)
  const filteredQuizzes = useMemo(() => {
    return quizzes.filter((q) => {
      // Students MUST ONLY see their assigned class
      if (!isAdmin) {
        if (studentClassId && String(q.classId) !== String(studentClassId)) {
          return false;
        }
      } else {
        if (selectedClassFilter !== "all" && String(q.classId) !== String(selectedClassFilter)) {
          return false;
        }
      }

      if (selectedSubjectFilter !== "all" && String(q.subjectId) !== String(selectedSubjectFilter)) {
        return false;
      }

      if (search.trim()) {
        const query = search.toLowerCase();
        const matchTitle = q.title?.toLowerCase().includes(query);
        const matchSubject = subjects.find((s) => String(s.id) === String(q.subjectId))?.name?.toLowerCase().includes(query);
        return matchTitle || matchSubject;
      }

      return true;
    });
  }, [quizzes, isAdmin, studentClassId, selectedClassFilter, selectedSubjectFilter, search, subjects]);

  // Submissions calculation
  const displayAttempts = useMemo(() => {
    const list = isAdmin ? allQuizAttempts : studentAttempts;
    return list.filter((attempt) => {
      if (!isAdmin && studentClassId && attempt.classId && String(attempt.classId) !== String(studentClassId)) {
        return false;
      }
      if (search.trim()) {
        const q = search.toLowerCase();
        const matchUser =
          (attempt.userName || "").toLowerCase().includes(q) ||
          (attempt.userEmail || "").toLowerCase().includes(q);
        const matchTitle = (attempt.quizTitle || "").toLowerCase().includes(q);
        return matchUser || matchTitle;
      }
      return true;
    });
  }, [isAdmin, studentClassId, allQuizAttempts, studentAttempts, search]);

  // Admin: Open Create Quiz Modal
  const openCreateQuizModal = () => {
    setEditingQuiz(null);
    const initialClassId = selectedClassFilter !== "all" ? selectedClassFilter : classes[0]?.id || "";
    const initialSubject = subjects.find((s) => String(s.classId) === String(initialClassId));
    const initialChapter = initialSubject
      ? chapters.find((c) => String(c.subjectId) === String(initialSubject.id))
      : null;

    setQuizForm({
      classId: initialClassId,
      subjectId: initialSubject?.id || "",
      chapterId: initialChapter?.id || "",
      title: "",
      description: "Official Sindh Textbook Board Chapter Self-Assessment Exam.",
      timeLimitMinutes: 15,
      passingScore: 50,
      totalMarks: 5,
      startDate: "",
      endDate: "",
      questions: [
        {
          id: `q_${Date.now()}_1`,
          question: "",
          options: ["", "", "", ""],
          correctAnswer: 0,
          explanation: "",
        },
      ],
    });
    setIsQuizModalOpen(true);
  };

  // Admin: Open Edit Quiz Modal
  const openEditQuizModal = (quiz, e) => {
    e.stopPropagation();
    setEditingQuiz(quiz);
    setQuizForm({
      classId: quiz.classId || "",
      subjectId: quiz.subjectId || "",
      chapterId: quiz.chapterId || "",
      title: quiz.title || "",
      description: quiz.description || "",
      timeLimitMinutes: quiz.timeLimitMinutes || 15,
      passingScore: quiz.passingScore || 50,
      totalMarks: quiz.totalMarks || quiz.questions?.length || 5,
      startDate: quiz.startDate || "",
      endDate: quiz.endDate || "",
      questions:
        quiz.questions && quiz.questions.length > 0
          ? quiz.questions
          : [
              {
                id: `q_${Date.now()}`,
                question: "",
                options: ["", "", "", ""],
                correctAnswer: 0,
                explanation: "",
              },
            ],
    });
    setIsQuizModalOpen(true);
  };

  // Dynamic question manipulation
  const addQuestionField = () => {
    setQuizForm((prev) => ({
      ...prev,
      questions: [
        ...prev.questions,
        {
          id: `q_${Date.now()}_${prev.questions.length + 1}`,
          question: "",
          options: ["", "", "", ""],
          correctAnswer: 0,
          explanation: "",
        },
      ],
    }));
  };

  const removeQuestionField = (index) => {
    if (quizForm.questions.length <= 1) {
      toast.error("A quiz must have at least 1 question.");
      return;
    }
    setQuizForm((prev) => ({
      ...prev,
      questions: prev.questions.filter((_, i) => i !== index),
    }));
  };

  const updateQuestionText = (index, value) => {
    const updated = [...quizForm.questions];
    updated[index].question = value;
    setQuizForm((prev) => ({ ...prev, questions: updated }));
  };

  const updateOptionText = (qIndex, optIndex, value) => {
    const updated = [...quizForm.questions];
    updated[qIndex].options[optIndex] = value;
    setQuizForm((prev) => ({ ...prev, questions: updated }));
  };

  const updateCorrectAnswer = (qIndex, value) => {
    const updated = [...quizForm.questions];
    updated[qIndex].correctAnswer = Number(value);
    setQuizForm((prev) => ({ ...prev, questions: updated }));
  };

  const updateExplanation = (qIndex, value) => {
    const updated = [...quizForm.questions];
    updated[qIndex].explanation = value;
    setQuizForm((prev) => ({ ...prev, questions: updated }));
  };

  // Admin: Save Quiz Handler
  const handleSaveQuiz = async (e) => {
    e.preventDefault();
    if (!quizForm.title.trim()) {
      toast.error("Please provide a title for the quiz.");
      return;
    }
    if (!quizForm.classId) {
      toast.error("Please select a target class.");
      return;
    }
    if (!quizForm.subjectId) {
      toast.error("Please select a subject.");
      return;
    }
    if (quizForm.questions.length === 0) {
      toast.error("Please add at least one question.");
      return;
    }

    for (let i = 0; i < quizForm.questions.length; i++) {
      const q = quizForm.questions[i];
      if (!q.question.trim()) {
        toast.error(`Question ${i + 1} text cannot be empty.`);
        return;
      }
      const emptyOpt = q.options.some((opt) => !opt.trim());
      if (emptyOpt) {
        toast.error(`Please provide all 4 options for Question ${i + 1}.`);
        return;
      }
    }

    setIsSubmittingQuiz(true);
    try {
      const quizPayload = {
        title: quizForm.title.trim(),
        description: quizForm.description.trim(),
        classId: String(quizForm.classId),
        subjectId: String(quizForm.subjectId),
        chapterId: String(quizForm.chapterId || ""),
        timeLimitMinutes: Number(quizForm.timeLimitMinutes) || 15,
        passingScore: Number(quizForm.passingScore) || 50,
        totalMarks: Number(quizForm.totalMarks) || quizForm.questions.length,
        startDate: quizForm.startDate || null,
        endDate: quizForm.endDate || null,
        questions: quizForm.questions,
      };

      if (editingQuiz) {
        await updateQuiz(editingQuiz.id, quizPayload);
      } else {
        await addQuiz(quizPayload);
      }
      setIsQuizModalOpen(false);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmittingQuiz(false);
    }
  };

  // Admin: Delete Quiz Handler
  const handleDeleteQuiz = async (quizId, quizTitle, e) => {
    e.stopPropagation();
    if (window.confirm(`Are you sure you want to delete "${quizTitle}"? This cannot be undone.`)) {
      await deleteQuiz(quizId);
    }
  };

  // Student: Pre-Quiz Confirmation
  const handleInitiateQuiz = (quiz) => {
    const priorAttempt = studentAttempts.find(
      (a) => String(a.quizId) === String(quiz.id) && (user ? a.userId === user.uid : true)
    );
    setPreQuizModal({ quiz, priorAttempt });
  };

  // Student: Start Active Quiz
  const startActiveQuiz = (quiz) => {
    setPreQuizModal(null);
    setActiveQuiz(quiz);
    setCurrentQuestionIndex(0);
    setSelectedAnswers({});
    setMarkedForReview({});
    setQuizFinished(false);
    setQuizResult(null);
    setShowAnswerReview(false);

    const seconds = (quiz.timeLimitMinutes || 15) * 60;
    setTimeLeftSeconds(seconds);
    setInitialTimeSeconds(seconds);
    toast.success(`Exam session started! You have ${quiz.timeLimitMinutes || 15} minutes.`);
  };

  // Option selection
  const handleSelectOption = (qIdx, optIdx) => {
    setSelectedAnswers((prev) => ({
      ...prev,
      [qIdx]: optIdx,
    }));
  };

  const toggleMarkForReview = (idx) => {
    setMarkedForReview((prev) => ({
      ...prev,
      [idx]: !prev[idx],
    }));
  };

  // Auto-Submit on Timeout
  const handleAutoSubmit = () => {
    toast.error("⏰ Time expired! The examination has been auto-submitted.");
    executeSubmission(true);
  };

  // Execute Submission to Firestore
  const executeSubmission = async (isAuto = false) => {
    if (!activeQuiz) return;
    setConfirmSubmitOpen(false);

    const questions = activeQuiz.questions || [];
    let correctCount = 0;

    questions.forEach((q, idx) => {
      const selected = selectedAnswers[idx];
      if (selected !== undefined && Number(selected) === Number(q.correctAnswer)) {
        correctCount++;
      }
    });

    const totalQ = questions.length;
    const percentage = totalQ > 0 ? Math.round((correctCount / totalQ) * 100) : 0;
    const passingScore = activeQuiz.passingScore || 50;
    const passed = percentage >= passingScore;
    const timeSpent = initialTimeSeconds - timeLeftSeconds;
    const minutesTaken = Math.floor(timeSpent / 60);
    const secondsTaken = timeSpent % 60;

    const submissionData = {
      userId: user?.uid || "guest_student",
      userEmail: user?.email || userProfile?.email || "student@lms.academy",
      userName: userProfile?.name || user?.displayName || "Student",
      quizId: activeQuiz.id,
      quizTitle: activeQuiz.title,
      chapterId: activeQuiz.chapterId || "",
      subjectId: activeQuiz.subjectId || "",
      classId: activeQuiz.classId || studentClassId || "",
      score: correctCount,
      totalQuestions: totalQ,
      percentage,
      passed,
      selectedAnswers,
      autoSubmitted: isAuto,
      timeTakenSeconds: timeSpent,
      timeTakenString: `${minutesTaken}m ${secondsTaken}s`,
      submittedAtString: new Date().toLocaleString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    try {
      await submitQuizAttempt(submissionData);
      setQuizFinished(true);
      setQuizResult(submissionData);
      if (passed) {
        toast.success(`🎉 Passed! You achieved ${percentage}%.`);
      } else {
        toast.error(`Exam finished: ${percentage}%. You need ${passingScore}% to pass.`);
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to submit quiz attempt. Please try again.");
    }
  };

  // Helper formatting for seconds to MM:SS
  const formatTime = (secs) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6 animate-in fade-in duration-300">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs px-2.5 py-0.5 rounded-full font-bold bg-primary/10 text-primary border border-primary/20">
              Sindh Textbook Board • Assessment Center
            </span>
            {!isAdmin && userProfile?.className && (
              <span className="text-xs px-2.5 py-0.5 rounded-full font-semibold bg-secondary text-secondary-foreground border border-border">
                {userProfile.className}
              </span>
            )}
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-foreground mt-1.5">
            {isAdmin ? "Institutional Quizzes & Tests" : "My Chapter Quizzes"}
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
            {isAdmin
              ? "Create, manage, and inspect chapter assessments across Classes 8 through 12."
              : "Complete assigned online quizzes for your enrolled class and review your scores."}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2.5">
          {isAdmin && (
            <Button
              onClick={openCreateQuizModal}
              className="text-xs h-9 rounded-xl font-bold bg-primary text-primary-foreground shadow-sm shadow-primary/20 gap-1.5"
            >
              <Plus className="w-4 h-4" /> Create New Quiz
            </Button>
          )}

          <Button
            variant="outline"
            onClick={() => navigate("/classes")}
            className="text-xs h-9 rounded-xl font-semibold gap-1.5"
          >
            <GraduationCap className="w-4 h-4 text-primary" /> Browse Curriculum
          </Button>
        </div>
      </div>

      {/* View Switcher: Quizzes vs Results */}
      <div className="flex items-center gap-2 border-b border-border/70 pb-3">
        <button
          onClick={() => setActiveTab("quizzes")}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === "quizzes"
              ? "bg-gradient-to-r from-teal-600 via-teal-500 to-cyan-500 text-white shadow-sm"
              : "text-muted-foreground hover:text-foreground hover:bg-muted/60"
          }`}
        >
          <HelpCircle className="w-4 h-4" />
          {isAdmin ? "All Published Quizzes" : "My Class Quizzes"}
          <span className="ml-1 px-2 py-0.5 rounded-full text-[10px] bg-black/20 text-white font-mono">
            {filteredQuizzes.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab("results")}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === "results"
              ? "bg-gradient-to-r from-teal-600 via-teal-500 to-cyan-500 text-white shadow-sm"
              : "text-muted-foreground hover:text-foreground hover:bg-muted/60"
          }`}
        >
          <Trophy className="w-4 h-4" />
          {isAdmin ? "Student Submissions & Scorecards" : "My Quiz Results"}
          <span className="ml-1 px-2 py-0.5 rounded-full text-[10px] bg-black/20 text-white font-mono">
            {displayAttempts.length}
          </span>
        </button>
      </div>

      {/* Toolbar: Filters & Search */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-3.5 rounded-2xl bg-card border border-border/80 shadow-sm">
        <div className="relative flex-1 w-full max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder={
              activeTab === "quizzes"
                ? "Search quizzes by title or subject..."
                : "Search submissions by student name or quiz..."
            }
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 h-9 text-xs rounded-xl"
          />
        </div>

        <div className="flex items-center gap-2.5 w-full sm:w-auto flex-wrap">
          {/* Admin Class Filter */}
          {isAdmin && (
            <select
              value={selectedClassFilter}
              onChange={(e) => setSelectedClassFilter(e.target.value)}
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

          {/* Subject Filter */}
          <select
            value={selectedSubjectFilter}
            onChange={(e) => setSelectedSubjectFilter(e.target.value)}
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

      {/* =========================================================================
          TAB 1: QUIZZES GRID
         ========================================================================= */}
      {activeTab === "quizzes" && (
        <>
          {filteredQuizzes.length === 0 ? (
            <div className="text-center py-16 px-4 bg-card border border-dashed border-border rounded-2xl space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mx-auto">
                <HelpCircle className="w-7 h-7" />
              </div>
              <div>
                <h3 className="text-base font-bold text-foreground">No quizzes available</h3>
                <p className="text-xs text-muted-foreground max-w-md mx-auto mt-1">
                  {!isAdmin
                    ? "There are currently no active quizzes assigned for your class. Check back later or notify your instructor."
                    : search
                    ? "No quizzes match your search query."
                    : "No quizzes have been created yet. Click 'Create New Quiz' above to add your first chapter test."}
                </p>
              </div>

              {isAdmin && (
                <Button
                  onClick={openCreateQuizModal}
                  size="sm"
                  className="rounded-xl font-bold text-xs gap-1.5"
                >
                  <Plus className="w-4 h-4" /> Add First Quiz
                </Button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredQuizzes.map((quiz) => {
                const matchSubject = subjects.find((s) => String(s.id) === String(quiz.subjectId));
                const matchClass = classes.find((c) => String(c.id) === String(quiz.classId));

                // Student attempt status
                const userAttempt = studentAttempts.find(
                  (a) => String(a.quizId) === String(quiz.id) && (user ? a.userId === user.uid : true)
                );

                return (
                  <div
                    key={quiz.id}
                    className="group p-5 rounded-2xl bg-card border border-border/80 hover:border-primary/50 hover:shadow-lg transition-all duration-200 flex flex-col justify-between relative overflow-hidden"
                  >
                    <div className="space-y-3">
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-md bg-primary/10 text-primary border border-primary/20">
                            {matchSubject?.name || "Subject"}
                          </span>
                          <span className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-muted text-muted-foreground">
                            {matchClass?.name || quiz.classId || "Class"}
                          </span>
                        </div>

                        {userAttempt ? (
                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 ${
                              userAttempt.passed
                                ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20"
                                : "bg-destructive/10 text-destructive border border-destructive/20"
                            }`}
                          >
                            <Trophy className="w-3 h-3" /> {userAttempt.percentage}%
                          </span>
                        ) : (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-500/20">
                            New Test
                          </span>
                        )}
                      </div>

                      <h3 className="font-bold text-sm sm:text-base text-foreground group-hover:text-primary transition-colors line-clamp-1">
                        {quiz.title}
                      </h3>

                      <p className="text-xs text-muted-foreground line-clamp-2">
                        {quiz.description || "Sindh Board official chapter multiple choice self-assessment."}
                      </p>

                      <div className="flex items-center gap-3 pt-2 text-[11px] text-muted-foreground border-t border-border/60">
                        <span className="flex items-center gap-1 font-semibold text-foreground">
                          <HelpCircle className="w-3.5 h-3.5 text-primary" />
                          {quiz.questions?.length || 5} Questions
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1 font-semibold text-foreground">
                          <Clock className="w-3.5 h-3.5 text-cyan-500" />
                          {quiz.timeLimitMinutes || 15} Mins
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1 font-semibold text-foreground">
                          <Trophy className="w-3.5 h-3.5 text-amber-500" />
                          Pass: {quiz.passingScore || 50}%
                        </span>
                      </div>
                    </div>

                    <div className="mt-4 pt-3 border-t border-border/60 flex items-center justify-between gap-2">
                      <Button
                        size="sm"
                        onClick={() => handleInitiateQuiz(quiz)}
                        className="text-xs font-bold rounded-xl h-8 gap-1.5 flex-1 shadow-xs"
                      >
                        <PlayCircle className="w-3.5 h-3.5" />
                        {userAttempt ? "Retake Exam" : "Start Assessment"}
                      </Button>

                      {isAdmin && (
                        <div className="flex items-center gap-1">
                          <button
                            onClick={(e) => openEditQuizModal(quiz, e)}
                            className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted"
                            title="Edit Quiz"
                          >
                            <Pencil className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={(e) => handleDeleteQuiz(quiz.id, quiz.title, e)}
                            className="p-1.5 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                            title="Delete Quiz"
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
        </>
      )}

      {/* =========================================================================
          TAB 2: SUBMISSIONS & SCORECARDS
         ========================================================================= */}
      {activeTab === "results" && (
        <div className="space-y-4">
          {displayAttempts.length === 0 ? (
            <div className="text-center py-16 px-4 bg-card border border-dashed border-border rounded-2xl space-y-3">
              <Trophy className="w-12 h-12 text-muted-foreground/60 mx-auto" />
              <h3 className="text-base font-bold text-foreground">No submissions found</h3>
              <p className="text-xs text-muted-foreground">
                {search
                  ? "No submissions match your search query."
                  : "No students have submitted quiz attempts yet."}
              </p>
            </div>
          ) : (
            <div className="bg-card border border-border/80 rounded-2xl overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs sm:text-sm">
                  <thead className="bg-muted/30 text-muted-foreground text-[11px] uppercase tracking-wider border-b border-border font-bold">
                    <tr>
                      <th className="px-5 py-3.5">Student</th>
                      <th className="px-4 py-3.5">Class</th>
                      <th className="px-5 py-3.5">Quiz</th>
                      <th className="px-4 py-3.5">Score</th>
                      <th className="px-4 py-3.5">Percentage</th>
                      <th className="px-4 py-3.5">Status</th>
                      <th className="px-4 py-3.5">Submitted</th>
                      <th className="px-4 py-3.5 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/60">
                    {displayAttempts.map((attempt, idx) => {
                      const matchClass = classes.find((c) => String(c.id) === String(attempt.classId));

                      return (
                        <tr key={attempt.id || idx} className="hover:bg-muted/20 transition-colors">
                          <td className="px-5 py-3.5 font-semibold text-foreground">
                            <div>{attempt.userName || "Student"}</div>
                            <div className="text-[11px] text-muted-foreground font-normal">
                              {attempt.userEmail}
                            </div>
                          </td>
                          <td className="px-4 py-3.5 text-xs text-muted-foreground font-medium">
                            {matchClass?.name || attempt.classId || "Class"}
                          </td>
                          <td className="px-5 py-3.5 font-medium text-foreground">
                            {attempt.quizTitle}
                          </td>
                          <td className="px-4 py-3.5 font-mono font-bold">
                            {attempt.score} / {attempt.totalQuestions}
                          </td>
                          <td className="px-4 py-3.5 font-bold">
                            {attempt.percentage}%
                          </td>
                          <td className="px-4 py-3.5">
                            <span
                              className={`inline-flex items-center gap-1 text-[11px] px-2.5 py-0.5 rounded-full font-bold border ${
                                attempt.passed
                                  ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20"
                                  : "bg-destructive/10 text-destructive border-destructive/20"
                              }`}
                            >
                              {attempt.passed ? (
                                <>
                                  <CheckCircle2 className="w-3 h-3" /> Pass
                                </>
                              ) : (
                                <>
                                  <XCircle className="w-3 h-3" /> Fail
                                </>
                              )}
                            </span>
                          </td>
                          <td className="px-4 py-3.5 text-xs text-muted-foreground">
                            {attempt.submittedAtString || "Recorded"}
                          </td>
                          <td className="px-4 py-3.5 text-right">
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => setInspectAttemptModal(attempt)}
                              className="text-xs h-8 px-2.5 rounded-xl text-primary hover:text-primary font-bold gap-1"
                            >
                              <Eye className="w-3.5 h-3.5" /> Answers
                            </Button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Pre-Quiz Confirmation Modal */}
      <Dialog open={!!preQuizModal} onOpenChange={(open) => !open && setPreQuizModal(null)}>
        <DialogContent className="max-w-md rounded-2xl">
          {preQuizModal && (
            <div className="space-y-4">
              <DialogHeader>
                <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mb-1">
                  <HelpCircle className="w-6 h-6" />
                </div>
                <DialogTitle className="text-xl font-black text-foreground">
                  {preQuizModal.quiz.title}
                </DialogTitle>
                <p className="text-xs text-muted-foreground">
                  Sindh Textbook Board Virtual Examination Mode
                </p>
              </DialogHeader>

              <div className="p-4 rounded-xl bg-muted/40 border border-border space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Questions:</span>
                  <span className="font-bold text-foreground">
                    {preQuizModal.quiz.questions?.length || 5} MCQs
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Time Limit:</span>
                  <span className="font-bold text-foreground">
                    {preQuizModal.quiz.timeLimitMinutes || 15} Minutes
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Passing Score:</span>
                  <span className="font-bold text-foreground">
                    {preQuizModal.quiz.passingScore || 50}%
                  </span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-700 dark:text-amber-300 flex items-start gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>
                  The countdown begins on start. Answers will automatically submit if the timer reaches 0:00.
                </span>
              </div>

              <DialogFooter className="gap-2 sm:gap-0">
                <Button variant="outline" onClick={() => setPreQuizModal(null)} className="rounded-xl text-xs">
                  Cancel
                </Button>
                <Button
                  onClick={() => startActiveQuiz(preQuizModal.quiz)}
                  className="rounded-xl text-xs font-bold gap-1.5 shadow-sm"
                >
                  <PlayCircle className="w-4 h-4" /> Start Examination
                </Button>
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Active Exam Overlay Platform */}
      {activeQuiz && (
        <div className="fixed inset-0 z-50 bg-background/95 backdrop-blur-md flex flex-col justify-between overflow-y-auto p-4 sm:p-6 lg:p-8 animate-in fade-in duration-200">
          {/* Exam Header */}
          <div className="max-w-4xl w-full mx-auto flex items-center justify-between border-b border-border pb-4">
            <div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20">
                Live Virtual Examination
              </span>
              <h2 className="text-lg sm:text-xl font-black text-foreground mt-1">
                {activeQuiz.title}
              </h2>
            </div>

            {!quizFinished && (
              <div
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl border text-sm font-mono font-bold shadow-sm ${
                  timeLeftSeconds < 120
                    ? "bg-destructive/10 text-destructive border-destructive/30 animate-pulse"
                    : "bg-card text-foreground border-border"
                }`}
              >
                <Clock className="w-4 h-4 text-primary" />
                <span>{formatTime(timeLeftSeconds)}</span>
              </div>
            )}
          </div>

          {/* Exam Body */}
          <div className="max-w-3xl w-full mx-auto my-auto py-6">
            {!quizFinished ? (
              <div className="space-y-6">
                {/* Question Navigator */}
                <div className="p-3 rounded-2xl bg-card border border-border/80 shadow-sm space-y-2">
                  <div className="flex items-center justify-between text-[11px] text-muted-foreground px-1">
                    <span className="font-bold uppercase tracking-wider">Question Navigator</span>
                    <div className="flex items-center gap-3">
                      <span className="flex items-center gap-1">
                        <span className="w-2 h-2 rounded-full bg-emerald-500" /> Answered (
                        {Object.keys(selectedAnswers).length})
                      </span>
                      <span className="flex items-center gap-1">
                        <span className="w-2 h-2 rounded-full bg-amber-500" /> Flagged (
                        {Object.values(markedForReview).filter(Boolean).length})
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-1.5">
                    {activeQuiz.questions.map((_, idx) => {
                      const isCurr = idx === currentQuestionIndex;
                      const hasAns = selectedAnswers[idx] !== undefined;
                      const isFlag = markedForReview[idx];

                      let cName = "bg-muted/60 text-muted-foreground hover:bg-muted";
                      if (isCurr) {
                        cName = "bg-primary text-primary-foreground font-black ring-2 ring-primary/30";
                      } else if (isFlag) {
                        cName = "bg-amber-500 text-white font-bold";
                      } else if (hasAns) {
                        cName = "bg-emerald-600 text-white font-bold";
                      }

                      return (
                        <button
                          key={idx}
                          onClick={() => setCurrentQuestionIndex(idx)}
                          className={`w-8 h-8 rounded-xl text-xs font-semibold flex items-center justify-center transition-all ${cName}`}
                        >
                          {idx + 1}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Active Question Card */}
                {activeQuiz.questions[currentQuestionIndex] && (
                  <div className="p-6 sm:p-8 rounded-3xl bg-card border border-border/80 shadow-sm space-y-6">
                    <div className="flex items-center justify-between pb-3 border-b border-border/60">
                      <span className="px-2.5 py-1 rounded-lg bg-primary/10 text-primary font-bold text-xs">
                        Question {currentQuestionIndex + 1} of {activeQuiz.questions.length}
                      </span>

                      <Button
                        variant={markedForReview[currentQuestionIndex] ? "default" : "outline"}
                        size="sm"
                        onClick={() => toggleMarkForReview(currentQuestionIndex)}
                        className={`gap-1.5 text-xs h-8 rounded-xl ${
                          markedForReview[currentQuestionIndex]
                            ? "bg-amber-500 hover:bg-amber-600 text-white border-transparent font-bold"
                            : "text-muted-foreground"
                        }`}
                      >
                        <Flag className="w-3.5 h-3.5" />
                        {markedForReview[currentQuestionIndex] ? "Flagged for Review" : "Mark for Review"}
                      </Button>
                    </div>

                    <div className="text-base sm:text-lg font-bold text-foreground leading-relaxed">
                      {activeQuiz.questions[currentQuestionIndex].question}
                    </div>

                    <div className="space-y-3 pt-2">
                      {activeQuiz.questions[currentQuestionIndex].options.map((opt, optIdx) => {
                        const isSelected = selectedAnswers[currentQuestionIndex] === optIdx;

                        return (
                          <div
                            key={optIdx}
                            onClick={() => handleSelectOption(currentQuestionIndex, optIdx)}
                            className={`p-4 rounded-2xl border transition-all duration-150 cursor-pointer flex items-center justify-between ${
                              isSelected
                                ? "border-primary bg-primary/10 text-foreground font-bold shadow-sm ring-1 ring-primary"
                                : "border-border/80 bg-card hover:border-border hover:bg-muted/30 text-foreground"
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              <div
                                className={`w-7 h-7 rounded-xl flex items-center justify-center text-xs font-bold ${
                                  isSelected
                                    ? "bg-primary text-primary-foreground"
                                    : "bg-muted text-muted-foreground"
                                }`}
                              >
                                {String.fromCharCode(65 + optIdx)}
                              </div>
                              <span className="text-xs sm:text-sm">{opt}</span>
                            </div>

                            <div
                              className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                                isSelected ? "border-primary bg-primary" : "border-muted-foreground/40"
                              }`}
                            >
                              {isSelected && <Check className="w-3 h-3 text-primary-foreground" />}
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    <div className="pt-4 border-t border-border/60 flex items-center justify-between">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentQuestionIndex((p) => Math.max(0, p - 1))}
                        disabled={currentQuestionIndex === 0}
                        className="gap-1.5 text-xs h-9 rounded-xl font-semibold"
                      >
                        <ChevronLeft className="w-4 h-4" /> Previous
                      </Button>

                      <div className="flex items-center gap-2">
                        {currentQuestionIndex === activeQuiz.questions.length - 1 ? (
                          <Button
                            size="sm"
                            onClick={() => setConfirmSubmitOpen(true)}
                            className="gap-1.5 text-xs font-bold h-9 rounded-xl shadow-sm"
                          >
                            Review & Submit <Send className="w-3.5 h-3.5" />
                          </Button>
                        ) : (
                          <Button
                            size="sm"
                            onClick={() => setCurrentQuestionIndex((p) => p + 1)}
                            className="gap-1.5 text-xs font-bold h-9 rounded-xl shadow-sm"
                          >
                            Next Question <ChevronRight className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              /* Results Scorecard */
              quizResult && (
                <div className="p-6 sm:p-8 rounded-3xl bg-card border border-border/80 text-center space-y-6 shadow-xl shadow-black/5 dark:shadow-black/30 animate-in fade-in duration-300">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-primary/10 text-primary border border-primary/20">
                    <Sparkles className="w-3.5 h-3.5" /> Official Result Card
                  </div>

                  <h1 className="text-2xl sm:text-3xl font-black text-foreground">
                    {activeQuiz.title}
                  </h1>

                  <div
                    className={`p-6 rounded-2xl border ${
                      quizResult.passed
                        ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-600 dark:text-emerald-400"
                        : "bg-destructive/10 border-destructive/30 text-destructive"
                    }`}
                  >
                    <div className="text-5xl font-black">{quizResult.percentage}%</div>
                    <div className="text-sm font-bold uppercase tracking-wider mt-1">
                      {quizResult.passed ? "Examination Passed" : "Needs Revision (Fail)"}
                    </div>
                    <p className="text-xs mt-1 opacity-80">
                      Score: {quizResult.score} / {quizResult.totalQuestions} questions correct.
                    </p>
                  </div>

                  <div className="grid grid-cols-3 gap-3 text-xs">
                    <div className="p-3 rounded-xl bg-muted/40 border border-border">
                      <div className="text-muted-foreground font-semibold">Total Marks</div>
                      <div className="text-base font-black text-foreground mt-0.5">
                        {quizResult.score} / {quizResult.totalQuestions}
                      </div>
                    </div>
                    <div className="p-3 rounded-xl bg-muted/40 border border-border">
                      <div className="text-muted-foreground font-semibold">Time Spent</div>
                      <div className="text-base font-black text-foreground mt-0.5">
                        {quizResult.timeTakenString || "Completed"}
                      </div>
                    </div>
                    <div className="p-3 rounded-xl bg-muted/40 border border-border">
                      <div className="text-muted-foreground font-semibold">Submission</div>
                      <div className="text-base font-black text-foreground mt-0.5">
                        {quizResult.autoSubmitted ? "Auto Expired" : "Manual"}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-center gap-3 pt-2">
                    <Button
                      onClick={() => setShowAnswerReview((prev) => !prev)}
                      variant="outline"
                      className="text-xs font-bold rounded-xl h-10 gap-1.5"
                    >
                      <Eye className="w-4 h-4 text-primary" />
                      {showAnswerReview ? "Hide Answer Key" : "Review Answers"}
                    </Button>
                    <Button
                      onClick={() => setActiveQuiz(null)}
                      className="text-xs font-bold rounded-xl h-10"
                    >
                      Close & Return
                    </Button>
                  </div>

                  {showAnswerReview && (
                    <div className="space-y-3 pt-4 text-left border-t border-border">
                      {activeQuiz.questions.map((q, idx) => {
                        const studentAns = selectedAnswers[idx];
                        const isCorrect = studentAns !== undefined && Number(studentAns) === Number(q.correctAnswer);

                        return (
                          <div
                            key={idx}
                            className={`p-4 rounded-xl border ${
                              isCorrect ? "border-emerald-500/30" : "border-destructive/30"
                            } space-y-2`}
                          >
                            <div className="flex items-center justify-between text-xs font-bold">
                              <span>Question {idx + 1}</span>
                              <span className={isCorrect ? "text-emerald-500" : "text-destructive"}>
                                {isCorrect ? "Correct" : "Incorrect"}
                              </span>
                            </div>
                            <p className="text-xs text-foreground font-semibold">{q.question}</p>
                            <div className="text-[11px] text-muted-foreground">
                              Correct answer: <span className="text-foreground font-bold">{q.options[q.correctAnswer]}</span>
                            </div>
                            {q.explanation && (
                              <div className="text-[11px] text-primary italic">Note: {q.explanation}</div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              )
            )}
          </div>

          {/* Submit Confirmation Dialog */}
          <Dialog open={confirmSubmitOpen} onOpenChange={setConfirmSubmitOpen}>
            <DialogContent className="sm:max-w-md rounded-2xl">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <AlertCircle className="w-5 h-5 text-primary" />
                  Submit Assessment?
                </DialogTitle>
              </DialogHeader>

              <div className="py-3 text-xs text-muted-foreground space-y-3">
                <p>
                  You have answered {Object.keys(selectedAnswers).length} of {activeQuiz.questions.length} questions.
                  Are you ready to finalize your submission?
                </p>
              </div>

              <DialogFooter className="gap-2 sm:gap-0">
                <Button variant="outline" onClick={() => setConfirmSubmitOpen(false)} className="rounded-xl text-xs">
                  Continue Testing
                </Button>
                <Button onClick={() => executeSubmission(false)} className="rounded-xl text-xs font-bold">
                  Yes, Submit Now
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      )}

      {/* Admin Add/Edit Quiz Modal */}
      <Dialog open={isQuizModalOpen} onOpenChange={setIsQuizModalOpen}>
        <DialogContent className="max-w-2xl rounded-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <HelpCircle className="w-5 h-5 text-primary" />
              {editingQuiz ? "Edit Quiz" : "Create New Quiz"}
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSaveQuiz} className="space-y-4 py-2 text-xs">
            <div className="space-y-1">
              <Label className="text-xs font-bold">Quiz Title</Label>
              <Input
                placeholder="e.g. Matric Physics Chapter 1 Examination"
                value={quizForm.title}
                onChange={(e) => setQuizForm({ ...quizForm, title: e.target.value })}
                className="h-9 text-xs rounded-xl"
                required
              />
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div className="space-y-1">
                <Label className="text-xs font-bold">Class</Label>
                <select
                  value={quizForm.classId}
                  onChange={(e) => setQuizForm({ ...quizForm, classId: e.target.value, subjectId: "", chapterId: "" })}
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
                  value={quizForm.subjectId}
                  onChange={(e) => setQuizForm({ ...quizForm, subjectId: e.target.value, chapterId: "" })}
                  className="w-full h-9 rounded-xl border border-input bg-background px-3 text-xs text-foreground focus:outline-none"
                  required
                >
                  <option value="" disabled>Select Subject...</option>
                  {formSubjects.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <Label className="text-xs font-bold">Chapter (Optional)</Label>
                <select
                  value={quizForm.chapterId}
                  onChange={(e) => setQuizForm({ ...quizForm, chapterId: e.target.value })}
                  className="w-full h-9 rounded-xl border border-input bg-background px-3 text-xs text-foreground focus:outline-none"
                >
                  <option value="">General / Entire Syllabus</option>
                  {formChapters.map((ch) => (
                    <option key={ch.id} value={ch.id}>
                      Ch {ch.chapterNumber}: {ch.title}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label className="text-xs font-bold">Time Limit (Minutes)</Label>
                <Input
                  type="number"
                  min={1}
                  max={180}
                  value={quizForm.timeLimitMinutes}
                  onChange={(e) => setQuizForm({ ...quizForm, timeLimitMinutes: e.target.value })}
                  className="h-9 text-xs rounded-xl"
                  required
                />
              </div>

              <div className="space-y-1">
                <Label className="text-xs font-bold">Passing Score (%)</Label>
                <Input
                  type="number"
                  min={10}
                  max={100}
                  value={quizForm.passingScore}
                  onChange={(e) => setQuizForm({ ...quizForm, passingScore: e.target.value })}
                  className="h-9 text-xs rounded-xl"
                  required
                />
              </div>
            </div>

            <div className="space-y-1">
              <Label className="text-xs font-bold">Description / Syllabus Notes</Label>
              <Textarea
                rows={2}
                placeholder="Instructions for students..."
                value={quizForm.description}
                onChange={(e) => setQuizForm({ ...quizForm, description: e.target.value })}
                className="text-xs rounded-xl"
              />
            </div>

            {/* Questions Builder */}
            <div className="space-y-4 pt-2 border-t border-border">
              <div className="flex items-center justify-between">
                <span className="font-black text-sm text-foreground">
                  Questions ({quizForm.questions.length})
                </span>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addQuestionField}
                  className="text-xs rounded-xl h-8 gap-1"
                >
                  <Plus className="w-3.5 h-3.5 text-primary" /> Add Question
                </Button>
              </div>

              {quizForm.questions.map((q, qIdx) => (
                <div
                  key={q.id || qIdx}
                  className="p-4 rounded-2xl bg-muted/30 border border-border/80 space-y-3 relative"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-primary">
                      Question #{qIdx + 1}
                    </span>
                    {quizForm.questions.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeQuestionField(qIdx)}
                        className="text-muted-foreground hover:text-destructive text-xs flex items-center gap-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" /> Remove
                      </button>
                    )}
                  </div>

                  <Input
                    placeholder="Enter question prompt here..."
                    value={q.question}
                    onChange={(e) => updateQuestionText(qIdx, e.target.value)}
                    className="h-9 text-xs rounded-xl bg-background"
                    required
                  />

                  <div className="space-y-2 pt-1">
                    <span className="text-[11px] font-semibold text-muted-foreground">
                      Options &amp; Correct Answer Selection:
                    </span>

                    {q.options.map((opt, optIdx) => (
                      <div key={optIdx} className="flex items-center gap-2">
                        <input
                          type="radio"
                          name={`correct_${qIdx}`}
                          checked={q.correctAnswer === optIdx}
                          onChange={() => updateCorrectAnswer(qIdx, optIdx)}
                          className="w-4 h-4 text-primary"
                          title="Mark as correct answer"
                        />
                        <span className="text-xs font-mono font-bold w-4 text-muted-foreground">
                          {String.fromCharCode(65 + optIdx)}
                        </span>
                        <Input
                          placeholder={`Option ${String.fromCharCode(65 + optIdx)}...`}
                          value={opt}
                          onChange={(e) => updateOptionText(qIdx, optIdx, e.target.value)}
                          className="h-8 text-xs rounded-lg flex-1 bg-background"
                          required
                        />
                      </div>
                    ))}
                  </div>

                  <Input
                    placeholder="Syllabus reference / explanation..."
                    value={q.explanation || ""}
                    onChange={(e) => updateExplanation(qIdx, e.target.value)}
                    className="h-8 text-xs rounded-lg bg-background"
                  />
                </div>
              ))}
            </div>

            <DialogFooter className="pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsQuizModalOpen(false)}
                className="text-xs rounded-xl"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSubmittingQuiz}
                className="text-xs font-bold rounded-xl"
              >
                {isSubmittingQuiz ? "Saving..." : editingQuiz ? "Save Changes" : "Publish Quiz"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Inspect Attempt Modal for Admin / Review */}
      <Dialog open={!!inspectAttemptModal} onOpenChange={(open) => !open && setInspectAttemptModal(null)}>
        <DialogContent className="max-w-xl rounded-2xl max-h-[85vh] overflow-y-auto">
          {inspectAttemptModal && (
            <div className="space-y-4">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <Trophy className="w-5 h-5 text-primary" />
                  Submission Details — {inspectAttemptModal.userName}
                </DialogTitle>
                <p className="text-xs text-muted-foreground">
                  {inspectAttemptModal.quizTitle} • {inspectAttemptModal.userEmail}
                </p>
              </DialogHeader>

              <div className="grid grid-cols-3 gap-2.5 text-center text-xs">
                <div className="p-3 rounded-xl bg-muted/40 border border-border">
                  <div className="text-muted-foreground">Score</div>
                  <div className="text-base font-black text-foreground mt-0.5">
                    {inspectAttemptModal.score} / {inspectAttemptModal.totalQuestions}
                  </div>
                </div>
                <div className="p-3 rounded-xl bg-muted/40 border border-border">
                  <div className="text-muted-foreground">Percentage</div>
                  <div className="text-base font-black text-foreground mt-0.5">
                    {inspectAttemptModal.percentage}%
                  </div>
                </div>
                <div className="p-3 rounded-xl bg-muted/40 border border-border">
                  <div className="text-muted-foreground">Status</div>
                  <div className="text-sm font-bold text-foreground mt-1">
                    {inspectAttemptModal.passed ? "PASSED" : "FAILED"}
                  </div>
                </div>
              </div>

              <div className="text-xs space-y-2 border-t border-border pt-3">
                <div className="font-bold text-foreground">Answers Breakdown:</div>
                {inspectAttemptModal.selectedAnswers ? (
                  <div className="space-y-1.5 font-mono text-[11px]">
                    {Object.entries(inspectAttemptModal.selectedAnswers).map(([qIdx, optIdx]) => (
                      <div key={qIdx} className="p-2 rounded-lg bg-muted/30 flex justify-between">
                        <span>Question #{Number(qIdx) + 1}</span>
                        <span className="font-bold text-foreground">
                          Option Selected: {String.fromCharCode(65 + Number(optIdx))}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground">No detailed option log recorded.</p>
                )}
              </div>

              <DialogFooter>
                <Button onClick={() => setInspectAttemptModal(null)} className="text-xs font-bold rounded-xl">
                  Close
                </Button>
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
