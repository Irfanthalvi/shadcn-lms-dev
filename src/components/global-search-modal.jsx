import React, { useState, useEffect, useMemo, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useLms } from "@/context/LmsContext";
import {
  Search,
  X,
  GraduationCap,
  BookOpen,
  Layers,
  HelpCircle,
  ArrowRight,
  FileText,
} from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";

export default function GlobalSearchModal() {
  const navigate = useNavigate();
  const { classes, subjects, chapters, quizzes, isSearchOpen, setIsSearchOpen } = useLms();
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef(null);

  // Keyboard shortcut listener (Cmd/Ctrl + K)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setIsSearchOpen((prev) => !prev);
      }
      if (e.key === "Escape" && isSearchOpen) {
        setIsSearchOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isSearchOpen, setIsSearchOpen]);

  // Focus input when opened
  useEffect(() => {
    if (isSearchOpen) {
      setQuery("");
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isSearchOpen]);

  // Aggregate and filter search items
  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) {
      // Return top recommendations when empty
      const topClasses = classes.slice(0, 3).map((c) => ({
        type: "Class",
        title: c.name,
        subtitle: `Grade ${c.grade || c.name} Syllabus`,
        url: `/classes/${c.id}/subjects`,
        icon: GraduationCap,
        badge: "Class",
      }));
      const topSubjects = subjects.slice(0, 4).map((s) => {
        const parentClass = classes.find((c) => String(c.id) === String(s.classId));
        return {
          type: "Subject",
          title: s.name,
          subtitle: parentClass ? `${parentClass.name}` : "Subject",
          url: `/classes/${s.classId}/subjects/${s.id}/chapters`,
          icon: BookOpen,
          badge: s.code || "Subject",
        };
      });
      return [...topClasses, ...topSubjects];
    }

    const items = [];

    // Search Classes
    classes.forEach((c) => {
      if (c.name.toLowerCase().includes(q) || (c.description || "").toLowerCase().includes(q)) {
        items.push({
          type: "Class",
          title: c.name,
          subtitle: `Grade ${c.grade || c.name} • ${c.description || "Class Curriculum"}`,
          url: `/classes/${c.id}/subjects`,
          icon: GraduationCap,
          badge: "Class",
        });
      }
    });

    // Search Subjects
    subjects.forEach((s) => {
      if (s.name.toLowerCase().includes(q) || (s.code || "").toLowerCase().includes(q)) {
        const parentClass = classes.find((c) => String(c.id) === String(s.classId));
        items.push({
          type: "Subject",
          title: s.name,
          subtitle: parentClass ? `${parentClass.name} • Subject` : "Subject",
          url: `/classes/${s.classId}/subjects/${s.id}/chapters`,
          icon: BookOpen,
          badge: s.code || "Subject",
        });
      }
    });

    // Search Chapters
    chapters.forEach((ch) => {
      if (ch.title.toLowerCase().includes(q) || String(ch.chapterNumber).includes(q)) {
        const parentSubject = subjects.find((s) => String(s.id) === String(ch.subjectId));
        const parentClass = classes.find((c) => String(c.id) === String(ch.classId));
        items.push({
          type: "Chapter",
          title: `Chapter ${ch.chapterNumber}: ${ch.title}`,
          subtitle: `${parentClass?.name || "Class"} • ${parentSubject?.name || "Subject"}`,
          url: `/classes/${ch.classId}/subjects/${ch.subjectId}/chapters/${ch.id}/quiz`,
          icon: Layers,
          badge: "Chapter",
        });
      }
    });

    // Search Quizzes
    quizzes.forEach((quiz) => {
      if (quiz.title.toLowerCase().includes(q)) {
        const parentSubject = subjects.find((s) => String(s.id) === String(quiz.subjectId));
        items.push({
          type: "Quiz",
          title: quiz.title,
          subtitle: `${parentSubject?.name || "Subject"} Assessment • ${quiz.timeLimitMinutes || 15} mins`,
          url: `/classes/${quiz.classId}/subjects/${quiz.subjectId}/chapters/${quiz.chapterId}/quiz`,
          icon: HelpCircle,
          badge: "Quiz",
        });
      }
    });

    return items.slice(0, 8);
  }, [query, classes, subjects, chapters, quizzes]);

  const handleSelect = (item) => {
    setIsSearchOpen(false);
    navigate(item.url);
  };

  const handleKeyDownList = (e) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1 < results.length ? prev + 1 : 0));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 >= 0 ? prev - 1 : results.length - 1));
    } else if (e.key === "Enter" && results[selectedIndex]) {
      e.preventDefault();
      handleSelect(results[selectedIndex]);
    }
  };

  return (
    <Dialog open={isSearchOpen} onOpenChange={setIsSearchOpen}>
      <DialogContent className="p-0 max-w-2xl overflow-hidden rounded-2xl border-border bg-card shadow-2xl">
        {/* Search Input Header */}
        <div className="flex items-center gap-3 px-4 py-3.5 border-b border-border bg-muted/20">
          <Search className="w-5 h-5 text-muted-foreground shrink-0" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Search classes, subjects, chapters, quizzes..."
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            onKeyDown={handleKeyDownList}
            className="flex-1 bg-transparent border-none text-foreground placeholder:text-muted-foreground text-sm focus:outline-none"
          />
          {query && (
            <button
              onClick={() => setQuery("")}
              className="p-1 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted text-xs"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <kbd className="hidden sm:inline-flex items-center gap-0.5 px-2 py-0.5 text-[10px] font-semibold text-muted-foreground bg-muted border border-border rounded">
            ESC
          </kbd>
        </div>

        {/* Results List */}
        <div className="max-h-96 overflow-y-auto p-2">
          {results.length === 0 ? (
            <div className="py-12 text-center text-muted-foreground space-y-2">
              <FileText className="w-10 h-10 mx-auto stroke-1 text-muted-foreground/60" />
              <div className="text-sm font-medium text-foreground">No matches found</div>
              <p className="text-xs">Try searching for a grade, subject name, or chapter topic.</p>
            </div>
          ) : (
            <div className="space-y-1">
              <div className="px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider text-muted-foreground/70">
                {query ? "Search Results" : "Quick Suggestions"}
              </div>
              {results.map((item, idx) => {
                const Icon = item.icon;
                const isSelected = idx === selectedIndex;
                return (
                  <div
                    key={`${item.type}-${item.title}-${idx}`}
                    onClick={() => handleSelect(item)}
                    onMouseEnter={() => setSelectedIndex(idx)}
                    className={`flex items-center justify-between px-3 py-2.5 rounded-xl cursor-pointer transition-all duration-150 ${
                      isSelected
                        ? "bg-primary text-primary-foreground font-medium shadow-sm"
                        : "text-foreground hover:bg-muted/60"
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div
                        className={`p-2 rounded-lg shrink-0 ${
                          isSelected
                            ? "bg-primary-foreground/20 text-primary-foreground"
                            : "bg-primary/10 text-primary"
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                      </div>
                      <div className="min-w-0">
                        <div className="text-xs sm:text-sm font-semibold truncate flex items-center gap-2">
                          {item.title}
                          <span
                            className={`text-[10px] px-1.5 py-0.2 rounded font-bold uppercase ${
                              isSelected
                                ? "bg-white/20 text-white"
                                : "bg-muted text-muted-foreground"
                            }`}
                          >
                            {item.badge}
                          </span>
                        </div>
                        <div
                          className={`text-[11px] truncate ${
                            isSelected ? "text-primary-foreground/80" : "text-muted-foreground"
                          }`}
                        >
                          {item.subtitle}
                        </div>
                      </div>
                    </div>

                    <ArrowRight
                      className={`w-4 h-4 shrink-0 transition-transform ${
                        isSelected ? "translate-x-0.5 text-primary-foreground" : "text-muted-foreground"
                      }`}
                    />
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer info bar */}
        <div className="flex items-center justify-between px-4 py-2 bg-muted/40 border-t border-border text-[11px] text-muted-foreground">
          <div className="flex items-center gap-3">
            <span>
              <kbd className="px-1.5 py-0.5 bg-background border border-border rounded text-[10px]">↑</kbd>{" "}
              <kbd className="px-1.5 py-0.5 bg-background border border-border rounded text-[10px]">↓</kbd> Navigate
            </span>
            <span>
              <kbd className="px-1.5 py-0.5 bg-background border border-border rounded text-[10px]">↵</kbd> Select
            </span>
          </div>
          <span>LMS Omni-Search</span>
        </div>
      </DialogContent>
    </Dialog>
  );
}
