import { useRef, useState, useEffect } from "react";
import {
  Trash2,
  ImagePlus,
  Image,
  ChevronUp,
  ChevronDown,
} from "lucide-react";
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
  existingGallery: string[];
  setExistingGallery: React.Dispatch<React.SetStateAction<string[]>>;
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
  existingGallery,
  setExistingGallery,
}: ProjectFormProps) {
  const [showRichEditor, setShowRichEditor] = useState(false);
  const coverInputRef = useRef<HTMLInputElement>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [previewTitle, setPreviewTitle] = useState<string>("Preview");
  const [existingCover, setExistingCover] = useState<string | null>(form.image || null);

  // Handle form field updates
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  // Handle file input change for cover image
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

  // Handle file input change for gallery
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

  // Update local state when editing an existing project
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
        {/* Project title */}
        <div>
          <label className="block text-sm font-medium mb-1 text-text dark:text-dark-text">
            Project title
          </label>
          <input
            type="text"
            name="title"
            value={form.title || ""}
            onChange={handleChange}
            className="w-full px-4 py-2 rounded border border-border dark:border-dark-border bg-transparent text-text dark:text-dark-text focus:outline-none focus:ring-2 focus:ring-primary"
            placeholder="e.g. Internal reporting tool"
          />
        </div>

        {/* Short description */}
        <div>
          <label className="block text-sm font-medium mb-1 text-text dark:text-dark-text">
            Short description
          </label>
          <textarea
            name="description"
            value={form.description || ""}
            onChange={handleChange}
            rows={4}
            className="w-full px-4 py-2 rounded border border-border dark:border-dark-border bg-transparent text-text dark:text-dark-text focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        {/* Project URL */}
        <div>
          <label className="block text-sm font-medium mb-1 text-text dark:text-dark-text">
            Application URL
          </label>
          <input
            type="url"
            name="url"
            value={form.url || ""}
            onChange={handleChange}
            placeholder="https://your-app.example.com"
            className="w-full px-4 py-2 rounded border border-border dark:border-dark-border bg-transparent text-text dark:text-dark-text focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        {/* Tools section: Rich text editor, category, cover image, gallery */}
        <div className="flex flex-wrap gap-4 items-end">

          {/* Rich text editor trigger */}
          <div className="flex-1 min-w-[200px]">
            <label className="block text-sm font-medium mb-1 text-text dark:text-dark-text">
              Full description
            </label>
            <button
              type="button"
              onClick={() => setShowRichEditor(true)}
              className="w-full px-4 py-2 rounded bg-primary text-white hover:bg-primary-hover transition flex items-center gap-2 justify-center"
            >
              <ImagePlus size={18} /> Open the rich text editor
            </button>
          </div>

          {/* Category selection */}
          <div className="flex-1 min-w-[200px]">
            <label className="block text-sm font-medium mb-1 text-text dark:text-dark-text">
              Category
            </label>
            <select
              name="category"
              value={form.category || ""}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded border border-border dark:border-dark-border text-text dark:text-dark-text appearance-none focus:outline-none focus:ring-2 focus:ring-primary bg-background dark:bg-dark-surface"
            >
              <option value="">Select a category</option>
              <option value="apps">Apps</option>
              <option value="dashboards">Dashboard</option>
              <option value="templates">Templates</option>
              <option value="tools">Tools</option>
            </select>
          </div>

          {/* Cover image */}
          <div className="flex-1 min-w-[200px]">
            <label className="block text-sm font-medium mb-1 text-text dark:text-dark-text">
              Cover image
            </label>

            {coverFile ? (
              // Preview of newly selected cover file
              <div className="flex flex-col gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setPreviewUrl(URL.createObjectURL(coverFile));
                    setPreviewTitle("Cover preview");
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
                  <Trash2 size={16} /> Remove
                </button>
              </div>
            ) : existingCover ? (
              // Display existing uploaded cover image
              <div className="flex flex-col gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setPreviewUrl(existingCover);
                    setPreviewTitle("Current cover image");
                  }}
                  className="text-sm text-green-600 flex items-center gap-1 underline hover:text-green-700"
                >
                  <Image size={16} /> View current image
                </button>
              </div>
            ) : (
              // No cover yet – open file selector
              <button
                type="button"
                onClick={() => coverInputRef.current?.click()}
                className="w-full px-4 py-2 rounded bg-primary text-white hover:bg-primary-hover transition flex items-center gap-2 justify-center"
              >
                <ImagePlus size={18} /> Add a cover image
              </button>
            )}
            <input type="file" accept="image/*" ref={coverInputRef} hidden />
          </div>
          
          {/* Gallery images */}
          <div className="flex-1 min-w-[200px]">
            <label className="block text-sm font-medium mb-1 text-text dark:text-dark-text">
              Additional images
            </label>
            <div className="max-h-56 overflow-y-auto pr-1 space-y-2 mb-2">
            {[...existingGallery, ...galleryFiles].filter(Boolean).map((item, index) => {
              const isFile = item instanceof File;
              const name = isFile
                ? item.name
                : typeof item === "string"
                ? item.split("/").pop() ?? "Image"
                : "Image";
              const preview = isFile ? URL.createObjectURL(item) : item;
              
                return (
                  <div
                    key={index}
                    className="flex items-center justify-between gap-2 px-3 py-2 rounded border border-border dark:border-dark-border bg-surface dark:bg-dark-surface"
                  >
                    {/* Image name and preview trigger */}
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
                    
                    {/* Reorder and delete buttons */}
                    <div className="flex items-center gap-1">
                      {/* Move up */}
                      <button
                        type="button"
                        disabled={index === 0}
                        onClick={() => {
                          const updated = [...galleryFiles];
                          [updated[index - 1], updated[index]] = [updated[index], updated[index - 1]];
                          setGalleryFiles(updated);
                        }}
                        className="p-1 rounded bg-background dark:bg-dark-background border hover:bg-surface dark:hover:bg-dark-surface"
                        title="Move up"
                      >
                        <ChevronUp className="w-4 h-4" />
                      </button>
                      
                      {/* Move down */}
                      <button
                        type="button"
                        disabled={index === galleryFiles.length - 1}
                        onClick={() => {
                          const updated = [...galleryFiles];
                          [updated[index], updated[index + 1]] = [updated[index + 1], updated[index]];
                          setGalleryFiles(updated);
                        }}
                        className="p-1 rounded bg-background dark:bg-dark-background border hover:bg-surface dark:hover:bg-dark-surface"
                        title="Move down"
                      >
                        <ChevronDown className="w-4 h-4" />
                      </button>
                      
                      {/* Delete */}
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
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
            
            {/* Button to add more gallery images */}
            <button
              type="button"
              onClick={() => galleryInputRef.current?.click()}
              className="w-full px-4 py-2 rounded border border-border dark:border-dark-border text-text dark:text-dark-text hover:bg-[oklch(var(--color-border))] transition flex items-center gap-2 justify-center"
            >
              <ImagePlus size={18} /> Add more images
            </button>
            <input type="file" accept="image/*" multiple ref={galleryInputRef} hidden />
          </div>
        </div>

            
        {/* Submit button */}
        <div className="pt-4">
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full px-4 py-2 rounded bg-primary text-white hover:bg-primary-hover font-semibold transition"
          >
            Save project
          </button>
        </div>
      </form>

      {/* Rich text modal */}
      {showRichEditor && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="relative bg-surface dark:bg-dark-surface  rounded-lg shadow-lg w-full max-w-[95vw] h-[95vh] animate-zoom-in flex flex-col">
            <div className="flex justify-between items-center px-6 py-4 border-b border-dark-border">
              <h2 className="text-lg font-semibold text-text dark:text-dark-text">Rich content editor</h2>
              <button
                onClick={() => setShowRichEditor(false)}
                className="text-sm bg-red-600 px-4 py-1 rounded hover:bg-red-700 text-white"
              >
                Close
              </button>
            </div>
            <div className="p-6 h-full overflow-auto">
              <RichTextEditor content={richContent} onChange={setRichContent} />
            </div>
          </div>
        </div>
      )}

      {/* Preview modal */}
      {previewUrl && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
          onClick={() => setPreviewUrl(null)}
        >
          <div className="relative max-w-4xl w-full max-h-[90vh] p-4 bg-surface dark:bg-dark-surface text-text dark:text-dark-text rounded shadow-lg overflow-auto">
            <h2 className=" text-lg mb-2">{previewTitle}</h2>
            <img
              src={previewUrl}
              alt="Preview"
              className="w-full max-h-[75vh] object-contain mx-auto rounded"
            />
            <button
              onClick={() => setPreviewUrl(null)}
              className="absolute top-4 right-4 bg-red-600  rounded px-3 py-1 hover:bg-red-700"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
}
