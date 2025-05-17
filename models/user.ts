// types/user.ts or models/user.ts

// Define possible roles
export type UserRole = "visitor" | "admin" | "superadmin";

// Define the User model
export interface AppUser {
  uid: string;
  email: string;
  displayName: string;
  role: UserRole;
  favorites: string[]; // array of project IDs
  createdAt?: Date;     // optional: Firestore timestamp
}
