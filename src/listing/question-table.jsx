"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Eye, MoreVertical } from "lucide-react";
import CreateAssessmentForm from "./CreateAssessmentForm";
import CreateDrawer from "./Drawer";

export default function AssessmentPage() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [questions, setQuestions] = useState([]);

  const handleAddQuestion = (newData) => {
    const newQuestion = {
      id: Date.now(),
      type: newData.type,
      question: newData.question,
    };
    setQuestions((prev) => [...prev, newQuestion]);
  };

  return (
    <div className="flex h-screen bg-muted/50 text-foreground">
      {/* Left Column */}
      <div className="w-full max-w-sm border-r border-border bg-background p-6 space-y-4">
        <CreateAssessmentForm onSubmit={handleAddQuestion} />
      </div>

      {/* Right Side */}
      <div className="flex-1 p-6 bg-background flex flex-col ">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Questions {questions.length}</h2>
          <Button variant="outline">
            <Eye className="size-4 mr-2" />
            Preview
          </Button>
        </div>

        {/* Questions List */}
        <div className="flex-1 space-y-3 ">
          {questions.map((q, idx) => (
            <div
              key={q.id}
              className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm flex justify-between items-start"
            >
              <div>
                <p className="text-sm font-medium">Q{idx + 1}: {q.question}</p>
                <p className="text-xs text-gray-500">
                  {q.type === "single" ? "Single Choice" : "Multi Choice"}
                </p>
              </div>
              {/* Three-dot menu */}
              <button className="text-gray-400 hover:text-gray-600">
                <MoreVertical className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>

        {/* Add More Button at Bottom */}
        <div className="mt-6">
          <Button onClick={() => setDrawerOpen(true)} variant="default">
            Add More
          </Button>
        </div>
      </div>

      {/* Drawer */}
      <CreateDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        onSubmit={handleAddQuestion}
      />
    </div>
  );
}
