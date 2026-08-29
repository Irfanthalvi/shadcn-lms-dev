import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useLms } from "@/context/LmsContext";
import { useAuth } from "@/context/AuthContext";
import {
  ChevronLeft,
  ChevronRight,
  Plus,
  Pencil,
  Trash2,
  PlayCircle,
  Clock,
  Trophy,
  CheckCircle2,
  XCircle,
  AlertCircle,
  HelpCircle,
  FileQuestion,
  RotateCcw,
  BookOpen,
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
import { toast } from "sonner";

export default function ClassQuizPage() {
  const { classId, subjectId, chapterId } = useParams();
  const navigate = useNavigate();
  const {
    classes,
    subjects,
    chapters,
    quizzes,
    addQuiz,
    updateQuiz,
    deleteQuiz,
    submitQuizAttempt,
  } = useLms();
  const { user, userProfile, isAdmin } = useAuth();

  const currentClass = classes.find((c) => String(c.id) === String(classId));
  const currentSubject = subjects.find((s) => String(s.id) === String(subjectId));
  const currentChapter = chapters.find((c) => String(c.id) === String(chapterId));
  const chapterQuizzes = quizzes.filter((q) => String(q.chapterId) === String(chapterId));

  // Admin Modal State: Create / Edit Quiz
  const [isQuizModalOpen, setIsQuizModalOpen] = useState(false);
  const [editingQuiz, setEditingQuiz] = useState(null);
  const [quizForm, setQuizForm] = useState({
    title: "",
    timeLimitMinutes: 15,
    passingScore: 50,
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

  // Student Active Quiz State
  const [activeQuiz, setActiveQuiz] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [timeLeftSeconds, setTimeLeftSeconds] = useState(0);
  const [quizFinished, setQuizFinished] = useState(false);
  const [quizResult, setQuizResult] = useState(null);
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

  // Admin: Open Create Modal
  const openAddQuizModal = () => {
    setEditingQuiz(null);
    setQuizForm({
      title: `${currentChapter?.title || "Chapter"} Assessment`,
      timeLimitMinutes: 15,
      passingScore: 50,
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

  // Admin: Open Edit Modal
  const openEditQuizModal = (quiz, e) => {
    e.stopPropagation();
    setEditingQuiz(quiz);
    setQuizForm({
      title: quiz.title || "",
      timeLimitMinutes: quiz.timeLimitMinutes || 15,
      passingScore: quiz.passingScore || 50,
      questions: quiz.questions && quiz.questions.length > 0
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

  // Admin: Delete Quiz
  const handleDeleteQuiz = async (quizId, quizTitle, e) => {
    e.stopPropagation();
    if (window.confirm(`Are you sure you want to delete quiz "${quizTitle}"?`)) {
      await deleteQuiz(quizId);
    }
  };

  // Admin Question Builder Helpers
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
      toast.warning("A quiz must have at least 1 question.");
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

  const handleSaveQuiz = async (e) => {
    e.preventDefault();
    if (!quizForm.title.trim()) {
      toast.error("Please provide a quiz title.");
      return;
    }

    // Validate questions
    for (let i = 0; i < quizForm.questions.length; i++) {
      const q = quizForm.questions[i];
      if (!q.question.trim()) {
        toast.error(`Question ${i + 1} text cannot be empty.`);
        return;
      }
      if (q.options.some((opt) => !opt.trim())) {
        toast.error(`All 4 options for Question ${i + 1} must be filled.`);
        return;
      }
    }

    setIsSubmittingQuiz(true);
    try {
      if (editingQuiz) {
        await updateQuiz(editingQuiz.id, {
          title: quizForm.title.trim(),
          timeLimitMinutes: Number(quizForm.timeLimitMinutes) || 15,
          totalMarks: quizForm.questions.length,
          passingScore: Number(quizForm.passingScore) || 50,
          questions: quizForm.questions,
        });
      } else {
        await addQuiz({
          classId: String(classId),
          subjectId: String(subjectId),
          chapterId: String(chapterId),
          title: quizForm.title.trim(),
          timeLimitMinutes: Number(quizForm.timeLimitMinutes) || 15,
          totalMarks: quizForm.questions.length,
          passingScore: Number(quizForm.passingScore) || 50,
          questions: quizForm.questions,
        });
      }
      setIsQuizModalOpen(false);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmittingQuiz(false);
    }
  };

  // Student: Start Quiz
  const handleStartQuiz = (quiz) => {
    if (!quiz.questions || quiz.questions.length === 0) {
      toast.info("This quiz does not have any questions yet.");
      return;
    }
    setActiveQuiz(quiz);
    setCurrentQuestionIndex(0);
    setSelectedAnswers({});
    setTimeLeftSeconds((quiz.timeLimitMinutes || 15) * 60);
    setQuizFinished(false);
    setQuizResult(null);
  };

  const handleSelectOption = (questionIndex, optionIndex) => {
    if (quizFinished) return;
    setSelectedAnswers((prev) => ({
      ...prev,
      [questionIndex]: optionIndex,
    }));
  };

  const handleAutoSubmit = () => {
    toast.warning("Time is up! Submitting your answers automatically.");
    calculateAndSubmit();
  };

  const calculateAndSubmit = async () => {
    clearInterval(timerRef.current);
    if (!activeQuiz) return;

    let score = 0;
    const total = activeQuiz.questions.length;

    activeQuiz.questions.forEach((q, idx) => {
      const selected = selectedAnswers[idx];
      if (selected !== undefined && selected === q.correctAnswer) {
        score += 1;
      }
    });

    const percentage = Math.round((score / total) * 100);
    const passed = percentage >= (activeQuiz.passingScore || 50);

    const resultData = {
      userId: user?.uid || "anonymous",
      userEmail: user?.email || "",
      userName: userProfile?.name || "Student",
      quizId: activeQuiz.id,
      quizTitle: activeQuiz.title,
      chapterId: String(chapterId),
      subjectId: String(subjectId),
      classId: String(classId),
      score,
      totalQuestions: total,
      percentage,
      passed,
      selectedAnswers,
    };

    try {
      await submitQuizAttempt(resultData);
    } catch (e) {
      console.warn("Could not save quiz attempt:", e);
    }

    setQuizResult(resultData);
    setQuizFinished(true);
  };

  if (!currentClass || !currentSubject || !currentChapter) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4 p-4 text-center">
        <h2 className="text-xl font-bold text-foreground">Content Not Found</h2>
        <Button
          onClick={() =>
            navigate(`/classes/${classId}/subjects/${subjectId}/chapters`)
          }
          variant="outline"
        >
          <ChevronLeft className="w-4 h-4 mr-1" /> Back to Chapters
        </Button>
      </div>
    );
  }

  // Formatting time display
  const formatTime = (secs) => {
    const mins = Math.floor(secs / 60);
    const remainder = secs % 60;
    return `${mins}:${remainder < 10 ? "0" : ""}${remainder}`;
  };

  // ============================================================
  // RENDER: Active Quiz / Results View
  // ============================================================
  if (activeQuiz) {
    const currentQ = activeQuiz.questions[currentQuestionIndex];
    const totalQ = activeQuiz.questions.length;
    const isLastQuestion = currentQuestionIndex === totalQ - 1;

    return (
      <div className="p-4 sm:p-6 lg:p-8 max-w-3xl mx-auto space-y-6 animate-in fade-in duration-200">
        {/* Active Quiz Header */}
        <div className="flex items-center justify-between border-b border-border pb-4">
          <div>
            <span className="text-xs font-bold text-primary uppercase tracking-wider">
              {currentSubject.name} • Chapter {currentChapter.chapterNumber}
            </span>
            <h1 className="text-xl sm:text-2xl font-black text-foreground">
              {activeQuiz.title}
            </h1>
          </div>

          {!quizFinished ? (
            <div className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-primary/10 text-primary font-mono font-bold text-sm border border-primary/20 shrink-0">
              <Clock className="w-4 h-4" />
              <span>{formatTime(timeLeftSeconds)}</span>
            </div>
          ) : (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setActiveQuiz(null)}
              className="gap-1 text-xs"
            >
              <ChevronLeft className="w-3.5 h-3.5" /> Back to Quizzes
            </Button>
          )}
        </div>

        {/* RESULTS SCREEN */}
        {quizFinished && quizResult ? (
          <div className="space-y-6">
            <div className="p-6 sm:p-8 rounded-2xl bg-card border border-border text-center space-y-4 shadow-sm">
              <div
                className={`w-16 h-16 rounded-full mx-auto flex items-center justify-center text-3xl ${
                  quizResult.passed
                    ? "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20"
                    : "bg-destructive/10 text-destructive border border-destructive/20"
                }`}
              >
                {quizResult.passed ? <CheckCircle2 className="w-8 h-8" /> : <XCircle className="w-8 h-8" />}
              </div>

              <div>
                <h2 className="text-2xl font-black text-foreground">
                  {quizResult.passed ? "Quiz Passed! 🎉" : "Keep Practicing! 📚"}
                </h2>
                <p className="text-sm text-muted-foreground mt-1">
                  You scored <strong className="text-foreground">{quizResult.score}</strong> out of{" "}
                  <strong className="text-foreground">{quizResult.totalQuestions}</strong> questions (
                  {quizResult.percentage}%).
                </p>
              </div>

              <div className="grid grid-cols-3 gap-3 max-w-sm mx-auto pt-2">
                <div className="p-3 rounded-xl bg-muted/40 border border-border">
                  <div className="text-xs text-muted-foreground">Score</div>
                  <div className="text-lg font-black text-foreground">{quizResult.score}/{quizResult.totalQuestions}</div>
                </div>
                <div className="p-3 rounded-xl bg-muted/40 border border-border">
                  <div className="text-xs text-muted-foreground">Percentage</div>
                  <div className="text-lg font-black text-primary">{quizResult.percentage}%</div>
                </div>
                <div className="p-3 rounded-xl bg-muted/40 border border-border">
                  <div className="text-xs text-muted-foreground">Passing</div>
                  <div className="text-lg font-black text-muted-foreground">{activeQuiz.passingScore}%</div>
                </div>
              </div>

              <div className="flex justify-center gap-3 pt-4">
                <Button onClick={() => handleStartQuiz(activeQuiz)} className="gap-2">
                  <RotateCcw className="w-4 h-4" /> Retake Quiz
                </Button>
                <Button variant="outline" onClick={() => setActiveQuiz(null)}>
                  Done
                </Button>
              </div>
            </div>

            {/* Answer Breakdown */}
            <div className="space-y-4">
              <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground px-1">
                Detailed Review
              </h3>
              {activeQuiz.questions.map((q, qIdx) => {
                const userChoice = selectedAnswers[qIdx];
                const isCorrect = userChoice === q.correctAnswer;

                return (
                  <div
                    key={qIdx}
                    className={`p-5 rounded-2xl border bg-card space-y-3 ${
                      isCorrect ? "border-emerald-500/30" : "border-destructive/30"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <h4 className="font-bold text-sm sm:text-base text-foreground">
                        <span className="text-primary mr-1">Q{qIdx + 1}.</span> {q.question}
                      </h4>
                      <span
                        className={`text-xs px-2.5 py-0.5 rounded-full font-bold shrink-0 ${
                          isCorrect
                            ? "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20"
                            : "bg-destructive/10 text-destructive border border-destructive/20"
                        }`}
                      >
                        {isCorrect ? "Correct" : "Incorrect"}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                      {q.options.map((opt, optIdx) => {
                        let optStyle = "border border-border bg-muted/20 text-muted-foreground";
                        if (optIdx === q.correctAnswer) {
                          optStyle = "border-emerald-500 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-semibold";
                        } else if (optIdx === userChoice && !isCorrect) {
                          optStyle = "border-destructive bg-destructive/10 text-destructive font-semibold";
                        }

                        return (
                          <div key={optIdx} className={`p-2.5 rounded-xl flex items-center gap-2 ${optStyle}`}>
                            <span className="font-bold uppercase w-4">{String.fromCharCode(65 + optIdx)}.</span>
                            <span>{opt}</span>
                          </div>
                        );
                      })}
                    </div>

                    {q.explanation && (
                      <div className="text-xs p-3 rounded-xl bg-muted/40 border border-border text-muted-foreground">
                        <strong className="text-foreground">Explanation:</strong> {q.explanation}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          /* ACTIVE QUESTIONS PLAYER */
          <div className="space-y-6">
            {/* Progress indicator */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-semibold text-muted-foreground">
                <span>
                  Question {currentQuestionIndex + 1} of {totalQ}
                </span>
                <span>{Math.round(((currentQuestionIndex + 1) / totalQ) * 100)}% Completed</span>
              </div>
              <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary transition-all duration-300 rounded-full"
                  style={{ width: `${((currentQuestionIndex + 1) / totalQ) * 100}%` }}
                />
              </div>
            </div>

            {/* Question Card */}
            <div className="p-6 rounded-2xl bg-card border border-border space-y-6">
              <h2 className="text-base sm:text-lg font-bold text-foreground leading-relaxed">
                <span className="text-primary mr-2">Q{currentQuestionIndex + 1}.</span>
                {currentQ.question}
              </h2>

              <div className="space-y-2.5">
                {currentQ.options.map((option, optIdx) => {
                  const isSelected = selectedAnswers[currentQuestionIndex] === optIdx;

                  return (
                    <button
                      key={optIdx}
                      type="button"
                      onClick={() => handleSelectOption(currentQuestionIndex, optIdx)}
                      className={`w-full text-left p-4 rounded-xl border transition-all duration-150 flex items-center gap-3 ${
                        isSelected
                          ? "bg-primary/10 border-primary text-foreground font-semibold shadow-sm"
                          : "bg-muted/20 border-border hover:border-primary/40 text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      <div
                        className={`w-7 h-7 rounded-lg font-bold text-xs flex items-center justify-center shrink-0 ${
                          isSelected
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted text-muted-foreground"
                        }`}
                      >
                        {String.fromCharCode(65 + optIdx)}
                      </div>
                      <span className="text-sm">{option}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Navigation Buttons */}
            <div className="flex items-center justify-between gap-3 pt-2">
              <Button
                variant="outline"
                disabled={currentQuestionIndex === 0}
                onClick={() => setCurrentQuestionIndex((prev) => Math.max(0, prev - 1))}
                className="gap-1.5"
              >
                <ChevronLeft className="w-4 h-4" /> Previous
              </Button>

              {isLastQuestion ? (
                <Button onClick={calculateAndSubmit} className="gap-2 bg-emerald-600 hover:bg-emerald-700 text-white">
                  <CheckCircle2 className="w-4 h-4" /> Submit Quiz
                </Button>
              ) : (
                <Button
                  onClick={() =>
                    setCurrentQuestionIndex((prev) => Math.min(totalQ - 1, prev + 1))
                  }
                  className="gap-1.5"
                >
                  Next <ChevronRight className="w-4 h-4" />
                </Button>
              )}
            </div>
          </div>
        )}
      </div>
    );
  }

  // ============================================================
  // RENDER: Chapter Quizzes List View (Admin & Student)
  // ============================================================
  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-5xl mx-auto space-y-6 animate-in fade-in duration-300">
      {/* Breadcrumb Navigation */}
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
        <button
          onClick={() =>
            navigate(`/classes/${classId}/subjects/${subjectId}/chapters`)
          }
          className="hover:text-foreground transition-colors font-medium"
        >
          {currentSubject.name}
        </button>
        <ChevronRight className="h-3.5 w-3.5" />
        <span className="text-foreground font-semibold">
          Chapter {currentChapter.chapterNumber}
        </span>
      </nav>

      {/* Chapter Quiz Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-2xl bg-card border border-border">
        <div>
          <span className="text-xs px-2.5 py-0.5 rounded-full font-bold bg-primary/10 text-primary border border-primary/20">
            Chapter {currentChapter.chapterNumber}
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground mt-1">
            {currentChapter.title} — Quizzes
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            {isAdmin
              ? "Create and manage chapter tests, questions, and passing thresholds."
              : "Take online assessments for this chapter to test your knowledge."}
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <Button
            variant="outline"
            size="sm"
            onClick={() =>
              navigate(`/classes/${classId}/subjects/${subjectId}/chapters`)
            }
            className="gap-1 text-xs"
          >
            <ChevronLeft className="w-4 h-4" /> Chapters
          </Button>
          {isAdmin && (
            <Button size="sm" onClick={openAddQuizModal} className="gap-1.5 text-xs">
              <Plus className="w-4 h-4" /> Add Quiz
            </Button>
          )}
        </div>
      </div>

      {/* Quizzes List */}
      {chapterQuizzes.length === 0 ? (
        <div className="text-center py-16 px-4 bg-card border border-dashed border-border rounded-2xl space-y-4">
          <HelpCircle className="w-12 h-12 text-muted-foreground mx-auto" />
          <div className="max-w-sm mx-auto space-y-1">
            <h3 className="text-lg font-bold text-foreground">No quizzes available</h3>
            <p className="text-sm text-muted-foreground">
              {isAdmin
                ? "Click 'Add Quiz' to create the first assessment with MCQ questions."
                : "No quizzes have been published yet for this chapter."}
            </p>
          </div>
          {isAdmin && (
            <Button onClick={openAddQuizModal} className="gap-2">
              <Plus className="w-4 h-4" /> Add Quiz
            </Button>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground px-1">
            {chapterQuizzes.length} Available Assessment{chapterQuizzes.length !== 1 ? "s" : ""}
          </div>

          {chapterQuizzes.map((quiz) => {
            const questionCount = quiz.questions?.length || 0;

            return (
              <div
                key={quiz.id}
                className="bg-card text-card-foreground border border-border rounded-2xl p-6 hover:border-primary/50 hover:shadow-md transition-all duration-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="space-y-1.5 min-w-0 flex-1">
                  <h3 className="font-bold text-lg text-foreground truncate">
                    {quiz.title}
                  </h3>
                  <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1 font-medium">
                      <FileQuestion className="w-3.5 h-3.5 text-primary" />
                      {questionCount} Questions
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1 font-medium">
                      <Clock className="w-3.5 h-3.5 text-primary" />
                      {quiz.timeLimitMinutes || 15} Minutes
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1 font-medium">
                      <Trophy className="w-3.5 h-3.5 text-primary" />
                      Pass: {quiz.passingScore || 50}%
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-2 shrink-0 pt-3 sm:pt-0 border-t sm:border-t-0 border-border">
                  {isAdmin && (
                    <div className="flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-muted-foreground hover:text-foreground"
                        onClick={(e) => openEditQuizModal(quiz, e)}
                        title="Edit Quiz & Questions"
                      >
                        <Pencil className="w-3.5 h-3.5" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                        onClick={(e) => handleDeleteQuiz(quiz.id, quiz.title, e)}
                        title="Delete Quiz"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  )}

                  <Button
                    onClick={() => handleStartQuiz(quiz)}
                    className="gap-2 shrink-0 shadow-sm"
                  >
                    <PlayCircle className="w-4 h-4" /> Start Quiz
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Admin Quiz & Question Builder Modal */}
      {isAdmin && (
        <Dialog open={isQuizModalOpen} onOpenChange={setIsQuizModalOpen}>
          <DialogContent className="sm:max-w-2xl max-h-[85vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingQuiz ? "Edit Quiz & Questions" : "Create New Quiz"}</DialogTitle>
            </DialogHeader>

            <form onSubmit={handleSaveQuiz} className="space-y-6 py-2">
              {/* Basic Details */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-3 space-y-1.5">
                  <Label htmlFor="quizTitle">Quiz Title *</Label>
                  <Input
                    id="quizTitle"
                    placeholder="e.g. Chapter 1 Quiz Test"
                    value={quizForm.title}
                    onChange={(e) => setQuizForm((prev) => ({ ...prev, title: e.target.value }))}
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="quizDuration">Time Limit (Minutes)</Label>
                  <Input
                    id="quizDuration"
                    type="number"
                    min="1"
                    value={quizForm.timeLimitMinutes}
                    onChange={(e) => setQuizForm((prev) => ({ ...prev, timeLimitMinutes: e.target.value }))}
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="quizPass">Passing Score (%)</Label>
                  <Input
                    id="quizPass"
                    type="number"
                    min="1"
                    max="100"
                    value={quizForm.passingScore}
                    onChange={(e) => setQuizForm((prev) => ({ ...prev, passingScore: e.target.value }))}
                  />
                </div>

                <div className="space-y-1.5">
                  <Label>Total Questions</Label>
                  <div className="h-9 px-3 rounded-md bg-muted border border-border text-sm flex items-center font-bold">
                    {quizForm.questions.length} MCQs
                  </div>
                </div>
              </div>

              {/* Questions Builder Section */}
              <div className="space-y-4 pt-2 border-t border-border">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-sm text-foreground">
                    Questions ({quizForm.questions.length})
                  </h3>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={addQuestionField}
                    className="gap-1 text-xs"
                  >
                    <Plus className="w-3.5 h-3.5" /> Add Question
                  </Button>
                </div>

                {quizForm.questions.map((q, qIdx) => (
                  <div key={q.id || qIdx} className="p-4 rounded-xl border border-border bg-muted/20 space-y-3">
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-bold text-xs text-primary uppercase tracking-wider">
                        Question {qIdx + 1}
                      </span>
                      {quizForm.questions.length > 1 && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeQuestionField(qIdx)}
                          className="h-7 text-xs text-destructive hover:bg-destructive/10"
                        >
                          Remove
                        </Button>
                      )}
                    </div>

                    <Input
                      placeholder="Type question here..."
                      value={q.question}
                      onChange={(e) => updateQuestionText(qIdx, e.target.value)}
                      required
                    />

                    <div className="space-y-2 pt-1">
                      <Label className="text-xs font-semibold text-muted-foreground">
                        Options & Select Correct Answer (Click radio to mark correct)
                      </Label>
                      {q.options.map((opt, optIdx) => (
                        <div key={optIdx} className="flex items-center gap-2">
                          <input
                            type="radio"
                            name={`correct_${qIdx}`}
                            checked={q.correctAnswer === optIdx}
                            onChange={() => updateCorrectAnswer(qIdx, optIdx)}
                            className="w-4 h-4 accent-primary cursor-pointer"
                          />
                          <Input
                            placeholder={`Option ${String.fromCharCode(65 + optIdx)}`}
                            value={opt}
                            onChange={(e) => updateOptionText(qIdx, optIdx, e.target.value)}
                            required
                            className="h-8 text-xs"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              <DialogFooter className="pt-4 border-t border-border">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsQuizModalOpen(false)}
                  disabled={isSubmittingQuiz}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmittingQuiz}>
                  {isSubmittingQuiz ? "Saving..." : editingQuiz ? "Save Changes" : "Create Quiz"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
