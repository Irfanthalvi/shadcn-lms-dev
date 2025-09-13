"use client";

import { useState, useEffect } from "react";
import { Eye, PanelLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import ChapterMCQs from "./chapter-mcqs";
import { bookMockData } from "../hard-code/book-mock-data";
import CreateDrawer from "@/components/drawer/question-drawer";
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
  const [selectedChapter, setSelectedChapter] = useState(null);
  const [editingQuestion, setEditingQuestion] = useState(null);
  const [previewQuestionDrawer, setPreviewQuestionDrawer] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Auto-select first chapter when books load
  useEffect(() => {
    if (books.length > 0 && books[0].chapters.length > 0) {
      setSelectedChapter({
        bookIndex: 0,
        chapterIndex: 0,
        title: books[0].chapters[0].title,
        questions: books[0].chapters[0].questions || [],
      });
    }
  }, [books]);

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
    <div className="flex flex-col sm:flex-row h-[90vh] bg-muted/50 text-foreground overflow-hidden">
      {/* LEFT SIDEBAR */}
      <div className="hidden sm:block w-[320px] lg:w-[400px] border-r border-border bg-background pt-6 overflow-y-auto">
        <CreateAssessmentForm
          books={books}
          setBooks={setBooks}
          onChapterClick={handleChapterClick}
          selectedChapter={selectedChapter} // 👈 pass selectedChapter
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
              selectedChapter={selectedChapter} // 👈 pass here too
            />
          </div>
        </SheetContent>
      </Sheet>

      {/* RIGHT CONTENT */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {selectedChapter && (
          <>
            {/* Top Navbar */}
            <div className="sticky top-0 h-20 flex items-center justify-between px-4 sm:px-6 border-b border-border bg-background">
              <div className="flex items-center gap-3">
                <div className="sm:hidden">
                  <Button
                    size="icon"
                    onClick={() => setSidebarOpen(true)}
                    className="border border-none shadow-none"
                  >
                    <PanelLeft />
                  </Button>
                </div>
                <h2 className="text-base sm:text-lg font-medium truncate">
                  {selectedChapter.title}
                </h2>
              </div>

              <Button size="sm" onClick={() => setPreviewQuestionDrawer(true)}>
                <Eye className="size-4 mr-2" />
                Preview
              </Button>
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
        )}
      </div>

      {/* Add/Edit Drawer */}
      <CreateDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        onSubmit={(data) => {
          if (editingQuestion) {
            const updated = selectedChapter.questions.map((q) =>
              q.id === editingQuestion.id ? { ...q, ...data } : q
            );
            updateChapterQuestions(updated);
          } else {
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
