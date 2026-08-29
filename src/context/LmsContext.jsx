import React, { createContext, useContext, useState, useEffect } from "react";
import {
  subscribeToClasses,
  subscribeToSubjects,
  subscribeToChapters,
  subscribeToQuizzes,
  subscribeToStudents,
  seedInitialLmsDataIfEmpty,
  addClass as apiAddClass,
  updateClass as apiUpdateClass,
  deleteClass as apiDeleteClass,
  addSubject as apiAddSubject,
  updateSubject as apiUpdateSubject,
  deleteSubject as apiDeleteSubject,
  addChapter as apiAddChapter,
  updateChapter as apiUpdateChapter,
  deleteChapter as apiDeleteChapter,
  addQuiz as apiAddQuiz,
  updateQuiz as apiUpdateQuiz,
  deleteQuiz as apiDeleteQuiz,
  submitQuizAttempt as apiSubmitQuizAttempt,
  getStudentAttempts as apiGetStudentAttempts,
  updateStudentApproval as apiUpdateStudentApproval,
  deleteStudentAccount as apiDeleteStudentAccount,
  getQuizById,
} from "@/services/lmsService";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";

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
  const [chapters, setChapters] = useState([]);
  const [quizzes, setQuizzes] = useState([]);
  const [students, setStudents] = useState([]);
  const [studentAttempts, setStudentAttempts] = useState([]);
  const [loadingLms, setLoadingLms] = useState(true);

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
      setChapters([]);
      setQuizzes([]);
      setStudents([]);
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

    const unsubChapters = subscribeToChapters(null, (list) => {
      setChapters(list);
    });

    const unsubQuizzes = subscribeToQuizzes(null, (list) => {
      setQuizzes(list);
    });

    let unsubStudents = () => {};
    if (isAdmin) {
      unsubStudents = subscribeToStudents((list) => {
        setStudents(list);
      });
    }

    return () => {
      unsubClasses();
      unsubSubjects();
      unsubChapters();
      unsubQuizzes();
      unsubStudents();
    };
  }, [user, isAdmin]);

  // Load student attempts when user is present
  useEffect(() => {
    if (user && !isAdmin) {
      apiGetStudentAttempts(user.uid).then((res) => {
        setStudentAttempts(res);
      });
    }
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
        chapters,
        quizzes,
        students,
        studentAttempts,
        loadingLms,
        // Class methods
        addClass: handleAddClass,
        updateClass: handleUpdateClass,
        deleteClass: handleDeleteClass,
        // Subject methods
        addSubject: handleAddSubject,
        updateSubject: handleUpdateSubject,
        deleteSubject: handleDeleteSubject,
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
        deleteStudent: handleDeleteStudent,
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
