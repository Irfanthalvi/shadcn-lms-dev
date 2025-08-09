import React, { useState } from "react";
import {
  Trash2,
  ChevronDown,
  ChevronUp,
  GripVertical,
  SquarePen,
} from "lucide-react";
import { Button } from "@/components/ui/button";

import AddBook from "../dialog/book-dialog";
import AddChapter from "../dialog/chapter-dialog";

const CreateAssessmentForm = ({ books, setBooks, onChapterClick }) => {
  // Remove internal books state. Use props!

  const [newBook, setNewBook] = useState("");
  const [openDialog, setOpenDialog] = useState(false);
  const [expandedIndex, setExpandedIndex] = useState(null);
  const [editingBookIndex, setEditingBookIndex] = useState(null);
  const [chapterDialog, setChapterDialog] = useState(false);
  const [chapterData, setChapterData] = useState({ title: "", desc: "", time: "" });
  const [activeBookIndex, setActiveBookIndex] = useState(null);
  const [editingChapterIndex, setEditingChapterIndex] = useState(null);
  const [editingBookIndexForChapter, setEditingBookIndexForChapter] = useState(null);

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
  };

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

  const handleAddChapter = (formData) => {
    const updated = [...books];

    if (editingChapterIndex !== null && editingBookIndexForChapter !== null) {
      updated[editingBookIndexForChapter].chapters[editingChapterIndex] = {
        ...formData,
        questions: updated[editingBookIndexForChapter].chapters[editingChapterIndex]?.questions || [],
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

  return (
    <div className="p-4 sm:p-6 max-w-2xl mx-auto flex flex-col gap-6">
      <div className="flex flex-col divide-y w-full h-[calc(100vh-100px)]">
        {books.map((book, index) => (
          <div key={index}>
            <div
              className="flex items-center justify-between py-3 rounded-md
             hover:bg-muted hover:shadow-sm cursor-pointer transition-colors"
            >
              <div className="flex items-center gap-3 w-full min-w-0">
                <GripVertical className="size-4 text-muted-foreground shrink-0" />
                <span className="text-base font-medium text-foreground truncate hover:text-primary">
                  {book.title}
                </span>
              </div>
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
                  className="size-4 text-destructive cursor-pointer hover:text-red-600"
                  onClick={() => handleDeleteBook(index)}
                />
                <Button variant="ghost" size="icon" onClick={() => toggleExpand(index)}>
                  {expandedIndex === index ? (
                    <ChevronUp className="size-4" />
                  ) : (
                    <ChevronDown className="size-4" />
                  )}
                </Button>
              </div>
            </div>


            {expandedIndex === index && (
              <div className="pl-6 pb-3 space-y-2">
                {book.chapters.map((chap, cIndex) => (
                  <div
                    key={cIndex}
                    className="flex items-center justify-between py-2 w-70 rounded-md
             hover:bg-muted hover:shadow-sm cursor-pointer transition-colors"
                  >
                    <div className="flex items-center gap-3 w-full min-w-0">
                      <GripVertical className="size-4 text-muted-foreground shrink-0" />
                      <span
                        className="text-sm font-medium text-foreground truncate hover:text-primary"
                        onClick={() => onChapterClick(index, cIndex)}
                      >
                        {chap.title}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 shrink-0">
                      <SquarePen
                        className="size-4 text-muted-foreground cursor-pointer hover:text-foreground"
                        onClick={() => openChapterModal(index, cIndex)}
                      />
                      <Trash2
                        className="size-4 text-destructive cursor-pointer hover:text-red-600"
                        onClick={() => handleDeleteChapter(index, cIndex)}
                      />
                      <Button variant="ghost" size="icon">
                        <ChevronDown className="size-4" />
                      </Button>
                    </div>
                  </div>

                ))}

                <div
                  className="flex items-center justify-between py-2 cursor-pointer hover:bg-muted px-2 rounded"
                  onClick={() => openChapterModal(index)}
                >
                  <div className="flex items-center gap-3 w-full min-w-0">
                    <label className="text-sm text-primary font-medium">+ Add Chapter</label>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}

        <Button
          className="mt-auto"
          onClick={() => {
            setEditingBookIndex(null);
            setNewBook("");
            setOpenDialog(true);
          }}
        >
          Add Book
        </Button>
      </div>

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
