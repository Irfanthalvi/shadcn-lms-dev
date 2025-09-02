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

import CreateDrawer from "@/components/drawer/question-drawer"; // Add/Edit Drawer
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
  const [editingQuestion, setEditingQuestion] = useState(null);
  const [previewQuestionDrawer, setPreviewQuestionDrawer] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Add Question Handler
  const handleAddQuestion = (newData) => {
    if (!selectedChapter) return;

    const newQuestion = {
      id: Date.now(),
      type: newData.type,
      question: newData.question,
      options: newData.options,
    };

    const updatedQuestions = [
      ...(selectedChapter.questions || []),
      newQuestion,
    ];
    updateChapterQuestions(updatedQuestions);
  };

  // Update Chapter Questions
  const updateChapterQuestions = (updatedQuestions) => {
    if (!selectedChapter) return;

    setBooks((prevBooks) =>
      prevBooks.map((book, bIndex) => {
        if (bIndex !== selectedChapter.bookIndex) return book;
        const updatedChapters = book.chapters.map((chapter, cIndex) => {
          if (cIndex !== selectedChapter.chapterIndex) return chapter;
          return { ...chapter, questions: updatedQuestions };
        });
        return { ...book, chapters: updatedChapters };
      })
    );

    setSelectedChapter((prev) => ({
      ...prev,
      questions: updatedQuestions,
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
    setSidebarOpen(false);
  };

  return (
    <div className="flex flex-col sm:flex-row h-[85vh] bg-muted/50 text-foreground overflow-hidden">
      {/* LEFT SIDEBAR */}
      <div className="hidden sm:block w-[320px] lg:w-[400px] border-r border-border bg-background pt-6 overflow-y-auto">
        <CreateAssessmentForm
          books={books}
          setBooks={setBooks}
          onChapterClick={handleChapterClick}
        />
      </div>

      {/* Mobile Sidebar */}
      <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
        <SheetContent side="left" className="p-0 w-[300px] sm:hidden">
          <SheetHeader>
            <SheetTitle className="px-4 pt-4 text-lg font-semibold">
              Select Chapter
            </SheetTitle>
          </SheetHeader>
          <div className="h-full overflow-y-auto">
            <CreateAssessmentForm
              books={books}
              setBooks={setBooks}
              onChapterClick={handleChapterClick}
            />
          </div>
        </SheetContent>
      </Sheet>

      {/* RIGHT CONTENT */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {selectedChapter ? (
          <>
            {/* Top Navbar */}
            <div className="sticky top-0 h-20 flex items-center justify-between px-4 sm:px-6 border-b border-border bg-background">
              <div className="flex items-center gap-3">
                <div className="sm:hidden">
                  <Button size="icon" onClick={() => setSidebarOpen(true)}>
                    <Menu />
                  </Button>
                </div>
                <h2 className="text-base sm:text-lg font-medium truncate">
                  {selectedChapter.title}
                </h2>
              </div>

              <div>
                <Button
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
                setEditingQuestion={setEditingQuestion}
                onUpdateQuestions={updateChapterQuestions}
              />
            </div>
          </>
        ) : (
          <div className="bg-background flex-1 h-full flex flex-col items-center justify-center text-center relative">
            <div className="sm:hidden absolute top-4 left-4 ">
              <Button size="icon" onClick={() => setSidebarOpen(true)}>
                <Menu />
              </Button>
            </div>
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

      {/* Add/Edit Drawer */}
      <CreateDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        onSubmit={(data) => {
          if (editingQuestion) {
            // EDIT
            const updated = selectedChapter.questions.map((q) =>
              q.id === editingQuestion.id ? { ...q, ...data } : q
            );
            updateChapterQuestions(updated);
          } else {
            // ADD
            handleAddQuestion(data);
          }
          setEditingQuestion(null);
        }}
        question={editingQuestion}
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
