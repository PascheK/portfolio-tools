// app/page.tsx

import ProjectGridPage from "@/components/ProjectGridPage";

export default function HomePage() {
  return (
    <main className="max-w-6xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold text-text dark:text-dark-text mb-6 text-center">
        GPO Compass AI
      </h1>
      <ProjectGridPage />
    </main>
  );
}
