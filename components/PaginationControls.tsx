// components/ui/PaginationControls.tsx
"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationControlsProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  limit: number;
  onLimitChange: (limit: number) => void;
}

export default function PaginationControls({
  currentPage,
  totalPages,
  onPageChange,
  limit,
  onLimitChange,
}: PaginationControlsProps) {
  return (
    <div className="w-full flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mt-6">
      {/* Pagination controls */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="p-2 border border-border dark:border-dark-border rounded disabled:opacity-50 hover:bg-muted transition"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        <span className="text-sm text-text dark:text-dark-text">
          Page {currentPage} of {totalPages}
        </span>

        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="p-2 border border-border dark:border-dark-border rounded disabled:opacity-50 hover:bg-muted transition"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* Limit selection */}
      <div className="flex items-center gap-2">
        <label className="text-sm text-text dark:text-dark-text">Show:</label>
        <select
          value={limit}
          onChange={(e) => onLimitChange(parseInt(e.target.value))}
          className="px-3 py-1 border border-border dark:border-dark-border rounded bg-background dark:bg-dark-background text-text dark:text-dark-text focus:outline-none"
        >
          {[5, 10, 20, 50, 100].map((value) => (
            <option key={value} value={value}>
              {value} per page
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
