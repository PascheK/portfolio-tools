// services/projects.ts
import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  getDocs,
  getDoc,
  query,
  where,
  onSnapshot,
  serverTimestamp,
  DocumentReference,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Project } from "@/models/project";

// Référence à la collection "projects"
const projectsCollection = collection(db, "projects");

export const listenToUserProjects = (uid: string, callback: (projects: Project[]) => void) => {
  const q = query(projectsCollection, where("ownerUID", "==", uid));
  return onSnapshot(q, (snapshot) => {
    const data = snapshot.docs.map((doc) => ({
      ...(doc.data() as Omit<Project, "id">),
      id: doc.id,
    }));
    callback(data);
  });
};

export const createProject = async (data: Omit<Project, "id" | "createdAt" | "ownerUID">, uid: string) => {
  return await addDoc(projectsCollection, {
    ...data,
    ownerUID: uid,
    createdAt: Date.now(),
    isPublished: true,
  });
};

export const updateProject = async (id: string, data: Partial<Project>) => {
  const ref = doc(db, "projects", id);
  return await updateDoc(ref, {
    ...data,
    updatedAt: serverTimestamp(),
  });
};

export const deleteProject = async (id: string) => {
  return await deleteDoc(doc(db, "projects", id));
};

/**
 * Récupère un projet Firestore par son ID.
 * @param id - ID du projet
 * @returns Le projet ou null s’il n’existe pas
 */
export async function getProjectById(id: string): Promise<Project | null> {
  try {
    const ref = doc(db, "projects", id);
    const snap = await getDoc(ref);

    if (!snap.exists()) return null;

    return {
      id: snap.id,
      ...snap.data(),
    } as Project;
  } catch (error) {
    console.error("Erreur lors de la récupération du projet :", error);
    return null;
  }
}