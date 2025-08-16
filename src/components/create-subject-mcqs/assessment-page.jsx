"use client";

import { useState } from "react";
import { Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import CreateDrawer from "@/components/drawer/question-drawer";
import ChapterMCQs from "./chapter-mcqs";
import { bookMockData } from "../hard-code/book-mock-data";
import { chapterMockData } from "../hard-code/chapter-mock-data";
import QuestionDrawer from "@/components/drawer/preview-question-drawer";
import CreateAssessmentForm from "@/components/create-subject-mcqs/create-assessment-form";

export default function AssessmentPage() {
  const [books, setBooks] = useState(
    bookMockData.map((book) => ({
      ...book,
      chapters: chapterMockData[book.title] || [],
    }))
  );
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [previewQuestionDrawer, setPreviewQuestionDrawer] = useState(false);
  const [selectedChapter, setSelectedChapter] = useState(null);

  // Controls which panel is visible on mobile
  const [showChapterView, setShowChapterView] = useState(false);

  const handleAddQuestion = (newData) => {
    if (!selectedChapter) return;

    const newQuestion = {
      id: Date.now(),
      type: newData.type,
      question: newData.question,
      options: newData.options,
    };

    setBooks((prevBooks) =>
      prevBooks.map((book, bIndex) => {
        if (bIndex !== selectedChapter.bookIndex) return book;

        const updatedChapters = book.chapters.map((chapter, cIndex) => {
          if (cIndex !== selectedChapter.chapterIndex) return chapter;
          return {
            ...chapter,
            questions: [...(chapter.questions || []), newQuestion],
          };
        });

        return { ...book, chapters: updatedChapters };
      })
    );

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

    // On mobile, switch to chapter view
    setShowChapterView(true);
  };

  return (
    <div className="flex flex-col sm:flex-row h-screen bg-muted/50 text-foreground overflow-hidden">
      {/* Left Column */}
      <div
        className={`w-full sm:w-[300px] lg:w-[400px] border-b sm:border-b-0 sm:border-r border-border bg-background p-3 sm:p-6 overflow-y-auto 
        ${showChapterView ? "hidden sm:block" : "block"}`}
      >
        <CreateAssessmentForm
          books={books}
          setBooks={setBooks}
          onChapterClick={handleChapterClick}
        />
      </div>

      {/* Right Column */}
      <div
        className={`flex-1 overflow-y-auto 
        ${!showChapterView ? "hidden sm:block" : "block"}`}
      >
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 my-4 mx-4">
          <h2 className="text-lg sm:text-xl font-[var(--font-monstrat-hadding)] break-words">
            {/* {chapter.title} */}chapter title
          </h2>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPreviewQuestionDrawer(true)}
            className="w-full sm:w-auto"
          >
            <Eye className="size-4 mr-2" />
            Preview
          </Button>
        </div>

        <ChapterMCQs chapter={selectedChapter} setDrawerOpen={setDrawerOpen} />
      </div>

      {/* Drawer */}
      <CreateDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        onSubmit={handleAddQuestion}
      />

      <QuestionDrawer
        open={previewQuestionDrawer}
        onClose={() => setPreviewQuestionDrawer(false)}
        // onSubmit={handleAddQuestion}
      />
    </div>
  );
}
