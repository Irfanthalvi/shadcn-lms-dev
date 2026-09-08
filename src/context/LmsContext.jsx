import React, { createContext, useContext, useState, useEffect } from "react";
import {
  subscribeToClasses,
  subscribeToSubjects,
  subscribeToBooks,
  subscribeToChapters,
  subscribeToQuizzes,
  subscribeToStudents,
  subscribeToAssignments,
  subscribeToQuizAttempts,
  seedInitialLmsDataIfEmpty,
  addClass as apiAddClass,
  updateClass as apiUpdateClass,
  deleteClass as apiDeleteClass,
  addSubject as apiAddSubject,
  updateSubject as apiUpdateSubject,
  deleteSubject as apiDeleteSubject,
  addBook as apiAddBook,
  updateBook as apiUpdateBook,
  deleteBook as apiDeleteBook,
  addChapter as apiAddChapter,
  updateChapter as apiUpdateChapter,
  deleteChapter as apiDeleteChapter,
  addQuiz as apiAddQuiz,
  updateQuiz as apiUpdateQuiz,
  deleteQuiz as apiDeleteQuiz,
  submitQuizAttempt as apiSubmitQuizAttempt,
  getStudentAttempts as apiGetStudentAttempts,
  getAllQuizAttempts as apiGetAllQuizAttempts,
  updateStudentApproval as apiUpdateStudentApproval,
  updateStudentClass as apiUpdateStudentClass,
  deleteStudentAccount as apiDeleteStudentAccount,
  getQuizById,
  addAssignment as apiAddAssignment,
  updateAssignment as apiUpdateAssignment,
  deleteAssignment as apiDeleteAssignment,
  submitAssignment as apiSubmitAssignment,
  getAssignmentSubmissions as apiGetAssignmentSubmissions,
  getUserAssignmentSubmission as apiGetUserAssignmentSubmission,
  getQuizAttemptByUser as apiGetQuizAttemptByUser,
} from "@/services/lmsService";
import { useAuth } from "@/context/AuthContext";
import toast from "react-hot-toast";

import {
  announcementsList,
  studyMaterialsList,
  resultsList,
} from "@/data/mock-lms-data";

const LmsContext = createContext(null);

export const LmsProvider = ({ children }) => {
  const { user, isAdmin } = useAuth();

  // Theme State
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem("lms_theme_pref") || "light";
  });

  useEffect(() => {
    const root = document.documentElement;
    if (theme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
    localStorage.setItem("lms_theme_pref", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  };

  // Realtime LMS Data States from Firestore
  const [classes, setClasses] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [books, setBooks] = useState([]);
  const [chapters, setChapters] = useState([]);
  const [quizzes, setQuizzes] = useState([]);
  const [students, setStudents] = useState([]);
  const [studentAttempts, setStudentAttempts] = useState([]);
  const [allQuizAttempts, setAllQuizAttempts] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [loadingLms, setLoadingLms] = useState(true);

  // Supplementary Entities with Local Storage Persistence
  const [announcements, setAnnouncements] = useState(() => {
    try {
      const saved = localStorage.getItem("lms_announcements");
      return saved ? JSON.parse(saved) : announcementsList;
    } catch {
      return announcementsList;
    }
  });

  const [studyMaterials, setStudyMaterials] = useState(() => {
    try {
      const saved = localStorage.getItem("lms_materials");
      return saved ? JSON.parse(saved) : studyMaterialsList;
    } catch {
      return studyMaterialsList;
    }
  });

  const [bookmarks, setBookmarks] = useState(() => {
    try {
      const saved = localStorage.getItem("lms_bookmarks");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [notifications, setNotifications] = useState(() => {
    try {
      const saved = localStorage.getItem("lms_notifications");
      return saved
        ? JSON.parse(saved)
        : [
          {
            id: "n-1",
            title: "Welcome to LMS Academy Portal",
            message: "Explore your academic classes, study materials, and self-assessment quizzes.",
            time: "Just now",
            read: false,
            type: "welcome",
          },
          {
            id: "n-2",
            title: "Physics Chapter 1 Quiz Available",
            message: "Test your knowledge on Physical Quantities & Measurement.",
            time: "1 hour ago",
            read: false,
            type: "quiz",
          },
          {
            id: "n-3",
            title: "Date Sheet Announced",
            message: "Annual examination dates have been published on the notice board.",
            time: "1 day ago",
            read: true,
            type: "announcement",
          },
        ];
    } catch {
      return [];
    }
  });

  // Global Search Modal State
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  // Sync supplementary states to localStorage
  useEffect(() => {
    localStorage.setItem("lms_announcements", JSON.stringify(announcements));
  }, [announcements]);

  useEffect(() => {
    localStorage.setItem("lms_bookmarks", JSON.stringify(bookmarks));
  }, [bookmarks]);

  useEffect(() => {
    localStorage.setItem("lms_notifications", JSON.stringify(notifications));
  }, [notifications]);

  // Announcement Actions
  const handleAddAnnouncement = (data) => {
    const newAnn = {
      id: `ann-${Date.now()}`,
      date: new Date().toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" }),
      ...data,
    };
    setAnnouncements((prev) => [newAnn, ...prev]);
    toast.success("Announcement published successfully.");
    return newAnn.id;
  };

  const handleDeleteAnnouncement = (id) => {
    setAnnouncements((prev) => prev.filter((a) => a.id !== id));
    toast.success("Announcement removed.");
  };

  // Assignment Actions (Firestore)
  const handleAddAssignment = async (data) => {
    try {
      const id = await apiAddAssignment(data);
      toast.success(`Assignment "${data.title}" created.`);
      return id;
    } catch (err) {
      toast.error(err?.message || "Failed to create assignment.");
      throw err;
    }
  };

  const handleUpdateAssignment = async (id, data) => {
    try {
      await apiUpdateAssignment(id, data);
      toast.success("Assignment updated.");
    } catch (err) {
      toast.error(err?.message || "Failed to update assignment.");
      throw err;
    }
  };

  const handleDeleteAssignment = async (id) => {
    try {
      await apiDeleteAssignment(id);
      toast.success("Assignment deleted.");
    } catch (err) {
      toast.error(err?.message || "Failed to delete assignment.");
      throw err;
    }
  };

  const handleSubmitAssignment = async (assignmentId, data) => {
    try {
      const id = await apiSubmitAssignment({ assignmentId, ...data });
      toast.success("Assignment submitted successfully!");
      return id;
    } catch (err) {
      toast.error(err?.message || "Failed to submit assignment.");
      throw err;
    }
  };

  const getAssignmentSubmissions = async (assignmentId) => {
    return await apiGetAssignmentSubmissions(assignmentId);
  };

  const getUserAssignmentSubmission = async (assignmentId, userId) => {
    return await apiGetUserAssignmentSubmission(assignmentId, userId);
  };

  const getQuizAttemptByUser = async (quizId, userId) => {
    return await apiGetQuizAttemptByUser(quizId, userId);
  };

  // Bookmark Actions
  const toggleBookmark = (itemId) => {
    setBookmarks((prev) => {
      const exists = prev.includes(itemId);
      const updated = exists ? prev.filter((id) => id !== itemId) : [...prev, itemId];
      toast.success(exists ? "Removed from bookmarks." : "Added to saved bookmarks.");
      return updated;
    });
  };

  const isBookmarked = (itemId) => bookmarks.includes(itemId);

  // Notification Actions
  const markNotificationRead = (id) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const clearAllNotifications = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    toast.success("All notifications marked as read.");
  };

  // Initialize Seeder if Admin and Collection is empty
  useEffect(() => {
    if (isAdmin) {
      seedInitialLmsDataIfEmpty();
    }
  }, [isAdmin]);

  // Realtime Subscriptions
  useEffect(() => {
    if (!user) {
      setClasses([]);
      setSubjects([]);
      setBooks([]);
      setChapters([]);
      setQuizzes([]);
      setStudents([]);
      setStudentAttempts([]);
      setAllQuizAttempts([]);
      setLoadingLms(false);
      return;
    }

    setLoadingLms(true);

    const unsubClasses = subscribeToClasses((list) => {
      setClasses(list);
      setLoadingLms(false);
    });

    const unsubSubjects = subscribeToSubjects(null, (list) => {
      setSubjects(list);
    });

    const unsubBooks = subscribeToBooks(null, (list) => {
      setBooks(list);
    });

    const unsubChapters = subscribeToChapters(null, (list) => {
      setChapters(list);
    });

    const unsubQuizzes = subscribeToQuizzes(null, (list) => {
      setQuizzes(list);
    });

    const unsubAssignments = subscribeToAssignments((list) => {
      setAssignments(list);
    });

    // Realtime quiz attempts
    const unsubAttempts = subscribeToQuizAttempts((list) => {
      setAllQuizAttempts(list);
      if (!isAdmin && user) {
        setStudentAttempts(list.filter((a) => a.userId === user.uid));
      } else {
        setStudentAttempts(list);
      }
    });

    let unsubStudents = () => { };
    if (isAdmin) {
      unsubStudents = subscribeToStudents((list) => {
        setStudents(list);
      });
    }

    return () => {
      unsubClasses();
      unsubSubjects();
      unsubBooks();
      unsubChapters();
      unsubQuizzes();
      unsubAssignments();
      unsubAttempts();
      unsubStudents();
    };
  }, [user, isAdmin]);

  // Class Actions
  const handleAddClass = async (data) => {
    try {
      const id = await apiAddClass(data);
      toast.success(`Class "${data.name}" added successfully.`);
      return id;
    } catch (err) {
      console.error("Error adding class:", err);
      toast.error(err?.message || "Failed to add class.");
      throw err;
    }
  };

  const handleUpdateClass = async (id, data) => {
    try {
      await apiUpdateClass(id, data);
      toast.success("Class updated successfully.");
    } catch (err) {
      console.error("Error updating class:", err);
      toast.error(err?.message || "Failed to update class.");
      throw err;
    }
  };

  const handleDeleteClass = async (id) => {
    try {
      await apiDeleteClass(id);
      toast.success("Class deleted successfully.");
    } catch (err) {
      console.error("Error deleting class:", err);
      toast.error(err?.message || "Failed to delete class.");
      throw err;
    }
  };

  // Subject Actions
  const handleAddSubject = async (data) => {
    try {
      const id = await apiAddSubject(data);
      toast.success(`Subject "${data.name}" added.`);
      return id;
    } catch (err) {
      console.error("Error adding subject:", err);
      toast.error(err?.message || "Failed to add subject.");
      throw err;
    }
  };

  const handleUpdateSubject = async (id, data) => {
    try {
      await apiUpdateSubject(id, data);
      toast.success("Subject updated.");
    } catch (err) {
      console.error("Error updating subject:", err);
      toast.error(err?.message || "Failed to update subject.");
      throw err;
    }
  };

  const handleDeleteSubject = async (id) => {
    try {
      await apiDeleteSubject(id);
      toast.success("Subject deleted.");
    } catch (err) {
      console.error("Error deleting subject:", err);
      toast.error(err?.message || "Failed to delete subject.");
      throw err;
    }
  };

  // Book Actions (Sindh Textbook Board)
  const handleAddBook = async (data) => {
    try {
      const id = await apiAddBook(data);
      toast.success(`Book "${data.title}" added successfully.`);
      return id;
    } catch (err) {
      console.error("Error adding book:", err);
      toast.error(err?.message || "Failed to add book.");
      throw err;
    }
  };

  const handleUpdateBook = async (id, data) => {
    try {
      await apiUpdateBook(id, data);
      toast.success("Book updated successfully.");
    } catch (err) {
      console.error("Error updating book:", err);
      toast.error(err?.message || "Failed to update book.");
      throw err;
    }
  };

  const handleDeleteBook = async (id) => {
    try {
      await apiDeleteBook(id);
      toast.success("Book deleted successfully.");
    } catch (err) {
      console.error("Error deleting book:", err);
      toast.error(err?.message || "Failed to delete book.");
      throw err;
    }
  };

  // Chapter Actions
  const handleAddChapter = async (data) => {
    try {
      const id = await apiAddChapter(data);
      toast.success(`Chapter ${data.chapterNumber} added.`);
      return id;
    } catch (err) {
      console.error("Error adding chapter:", err);
      toast.error(err?.message || "Failed to add chapter.");
      throw err;
    }
  };

  const handleUpdateChapter = async (id, data) => {
    try {
      await apiUpdateChapter(id, data);
      toast.success("Chapter updated.");
    } catch (err) {
      console.error("Error updating chapter:", err);
      toast.error(err?.message || "Failed to update chapter.");
      throw err;
    }
  };

  const handleDeleteChapter = async (id) => {
    try {
      await apiDeleteChapter(id);
      toast.success("Chapter deleted.");
    } catch (err) {
      console.error("Error deleting chapter:", err);
      toast.error(err?.message || "Failed to delete chapter.");
      throw err;
    }
  };

  // Quiz Actions
  const handleAddQuiz = async (data) => {
    try {
      const id = await apiAddQuiz(data);
      toast.success(`Quiz "${data.title}" created.`);
      return id;
    } catch (err) {
      console.error("Error creating quiz:", err);
      toast.error(err?.message || "Failed to create quiz.");
      throw err;
    }
  };

  const handleUpdateQuiz = async (id, data) => {
    try {
      await apiUpdateQuiz(id, data);
      toast.success("Quiz updated.");
    } catch (err) {
      console.error("Error updating quiz:", err);
      toast.error(err?.message || "Failed to update quiz.");
      throw err;
    }
  };

  const handleDeleteQuiz = async (id) => {
    try {
      await apiDeleteQuiz(id);
      toast.success("Quiz deleted.");
    } catch (err) {
      console.error("Error deleting quiz:", err);
      toast.error(err?.message || "Failed to delete quiz.");
      throw err;
    }
  };

  // Quiz Attempt
  const handleQuizSubmit = async (attemptData) => {
    try {
      const attemptId = await apiSubmitQuizAttempt(attemptData);
      // Refresh local attempts
      if (user) {
        const refreshed = await apiGetStudentAttempts(user.uid);
        setStudentAttempts(refreshed);
      }
      return attemptId;
    } catch (err) {
      console.error("Error submitting quiz attempt:", err);
      toast.error(err?.message || "Failed to submit quiz.");
      throw err;
    }
  };

  // Student Approval
  const handleUpdateStudentApproval = async (uid, isApproved) => {
    try {
      await apiUpdateStudentApproval(uid, isApproved);
      toast.success(
        `Student access ${isApproved ? "approved" : "revoked"} successfully.`
      );
    } catch (err) {
      console.error("Error updating student approval:", err);
      toast.error(err?.message || "Failed to update student status.");
      throw err;
    }
  };
  const handleUpdateStudentClass = async (uid, classId, className) => {
    try {
      await apiUpdateStudentClass(uid, classId, className);
      toast.success("Student class updated successfully.");
    } catch (err) {
      console.error("Error updating student class:", err);
      toast.error(err?.message || "Failed to update student class.");
      throw err;
    }
  };
  const handleDeleteStudent = async (uid) => {
    try {
      await apiDeleteStudentAccount(uid);
      toast.success("Student account removed.");
    } catch (err) {
      console.error("Error deleting student:", err);
      toast.error(err?.message || "Failed to remove student.");
      throw err;
    }
  };

  return (
    <LmsContext.Provider
      value={{
        theme,
        toggleTheme,
        classes,
        subjects,
        books,
        chapters,
        quizzes,
        students,
        studentAttempts,
        allQuizAttempts,
        loadingLms,
        // Class methods
        addClass: handleAddClass,
        updateClass: handleUpdateClass,
        deleteClass: handleDeleteClass,
        // Subject methods
        addSubject: handleAddSubject,
        updateSubject: handleUpdateSubject,
        deleteSubject: handleDeleteSubject,
        // Book methods
        addBook: handleAddBook,
        updateBook: handleUpdateBook,
        deleteBook: handleDeleteBook,
        // Chapter methods
        addChapter: handleAddChapter,
        updateChapter: handleUpdateChapter,
        deleteChapter: handleDeleteChapter,
        // Quiz methods
        addQuiz: handleAddQuiz,
        updateQuiz: handleUpdateQuiz,
        deleteQuiz: handleDeleteQuiz,
        getQuizById,
        submitQuizAttempt: handleQuizSubmit,
        // Student Admin methods
        updateStudentApproval: handleUpdateStudentApproval,
        updateStudentClass: handleUpdateStudentClass,
        deleteStudent: handleDeleteStudent,
        // Supplementary Entities & Actions
        announcements,
        addAnnouncement: handleAddAnnouncement,
        deleteAnnouncement: handleDeleteAnnouncement,
        assignments,
        addAssignment: handleAddAssignment,
        updateAssignment: handleUpdateAssignment,
        deleteAssignment: handleDeleteAssignment,
        submitAssignment: handleSubmitAssignment,
        getAssignmentSubmissions,
        getUserAssignmentSubmission,
        getQuizAttemptByUser,
        studyMaterials,
        bookmarks,
        toggleBookmark,
        isBookmarked,
        notifications,
        markNotificationRead,
        clearAllNotifications,
        results: resultsList,
        isSearchOpen,
        setIsSearchOpen,
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

export default LmsContext;
