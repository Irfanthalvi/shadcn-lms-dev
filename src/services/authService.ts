import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  updateProfile as updateFirebaseProfile,
  type User,
  type UserCredential,
} from "firebase/auth";
import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  serverTimestamp,
} from "firebase/firestore";
import { auth, db } from "@/lib/firebase";

// ==========================================
// Primary Admin Constants
// ==========================================
export const PRIMARY_ADMIN_UID = "sN5Ua7O0vobaxH69qqlbYMcYiwf1";
export const PRIMARY_ADMIN_EMAIL = "irfanthalvi@gmail.com";

// ==========================================
// Types & Interfaces
// ==========================================
export interface UserProfile {
  uid: string;
  name: string;
  email: string;
  role: "admin" | "student" | "teacher";
  isApproved: boolean;
  createdAt?: any;
  photoURL?: string;
  phone?: string;
  bio?: string;
  classId?: string;
  className?: string;
}

/**
 * Validates whether a given UserProfile is an authorized and approved Administrator.
 * Admin permission rule: role === "admin" AND isApproved === true
 */
export const checkAdminStatus = (profile: UserProfile | null | undefined): boolean => {
  if (!profile) return false;
  return profile.role === "admin" && profile.isApproved === true;
};

/**
 * Fetch a user profile document from Firestore under `users/{uid}`.
 * Always retrieves by the authenticated user's Firebase UID.
 */
export const getUserProfile = async (uid: string): Promise<UserProfile | null> => {
  if (!uid) return null;

  try {
    const userRef = doc(db, "users", uid);
    const docSnap = await getDoc(userRef);
    const currentUser = auth.currentUser;

    const isPrimaryAdmin =
      uid === PRIMARY_ADMIN_UID ||
      Boolean(currentUser?.email && currentUser.email.toLowerCase() === PRIMARY_ADMIN_EMAIL.toLowerCase());

    console.log("--------------------------------------------------");
    console.log("[Auth Service] Fetching user profile from Firestore");
    console.log("Firebase Auth UID:", uid);
    console.log("Firestore users/{uid} path:", `users/${uid}`);
    console.log("Is Primary Admin:", isPrimaryAdmin);

    if (docSnap.exists()) {
      const data = docSnap.data();
      console.log("Firestore Raw Document Data:", data);

      if (isPrimaryAdmin) {
        // Ensure Firestore document contains role: 'admin' and isApproved: true
        if (data.role !== "admin" || data.isApproved !== true) {
          try {
            await setDoc(
              userRef,
              {
                role: "admin",
                isApproved: true,
                email: data.email || currentUser?.email || PRIMARY_ADMIN_EMAIL,
                name: data.name || currentUser?.displayName || "IRFAN ALI",
              },
              { merge: true }
            );
            console.log("[Auth Service] Synced role: 'admin' and isApproved: true to Firestore for admin UID:", uid);
          } catch (syncErr) {
            console.error("[Auth Service] Failed to sync admin document to Firestore:", syncErr);
          }
        }

        // Return object with guaranteed admin fields (placed after ...data so they cannot be overwritten)
        const adminProfile: UserProfile = {
          ...data,
          uid: docSnap.id,
          name: String(data.name || currentUser?.displayName || "IRFAN ALI"),
          email: String(data.email || currentUser?.email || PRIMARY_ADMIN_EMAIL),
          role: "admin",
          isApproved: true,
          createdAt: data.createdAt || serverTimestamp(),
          photoURL: data.photoURL ? String(data.photoURL) : undefined,
        };

        const isAdmin = checkAdminStatus(adminProfile);
        console.log("Firestore role:", adminProfile.role);
        console.log("Firestore isApproved:", adminProfile.isApproved);
        console.log("Final isAdmin:", isAdmin);
        console.log("--------------------------------------------------");

        return adminProfile;
      }

      const standardProfile: UserProfile = {
        ...data,
        uid: docSnap.id,
        name: String(data.name || currentUser?.displayName || ""),
        email: String(data.email || currentUser?.email || ""),
        role: (data.role as "admin" | "student" | "teacher") || "student",
        isApproved: Boolean(data.isApproved),
        createdAt: data.createdAt || serverTimestamp(),
        photoURL: data.photoURL ? String(data.photoURL) : undefined,
      };

      const isAdmin = checkAdminStatus(standardProfile);
      console.log("Firestore role:", standardProfile.role);
      console.log("Firestore isApproved:", standardProfile.isApproved);
      console.log("Final isAdmin:", isAdmin);
      console.log("--------------------------------------------------");

      return standardProfile;
    }

    // Document does not exist yet in Firestore
    console.log("[Auth Service] Document does not exist in Firestore for UID:", uid);

    if (isPrimaryAdmin) {
      const adminData = {
        name: currentUser?.displayName || "IRFAN ALI",
        email: currentUser?.email || PRIMARY_ADMIN_EMAIL,
        role: "admin",
        isApproved: true,
        createdAt: serverTimestamp(),
      };
      await setDoc(userRef, adminData, { merge: true });

      const adminProfile: UserProfile = {
        uid,
        name: adminData.name,
        email: adminData.email,
        role: "admin",
        isApproved: true,
        createdAt: adminData.createdAt,
      };

      const isAdmin = checkAdminStatus(adminProfile);
      console.log("Firestore role:", adminProfile.role);
      console.log("Firestore isApproved:", adminProfile.isApproved);
      console.log("Final isAdmin:", isAdmin);
      console.log("--------------------------------------------------");

      return adminProfile;
    }

    return null;
  } catch (error) {
    console.error("Error fetching user profile from Firestore:", error);
    throw error;
  }
};

/**
 * Sign in using Firebase Authentication and fetch the corresponding Firestore profile.
 * Always fetches users/{uid} by the authenticated user's Firebase UID.
 */
export const loginWithEmail = async (
  email: string,
  password: string
): Promise<{ user: User; profile: UserProfile | null; isAdmin: boolean }> => {
  const userCredential: UserCredential = await signInWithEmailAndPassword(
    auth,
    email.trim(),
    password
  );
  const user = userCredential.user;

  console.log("--------------------------------------------------");
  console.log("[Auth Service] User logged in via Firebase Auth");
  console.log("Firebase Auth UID:", user.uid);
  console.log("Firebase Auth Email:", user.email);

  // Retrieve user document strictly by user.uid
  const profile = await getUserProfile(user.uid);
  const isAdmin = checkAdminStatus(profile);

  console.log("=== FINAL AUTH & FIRESTORE SUMMARY ===");
  console.log("Firebase Auth UID:", user.uid);
  console.log("Firestore users/{uid} path:", `users/${user.uid}`);
  console.log("Firestore role:", profile?.role);
  console.log("Firestore isApproved:", profile?.isApproved);
  console.log("Final isAdmin:", isAdmin);
  console.log("==================================================");

  return { user, profile, isAdmin };
};

/**
 * Register a new user with Firebase Auth and initialize a user document in Firestore:
 * Structure: users/{uid} with role: "student" (or "admin" if primary UID) and isApproved: boolean
 */
export const registerWithEmail = async (
  name: string,
  email: string,
  password: string,
  classId?: string,
  className?: string
): Promise<{ user: User; profile: UserProfile }> => {
  const userCredential: UserCredential = await createUserWithEmailAndPassword(
    auth,
    email.trim(),
    password
  );
  const user = userCredential.user;

  if (name.trim()) {
    try {
      await updateFirebaseProfile(user, { displayName: name.trim() });
    } catch (e) {
      console.warn("Failed to update auth display name:", e);
    }
  }

  const isPrimaryAdmin =
    user.uid === PRIMARY_ADMIN_UID ||
    email.trim().toLowerCase() === PRIMARY_ADMIN_EMAIL.toLowerCase();

  const profileData = {
    name: name.trim() || (isPrimaryAdmin ? "IRFAN ALI" : "New Student"),
    email: email.trim().toLowerCase(),
    role: isPrimaryAdmin ? "admin" : "student",
    isApproved: isPrimaryAdmin ? true : false,
    createdAt: serverTimestamp(),
    ...((!isPrimaryAdmin && classId) ? { classId, className: className || classId } : {}),
  };

  const userRef = doc(db, "users", user.uid);
  await setDoc(userRef, profileData);

  const profile: UserProfile = {
    uid: user.uid,
    name: profileData.name,
    email: profileData.email,
    role: profileData.role as "admin" | "student",
    isApproved: profileData.isApproved,
    createdAt: profileData.createdAt,
    ...( (!isPrimaryAdmin && classId) ? { classId, className: className || classId } : {}),
  };

  return { user, profile };
};

/**
 * Send password reset email via Firebase Authentication.
 */
export const sendPasswordReset = async (email: string): Promise<void> => {
  await sendPasswordResetEmail(auth, email.trim());
};

/**
 * Sign out the currently authenticated Firebase user.
 */
export const logoutUser = async (): Promise<void> => {
  await signOut(auth);
};

/**
 * Update user document fields in Firestore.
 */
export const updateUserProfileDoc = async (
  uid: string,
  data: Partial<UserProfile>
): Promise<void> => {
  const userRef = doc(db, "users", uid);
  await updateDoc(userRef, {
    ...data,
    updatedAt: serverTimestamp(),
  });
};

/**
 * Friendly error message mapper for Firebase Authentication error codes.
 */
export const getAuthErrorMessage = (error: unknown): string => {
  if (typeof error === "string") return error;
  if (!error || typeof error !== "object") return "An unexpected authentication error occurred.";

  const err = error as { code?: string; message?: string };

  switch (err.code) {
    case "auth/api-key-not-valid":
    case "auth/invalid-api-key":
      return "Firebase API Key is invalid. Please make sure you have added your real Firebase API Key in .env.";
    case "auth/invalid-credential":
    case "auth/wrong-password":
    case "auth/user-not-found":
      return "Invalid email or password. Please verify your credentials.";
    case "auth/email-already-in-use":
      return "An account with this email address already exists.";
    case "auth/invalid-email":
      return "Please enter a valid email address.";
    case "auth/weak-password":
      return "Password is too weak. Please use at least 6 characters.";
    case "auth/user-disabled":
      return "This account has been disabled. Please contact an administrator.";
    case "auth/too-many-requests":
      return "Too many failed attempts. Access to this account is temporarily disabled. Try again later.";
    case "auth/network-request-failed":
      return "Network error. Please check your internet connection.";
    case "auth/requires-recent-login":
      return "This operation requires recent authentication. Please sign in again.";
    case "permission-denied":
      return "Permission denied. You do not have access to this resource in Cloud Firestore.";
    default:
      return err.message || "Authentication failed. Please try again.";
  }
};
