import React, { useState } from "react";
import {
  Clock,
  Award,
  HelpCircle,
  MoreVertical,
  Eye,
  Edit,
  Copy,
  Trash2,
  CheckCircle2,
  Calendar,
  Layers,
  FileText,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const subjectColorMap = {
  Mathematics: "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/40 dark:text-blue-300 dark:border-blue-800",
  Physics: "bg-indigo-50 text-indigo-700 border-indigo-200 dark:bg-indigo-950/40 dark:text-indigo-300 dark:border-indigo-800",
  Chemistry: "bg-teal-50 text-teal-700 border-teal-200 dark:bg-teal-950/40 dark:text-teal-300 dark:border-teal-800",
  Biology: "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800",
  "Computer Science": "bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-950/40 dark:text-purple-300 dark:border-purple-800",
  English: "bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-800",
  Urdu: "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800",
  Islamiat: "bg-green-50 text-green-700 border-green-200 dark:bg-green-950/40 dark:text-green-300 dark:border-green-800",
  "Pakistan Studies": "bg-emerald-50 text-emerald-800 border-emerald-300 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800",
  "General Science": "bg-cyan-50 text-cyan-700 border-cyan-200 dark:bg-cyan-950/40 dark:text-cyan-300 dark:border-cyan-800",
  default: "bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700",
};

const statusBadgeMap = {
  Published: "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-800",
  Draft: "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-400 dark:border-amber-800",
  Scheduled: "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/40 dark:text-blue-400 dark:border-blue-800",
  Archived: "bg-slate-100 text-slate-600 border-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700",
};

export default function PaperCard({
  paper,
  onPreview,
  onEdit,
  onDelete,
  onDuplicate,
  onToggleStatus,
}) {
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);

  const subjectBadgeClass =
    subjectColorMap[paper.subject] || subjectColorMap.default;
  const statusBadgeClass =
    statusBadgeMap[paper.status] || statusBadgeMap.Draft;

  return (
    <>
      <div className="group relative bg-card text-card-foreground rounded-xl border border-border p-5 hover:border-primary/40 hover:shadow-md transition-all duration-200 flex flex-col justify-between">
        {/* Top Header */}
        <div>
          <div className="flex items-start justify-between gap-2 mb-3">
            <div className="flex flex-wrap items-center gap-1.5">
              <span
                className={`text-xs font-semibold px-2.5 py-0.5 rounded-full border ${subjectBadgeClass}`}
              >
                {paper.subject}
              </span>
              <span
                className={`text-xs font-medium px-2 py-0.5 rounded-full border ${statusBadgeClass}`}
              >
                {paper.status}
              </span>
            </div>

            {/* Action Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-muted-foreground hover:text-foreground -mr-1 -mt-1"
                >
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-44">
                <DropdownMenuItem
                  onClick={() => onPreview(paper)}
                  className="cursor-pointer gap-2"
                >
                  <Eye className="h-4 w-4 text-blue-500" />
                  View / Print
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => onEdit(paper)}
                  className="cursor-pointer gap-2"
                >
                  <Edit className="h-4 w-4 text-amber-500" />
                  Edit Details
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => onDuplicate(paper.id)}
                  className="cursor-pointer gap-2"
                >
                  <Copy className="h-4 w-4 text-purple-500" />
                  Duplicate
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() =>
                    onToggleStatus(
                      paper.id,
                      paper.status === "Published" ? "Draft" : "Published"
                    )
                  }
                  className="cursor-pointer gap-2"
                >
                  <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                  {paper.status === "Published" ? "Mark as Draft" : "Publish Now"}
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => setDeleteConfirmOpen(true)}
                  className="cursor-pointer gap-2 text-destructive focus:text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                  Delete Paper
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Paper Title & Code */}
          <div className="cursor-pointer" onClick={() => onPreview(paper)}>
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-1">
              <span className="font-mono bg-muted px-1.5 py-0.5 rounded text-[11px] font-semibold">
                {paper.examCode || "PAPER"}
              </span>
              <span>•</span>
              <span className="font-medium text-foreground/80">{paper.term}</span>
            </div>
            <h3 className="text-base font-semibold leading-snug line-clamp-2 text-foreground group-hover:text-primary transition-colors">
              {paper.title}
            </h3>
          </div>
        </div>

        {/* Paper Stats & Footer */}
        <div className="mt-4 pt-3 border-t border-border/80 space-y-3">
          {/* Key Metrics Grid */}
          <div className="grid grid-cols-3 gap-2 text-xs text-muted-foreground">
            <div className="flex items-center gap-1.5">
              <Award className="h-3.5 w-3.5 text-amber-500 shrink-0" />
              <div>
                <span className="text-foreground font-semibold">
                  {paper.totalMarks}
                </span>{" "}
                Marks
              </div>
            </div>
            <div className="flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5 text-blue-500 shrink-0" />
              <div>
                <span className="text-foreground font-semibold">
                  {paper.durationMins}
                </span>{" "}
                min
              </div>
            </div>
            <div className="flex items-center gap-1.5">
              <HelpCircle className="h-3.5 w-3.5 text-purple-500 shrink-0" />
              <div>
                <span className="text-foreground font-semibold">
                  {paper.questions?.length || 0}
                </span>{" "}
                Ques
              </div>
            </div>
          </div>

          {/* Card Bottom Actions */}
          <div className="flex items-center justify-between gap-2 pt-1">
            <div className="text-[11px] text-muted-foreground flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              <span>
                {paper.scheduledDate ? `Exam: ${paper.scheduledDate}` : `Created: ${paper.dateCreated}`}
              </span>
            </div>

            <div className="flex items-center gap-1.5">
              <Button
                variant="outline"
                size="sm"
                className="h-7 text-xs px-2.5 hover:bg-muted font-medium"
                onClick={() => onEdit(paper)}
              >
                <Edit className="h-3 w-3 mr-1" />
                Edit
              </Button>
              <Button
                variant="default"
                size="sm"
                className="h-7 text-xs px-3 font-medium shadow-sm"
                onClick={() => onPreview(paper)}
              >
                <Eye className="h-3 w-3 mr-1" />
                View
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Alert Dialog */}
      <AlertDialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this Exam Paper?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to permanently delete{" "}
              <strong>"{paper.title}"</strong> ({paper.className})? This action
              cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={() => {
                onDelete(paper.id);
                setDeleteConfirmOpen(false);
              }}
            >
              Yes, Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
