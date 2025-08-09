"use client";

import { useState } from "react";
import CreateAssessmentForm from "./create-assessment-form";
import CreateDrawer from "@/components/drawer/question-drawer";
import ChapterMCQs from "./chapter-mcqs";
import { bookMockData } from "../hard-code/book-mock-data";
import { chapterMockData } from "../hard-code/chapter-mock-data";

export default function AssessmentPage() {
  // Initialize books state from mock data with chapters included
  const [books, setBooks] = useState(
    bookMockData.map(book => ({
      ...book,
      chapters: chapterMockData[book.title] || []
    }))
  );

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedChapter, setSelectedChapter] = useState(null);

  const handleAddQuestion = (newData) => {
    if (!selectedChapter) return;

    const newQuestion = {
      id: Date.now(),
      type: newData.type,
      question: newData.question,
      options: newData.options,
    };

    setBooks((prevBooks) => {
      // Immutable update to books state
      return prevBooks.map((book, bIndex) => {
        if (bIndex !== selectedChapter.bookIndex) return book;

        const updatedChapters = book.chapters.map((chapter, cIndex) => {
          if (cIndex !== selectedChapter.chapterIndex) return chapter;

          return {
            ...chapter,
            questions: [...(chapter.questions || []), newQuestion],
          };
        });

        return {
          ...book,
          chapters: updatedChapters,
        };
      });
    });

    setSelectedChapter((prev) => ({
      ...prev,
      questions: [...(prev.questions || []), newQuestion],
    }));
  };

  const handleChapterClick = (bookIndex, chapterIndex) => {
    const chapter = books[bookIndex].chapters[chapterIndex];
    setSelectedChapter({
      bookIndex,
      chapterIndex,
      title: chapter.title,
      questions: chapter.questions || [],
    });
  };

  return (
    <div className="flex h-screen bg-muted/50 text-foreground overflow-x-auto">
      {/* Left Column: Book & Chapter List */}
      <div className="w-[400px] border-r border-border bg-background p-4 sm:p-6 overflow-y-auto">
        <CreateAssessmentForm
          books={books}
          setBooks={setBooks}
          onChapterClick={handleChapterClick}
        />
      </div>

      {/* Right Column: Chapter Questions */}
      <ChapterMCQs
        chapter={selectedChapter}
        setDrawerOpen={setDrawerOpen}
      />

      {/* Drawer: Add Question Form */}
      <CreateDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        onSubmit={handleAddQuestion}
      />
    </div>
  );
}
