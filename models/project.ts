// models/project.ts

export interface Project {
  id: string;                  // ID Firestore
  title: string;               // Nom du projet
  description: string;         // Description courte
  fullDescription?: string;    // Description enrichie (rich text HTML)
  category: string;            // Catégorie (filtrage)
  url?: string;                // Lien vers l’outil externe
  image?: string;              // Image principale (cover)
  images?: string[];           // Galerie d'images (URLs)
  createdAt: number;           // Timestamp (Date.now())
  ownerUID: string;            // UID du créateur
  editorsUIDs?: string[];      // UID des collaborateurs autorisés
  isPublished: boolean;        // Publication (page publique)
}
