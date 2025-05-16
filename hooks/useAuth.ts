// hooks/useAuth.ts
'use client';
import { GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged, User } from "firebase/auth";
import { useEffect, useState } from "react";
import { auth } from "@/lib/firebase";
import { createUserIfNotExists } from "@/services/users";
export function useAuth() {
  const [user, setUser] = useState<null | any>(null);
  const [loading, setLoading] = useState(true);

  const login = async () => {
 const provider = new GoogleAuthProvider();

  try {
    const result = await signInWithPopup(auth, provider);
    const user = result.user;

    // Restriction à @unops.org
    if (!user.email?.endsWith("@unops.org")) {
      alert("Only UNOPS accounts are allowed.");
      await signOut(auth);
    }

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
        await createUserIfNotExists({
        uid: user.uid,
        displayName: user.displayName ?? "Anonymous", // fallback si null
        email: user.email ?? "no-email@unknown.com",  // fallback si null
      });
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  return { user, loading, login, logout };
}

