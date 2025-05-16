"use client";

import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/components/toast/ToastProvider";
import { useEffect, useState } from "react";
import {
  listenToUserProjects,
  createProject,
  updateProject,
  deleteProject,
} from "@/services/projects";
import { uploadImage } from "@/services/upload";
import { Project } from "@/models/project";
import { useModal } from "@/hooks/useModal";
import Modal from "@/components/modals/modal";
import { useRouter } from "next/navigation";
import ProjectForm from "@/components/forms/ProjectForm";
import ProjectList from "@/components/ProjectList";
import ConfirmModal from "@/components/modals/ConfirmModal";

export default function AdminPage() {
  const { user, loading } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [form, setForm] = useState<Partial<Project>>({});
  const [editId, setEditId] = useState<string | null>(null);
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [galleryFiles, setGalleryFiles] = useState<File[]>([]);
  const [richContent, setRichContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const formModal = useModal();
  const { showToast } = useToast();
  const router = useRouter();

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading]);

  // Listen to the authenticated user's projects
  useEffect(() => {
    if (!user) return;
    const unsubscribe = listenToUserProjects(user.uid, setProjects);
    return () => unsubscribe();
  }, [user]);

  if (loading) return <p>Loading...</p>;
  if (!user) return <p>Access denied.</p>;

  // Handles project creation and update
  const handleSubmit = async () => {
    if (!form.title || !form.description || !form.category || !user) {
      showToast("Please fill all required fields.", "error");
      return;
    }

    setIsSubmitting(true);
    try {
      // Upload cover image if changed
      let imageUrl: string | undefined = form.image || undefined;
      if (coverFile) {
        imageUrl = await uploadImage(coverFile, `projects/${user.uid}/cover-${Date.now()}`);
      }

      // Upload new gallery images
      let imageUrls: string[] = form.images || [];
      if (galleryFiles.length > 0) {
        const uploaded = await Promise.all(
          galleryFiles.map((file) =>
            uploadImage(file, `projects/${user.uid}/gallery/${Date.now()}-${file.name}`)
          )
        );
        imageUrls = [...imageUrls, ...uploaded];
      }

      const newProjectData: Omit<Project, "id" | "createdAt" | "ownerUID"> = {
        title: form.title,
        description: form.description,
        category: form.category,
        fullDescription: richContent,
        url: form.url || "",
        image: imageUrl || "",
        images: imageUrls,
        isPublished: true,
      };

      if (editId) {
        await updateProject(editId, newProjectData);
        showToast("Project updated successfully", "success");
      } else {
        await createProject(newProjectData, user.uid);
        showToast("Project created successfully", "success");
      }
    } catch (error) {
      console.error("Error while uploading or saving project:", error);
      showToast("Failed to save project", "error");
    } finally {
      setIsSubmitting(false);
      setForm({});
      setEditId(null);
      setCoverFile(null);
      setGalleryFiles([]);
      setRichContent("");
      formModal.close();
    }
  };

  // Load selected project in form for editing
  const handleEdit = (project: Project) => {
    setForm(project);
    setEditId(project.id);
    setRichContent(project.fullDescription || "");
    setCoverFile(null);
    setGalleryFiles([]);
    formModal.open();
  };

  // Ask for confirmation before deletion
  const handleDelete = (id: string) => {
    setDeleteId(id);
    setConfirmOpen(true);
  };

  // Confirm and proceed with project deletion
  const confirmDelete = async () => {
    if (!deleteId) return;
    await deleteProject(deleteId);
    setDeleteId(null);
    setConfirmOpen(false);
    showToast("Project deleted successfully", "success");
  };

  return (
    <div className="max-w-full px-2 mx-auto">
      <h1 className="text-2xl font-bold mb-4">My Projects</h1>

      <button
        onClick={() => {
          setForm({});
          setEditId(null);
          setCoverFile(null);
          setGalleryFiles([]);
          setRichContent("");
          formModal.open();
        }}
        className="mb-4 px-4 py-2 bg-blue-600 text-white rounded"
      >
        Add a new project
      </button>

      {/* Display the list of projects */}
      <ProjectList projects={projects} onEdit={handleEdit} onDelete={handleDelete} />

      {/* Modal containing the project form */}
      <Modal isOpen={formModal.isOpen} onClose={formModal.close} title="Add a project">
        <ProjectForm
          form={form}
          setForm={setForm}
          onSubmit={handleSubmit}
          coverFile={coverFile}
          setCoverFile={setCoverFile}
          galleryFiles={galleryFiles}
          setGalleryFiles={setGalleryFiles}
          richContent={richContent}
          setRichContent={setRichContent}
          isSubmitting={isSubmitting}
        />
      </Modal>

      {/* Confirmation modal for deletion */}
      <ConfirmModal
        isOpen={confirmOpen}
        message="Are you sure you want to delete this project? This action cannot be undone."
        onCancel={() => setConfirmOpen(false)}
        onConfirm={confirmDelete}
      />
    </div>
  );
}
