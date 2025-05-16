// app/page.tsx

"use client";

import { useEffect, useState } from "react";
import { getAllProjects } from "@/services/projects";
import ProjectCard from "@/components/ProjectCard";
import SearchBar from "@/components/SearchBar";
import FilterMenu from "@/components/FilterMenu";
import PaginationControls from "@/components/PaginationControls";
import { Project } from "@/models/project";
import { useAuth } from "@/hooks/useAuth";
import { getUserFavorites } from "@/services/users";

export default function ProjectGridPage() {
  // UI state
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [gridSize, setGridSize] = useState<"small" | "medium" | "large">("medium");
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);

  // Pagination state
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(5);

  // Data
  const [allProjects, setAllProjects] = useState<Project[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]);
  const { user } = useAuth();

  // Fetch all public projects (client-side)
  useEffect(() => {
    getAllProjects()
      .then(setAllProjects)
      .catch((err) => console.error("Failed to fetch projects:", err));
  }, []);

  // Fetch user favorites (client-side)
useEffect(() => {
  if (!user) return;
  getUserFavorites(user.uid).then(setFavorites);
}, [user]);

  // Apply filters
  const filtered = allProjects.filter((p: Project) => {
    const matchesSearch = p.title.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = category === "all" || p.category === category;
    const matchesFavorites = showFavoritesOnly ? favorites.includes(p.id) : true;
    return matchesSearch && matchesCategory && matchesFavorites;
  });

  // Pagination logic
  const totalPages = Math.ceil(filtered.length / limit);
  const paginated = filtered.slice((page - 1) * limit, page * limit);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">


      {/* Search & Filters */}
      <div className="flex flex-col  md:items-center md:justify-between gap-4 mb-6">
        <SearchBar value={search} onChange={setSearch} />
        <FilterMenu
          selectedCategory={category}
          setSelectedCategory={setCategory}
          gridSize={gridSize}
          setGridSize={setGridSize}
          showFavoritesOnly={showFavoritesOnly}
          setShowFavoritesOnly={setShowFavoritesOnly}
        />
      </div>

      {/* Grid of projects */}
      <div
        className={`grid gap-6 ${
          gridSize === "small"
            ? "grid-cols-1 sm:grid-cols-2"
            : gridSize === "medium"
            ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
            : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4"
        }`}
      >
        {paginated.map((project) => (
          <ProjectCard key={project.id} project={project} favorites={favorites}
    setFavorites={setFavorites}/>
        ))}
      </div>

      {/* Pagination */}
      <div className="mt-8 flex flex-col md:flex-row md:justify-between items-center gap-4">
        <PaginationControls
          currentPage={page}
          totalPages={totalPages}
          onPageChange={setPage}
          limit={limit}
          onLimitChange={setLimit}
        />
      </div>
    </div>
  );
}
