import React from "react";
import { Button } from "@/components/ui/button";
import { Trash2, GripVertical, SquarePen } from "lucide-react";

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

// Sortable Item
function SortableItem({ id, question, type, onEdit, onDelete }) {
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
        <SquarePen
          className="size-4 text-muted-foreground cursor-pointer"
          onClick={() => onEdit(id)}
        />
        <Trash2
          className="size-4 text-muted-foreground cursor-pointer"
          onClick={() => onDelete(id)}
        />
      </div>
    </div>
  );
}

// Main
export default function ChapterMCQs({
  chapter,
  setDrawerOpen,
  setEditingQuestion,
  onUpdateQuestions,
}) {
  if (!chapter) return null;

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } })
  );

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIndex = chapter.questions.findIndex((q) => q.id === active.id);
    const newIndex = chapter.questions.findIndex((q) => q.id === over.id);
    const updated = arrayMove(chapter.questions, oldIndex, newIndex);
    onUpdateQuestions(updated);
  };

  const handleDelete = (id) => {
    const updated = chapter.questions.filter((q) => q.id !== id);
    onUpdateQuestions(updated);
  };

  const handleEdit = (id) => {
    const questionToEdit = chapter.questions.find((q) => q.id === id);
    setEditingQuestion(questionToEdit);
    setDrawerOpen(true);
  };

  return (
    <div className="bg-background relative p-10 h-full">
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={chapter.questions.map((q) => q.id)}
          strategy={verticalListSortingStrategy}
        >
          <div className="space-y-3">
            {chapter.questions.map((q) => (
              <SortableItem
                key={q.id}
                id={q.id}
                question={q.question}
                type={q.type}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>

      <div className="pb-5 mt-8 flex justify-center lg:justify-start">
        <Button
          onClick={() => {
            setEditingQuestion(null);
            setDrawerOpen(true);
          }}
          className="w-full lg:w-auto"
        >
          Add More
        </Button>
      </div>
    </div>
  );
}
