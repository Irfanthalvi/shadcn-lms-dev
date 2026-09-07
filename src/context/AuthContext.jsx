import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/lib/firebase";
import {
  getUserProfile,
  checkAdminStatus,
  loginWithEmail,
  registerWithEmail,
  logoutUser,
  sendPasswordReset,
  updateUserProfileDoc,
  getAuthErrorMessage,
} from "@/services/authService";
import toast from "react-hot-toast";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  // Fetch Firestore profile for a given Firebase user
  const fetchAndSetProfile = useCallback(async (firebaseUser) => {
    if (!firebaseUser) {
      setUserProfile(null);
      setIsAdmin(false);
      return null;
    }

    try {
      const profile = await getUserProfile(firebaseUser.uid);
      setUserProfile(profile);
      const admin = checkAdminStatus(profile);
      setIsAdmin(admin);
      return profile;
    } catch (err) {
      console.error("Failed to load user profile from Firestore:", err);
      setUserProfile(null);
      setIsAdmin(false);
      return null;
    }
  }, []);

  // Listen to Firebase Auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);
      if (firebaseUser) {
        await fetchAndSetProfile(firebaseUser);
      } else {
        setUserProfile(null);
        setIsAdmin(false);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [fetchAndSetProfile]);

  // Login handler
  const login = async (email, password) => {
    try {
      const { user: authedUser, profile, isAdmin: isUserAdmin } = await loginWithEmail(
        email,
        password
      );
      setUser(authedUser);
      setUserProfile(profile);
      setIsAdmin(isUserAdmin);

      if (!profile) {
        throw new Error("No user profile found in Firestore. Please contact the administrator.");
      }

      if (!profile.isApproved) {
        throw new Error("Your account has not been approved yet. Please wait for an administrator to activate your access.");
      }

      if (profile.role !== "admin") {
        // Not an admin
        toast.success("Logged in as " + (profile.name || email));
      } else {
        toast.success(`Welcome back, ${profile.name || "Administrator"}!`);
      }

      return { user: authedUser, profile, isAdmin: isUserAdmin };
    } catch (error) {
      const message = getAuthErrorMessage(error);
      throw new Error(message);
    }
  };

  // Register handler
  const register = async (name, email, password, classId, className) => {
    try {
      const { user: registeredUser, profile } = await registerWithEmail(
        name,
        email,
        password,
        classId,
        className
      );
      setUser(registeredUser);
      setUserProfile(profile);
      setIsAdmin(checkAdminStatus(profile));
      return { user: registeredUser, profile };
    } catch (error) {
      const message = getAuthErrorMessage(error);
      throw new Error(message);
    }
  };

  // Logout handler
  const logout = async () => {
    try {
      await logoutUser();
      setUser(null);
      setUserProfile(null);
      setIsAdmin(false);
      toast.success("Successfully logged out.");
    } catch (error) {
      const message = getAuthErrorMessage(error);
      toast.error(`Logout failed: ${message}`);
      throw error;
    }
  };

  // Reset password handler
  const resetPassword = async (email) => {
    try {
      await sendPasswordReset(email);
      toast.success("Password reset instructions sent to your email.");
    } catch (error) {
      const message = getAuthErrorMessage(error);
      throw new Error(message);
    }
  };

  // Refresh profile handler
  const refreshProfile = async () => {
    if (auth.currentUser) {
      return await fetchAndSetProfile(auth.currentUser);
    }
    return null;
  };

  // Update profile doc
  const updateProfile = async (data) => {
    if (!user) throw new Error("No authenticated user.");
    await updateUserProfileDoc(user.uid, data);
    await refreshProfile();
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        userProfile,
        isAdmin,
        loading,
        login,
        register,
        logout,
        resetPassword,
        refreshProfile,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export default AuthContext;
