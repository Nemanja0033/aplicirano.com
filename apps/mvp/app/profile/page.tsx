"use client";

import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useAuthContext } from "@/context/AuthProvider";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Loader2, Trash2 } from "lucide-react";
import axios from "axios";
import Loader from "@/components/Loader";

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
  const data = await res.json();

  return data;
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
  // Ako backend vraća ceo array ili objekat, prilagodi po potrebi.
  // Pretpostavka: POST vraća { profile: {...} } ili sam objekat profila.
  if (json?.profile) return json.profile as Profile;
  if (json && typeof json === "object" && json.id) return json as Profile;
  return json as Profile;
}

export default function ProfilePage() {
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
    // uključujemo token u key da se refetchuje kad token stigne/promeni se
    queryKey: ["profiles"],
    queryFn: () => fetchProfilesApi(token as any),
    enabled: !!token,
    staleTime: 1000 * 60 * 2,
  });

  useEffect(() => {
    console.log("token:", token);
  }, [token]);

  useEffect(() => {
    console.log("profiles (query data):", profiles);
    console.log(
      "isLoading:",
      isProfilesLoading,
      "isFetching:",
      isFetching,
      "isError:",
      isProfilesError
    );
    if (isProfilesError) console.error("profilesError:", profilesError);
  }, [profiles, isProfilesLoading, isProfilesError, profilesError, isFetching]);

  const [name, setName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isAddingNewProfile, setIsAddingNewProfile] = useState(false);

  const createMutation = useMutation({
    mutationFn: (payload: { name: string }) =>
      createProfileApi(token as any, payload),
    onSuccess: () => {
      toast.success("Profile created");
      queryClient.invalidateQueries({ queryKey: ["profiles"] });
      setName("");
    },
    onError: (err: any) => {
      toast.error(err?.message || "Failed to create profile");
    },
  });

  const canCreate = (profiles?.length ?? 0) < 3;
  const nameValid = name.trim().length > 2 && name.trim().length <= 50;

  async function handleCreate(e?: React.FormEvent) {
    e?.preventDefault();
    if (!token) {
      toast.error("You must be signed in");
      return;
    }
    if (!canCreate) {
      toast.error("Profile limit reached (3)");
      return;
    }
    if (!nameValid) {
      toast.error("Enter a valid profile name (1-50 chars)");
      return;
    }

    setIsSubmitting(true);
    try {
      await createMutation.mutateAsync({ name: name.trim() });
    } catch (err) {
      // handled in onError
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
        body: JSON.stringify(payload)
      });

      if(!res.ok){
        toast.error("Something went wrong");
      }

      queryClient.invalidateQueries({ queryKey: ['profiles']});
      toast.success("Profile succesfully deleted");
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong");
    }
    finally{
      setIsDeleting(false);
    }
  }

  if (isProfilesLoading) {
    return <Loader type="NORMAL" />
  }

  return (
    <main className="w-full h-full flex justify-center items-start">
      <section className="md:w-6xl p-3 w-full grid place-items-center gap-5">
        <section className="w-full dark:border-[#151046] dark:border-2 dark:bg-gradient-to-b from-[#100c28] to-[#010216] grid place-items-start p-5 rounded-lg shadow-md bg-white dark:bg-sidebar">
          <div className="grid gap-1 w-full">
            <h1 className="text-2xl font-bold">Profile</h1>
            <p className="text-muted-foreground text-sm">
              Configure your applying profiles (up to 3). Profiles are personas
              for applying.
            </p>
          </div>
        </section>

        <section className="w-full rounded-lg bg-white shadow-md p-5 dark:border-[#151046] dark:border-2 dark:bg-gradient-to-b from-[#100c28] to-[#010216]">
          <div className="grid gap-4">
            <div className="flex items-center justify-between">
              <div className="text-right">
                <span className="text-sm text-muted-foreground">
                  {profiles?.length ?? 0} / 3 used
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
                          Created: {new Date(p.createdAt).toLocaleDateString()}
                        </span>
                      </div>

                      <button onClick={() => handleDelete({ profileId: p.id })} disabled={isDeleting} className="text-red-900 cursor-pointer hover:text-red-800">
                        <Trash2 size={20} />
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-4 rounded-md bg-gray-100 dark:bg-gray-800/40">
                  No profiles yet
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
                    placeholder="e.g. Frontend Dev"
                    disabled={!canCreate || isSubmitting}
                  />
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    className="h-12"
                    type="submit"
                    disabled={!canCreate || isSubmitting || !nameValid}
                  >
                    {isSubmitting
                      ? "Creating..."
                      : canCreate
                        ? "Create Profile"
                        : "Limit reached"}
                  </Button>
                </div>
              </form>
            ) : (
              <button
                onClick={() => setIsAddingNewProfile(true)}
                className="flex items-center justify-between p-5 hover:opacity-70 transition-all cursor-pointer rounded-lg border dark:border-[#151046] bg-white dark:bg-sidebar"
              >
                <span>+ Add Profile</span>
              </button>
            )}
          </div>
        </section>
      </section>
    </main>
  );
}
