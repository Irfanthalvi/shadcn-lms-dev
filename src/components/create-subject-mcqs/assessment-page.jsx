"use client";

import { useState } from "react";
import { Eye, Menu } from "lucide-react";
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

  const [drawerOpen, setDrawerOpen] = useState(false); // Add Question Drawer
  const [leftSheetOpen, setLeftSheetOpen] = useState(false); // Mobile left sheet
  const [selectedChapter, setSelectedChapter] = useState(null);
  const [previewQuestionDrawer, setPreviewQuestionDrawer] = useState(false); // Preview Drawer

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
    setLeftSheetOpen(false); // close mobile sheet
  };

  return (
    <div className="flex flex-col sm:flex-row h-screen bg-muted/50 text-foreground overflow-hidden">
      {/* Left Sidebar (desktop only) */}
      <div className="hidden sm:block w-[320px] lg:w-[400px] border-r border-border bg-background p-3 sm:p-6 overflow-y-auto">
        <CreateAssessmentForm
          books={books}
          setBooks={setBooks}
          onChapterClick={handleChapterClick}
        />
      </div>

      {/* Right Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Navbar (fixed for mobile + desktop) */}
        <div className="sticky top-0 h-16 sm:h-20 flex items-center justify-between px-4 sm:px-6 border-b border-border bg-background">
          {/* Left Section: Menu + Title */}
          <div className="flex items-center gap-3">
            {/* Mobile menu */}
            <div className="sm:hidden">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setLeftSheetOpen(true)}
              >
                <Menu className="size-5" />
              </Button>
            </div>
            {/* left Section: Preview button */}
            <h2 className="text-base sm:text-lg font-medium truncate">
              {selectedChapter ? selectedChapter.title : "Select Chapter"}
            </h2>
          </div>

          {/* Right Section: Preview button */}
          <div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPreviewQuestionDrawer(true)}
              disabled={!selectedChapter}
            >
              <Eye className="size-4 mr-2" />
              Preview
            </Button>
          </div>
        </div>

        {/* Chapter Questions (scrollable) */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6">
          <ChapterMCQs
            chapter={selectedChapter}
            setDrawerOpen={setDrawerOpen}
          />
        </div>
      </div>

      {/* ✅ Mobile Sheet (sidebar for small devices) */}
      <div className="sm:hidden">
        <Sheet open={leftSheetOpen} onOpenChange={setLeftSheetOpen}>
          <SheetContent
            side="left"
            className="h-screen w-full max-w-md border-r bg-background flex flex-col"
          >
            <SheetHeader className="flex justify-between items-center border-b px-4 py-3">
              <SheetTitle className="text-lg font-semibold">
                Books & Chapters
              </SheetTitle>
            </SheetHeader>

            <div className="flex-1 overflow-y-auto px-4 py-4">
              <CreateAssessmentForm
                books={books}
                setBooks={setBooks}
                onChapterClick={handleChapterClick}
              />
            </div>
          </SheetContent>
        </Sheet>
      </div>

      {/* Add Question Drawer */}
      <CreateDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        onSubmit={handleAddQuestion}
      />

      {/* Preview Question Drawer */}
      <QuestionDrawer
        open={previewQuestionDrawer}
        onClose={() => setPreviewQuestionDrawer(false)}
        chapter={selectedChapter}
      />
    </div>
  );
}
