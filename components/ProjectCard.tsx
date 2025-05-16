"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Project } from "@/models/project";
import { ExternalLink, Heart, HeartOff } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { getUserFavorites, toggleFavorite } from "@/services/users";

interface ProjectCardProps {
  project: Project;
    favorites: string[];
  setFavorites: (favorites: string[]) => void;
}

export default function ProjectCard({ project, favorites, setFavorites }: ProjectCardProps) {
  const router = useRouter();
  const { user } = useAuth();
  const isFavorited = favorites.includes(project.id);



  // Toggle favorite status
   const handleToggleFavorite = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!user) return;

  
    try {
 await toggleFavorite(user.uid, project.id, isFavorited);
      // Update local state
      if (isFavorited) {
        setFavorites(favorites.filter((id) => id !== project.id));
      } else {
        setFavorites([...favorites, project.id]);
      }
    } catch (err) {
      console.error("Failed to toggle favorite", err);
    } finally {
    
    }
  };

  return (
    <div
      onClick={() => router.push(`/project/${project.id}`)}
      className="relative border border-border dark:border-dark-border rounded bg-background dark:bg-dark-background shadow-sm overflow-hidden cursor-pointer transition hover:shadow-md"
    >
      {/* Favorite icon */}
      {user && (
        <button
          onClick={handleToggleFavorite}
          className={`${isFavorited ? 'bg-pink-200 hover:bg-pink-100' : 'bg-white dark:bg-dark-background hover:bg-pink-200'} absolute top-2 left-2 z-10 p-1 rounded-full  shadow  transition`}
          title={isFavorited ? "Remove from favorites" : "Add to favorites"}
        >
          {isFavorited ? (
            <HeartOff className="w-5 h-5 text-pink-500" />
          ) : (
            <Heart className="w-5 h-5 text-pink-500" />
          )}
        </button>
      )}

      {/* Cover image */}
      <div
        className="h-40 w-full bg-cover bg-center"
        style={{ backgroundImage: `url(${project.image || "/placeholder.jpg"})` }}
      />

      {/* Content */}
      <div className="p-4 flex flex-col justify-between min-h-[200px]">
        <h3 className="text-lg font-bold text-text dark:text-dark-text mb-1">
          {project.title}
        </h3>

        <div>
          <div
            className="text-sm text-muted dark:text-dark-muted mb-2 line-clamp-3"
            dangerouslySetInnerHTML={{ __html: project.description }}
          />
          <div className="w-fit gap-2 mb-2 bg-primary rounded-lg">
            <span className="inline-block text-xs font-semibold uppercase text-dark-text px-3 py-1 rounded">
              {project.category}
            </span>
          </div>
        </div>

        {project.url && (
          <a
            href={project.url}
            target="_blank"
            rel="noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="flex items-center gap-1 text-primary hover:text-primary-hover underline mt-3 text-sm"
          >
            <ExternalLink className="w-4 h-4" />
            {project.url.replace(/^https?:\/\//, "")}
          </a>
        )}
      </div>
    </div>
  );
}
