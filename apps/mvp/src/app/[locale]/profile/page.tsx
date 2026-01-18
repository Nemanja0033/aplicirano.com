"use client";

import { useEffect, useState } from "react";
import { Input } from "@/src/components/ui/input";
import { Button } from "@/src/components/ui/button";
import { useAuthContext } from "@/src/context/AuthProvider";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Trash2 } from "lucide-react";
import Loader from "@/src/components/Loader";
import { useTranslations } from "next-intl";
import GlobalLoader from "@/src/components/gloabal-loader";
import { useCurrentUser } from "@/src/features/user/hooks/useCurrentUser";

type Profile = {
  id: string;
  name: string;
  createdAt: string;
};

async function fetchProfilesApi(token: string | null) {
  if (!token) throw new Error("No token");
  const res = await fetch("/api/profiles", {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) {
    const text = await res.text().catch(() => null);
    throw new Error(text || "Failed to fetch profiles");
  }
  return res.json();
}

async function createProfileApi(
  token: string | null,
  payload: { name: string }
) {
  if (!token) throw new Error("No token");
  const res = await fetch("/api/profiles", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const json = await res.json().catch(() => null);
    throw new Error(
      json?.error || (await res.text()) || "Failed to create profile"
    );
  }
  const json = await res.json();
  if (json?.profile) return json.profile as Profile;
  if (json && typeof json === "object" && json.id) return json as Profile;
  return json as Profile;
}

export default function ProfilePage() {
  const t = useTranslations("ProfilePage");
  const { token } = useAuthContext();
  const queryClient = useQueryClient();
  const [isDeleting, setIsDeleting] = useState(false);

  const {
    data: profiles,
    isLoading: isProfilesLoading,
    isError: isProfilesError,
    error: profilesError,
    isFetching,
  } = useQuery({
    queryKey: ["profiles"],
    queryFn: () => fetchProfilesApi(token as any),
    enabled: !!token,
    staleTime: 1000 * 60 * 2,
  });

  const [name, setName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isAddingNewProfile, setIsAddingNewProfile] = useState(false);

  const { currentUserData } = useCurrentUser();

  const createMutation = useMutation({
    mutationFn: (payload: { name: string }) =>
      createProfileApi(token as any, payload),
    onSuccess: () => {
      toast.success(t("toast_created"));
      queryClient.invalidateQueries({ queryKey: ["profiles"] });
      setName("");
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

  async function handleDelete(payload: { profileId: string }) {
    try {
      setIsDeleting(true);
      const res = await fetch("/api/profiles", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        toast.error(t("toast_error_delete"));
      }

      queryClient.invalidateQueries({ queryKey: ["profiles"] });
      queryClient.invalidateQueries({ queryKey: ["jobs"] });
      toast.success(t("toast_deleted"));
    } catch (err) {
      console.error(err);
      toast.error(t("toast_error_delete"));
    } finally {
      setIsDeleting(false);
    }
  }

  if (isProfilesLoading) {
    return <Loader type="NORMAL" />;
  }

  if (!token) {
    return (
      <div className="w-full h-[60vh] flex justify-center items-center">
        <span className="text-gray-400 text-2xl font-semibold">
          Sign In To Start importing jobs
        </span>
      </div>
    );
  }

  // useEffect(() => {
  //   if (!token) {
  //     location.href = "auth";
  //   }
  // }, []);

  return (
    <main className="w-full h-full flex justify-center items-start">
      {isDeleting && <GlobalLoader />}
      <section className="md:w-6xl p-3 w-full grid place-items-center gap-5">
        <section className="w-full dark:border-[#151046] dark:border-2 dark:bg-gradient-to-b from-[#100c28] to-[#010216] grid place-items-start p-5 rounded-lg shadow-md bg-white dark:bg-sidebar">
          <div className="grid gap-1 w-full">
            <h1 className="text-2xl font-bold">{t("title")}</h1>
            <p className="text-muted-foreground text-sm">{t("subtitle")}</p>
          </div>
        </section>

        <section className="w-full rounded-lg bg-white shadow-md p-5 dark:border-[#151046] dark:border-2 dark:bg-gradient-to-b from-[#100c28] to-[#010216]">
          <div className="grid gap-4">
            <div className="flex items-center justify-between">
              <div className="text-right">
                <span className="text-sm text-muted-foreground">
                  {t("used_label", { count: profiles?.length ?? 0 })}
                </span>
              </div>
            </div>

            <div className="grid">
              {profiles && profiles.length > 0 ? (
                <div className="grid gap-2">
                  {profiles.map((p: any) => (
                    <div
                      key={p.id}
                      className="flex items-center justify-between p-3 rounded-lg border dark:border-[#151046] bg-white dark:bg-sidebar"
                    >
                      <div className="grid">
                        <span className="font-medium">{p.name}</span>
                        <span className="text-sm text-muted-foreground">
                          {t("created_label", {
                            date: new Date(p.createdAt).toLocaleDateString(),
                          })}
                        </span>
                      </div>

                      <button
                        onClick={() => handleDelete({ profileId: p.id })}
                        disabled={isDeleting}
                        className="text-red-900 cursor-pointer hover:text-red-800"
                      >
                        <Trash2 size={20} />
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-4 rounded-md bg-gray-100 dark:bg-gray-800/40">
                  {t("no_profiles")}
                </div>
              )}
            </div>

            {isAddingNewProfile ? (
              <form
                onSubmit={handleCreate}
                className="flex items-center justify-start w-full gap-3 h-fit"
              >
                <div className="grid w-full">
                  <Input
                    className="w-full h-12"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder={t("form_placeholder")}
                    disabled={!canCreate || isSubmitting}
                  />
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    className="h-12"
                    type="submit"
                    disabled={!canCreate || isSubmitting}
                  >
                    {isSubmitting
                      ? t("form_creating")
                      : canCreate
                        ? t("form_create")
                        : t("form_limit")}
                  </Button>
                </div>
              </form>
            ) : (
              <button
                disabled={currentUserData?.profileLimit === 0}
                onClick={() => setIsAddingNewProfile(true)}
                className="flex items-center justify-between p-5 hover:opacity-70 transition-all cursor-pointer rounded-lg border dark:border-[#151046] bg-white dark:bg-sidebar"
              >
                <span>{t("add_button")}</span>
              </button>
            )}
          </div>
        </section>
      </section>
    </main>
  );
}
