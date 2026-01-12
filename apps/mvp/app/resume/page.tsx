"use client";
import Loader from "@/components/Loader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuthContext } from "@/context/AuthProvider";
import { fetchCurrentUserData } from "@/features/user/service/user-service";
import { useQuery } from "@tanstack/react-query";
import React, { useState } from "react";

export default function ResumesPage() {
  const { token } = useAuthContext();
  const [selectedProfile, setSelectedProfile] = useState<string | null>(null);

  const { data: currentUser, isLoading: isUserLoading } = useQuery({
    queryKey: ["me"],
    queryFn: () => fetchCurrentUserData(token as any),
    enabled: !!token,
  });

  const {
    data: resumes,
    isLoading,
    isFetching,
  } = useQuery({
    queryKey: ["resumes", selectedProfile],
    queryFn: async () => {
      if (!token) return { jobs: [], total: 0 };
      const res = await fetch(`/api/cv-storage?profile=${selectedProfile}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!res.ok) {
        throw new Error("Failed to fetch jobs");
      }
      return (await res.json());
    },
    staleTime: 60 * 5000,
    enabled: !!token,
  });

  if (isUserLoading || isLoading) {
    return <Loader type="NORMAL" />;
  }

  async function handleFormSubmit(e: React.FormEvent<HTMLFormElement>){
    e.preventDefault();
    
    const form = e.currentTarget;
    const fileInput = form.elements.namedItem('cv') as HTMLInputElement;
    const file = fileInput?.files?.[0];

    if(!file){
        console.log("NO CV SELECTED")
        return
    };

    const formData = new FormData();
    formData.append("file", file);
    formData.append("profile", selectedProfile as string)

    const res = await fetch("/api/cv-storage", {
        method: "POST",
        body: formData,
        headers: {
            Authorization: `Bearer ${token}`
        }
    });


   }

  return (
    <main className="w-full h-screen flex justify-center items-start overflow-auto">
      <div className="md:w-6xl p-3 w-full grid place-items-center gap-5">
        <div className="w-full">
          <section className="md:w-full dark:border-[#151046] dark:border-2 dark:bg-gradient-to-b from-[#100c28] to-[#010216] w-fit grid gap-5 p-5 rounded-lg shadow-md bg-white dark:bg-sidebar">
            <div className="grid gap-1 w-full border-b py-3">
              <h1 className="font-bold text-2xl">Resumes Storage</h1>
              <p className="text-muted-foreground text-sm">
                Manage and track all your resumes versions in one place
              </p>
            </div>
          </section>

          <div className="mt-5 dark:bg-gradient-to-b from-[#100c28] to-[#010216] dark:border-[#151046] dark:border-2 bg-white shadow-md p-5 rounded-lg shadow-md">
            <div className="grid gap-2 w-full">
              <span className="text-sm text-muted-foreground">
                Selected profiles
              </span>
              <div className="flex gap-3 items-center">
                <Button
                  onClick={() => setSelectedProfile(null)}
                  className={`${selectedProfile !== null ? "text-primary bg-transparent hover:text-white" : "text-white bg-primary"} border-2 border-primary`}
                >
                  General
                </Button>
                {currentUser?.profiles.map((p: any) => (
                  <Button
                    onClick={() => setSelectedProfile(p.id)}
                    className={`${selectedProfile !== p.id ? "bg-transparent text-primary hover:text-white" : "bg-primary text-white"} border-2 border-primary`}
                  >
                    {p.name}
                  </Button>
                ))}
              </div>
            </div>

            <div className="mt-3">
                <form onSubmit={handleFormSubmit}>
                    <Input name="cv" className="border border-muted w-90 h-12 rounded-lg cursor-pointer" type="file" accept=".pdf" />
                    <Button type="submit">Submit</Button>
                </form>
            </div>

            <div>
              {resumes?.map((r: any) => (
                <div>
                  <span>{r.title}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
