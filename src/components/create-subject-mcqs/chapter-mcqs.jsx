import React, { useState, useEffect } from "react";
import { Trash2, GripVertical, SquarePen } from "lucide-react";
import { Button } from "@/components/ui/button";

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
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

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
      className="flex items-center justify-between bg-card border border-border rounded-lg p-3 shadow-sm"
    >
      <div className="flex items-center gap-3 min-w-0">
        <GripVertical
          className="text-muted-foreground size-5 cursor-grab shrink-0"
          {...listeners}
          {...attributes}
        />
        <div className="min-w-0">
          <p className="font-medium truncate">{question}</p>
          <p className="text-sm text-muted-foreground">
            {type === "single" ? "Content Block" : "Video"}
          </p>
        </div>
      </div>
      <div className="flex items-center gap-2 shrink-0">
        <SquarePen className="size-4 text-muted-foreground cursor-pointer" />
        <Trash2 className="size-4 text-muted-foreground cursor-pointer" />
      </div>
    </div>
  );
}

// -------------------- Main Component --------------------
export default function ChapterMCQs({ chapter, setDrawerOpen }) {
  const [questions, setQuestions] = useState(chapter?.questions || []);

  useEffect(() => {
    setQuestions(chapter?.questions || []);
  }, [chapter]);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } })
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
      <div className=" bg-background min-h-[60vh] flex flex-col items-center justify-center text-center text-muted-foreground px-4">
        <img
          src="/data-not-found.svg"
          alt="No data"
          className="w-32 h-32 sm:w-40 sm:h-40 object-contain"
        />
        <h1 className="text-lg sm:text-xl font-bold">No Data Found</h1>
        <p className="text-sm">Please select a chapter to view questions.</p>
      </div>
    );
  }

  return (
    <div className=" bg-background relative p-10 h-full">
      {/* Scrollable Questions */}
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={questions.map((q) => q.id)}
          strategy={verticalListSortingStrategy}
        >
          <div className="space-y-3">
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

      {/* Responsive Button */}
      <div className="pb-5 mt-8 flex justify-center lg:justify-start">
        <Button
          onClick={() => setDrawerOpen(true)}
          className="w-full lg:w-auto"
        >
          Add More
        </Button>
      </div>
    </div>
  );
}
