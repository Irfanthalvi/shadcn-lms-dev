import React, { useState, useEffect } from "react";
import {
  X,
  Plus,
  Trash2,
  HelpCircle,
  FileText,
  Clock,
  Award,
  CheckCircle,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

const subjectOptions = [
  "Mathematics",
  "Physics",
  "Chemistry",
  "Biology",
  "Computer Science",
  "English",
  "Urdu",
  "Islamiat",
  "Pakistan Studies",
  "General Science",
  "Social Studies",
];

const termOptions = [
  "Mid-Term Examination",
  "Final Examination",
  "Monthly Assessment",
  "Unit Test",
  "Pre-Board Mock",
  "Diagnostic Test",
  "Weekly Quiz",
];

export default function PaperFormModal({
  open,
  onClose,
  initialData = null,
  defaultClassId = "8",
  onSubmit,
}) {
  const isEditing = Boolean(initialData);

  const [formData, setFormData] = useState({
    classId: defaultClassId,
    title: "",
    subject: "Mathematics",
    term: "Mid-Term Examination",
    examCode: "",
    totalMarks: 50,
    durationMins: 60,
    passingPercentage: 45,
    status: "Published",
    difficulty: "Medium",
    scheduledDate: new Date().toISOString().split("T")[0],
    instructions: "Answer all questions. Read instructions carefully before beginning.",
    questions: [],
  });

  // Question builder temp state
  const [newQuestionType, setNewQuestionType] = useState("mcq");
  const [newQText, setNewQText] = useState("");
  const [newQMarks, setNewQMarks] = useState(2);
  const [newOptions, setNewOptions] = useState(["", "", "", ""]);
  const [newCorrectOption, setNewCorrectOption] = useState("0");
  const [newAnswerGuide, setNewAnswerGuide] = useState("");

  useEffect(() => {
    if (initialData) {
      setFormData({
        classId: String(initialData.classId || defaultClassId),
        title: initialData.title || "",
        subject: initialData.subject || "Mathematics",
        term: initialData.term || "Mid-Term Examination",
        examCode: initialData.examCode || `EXAM-${Math.floor(100 + Math.random() * 900)}`,
        totalMarks: initialData.totalMarks || 50,
        durationMins: initialData.durationMins || 60,
        passingPercentage: initialData.passingPercentage || 45,
        status: initialData.status || "Published",
        difficulty: initialData.difficulty || "Medium",
        scheduledDate: initialData.scheduledDate || new Date().toISOString().split("T")[0],
        instructions:
          initialData.instructions ||
          "Answer all questions. Read instructions carefully before beginning.",
        questions: initialData.questions ? [...initialData.questions] : [],
      });
    } else {
      setFormData({
        classId: String(defaultClassId),
        title: "",
        subject: "Mathematics",
        term: "Mid-Term Examination",
        examCode: `EXAM-${Math.floor(100 + Math.random() * 900)}`,
        totalMarks: 50,
        durationMins: 60,
        passingPercentage: 45,
        status: "Published",
        difficulty: "Medium",
        scheduledDate: new Date().toISOString().split("T")[0],
        instructions:
          "Answer all questions. Read instructions carefully before beginning.",
        questions: [
          {
            id: 1,
            type: "mcq",
            question: "Sample Question 1: What is the fundamental unit of measurement?",
            marks: 2,
            options: ["Meter", "Gram", "Second", "All of these"],
            correctAnswer: "Meter",
          },
        ],
      });
    }
  }, [initialData, defaultClassId, open]);

  const handleAddQuestion = () => {
    if (!newQText.trim()) {
      toast.warning("Please enter a question text");
      return;
    }

    let qObj;
    if (newQuestionType === "mcq") {
      const validOptions = newOptions.filter((opt) => opt.trim() !== "");
      if (validOptions.length < 2) {
        toast.warning("Please enter at least 2 options for multiple choice");
        return;
      }
      const selectedIndex = parseInt(newCorrectOption, 10);
      const correctAnswer =
        newOptions[selectedIndex] && newOptions[selectedIndex].trim()
          ? newOptions[selectedIndex].trim()
          : validOptions[0];

      qObj = {
        id: Date.now(),
        type: "mcq",
        question: newQText.trim(),
        marks: Number(newQMarks) || 2,
        options: validOptions,
        correctAnswer: correctAnswer,
      };
    } else if (newQuestionType === "short") {
      qObj = {
        id: Date.now(),
        type: "short",
        question: newQText.trim(),
        marks: Number(newQMarks) || 4,
        answerGuide: newAnswerGuide.trim(),
      };
    } else {
      qObj = {
        id: Date.now(),
        type: "long",
        question: newQText.trim(),
        marks: Number(newQMarks) || 10,
        answerGuide: newAnswerGuide.trim(),
      };
    }

    setFormData((prev) => ({
      ...prev,
      questions: [...prev.questions, qObj],
    }));

    // Reset inputs
    setNewQText("");
    setNewOptions(["", "", "", ""]);
    setNewAnswerGuide("");
    toast.success("Question added to paper!");
  };

  const handleRemoveQuestion = (id) => {
    setFormData((prev) => ({
      ...prev,
      questions: prev.questions.filter((q) => q.id !== id),
    }));
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      toast.warning("Please enter a paper title");
      return;
    }

    const payload = {
      ...formData,
      totalMarks: Number(formData.totalMarks) || 50,
      durationMins: Number(formData.durationMins) || 60,
      passingPercentage: Number(formData.passingPercentage) || 40,
    };

    onSubmit(payload);
    onClose();
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="bg-card text-card-foreground border border-border rounded-2xl shadow-2xl w-full max-w-3xl max-h-[92vh] flex flex-col my-auto overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-muted/40">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-primary/10 text-primary rounded-lg">
              <FileText className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold">
                {isEditing ? "Edit Exam Paper" : "Create New Exam Paper"}
              </h2>
              <p className="text-xs text-muted-foreground">
                Configure assessment parameters, questions, and scoring criteria.
              </p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="rounded-full text-muted-foreground hover:text-foreground"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Scrollable Form Body */}
        <form onSubmit={handleFormSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Section 1: Basic Info */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[11px] font-bold text-primary-foreground">
                1
              </span>
              Paper Classification & Details
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {/* Target Class */}
              <div className="space-y-1.5">
                <Label htmlFor="classId">Target Class *</Label>
                <Select
                  value={formData.classId}
                  onValueChange={(val) =>
                    setFormData((p) => ({ ...p, classId: val }))
                  }
                >
                  <SelectTrigger id="classId">
                    <SelectValue placeholder="Select Class" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="8">Class 8 (Middle)</SelectItem>
                    <SelectItem value="9">Class 9 (Matric I)</SelectItem>
                    <SelectItem value="10">Class 10 (Matric II)</SelectItem>
                    <SelectItem value="11">Class 11 (FSc I)</SelectItem>
                    <SelectItem value="12">Class 12 (FSc II)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Subject */}
              <div className="space-y-1.5">
                <Label htmlFor="subject">Subject *</Label>
                <Select
                  value={formData.subject}
                  onValueChange={(val) =>
                    setFormData((p) => ({ ...p, subject: val }))
                  }
                >
                  <SelectTrigger id="subject">
                    <SelectValue placeholder="Select Subject" />
                  </SelectTrigger>
                  <SelectContent>
                    {subjectOptions.map((s) => (
                      <SelectItem key={s} value={s}>
                        {s}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Term / Category */}
              <div className="space-y-1.5">
                <Label htmlFor="term">Exam Category *</Label>
                <Select
                  value={formData.term}
                  onValueChange={(val) =>
                    setFormData((p) => ({ ...p, term: val }))
                  }
                >
                  <SelectTrigger id="term">
                    <SelectValue placeholder="Exam Term" />
                  </SelectTrigger>
                  <SelectContent>
                    {termOptions.map((t) => (
                      <SelectItem key={t} value={t}>
                        {t}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Paper Title */}
            <div className="space-y-1.5">
              <Label htmlFor="title">Paper Title *</Label>
              <Input
                id="title"
                placeholder="e.g., Class 10 Physics: Mid-Term Mechanics & Wave Optics"
                value={formData.title}
                onChange={(e) =>
                  setFormData((p) => ({ ...p, title: e.target.value }))
                }
                required
              />
            </div>

            {/* Exam Code & Scheduled Date */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="examCode">Exam Paper Code</Label>
                <Input
                  id="examCode"
                  placeholder="e.g. PHY-1001"
                  value={formData.examCode}
                  onChange={(e) =>
                    setFormData((p) => ({ ...p, examCode: e.target.value }))
                  }
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="scheduledDate">Scheduled Date</Label>
                <Input
                  id="scheduledDate"
                  type="date"
                  value={formData.scheduledDate}
                  onChange={(e) =>
                    setFormData((p) => ({ ...p, scheduledDate: e.target.value }))
                  }
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="status">Publication Status</Label>
                <Select
                  value={formData.status}
                  onValueChange={(val) =>
                    setFormData((p) => ({ ...p, status: val }))
                  }
                >
                  <SelectTrigger id="status">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Published">Published (Active)</SelectItem>
                    <SelectItem value="Draft">Draft (Hidden)</SelectItem>
                    <SelectItem value="Scheduled">Scheduled</SelectItem>
                    <SelectItem value="Archived">Archived</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Section 2: Scoring & Timing Rules */}
          <div className="space-y-4 pt-3 border-t border-border">
            <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[11px] font-bold text-primary-foreground">
                2
              </span>
              Exam Rules & Timing
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="totalMarks">Total Marks</Label>
                <Input
                  id="totalMarks"
                  type="number"
                  min="10"
                  max="200"
                  value={formData.totalMarks}
                  onChange={(e) =>
                    setFormData((p) => ({ ...p, totalMarks: e.target.value }))
                  }
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="durationMins">Duration (Minutes)</Label>
                <Input
                  id="durationMins"
                  type="number"
                  min="15"
                  max="300"
                  value={formData.durationMins}
                  onChange={(e) =>
                    setFormData((p) => ({ ...p, durationMins: e.target.value }))
                  }
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="passingPercentage">Passing Criteria (%)</Label>
                <Input
                  id="passingPercentage"
                  type="number"
                  min="33"
                  max="100"
                  value={formData.passingPercentage}
                  onChange={(e) =>
                    setFormData((p) => ({
                      ...p,
                      passingPercentage: e.target.value,
                    }))
                  }
                />
              </div>
            </div>

            {/* Instructions */}
            <div className="space-y-1.5">
              <Label htmlFor="instructions">General Student Instructions</Label>
              <Textarea
                id="instructions"
                rows={2}
                placeholder="Write exam guidelines and rules here..."
                value={formData.instructions}
                onChange={(e) =>
                  setFormData((p) => ({ ...p, instructions: e.target.value }))
                }
              />
            </div>
          </div>

          {/* Section 3: Question Bank & Builder */}
          <div className="space-y-4 pt-3 border-t border-border">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[11px] font-bold text-primary-foreground">
                  3
                </span>
                Question Paper Builder ({formData.questions.length} Questions)
              </h3>
            </div>

            {/* Questions List */}
            {formData.questions.length > 0 ? (
              <div className="space-y-2.5 max-h-56 overflow-y-auto p-1">
                {formData.questions.map((q, idx) => (
                  <div
                    key={q.id || idx}
                    className="flex items-start justify-between gap-3 p-3 rounded-lg border border-border bg-muted/30 hover:bg-muted/60 transition"
                  >
                    <div className="space-y-1 flex-1 min-w-0">
                      <div className="flex items-center gap-2 text-xs">
                        <span className="font-bold text-primary">Q{idx + 1}.</span>
                        <span className="uppercase text-[10px] font-semibold tracking-wider px-1.5 py-0.5 rounded bg-primary/10 text-primary">
                          {q.type}
                        </span>
                        <span className="text-muted-foreground font-medium">
                          ({q.marks} Marks)
                        </span>
                      </div>
                      <p className="text-sm font-medium text-foreground line-clamp-2">
                        {q.question}
                      </p>
                      {q.type === "mcq" && q.options && (
                        <div className="text-xs text-muted-foreground flex flex-wrap gap-2 pt-1">
                          {q.options.map((opt, i) => (
                            <span
                              key={i}
                              className={`px-2 py-0.5 rounded border text-[11px] ${
                                opt === q.correctAnswer
                                  ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30 font-medium"
                                  : "border-border"
                              }`}
                            >
                              {String.fromCharCode(65 + i)}. {opt}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-destructive hover:bg-destructive/10"
                      onClick={() => handleRemoveQuestion(q.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6 border border-dashed border-border rounded-xl text-muted-foreground text-sm">
                No questions added yet. Use the question builder below to add questions.
              </div>
            )}

            {/* Inline Question Add Box */}
            <div className="p-4 rounded-xl border border-primary/20 bg-primary/5 space-y-3 mt-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wider text-primary flex items-center gap-1.5">
                  <Sparkles className="h-3.5 w-3.5" />
                  Add New Question to Paper
                </span>
                <div className="flex items-center gap-2">
                  <Select
                    value={newQuestionType}
                    onValueChange={setNewQuestionType}
                  >
                    <SelectTrigger className="h-7 text-xs w-32 bg-card">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="mcq">MCQ (Options)</SelectItem>
                      <SelectItem value="short">Short Question</SelectItem>
                      <SelectItem value="long">Long Question</SelectItem>
                    </SelectContent>
                  </Select>
                  <Input
                    type="number"
                    placeholder="Marks"
                    className="h-7 w-20 text-xs bg-card"
                    value={newQMarks}
                    onChange={(e) => setNewQMarks(e.target.value)}
                  />
                </div>
              </div>

              <Input
                placeholder="Type your question statement here..."
                value={newQText}
                onChange={(e) => setNewQText(e.target.value)}
                className="bg-card"
              />

              {/* If MCQ -> Show 4 Options */}
              {newQuestionType === "mcq" && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                  {newOptions.map((opt, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <span className="text-xs font-bold text-muted-foreground w-4">
                        {String.fromCharCode(65 + i)}:
                      </span>
                      <Input
                        placeholder={`Option ${String.fromCharCode(65 + i)}`}
                        value={opt}
                        onChange={(e) => {
                          const updated = [...newOptions];
                          updated[i] = e.target.value;
                          setNewOptions(updated);
                        }}
                        className="bg-card h-8 text-xs"
                      />
                      <input
                        type="radio"
                        name="correctOpt"
                        checked={newCorrectOption === String(i)}
                        onChange={() => setNewCorrectOption(String(i))}
                        title="Mark as correct answer"
                        className="cursor-pointer"
                      />
                    </div>
                  ))}
                </div>
              )}

              {/* If Short or Long -> Answer Guide */}
              {(newQuestionType === "short" || newQuestionType === "long") && (
                <Input
                  placeholder="Optional: Key marking points or model answer guide"
                  value={newAnswerGuide}
                  onChange={(e) => setNewAnswerGuide(e.target.value)}
                  className="bg-card text-xs h-8"
                />
              )}

              <div className="flex justify-end pt-1">
                <Button
                  type="button"
                  size="sm"
                  variant="secondary"
                  className="text-xs font-semibold h-8"
                  onClick={handleAddQuestion}
                >
                  <Plus className="h-3.5 w-3.5 mr-1" />
                  Add This Question
                </Button>
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-border">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="px-5"
            >
              Cancel
            </Button>
            <Button type="submit" variant="default" className="px-6 shadow-md">
              {isEditing ? "Save Changes" : "Create Exam Paper"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
