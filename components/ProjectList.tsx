import { Project } from "@/models/project";
import { Pencil, Trash2, ExternalLink } from "lucide-react";
import { useRouter } from "next/navigation";

interface ProjectListProps {
  projects: Project[];
  onEdit: (project: Project) => void;
  onDelete: (id: string) => void;
}

export default function ProjectList({ projects, onEdit, onDelete }: ProjectListProps) {
  const router = useRouter();

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {projects.map((project) => (
        <div
          key={project.id}
          onClick={() => router.push(`/project/${project.id}`)}
          className="relative border border-border dark:border-dark-border rounded bg-background dark:bg-dark-background shadow-sm overflow-hidden cursor-pointer"
        >
          {/* Top buttons */}
          <div className="absolute top-2 right-2 z-10 flex gap-2">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onEdit(project);
              }}
              className="p-2 rounded transition"
              title="Modifier"
            >
              <Pencil className="w-5 h-5 text-orange-400 hover:text-orange-500" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete(project.id);
              }}
              className="p-2 rounded transition"
              title="Supprimer"
            >
              <Trash2 className="w-5 h-5 text-red-600 hover:text-red-700" />
            </button>
          </div>

          {/* Cover image */}
          <div
            className="h-40 w-full bg-cover bg-center"
            style={{ backgroundImage: `url(${project.image || "/placeholder.jpg"})` }}
          />

          {/* Content */}
          <div className="p-4">
            <h3 className="text-lg font-bold text-text dark:text-dark-text mb-2">
              {project.title}
            </h3>

            <div
              className="text-sm text-muted mb-3 line-clamp-3"
              dangerouslySetInnerHTML={{ __html: project.description }}
            />

            <span className="inline-block bg-gray-200 dark:bg-gray-600 text-xs text-text dark:text-dark-text px-2 py-1 rounded mb-3">
              {project.category}
            </span>

            <div className="flex justify-between items-center mt-4">
              {project.url && (
                <a
                  href={project.url}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1 text-primary hover:underline hover:text-primary-hover text-sm"
                  onClick={(e) => e.stopPropagation()}
                >
                  <ExternalLink className="w-4 h-4" /> Accéder à l’outil
                </a>
              )}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  router.push(`/project/${project.id}`);
                }}
                className="text-sm text-primary hover:underline hover:text-primary-hover"
              >
                Voir le projet
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
