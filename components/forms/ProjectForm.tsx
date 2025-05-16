import { useRef, useState, useEffect } from "react";
import { Trash2, ImagePlus, Image, ChevronUp, ChevronDown } from "lucide-react";
import RichTextEditor from "@/components/rich-text-editor/RichTextEditor";
import { Project } from "@/models/project";

interface ProjectFormProps {
  form: Partial<Project>;
  setForm: React.Dispatch<React.SetStateAction<Partial<Project>>>;
  onSubmit: () => void;
  coverFile: File | null;
  setCoverFile: React.Dispatch<React.SetStateAction<File | null>>;
  galleryFiles: File[];
  setGalleryFiles: React.Dispatch<React.SetStateAction<File[]>>;
  richContent: string;
  setRichContent: React.Dispatch<React.SetStateAction<string>>;
  isSubmitting: boolean;
}

export default function ProjectForm({
  form,
  setForm,
  onSubmit,
  coverFile,
  setCoverFile,
  galleryFiles,
  setGalleryFiles,
  richContent,
  setRichContent,
  isSubmitting,
}: ProjectFormProps) {
  const [showRichEditor, setShowRichEditor] = useState(false);
  const coverInputRef = useRef<HTMLInputElement>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [previewTitle, setPreviewTitle] = useState<string>("Aperçu");
  const [existingGallery, setExistingGallery] = useState<string[]>(form.images || []);
  const [existingCover, setExistingCover] = useState<string | null>(form.image || null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  useEffect(() => {
    const input = coverInputRef.current;
    if (!input) return;
    const handleFile = () => {
      const file = input.files?.[0];
      if (file) {
        setCoverFile(file);
        setExistingCover(null);
      }
    };
    input.addEventListener("change", handleFile);
    return () => input.removeEventListener("change", handleFile);
  }, []);

  useEffect(() => {
    const input = galleryInputRef.current;
    if (!input) return;
    const handleFiles = () => {
      const files = input.files;
      if (files) setGalleryFiles(Array.from(files));
    };
    input.addEventListener("change", handleFiles);
    return () => input.removeEventListener("change", handleFiles);
  }, []);

  useEffect(() => {
    setExistingGallery(form.images || []);
    setExistingCover(form.image || null);
  }, [form]);

  return (
    <>
      <form
        className="space-y-6 bg-background dark:bg-dark-surface p-6 rounded-lg shadow border border-border dark:border-dark-border"
        onSubmit={(e) => {
          e.preventDefault();
          onSubmit();
        }}
      >
        {/* Titre */}
        <div>
          <label className="block text-sm font-medium mb-1 text-text dark:text-dark-text">
            Titre du projet
          </label>
          <input
            type="text"
            name="title"
            value={form.title || ""}
            onChange={handleChange}
            className="w-full px-4 py-2 rounded border border-border dark:border-dark-border bg-transparent text-text dark:text-dark-text focus:outline-none focus:ring-2 focus:ring-primary"
            placeholder="Ex. : Outil interne de reporting"
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium mb-1 text-text dark:text-dark-text">
            Description
          </label>
          <textarea
            name="description"
            value={form.description || ""}
            onChange={handleChange}
            rows={4}
            className="w-full px-4 py-2 rounded border border-border dark:border-dark-border bg-transparent text-text dark:text-dark-text focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        {/* URL du projet */}
        <div>
          <label className="block text-sm font-medium mb-1 text-text dark:text-dark-text">
            Lien vers l'application
          </label>
          <input
            type="url"
            name="url"
            value={form.url || ""}
            onChange={handleChange}
            placeholder="https://mon-app.example.com"
            className="w-full px-4 py-2 rounded border border-border dark:border-dark-border bg-transparent text-text dark:text-dark-text focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        {/* Ligne outils */}
        <div className="flex flex-wrap gap-4 items-end">
          {/* Editeur enrichi */}
          <div className="flex-1 min-w-[200px]">
            <label className="block text-sm font-medium mb-1 text-text dark:text-dark-text">
              Description complète
            </label>
            <button
              type="button"
              onClick={() => setShowRichEditor(true)}
              className="w-full px-4 py-2 rounded bg-primary text-white hover:bg-primary-hover transition flex items-center gap-2 justify-center"
            >
              <ImagePlus size={18} /> Ouvrir l'éditeur enrichi
            </button>
          </div>

          {/* Catégorie */}
          <div className="flex-1 min-w-[200px]">
            <label className="block text-sm font-medium mb-1 text-text dark:text-dark-text">
              Catégorie
            </label>
            <select
              name="category"
              value={form.category || ""}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded border border-border dark:border-dark-border text-text dark:text-dark-text appearance-none focus:outline-none focus:ring-2 focus:ring-primary bg-background dark:bg-dark-surface"
            >
              <option value="">Choisir une catégorie</option>
              <option value="outil">Outil</option>
              <option value="dashboard">Dashboard</option>
              <option value="automatisation">Automatisation</option>
            </select>
          </div>

          {/* Image de couverture */}
          <div className="flex-1 min-w-[200px]">
            <label className="block text-sm font-medium mb-1 text-text dark:text-dark-text">
              Image de couverture
            </label>
            {coverFile ? (
              <div className="flex flex-col gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setPreviewUrl(URL.createObjectURL(coverFile));
                    setPreviewTitle("Aperçu de la couverture");
                  }}
                  className="text-sm text-green-600 flex items-center gap-1 underline hover:text-green-700"
                >
                  <Image size={16} /> {coverFile.name}
                </button>
                <button
                  type="button"
                  onClick={() => setCoverFile(null)}
                  className="flex items-center justify-center gap-1 px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700 transition"
                >
                  <Trash2 size={16} /> Supprimer
                </button>
              </div>
            ) : existingCover ? (
              <div className="flex flex-col gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setPreviewUrl(existingCover);
                    setPreviewTitle("Image de couverture enregistrée");
                  }}
                  className="text-sm text-green-600 flex items-center gap-1 underline hover:text-green-700"
                >
                  <Image size={16} /> Voir l'image actuelle
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => coverInputRef.current?.click()}
                className="w-full px-4 py-2 rounded bg-primary text-white hover:bg-primary-hover transition flex items-center gap-2 justify-center"
              >
                <ImagePlus size={18} /> Ajouter une image principale
              </button>
            )}
            <input type="file" accept="image/*" ref={coverInputRef} hidden />
          </div>

          {/* Galerie d’images */}
                  <div className="flex-1 min-w-[200px]">
            <label className="block text-sm font-medium mb-1 text-text dark:text-dark-text">
              Autres images
            </label>
            <div className="max-h-56 overflow-y-auto pr-1 space-y-2 mb-2">
              {[...existingGallery, ...galleryFiles].map((item, index) => {
                const isFile = item instanceof File;
                const name = isFile ? item.name : item.split("/").pop() ?? "Image";
                const preview = isFile ? URL.createObjectURL(item) : item;

                return (
                  <div
                    key={index}
                    className="flex items-center justify-between gap-2 px-3 py-2 rounded border border-border dark:border-dark-border bg-surface dark:bg-dark-surface"
                  >
                    <button
                      type="button"
                      onClick={() => {
                        setPreviewUrl(preview);
                        setPreviewTitle(name);
                      }}
                      className="text-sm text-left text-primary underline hover:text-primary-hover truncate max-w-[120px]"
                      title={name}
                    >
                      {name}
                    </button>
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        disabled={index === 0}
                        onClick={() => {
                          const updated = [...galleryFiles];
                          [updated[index - 1], updated[index]] = [updated[index], updated[index - 1]];
                          setGalleryFiles(updated);
                        }}
                        className="p-1 rounded bg-background dark:bg-dark-background border hover:bg-surface dark:hover:bg-dark-surface"
                        title="Monter"
                      >
                        <ChevronUp className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        disabled={index === galleryFiles.length - 1}
                        onClick={() => {
                          const updated = [...galleryFiles];
                          [updated[index], updated[index + 1]] = [updated[index + 1], updated[index]];
                          setGalleryFiles(updated);
                        }}
                        className="p-1 rounded bg-background dark:bg-dark-background border hover:bg-surface dark:hover:bg-dark-surface"
                        title="Descendre"
                      >
                        <ChevronDown className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          if (isFile) {
                            setGalleryFiles(galleryFiles.filter((f) => f !== item));
                          } else {
                            setExistingGallery(existingGallery.filter((url) => url !== item));
                          }
                        }}
                        className="p-1 bg-red-600 text-white rounded hover:bg-red-700"
                        title="Supprimer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
            <button
              type="button"
              onClick={() => galleryInputRef.current?.click()}
              className="w-full px-4 py-2 rounded border border-border dark:border-dark-border text-text dark:text-dark-text hover:bg-[oklch(var(--color-border))] transition flex items-center gap-2 justify-center"
            >
              <ImagePlus size={18} /> Ajouter des photos
            </button>
            <input type="file" accept="image/*" multiple ref={galleryInputRef} hidden />
          </div>
        </div>

        {/* Bouton soumettre */}
        <div className="pt-4">
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full px-4 py-2 rounded bg-primary text-white hover:bg-primary-hover font-semibold transition"
          >
            Enregistrer le projet
          </button>
        </div>
      </form>

      {/* Modales */}
            {showRichEditor && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
          <div className="relative bg-dark-surface rounded-lg shadow-lg w-full max-w-[95vw] h-[95vh] animate-zoom-in flex flex-col">
            <div className="flex justify-between items-center px-6 py-4 border-b border-dark-border">
              <h2 className="text-lg font-semibold text-white">Contenu enrichi</h2>
              <button
                onClick={() => setShowRichEditor(false)}
                className="text-sm bg-red-600 px-4 py-1 rounded hover:bg-red-700 text-white"
              >
                Fermer
              </button>
            </div>
            <div className="p-6 h-full overflow-auto">
              <RichTextEditor content={richContent} onChange={setRichContent} />
            </div>
          </div>
        </div>
      )}

      {previewUrl && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70 backdrop-blur-sm"
          onClick={() => setPreviewUrl(null)}
        >
          <div className="relative max-w-4xl w-full max-h-[90vh] p-4 bg-dark-surface rounded shadow-lg overflow-auto">
            <h2 className="text-white text-lg mb-2">{previewTitle}</h2>
            <img
              src={previewUrl}
              alt="Aperçu"
              className="w-full max-h-[75vh] object-contain mx-auto rounded"
            />
            <button
              onClick={() => setPreviewUrl(null)}
              className="absolute top-4 right-4 bg-red-600 text-white rounded px-3 py-1 hover:bg-red-700"
            >
              Fermer
            </button>
          </div>
        </div>
      )}
    </>
  );
}
