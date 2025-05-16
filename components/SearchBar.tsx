// components/SearchBar.tsx
"use client";

import { ChangeEvent } from "react";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
}

export default function SearchBar({ value, onChange }: SearchBarProps) {
  return (
    <input
      type="text"
      value={value}
      onChange={(e: ChangeEvent<HTMLInputElement>) => onChange(e.target.value)}
      placeholder="Search projects..."
      className="w-full px-4 py-2 border border-border dark:border-dark-border rounded-3xl bg-background dark:bg-dark-background text-text dark:text-dark-text focus:outline-none focus:ring-2 focus:ring-primary"
    />
  );
}