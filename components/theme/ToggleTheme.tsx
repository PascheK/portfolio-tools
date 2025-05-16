"use client";

import { useTheme } from "@/components/theme/ThemeProvider";
import { Sun, Moon } from "lucide-react";

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button onClick={toggleTheme} className="p-2 rounded-4xl hover:bg-gray-700 transition border border-gray-300 dark:border-gray-600">
      {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
    </button>
  );
}
