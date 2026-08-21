import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLms } from "@/context/LmsContext";
import {
  FileText,
  Plus,
  Search,
  Filter,
  Layers,
  Award,
  Clock,
  Sparkles,
  BookOpen,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import PaperCard from "@/components/papers/PaperCard";
import PaperFormModal from "@/components/papers/PaperFormModal";
import PaperPreviewModal from "@/components/papers/PaperPreviewModal";

export default function PapersMasterPage() {
  const navigate = useNavigate();
  const {
    papers,
    classes,
    addPaper,
    updatePaper,
    deletePaper,
    duplicatePaper,
    togglePaperStatus,
  } = useLms();

  // Filters
  const [search, setSearch] = useState("");
  const [selectedClass, setSelectedClass] = useState("all");
  const [selectedSubject, setSelectedSubject] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");

  // Modals
  const [formModalOpen, setFormModalOpen] = useState(false);
  const [editingPaper, setEditingPaper] = useState(null);
  const [previewModalOpen, setPreviewModalOpen] = useState(false);
  const [previewingPaper, setPreviewingPaper] = useState(null);

  const filteredPapers = papers.filter((p) => {
    const matchesSearch =
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.subject.toLowerCase().includes(search.toLowerCase()) ||
      (p.examCode && p.examCode.toLowerCase().includes(search.toLowerCase()));

    const matchesClass =
      selectedClass === "all" || String(p.classId) === String(selectedClass);

    const matchesSubject =
      selectedSubject === "all" ||
      p.subject.toLowerCase() === selectedSubject.toLowerCase();

    const matchesStatus =
      selectedStatus === "all" || p.status === selectedStatus;

    return matchesSearch && matchesClass && matchesSubject && matchesStatus;
  });

  const handleOpenAdd = () => {
    setEditingPaper(null);
    setFormModalOpen(true);
  };

  const handleOpenEdit = (paper) => {
    setEditingPaper(paper);
    setFormModalOpen(true);
  };

  const handleOpenPreview = (paper) => {
    setPreviewingPaper(paper);
    setPreviewModalOpen(true);
  };

  const handleFormSubmit = (data) => {
    if (editingPaper) {
      updatePaper(editingPaper.id, data);
    } else {
      addPaper(data);
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6 animate-in fade-in duration-300">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs px-2.5 py-0.5 rounded-full font-semibold bg-primary/10 text-primary border border-primary/20">
              Master Assessment Bank
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground mt-1">
            Exam Papers & Question Bank
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Central repository of all examination papers, unit tests, and quizzes across Classes 8 through 12.
          </p>
        </div>

        <Button onClick={handleOpenAdd} className="gap-2 shadow-sm font-semibold">
          <Plus className="h-4 w-4" />
          Create New Paper
        </Button>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-card border border-border rounded-2xl p-4 space-y-3 shadow-sm">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search papers by title or code..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 h-9 text-xs"
            />
          </div>

          {/* Class Filter */}
          <Select value={selectedClass} onValueChange={setSelectedClass}>
            <SelectTrigger className="h-9 text-xs">
              <SelectValue placeholder="All Classes" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Classes (8-12)</SelectItem>
              <SelectItem value="8">Class 8</SelectItem>
              <SelectItem value="9">Class 9</SelectItem>
              <SelectItem value="10">Class 10</SelectItem>
              <SelectItem value="11">Class 11</SelectItem>
              <SelectItem value="12">Class 12</SelectItem>
            </SelectContent>
          </Select>

          {/* Subject Filter */}
          <Select value={selectedSubject} onValueChange={setSelectedSubject}>
            <SelectTrigger className="h-9 text-xs">
              <SelectValue placeholder="All Subjects" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Subjects</SelectItem>
              <SelectItem value="Mathematics">Mathematics</SelectItem>
              <SelectItem value="Physics">Physics</SelectItem>
              <SelectItem value="Chemistry">Chemistry</SelectItem>
              <SelectItem value="Biology">Biology</SelectItem>
              <SelectItem value="Computer Science">Computer Science</SelectItem>
              <SelectItem value="English">English</SelectItem>
              <SelectItem value="Urdu">Urdu</SelectItem>
              <SelectItem value="Islamiat">Islamiat</SelectItem>
              <SelectItem value="Pakistan Studies">Pakistan Studies</SelectItem>
            </SelectContent>
          </Select>

          {/* Status Filter */}
          <Select value={selectedStatus} onValueChange={setSelectedStatus}>
            <SelectTrigger className="h-9 text-xs">
              <SelectValue placeholder="All Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="Published">Published</SelectItem>
              <SelectItem value="Draft">Draft</SelectItem>
              <SelectItem value="Scheduled">Scheduled</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Quick Class Shortcut Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pt-1 text-xs">
          <span className="text-muted-foreground font-semibold shrink-0 mr-1">
            Quick Jump:
          </span>
          <button
            onClick={() => setSelectedClass("all")}
            className={`px-3 py-1 rounded-full font-medium transition ${
              selectedClass === "all"
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground hover:text-foreground"
            }`}
          >
            All Classes ({papers.length})
          </button>
          {classes.map((c) => {
            const count = papers.filter((p) => String(p.classId) === String(c.id)).length;
            const isSelected = selectedClass === String(c.id);
            return (
              <button
                key={c.id}
                onClick={() => setSelectedClass(String(c.id))}
                className={`px-3 py-1 rounded-full font-medium transition flex items-center gap-1.5 ${
                  isSelected
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground hover:text-foreground"
                }`}
              >
                <span>{c.name}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                    isSelected ? "bg-primary-foreground/20" : "bg-background/80"
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Papers Grid */}
      {filteredPapers.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredPapers.map((paper) => (
            <PaperCard
              key={paper.id}
              paper={paper}
              onPreview={handleOpenPreview}
              onEdit={handleOpenEdit}
              onDelete={deletePaper}
              onDuplicate={duplicatePaper}
              onToggleStatus={togglePaperStatus}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 px-4 bg-card border border-dashed border-border rounded-2xl space-y-4">
          <div className="p-4 bg-primary/10 text-primary rounded-full w-16 h-16 mx-auto flex items-center justify-center">
            <BookOpen className="h-8 w-8" />
          </div>
          <div className="max-w-md mx-auto space-y-1">
            <h3 className="text-lg font-bold text-foreground">
              No matching exam papers
            </h3>
            <p className="text-sm text-muted-foreground">
              Try adjusting your search criteria or select another class filter.
            </p>
          </div>
          <Button onClick={handleOpenAdd} className="gap-2 shadow-md">
            <Plus className="h-4 w-4" />
            Create Paper
          </Button>
        </div>
      )}

      {/* Paper Form Modal */}
      <PaperFormModal
        open={formModalOpen}
        onClose={() => {
          setFormModalOpen(false);
          setEditingPaper(null);
        }}
        initialData={editingPaper}
        defaultClassId={selectedClass !== "all" ? selectedClass : "10"}
        onSubmit={handleFormSubmit}
      />

      {/* Paper Preview Modal */}
      <PaperPreviewModal
        open={previewModalOpen}
        onClose={() => {
          setPreviewModalOpen(false);
          setPreviewingPaper(null);
        }}
        paper={previewingPaper}
      />
    </div>
  );
}
