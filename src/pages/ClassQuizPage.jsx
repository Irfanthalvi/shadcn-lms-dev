import React, { useState, useEffect, useRef, useMemo } from "react";
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
  RotateCcw,
  BookOpen,
  Flag,
  Send,
  Sparkles,
  Check,
  X,
  Layers,
  ArrowRight,
  ShieldAlert,
  Calendar,
  Eye,
  Loader2,
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
import {
  sindhBoardClasses,
  sindhBoardSubjects,
  sindhBoardChapters,
} from "@/data/sindhBoardCurriculum";
import toast from "react-hot-toast";

export default function ClassQuizPage() {
  const { classId, subjectId, chapterId, bookId } = useParams();
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
    getQuizAttemptByUser,
    studentAttempts,
    loadingLms,
  } = useLms();
  const { user, userProfile, isAdmin } = useAuth();

  // Strict Class Protection for Students
  useEffect(() => {
    if (!isAdmin && userProfile?.classId && classId && String(classId) !== String(userProfile.classId)) {
      toast.error("Access restricted: You can only take quizzes for your enrolled class.");
      navigate(`/classes/${userProfile.classId}/subjects`, { replace: true });
    }
  }, [isAdmin, userProfile, classId, navigate]);

  // Resolve Class, Subject, Chapter with reliable fallback to Sindh Board curriculum
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
        name: "Academic Subject",
        code: "STBB",
      }
    );
  }, [subjects, subjectId]);

  const currentChapter = useMemo(() => {
    return (
      chapters.find((c) => String(c.id) === String(chapterId)) ||
      sindhBoardChapters.find((c) => String(c.id) === String(chapterId)) || {
        id: chapterId,
        title: "Chapter Assessment",
        chapterNumber: 1,
      }
    );
  }, [chapters, chapterId]);

  // Quizzes for this chapter
  const chapterQuizzes = useMemo(() => {
    // Check Firestore quizzes for this chapter
    const list = quizzes.filter(
      (q) =>
        String(q.chapterId) === String(chapterId) ||
        (q.subjectId === subjectId && q.classId === classId)
    );

    // Fallback default sample quiz if none exists yet
    if (list.length === 0 && currentChapter) {
      return [
        {
          id: `sample_quiz_${chapterId}`,
          title: `${currentChapter.title} — Self-Assessment Test`,
          chapterId: String(chapterId),
          subjectId: String(subjectId),
          classId: String(classId),
          timeLimitMinutes: 15,
          totalMarks: 5,
          passingScore: 50,
          description: "Sindh Textbook Board curriculum based chapter self-assessment test.",
          questions: [
            {
              id: "q1",
              question: `Which of the following best represents the fundamental concept of ${currentChapter.title}?`,
              options: [
                "Standard SI measurement units",
                "Theoretical baseline law",
                "Experimental empirical evidence",
                "Applied board definition",
              ],
              correctAnswer: 1,
              explanation: "Core definition per the Sindh Textbook Board syllabus guidelines.",
            },
            {
              id: "q2",
              question: "What is the standard unit of measurement according to the International System of Units (SI)?",
              options: [
                "Foot-Pound-Second (FPS)",
                "Meter-Kilogram-Second (MKS / SI)",
                "Centimeter-Gram-Second (CGS)",
                "Imperial measure",
              ],
              correctAnswer: 1,
              explanation: "SI unit system standardizes meters, kilograms, and seconds across all scientific calculations.",
            },
            {
              id: "q3",
              question: "Which of these is classified as a derived physical quantity?",
              options: ["Length", "Mass", "Velocity", "Time"],
              correctAnswer: 2,
              explanation: "Velocity is derived from dividing length (displacement) by time (m/s).",
            },
            {
              id: "q4",
              question: "What is the primary function of a vernier caliper in laboratory measurements?",
              options: [
                "To measure high electrical voltage",
                "To measure internal/external dimensions with high precision",
                "To measure atmospheric pressure",
                "To determine chemical concentration",
              ],
              correctAnswer: 1,
              explanation: "Vernier calipers measure internal, external diameters and depth up to 0.01 cm precision.",
            },
            {
              id: "q5",
              question: "What is the minimum passing requirement for the Sindh Board examination assessments?",
              options: ["33%", "50%", "75%", "90%"],
              correctAnswer: 1,
              explanation: "Students must achieve at least 50% on chapter quizzes to receive pass status.",
            },
          ],
        },
      ];
    }

    return list;
  }, [quizzes, chapterId, subjectId, classId, currentChapter]);

  // Admin Modal: Create / Edit Quiz
  const [isQuizModalOpen, setIsQuizModalOpen] = useState(false);
  const [editingQuiz, setEditingQuiz] = useState(null);
  const [quizForm, setQuizForm] = useState({
    title: "",
    description: "",
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
  const timerRef = useRef(null);

  // Countdown timer
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

  // Question manipulation helpers for admin
  const openAddQuizModal = () => {
    setEditingQuiz(null);
    setQuizForm({
      title: `${currentChapter?.title || "Chapter"} Assessment Quiz`,
      description: "Sindh Textbook Board chapter self-assessment test.",
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

  const openEditQuizModal = (quiz, e) => {
    e.stopPropagation();
    setEditingQuiz(quiz);
    setQuizForm({
      title: quiz.title || "",
      description: quiz.description || "",
      timeLimitMinutes: quiz.timeLimitMinutes || 15,
      passingScore: quiz.passingScore || 50,
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

  const handleDeleteQuiz = async (quizId, quizTitle, e) => {
    e.stopPropagation();
    if (window.confirm(`Are you sure you want to delete quiz "${quizTitle}"?`)) {
      await deleteQuiz(quizId);
    }
  };

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

  const handleSaveQuiz = async (e) => {
    e.preventDefault();
    if (!quizForm.title.trim()) {
      toast.error("Please provide a quiz title.");
      return;
    }

    for (let i = 0; i < quizForm.questions.length; i++) {
      const q = quizForm.questions[i];
      if (!q.question.trim()) {
        toast.error(`Question ${i + 1} prompt cannot be empty.`);
        return;
      }
      if (q.options.some((opt) => !opt.trim())) {
        toast.error(`Please provide all 4 options for Question ${i + 1}.`);
        return;
      }
    }

    setIsSubmittingQuiz(true);
    try {
      if (editingQuiz) {
        await updateQuiz(editingQuiz.id, {
          title: quizForm.title.trim(),
          description: quizForm.description.trim(),
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
          description: quizForm.description.trim(),
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

  // Student: Initiate Quiz
  const handleInitiateQuiz = (quiz) => {
    const priorAttempt = studentAttempts.find(
      (a) => String(a.quizId) === String(quiz.id) && (user ? a.userId === user.uid : true)
    );
    setPreQuizModal({ quiz, priorAttempt });
  };

  // Student: Start Active Quiz
  const startQuizExperience = (quiz) => {
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
    toast.success(`Exam started! You have ${quiz.timeLimitMinutes || 15} minutes.`);
  };

  // Option selection
  const handleSelectOption = (questionIndex, optionIndex) => {
    setSelectedAnswers((prev) => ({
      ...prev,
      [questionIndex]: optionIndex,
    }));
  };

  const toggleMarkForReview = (idx) => {
    setMarkedForReview((prev) => ({
      ...prev,
      [idx]: !prev[idx],
    }));
  };

  const handleAutoSubmit = () => {
    toast.error("⏰ Time expired! Your answers have been auto-submitted.");
    calculateAndSubmit(true);
  };

  // Calculate and submit results
  const calculateAndSubmit = async (isAutoSubmit = false) => {
    if (!activeQuiz) return;
    const questions = activeQuiz.questions || [];
    const total = questions.length;
    let score = 0;

    questions.forEach((q, idx) => {
      const selected = selectedAnswers[idx];
      if (selected !== undefined && Number(selected) === Number(q.correctAnswer)) {
        score++;
      }
    });

    const percentage = total > 0 ? Math.round((score / total) * 100) : 0;
    const passed = percentage >= (activeQuiz.passingScore || 50);
    const timeTakenSeconds = initialTimeSeconds - timeLeftSeconds;
    const minutesTaken = Math.floor(timeTakenSeconds / 60);
    const secondsTaken = timeTakenSeconds % 60;
    const timeTakenStr = `${minutesTaken}m ${secondsTaken}s`;

    const resultData = {
      userId: user?.uid || "guest_student",
      userEmail: user?.email || userProfile?.email || "student@lms.academy",
      userName: userProfile?.name || user?.displayName || "Student",
      quizId: activeQuiz.id,
      quizTitle: activeQuiz.title,
      chapterId: String(chapterId),
      subjectId: String(subjectId),
      classId: String(classId),
      score,
      totalQuestions: total,
      percentage,
      passed,
      timeTaken: timeTakenStr,
      timeTakenSeconds,
      autoSubmitted: isAutoSubmit,
      selectedAnswers,
      submittedAtString: new Date().toLocaleString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    try {
      await submitQuizAttempt(resultData);
    } catch (e) {
      console.warn("Could not save quiz attempt:", e);
    }

    setQuizResult(resultData);
    setQuizFinished(true);
    setConfirmSubmitOpen(false);

    if (passed) {
      toast.success(`🎉 Passed! You scored ${percentage}%.`);
    } else {
      toast.error(`Assessment complete: ${percentage}%. Passing score is ${activeQuiz.passingScore || 50}%.`);
    }
  };

  const formatTime = (secs) => {
    const mins = Math.floor(secs / 60);
    const remainder = secs % 60;
    return `${mins.toString().padStart(2, "0")}:${remainder.toString().padStart(2, "0")}`;
  };

  // ============================================================
  // VIEW: ACTIVE QUIZ OR RESULT SCREEN
  // ============================================================
  if (activeQuiz) {
    const questions = activeQuiz.questions || [];
    const totalQ = questions.length;
    const currentQ = questions[currentQuestionIndex];
    const isLastQuestion = currentQuestionIndex === totalQ - 1;
    const isFirstQuestion = currentQuestionIndex === 0;

    const answeredCount = Object.keys(selectedAnswers).length;
    const markedCount = Object.values(markedForReview).filter(Boolean).length;
    const unansweredCount = Math.max(0, totalQ - answeredCount);

    // Results Screen
    if (quizFinished && quizResult) {
      return (
        <div className="p-4 sm:p-6 lg:p-8 max-w-3xl mx-auto space-y-6 animate-in fade-in duration-300">
          <div className="p-6 sm:p-8 rounded-3xl bg-card border border-border/80 text-center space-y-6 shadow-xl shadow-black/5 dark:shadow-black/30">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-primary/10 text-primary border border-primary/20">
              <Sparkles className="w-3.5 h-3.5" /> Assessment Scorecard
            </div>

            <div className="space-y-1">
              <h1 className="text-2xl sm:text-3xl font-black text-foreground">
                {activeQuiz.title}
              </h1>
              <p className="text-xs text-muted-foreground">
                {currentSubject?.name || "Subject"} • Chapter {currentChapter?.chapterNumber || 1}: {currentChapter?.title}
              </p>
            </div>

            {/* Score Ring / Status Banner */}
            <div
              className={`p-6 rounded-2xl border ${
                quizResult.passed
                  ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-600 dark:text-emerald-400"
                  : "bg-destructive/10 border-destructive/30 text-destructive"
              }`}
            >
              <div className="text-5xl font-black">{quizResult.percentage}%</div>
              <div className="text-sm font-bold uppercase tracking-wider mt-1">
                {quizResult.passed ? "Passed Examination" : "Needs Revision (Failed)"}
              </div>
              <p className="text-xs mt-1 opacity-80">
                You answered {quizResult.score} of {quizResult.totalQuestions} questions correctly.
              </p>
            </div>

            {/* Details Grid */}
            <div className="grid grid-cols-3 gap-3 text-xs">
              <div className="p-3.5 rounded-xl bg-muted/40 border border-border">
                <div className="text-muted-foreground font-semibold">Total Marks</div>
                <div className="text-base font-black text-foreground mt-0.5">
                  {quizResult.score} / {quizResult.totalQuestions}
                </div>
              </div>
              <div className="p-3.5 rounded-xl bg-muted/40 border border-border">
                <div className="text-muted-foreground font-semibold">Time Spent</div>
                <div className="text-base font-black text-foreground mt-0.5">
                  {quizResult.timeTaken}
                </div>
              </div>
              <div className="p-3.5 rounded-xl bg-muted/40 border border-border">
                <div className="text-muted-foreground font-semibold">Submission</div>
                <div className="text-base font-black text-foreground mt-0.5">
                  {quizResult.autoSubmitted ? "Auto Expire" : "Manual"}
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <Button
                onClick={() => setShowAnswerReview((prev) => !prev)}
                variant="outline"
                className="w-full sm:w-auto text-xs font-bold rounded-xl h-10 gap-1.5"
              >
                <Eye className="w-4 h-4 text-primary" />
                {showAnswerReview ? "Hide Question Review" : "Review Answer Key"}
              </Button>
              <Button
                onClick={() => startQuizExperience(activeQuiz)}
                className="w-full sm:w-auto text-xs font-bold rounded-xl h-10 gap-1.5 shadow-sm"
              >
                <RotateCcw className="w-4 h-4" /> Retake Test
              </Button>
              <Button
                onClick={() => setActiveQuiz(null)}
                variant="secondary"
                className="w-full sm:w-auto text-xs font-semibold rounded-xl h-10"
              >
                Back to Quizzes
              </Button>
            </div>
          </div>

          {/* Question Review Section */}
          {showAnswerReview && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <h3 className="text-base font-black text-foreground flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-primary" /> Question-by-Question Evaluation
              </h3>

              {questions.map((q, idx) => {
                const studentAns = selectedAnswers[idx];
                const isCorrect = studentAns !== undefined && Number(studentAns) === Number(q.correctAnswer);

                return (
                  <div
                    key={idx}
                    className={`p-5 rounded-2xl bg-card border ${
                      isCorrect ? "border-emerald-500/40" : "border-destructive/40"
                    } shadow-xs space-y-3`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-foreground">
                        Question {idx + 1}
                      </span>
                      <span
                        className={`text-[11px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 ${
                          isCorrect
                            ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                            : "bg-destructive/10 text-destructive"
                        }`}
                      >
                        {isCorrect ? (
                          <>
                            <CheckCircle2 className="w-3 h-3" /> Correct
                          </>
                        ) : (
                          <>
                            <XCircle className="w-3 h-3" /> Incorrect
                          </>
                        )}
                      </span>
                    </div>

                    <p className="text-xs font-semibold text-foreground">{q.question}</p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                      {q.options.map((opt, optIdx) => {
                        const wasChosen = studentAns === optIdx;
                        const isTheCorrect = optIdx === q.correctAnswer;

                        let optClass = "border-border bg-muted/20 text-muted-foreground";
                        if (isTheCorrect) {
                          optClass = "border-emerald-500 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 font-bold";
                        } else if (wasChosen && !isCorrect) {
                          optClass = "border-destructive bg-destructive/10 text-destructive font-semibold";
                        }

                        return (
                          <div
                            key={optIdx}
                            className={`p-2.5 rounded-xl border flex items-center justify-between ${optClass}`}
                          >
                            <span>
                              {String.fromCharCode(65 + optIdx)}. {opt}
                            </span>
                            {isTheCorrect && <Check className="w-3.5 h-3.5 text-emerald-600" />}
                            {wasChosen && !isTheCorrect && <X className="w-3.5 h-3.5 text-destructive" />}
                          </div>
                        );
                      })}
                    </div>

                    {q.explanation && (
                      <div className="p-2.5 rounded-xl bg-primary/5 border border-primary/20 text-[11px] text-muted-foreground">
                        <span className="font-bold text-primary">Syllabus Reference: </span>
                        {q.explanation}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      );
    }

    // Active Exam Taking Platform
    const isMarked = markedForReview[currentQuestionIndex];
    const isAnswered = selectedAnswers[currentQuestionIndex] !== undefined;

    return (
      <div className="p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto space-y-6 animate-in fade-in duration-200">
        {/* Exam Top Bar */}
        <div className="p-4 sm:p-5 rounded-2xl bg-card border border-border/80 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="text-xs font-bold text-primary uppercase tracking-wider">
              {currentSubject?.name || "Subject"} • Chapter {currentChapter?.chapterNumber || 1}
            </div>
            <h1 className="text-lg sm:text-xl font-black text-foreground">
              {activeQuiz.title}
            </h1>
          </div>

          <div className="flex items-center gap-3">
            {/* Timer */}
            <div
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl border font-mono font-bold text-xs ${
                timeLeftSeconds < 120
                  ? "bg-destructive/10 text-destructive border-destructive/30 animate-pulse"
                  : "bg-muted/40 text-foreground border-border"
              }`}
            >
              <Clock className="w-4 h-4 text-primary" />
              <span>{formatTime(timeLeftSeconds)}</span>
            </div>

            <Button
              variant="default"
              size="sm"
              onClick={() => setConfirmSubmitOpen(true)}
              className="gap-1.5 text-xs font-bold rounded-xl h-9 shadow-sm"
            >
              <Send className="w-3.5 h-3.5" /> Submit Assessment
            </Button>
          </div>
        </div>

        {/* Question Jumper Navigator */}
        <div className="p-3 rounded-2xl bg-card border border-border/80 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-[11px] text-muted-foreground px-1">
            <span className="font-bold uppercase tracking-wider">Question Navigator</span>
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-500" /> Answered ({answeredCount})
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-amber-500" /> Flagged ({markedCount})
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-muted-foreground/40" /> Skipped ({unansweredCount})
              </span>
            </div>
          </div>

          <div className="flex flex-wrap gap-1.5">
            {questions.map((_, idx) => {
              const isCurr = idx === currentQuestionIndex;
              const hasAnswer = selectedAnswers[idx] !== undefined;
              const hasMark = markedForReview[idx];

              let pillClass = "bg-muted/60 text-muted-foreground hover:bg-muted";
              if (isCurr) {
                pillClass = "bg-primary text-primary-foreground font-black ring-2 ring-primary/30";
              } else if (hasMark) {
                pillClass = "bg-amber-500 text-white font-bold";
              } else if (hasAnswer) {
                pillClass = "bg-emerald-600 text-white font-bold";
              }

              return (
                <button
                  key={idx}
                  onClick={() => setCurrentQuestionIndex(idx)}
                  className={`w-8 h-8 rounded-xl text-xs font-semibold flex items-center justify-center transition-all ${pillClass}`}
                >
                  {idx + 1}
                </button>
              );
            })}
          </div>
        </div>

        {/* Active Question Card */}
        {currentQ && (
          <div className="p-6 sm:p-8 rounded-3xl bg-card border border-border/80 shadow-sm space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-border/60">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-1 rounded-lg bg-primary/10 text-primary font-bold text-xs">
                  Question {currentQuestionIndex + 1} of {totalQ}
                </span>
                {isAnswered && (
                  <span className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Answered
                  </span>
                )}
              </div>

              <Button
                variant={isMarked ? "default" : "outline"}
                size="sm"
                onClick={() => toggleMarkForReview(currentQuestionIndex)}
                className={`gap-1.5 text-xs h-8 rounded-xl ${
                  isMarked
                    ? "bg-amber-500 hover:bg-amber-600 text-white border-transparent font-bold"
                    : "text-muted-foreground"
                }`}
              >
                <Flag className="w-3.5 h-3.5" />
                {isMarked ? "Flagged for Review" : "Mark for Review"}
              </Button>
            </div>

            <div className="text-base sm:text-lg font-bold text-foreground leading-relaxed">
              {currentQ.question}
            </div>

            <div className="space-y-3 pt-2">
              {currentQ.options.map((opt, optIdx) => {
                const isSelected = selectedAnswers[currentQuestionIndex] === optIdx;

                return (
                  <div
                    key={optIdx}
                    onClick={() => handleSelectOption(currentQuestionIndex, optIdx)}
                    className={`p-4 rounded-2xl border transition-all duration-150 cursor-pointer flex items-center justify-between ${
                      isSelected
                        ? "border-primary bg-primary/10 text-foreground font-bold shadow-sm shadow-primary/10 ring-1 ring-primary"
                        : "border-border/80 bg-card hover:border-border hover:bg-muted/30 text-foreground"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-7 h-7 rounded-xl flex items-center justify-center text-xs font-bold transition-colors ${
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
                      className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${
                        isSelected ? "border-primary bg-primary" : "border-muted-foreground/40"
                      }`}
                    >
                      {isSelected && <Check className="w-3 h-3 text-primary-foreground" />}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Navigation Footer */}
            <div className="pt-4 border-t border-border/60 flex items-center justify-between">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentQuestionIndex((p) => Math.max(0, p - 1))}
                disabled={isFirstQuestion}
                className="gap-1.5 text-xs h-9 rounded-xl font-semibold"
              >
                <ChevronLeft className="w-4 h-4" /> Previous
              </Button>

              <div className="flex items-center gap-2">
                {isLastQuestion ? (
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
                    onClick={() => setCurrentQuestionIndex((p) => Math.min(totalQ - 1, p + 1))}
                    className="gap-1.5 text-xs font-bold h-9 rounded-xl shadow-sm"
                  >
                    Next Question <ChevronRight className="w-4 h-4" />
                  </Button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Submit Confirmation Dialog */}
        <Dialog open={confirmSubmitOpen} onOpenChange={setConfirmSubmitOpen}>
          <DialogContent className="sm:max-w-md rounded-2xl">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-primary" />
                Submit Assessment?
              </DialogTitle>
            </DialogHeader>

            <div className="py-3 space-y-3 text-xs">
              <p className="text-muted-foreground">
                Please review your progress before finalizing. Once submitted, your score will be computed instantly.
              </p>

              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400">
                  <div className="text-base font-black">{answeredCount}</div>
                  <div className="text-[10px] font-bold uppercase">Answered</div>
                </div>
                <div className="p-3 rounded-xl bg-muted/40 border border-border text-muted-foreground">
                  <div className="text-base font-black text-foreground">{unansweredCount}</div>
                  <div className="text-[10px] font-bold uppercase">Unanswered</div>
                </div>
                <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400">
                  <div className="text-base font-black">{markedCount}</div>
                  <div className="text-[10px] font-bold uppercase">Flagged</div>
                </div>
              </div>
            </div>

            <DialogFooter className="gap-2 sm:gap-0">
              <Button
                variant="outline"
                onClick={() => setConfirmSubmitOpen(false)}
                className="text-xs rounded-xl"
              >
                Back to Quiz
              </Button>
              <Button
                onClick={() => calculateAndSubmit(false)}
                className="text-xs font-bold rounded-xl"
              >
                Confirm & Submit
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    );
  }

  // ============================================================
  // DEFAULT: CHAPTER QUIZZES LIST & MANAGEMENT VIEW
  // ============================================================
  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-5xl mx-auto space-y-6 animate-in fade-in duration-300">
      {/* Breadcrumbs */}
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
          {currentClass?.name || "Class"}
        </button>
        <ChevronRight className="h-3.5 w-3.5" />
        <button
          onClick={() => navigate(`/classes/${classId}/subjects/${subjectId}/chapters`)}
          className="hover:text-foreground transition-colors font-medium"
        >
          {currentSubject?.name || "Subject"}
        </button>
        <ChevronRight className="h-3.5 w-3.5" />
        <span className="text-foreground font-bold">
          Chapter {currentChapter?.chapterNumber || 1} Quiz
        </span>
      </nav>

      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-2xl bg-card border border-border/80 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs px-2.5 py-0.5 rounded-full font-bold bg-primary/10 text-primary border border-primary/20">
              Chapter Assessment • Sindh Board
            </span>
            <span className="text-xs px-2.5 py-0.5 rounded-full font-medium bg-muted text-muted-foreground">
              {currentSubject?.name}
            </span>
          </div>

          <h1 className="text-xl sm:text-2xl font-black tracking-tight text-foreground mt-2">
            Chapter {currentChapter?.chapterNumber}: {currentChapter?.title}
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Test your conceptual knowledge of this chapter with official multiple choice questions.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <Button
            variant="outline"
            size="sm"
            onClick={() =>
              navigate(
                `/classes/${classId}/subjects/${subjectId}/chapters/${chapterId}/content`
              )
            }
            className="text-xs rounded-xl font-semibold gap-1.5"
          >
            <BookOpen className="w-3.5 h-3.5 text-primary" /> Study Notes
          </Button>

          {isAdmin && (
            <Button
              onClick={openAddQuizModal}
              size="sm"
              className="text-xs rounded-xl font-bold bg-primary text-primary-foreground gap-1.5 shadow-sm"
            >
              <Plus className="w-3.5 h-3.5" /> Add New Quiz
            </Button>
          )}
        </div>
      </div>

      {/* Chapter Quizzes List */}
      {chapterQuizzes.length === 0 ? (
        <div className="text-center py-16 px-4 bg-card border border-dashed border-border rounded-2xl space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mx-auto">
            <HelpCircle className="w-7 h-7" />
          </div>
          <div>
            <h3 className="text-base font-bold text-foreground">No quizzes available</h3>
            <p className="text-xs text-muted-foreground max-w-md mx-auto mt-1">
              There are currently no active quizzes registered for this chapter.
            </p>
          </div>
          {isAdmin && (
            <Button
              onClick={openAddQuizModal}
              size="sm"
              className="rounded-xl font-bold text-xs gap-1.5"
            >
              <Plus className="w-4 h-4" /> Create First Quiz
            </Button>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {chapterQuizzes.map((quiz) => {
            const priorAttempt = studentAttempts.find(
              (a) => String(a.quizId) === String(quiz.id) && (user ? a.userId === user.uid : true)
            );

            return (
              <div
                key={quiz.id}
                className="p-5 sm:p-6 rounded-2xl bg-card border border-border/80 hover:border-primary/50 transition-all duration-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-primary/10 text-primary">
                      MCQ Assessment
                    </span>
                    {priorAttempt && (
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          priorAttempt.passed
                            ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                            : "bg-destructive/10 text-destructive"
                        }`}
                      >
                        Prior Attempt: {priorAttempt.percentage}% ({priorAttempt.passed ? "Pass" : "Fail"})
                      </span>
                    )}
                  </div>

                  <h3 className="text-base font-bold text-foreground">{quiz.title}</h3>
                  <p className="text-xs text-muted-foreground">
                    {quiz.description || "Sindh Textbook Board curriculum syllabus questions."}
                  </p>

                  <div className="flex items-center gap-4 text-xs text-muted-foreground pt-1">
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

                <div className="flex items-center gap-2.5 shrink-0">
                  {isAdmin && (
                    <>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={(e) => openEditQuizModal(quiz, e)}
                        className="h-9 px-2 text-xs rounded-xl"
                      >
                        <Pencil className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={(e) => handleDeleteQuiz(quiz.id, quiz.title, e)}
                        className="h-9 px-2 text-xs rounded-xl text-muted-foreground hover:text-destructive"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </>
                  )}

                  <Button
                    size="sm"
                    onClick={() => handleInitiateQuiz(quiz)}
                    className="text-xs font-bold rounded-xl h-9 gap-1.5 shadow-sm"
                  >
                    <PlayCircle className="w-4 h-4" /> Start Exam
                  </Button>
                </div>
              </div>
            );
          })}
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
                  Sindh Textbook Board Exam Guidelines
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
                  The timer begins immediately upon start. The assessment will auto-submit once the time reaches zero.
                </span>
              </div>

              <DialogFooter className="gap-2 sm:gap-0">
                <Button variant="outline" onClick={() => setPreQuizModal(null)} className="rounded-xl text-xs">
                  Cancel
                </Button>
                <Button
                  onClick={() => startQuizExperience(preQuizModal.quiz)}
                  className="rounded-xl text-xs font-bold gap-1.5 shadow-sm"
                >
                  <PlayCircle className="w-4 h-4" /> Start Now
                </Button>
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Admin Add/Edit Quiz Modal */}
      <Dialog open={isQuizModalOpen} onOpenChange={setIsQuizModalOpen}>
        <DialogContent className="max-w-2xl rounded-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <HelpCircle className="w-5 h-5 text-primary" />
              {editingQuiz ? "Edit Chapter Quiz" : "Create Chapter Quiz"}
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSaveQuiz} className="space-y-4 py-2 text-xs">
            <div className="space-y-1">
              <Label className="text-xs font-bold">Quiz Title</Label>
              <Input
                placeholder="e.g. Chapter 1 Self-Assessment Test"
                value={quizForm.title}
                onChange={(e) => setQuizForm({ ...quizForm, title: e.target.value })}
                className="h-9 text-xs rounded-xl"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label className="text-xs font-bold">Time Limit (Minutes)</Label>
                <Input
                  type="number"
                  min={1}
                  max={180}
                  value={quizForm.timeLimitMinutes}
                  onChange={(e) =>
                    setQuizForm({ ...quizForm, timeLimitMinutes: e.target.value })
                  }
                  className="h-9 text-xs rounded-xl"
                  required
                />
              </div>

              <div className="space-y-1">
                <Label className="text-xs font-bold">Passing Percentage (%)</Label>
                <Input
                  type="number"
                  min={10}
                  max={100}
                  value={quizForm.passingScore}
                  onChange={(e) =>
                    setQuizForm({ ...quizForm, passingScore: e.target.value })
                  }
                  className="h-9 text-xs rounded-xl"
                  required
                />
              </div>
            </div>

            <div className="space-y-1">
              <Label className="text-xs font-bold">Description / Instructions</Label>
              <Textarea
                rows={2}
                placeholder="Instructions for students taking this test..."
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
                          placeholder={`Option ${String.fromCharCode(65 + optIdx)} text...`}
                          value={opt}
                          onChange={(e) => updateOptionText(qIdx, optIdx, e.target.value)}
                          className="h-8 text-xs rounded-lg flex-1 bg-background"
                          required
                        />
                      </div>
                    ))}
                  </div>

                  <Input
                    placeholder="Syllabus explanation / learning outcome reference..."
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
    </div>
  );
}
