# Portfolio Tools – Admin & Project Showcase

This is a modern, full-stack portfolio management application built with **Next.js**, **Firebase**, and **Tailwind CSS**. It allows authenticated users to manage and showcase projects through an elegant admin interface and public project pages.

## ✨ Features

- 🔐 Firebase Authentication (email/password)
- 🔥 Firestore database for project storage
- 📦 Firebase Storage for image uploads (cover + gallery)
- 📋 Rich-text editor for full project descriptions
- 📸 Upload and preview multiple images with drag-and-drop reordering
- 🧼 Admin dashboard to create, edit, and delete projects
- 🌐 Public project pages at `/project/[id]`
- 🌙 Dark mode support
- ✅ Responsive & accessible design
- ✅ Clean UI with Lucide icons and TailwindCSS
- 🚫 Delete confirmation modals to prevent accidents

## 🛠️ Tech Stack

- [Next.js 14+](https://nextjs.org/)
- [TypeScript](https://www.typescriptlang.org/)
- [Firebase (Auth, Firestore, Storage)](https://firebase.google.com/)
- [Tailwind CSS v4](https://tailwindcss.com/)
- [Lucide React Icons](https://lucide.dev/)
- [React Rich Text Editor](https://www.npmjs.com/package/react-quill) (or custom)

## 📁 Project Structure

/app
/admin # Admin dashboard
/project/[id] # Dynamic public project page

/components
/forms # ProjectForm component
/modals # Reusable modals (ConfirmModal, etc.)
/rich-text-editor # RichTextEditor component

/services
projects.ts # Firestore CRUD logic
upload.ts # Firebase Storage logic

/hooks
useAuth.ts # Auth hook
useModal.ts # Modal state logic

/models
project.ts # Project interface

/lib
firebase.ts # Firebase initialization

---

## 🔐 Firebase Security Rules

- 🔓 Anyone can **read** projects and images.
- 🧑‍💻 Only authenticated users can **create** projects.
- 🔐 Only the **project owner** can update or delete their own content.

---

## 🧪 Local Development

1. **Clone the repo**:
   ```bash
   git clone https://github.com/your-username/portfolio-tools.git
   cd portfolio-tools
