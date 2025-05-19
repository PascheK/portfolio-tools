import { doc, getDoc, setDoc, updateDoc, arrayUnion, arrayRemove } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { User } from "firebase/auth"; // Firebase User type
import { UserRole, AppUser } from "@/models/user";

// List of superadmin email addresses
const SUPERADMINS: string[] = ["killianp@unops.org", "lionelf@unops.org", "roryc@unops.org"]; // Update this list as needed

// Determine the role based on email domain or predefined list
const assignRole = (user: User): UserRole => {
  const email = user.email ?? "";
  if (SUPERADMINS.includes(email)) return "superadmin";
  //if (email.endsWith("@unops.org")) return "admin";
  return "visitor";
};

// Create user in Firestore with role if not existing
export async function createUserIfNotExists(user: User) {
  const ref = doc(db, "users", user.uid);
  const snapshot = await getDoc(ref);

  if (!snapshot.exists()) {
    const role = assignRole(user);

    const newUser: AppUser = {
      uid: user.uid,
      email: user.email ?? "no-email",
      displayName: user.displayName ?? "Unnamed",
      role,
      favorites: [],
    };

    await setDoc(ref, newUser);
  }
}

// Add or remove a project from a user's favorites
export async function toggleFavorite(userId: string, projectId: string, isFavorited: boolean) {
  const ref = doc(db, "users", userId);
  await updateDoc(ref, {
    favorites: isFavorited ? arrayRemove(projectId) : arrayUnion(projectId),
  });
}

// Get all favorite project IDs of a user
export async function getUserFavorites(userId: string): Promise<string[]> {
  const ref = doc(db, "users", userId);
  const snapshot = await getDoc(ref);
  const data = snapshot.data();
  return data?.favorites || [];
}

// Get user role from Firestore
export async function getUserRole(userId: string): Promise<UserRole> {
  const ref = doc(db, "users", userId);
  const snapshot = await getDoc(ref);
  const data = snapshot.data();

  return (data?.role as UserRole) || "visitor"; // fallback
}