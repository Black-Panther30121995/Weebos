import React, { createContext, useContext, useState, useEffect } from "react";
import { auth, googleProvider, db } from "../firebase";
import {
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [userRole, setUserRole] = useState(null); // null until role is chosen
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setCurrentUser(user);
        const userDoc = await getDoc(doc(db, "users", user.uid));
        if (userDoc.exists()) {
          const data = userDoc.data();
          setUserRole(data.role || null); // Null if no role yet
          setUsername(data.username || user.email);
        } else {
    setUsername(user.email);
        }
      } else {
        setCurrentUser(null);
        setUserRole(null);
        setUsername("");
      }
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const signInWithGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      const userDoc = await getDoc(doc(db, "users", user.uid));
      if (!userDoc.exists()) {
        await setDoc(doc(db, "users", user.uid), {
          username: user.displayName || `user_${user.uid.slice(0, 8)}`,
          email: user.email,
          role: null, // No role set yet
        });
        setUsername(user.displayName || `user_${user.uid.slice(0, 8)}`);
      } else {
        const data = userDoc.data();
        setUserRole(data.role || null);
        setUsername(data.username || user.email);
      }
      setCurrentUser(user);
      return user;
    } catch (error) {
      console.error("Google Sign-In Error:", error.message);
      throw error;
    }
  };

  const signupWithEmail = async (username, email, password) => {
    try {
      const usernameQuery = await getDoc(doc(db, "usernames", username));
      if (usernameQuery.exists()) {
        throw new Error("Username already taken");
      }
      const result = await createUserWithEmailAndPassword(auth, email, password);
      const user = result.user;
      await setDoc(doc(db, "users", user.uid), {
        username,
        email,
        role: null, // No role set yet
      });
      await setDoc(doc(db, "usernames", username), { uid: user.uid });
      setUsername(username);
      setCurrentUser(user);
      return user;
    } catch (error) {
      console.error("Email Signup Error:", error.message);
      throw error;
    }
  };

  const loginWithEmail = async (email, password) => {
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      const user = result.user;
      const userDoc = await getDoc(doc(db, "users", user.uid));
      if (userDoc.exists()) {
        const data = userDoc.data();
        setUserRole(data.role || null);
        setUsername(data.username || user.email);
      }
      setCurrentUser(user);
      return user;
    } catch (error) {
      console.error("Email Login Error:", error.message);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      setCurrentUser(null);
      setUserRole(null);
      setUsername("");
    } catch (error) {
      console.error("Logout Error:", error.message);
      throw error;
    }
  };

  const setUserRoleInFirestore = async (role) => {
    if (!currentUser) return;
    try {
      await setDoc(doc(db, "users", currentUser.uid), { role }, { merge: true });
      setUserRole(role);
    } catch (error) {
      console.error("Error setting user role:", error.message);
      throw error;
    }
  };

  const value = {
    currentUser,
    userRole,
    setUserRole: setUserRoleInFirestore, // Expose this to components
    username,
    signInWithGoogle,
    signupWithEmail,
    loginWithEmail,
    logout,
    loading,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

