"use client";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useAuthContext } from "@/context/AuthProvider";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

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
  const json = await res.json();
  return json.profiles as Profile[];
}

async function createProfileApi(token: string | null, payload: { name: string }) {
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
    throw new Error(json?.error || (await res.text()) || "Failed to create profile");
  }
  const json = await res.json();
  return json.profile as Profile;
}

export default function ProfilePage() {
  const { token } = useAuthContext();
  const queryClient = useQueryClient();

  const {
    data: profiles = [],
    isLoading: isProfilesLoading,
    isError: isProfilesError,
    error: profilesError,
  } = useQuery({
    queryKey: ["profiles"],
    queryFn: () => fetchProfilesApi(token as any),
    enabled: !!token,
    staleTime: 1000 * 60 * 2,
  });

  const [name, setName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const createMutation = useMutation({
    mutationFn: (payload: { name: string }) => createProfileApi(token as any, payload),
    onSuccess: () => {
      toast.success("Profile created");
      queryClient.invalidateQueries({ queryKey: ["profiles"] });
      setName("");
    },
    onError: (err: any) => {
      toast.error(err?.message || "Failed to create profile");
    },
  });

  const canCreate = profiles.length < 3;
  const nameValid = name.trim().length > 0 && name.trim().length <= 50;

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

  return (
    <main className="w-full h-full flex justify-center items-start">
      <section className="md:w-6xl p-3 w-full grid place-items-center gap-5">
        <section className="w-full dark:border-[#151046] dark:border-2 dark:bg-gradient-to-b from-[#100c28] to-[#010216] grid place-items-start p-5 rounded-lg shadow-md bg-white dark:bg-sidebar">
          <div className="grid gap-1 w-full">
            <h1 className="text-2xl font-bold">Profile</h1>
            <p className="text-muted-foreground text-sm">
              Configure your applying profiles (up to 3). Profiles are personas for applying.
            </p>
          </div>
        </section>

        <section className="w-full rounded-lg bg-white shadow-md p-5 dark:border-[#151046] dark:border-2 dark:bg-gradient-to-b from-[#100c28] to-[#010216]">
          <div className="grid gap-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-semibold text-lg">Your Profiles</h2>
                <p className="text-muted-foreground text-sm">Create and manage up to 3 profiles</p>
              </div>

              <div className="text-right">
                <span className="text-sm text-muted-foreground">
                  {profiles.length} / 3 used
                </span>
              </div>
            </div>

            <div className="grid gap-2">
              {isProfilesLoading ? (
                <div className="p-4 rounded-md bg-gray-100 dark:bg-gray-800/40">Loading profiles...</div>
              ) : isProfilesError ? (
                <div className="p-4 rounded-md bg-red-50 text-red-700">Error loading profiles</div>
              ) : profiles.length === 0 ? (
                <div className="p-4 rounded-md bg-gray-50 dark:bg-gray-900/30 text-muted-foreground">
                  No profiles yet. Create one to tag jobs by persona.
                </div>
              ) : (
                <div className="grid gap-2">
                  {profiles.map((p) => (
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
                    </div>
                  ))}
                </div>
              )}
            </div>

            <form onSubmit={handleCreate} className="grid gap-3">
              <div className="grid md:grid-cols-3 gap-3 items-end">
                <div className="md:col-span-2 grid gap-1">
                  <Label>Profile name</Label>
                  <Input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Frontend Dev"
                    disabled={!canCreate || isSubmitting}
                  />
                </div>

                <div className="grid gap-1">
                  <Label>&nbsp;</Label>
                  <div className="text-sm text-muted-foreground">Optional</div>
                </div>
              </div>

              <div className="flex items-center justify-between gap-3">
                <div className="text-sm text-muted-foreground">
                  <span>
                    Profiles let you tag jobs by persona. Limits are enforced at user level.
                  </span>
                </div>

                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setName("")}
                    disabled={isSubmitting}
                  >
                    Reset
                  </Button>

                  <Button
                    type="submit"
                    disabled={!canCreate || isSubmitting || !nameValid}
                  >
                    {isSubmitting ? "Creating..." : canCreate ? "Create Profile" : "Limit reached"}
                  </Button>
                </div>
              </div>
            </form>
          </div>
        </section>
      </section>
    </main>
  );
}