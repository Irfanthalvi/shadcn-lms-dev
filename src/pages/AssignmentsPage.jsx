import React, { useState } from "react";
import { useLms } from "@/context/LmsContext";
import {
  FileCheck,
  Plus,
  Calendar,
  Clock,
  CheckCircle2,
  Users,
  X,
  BookOpen,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

export default function AssignmentsPage() {
  const { assignments, classes, addAssignment } = useLms();
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedClass, setSelectedClass] = useState("all");

  const [formData, setFormData] = useState({
    title: "",
    classId: "10",
    subject: "Physics",
    dueDate: new Date(Date.now() + 7 * 86400000).toISOString().split("T")[0],
    totalPoints: 20,
  });

  const filteredAssignments =
    selectedClass === "all"
      ? assignments
      : assignments.filter((a) => String(a.classId) === String(selectedClass));

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      toast.warning("Please enter assignment title");
      return;
    }
    addAssignment(formData);
    setFormData({
      title: "",
      classId: "10",
      subject: "Physics",
      dueDate: new Date(Date.now() + 7 * 86400000).toISOString().split("T")[0],
      totalPoints: 20,
    });
    setModalOpen(false);
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs px-2.5 py-0.5 rounded-full font-semibold bg-primary/10 text-primary border border-primary/20">
              Coursework & Homework
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground mt-1">
            Student Assignments & Tasks
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Track homework submissions, project deadlines, and grading status across Classes 8 through 12.
          </p>
        </div>

        <Button onClick={() => setModalOpen(true)} className="gap-2 shadow-sm font-semibold">
          <Plus className="h-4 w-4" />
          Assign New Homework
        </Button>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto text-xs pb-1">
        <button
          onClick={() => setSelectedClass("all")}
          className={`px-3 py-1 rounded-full font-medium transition ${
            selectedClass === "all"
              ? "bg-primary text-primary-foreground"
              : "bg-muted text-muted-foreground hover:text-foreground"
          }`}
        >
          All Classes ({assignments.length})
        </button>
        {classes.map((c) => {
          const count = assignments.filter((a) => String(a.classId) === String(c.id)).length;
          return (
            <button
              key={c.id}
              onClick={() => setSelectedClass(String(c.id))}
              className={`px-3 py-1 rounded-full font-medium transition ${
                selectedClass === String(c.id)
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:text-foreground"
              }`}
            >
              {c.name} ({count})
            </button>
          );
        })}
      </div>

      {/* Assignments Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredAssignments.map((item) => (
          <div
            key={item.id}
            className="bg-card text-card-foreground border border-border rounded-2xl p-5 hover:border-primary/40 hover:shadow-md transition flex flex-col justify-between space-y-4"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Badge variant="outline">{item.className}</Badge>
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-primary/10 text-primary">
                  {item.subject}
                </span>
              </div>

              <h3 className="font-bold text-base text-foreground line-clamp-2">
                {item.title}
              </h3>
            </div>

            <div className="pt-3 border-t border-border space-y-3 text-xs">
              <div className="flex items-center justify-between text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Calendar className="h-3.5 w-3.5 text-primary" /> Due: {item.dueDate}
                </span>
                <span className="font-semibold text-foreground">
                  {item.totalPoints} Pts
                </span>
              </div>

              {/* Progress Bar for Submissions */}
              <div className="space-y-1">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-muted-foreground">Submissions</span>
                  <span className="font-bold text-foreground">
                    {item.submissions} / {item.totalStudents} ({Math.round((item.submissions / item.totalStudents) * 100)}%)
                  </span>
                </div>
                <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-primary h-2 rounded-full transition-all"
                    style={{
                      width: `${(item.submissions / item.totalStudents) * 100}%`,
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-card text-card-foreground border border-border rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-muted/40">
              <h2 className="text-lg font-bold">Assign New Homework</h2>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setModalOpen(false)}
                className="rounded-full"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="aTitle">Assignment Title *</Label>
                <Input
                  id="aTitle"
                  placeholder="e.g. Physics Laws of Motion Problem Set"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData((p) => ({ ...p, title: e.target.value }))
                  }
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="aClass">Target Class *</Label>
                  <Select
                    value={formData.classId}
                    onValueChange={(val) =>
                      setFormData((p) => ({ ...p, classId: val }))
                    }
                  >
                    <SelectTrigger id="aClass">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="8">Class 8</SelectItem>
                      <SelectItem value="9">Class 9</SelectItem>
                      <SelectItem value="10">Class 10</SelectItem>
                      <SelectItem value="11">Class 11</SelectItem>
                      <SelectItem value="12">Class 12</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="aSubject">Subject *</Label>
                  <Input
                    id="aSubject"
                    value={formData.subject}
                    onChange={(e) =>
                      setFormData((p) => ({ ...p, subject: e.target.value }))
                    }
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="aDue">Due Date *</Label>
                  <Input
                    id="aDue"
                    type="date"
                    value={formData.dueDate}
                    onChange={(e) =>
                      setFormData((p) => ({ ...p, dueDate: e.target.value }))
                    }
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="aPts">Total Points</Label>
                  <Input
                    id="aPts"
                    type="number"
                    value={formData.totalPoints}
                    onChange={(e) =>
                      setFormData((p) => ({
                        ...p,
                        totalPoints: Number(e.target.value),
                      }))
                    }
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-border">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setModalOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit">Assign Homework</Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
