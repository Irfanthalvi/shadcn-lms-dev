"use client";

import React from "react";
import {
  Trash2,
  ChevronDown,
  ChevronUp,
  GripVertical,
  SquarePen,
} from "lucide-react";
import { Button } from "@/components/ui/button";

import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";

import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";

// ----------------- Sortable Chapter Item -----------------
function SortableChapterItem({
  id,
  chapter,
  bookIndex,
  chapterIndex,
  openChapterModal,
  handleDeleteChapter,
  onChapterClick,
}) {
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
    backgroundColor: isDragging ? "rgba(255 255 255 / 0.9)" : undefined,
    boxShadow: isDragging ? "0 4px 10px rgb(0 0 0 / 0.15)" : undefined,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="flex items-center justify-between py-2 rounded-md hover:bg-muted hover:shadow-sm cursor-pointer transition-colors"
      {...attributes}
      {...listeners}
    >
      {/* Chapter title with drag handle */}
      <div
        className="flex items-center gap-3 w-full min-w-0"
        onClick={() => onChapterClick(bookIndex, chapterIndex)}
      >
        <GripVertical className="size-4 text-muted-foreground shrink-0 cursor-grab" />
        <span className="text-sm font-medium text-foreground truncate hover:text-primary">
          {chapter.title}
        </span>
      </div>

      {/* Chapter icons aligned in a single row */}
      <div className="flex items-center gap-3 shrink-0">
        <SquarePen
          className="size-4 text-muted-foreground cursor-pointer hover:text-foreground"
          onClick={() => openChapterModal(bookIndex, chapterIndex)}
        />
        <Trash2
          className="size-4 text-destructive cursor-pointer hover:text-red-600"
          onClick={() => handleDeleteChapter(bookIndex, chapterIndex)}
        />
        <Button variant="ghost" size="icon">
          <ChevronDown className="size-4" />
        </Button>
      </div>
    </div>
  );
}

// ----------------- Chapter List with Drag & Drop -----------------
function ChapterSortableList({
  chapters,
  bookIndex,
  openChapterModal,
  handleDeleteChapter,
  onChapterClick,
  onChapterDragEnd,
}) {
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } })
  );

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={onChapterDragEnd}
    >
      <SortableContext
        items={chapters.map((c) => c.title)}
        strategy={verticalListSortingStrategy}
      >
        {/* Responsive padding: pl-0 on mobile, pl-5 on sm+ */}
        <div className="pl-0 sm:pl-5 space-y-2">
          {chapters.map((chap, cIndex) => (
            <SortableChapterItem
              key={chap.title}
              id={chap.title}
              chapter={chap}
              bookIndex={bookIndex}
              chapterIndex={cIndex}
              openChapterModal={openChapterModal}
              handleDeleteChapter={handleDeleteChapter}
              onChapterClick={onChapterClick}
            />
          ))}

          <div
            className="flex items-center justify-between py-2 cursor-pointer hover:bg-muted px-2 rounded"
            onClick={() => openChapterModal(bookIndex)}
          >
            <div className="flex items-center gap-3 w-full min-w-0">
              <label className="text-sm text-primary font-medium p-1">
                + Add Chapter
              </label>
            </div>
          </div>
        </div>
      </SortableContext>
    </DndContext>
  );
}

// ----------------- Sortable Book Item -----------------
function SortableBook({
  id,
  book,
  index,
  setEditingBookIndex,
  setNewBook,
  setOpenDialog,
  toggleExpand,
  expandedIndex,
  openChapterModal,
  handleDeleteBook,
  onChapterClick,
  handleDeleteChapter,
  onChapterDragEnd,
}) {
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
    backgroundColor: isDragging ? "rgba(255 255 255 / 0.9)" : undefined,
    boxShadow: isDragging ? "0 4px 10px rgb(0 0 0 / 0.15)" : undefined,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="mb-2 rounded-md bg-background"
      {...attributes}
      {...listeners}
    >
      {/* Book header */}
      <div
        className="flex items-center justify-between py-3 h-12 rounded-md hover:bg-muted hover:shadow-sm cursor-pointer transition-colors"
        onClick={() => toggleExpand(index)}
      >
        <div className="flex items-center gap-3 w-full min-w-0">
          <GripVertical className="size-4 text-muted-foreground shrink-0 cursor-grab" />
          <span className="text-base font-medium text-foreground truncate hover:text-primary">
            {book.title}
          </span>
        </div>

        {/* Book icons */}
        <div className="flex items-center gap-3 shrink-0">
          <SquarePen
            className="size-4 text-muted-foreground cursor-pointer hover:text-foreground"
            onClick={() => {
              setEditingBookIndex(index);
              setNewBook(book.title);
              setOpenDialog(true);
            }}
          />
          <Trash2
            className="size-4 text-destructive cursor-pointer"
            onClick={() => handleDeleteBook(index)}
          />
          <Button variant="ghost" size="icon">
            {expandedIndex === index ? (
              <ChevronUp className="size-4" />
            ) : (
              <ChevronDown className="size-4" />
            )}
          </Button>
        </div>
      </div>

      {/* Chapter list */}
      {expandedIndex === index && (
        <ChapterSortableList
          chapters={book.chapters}
          bookIndex={index}
          openChapterModal={openChapterModal}
          handleDeleteChapter={handleDeleteChapter}
          onChapterClick={onChapterClick}
          onChapterDragEnd={onChapterDragEnd}
        />
      )}
    </div>
  );
}

export { SortableBook, ChapterSortableList };
