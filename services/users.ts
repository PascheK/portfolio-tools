import { doc, getDoc, setDoc, updateDoc, arrayUnion, arrayRemove  } from "firebase/firestore";
import { db } from "@/lib/firebase";

export async function createUserIfNotExists(user: { uid: string; displayName: string; email: string }) {
  const ref = doc(db, "users", user.uid);
  const snapshot = await getDoc(ref);

  if (!snapshot.exists()) {
    await setDoc(ref, {
      displayName: user.displayName,
      email: user.email,
      favorites: [],
    });
  }
}
export async function toggleFavorite(userId: string, projectId: string, isFavorited: boolean) {
  const ref = doc(db, "users", userId);
  await updateDoc(ref, {
    favorites: isFavorited ? arrayRemove(projectId) : arrayUnion(projectId),
  });
}

export async function getUserFavorites(userId: string): Promise<string[]> {
  const ref = doc(db, "users", userId);
  const snapshot = await getDoc(ref);
  const data = snapshot.data();
  return data?.favorites || [];
}