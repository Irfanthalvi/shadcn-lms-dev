import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useLms } from "@/context/LmsContext";
import {
  Plus,
  Search,
  Filter,
  Layers,
  GraduationCap,
  Users,
  Award,
  BookOpen,
  Calendar,
  CheckCircle2,
  FileSpreadsheet,
  LayoutGrid,
  List,
  Sparkles,
  ChevronLeft,
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

export default function ClassDetailPage() {
  const { classId } = useParams();
  const navigate = useNavigate();
  const {
    classes,
    papers,
    addPaper,
    updatePaper,
    deletePaper,
    duplicatePaper,
    togglePaperStatus,
  } = useLms();

  const currentClass = classes.find((c) => c.id === String(classId)) || classes[0];

  // Filters & State
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [viewMode, setViewMode] = useState("grid"); // 'grid' | 'table'

  // Modals state
  const [formModalOpen, setFormModalOpen] = useState(false);
  const [editingPaper, setEditingPaper] = useState(null);
  const [previewModalOpen, setPreviewModalOpen] = useState(false);
  const [previewingPaper, setPreviewingPaper] = useState(null);

  // Filter papers for this class
  const classPapers = papers.filter(
    (p) => String(p.classId) === String(currentClass.id)
  );

  const filteredPapers = classPapers.filter((paper) => {
    const matchesSearch =
      paper.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      paper.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (paper.examCode &&
        paper.examCode.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesSubject =
      selectedSubject === "all" ||
      paper.subject.toLowerCase() === selectedSubject.toLowerCase();

    const matchesStatus =
      selectedStatus === "all" || paper.status === selectedStatus;

    return matchesSearch && matchesSubject && matchesStatus;
  });

  // Handlers
  const handleOpenAddModal = () => {
    setEditingPaper(null);
    setFormModalOpen(true);
  };

  const handleOpenEditModal = (paper) => {
    setEditingPaper(paper);
    setFormModalOpen(true);
  };

  const handleOpenPreviewModal = (paper) => {
    setPreviewingPaper(paper);
    setPreviewModalOpen(true);
  };

  const handleFormSubmit = (data) => {
    if (editingPaper) {
      updatePaper(editingPaper.id, data);
    } else {
      addPaper({ ...data, classId: currentClass.id });
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      {/* Class Banner Card */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-primary/10 via-primary/5 to-background border border-primary/20 p-6 sm:p-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                className="h-7 text-xs px-2 text-muted-foreground hover:text-foreground"
                onClick={() => navigate("/classes")}
              >
                <ChevronLeft className="h-4 w-4 mr-1" />
                All Classes
              </Button>
              <span className="text-xs px-2.5 py-0.5 rounded-full font-semibold bg-primary text-primary-foreground">
                {currentClass.level}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
              {currentClass.name} Assessment Hub
            </h1>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {currentClass.description}
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2 text-xs text-muted-foreground">
              <div>
                <span className="font-semibold text-foreground">
                  Class Incharge:
                </span>{" "}
                {currentClass.teacher}
              </div>
              <span>•</span>
              <div>
                <span className="font-semibold text-foreground">Room:</span>{" "}
                {currentClass.room}
              </div>
              <span>•</span>
              <div>
                <span className="font-semibold text-foreground">Sections:</span>{" "}
                {currentClass.section}
              </div>
            </div>
          </div>

          {/* Quick Action Button */}
          <div className="flex sm:flex-col items-center sm:items-end gap-3 shrink-0">
            <Button
              size="default"
              onClick={handleOpenAddModal}
              className="gap-2 shadow-lg shadow-primary/20 px-5 font-semibold"
            >
              <Plus className="h-4 w-4" />
              Add {currentClass.name} Paper
            </Button>
            <span className="text-xs text-muted-foreground hidden sm:block">
              {classPapers.length} Total Papers in Repository
            </span>
          </div>
        </div>

        {/* Background glow decoration */}
        <div className="absolute right-0 top-0 -mt-8 -mr-8 w-64 h-64 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* Class Quick Metric Counters */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-card text-card-foreground border border-border rounded-xl p-4 space-y-1">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-xs font-medium">Total Students</span>
            <Users className="h-4 w-4 text-blue-500" />
          </div>
          <p className="text-2xl font-bold text-foreground">
            {currentClass.studentCount}
          </p>
          <span className="text-[11px] text-muted-foreground">Enrolled in 2025</span>
        </div>

        <div className="bg-card text-card-foreground border border-border rounded-xl p-4 space-y-1">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-xs font-medium">Active Papers</span>
            <BookOpen className="h-4 w-4 text-emerald-500" />
          </div>
          <p className="text-2xl font-bold text-foreground">
            {classPapers.filter((p) => p.status === "Published").length}
          </p>
          <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">
            Published for Exam
          </span>
        </div>

        <div className="bg-card text-card-foreground border border-border rounded-xl p-4 space-y-1">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-xs font-medium">Average Performance</span>
            <Award className="h-4 w-4 text-amber-500" />
          </div>
          <p className="text-2xl font-bold text-foreground">
            {currentClass.avgPerformance}%
          </p>
          <span className="text-[11px] text-muted-foreground">Passing benchmark</span>
        </div>

        <div className="bg-card text-card-foreground border border-border rounded-xl p-4 space-y-1">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-xs font-medium">Attendance Rate</span>
            <CheckCircle2 className="h-4 w-4 text-purple-500" />
          </div>
          <p className="text-2xl font-bold text-foreground">
            {currentClass.attendanceRate}%
          </p>
          <span className="text-[11px] text-purple-600 dark:text-purple-400 font-medium">
            Class Attendance
          </span>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-card border border-border rounded-xl p-4 space-y-4 shadow-sm">
        {/* Search and Main Controls */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          {/* Search Input */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={`Search ${currentClass.name} papers by title, subject, code...`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 h-9"
            />
          </div>

          {/* Controls: Status filter & View mode */}
          <div className="flex items-center gap-2.5">
            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <SelectTrigger className="w-36 h-9 text-xs">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="Published">Published</SelectItem>
                <SelectItem value="Draft">Draft</SelectItem>
                <SelectItem value="Scheduled">Scheduled</SelectItem>
              </SelectContent>
            </Select>

            {/* View Mode Toggle */}
            <div className="flex items-center border border-border rounded-lg p-0.5 bg-muted/30">
              <Button
                variant={viewMode === "grid" ? "secondary" : "ghost"}
                size="icon"
                className="h-8 w-8 rounded-md"
                onClick={() => setViewMode("grid")}
                title="Grid View"
              >
                <LayoutGrid className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === "table" ? "secondary" : "ghost"}
                size="icon"
                className="h-8 w-8 rounded-md"
                onClick={() => setViewMode("table")}
                title="Table View"
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Subject Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs scrollbar-none">
          <button
            onClick={() => setSelectedSubject("all")}
            className={`px-3 py-1 rounded-full font-medium transition whitespace-nowrap ${
              selectedSubject === "all"
                ? "bg-primary text-primary-foreground shadow-sm"
                : "bg-muted text-muted-foreground hover:text-foreground hover:bg-muted/80"
            }`}
          >
            All Subjects ({classPapers.length})
          </button>
          {currentClass.subjects.map((sub) => {
            const count = classPapers.filter(
              (p) => p.subject.toLowerCase() === sub.toLowerCase()
            ).length;
            const isSelected =
              selectedSubject.toLowerCase() === sub.toLowerCase();
            return (
              <button
                key={sub}
                onClick={() => setSelectedSubject(sub)}
                className={`px-3 py-1 rounded-full font-medium transition whitespace-nowrap flex items-center gap-1.5 ${
                  isSelected
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "bg-muted text-muted-foreground hover:text-foreground hover:bg-muted/80"
                }`}
              >
                <span>{sub}</span>
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

      {/* Papers Display: Grid or Table */}
      {filteredPapers.length > 0 ? (
        viewMode === "grid" ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredPapers.map((paper) => (
              <PaperCard
                key={paper.id}
                paper={paper}
                onPreview={handleOpenPreviewModal}
                onEdit={handleOpenEditModal}
                onDelete={deletePaper}
                onDuplicate={duplicatePaper}
                onToggleStatus={togglePaperStatus}
              />
            ))}
          </div>
        ) : (
          /* Table View */
          <div className="bg-card border border-border rounded-xl overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-muted/50 text-muted-foreground text-xs uppercase border-b border-border">
                  <tr>
                    <th className="px-5 py-3 font-semibold">Paper Title</th>
                    <th className="px-4 py-3 font-semibold">Subject</th>
                    <th className="px-4 py-3 font-semibold">Category</th>
                    <th className="px-4 py-3 font-semibold">Marks</th>
                    <th className="px-4 py-3 font-semibold">Time</th>
                    <th className="px-4 py-3 font-semibold">Status</th>
                    <th className="px-5 py-3 font-semibold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {filteredPapers.map((paper) => (
                    <tr
                      key={paper.id}
                      className="hover:bg-muted/30 transition group cursor-pointer"
                      onClick={() => handleOpenPreviewModal(paper)}
                    >
                      <td className="px-5 py-3.5">
                        <div className="font-semibold text-foreground group-hover:text-primary transition-colors">
                          {paper.title}
                        </div>
                        <div className="text-xs text-muted-foreground font-mono">
                          {paper.examCode || "PAPER"} • {paper.questions?.length || 0} Questions
                        </div>
                      </td>
                      <td className="px-4 py-3.5">
                        <Badge variant="outline" className="font-normal text-xs">
                          {paper.subject}
                        </Badge>
                      </td>
                      <td className="px-4 py-3.5 text-xs text-muted-foreground">
                        {paper.term}
                      </td>
                      <td className="px-4 py-3.5 text-xs font-semibold text-foreground">
                        {paper.totalMarks}
                      </td>
                      <td className="px-4 py-3.5 text-xs text-muted-foreground">
                        {paper.durationMins}m
                      </td>
                      <td className="px-4 py-3.5">
                        <span
                          className={`text-xs px-2.5 py-0.5 rounded-full font-medium border ${
                            paper.status === "Published"
                              ? "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-800"
                              : "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-400 dark:border-amber-800"
                          }`}
                        >
                          {paper.status}
                        </span>
                      </td>
                      <td
                        className="px-5 py-3.5 text-right space-x-1"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 px-2.5 text-xs"
                          onClick={() => handleOpenPreviewModal(paper)}
                        >
                          View
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-8 px-2.5 text-xs"
                          onClick={() => handleOpenEditModal(paper)}
                        >
                          Edit
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )
      ) : (
        /* Empty State */
        <div className="text-center py-16 px-4 bg-card border border-dashed border-border rounded-2xl space-y-4">
          <div className="p-4 bg-primary/10 text-primary rounded-full w-16 h-16 mx-auto flex items-center justify-center">
            <BookOpen className="h-8 w-8" />
          </div>
          <div className="max-w-md mx-auto space-y-1">
            <h3 className="text-lg font-bold text-foreground">
              No exam papers found
            </h3>
            <p className="text-sm text-muted-foreground">
              {searchQuery || selectedSubject !== "all" || selectedStatus !== "all"
                ? "Try adjusting your search query or subject filters."
                : `No exam papers created for ${currentClass.name} yet. Click below to add the first paper.`}
            </p>
          </div>
          <Button
            onClick={handleOpenAddModal}
            className="gap-2 shadow-md px-6 font-semibold"
          >
            <Plus className="h-4 w-4" />
            Create {currentClass.name} Paper
          </Button>
        </div>
      )}

      {/* Add / Edit Paper Modal */}
      <PaperFormModal
        open={formModalOpen}
        onClose={() => {
          setFormModalOpen(false);
          setEditingPaper(null);
        }}
        initialData={editingPaper}
        defaultClassId={currentClass.id}
        onSubmit={handleFormSubmit}
      />

      {/* Preview Printable Paper Modal */}
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
