// hooks/useAuth.ts
'use client';
import { GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged, User } from "firebase/auth";
import { useEffect, useState } from "react";
import { auth } from "@/lib/firebase";
import { createUserIfNotExists, getUserRole } from "@/services/users";
import { UserRole } from "@/models/user";
export function useAuth() {
  const [user, setUser] = useState<null | any>(null);
  const [role, setRole] = useState<null | UserRole>(null);
  const [loading, setLoading] = useState(true);

  const login = async () => {
  const provider = new GoogleAuthProvider();

  try {
    const result = await signInWithPopup(auth, provider);
    const user = result.user;

    return user;
  } catch (error) {
    console.error("Login error:", error);
    throw error;
  }
  };

  const logout = async () => {
    await signOut(auth);
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUser(user);

      if(user){
        await createUserIfNotExists(user);
        const userRole = await getUserRole(user.uid);
        setRole(userRole);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  return { user,role, loading, login, logout };
}

