import React, { useRef } from "react";
import {
  X,
  Printer,
  Copy,
  Download,
  CheckCircle2,
  Clock,
  Award,
  BookOpen,
  School,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function PaperPreviewModal({ open, onClose, paper }) {
  const printRef = useRef(null);

  if (!open || !paper) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleCopyQuestions = () => {
    let text = `${paper.title}\nClass: ${paper.className} | Subject: ${paper.subject} | Marks: ${paper.totalMarks}\nTime Allowed: ${paper.durationMins} Minutes\n\n`;
    text += `INSTRUCTIONS: ${paper.instructions || "Answer all questions"}\n\n`;

    if (paper.questions && paper.questions.length > 0) {
      paper.questions.forEach((q, i) => {
        text += `Q${i + 1}. [${q.marks || 2} Marks] ${q.question}\n`;
        if (q.type === "mcq" && q.options) {
          q.options.forEach((opt, oIdx) => {
            text += `   (${String.fromCharCode(65 + oIdx)}) ${opt}\n`;
          });
        }
        text += `\n`;
      });
    }

    navigator.clipboard.writeText(text);
    toast.success("Exam paper content copied to clipboard!");
  };

  const mcqQuestions =
    paper.questions?.filter((q) => q.type === "mcq") || [];
  const shortQuestions =
    paper.questions?.filter((q) => q.type === "short") || [];
  const longQuestions =
    paper.questions?.filter((q) => q.type === "long") || [];

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 overflow-y-auto print:p-0 print:bg-white">
      <div className="bg-card text-card-foreground border border-border rounded-2xl shadow-2xl w-full max-w-4xl max-h-[94vh] flex flex-col my-auto overflow-hidden animate-in fade-in zoom-in-95 duration-200 print:border-none print:shadow-none print:max-h-full print:w-full">
        {/* Modal Top Control Bar (Hidden when printing) */}
        <div className="flex items-center justify-between px-6 py-3.5 border-b border-border bg-muted/40 print:hidden">
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs font-semibold px-2 py-0.5 rounded bg-primary/10 text-primary border border-primary/20">
              {paper.examCode || "EXAM"}
            </span>
            <h2 className="text-sm sm:text-base font-semibold truncate max-w-md">
              Exam Paper Preview — {paper.className}
            </h2>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleCopyQuestions}
              className="text-xs h-8"
            >
              <Copy className="h-3.5 w-3.5 mr-1" />
              Copy
            </Button>
            <Button
              variant="default"
              size="sm"
              onClick={handlePrint}
              className="text-xs h-8 shadow-sm"
            >
              <Printer className="h-3.5 w-3.5 mr-1" />
              Print Paper
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="h-8 w-8 rounded-full ml-1"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Printable Paper Sheet View */}
        <div
          ref={printRef}
          className="flex-1 overflow-y-auto p-6 sm:p-10 bg-background print:p-6 space-y-6 text-foreground font-serif"
        >
          {/* Formal School Exam Header */}
          <div className="border-b-2 border-foreground pb-4 text-center space-y-1">
            <div className="flex items-center justify-center gap-2">
              <School className="h-6 w-6 text-primary print:text-black" />
              <h1 className="text-xl sm:text-2xl font-bold uppercase tracking-wider font-sans">
                ACADEMIC EXCELLENCE SYSTEM
              </h1>
            </div>
            <h2 className="text-sm font-semibold uppercase text-muted-foreground font-sans print:text-black">
              {paper.term || "Examination"} • Academic Session 2025-2026
            </h2>
            <div className="pt-2 text-lg font-bold underline underline-offset-4 uppercase">
              {paper.title}
            </div>

            {/* Exam Meta Info Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-3 text-xs sm:text-sm font-sans border-t border-border mt-3">
              <div>
                <span className="font-bold">Class:</span> {paper.className}
              </div>
              <div>
                <span className="font-bold">Subject:</span> {paper.subject}
              </div>
              <div>
                <span className="font-bold">Time Allowed:</span>{" "}
                {paper.durationMins} Mins
              </div>
              <div>
                <span className="font-bold">Total Marks:</span>{" "}
                {paper.totalMarks}
              </div>
            </div>

            {/* Student ID info row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-3 text-xs font-sans text-left">
              <div className="flex items-center gap-2 border-b border-border/80 pb-1">
                <span className="font-semibold">Candidate Name:</span>
                <span className="flex-1 border-b border-dotted border-muted-foreground/60 h-4"></span>
              </div>
              <div className="flex items-center gap-2 border-b border-border/80 pb-1">
                <span className="font-semibold">Roll Number / ID:</span>
                <span className="flex-1 border-b border-dotted border-muted-foreground/60 h-4"></span>
              </div>
            </div>
          </div>

          {/* Instructions Box */}
          <div className="bg-muted/30 border border-border p-3.5 rounded-lg text-xs font-sans space-y-1 print:bg-white print:border-black">
            <p className="font-bold uppercase tracking-wide text-foreground">
              General Instructions:
            </p>
            <ul className="list-disc list-inside space-y-0.5 text-muted-foreground print:text-black">
              <li>{paper.instructions || "Answer all questions in the provided answer sheet."}</li>
              <li>Calculators and electronic communication devices are not permitted unless specified.</li>
              <li>Read each question carefully before attempting. Write legibly and neatly.</li>
            </ul>
          </div>

          {/* SECTION A: Multiple Choice Questions */}
          {mcqQuestions.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-border pb-1">
                <h3 className="font-bold font-sans text-sm sm:text-base uppercase">
                  Section A: Multiple Choice Questions
                </h3>
                <span className="text-xs font-sans font-bold text-muted-foreground print:text-black">
                  [Marks: {mcqQuestions.reduce((acc, q) => acc + (q.marks || 2), 0)}]
                </span>
              </div>

              <div className="space-y-4">
                {mcqQuestions.map((q, idx) => (
                  <div key={q.id || idx} className="space-y-2 text-sm">
                    <div className="flex items-start justify-between gap-2 font-medium">
                      <span>
                        <span className="font-bold font-sans mr-2">
                          Q{idx + 1}.
                        </span>
                        {q.question}
                      </span>
                      <span className="text-xs font-sans text-muted-foreground whitespace-nowrap print:text-black">
                        ({q.marks || 2})
                      </span>
                    </div>

                    {q.options && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pl-6 font-sans text-xs">
                        {q.options.map((opt, oIdx) => (
                          <div
                            key={oIdx}
                            className="flex items-center gap-2 p-1.5 rounded border border-border/60 print:border-none"
                          >
                            <span className="font-bold text-muted-foreground w-5 print:text-black">
                              ({String.fromCharCode(65 + oIdx)})
                            </span>
                            <span>{opt}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* SECTION B: Short Answer Questions */}
          {shortQuestions.length > 0 && (
            <div className="space-y-4 pt-2">
              <div className="flex items-center justify-between border-b border-border pb-1">
                <h3 className="font-bold font-sans text-sm sm:text-base uppercase">
                  Section B: Short Answer Questions
                </h3>
                <span className="text-xs font-sans font-bold text-muted-foreground print:text-black">
                  [Marks: {shortQuestions.reduce((acc, q) => acc + (q.marks || 4), 0)}]
                </span>
              </div>

              <div className="space-y-4">
                {shortQuestions.map((q, idx) => (
                  <div key={q.id || idx} className="space-y-2 text-sm">
                    <div className="flex items-start justify-between gap-2 font-medium">
                      <span>
                        <span className="font-bold font-sans mr-2">
                          Q{mcqQuestions.length + idx + 1}.
                        </span>
                        {q.question}
                      </span>
                      <span className="text-xs font-sans text-muted-foreground whitespace-nowrap print:text-black">
                        ({q.marks || 4})
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* SECTION C: Long / Essay Questions */}
          {longQuestions.length > 0 && (
            <div className="space-y-4 pt-2">
              <div className="flex items-center justify-between border-b border-border pb-1">
                <h3 className="font-bold font-sans text-sm sm:text-base uppercase">
                  Section C: Detailed / Descriptive Questions
                </h3>
                <span className="text-xs font-sans font-bold text-muted-foreground print:text-black">
                  [Marks: {longQuestions.reduce((acc, q) => acc + (q.marks || 10), 0)}]
                </span>
              </div>

              <div className="space-y-4">
                {longQuestions.map((q, idx) => (
                  <div key={q.id || idx} className="space-y-2 text-sm">
                    <div className="flex items-start justify-between gap-2 font-medium">
                      <span>
                        <span className="font-bold font-sans mr-2">
                          Q{mcqQuestions.length + shortQuestions.length + idx + 1}.
                        </span>
                        {q.question}
                      </span>
                      <span className="text-xs font-sans text-muted-foreground whitespace-nowrap print:text-black">
                        ({q.marks || 10})
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* End of Examination Paper Sign */}
          <div className="text-center pt-8 border-t border-border font-sans text-xs text-muted-foreground print:text-black uppercase tracking-widest">
            *** End of Question Paper ***
          </div>
        </div>
      </div>
    </div>
  );
}
