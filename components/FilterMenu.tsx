"use client";

import { LayoutGrid, List, Heart } from "lucide-react";

interface FilterBarProps {
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
  gridSize: "small" | "medium" | "large";
  setGridSize: (size: "small" | "medium" | "large") => void;
  showFavoritesOnly?: boolean;
  setShowFavoritesOnly: (show: boolean) => void;
}

const categories = ["all", "apps", "dashboards", "templates", "tools"];

export default function FilterMenu({
  selectedCategory,
  setSelectedCategory,
  gridSize,
  setGridSize,
  showFavoritesOnly,
  setShowFavoritesOnly,
}: FilterBarProps) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-6 border border-border dark:border-dark-border rounded-xl px-4 py-3 ">
      {/* Category filter */}
      <div className="flex flex-wrap gap-2 ">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`px-3 py-1 rounded-full text-sm font-medium border transition ${
              selectedCategory === category
                ? "bg-primary text-white border-primary"
                : "border-border dark:border-dark-border text-text dark:text-dark-text hover:bg-border dark:hover:bg-dark-border"
            }`}
          >
            {category === "all" ? "All" : category.charAt(0).toUpperCase() + category.slice(1)}
          </button>
        ))}
        <button
         
            onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
            className={`px-3 py-1 rounded-full text-sm font-medium border transition ${
              showFavoritesOnly                ? "bg-primary text-pink-500 border-primary"
                : "border-border dark:border-dark-border text-pink-500 hover:bg-border dark:hover:bg-dark-border"
            }`}
          >

            {showFavoritesOnly ? <Heart className="w-4 h-4 mr-1" /> : <Heart className="w-4 h-4 mr-1 text-pink-500" />}
          </button>
      </div>

      {/* Grid size controls (desktop only) */}
      <div className="hidden sm:flex gap-2 items-center">
        <button
          onClick={() => setGridSize("small")}
          className={`p-2 rounded border ${
            gridSize === "small" ? "bg-primary text-white" : "border-border dark:border-dark-border"
          }`}
        >
          <List size={18} />
        </button>
        <button
          onClick={() => setGridSize("medium")}
          className={`p-2 rounded border ${
            gridSize === "medium" ? "bg-primary text-white" : "border-border dark:border-dark-border"
          }`}
        >
          <LayoutGrid size={18} />
        </button>
      </div>
    </div>
  );
}
