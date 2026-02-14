import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useTranslations } from "next-intl";
import { useAuthContext } from "@/src/context/AuthProvider";
import { useCurrentUser } from "@/src/features/user/hooks/useCurrentUser";
import {
  fetchProfilesApi,
  createProfileApi,
  deleteProfileApi,
} from "../services/profile-service";
import { Profile } from "../types";

export function useProfiles() {
  const t = useTranslations("ProfilePage");
  const { token } = useAuthContext();
  const queryClient = useQueryClient();
  const [isDeleting, setIsDeleting] = useState(false);
  const [name, setName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isAddingNewProfile, setIsAddingNewProfile] = useState(false);
  const { currentUserData } = useCurrentUser();

  const {
    data: profiles,
    isLoading: isProfilesLoading,
  } = useQuery<Profile[]>({
    queryKey: ["profiles"],
    queryFn: () => fetchProfilesApi(token as any),
    enabled: !!token,
    staleTime: 1000 * 60 * 2,
  });

  useEffect(() => {
    if (currentUserData?.profileLimit === 0) {
      toast.error("Profiles Limit reached, please upgrade to Pro plan");
    }
  }, [currentUserData]);

  const createMutation = useMutation({
    mutationFn: (payload: { name: string }) =>
      createProfileApi(token as any, payload),
    onSuccess: () => {
      toast.success(t("toast_created"));
      queryClient.invalidateQueries({ queryKey: ["profiles"] });
      queryClient.invalidateQueries({ queryKey: ["me"] });
      setName("");
      setIsAddingNewProfile(false);
    },
    onError: (err: any) => {
      toast.error(err?.message || t("toast_error_create"));
    },
  });

  const canCreate = (profiles?.length ?? 0) < 3;
  const nameValid = name.trim().length > 2 && name.trim().length <= 50;

  async function handleCreate(e?: React.FormEvent) {
    e?.preventDefault();
    if (!token) {
      toast.error(t("toast_error_signedIn"));
      return;
    }
    if (!canCreate) {
      toast.error(t("toast_error_limit"));
      return;
    }
    if (!nameValid) {
      toast.error(t("toast_error_name"));
      return;
    }

    setIsSubmitting(true);
    try {
      await createMutation.mutateAsync({ name: name.trim() });
    } finally {
      setIsSubmitting(false);
    }
  }

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [selectedProfileToDelete, setSelectedProfileToDelete] = useState<{
    id: string;
    name?: string;
  } | null>(null);

  async function handleDelete(payload: { profileId: string }) {
    try {
      setIsDeleting(true);
      await deleteProfileApi(token as any, payload);
      toast.success(t("toast_deleted"));
      queryClient.invalidateQueries({ queryKey: ["profiles"] });
      queryClient.invalidateQueries({ queryKey: ["jobs"] });
      queryClient.invalidateQueries({ queryKey: ["me"] });
    } catch (err) {
      console.error(err);
      toast.error(t("toast_error_delete"));
    } finally {
      setIsDeleting(false);
    }
  }

  function confirmDelete(profile: { id: string; name?: string }) {
    setSelectedProfileToDelete(profile);
    setConfirmOpen(true);
  }

  async function onConfirmDelete() {
    if (!selectedProfileToDelete) return;
    setConfirmOpen(false);
    await handleDelete({ profileId: selectedProfileToDelete.id });
    setSelectedProfileToDelete(null);
  }

  return {
    t,
    token,
    profiles,
    isProfilesLoading,
    name,
    setName,
    isSubmitting,
    isAddingNewProfile,
    setIsAddingNewProfile,
    currentUserData,
    canCreate,
    handleCreate,
    confirmOpen,
    setConfirmOpen,
    selectedProfileToDelete,
    confirmDelete,
    onConfirmDelete,
    isDeleting,
  };
}
