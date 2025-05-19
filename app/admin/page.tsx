"use client";

import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/components/toast/ToastProvider";
import { useEffect, useState } from "react";
import {
  listenToAllProjectsRealtime,
  createProject,
  updateProject,
  deleteProject,
  listenToUserProjectsRealtime,
} from "@/services/projects";
import { uploadImage, deleteImage } from "@/services/upload";
import { Project } from "@/models/project";
import { useModal } from "@/hooks/useModal";
import Modal from "@/components/modals/modal";
import { useRouter } from "next/navigation";
import ProjectForm from "@/components/forms/ProjectForm";
import ProjectList from "@/components/ProjectList";
import ConfirmModal from "@/components/modals/ConfirmModal";

export default function AdminPage() {
  const { user, loading, role } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [form, setForm] = useState<Partial<Project>>({});
  const [editId, setEditId] = useState<string | null>(null);
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [galleryFiles, setGalleryFiles] = useState<File[]>([]);
  const [richContent, setRichContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [existingGallery, setExistingGallery] = useState<string[]>([]);

  const formModal = useModal();
  const { showToast } = useToast();
  const router = useRouter();

  useEffect(() => {
    if (role === "visitor") router.push("/");
    if (!loading && !user) router.push("/");
  }, [user, loading]);

  useEffect(() => {
    if (!user) return;
  
    let unsubscribe: () => void;
  
    if (role === "superadmin") {
      unsubscribe = listenToAllProjectsRealtime(setProjects);
    } else {
      unsubscribe = listenToUserProjectsRealtime(user.uid, setProjects);
    }
  
    return () => unsubscribe?.();
  }, [user, role]);


  if (loading) return <p>Loading...</p>;
  if (!user) return <p>Access denied.</p>;

  const resetForm = () => {
    setIsSubmitting(false);
    setForm({});
    setEditId(null);
    setCoverFile(null);
    setGalleryFiles([]);
    setRichContent("");
    formModal.close();
  };

  const handleCreate = async () => {
    if (!form.title || !form.description || !form.category || !user) {
      showToast("Please fill all required fields.", "error");
      return;
    }
    setIsSubmitting(true);
    try {
      const imageUrl = coverFile
        ? await uploadImage(coverFile, `projects/${user.uid}/cover-${Date.now()}`)
        : "";

      const uploadedGallery = await Promise.all(
        galleryFiles.map((file) =>
          uploadImage(file, `projects/${user.uid}/gallery/${Date.now()}-${file.name}`)
        )
      );

      const data: Omit<Project, "id" | "createdAt" | "ownerUID"> = {
        title: form.title,
        description: form.description,
        category: form.category,
        fullDescription: richContent,
        url: form.url || "",
        image: imageUrl,
        images: uploadedGallery,
        isPublished: true,
      };

      await createProject(data, user.uid);
      showToast("Project created successfully", "success");
    } catch (err) {
      showToast("Failed to create project", "error");
    } finally {
      resetForm();
    }
  };

  const handleUpdate = async () => {
    if (!form.title || !form.description || !form.category || !user || !editId) {
      showToast("Please fill all required fields.", "error");
      return;
    }
    setIsSubmitting(true);
    try {
      const imageUrl = coverFile
        ? await uploadImage(coverFile, `projects/${user.uid}/cover-${Date.now()}`)
        : form.image || "";

      const uploadedGallery = await Promise.all(
        galleryFiles.map((file) =>
          uploadImage(file, `projects/${user.uid}/gallery/${Date.now()}-${file.name}`)
        )
      );

      const data: Omit<Project, "id" | "createdAt" | "ownerUID"> = {
        title: form.title,
        description: form.description,
        category: form.category,
        fullDescription: richContent,
        url: form.url || "",
        image: imageUrl,
        images: [...existingGallery, ...uploadedGallery],        isPublished: true,
      };

      await updateProject(editId, data);
      showToast("Project updated successfully", "success");
    } catch (err) {
      showToast("Failed to update project", "error");
    } finally {
      resetForm();
    }
  };

  const handleEdit = (project: Project) => {
    setForm(project);
    setEditId(project.id);
    setRichContent(project.fullDescription || "");
    setCoverFile(null);
    setGalleryFiles([]);
    setExistingGallery(project.images || []);
    formModal.open();
  };

  const handleDelete = (id: string) => {
    setDeleteId(id);
    setConfirmOpen(true);
  };

  const confirmDelete = async () => {
    if (!deleteId) return;
    const project = projects.find(p => p.id === deleteId);
    try {
      if (project?.image) await deleteImage(project.image);
      await Promise.all((project?.images || []).map(deleteImage));
      await deleteProject(deleteId);
      showToast("Project deleted successfully", "success");
    } catch {
      showToast("Failed to delete project", "error");
    } finally {
      setDeleteId(null);
      setConfirmOpen(false);
    }
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

      <ProjectList projects={projects} onEdit={handleEdit} onDelete={handleDelete} />

      <Modal isOpen={formModal.isOpen} onClose={formModal.close} title="Add a project">
        <ProjectForm
          form={form}
          setForm={setForm}
          onSubmit={editId ? handleUpdate : handleCreate}
          coverFile={coverFile}
          setCoverFile={setCoverFile}
          galleryFiles={galleryFiles}
          setGalleryFiles={setGalleryFiles}
          richContent={richContent}
          setRichContent={setRichContent}
          isSubmitting={isSubmitting}
          existingGallery={existingGallery}
          setExistingGallery={setExistingGallery}
        />
      </Modal>

      <ConfirmModal
        isOpen={confirmOpen}
        message="Are you sure you want to delete this project? This action cannot be undone."
        onCancel={() => setConfirmOpen(false)}
        onConfirm={confirmDelete}
      />
    </div>
  );
}
