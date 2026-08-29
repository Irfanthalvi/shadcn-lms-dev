import {
  collection,
  doc,
  getDocs,
  getDoc,
  setDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  onSnapshot,
  serverTimestamp,
  type Unsubscribe,
} from "firebase/firestore";
import { db } from "@/lib/firebase";

// ==========================================
// Types & Interfaces
// ==========================================

export interface ClassItem {
  id: string;
  name: string;
  grade: number;
  description?: string;
  createdAt?: any;
}

export interface SubjectItem {
  id: string;
  classId: string;
  name: string;
  code?: string;
  icon?: string;
  color?: string;
  description?: string;
  createdAt?: any;
}

export interface ChapterItem {
  id: string;
  subjectId: string;
  classId: string;
  chapterNumber: number;
  title: string;
  description?: string;
  createdAt?: any;
}

export interface QuestionItem {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number; // 0, 1, 2, 3
  explanation?: string;
}

export interface QuizItem {
  id: string;
  chapterId: string;
  subjectId: string;
  classId: string;
  title: string;
  timeLimitMinutes: number;
  totalMarks: number;
  passingScore: number;
  questions: QuestionItem[];
  createdAt?: any;
}

export interface QuizAttempt {
  id?: string;
  userId: string;
  userEmail: string;
  userName: string;
  quizId: string;
  quizTitle: string;
  chapterId: string;
  subjectId: string;
  classId: string;
  score: number;
  totalQuestions: number;
  percentage: number;
  passed: boolean;
  selectedAnswers: Record<number, number>;
  submittedAt?: any;
}

export interface StudentUser {
  uid: string;
  name: string;
  email: string;
  role: string;
  isApproved: boolean;
  createdAt?: any;
  photoURL?: string;
}

// ==========================================
// 1. Classes Operations
// ==========================================

export const subscribeToClasses = (
  callback: (classes: ClassItem[]) => void
): Unsubscribe => {
  const q = query(collection(db, "classes"), orderBy("grade", "asc"));
  return onSnapshot(
    q,
    (snapshot) => {
      const list: ClassItem[] = snapshot.docs.map((d) => ({
        id: d.id,
        name: d.data().name || "",
        grade: Number(d.data().grade) || 0,
        description: d.data().description || "",
        createdAt: d.data().createdAt,
      })) as ClassItem[];
      callback(list);
    },
    (err) => {
      console.error("Error subscribing to classes:", err);
      callback([]);
    }
  );
};

export const getClasses = async (): Promise<ClassItem[]> => {
  try {
    const q = query(collection(db, "classes"), orderBy("grade", "asc"));
    const snap = await getDocs(q);
    return snap.docs.map((d) => ({
      id: d.id,
      name: d.data().name || "",
      grade: Number(d.data().grade) || 0,
      description: d.data().description || "",
      createdAt: d.data().createdAt,
    })) as ClassItem[];
  } catch (error) {
    console.error("Error fetching classes:", error);
    return [];
  }
};

export const addClass = async (
  data: Omit<ClassItem, "id">
): Promise<string> => {
  const payload: Record<string, any> = {
    name: data.name.trim(),
    grade: Number(data.grade) || 0,
    description: data.description ? data.description.trim() : "",
    createdAt: serverTimestamp(),
  };

  const docRef = await addDoc(collection(db, "classes"), payload);
  return docRef.id;
};

export const updateClass = async (
  classId: string,
  data: Partial<ClassItem>
): Promise<void> => {
  const payload: Record<string, any> = {
    updatedAt: serverTimestamp(),
  };
  if (data.name !== undefined) payload.name = data.name.trim();
  if (data.grade !== undefined) payload.grade = Number(data.grade) || 0;
  if (data.description !== undefined) payload.description = data.description.trim();

  const docRef = doc(db, "classes", classId);
  await updateDoc(docRef, payload);
};

export const deleteClass = async (classId: string): Promise<void> => {
  const docRef = doc(db, "classes", classId);
  await deleteDoc(docRef);

  // Clean up child subjects, chapters, quizzes for this class
  try {
    const subSnap = await getDocs(
      query(collection(db, "subjects"), where("classId", "==", classId))
    );
    for (const sDoc of subSnap.docs) {
      await deleteSubject(sDoc.id);
    }
  } catch (e) {
    console.warn("Cascade delete subjects failed:", e);
  }
};

// ==========================================
// 2. Subjects Operations
// ==========================================

export const subscribeToSubjects = (
  classId: string | null | undefined,
  callback: (subjects: SubjectItem[]) => void
): Unsubscribe => {
  const col = collection(db, "subjects");
  const q = classId
    ? query(col, where("classId", "==", classId))
    : query(col);

  return onSnapshot(
    q,
    (snapshot) => {
      const list: SubjectItem[] = snapshot.docs.map((d) => ({
        id: d.id,
        classId: d.data().classId || "",
        name: d.data().name || "",
        code: d.data().code || "SUB",
        color: d.data().color || "blue",
        description: d.data().description || "",
        createdAt: d.data().createdAt,
      })) as SubjectItem[];
      list.sort((a, b) => a.name.localeCompare(b.name));
      callback(list);
    },
    (err) => {
      console.error("Error subscribing to subjects:", err);
      callback([]);
    }
  );
};

export const getSubjects = async (
  classId?: string
): Promise<SubjectItem[]> => {
  try {
    const col = collection(db, "subjects");
    const q = classId ? query(col, where("classId", "==", classId)) : query(col);
    const snap = await getDocs(q);
    const list = snap.docs.map((d) => ({
      id: d.id,
      classId: d.data().classId || "",
      name: d.data().name || "",
      code: d.data().code || "SUB",
      color: d.data().color || "blue",
      description: d.data().description || "",
      createdAt: d.data().createdAt,
    })) as SubjectItem[];
    list.sort((a, b) => a.name.localeCompare(b.name));
    return list;
  } catch (error) {
    console.error("Error fetching subjects:", error);
    return [];
  }
};

export const addSubject = async (
  data: Omit<SubjectItem, "id">
): Promise<string> => {
  const payload: Record<string, any> = {
    classId: String(data.classId),
    name: data.name.trim(),
    code: data.code ? data.code.trim().toUpperCase() : "SUB",
    color: data.color || "blue",
    description: data.description ? data.description.trim() : "",
    createdAt: serverTimestamp(),
  };

  const docRef = await addDoc(collection(db, "subjects"), payload);
  return docRef.id;
};

export const updateSubject = async (
  subjectId: string,
  data: Partial<SubjectItem>
): Promise<void> => {
  const payload: Record<string, any> = {
    updatedAt: serverTimestamp(),
  };
  if (data.name !== undefined) payload.name = data.name.trim();
  if (data.code !== undefined) payload.code = data.code.trim().toUpperCase();
  if (data.color !== undefined) payload.color = data.color;
  if (data.description !== undefined) payload.description = data.description.trim();

  const docRef = doc(db, "subjects", subjectId);
  await updateDoc(docRef, payload);
};

export const deleteSubject = async (subjectId: string): Promise<void> => {
  const docRef = doc(db, "subjects", subjectId);
  await deleteDoc(docRef);

  // Clean up child chapters
  try {
    const chapSnap = await getDocs(
      query(collection(db, "chapters"), where("subjectId", "==", subjectId))
    );
    for (const cDoc of chapSnap.docs) {
      await deleteChapter(cDoc.id);
    }
  } catch (e) {
    console.warn("Cascade delete chapters failed:", e);
  }
};

// ==========================================
// 3. Chapters Operations
// ==========================================

export const subscribeToChapters = (
  subjectId: string | null | undefined,
  callback: (chapters: ChapterItem[]) => void
): Unsubscribe => {
  const col = collection(db, "chapters");
  const q = subjectId
    ? query(col, where("subjectId", "==", subjectId))
    : query(col);

  return onSnapshot(
    q,
    (snapshot) => {
      const list: ChapterItem[] = snapshot.docs.map((d) => ({
        id: d.id,
        subjectId: d.data().subjectId || "",
        classId: d.data().classId || "",
        chapterNumber: Number(d.data().chapterNumber) || 1,
        title: d.data().title || "",
        description: d.data().description || "",
        createdAt: d.data().createdAt,
      })) as ChapterItem[];
      list.sort((a, b) => Number(a.chapterNumber || 0) - Number(b.chapterNumber || 0));
      callback(list);
    },
    (err) => {
      console.error("Error subscribing to chapters:", err);
      callback([]);
    }
  );
};

export const getChapters = async (
  subjectId?: string
): Promise<ChapterItem[]> => {
  try {
    const col = collection(db, "chapters");
    const q = subjectId
      ? query(col, where("subjectId", "==", subjectId))
      : query(col);
    const snap = await getDocs(q);
    const list = snap.docs.map((d) => ({
      id: d.id,
      subjectId: d.data().subjectId || "",
      classId: d.data().classId || "",
      chapterNumber: Number(d.data().chapterNumber) || 1,
      title: d.data().title || "",
      description: d.data().description || "",
      createdAt: d.data().createdAt,
    })) as ChapterItem[];
    list.sort((a, b) => Number(a.chapterNumber || 0) - Number(b.chapterNumber || 0));
    return list;
  } catch (error) {
    console.error("Error fetching chapters:", error);
    return [];
  }
};

export const addChapter = async (
  data: Omit<ChapterItem, "id">
): Promise<string> => {
  const payload: Record<string, any> = {
    classId: String(data.classId),
    subjectId: String(data.subjectId),
    chapterNumber: Number(data.chapterNumber) || 1,
    title: data.title.trim(),
    description: data.description ? data.description.trim() : "",
    createdAt: serverTimestamp(),
  };

  const docRef = await addDoc(collection(db, "chapters"), payload);
  return docRef.id;
};

export const updateChapter = async (
  chapterId: string,
  data: Partial<ChapterItem>
): Promise<void> => {
  const payload: Record<string, any> = {
    updatedAt: serverTimestamp(),
  };
  if (data.title !== undefined) payload.title = data.title.trim();
  if (data.chapterNumber !== undefined) payload.chapterNumber = Number(data.chapterNumber) || 1;
  if (data.description !== undefined) payload.description = data.description.trim();

  const docRef = doc(db, "chapters", chapterId);
  await updateDoc(docRef, payload);
};

export const deleteChapter = async (chapterId: string): Promise<void> => {
  const docRef = doc(db, "chapters", chapterId);
  await deleteDoc(docRef);

  // Clean up child quizzes
  try {
    const quizSnap = await getDocs(
      query(collection(db, "quizzes"), where("chapterId", "==", chapterId))
    );
    for (const qDoc of quizSnap.docs) {
      await deleteQuiz(qDoc.id);
    }
  } catch (e) {
    console.warn("Cascade delete quizzes failed:", e);
  }
};

// ==========================================
// 4. Quizzes & Questions Operations
// ==========================================

export const subscribeToQuizzes = (
  chapterId: string | null | undefined,
  callback: (quizzes: QuizItem[]) => void
): Unsubscribe => {
  const col = collection(db, "quizzes");
  const q = chapterId
    ? query(col, where("chapterId", "==", chapterId))
    : query(col);

  return onSnapshot(
    q,
    (snapshot) => {
      const list: QuizItem[] = snapshot.docs.map((d) => ({
        id: d.id,
        chapterId: d.data().chapterId || "",
        subjectId: d.data().subjectId || "",
        classId: d.data().classId || "",
        title: d.data().title || "",
        timeLimitMinutes: Number(d.data().timeLimitMinutes) || 15,
        totalMarks: Number(d.data().totalMarks) || 10,
        passingScore: Number(d.data().passingScore) || 50,
        questions: d.data().questions || [],
        createdAt: d.data().createdAt,
      })) as QuizItem[];
      callback(list);
    },
    (err) => {
      console.error("Error subscribing to quizzes:", err);
      callback([]);
    }
  );
};

export const getQuizzes = async (
  chapterId?: string
): Promise<QuizItem[]> => {
  try {
    const col = collection(db, "quizzes");
    const q = chapterId
      ? query(col, where("chapterId", "==", chapterId))
      : query(col);
    const snap = await getDocs(q);
    return snap.docs.map((d) => ({
      id: d.id,
      chapterId: d.data().chapterId || "",
      subjectId: d.data().subjectId || "",
      classId: d.data().classId || "",
      title: d.data().title || "",
      timeLimitMinutes: Number(d.data().timeLimitMinutes) || 15,
      totalMarks: Number(d.data().totalMarks) || 10,
      passingScore: Number(d.data().passingScore) || 50,
      questions: d.data().questions || [],
      createdAt: d.data().createdAt,
    })) as QuizItem[];
  } catch (error) {
    console.error("Error fetching quizzes:", error);
    return [];
  }
};

export const getQuizById = async (quizId: string): Promise<QuizItem | null> => {
  try {
    const docRef = doc(db, "quizzes", quizId);
    const snap = await getDoc(docRef);
    if (!snap.exists()) return null;
    return {
      id: snap.id,
      chapterId: snap.data().chapterId || "",
      subjectId: snap.data().subjectId || "",
      classId: snap.data().classId || "",
      title: snap.data().title || "",
      timeLimitMinutes: Number(snap.data().timeLimitMinutes) || 15,
      totalMarks: Number(snap.data().totalMarks) || 10,
      passingScore: Number(snap.data().passingScore) || 50,
      questions: snap.data().questions || [],
      createdAt: snap.data().createdAt,
    } as QuizItem;
  } catch (error) {
    console.error("Error fetching quiz:", error);
    return null;
  }
};

export const addQuiz = async (
  data: Omit<QuizItem, "id">
): Promise<string> => {
  const cleanQuestions = (data.questions || []).map((q, idx) => ({
    id: q.id || `q_${Date.now()}_${idx}`,
    question: q.question.trim(),
    options: (q.options || []).map((opt) => opt.trim()),
    correctAnswer: Number(q.correctAnswer) || 0,
    explanation: q.explanation ? q.explanation.trim() : "",
  }));

  const payload: Record<string, any> = {
    classId: String(data.classId),
    subjectId: String(data.subjectId),
    chapterId: String(data.chapterId),
    title: data.title.trim(),
    timeLimitMinutes: Number(data.timeLimitMinutes) || 15,
    totalMarks: Number(data.totalMarks) || cleanQuestions.length || 10,
    passingScore: Number(data.passingScore) || 50,
    questions: cleanQuestions,
    createdAt: serverTimestamp(),
  };

  const docRef = await addDoc(collection(db, "quizzes"), payload);
  return docRef.id;
};

export const updateQuiz = async (
  quizId: string,
  data: Partial<QuizItem>
): Promise<void> => {
  const payload: Record<string, any> = {
    updatedAt: serverTimestamp(),
  };
  if (data.title !== undefined) payload.title = data.title.trim();
  if (data.timeLimitMinutes !== undefined) payload.timeLimitMinutes = Number(data.timeLimitMinutes) || 15;
  if (data.totalMarks !== undefined) payload.totalMarks = Number(data.totalMarks) || 10;
  if (data.passingScore !== undefined) payload.passingScore = Number(data.passingScore) || 50;
  if (data.questions !== undefined) {
    payload.questions = data.questions.map((q, idx) => ({
      id: q.id || `q_${Date.now()}_${idx}`,
      question: q.question.trim(),
      options: (q.options || []).map((opt) => opt.trim()),
      correctAnswer: Number(q.correctAnswer) || 0,
      explanation: q.explanation ? q.explanation.trim() : "",
    }));
  }

  const docRef = doc(db, "quizzes", quizId);
  await updateDoc(docRef, payload);
};

export const deleteQuiz = async (quizId: string): Promise<void> => {
  const docRef = doc(db, "quizzes", quizId);
  await deleteDoc(docRef);
};

// ==========================================
// 5. Quiz Attempts / Results
// ==========================================

export const submitQuizAttempt = async (
  attempt: QuizAttempt
): Promise<string> => {
  const payload: Record<string, any> = {
    userId: attempt.userId,
    userEmail: attempt.userEmail || "",
    userName: attempt.userName || "Student",
    quizId: attempt.quizId,
    quizTitle: attempt.quizTitle,
    chapterId: attempt.chapterId,
    subjectId: attempt.subjectId,
    classId: attempt.classId,
    score: Number(attempt.score) || 0,
    totalQuestions: Number(attempt.totalQuestions) || 0,
    percentage: Number(attempt.percentage) || 0,
    passed: Boolean(attempt.passed),
    selectedAnswers: attempt.selectedAnswers || {},
    submittedAt: serverTimestamp(),
  };

  const docRef = await addDoc(collection(db, "quiz_attempts"), payload);
  return docRef.id;
};

export const getStudentAttempts = async (
  userId: string
): Promise<QuizAttempt[]> => {
  try {
    const q = query(
      collection(db, "quiz_attempts"),
      where("userId", "==", userId)
    );
    const snap = await getDocs(q);
    return snap.docs.map((d) => ({
      id: d.id,
      ...d.data(),
    })) as QuizAttempt[];
  } catch (error) {
    console.error("Error fetching student attempts:", error);
    return [];
  }
};

export const getAllQuizAttempts = async (): Promise<QuizAttempt[]> => {
  try {
    const snap = await getDocs(collection(db, "quiz_attempts"));
    return snap.docs.map((d) => ({ id: d.id, ...d.data() })) as QuizAttempt[];
  } catch (error) {
    console.error("Error fetching all attempts:", error);
    return [];
  }
};

// ==========================================
// 6. Students Directory (Admin)
// ==========================================

export const subscribeToStudents = (
  callback: (students: StudentUser[]) => void
): Unsubscribe => {
  const q = query(collection(db, "users"));
  return onSnapshot(
    q,
    (snapshot) => {
      const list: StudentUser[] = snapshot.docs
        .map((d) => ({
          uid: d.id,
          name: d.data().name || "",
          email: d.data().email || "",
          role: d.data().role || "student",
          isApproved: Boolean(d.data().isApproved),
          createdAt: d.data().createdAt,
          photoURL: d.data().photoURL,
        }))
        .filter((u: StudentUser) => u.role !== "admin");
      callback(list);
    },
    (err) => {
      console.error("Error subscribing to students:", err);
      callback([]);
    }
  );
};

export const updateStudentApproval = async (
  uid: string,
  isApproved: boolean
): Promise<void> => {
  if (!uid) throw new Error("Student UID is required to update approval.");
  const docRef = doc(db, "users", uid);
  await updateDoc(docRef, {
    isApproved: Boolean(isApproved),
    updatedAt: serverTimestamp(),
  });
};

export const deleteStudentAccount = async (uid: string): Promise<void> => {
  if (!uid) throw new Error("Student UID is required to delete account.");
  const docRef = doc(db, "users", uid);
  await deleteDoc(docRef);
};

// ==========================================
// 7. Initial Seeder if Firestore is Fresh
// ==========================================

export const seedInitialLmsDataIfEmpty = async (): Promise<void> => {
  try {
    const classSnap = await getDocs(collection(db, "classes"));
    if (!classSnap.empty) {
      return; // Already initialized
    }

    console.log("[LMS Seeder] Initializing standard classes 8 - 12...");

    const standardClasses = [
      { name: "Class 8", grade: 8, description: "Middle Section - Foundational Core Curriculum" },
      { name: "Class 9", grade: 9, description: "Matric Part I - Secondary School Certificate" },
      { name: "Class 10", grade: 10, description: "Matric Part II - Secondary School Certificate" },
      { name: "Class 11", grade: 11, description: "FSc / Intermediate Part I" },
      { name: "Class 12", grade: 12, description: "FSc / Intermediate Part II" },
    ];

    for (const c of standardClasses) {
      const classRef = await addDoc(collection(db, "classes"), {
        ...c,
        createdAt: serverTimestamp(),
      });

      // Add default subjects for Class 9 and 10
      if (c.grade === 9 || c.grade === 10) {
        const defaultSubjects = [
          { name: "Physics", code: "PHY", color: "blue", description: "Mechanics, Energy, and Waves" },
          { name: "Chemistry", code: "CHEM", color: "emerald", description: "Atomic Structure and Chemical Bonding" },
          { name: "Mathematics", code: "MATH", color: "amber", description: "Algebra, Geometry, and Trigonometry" },
          { name: "Biology", code: "BIO", color: "teal", description: "Cell Structure and Physiology" },
          { name: "English", code: "ENG", color: "purple", description: "Grammar, Comprehension, and Literature" },
        ];

        for (const s of defaultSubjects) {
          const subRef = await addDoc(collection(db, "subjects"), {
            ...s,
            classId: classRef.id,
            createdAt: serverTimestamp(),
          });

          // If Physics, seed Chapter 1 & 2 + Quizzes
          if (s.name === "Physics") {
            const chap1Ref = await addDoc(collection(db, "chapters"), {
              chapterNumber: 1,
              title: "Physical Quantities and Measurement",
              description: "Introduction to physical quantities, SI units, and measurement instruments.",
              subjectId: subRef.id,
              classId: classRef.id,
              createdAt: serverTimestamp(),
            });

            await addDoc(collection(db, "quizzes"), {
              chapterId: chap1Ref.id,
              subjectId: subRef.id,
              classId: classRef.id,
              title: "Chapter 1 Self-Assessment Test",
              timeLimitMinutes: 15,
              totalMarks: 5,
              passingScore: 60,
              questions: [
                {
                  id: "q1",
                  question: "Which of the following is a base SI quantity?",
                  options: ["Speed", "Electric Current", "Force", "Volume"],
                  correctAnswer: 1,
                  explanation: "Electric current is one of the seven fundamental SI base quantities (Unit: Ampere).",
                },
                {
                  id: "q2",
                  question: "The least count of a standard Vernier Calipers is typically:",
                  options: ["0.1 mm", "0.01 mm", "1 mm", "0.001 mm"],
                  correctAnswer: 0,
                  explanation: "Standard vernier calipers have a least count of 0.1 mm (or 0.01 cm).",
                },
                {
                  id: "q3",
                  question: "Which instrument is most suitable to measure the internal diameter of a test tube?",
                  options: ["Meter rule", "Vernier Calipers", "Screw Gauge", "Measuring Cylinder"],
                  correctAnswer: 1,
                  explanation: "The upper jaws of Vernier Calipers are designed to measure internal diameters.",
                },
                {
                  id: "q4",
                  question: "What is the SI unit of mass?",
                  options: ["Gram", "Kilogram", "Milligram", "Newton"],
                  correctAnswer: 1,
                  explanation: "The base SI unit of mass is the Kilogram (kg).",
                },
                {
                  id: "q5",
                  question: "How many significant figures are in 0.00450?",
                  options: ["2", "3", "5", "6"],
                  correctAnswer: 1,
                  explanation: "Leading zeros are not significant; trailing zeros after a decimal point are significant (4, 5, 0 = 3 sig figs).",
                },
              ],
              createdAt: serverTimestamp(),
            });
          }
        }
      }
    }

    console.log("[LMS Seeder] Standard LMS seed complete.");
  } catch (error) {
    console.error("[LMS Seeder] Seeding error:", error);
  }
};
