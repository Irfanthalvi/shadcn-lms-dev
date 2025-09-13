"use client";

import React, { useState } from "react";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";

import AddBook from "../dialog/subject-dialog";
import { Button } from "@/components/ui/button";
import AddChapter from "../dialog/chapter-dialog";
import { SortableBook } from "../dnd -kit/drag-drop";

const CreateAssessmentForm = ({ books, setBooks, onChapterClick }) => {
  const [newBook, setNewBook] = useState("");
  const [openDialog, setOpenDialog] = useState(false);
  const [expandedIndex, setExpandedIndex] = useState(null);
  const [editingBookIndex, setEditingBookIndex] = useState(null);
  const [chapterDialog, setChapterDialog] = useState(false);
  const [chapterData, setChapterData] = useState({
    title: "",
    desc: "",
    time: "",
  });
  const [activeBookIndex, setActiveBookIndex] = useState(null);
  const [editingChapterIndex, setEditingChapterIndex] = useState(null);
  const [editingBookIndexForChapter, setEditingBookIndexForChapter] =
    useState(null);

  const toggleExpand = (index) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  const openChapterModal = (bookIndex, chapterIndex = null) => {
    setActiveBookIndex(bookIndex);

    if (chapterIndex !== null) {
      const chapter = books[bookIndex].chapters[chapterIndex];
      setChapterData(chapter);
      setEditingChapterIndex(chapterIndex);
      setEditingBookIndexForChapter(bookIndex);
    } else {
      setChapterData({ title: "", desc: "", time: "" });
      setEditingChapterIndex(null);
      setEditingBookIndexForChapter(null);
    }

    setChapterDialog(true);
  };

  const handleAddBook = () => {
    if (newBook.trim() === "") return;

    const trimmed = newBook.trim();
    if (editingBookIndex !== null) {
      const updated = [...books];
      updated[editingBookIndex] = {
        ...updated[editingBookIndex],
        title: trimmed,
      };
      setBooks(updated);
      setEditingBookIndex(null);
    } else {
      setBooks([...books, { title: trimmed, chapters: [] }]);
    }

    setNewBook("");
    setOpenDialog(false);
  };

  const handleDeleteBook = (index) => {
    setBooks(books.filter((_, i) => i !== index));

    if (expandedIndex === index) {
      setExpandedIndex(null);
    } else if (expandedIndex !== null && index < expandedIndex) {
      setExpandedIndex(expandedIndex - 1);
    }
  };

  const handleAddChapter = (formData) => {
    const updated = [...books];

    if (editingChapterIndex !== null && editingBookIndexForChapter !== null) {
      updated[editingBookIndexForChapter].chapters[editingChapterIndex] = {
        ...formData,
        questions:
          updated[editingBookIndexForChapter].chapters[editingChapterIndex]
            ?.questions || [],
      };
    } else {
      updated[activeBookIndex].chapters.push({
        ...formData,
        questions: [],
      });
    }

    setBooks(updated);
    setChapterDialog(false);
    setChapterData({ title: "", desc: "", time: "" });
    setEditingChapterIndex(null);
    setEditingBookIndexForChapter(null);
  };

  const handleDeleteChapter = (bookIndex, chapterIndex) => {
    const updated = [...books];
    updated[bookIndex].chapters.splice(chapterIndex, 1);
    setBooks(updated);
  };

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 5 },
    })
  );

  function handleBooksDragEnd(event) {
    const { active, over } = event;
    if (!over) return;
    if (active.id !== over.id) {
      const oldIndex = books.findIndex((b) => b.title === active.id);
      const newIndex = books.findIndex((b) => b.title === over.id);
      setBooks(arrayMove(books, oldIndex, newIndex));

      if (expandedIndex === oldIndex) {
        setExpandedIndex(newIndex);
      } else if (
        expandedIndex !== null &&
        oldIndex < expandedIndex &&
        newIndex >= expandedIndex
      ) {
        setExpandedIndex(expandedIndex - 1);
      } else if (
        expandedIndex !== null &&
        oldIndex > expandedIndex &&
        newIndex <= expandedIndex
      ) {
        setExpandedIndex(expandedIndex + 1);
      }
    }
  }

  function handleChaptersDragEnd(event) {
    const { active, over } = event;
    if (!over) return;
    if (active.id !== over.id) {
      const bookIndex = expandedIndex;
      if (bookIndex === null) return;

      const oldIndex = books[bookIndex].chapters.findIndex(
        (c) => c.title === active.id
      );
      const newIndex = books[bookIndex].chapters.findIndex(
        (c) => c.title === over.id
      );
      if (oldIndex === -1 || newIndex === -1) return;

      const updatedBooks = [...books];
      updatedBooks[bookIndex].chapters = arrayMove(
        updatedBooks[bookIndex].chapters,
        oldIndex,
        newIndex
      );
      setBooks(updatedBooks);

      setExpandedIndex(bookIndex);
    }
  }

  return (
    <div className="w-full h-full flex flex-col">
      {/* Books List (scrollable area) */}
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleBooksDragEnd}
      >
        <SortableContext
          items={books.map((b) => b.title)}
          strategy={verticalListSortingStrategy}
        >
          <div
            className="flex-1 flex flex-col divide-y overflow-y-auto p-1 "
            style={{ touchAction: "none" }}
          >
            {books.map((book, index) => (
              <SortableBook
                key={book.title}
                id={book.title}
                book={book}
                index={index}
                setEditingBookIndex={setEditingBookIndex}
                setNewBook={setNewBook}
                setOpenDialog={setOpenDialog}
                toggleExpand={toggleExpand}
                expandedIndex={expandedIndex}
                openChapterModal={openChapterModal}
                handleDeleteBook={handleDeleteBook}
                onChapterClick={onChapterClick}
                handleDeleteChapter={handleDeleteChapter}
                books={books}
                onChapterDragEnd={handleChaptersDragEnd}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>

      {/* Add Button (sticky at bottom inside sidebar) */}
      <div className="p-3 bg-background sticky bottom-0">
        <Button
          className="w-full"
          onClick={() => {
            setEditingBookIndex(null);
            setNewBook("");
            setOpenDialog(true);
          }}
        >
          Add Subject
        </Button>
      </div>

      {/* Dialogs */}
      <AddBook
        newBook={newBook}
        setNewBook={setNewBook}
        handleAddBook={handleAddBook}
        openDialog={openDialog}
        setOpenDialog={(val) => {
          if (!val) setEditingBookIndex(null);
          setOpenDialog(val);
        }}
        editingBookIndex={editingBookIndex}
      />

      <AddChapter
        chapterDialog={chapterDialog}
        setChapterDialog={setChapterDialog}
        chapterData={chapterData}
        setChapterData={setChapterData}
        handleAddChapter={handleAddChapter}
      />
    </div>
  );
};

export default CreateAssessmentForm;
