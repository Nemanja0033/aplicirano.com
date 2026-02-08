"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/src/components/ui/alert-dialog";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { Label } from "@/src/components/ui/label";
import { Textarea } from "@/src/components/ui/textarea";
import { Download } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useTranslations } from "next-intl";

import { getBadgeLightColor } from "@/helpers";
import { updateSingleJob } from "../../jobs-import/services/job-import-service";
import { JobImportForm } from "../../jobs-import/components/ManuelJobImport";
import { useAuthContext } from "@/src/context/AuthProvider";

interface EditJobModalProps {
  selectedJob: any;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function EditJobModal({
  selectedJob,
  isOpen,
  onOpenChange,
}: EditJobModalProps) {
  const { token } = useAuthContext();
  const queryClient = useQueryClient();
  const t = useTranslations("JobsTable");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting, isDirty },
  } = useForm<JobImportForm>({ mode: "onSubmit" });

  useEffect(() => {
    if (selectedJob) {
      reset({
        company: selectedJob.title,
        position: selectedJob.position,
        salary: selectedJob.salarly,
        jobUrl: selectedJob.jobUrl,
        location: selectedJob.location,
        notes: selectedJob.notes,
      });
    }
  }, [selectedJob, reset]);

  async function handleUpdateJob(data: JobImportForm) {
    if (!isDirty) {
      onOpenChange(false);
      return;
    }

    try {
      await updateSingleJob(data, selectedJob?.id, token);
      queryClient.invalidateQueries({ queryKey: ["jobs"] });
      queryClient.invalidateQueries({ queryKey: ["stats"] });
      onOpenChange(false);
      toast.success(t("modal_success_update")); // Added success toast if missing in original
    } catch (err) {
      toast.error("Something went wrong");
    }
  }

  return (
    <AlertDialog open={isOpen} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            {selectedJob?.title}
            <span
              className={`text-[13px] ml-3 font-medium w-28 p-1 rounded-2xl dark:opacity-75 ${getBadgeLightColor(
                selectedJob?.status
              )} bg-accent`}
            >
              • {selectedJob?.status}
            </span>
          </AlertDialogTitle>
          <AlertDialogDescription className="flex gap-3 items-center w-full justify-between">
            <span className="text-xs text-gray-400 font-normal flex gap-1 items-center">
              <span>{t("applied_at")}</span>
              {new Date(selectedJob?.appliedAt).toLocaleDateString()}
            </span>
            <span className="text-xs text-gray-400 font-normal flex gap-1 items-center">
              <span>{t("updated_at")}</span>
              {new Date(selectedJob?.updatedAt).toLocaleDateString()}
            </span>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <form onSubmit={handleSubmit(handleUpdateJob)} className="grid gap-2">
          <div className="grid gap-2">
            <Label htmlFor="company" className="text-xs dark:text-gray-400">
              *{t("modal_company_label")}{" "}
              <span className="text-xs text-primary">
                {t("modal_company_required")}
              </span>
            </Label>
            <Input
              {...register("company", {
                required: {
                  value: true,
                  message: t("modal_company_error_required"),
                },
                minLength: {
                  value: 2,
                  message: t("modal_company_error_minLength"),
                },
                maxLength: {
                  value: 50,
                  message: t("modal_company_error_maxLength"),
                },
              })}
              id="company"
              className="w-full"
            />
            {errors.company && (
              <span className="text-red-500 text-xs">
                *{errors.company?.message}
              </span>
            )}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="position" className="text-xs dark:text-gray-400">
              *{t("modal_position_label")}
            </Label>
            <Input
              {...register("position", {
                required: false,
                minLength: {
                  value: 2,
                  message: t("modal_position_error_minLength"),
                },
                maxLength: {
                  value: 50,
                  message: t("modal_position_error_maxLength"),
                },
              })}
              id="position"
              className="w-full"
            />
            {errors.position && (
              <span className="text-red-500 text-xs">
                *{errors.position.message}
              </span>
            )}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="salary" className="text-xs dark:text-gray-400">
              *{t("modal_salary_label")}
            </Label>
            <Input
              {...register("salary", {
                required: false,
                min: 50,
                max: 30000,
              })}
              id="salary"
              type="number"
              className="w-full"
            />
            {errors.salary && (
              <span className="text-red-500 text-xs">
                *{errors.salary.message}
              </span>
            )}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="jobUrl" className="text-xs dark:text-gray-400">
              *{t("modal_jobUrl_label")}
            </Label>
            <Input
              {...register("jobUrl", {
                required: false,
                minLength: {
                  value: 2,
                  message: t("modal_jobUrl_error_minLength"),
                },
                maxLength: {
                  value: 250,
                  message: t("modal_jobUrl_error_maxLength"),
                },
              })}
              id="jobUrl"
              className="w-full"
            />
            {errors.jobUrl && (
              <span className="text-red-500 text-xs">
                *{errors.jobUrl.message}
              </span>
            )}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="location" className="text-xs dark:text-gray-400">
              *{t("modal_location_label")}
            </Label>
            <Input
              {...register("location", {
                required: false,
                maxLength: {
                  value: 250,
                  message: t("modal_location_error_maxLength"),
                },
              })}
              id="location"
              className="w-full"
            />
            {errors.location && (
              <span className="text-red-500 text-xs">
                *{errors.location.message}
              </span>
            )}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="notes" className="text-xs dark:text-gray-400">
              *{t("modal_notes_label")}
            </Label>
            <Textarea
              {...register("notes", {
                required: false,
                maxLength: {
                  value: 500,
                  message: t("modal_notes_error_maxLength"),
                },
              })}
              id="notes"
              className="w-full min-h-20 max-h-40"
            />
            {errors.notes && (
              <span className="text-red-500 text-xs">
                *{errors.notes.message}
              </span>
            )}
          </div>

          {selectedJob?.resume && (
            <div className="w-full p-2 h-14 border flex gap-2 items-center justify-between rounded-md">
              <div className="flex gap-2 items-center">
                <img src="/pdf.png" className="w-6" alt="" />
                <span>{selectedJob?.resume?.title}</span>
              </div>
              <a
                download
                href={selectedJob?.resume.resumeUrl}
                className="cursor-pointer"
              >
                <Download className="text-primary" />
              </a>
            </div>
          )}

          <div className="flex justify-end gap-2 mt-3">
            <Button
              type="button"
              className="w-32"
              variant={"outline"}
              onClick={() => onOpenChange(false)}
            >
              {t("modal_buttons_cancel")}
            </Button>
            <Button disabled={!isDirty} type="submit" className="w-32">
              {isSubmitting
                ? t("modal_buttons_submitting")
                : t("modal_buttons_save")}
            </Button>
          </div>
        </form>
      </AlertDialogContent>
    </AlertDialog>
  );
}
