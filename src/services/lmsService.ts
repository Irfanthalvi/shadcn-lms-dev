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
import { auth, db } from "@/lib/firebase";
import {
  sindhBoardClasses,
  sindhBoardSubjects,
  sindhBoardBooks,
  sindhBoardChapters,
} from "@/data/sindhBoardCurriculum";

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

export interface BookItem {
  id: string;
  classId: string;
  subjectId: string;
  title: string;
  author?: string;
  board?: string;
  edition?: string;
  description?: string;
  coverUrl?: string;
  totalChapters?: number;
  pdfUrl?: string;
  createdAt?: any;
}

export interface ChapterItem {
  id: string;
  subjectId: string;
  classId: string;
  bookId?: string;
  chapterNumber: number;
  title: string;
  description?: string;
  learningObjectives?: string[];
  theoryNotes?: string;
  keyFormulas?: string;
  resourceLink?: string;
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
  autoSubmitted?: boolean;
  timeTakenSeconds?: number;
}

export interface AssignmentItem {
  id: string;
  classId: string;
  className?: string;
  title: string;
  description: string;
  dueDate?: string; // ISO string
  totalMarks: number;
  passingMarks: number;
  attachmentUrl?: string;
  createdAt?: any;
}

export interface AssignmentSubmission {
  id?: string;
  assignmentId: string;
  userId: string;
  userName: string;
  userEmail: string;
  classId: string;
  response: string;
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
// 3. Books Operations (Sindh Textbook Board)
// ==========================================

export const subscribeToBooks = (
  subjectId: string | null | undefined,
  callback: (books: BookItem[]) => void
): Unsubscribe => {
  const col = collection(db, "books");
  const q = subjectId
    ? query(col, where("subjectId", "==", subjectId))
    : query(col);

  return onSnapshot(
    q,
    (snapshot) => {
      const list: BookItem[] = snapshot.docs.map((d) => ({
        id: d.id,
        classId: d.data().classId || "",
        subjectId: d.data().subjectId || "",
        title: d.data().title || "",
        author: d.data().author || "Sindh Textbook Board",
        board: d.data().board || "Sindh Textbook Board, Jamshoro",
        edition: d.data().edition || "Latest Revised Edition",
        description: d.data().description || "",
        coverUrl: d.data().coverUrl || "",
        totalChapters: Number(d.data().totalChapters) || 0,
        pdfUrl: d.data().pdfUrl || "",
        createdAt: d.data().createdAt,
      }));
      callback(list);
    },
    (err) => {
      console.error("Error subscribing to books:", err);
      callback([]);
    }
  );
};

export const getBooks = async (subjectId?: string): Promise<BookItem[]> => {
  try {
    const col = collection(db, "books");
    const q = subjectId
      ? query(col, where("subjectId", "==", subjectId))
      : query(col);
    const snap = await getDocs(q);
    return snap.docs.map((d) => ({
      id: d.id,
      classId: d.data().classId || "",
      subjectId: d.data().subjectId || "",
      title: d.data().title || "",
      author: d.data().author || "Sindh Textbook Board",
      board: d.data().board || "Sindh Textbook Board, Jamshoro",
      edition: d.data().edition || "Latest Revised Edition",
      description: d.data().description || "",
      coverUrl: d.data().coverUrl || "",
      totalChapters: Number(d.data().totalChapters) || 0,
      pdfUrl: d.data().pdfUrl || "",
      createdAt: d.data().createdAt,
    }));
  } catch (error) {
    console.error("Error fetching books:", error);
    return [];
  }
};

export const addBook = async (
  data: Omit<BookItem, "id">
): Promise<string> => {
  const payload: Record<string, any> = {
    classId: String(data.classId),
    subjectId: String(data.subjectId),
    title: data.title.trim(),
    author: data.author ? data.author.trim() : "Sindh Textbook Board",
    board: data.board ? data.board.trim() : "Sindh Textbook Board, Jamshoro",
    edition: data.edition ? data.edition.trim() : "Latest Revised Edition",
    description: data.description ? data.description.trim() : "",
    coverUrl: data.coverUrl || "",
    totalChapters: Number(data.totalChapters) || 0,
    pdfUrl: data.pdfUrl || "",
    createdAt: serverTimestamp(),
  };

  const docRef = await addDoc(collection(db, "books"), payload);
  return docRef.id;
};

export const updateBook = async (
  bookId: string,
  data: Partial<BookItem>
): Promise<void> => {
  const payload: Record<string, any> = {
    updatedAt: serverTimestamp(),
  };
  if (data.title !== undefined) payload.title = data.title.trim();
  if (data.author !== undefined) payload.author = data.author.trim();
  if (data.board !== undefined) payload.board = data.board.trim();
  if (data.edition !== undefined) payload.edition = data.edition.trim();
  if (data.description !== undefined) payload.description = data.description.trim();
  if (data.coverUrl !== undefined) payload.coverUrl = data.coverUrl;
  if (data.totalChapters !== undefined) payload.totalChapters = Number(data.totalChapters);
  if (data.pdfUrl !== undefined) payload.pdfUrl = data.pdfUrl;

  const docRef = doc(db, "books", bookId);
  await updateDoc(docRef, payload);
};

export const deleteBook = async (bookId: string): Promise<void> => {
  const docRef = doc(db, "books", bookId);
  await deleteDoc(docRef);
};

// ==========================================
// 3.2 Chapters Operations
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
        bookId: d.data().bookId || "",
        chapterNumber: Number(d.data().chapterNumber) || 1,
        title: d.data().title || "",
        description: d.data().description || "",
        learningObjectives: d.data().learningObjectives || [],
        theoryNotes: d.data().theoryNotes || "",
        keyFormulas: d.data().keyFormulas || "",
        resourceLink: d.data().resourceLink || "",
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
      bookId: d.data().bookId || "",
      chapterNumber: Number(d.data().chapterNumber) || 1,
      title: d.data().title || "",
      description: d.data().description || "",
      learningObjectives: d.data().learningObjectives || [],
      theoryNotes: d.data().theoryNotes || "",
      keyFormulas: d.data().keyFormulas || "",
      resourceLink: d.data().resourceLink || "",
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
    bookId: data.bookId ? String(data.bookId) : "",
    chapterNumber: Number(data.chapterNumber) || 1,
    title: data.title.trim(),
    description: data.description ? data.description.trim() : "",
    learningObjectives: data.learningObjectives || [],
    theoryNotes: data.theoryNotes || "",
    keyFormulas: data.keyFormulas || "",
    resourceLink: data.resourceLink || "",
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
  if (data.bookId !== undefined) payload.bookId = String(data.bookId);
  if (data.learningObjectives !== undefined) payload.learningObjectives = data.learningObjectives;
  if (data.theoryNotes !== undefined) payload.theoryNotes = data.theoryNotes;
  if (data.keyFormulas !== undefined) payload.keyFormulas = data.keyFormulas;
  if (data.resourceLink !== undefined) payload.resourceLink = data.resourceLink;

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

export const subscribeToQuizAttempts = (
  callback: (attempts: QuizAttempt[]) => void,
  userId?: string
): Unsubscribe => {
  const col = collection(db, "quiz_attempts");
  const q = userId
    ? query(col, where("userId", "==", userId))
    : query(col);

  return onSnapshot(
    q,
    (snapshot) => {
      const list: QuizAttempt[] = snapshot.docs.map((d) => ({
        id: d.id,
        ...d.data(),
      })) as QuizAttempt[];
      list.sort((a, b) => {
        const tA = a.submittedAt?.seconds || 0;
        const tB = b.submittedAt?.seconds || 0;
        return tB - tA;
      });
      callback(list);
    },
    (err) => {
      console.error("Error subscribing to quiz attempts:", err);
      callback([]);
    }
  );
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
  if (!uid) {
    throw new Error("Student UID is required to delete account.");
  }

  const currentUser = auth.currentUser;

  if (!currentUser) {
    throw new Error("You must be logged in.");
  }

  const idToken = await currentUser.getIdToken();

  const response = await fetch(
    `${import.meta.env.VITE_API_BASE_URL}/api/admin/delete-student`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${idToken}`,
      },
      body: JSON.stringify({ uid }),
    }
  );

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.error || "Failed to remove student account.");
  }
};

// ==========================================
// 7. Initial Seeder if Firestore is Fresh
// ==========================================

export const seedInitialLmsDataIfEmpty = async (): Promise<void> => {
  try {
    // 1. Check or seed classes
    const classSnap = await getDocs(collection(db, "classes"));
    const existingClassesMap = new Map<string, string>(); // grade -> docId

    if (classSnap.empty) {
      console.log("[LMS Seeder] Seeding Sindh Board Classes 8 through 12...");
      for (const c of sindhBoardClasses) {
        const docRef = await addDoc(collection(db, "classes"), {
          name: c.name,
          grade: c.grade,
          description: c.description,
          createdAt: serverTimestamp(),
        });
        existingClassesMap.set(String(c.grade), docRef.id);
      }
    } else {
      classSnap.docs.forEach((d) => {
        existingClassesMap.set(String(d.data().grade || d.data().name), d.id);
        existingClassesMap.set(String(d.data().name), d.id);
      });
    }

    // 2. Check or seed subjects
    const subSnap = await getDocs(collection(db, "subjects"));
    const existingSubjectsMap = new Map<string, string>(); // "classGrade_subjectName" -> docId

    if (subSnap.empty) {
      console.log("[LMS Seeder] Seeding Sindh Board Subjects for all classes...");
      for (const s of sindhBoardSubjects) {
        const targetClass = sindhBoardClasses.find((c) => c.id === s.classId);
        const gradeKey = targetClass ? String(targetClass.grade) : "9";
        const realClassDocId = existingClassesMap.get(gradeKey) || existingClassesMap.get(`Class ${gradeKey}`);

        if (realClassDocId) {
          const docRef = await addDoc(collection(db, "subjects"), {
            classId: realClassDocId,
            name: s.name,
            code: s.code,
            icon: s.icon,
            color: s.color,
            description: s.description,
            createdAt: serverTimestamp(),
          });
          existingSubjectsMap.set(`${gradeKey}_${s.name.toLowerCase()}`, docRef.id);
        }
      }
    } else {
      subSnap.docs.forEach((d) => {
        const name = (d.data().name || "").toLowerCase();
        existingSubjectsMap.set(`${d.data().classId}_${name}`, d.id);
        existingSubjectsMap.set(name, d.id);
      });
    }

    // 3. Check or seed books
    const bookSnap = await getDocs(collection(db, "books"));
    const existingBooksMap = new Map<string, string>();

    if (bookSnap.empty) {
      console.log("[LMS Seeder] Seeding Sindh Textbook Board Books...");
      for (const b of sindhBoardBooks) {
        const targetSubject = sindhBoardSubjects.find((s) => s.id === b.subjectId);
        const targetClass = sindhBoardClasses.find((c) => c.id === b.classId);
        const gradeKey = targetClass ? String(targetClass.grade) : "9";
        const realClassDocId = existingClassesMap.get(gradeKey) || existingClassesMap.get(`Class ${gradeKey}`);

        // Find matching subject
        let realSubDocId = "";
        if (targetSubject) {
          realSubDocId =
            existingSubjectsMap.get(`${gradeKey}_${targetSubject.name.toLowerCase()}`) ||
            existingSubjectsMap.get(targetSubject.name.toLowerCase()) ||
            "";
        }

        const bookDocRef = await addDoc(collection(db, "books"), {
          classId: realClassDocId || b.classId,
          subjectId: realSubDocId || b.subjectId,
          title: b.title,
          author: b.author,
          board: b.board,
          edition: b.edition,
          description: b.description,
          coverUrl: b.coverUrl,
          totalChapters: b.totalChapters,
          createdAt: serverTimestamp(),
        });
        existingBooksMap.set(b.id, bookDocRef.id);
        existingBooksMap.set(b.title.toLowerCase(), bookDocRef.id);
      }
    } else {
      bookSnap.docs.forEach((d) => {
        existingBooksMap.set(d.id, d.id);
        existingBooksMap.set((d.data().title || "").toLowerCase(), d.id);
      });
    }

    // 4. Check or seed chapters with content
    const chapSnap = await getDocs(collection(db, "chapters"));
    if (chapSnap.empty) {
      console.log("[LMS Seeder] Seeding Sindh Board Chapters and Notes...");
      for (const ch of sindhBoardChapters) {
        const targetClass = sindhBoardClasses.find((c) => c.id === ch.classId);
        const gradeKey = targetClass ? String(targetClass.grade) : "9";
        const realClassDocId = existingClassesMap.get(gradeKey) || existingClassesMap.get(`Class ${gradeKey}`) || ch.classId;

        const targetSubject = sindhBoardSubjects.find((s) => s.id === ch.subjectId);
        let realSubDocId = ch.subjectId;
        if (targetSubject) {
          realSubDocId =
            existingSubjectsMap.get(`${gradeKey}_${targetSubject.name.toLowerCase()}`) ||
            existingSubjectsMap.get(targetSubject.name.toLowerCase()) ||
            ch.subjectId;
        }

        const realBookDocId = existingBooksMap.get(ch.bookId) || "";

        const chapRef = await addDoc(collection(db, "chapters"), {
          classId: realClassDocId,
          subjectId: realSubDocId,
          bookId: realBookDocId,
          chapterNumber: ch.chapterNumber,
          title: ch.title,
          description: ch.description,
          learningObjectives: ch.learningObjectives || [],
          theoryNotes: ch.theoryNotes || "",
          keyFormulas: ch.keyFormulas || "",
          resourceLink: ch.resourceLink || "",
          createdAt: serverTimestamp(),
        });

        // If Chapter 1 of Class 9 Physics, seed initial quiz test
        if (ch.chapterNumber === 1 && targetSubject?.name === "Physics" && gradeKey === "9") {
          await addDoc(collection(db, "quizzes"), {
            chapterId: chapRef.id,
            subjectId: realSubDocId,
            classId: realClassDocId,
            title: "Physics Ch 1: Physical Quantities Self-Assessment",
            timeLimitMinutes: 15,
            totalMarks: 5,
            passingScore: 60,
            questions: [
              {
                id: "q1",
                question: "Which of the following is a base SI quantity in the Sindh Board curriculum?",
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

    console.log("[LMS Seeder] Complete Sindh Board Curriculum initialized successfully.");
  } catch (error) {
    console.error("[LMS Seeder] Seeding error:", error);
  }
};

// ==========================================
// 8. Assignment Operations (Firestore)
// ==========================================

export const subscribeToAssignments = (
  callback: (assignments: AssignmentItem[]) => void,
  classId?: string
): Unsubscribe => {
  let q;
  if (classId) {
    q = query(
      collection(db, "assignments"),
      where("classId", "==", classId),
      orderBy("createdAt", "desc")
    );
  } else {
    q = query(collection(db, "assignments"), orderBy("createdAt", "desc"));
  }

  return onSnapshot(
    q,
    (snapshot) => {
      const list: AssignmentItem[] = snapshot.docs.map((d) => ({
        id: d.id,
        classId: d.data().classId || "",
        className: d.data().className || "",
        title: d.data().title || "",
        description: d.data().description || "",
        dueDate: d.data().dueDate || "",
        totalMarks: Number(d.data().totalMarks) || 0,
        passingMarks: Number(d.data().passingMarks) || 0,
        attachmentUrl: d.data().attachmentUrl || "",
        createdAt: d.data().createdAt,
      }));
      callback(list);
    },
    (err) => {
      console.error("Error subscribing to assignments:", err);
      callback([]);
    }
  );
};

export const addAssignment = async (
  data: Omit<AssignmentItem, "id">
): Promise<string> => {
  const docRef = await addDoc(collection(db, "assignments"), {
    ...data,
    createdAt: serverTimestamp(),
  });
  return docRef.id;
};

export const updateAssignment = async (
  id: string,
  data: Partial<AssignmentItem>
): Promise<void> => {
  const ref = doc(db, "assignments", id);
  await updateDoc(ref, { ...data, updatedAt: serverTimestamp() });
};

export const deleteAssignment = async (id: string): Promise<void> => {
  await deleteDoc(doc(db, "assignments", id));
};

export const submitAssignment = async (
  data: Omit<AssignmentSubmission, "id">
): Promise<string> => {
  const docRef = await addDoc(collection(db, "assignment_submissions"), {
    ...data,
    submittedAt: serverTimestamp(),
  });
  return docRef.id;
};

export const getAssignmentSubmissions = async (
  assignmentId: string
): Promise<AssignmentSubmission[]> => {
  const q = query(
    collection(db, "assignment_submissions"),
    where("assignmentId", "==", assignmentId)
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({
    id: d.id,
    assignmentId: d.data().assignmentId,
    userId: d.data().userId,
    userName: d.data().userName,
    userEmail: d.data().userEmail,
    classId: d.data().classId,
    response: d.data().response || "",
    submittedAt: d.data().submittedAt,
  }));
};

export const getUserAssignmentSubmission = async (
  assignmentId: string,
  userId: string
): Promise<AssignmentSubmission | null> => {
  const q = query(
    collection(db, "assignment_submissions"),
    where("assignmentId", "==", assignmentId),
    where("userId", "==", userId)
  );
  const snap = await getDocs(q);
  if (snap.empty) return null;
  const d = snap.docs[0];
  return {
    id: d.id,
    assignmentId: d.data().assignmentId,
    userId: d.data().userId,
    userName: d.data().userName,
    userEmail: d.data().userEmail,
    classId: d.data().classId,
    response: d.data().response || "",
    submittedAt: d.data().submittedAt,
  };
};

// ==========================================
// 9. Quiz Attempt Helpers
// ==========================================

export const getQuizAttemptByUser = async (
  quizId: string,
  userId: string
): Promise<QuizAttempt | null> => {
  const q = query(
    collection(db, "quiz_attempts"),
    where("quizId", "==", quizId),
    where("userId", "==", userId)
  );
  const snap = await getDocs(q);
  if (snap.empty) return null;
  const d = snap.docs[0];
  return { id: d.id, ...d.data() } as QuizAttempt;
};

