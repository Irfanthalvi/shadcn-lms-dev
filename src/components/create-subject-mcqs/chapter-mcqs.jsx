import React, { useState, useEffect } from "react";
import { Eye, Trash2, GripVertical, SquarePen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";

import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";

import {
  arrayMove,
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";

// -------------------- Sortable Item --------------------
function SortableItem({ id, question, type }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id });

  const style = {
    transform: transform ? `translateY(${transform.y}px)` : undefined,
    transition,
    zIndex: isDragging ? 999 : undefined,
    cursor: isDragging ? "grabbing" : "default",
    opacity: isDragging ? 0.8 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="flex flex-wrap sm:flex-nowrap items-start sm:items-center justify-between bg-card border border-border rounded-lg p-3 shadow-sm gap-3"
    >
      <div className="flex items-start gap-3 flex-1 min-w-0">
        <GripVertical
          className="text-muted-foreground size-5 cursor-grab shrink-0"
          {...listeners}
          {...attributes}
        />
        <div className="min-w-0">
          <p className="font-medium break-words">{question}</p>
          <p className="text-sm text-muted-foreground">
            {type === "single" ? "Content Block" : "Video"}
          </p>
        </div>
      </div>
      <div className="flex gap-2 shrink-0">
        <SquarePen className="size-4 text-muted-foreground cursor-pointer" />
        <Trash2 className="size-4 text-muted-foreground cursor-pointer" />
      </div>
    </div>
  );
}

// -------------------- Main Component --------------------
export default function ChapterMCQs({ chapter, setDrawerOpen }) {
  const [questions, setQuestions] = useState(chapter?.questions || []);
  const [displayMode, setDisplayMode] = useState("table");

  useEffect(() => {
    setQuestions(chapter?.questions || []);
    setDisplayMode("table");
  }, [chapter]);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 5 },
    })
  );

  function handleDragEnd(event) {
    const { active, over } = event;
    if (active.id !== over?.id) {
      const oldIndex = questions.findIndex((q) => q.id === active.id);
      const newIndex = questions.findIndex((q) => q.id === over.id);
      setQuestions((items) => arrayMove(items, oldIndex, newIndex));
    }
  }

  if (!chapter) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-muted">
        <div className="text-center">
          <img
            src="/data-not-found.svg"
            alt="No data"
            className="w-40 h-40 sm:w-48 sm:h-48 object-contain"
          />
          <h2 className="mt-4 text-lg font-semibold text-foreground">
            No Content Available
          </h2>
          <p className="text-muted-foreground text-sm mt-2">
            Please select a section to get started.
          </p>
        </div>
      </div>


    );
  }

  return (
    <div className="flex-1 h-full min-w-0 px-4 sm:px-6 lg:px-8 py-6 bg-background font-[var(--font-roboto-para)] relative overflow-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
        <h2 className="text-lg sm:text-xl font-[var(--font-monstrat-hadding)] break-words">
          {chapter.title}
        </h2>
        <Button
          variant="outline"
          size="sm"
          onClick={() =>
            setDisplayMode(displayMode === "table" ? "preview" : "table")
          }
          className="w-full sm:w-auto"
        >
          <Eye className="size-4 mr-2" />
          {displayMode === "table" ? "Preview" : "Back to Table"}
        </Button>
      </div>

      {/* Table Mode */}
      {displayMode === "table" && (
        <>
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={questions.map((q) => q.id)}
              strategy={verticalListSortingStrategy}
            >
              <div className="space-y-2">
                {questions.map((q) => (
                  <SortableItem
                    key={q.id}
                    id={q.id}
                    question={q.question}
                    type={q.type}
                  />
                ))}
              </div>
            </SortableContext>
          </DndContext>

          {/* Add More Button */}
          <div className="mt-6">
            <Button
              onClick={() => setDrawerOpen(true)}
              className="mt-4 sm:mt-auto w-full sm:w-48 fixed bottom-5"
            >
              Add More
            </Button>

          </div>
        </>
      )}

      {/* Preview Mode */}
      {displayMode === "preview" && (
        <div className="space-y-8">
          {/* Assessment Title & Description */}
          <div>
            <h1 className="text-xl sm:text-2xl font-bold">Final Assessment</h1>
            <h2 className="text-lg sm:text-xl font-semibold mt-2">
              Treatment Modalities &amp; Basic Principles
            </h2>
            <p className="text-gray-600 mt-2 max-w-prose">
              Test your understanding of the core principles and techniques
              covered in this module. This assessment consists of
              multiple-choice and single-choice questions designed to evaluate
              your knowledge.
            </p>
          </div>

          {/* Questions */}
          {questions.map((q, index) => (
            <div key={q.id} className="space-y-3">
              {/* Question */}
              <p className="font-semibold text-base sm:text-lg">
                {index + 1}. {q.question}
              </p>

              {/* Options */}
              <div className="space-y-2">
                {q.type === "single" ? (
                  <RadioGroup>
                    {q.options.map((opt, i) => (
                      <label
                        key={i}
                        htmlFor={`q${q.id}-opt${i}`}
                        className="flex flex-wrap items-center gap-3 w-full cursor-pointer border rounded-lg px-4 py-2 hover:bg-gray-50"
                      >
                        <RadioGroupItem
                          value={opt.value}
                          id={`q${q.id}-opt${i}`}
                        />
                        <span className="text-base break-words">
                          {opt.value}
                        </span>
                      </label>
                    ))}
                  </RadioGroup>
                ) : (
                  <>
                    {q.options.map((opt, i) => (
                      <label
                        key={i}
                        htmlFor={`q${q.id}-opt${i}`}
                        className="flex flex-wrap items-center gap-3 w-full cursor-pointer border rounded-lg px-4 py-2 hover:bg-gray-50"
                      >
                        <Checkbox id={`q${q.id}-opt${i}`} />
                        <span className="text-base break-words">
                          {opt.value}
                        </span>
                      </label>
                    ))}
                    <p className="text-sm text-gray-500 mt-1 uppercase font-medium">
                      Select all that apply
                    </p>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
