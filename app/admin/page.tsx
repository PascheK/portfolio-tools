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

  // Fetch projects owned by the current user
  useEffect(() => {
    if (!user) return;
    const unsubscribe = listenToUserProjects(user.uid, setProjects);
    return () => unsubscribe();
  }, [user]);

  if (loading) return <p>Chargement...</p>;
  if (!user) return <p>Accès refusé.</p>;

  // Handle project form submission
  const handleSubmit = async () => {
    if (!form.title || !form.description || !form.category || !user) {
      showToast("Veuillez remplir tous les champs requis.", "error");
      return;
    }

    setIsSubmitting(true);
    try {
      // Image principale
let imageUrl: string | undefined = form.image || undefined;
if (coverFile) {
  imageUrl = await uploadImage(coverFile, `projects/${user.uid}/cover-${Date.now()}`);
}

// Galerie d’images
let imageUrls: string[] = form.images || [];
if (galleryFiles.length > 0) {
  const uploaded = await Promise.all(
    galleryFiles.map((file) =>
      uploadImage(file, `projects/${user.uid}/gallery/${Date.now()}-${file.name}`)
    )
  );
  imageUrls = [...imageUrls, ...uploaded];
}

      // Construct the project object
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
        showToast("Projet modifié", "success");
      } else {
        await createProject(newProjectData, user.uid);
        showToast("Projet ajouté", "success");
      }
    } catch (error) {
      console.error("Error uploading files or creating project:", error);
      showToast("Erreur lors de l'ajout du projet", "error");
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

  // Handle project editing
  const handleEdit = (project: Project) => {
    setForm(project);
    setEditId(project.id);
    setRichContent(project.fullDescription || "");
    setCoverFile(null);
    setGalleryFiles([]);
    formModal.open();
  };

  // Handle delete request (show confirmation modal)
  const handleDelete = (id: string) => {
    setDeleteId(id);
    setConfirmOpen(true);
  };

  // Handle confirmation of delete action
  const confirmDelete = async () => {
    if (!deleteId) return;
    await deleteProject(deleteId);
    setDeleteId(null);
    setConfirmOpen(false);
    showToast("Projet supprimé", "success");
  };

  return (
    <div className="max-w-full px-2 mx-auto">
      <h1 className="text-2xl font-bold mb-4">Mes projets</h1>

      {/* Add Project Button */}
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
        Ajouter un projet
      </button>

      {/* List of user projects */}
      <ProjectList projects={projects} onEdit={handleEdit} onDelete={handleDelete} />

      {/* Modal with project form */}
      <Modal isOpen={formModal.isOpen} onClose={formModal.close} title="Ajouter un projet">
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
        message="Êtes-vous sûr de vouloir supprimer ce projet ? Cette action est irréversible."
        onCancel={() => setConfirmOpen(false)}
        onConfirm={confirmDelete}
      />
    </div>
  );
}