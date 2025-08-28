"use client";

import { useState } from "react";
import { Eye, Menu, SkipBack } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

import ChapterMCQs from "./chapter-mcqs";
import { bookMockData } from "../hard-code/book-mock-data";
import { chapterMockData } from "../hard-code/chapter-mock-data";

import CreateDrawer from "@/components/drawer/question-drawer"; // Add Question Drawer
import QuestionDrawer from "@/components/drawer/preview-question-drawer"; // Preview Drawer
import CreateAssessmentForm from "@/components/create-subject-mcqs/create-assessment-form"; // Left Sidebar/Sheet Content

export default function AssessmentPage() {
  const [books, setBooks] = useState(
    bookMockData.map((book) => ({
      ...book,
      chapters: chapterMockData[book.title] || [],
    }))
  );

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedChapter, setSelectedChapter] = useState(null);
  const [previewQuestionDrawer, setPreviewQuestionDrawer] = useState(false);

  // Add Question Handler
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

  // Select Chapter Handler
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
    <div className="flex flex-col sm:flex-row h-[90vh] bg-muted/50 text-foreground overflow-hidden">
      {/* ✅ LEFT SIDEBAR (desktop always visible, mobile only if no chapter selected) */}
      <div
        className={`
          w-full sm:w-[320px] lg:w-[400px] border-r border-border bg-background pt-6 p-2  overflow-y-auto
          ${selectedChapter ? "hidden sm:block" : "block"}
        `}
      >
        <CreateAssessmentForm
          books={books}
          setBooks={setBooks}
          onChapterClick={handleChapterClick}
        />
      </div>

      {/* ✅ RIGHT CONTENT (desktop always visible, mobile only if chapter selected) */}
      <div
        className={`
          flex-1 flex flex-col overflow-hidden
          ${selectedChapter ? "block" : "hidden sm:block"}
        `}
      >
        {selectedChapter ? (
          <>
            {/* Top Navbar */}
            <div className="sticky top-0 h-20 sm:h-20 flex items-center justify-between px-4 sm:px-6 border-b border-border bg-background">
              {/* Left Section: Back on mobile + Title */}
              <div className="flex items-center gap-3">
                {/* Mobile back button */}
                <div className="sm:hidden">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setSelectedChapter(null)}
                  >
                    <SkipBack />
                  </Button>
                </div>
                <h2 className="text-base sm:text-lg font-medium truncate">
                  {selectedChapter.title}
                </h2>
              </div>

              {/* Right Section: Preview button */}
              <div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPreviewQuestionDrawer(true)}
                >
                  <Eye className="size-4 mr-2" />
                  Preview
                </Button>
              </div>
            </div>

            {/* Chapter Questions */}
            <div className="flex-1 overflow-y-auto">
              <ChapterMCQs
                chapter={selectedChapter}
                setDrawerOpen={setDrawerOpen}
              />
            </div>
          </>
        ) : (
          // Placeholder for desktop when no chapter selected
          <div className=" bg-background hidden sm:flex flex-1 h-full flex-col items-center justify-center text-center">
            <img
              src="/data-not-found.svg"
              alt="No data"
              className="w-48 h-48 object-contain mb-4"
            />
            <h1 className="text-2xl font-bold">No Data Found</h1>
            <p className="text-base text-muted-foreground">
              Sorry, no assessments were found for your criteria.
            </p>
          </div>
        )}
      </div>

      {/* Add Question Drawer */}
      <CreateDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        onSubmit={handleAddQuestion}
      />

      {/* Preview Drawer */}
      <QuestionDrawer
        open={previewQuestionDrawer}
        onClose={() => setPreviewQuestionDrawer(false)}
        chapter={selectedChapter}
      />
    </div>
  );
}
