# Portfolio Tools – Admin & Project Showcase

This is a modern, full-stack portfolio management application built with **Next.js**, **Firebase**, and **Tailwind CSS**. It allows authenticated users to manage and showcase projects through an elegant admin interface and public project pages.

---

## ✨ Features

- 🔐 Firebase Authentication (Google provider)
- 🔥 Firestore database for project storage
- 📦 Firebase Storage for image uploads (cover + gallery)
- 📋 Rich-text editor for full project descriptions
- 📸 Upload and preview multiple images with drag-and-drop reordering
- 🧼 Admin dashboard to create, edit, and delete projects
- 🌐 Public project pages at `/project/[id]`
- 🧭 Homepage with search, filters, pagination, and layout controls
- 💾 Favorites support (users can bookmark projects)
- 🌙 Dark mode support
- ✅ Responsive & accessible design
- ✅ Clean UI with Lucide icons and TailwindCSS
- 🚫 Delete confirmation modals to prevent accidents

---

## 🛠️ Tech Stack

- [Next.js 15+](https://nextjs.org/)
- [TypeScript](https://www.typescriptlang.org/)
- [Firebase (Auth, Firestore, Storage)](https://firebase.google.com/)
- [Tailwind CSS v4](https://tailwindcss.com/)
- [Lucide React Icons](https://lucide.dev/)
- [React Quill / Custom Rich Text Editor](https://www.npmjs.com/package/react-quill)

---

## 📁 Project Structure

/app
├── admin # Admin dashboard routes
├── project/[id] # Dynamic public project page
└── page.tsx # Public homepage (search + filters)

/components
├── forms/ # ProjectForm
├── modals/ # ConfirmModal, Modal, etc.
├── ui/ # SearchBar, FilterMenu, Pagination, GridControls
└── rich-text-editor/

/services
├── projects.ts # Firestore CRUD
├── upload.ts # Firebase Storage
└── users.ts # Favorite toggle, user role logic

/hooks
├── useAuth.ts # Auth logic
└── useModal.ts # Modal open/close logic

/models
├── project.ts # Project model
└── user.ts # User model & roles

/lib
└── firebase.ts # Firebase app initialization

---

## 🔐 Firebase Security Rules

- 🔓 Everyone can **read** projects and images.
- 🧑‍💻 Only authenticated users can **create** new projects.
- 🛡 Only the **project owner** or **superadmin** can update or delete a project.
- 👤 Users can only update their own user document.
- 📂 Storage: users can upload under `/projects/[userId]/...` only if they are the owner.

---

## 🧪 Local Development

1. **Clone the repo**:
   ```bash
   git clone https://github.com/your-username/portfolio-tools.git
   cd portfolio-tools
2. **Install dependencies**:
   ```bash
   npm install
   ```
3. **Set up Firebase**:
   - Create a Firebase project and enable Firestore, Storage, and Authentication (Google provider).
   - Download the `firebaseConfig` object and replace the placeholder in `/lib/firebase.ts`.
   - Set up Firestore rules and Storage rules as mentioned above.
4. **Run the app**:
   ```bash
   npm run dev
   ```
5. **Open your browser**:
   ```bash
   http://localhost:3000
   ```
6. **Sign in with Google** to access the admin dashboard and start adding projects.

## ✅ TODO

- [ ] Add **SEO metadata** to improve indexing and sharing
- [ ] Add ability to **export/import projects** as JSON
- [ ] Display **user role** in the admin panel
- [ ] Add a **project status** (draft, published, archived)
- [ ] Add a **user profile page** to display saved favorites and activity
- [ ] Modify the **storage image system** to manage useless images
