import { useState, useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuthContext } from "@/src/context/AuthProvider";
import { fetchCurrentUserData } from "@/src/features/user/service/user-service";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { useTranslations } from "next-intl";
import axios from "axios";
import pdfToText from "react-pdftotext";
import { FormValues, Resume } from "../types";

export function useResumes() {
  const queryClient = useQueryClient();
  const { token } = useAuthContext();
  const [selectedProfile, setSelectedProfile] = useState<string | null>(null);
  const [isAddResumeModalOpen, setIsAddResumeModalOpen] = useState<boolean>(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const t = useTranslations("ResumePage");

  // Confirm modal state for deleting resume
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [selectedResumeToDelete, setSelectedResumeToDelete] = useState<{
    id: string;
    title?: string;
  } | null>(null);

  const { data: currentUser, isLoading: isUserLoading } = useQuery({
    queryKey: ["me"],
    queryFn: () => fetchCurrentUserData(token as any),
    enabled: !!token,
  });

  const { data: resumes, isLoading } = useQuery<Resume[]>({
    queryKey: ["resumes", selectedProfile],
    queryFn: async () => {
      if (!token) return [];
      const res = await fetch(`/api/cv-storage?profile=${selectedProfile}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!res.ok) throw new Error("Failed to fetch resumes");
      return await res.json();
    },
    enabled: !!token,
  });

  useEffect(() => {
    if (currentUser?.resumeLimit === 0) {
      toast.error(t("toast_limit"));
    }
  }, [currentUser, t]);

  const form = useForm<FormValues>();
  const { reset } = form;

  async function onSubmit(data: FormValues) {
    const file = data.cv?.[0];
    if (!file) {
      toast.error(t("form_file_error"));
      return;
    }

    if (currentUser?.resumeLimit === 0) {
      toast.error(t("toast_limit"));
      return;
    }

    let cvContent: null | string = null;
    try {
      cvContent = await pdfToText(file);
    } catch (err) {
      console.log("Parsing pdf error", err);
      toast.error("Resume sucessfully uploaded, but we having trouble parsing it right now");
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("resume_content", cvContent ?? "");
    formData.append("title", data.title);
    formData.append("profile", selectedProfile as string);

    try {
      const res = await fetch("/api/cv-storage", {
        method: "POST",
        body: formData,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        toast.error(t("toast_upload_error"));
        throw new Error("Upload failed");
      }

      queryClient.invalidateQueries({ queryKey: ["resumes", selectedProfile] });
      queryClient.invalidateQueries({ queryKey: ["me"] });

      reset();
      setIsAddResumeModalOpen(false);
      toast.success(t("toast_upload_success"));
    } catch (err) {
      console.error(err);
      toast.error(t("toast_upload_error"));
    }
  }

  async function handleDelete(cvId: string) {
    try {
      setIsDeleting(true);
      await axios.delete("/api/cv-storage", {
        data: { cvToDeleteId: cvId },
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success(t("toast_deleted"));
      queryClient.invalidateQueries({ queryKey: ["resumes", selectedProfile] });
      queryClient.invalidateQueries({ queryKey: ["me"] });
    } catch (err) {
      console.error(err);
      toast.error(t("toast_error_delete"));
    } finally {
      setIsDeleting(false);
    }
  }

  function confirmDeleteResume(resume: { id: string; title?: string }) {
    setSelectedResumeToDelete(resume);
    setConfirmOpen(true);
  }

  async function onConfirmDeleteResume() {
    if (!selectedResumeToDelete) return;
    setConfirmOpen(false);
    await handleDelete(selectedResumeToDelete.id);
    setSelectedResumeToDelete(null);
  }

  return {
    token,
    currentUser,
    resumes,
    isLoading: isLoading || isUserLoading,
    selectedProfile,
    setSelectedProfile,
    isAddResumeModalOpen,
    setIsAddResumeModalOpen,
    isDeleting,
    confirmOpen,
    setConfirmOpen,
    selectedResumeToDelete,
    form,
    onSubmit,
    confirmDeleteResume,
    onConfirmDeleteResume,
    t,
  };
}
