"use client";

import React, { useState, useEffect } from "react";
import { Eye, Trash2, GripVertical, SquarePen } from "lucide-react";
import { Button } from "@/components/ui/Button";

import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay,
} from "@dnd-kit/core";

import {
  arrayMove,
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";

import { CSS } from "@dnd-kit/utilities";

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
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 999 : undefined,
    cursor: isDragging ? "grabbing" : "default",
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="flex items-center justify-between bg-card border border-border rounded-lg p-3 shadow-sm"
    >
      <div className="flex items-center gap-3">
        {/* Drag handle: listeners & attributes ONLY on GripVertical icon */}
        <GripVertical
          className="text-muted-foreground size-5 cursor-grab"
          {...listeners}
          {...attributes}
        />
        <div>
          <p className="font-medium">{question}</p>
          <p className="text-sm text-muted-foreground">
            {type === "single" ? "Content Block" : "Video"}
          </p>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2">
        <SquarePen className="size-4 text-muted-foreground cursor-pointer"
        />
        <Trash2 className="size-4 text-muted-foreground cursor-pointer"
        />
      </div>
    </div>
  );
}

export default function ChapterMCQs({ chapter, setDrawerOpen }) {
  const [questions, setQuestions] = useState(chapter?.questions || []);
  const [activeId, setActiveId] = useState(null);

  // Update questions when chapter changes
  useEffect(() => {
    setQuestions(chapter?.questions || []);
  }, [chapter]);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    })
  );

  if (!chapter) {
    return (
      <div className="flex-1 min-w-0 p-6 flex flex-col items-center justify-center text-muted-foreground gap-4">
        <img
          src="/data-not-found.svg"
          alt="No data"
          className="w-48 h-48 object-contain"
        />
        <h1 className="text-2xl font-bold">No Data Found</h1>
        <p>Please select a chapter to view questions.</p>
      </div>
    );
  }

  function handleDragStart(event) {
    setActiveId(event.active.id);
  }

  function handleDragEnd(event) {
    const { active, over } = event;
    setActiveId(null);

    if (active.id !== over?.id) {
      const oldIndex = questions.findIndex((q) => q.id === active.id);
      const newIndex = questions.findIndex((q) => q.id === over.id);

      setQuestions((items) => arrayMove(items, oldIndex, newIndex));
    }
  }

  return (
    <div className="flex-1 min-w-0 p-6 bg-background font-[var(--font-roboto-para)]">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-[var(--font-monstrat-hadding)]">
          {chapter.title}
        </h2>
        <Button variant="outline" size="sm">
          <Eye className="size-4 mr-2" />
          Preview
        </Button>
      </div>

      {/* Draggable questions list */}
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
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

        <DragOverlay>
          {activeId ? (
            <div className="bg-card border border-border rounded-lg p-3 shadow-sm cursor-grabbing">
              {questions.find((q) => q.id === activeId)?.question}
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>

      {/* Add More Button */}
      <div className="mt-6">
        <Button onClick={() => setDrawerOpen(true)} className="w-full sm:w-auto">
          Add More
        </Button>
      </div>
    </div>
  );
}
