// app/not-found.tsx
"use client";

import Link from "next/link";
import { Ghost } from "lucide-react";

export default function NotFoundPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-surface dark:bg-dark-background text-center px-4">
      <div className="text-primary mb-4">
        <Ghost size={64} />
      </div>

      <h1 className="text-5xl font-bold text-text dark:text-dark-text mb-2">
        404 – Not Found
      </h1>

      <p className="text-muted dark:text-dark-muted mb-6 max-w-md">
        Sorry, the page you're looking for doesn't exist or has been moved.
      </p>

      <Link
        href="/"
        className="px-6 py-2 bg-primary text-white rounded hover:bg-primary-hover transition font-semibold"
      >
        Back to Home
      </Link>
    </div>
  );
}
