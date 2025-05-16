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
  orderBy,
  limit,
  startAfter,
  
  DocumentReference,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Project } from "@/models/project";

// Référence à la collection "projects"
const projectsCollection = collection(db, "projects");

// Fetch all public (published) projects from Firestore
export async function getAllProjects(): Promise<Project[]> {
  try {
    const q = query(
      collection(db, "projects"),
      where("isPublished", "==", true),
      orderBy("createdAt", "desc")
    );

    const snapshot = await getDocs(q);

    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...(doc.data() as Omit<Project, "id">),
    }));
  } catch (error) {
    console.error("Failed to fetch public projects:", error);
    return [];
  }
}
export async function getPublicProjectsPaginated(pageSize = 12, startAfterDoc?: any): Promise<{ projects: Project[]; lastDoc: any }> {
  let q = query(
    collection(db, "projects"),
    where("isPublished", "==", true),
    orderBy("createdAt", "desc"),
    limit(pageSize)
  );

  if (startAfterDoc) {
    q = query(q, startAfter(startAfterDoc));
  }

  const snapshot = await getDocs(q);
  const projects = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })) as Project[];

  return { projects, lastDoc: snapshot.docs[snapshot.docs.length - 1] };
}
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