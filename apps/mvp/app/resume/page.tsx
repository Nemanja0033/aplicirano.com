"use client";
import Loader from "@/components/Loader";
import {
  AlertDialog,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogContent,
  AlertDialogTrigger,
  AlertDialogDescription,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuthContext } from "@/context/AuthProvider";
import { fetchCurrentUserData } from "@/features/user/service/user-service";
import { formatFileSize } from "@/helpers";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import React, { useState } from "react";
import { useForm } from "react-hook-form";

type FormValues = {
  title: string;
  cv: FileList;
};

export default function ResumesPage() {
  const queryClient = useQueryClient();
  const { token } = useAuthContext();
  const [selectedProfile, setSelectedProfile] = useState<string | null>(null);
  const [isAddResumeModalOpen, setIsOpenModalOpen] = useState<boolean>(false);

  const { data: currentUser, isLoading: isUserLoading } = useQuery({
    queryKey: ["me"],
    queryFn: () => fetchCurrentUserData(token as any),
    enabled: !!token,
  });

  const { data: resumes, isLoading } = useQuery({
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

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>();

  if (isUserLoading || isLoading) {
    return <Loader type="NORMAL" />;
  }

  async function onSubmit(data: FormValues) {
    // Basic validation: ensure file exists
    const file = data.cv?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);
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
        throw new Error("Upload failed");
      }

      // refresh resumes for current profile
      queryClient.invalidateQueries({ queryKey: ["resumes", selectedProfile] });

      // reset form and close modal
      reset();
      setIsOpenModalOpen(false);
    } catch (err) {
      console.error(err);
      // optionally show toast / error state
    }
  }

  return (
    <>
      <main className="w-full h-screen flex justify-center items-start overflow-auto">
        <div className="md:w-6xl p-3 w-full grid place-items-center gap-5">
          <div className="w-full">
            <section className="md:w-full dark:border-[#151046] dark:border-2 dark:bg-gradient-to-b from-[#100c28] to-[#010216] w-fit grid gap-5 p-5 rounded-lg shadow-md bg-white dark:bg-sidebar">
              <div className="grid gap-1 w-full border-b py-3">
                <h1 className="font-bold text-2xl">Resumes Storage</h1>
                <p className="text-muted-foreground text-sm">
                  Store, manage and reuse your CVs across profiles
                </p>
              </div>
            </section>

            <div className="mt-5 dark:bg-gradient-to-b from-[#100c28] to-[#010216] dark:border-[#151046] dark:border-2 bg-white p-5 rounded-lg shadow-md">
              {/* Profile selector */}
              <div className="grid gap-2 w-full py-4 border-b-1">
                <span className="text-sm text-muted-foreground">
                  Active profile
                </span>

                <div className="flex flex-wrap gap-2 items-center">
                  <Button
                    onClick={() => setSelectedProfile(null)}
                    className={`${
                      selectedProfile !== null
                        ? "bg-transparent text-primary hover:text-white"
                        : "bg-primary text-white"
                    } border-2 border-primary`}
                  >
                    General
                  </Button>

                  {currentUser?.profiles.map((p: any) => (
                    <Button
                      key={p.id}
                      onClick={() => setSelectedProfile(p.id)}
                      className={`${
                        selectedProfile !== p.id
                          ? "bg-transparent text-primary hover:text-white"
                          : "bg-primary text-white"
                      } border-2 border-primary`}
                    >
                      {p.name}
                    </Button>
                  ))}
                </div>
              </div>

              <AlertDialog open={isAddResumeModalOpen} onOpenChange={setIsOpenModalOpen}>
                <AlertDialogTrigger asChild>
                  <Button className="mt-3">+ Add resume</Button>
                </AlertDialogTrigger>

                <AlertDialogContent>
                  <button
                    type="button"
                    onClick={() => setIsOpenModalOpen(false)}
                    className="absolute top-2 cursor-pointer right-4 text-muted-foreground"
                    aria-label="Close"
                  >
                    ×
                  </button>

                  <AlertDialogHeader>
                    <AlertDialogTitle>Upload resume</AlertDialogTitle>
                    <AlertDialogDescription>
                      Upload your resume and track your job applications more
                      precisely
                    </AlertDialogDescription>
                  </AlertDialogHeader>

                  {/* Upload form using react-hook-form */}
                  <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="grid gap-3 mt-4"
                  >
                    <div>
                      <Label className="text-sm text-primary" htmlFor="title">
                        * Title
                      </Label>
                      <Input
                        id="title"
                        {...register("title", { required: "Title is required" })}
                        placeholder="e.g. Resume v1"
                      />
                      {errors.title && (
                        <p className="text-xs text-destructive mt-1">{errors.title.message}</p>
                      )}
                    </div>

                    <div>
                      <Label className="text-sm text-primary" htmlFor="cv">
                        * Document (PDF)
                      </Label>
                      <Input
                        id="cv"
                        type="file"
                        accept=".pdf"
                        className="h-12 cursor-pointer"
                        {...register("cv", {
                          required: "PDF file is required",
                          validate: {
                            isPdf: (files: FileList) =>
                              files && files.length > 0 && files[0].type === "application/pdf"
                                ? true
                                : "Only PDF files are allowed",
                          },
                        })}
                      />
                      {errors.cv && (
                        <p className="text-xs text-destructive mt-1">{errors.cv.message as string}</p>
                      )}
                    </div>

                    <div className="flex gap-2 items-center">
                      <Button type="submit" className="h-12 px-6" disabled={isSubmitting}>
                        {isSubmitting ? "Uploading..." : "Upload"}
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => {
                          reset();
                          setIsOpenModalOpen(false);
                        }}
                        className="h-12 px-4"
                      >
                        Cancel
                      </Button>
                    </div>
                  </form>
                </AlertDialogContent>
              </AlertDialog>

              {/* Resumes list */}
              <div className="mt-6 grid gap-3">
                {resumes?.length === 0 && (
                  <div className="text-sm text-muted-foreground text-center py-6 border border-dashed rounded-lg">
                    No resumes uploaded yet
                  </div>
                )}

                {resumes?.map((r: any) => (
                  <div
                    key={r.id}
                    className="flex cursor-pointer hover:opacity-80 transition-all items-center justify-between p-3 border rounded-lg bg-background"
                  >
                    <div className="grid gap-1">
                      <div className="flex items-center gap-1">
                        <img className="w-4" src="pdf.png" alt="" />
                        <span className="font-medium">{r.title || "Resume"}</span>
                      </div>
                      <span className="text-xs text-muted-foreground">
                        PDF document {formatFileSize(Number(r.fileSize))}
                      </span>
                    </div>

                    <a
                      href={r.resumeUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="text-sm text-primary hover:underline"
                    >
                      View
                    </a>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}