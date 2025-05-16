// app/project/[id]/page.tsx

import { getProjectById } from "@/services/projects";
import { notFound } from "next/navigation";
import { Project } from "@/models/project";
import { ExternalLink } from "lucide-react";

interface ProjectPageProps {
  params: { id: string };
}

const ProjectPage = async ({ params }: ProjectPageProps) => {
  const project: Project | null = await getProjectById(params.id);

  if (!project) return notFound();

  return (
    <main className="max-w-4xl mx-auto py-10 px-4">
      <div className="space-y-6 border border-border dark:border-dark-border rounded bg-background dark:bg-dark-background p-6">
        {/* Titre et catégorie */}
        <div>
          <h1 className="text-3xl font-bold text-text dark:text-dark-text">
            {project.title}
          </h1>
          <span className="inline-block mt-1 px-3 py-1 rounded-full text-sm bg-border dark:bg-dark-border text-muted dark:text-dark-muted">
            {project.category}
          </span>
        </div>

        {/* Image de couverture */}
        {project.image && (
          <img
            src={project.image}
            alt="Image de couverture"
            className="w-full max-h-[400px] object-cover rounded shadow"
          />
        )}

        {/* Description courte */}
        <div className="text-text dark:text-dark-text">
          <p>{project.description}</p>
        </div>

        {/* Description enrichie */}
        {project.fullDescription && (
          <div
            className="prose dark:prose-invert max-w-none"
            dangerouslySetInnerHTML={{ __html: project.fullDescription }}
          />
        )}

        {/* Galerie */}
        {project.images && project.images.length > 0 && (
          <div>
            <h2 className="text-xl font-semibold mb-2 text-text dark:text-dark-text">Galerie</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {project.images.map((url, idx) => (
                <img
                  key={idx}
                  src={url}
                  alt={`Image ${idx + 1}`}
                  className="w-full rounded shadow object-cover"
                />
              ))}
            </div>
          </div>
        )}

        {/* Lien externe */}
        {project.url && (
          <a
            href={project.url}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-2 text-primary hover:text-primary-hover underline"
          >
            <ExternalLink className="w-5 h-5" /> Voir l'application
          </a>
        )}
      </div>
    </main>
  );
}
export default ProjectPage;