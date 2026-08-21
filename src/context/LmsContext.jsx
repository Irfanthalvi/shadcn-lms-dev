import React, { createContext, useContext, useState, useEffect } from "react";
import {
  classesList as defaultClasses,
  initialPapers as defaultPapers,
  studentsList as defaultStudents,
  teachersList as defaultTeachers,
  resultsList as defaultResults,
  assignmentsList as defaultAssignments,
  studyMaterialsList as defaultStudyMaterials,
  announcementsList as defaultAnnouncements,
} from "@/data/mock-lms-data";
import { toast } from "sonner";

const LmsContext = createContext(null);

const STORAGE_KEYS = {
  PAPERS: "lms_papers_store_v1",
  STUDENTS: "lms_students_store_v1",
  ASSIGNMENTS: "lms_assignments_store_v1",
  ANNOUNCEMENTS: "lms_announcements_store_v1",
  THEME: "lms_theme_preference_v1",
};

export const LmsProvider = ({ children }) => {
  // Theme state
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem(STORAGE_KEYS.THEME) || "light";
  });

  // Apply theme to document
  useEffect(() => {
    const root = document.documentElement;
    if (theme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
    localStorage.setItem(STORAGE_KEYS.THEME, theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  };

  // Papers State with LocalStorage
  const [papers, setPapers] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.PAPERS);
      return saved ? JSON.parse(saved) : defaultPapers;
    } catch {
      return defaultPapers;
    }
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.PAPERS, JSON.stringify(papers));
  }, [papers]);

  // Students State
  const [students, setStudents] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.STUDENTS);
      return saved ? JSON.parse(saved) : defaultStudents;
    } catch {
      return defaultStudents;
    }
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.STUDENTS, JSON.stringify(students));
  }, [students]);

  // Assignments State
  const [assignments, setAssignments] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.ASSIGNMENTS);
      return saved ? JSON.parse(saved) : defaultAssignments;
    } catch {
      return defaultAssignments;
    }
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.ASSIGNMENTS, JSON.stringify(assignments));
  }, [assignments]);

  // Announcements State
  const [announcements, setAnnouncements] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.ANNOUNCEMENTS);
      return saved ? JSON.parse(saved) : defaultAnnouncements;
    } catch {
      return defaultAnnouncements;
    }
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.ANNOUNCEMENTS, JSON.stringify(announcements));
  }, [announcements]);

  // Read-only reference lists
  const classes = defaultClasses;
  const teachers = defaultTeachers;
  const results = defaultResults;
  const studyMaterials = defaultStudyMaterials;

  // --- PAPER ACTIONS ---

  // Add Paper
  const addPaper = (paperData) => {
    const classObj = classes.find((c) => c.id === String(paperData.classId));
    const newPaper = {
      ...paperData,
      id: `p-${Date.now()}`,
      className: classObj ? classObj.name : `Class ${paperData.classId}`,
      dateCreated: new Date().toISOString().split("T")[0],
      attemptsCount: 0,
      avgScore: 0,
      status: paperData.status || "Draft",
      questions: paperData.questions || [],
    };

    setPapers((prev) => [newPaper, ...prev]);
    toast.success(`🎉 Paper "${newPaper.title}" added to ${newPaper.className}!`);
    return newPaper;
  };

  // Update / Edit Paper
  const updatePaper = (paperId, updatedFields) => {
    setPapers((prev) =>
      prev.map((paper) => {
        if (paper.id === paperId) {
          const classObj = updatedFields.classId
            ? classes.find((c) => c.id === String(updatedFields.classId))
            : null;
          return {
            ...paper,
            ...updatedFields,
            className: classObj ? classObj.name : paper.className,
            lastModified: new Date().toISOString().split("T")[0],
          };
        }
        return paper;
      })
    );
    toast.success("✅ Paper updated successfully!");
  };

  // Delete Paper
  const deletePaper = (paperId) => {
    const target = papers.find((p) => p.id === paperId);
    setPapers((prev) => prev.filter((p) => p.id !== paperId));
    toast.success(`🗑️ Paper "${target?.title || "Assessment"}" deleted.`);
  };

  // Duplicate Paper
  const duplicatePaper = (paperId) => {
    const original = papers.find((p) => p.id === paperId);
    if (!original) return;

    const duplicated = {
      ...original,
      id: `p-${Date.now()}`,
      title: `${original.title} (Copy)`,
      status: "Draft",
      examCode: `${original.examCode}-COPY`,
      dateCreated: new Date().toISOString().split("T")[0],
      attemptsCount: 0,
      avgScore: 0,
    };

    setPapers((prev) => [duplicated, ...prev]);
    toast.success(`📋 Duplicated "${original.title}" as Draft`);
  };

  // Toggle Paper Status (Published / Draft / Archived)
  const togglePaperStatus = (paperId, newStatus) => {
    setPapers((prev) =>
      prev.map((p) => (p.id === paperId ? { ...p, status: newStatus } : p))
    );
    toast.info(`Status changed to ${newStatus}`);
  };

  // Get papers for a specific class
  const getPapersByClass = (classId) => {
    return papers.filter((p) => String(p.classId) === String(classId));
  };

  // --- STUDENT ACTIONS ---
  const addStudent = (studentData) => {
    const classObj = classes.find((c) => c.id === String(studentData.classId));
    const newStudent = {
      ...studentData,
      id: `s-${Date.now()}`,
      className: classObj ? classObj.name : `Class ${studentData.classId}`,
      gpa: studentData.gpa || "3.50",
      score: studentData.score || "85%",
      attendance: studentData.attendance || "95%",
      status: "Active",
    };
    setStudents((prev) => [newStudent, ...prev]);
    toast.success(`👤 Student ${newStudent.name} registered!`);
  };

  const deleteStudent = (studentId) => {
    setStudents((prev) => prev.filter((s) => s.id !== studentId));
    toast.success("Student record removed.");
  };

  // --- ASSIGNMENT ACTIONS ---
  const addAssignment = (assignmentData) => {
    const classObj = classes.find((c) => c.id === String(assignmentData.classId));
    const newAssignment = {
      ...assignmentData,
      id: `a-${Date.now()}`,
      className: classObj ? classObj.name : `Class ${assignmentData.classId}`,
      submissions: 0,
      totalStudents: classObj ? classObj.studentCount : 60,
      status: "Active",
    };
    setAssignments((prev) => [newAssignment, ...prev]);
    toast.success(`📝 Assignment "${newAssignment.title}" published!`);
  };

  // --- ANNOUNCEMENT ACTIONS ---
  const addAnnouncement = (announcementData) => {
    const newAnn = {
      ...announcementData,
      id: `ann-${Date.now()}`,
      date: new Date().toLocaleDateString("en-US", {
        month: "short",
        day: "2-digit",
        year: "numeric",
      }),
    };
    setAnnouncements((prev) => [newAnn, ...prev]);
    toast.success("📢 Announcement published!");
  };

  return (
    <LmsContext.Provider
      value={{
        theme,
        toggleTheme,
        classes,
        papers,
        students,
        teachers,
        results,
        assignments,
        studyMaterials,
        announcements,
        // Paper methods
        addPaper,
        updatePaper,
        deletePaper,
        duplicatePaper,
        togglePaperStatus,
        getPapersByClass,
        // Student methods
        addStudent,
        deleteStudent,
        // Assignment & Announcement methods
        addAssignment,
        addAnnouncement,
      }}
    >
      {children}
    </LmsContext.Provider>
  );
};

export const useLms = () => {
  const context = useContext(LmsContext);
  if (!context) {
    throw new Error("useLms must be used within an LmsProvider");
  }
  return context;
};
