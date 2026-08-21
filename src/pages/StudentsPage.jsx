import React, { useState } from "react";
import { useLms } from "@/context/LmsContext";
import {
  Users,
  Search,
  Plus,
  Filter,
  GraduationCap,
  Mail,
  Phone,
  CheckCircle,
  Clock,
  Trash2,
  Eye,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

export default function StudentsPage() {
  const { students, classes, addStudent, deleteStudent } = useLms();
  const [search, setSearch] = useState("");
  const [selectedClass, setSelectedClass] = useState("all");
  const [addModalOpen, setAddModalOpen] = useState(false);

  // New Student Form State
  const [newStudent, setNewStudent] = useState({
    name: "",
    rollNo: "",
    classId: "10",
    section: "Science",
    email: "",
    guardian: "",
    gpa: "3.80",
    score: "88%",
    attendance: "95%",
  });

  const filteredStudents = students.filter((s) => {
    const matchesSearch =
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.rollNo.toLowerCase().includes(search.toLowerCase()) ||
      s.email.toLowerCase().includes(search.toLowerCase());
    const matchesClass =
      selectedClass === "all" || String(s.classId) === String(selectedClass);
    return matchesSearch && matchesClass;
  });

  const handleAddSubmit = (e) => {
    e.preventDefault();
    if (!newStudent.name.trim() || !newStudent.rollNo.trim()) {
      toast.warning("Please fill in Student Name and Roll Number");
      return;
    }
    addStudent(newStudent);
    setNewStudent({
      name: "",
      rollNo: "",
      classId: "10",
      section: "Science",
      email: "",
      guardian: "",
      gpa: "3.80",
      score: "88%",
      attendance: "95%",
    });
    setAddModalOpen(false);
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs px-2.5 py-0.5 rounded-full font-semibold bg-primary/10 text-primary border border-primary/20">
              Student Directory
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground mt-1">
            Enrolled Students Roster
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage academic records, attendance standing, and grade profiles across Classes 8 through 12.
          </p>
        </div>

        <Button onClick={() => setAddModalOpen(true)} className="gap-2 shadow-sm font-semibold">
          <Plus className="h-4 w-4" />
          Enroll New Student
        </Button>
      </div>

      {/* Filter Bar */}
      <div className="bg-card border border-border rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-sm">
        <div className="relative flex-1 w-full max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search student by name, roll number, or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 h-9 text-xs"
          />
        </div>

        {/* Class Filter Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto text-xs pb-1 sm:pb-0">
          <button
            onClick={() => setSelectedClass("all")}
            className={`px-3 py-1 rounded-full font-medium transition whitespace-nowrap ${
              selectedClass === "all"
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground hover:text-foreground"
            }`}
          >
            All ({students.length})
          </button>
          {classes.map((c) => {
            const count = students.filter((s) => String(s.classId) === String(c.id)).length;
            const isSelected = selectedClass === String(c.id);
            return (
              <button
                key={c.id}
                onClick={() => setSelectedClass(String(c.id))}
                className={`px-3 py-1 rounded-full font-medium transition whitespace-nowrap ${
                  isSelected
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground hover:text-foreground"
                }`}
              >
                {c.name} ({count})
              </button>
            );
          })}
        </div>
      </div>

      {/* Students Table */}
      <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-muted/50 text-muted-foreground text-xs uppercase border-b border-border">
              <tr>
                <th className="px-5 py-3.5 font-semibold">Roll No</th>
                <th className="px-5 py-3.5 font-semibold">Student Name</th>
                <th className="px-4 py-3.5 font-semibold">Class & Section</th>
                <th className="px-4 py-3.5 font-semibold">GPA / Score</th>
                <th className="px-4 py-3.5 font-semibold">Attendance</th>
                <th className="px-4 py-3.5 font-semibold">Status</th>
                <th className="px-5 py-3.5 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredStudents.map((student) => (
                <tr key={student.id} className="hover:bg-muted/30 transition">
                  <td className="px-5 py-3.5 font-mono text-xs font-bold text-primary">
                    {student.rollNo}
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="font-semibold text-foreground">{student.name}</div>
                    <div className="text-xs text-muted-foreground">{student.email}</div>
                  </td>
                  <td className="px-4 py-3.5">
                    <span className="font-medium text-foreground">{student.className}</span>
                    <span className="text-xs text-muted-foreground ml-1">({student.section})</span>
                  </td>
                  <td className="px-4 py-3.5">
                    <div className="font-bold text-foreground text-xs">{student.gpa} GPA</div>
                    <div className="text-[11px] text-muted-foreground">Avg: {student.score}</div>
                  </td>
                  <td className="px-4 py-3.5">
                    <span className="font-semibold text-emerald-600 dark:text-emerald-400 text-xs">
                      {student.attendance}
                    </span>
                  </td>
                  <td className="px-4 py-3.5">
                    <span
                      className={`text-xs px-2.5 py-0.5 rounded-full font-medium border ${
                        student.status === "Active"
                          ? "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-800"
                          : "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-400 dark:border-amber-800"
                      }`}
                    >
                      {student.status}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-right">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-destructive hover:bg-destructive/10"
                      onClick={() => deleteStudent(student.id)}
                      title="Remove Student"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Student Modal */}
      {addModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-card text-card-foreground border border-border rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-muted/40">
              <h2 className="text-lg font-bold">Enroll New Student</h2>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setAddModalOpen(false)}
                className="rounded-full"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>

            <form onSubmit={handleAddSubmit} className="p-6 space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="sName">Full Name *</Label>
                <Input
                  id="sName"
                  placeholder="e.g. Ahmad Tariq"
                  value={newStudent.name}
                  onChange={(e) =>
                    setNewStudent((p) => ({ ...p, name: e.target.value }))
                  }
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="sRoll">Roll Number *</Label>
                  <Input
                    id="sRoll"
                    placeholder="e.g. 10-05"
                    value={newStudent.rollNo}
                    onChange={(e) =>
                      setNewStudent((p) => ({ ...p, rollNo: e.target.value }))
                    }
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="sClass">Assigned Class *</Label>
                  <Select
                    value={newStudent.classId}
                    onValueChange={(val) =>
                      setNewStudent((p) => ({ ...p, classId: val }))
                    }
                  >
                    <SelectTrigger id="sClass">
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
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="sSection">Section / Stream</Label>
                  <Input
                    id="sSection"
                    placeholder="Science / Pre-Eng"
                    value={newStudent.section}
                    onChange={(e) =>
                      setNewStudent((p) => ({ ...p, section: e.target.value }))
                    }
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="sEmail">Student Email</Label>
                  <Input
                    id="sEmail"
                    type="email"
                    placeholder="student@school.edu"
                    value={newStudent.email}
                    onChange={(e) =>
                      setNewStudent((p) => ({ ...p, email: e.target.value }))
                    }
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="sGuardian">Parent / Guardian Contact</Label>
                <Input
                  id="sGuardian"
                  placeholder="Guardian Name & Phone"
                  value={newStudent.guardian}
                  onChange={(e) =>
                    setNewStudent((p) => ({ ...p, guardian: e.target.value }))
                  }
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-border">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setAddModalOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit">Enroll Student</Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
