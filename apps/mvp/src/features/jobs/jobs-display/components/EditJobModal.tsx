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
import { Download, Building2, Briefcase, DollarSign, MapPin, Link2, FileText, Calendar } from "lucide-react";
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
      // toast.success(t("modal_success_update"));  
    } catch (err) {
      toast.error("Something went wrong");
    }
  }

  return (
    <AlertDialog open={isOpen} onOpenChange={onOpenChange}>
      <AlertDialogContent className="max-w-[95vw] sm:max-w-[600px] lg:max-w-[700px] max-h-[95vh] sm:max-h-[90vh] overflow-hidden flex flex-col p-4 sm:p-6">
        <AlertDialogHeader className="space-y-3 pb-4 border-b">
          <div className="flex flex-col sm:flex-row sm:items-start gap-2 sm:gap-3">
            <AlertDialogTitle className="text-lg sm:text-xl font-semibold flex-1">
              {selectedJob?.title}
            </AlertDialogTitle>
            <span
              className={`text-[11px] sm:text-xs font-medium px-3 py-1 rounded-full whitespace-nowrap w-fit dark:opacity-75 ${getBadgeLightColor(
                selectedJob?.status
              )} bg-accent`}
            >
              • {selectedJob?.status}
            </span>
          </div>
          
          <AlertDialogDescription className="flex flex-col sm:flex-row gap-2 sm:gap-4 text-[11px] sm:text-xs text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <Calendar className="w-3 h-3 flex-shrink-0" />
              <span className="font-medium">{t("applied_at")}</span>
              <span>{new Date(selectedJob?.appliedAt).toLocaleDateString()}</span>
            </span>
            <span className="hidden sm:inline text-muted-foreground/30">•</span>
            <span className="flex items-center gap-1.5">
              <Calendar className="w-3 h-3 flex-shrink-0" />
              <span className="font-medium">{t("updated_at")}</span>
              <span>{new Date(selectedJob?.updatedAt).toLocaleDateString()}</span>
            </span>
          </AlertDialogDescription>
        </AlertDialogHeader>

        <form onSubmit={handleSubmit(handleUpdateJob)} className="flex flex-col flex-1 overflow-hidden">
          <div className="flex-1 overflow-y-auto px-1 -mx-1 py-4 space-y-4 sm:space-y-5">
            {/* Company */}
            <div className="space-y-1.5 sm:space-y-2">
              <Label htmlFor="company" className="text-xs sm:text-sm font-medium flex items-center gap-1.5 sm:gap-2">
                <Building2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0 text-muted-foreground" />
                {t("modal_company_label")}
                <span className="text-[10px] sm:text-xs text-muted-foreground">
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
                className={`h-9 sm:h-10 ${errors.company ? "border-red-500" : ""}`}
              />
              {errors.company && (
                <p className="text-[10px] sm:text-xs text-red-500">
                  {errors.company?.message}
                </p>
              )}
            </div>

            {/* Position + Salary Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <div className="space-y-1.5 sm:space-y-2">
                <Label htmlFor="position" className="text-xs sm:text-sm font-medium flex items-center gap-1.5 sm:gap-2">
                  <Briefcase className="w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0 text-muted-foreground" />
                  {t("modal_position_label")}
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
                  className={`h-9 sm:h-10 ${errors.position ? "border-red-500" : ""}`}
                />
                {errors.position && (
                  <p className="text-[10px] sm:text-xs text-red-500">
                    {errors.position.message}
                  </p>
                )}
              </div>

              <div className="space-y-1.5 sm:space-y-2">
                <Label htmlFor="salary" className="text-xs sm:text-sm font-medium flex items-center gap-1.5 sm:gap-2">
                  <DollarSign className="w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0 text-muted-foreground" />
                  {t("modal_salary_label")}
                </Label>
                <Input
                  {...register("salary", {
                    required: false,
                    min: 50,
                    max: 30000,
                  })}
                  id="salary"
                  type="number"
                  className={`h-9 sm:h-10 ${errors.salary ? "border-red-500" : ""}`}
                />
                {errors.salary && (
                  <p className="text-[10px] sm:text-xs text-red-500">
                    {errors.salary.message}
                  </p>
                )}
              </div>
            </div>

            {/* Job URL */}
            <div className="space-y-1.5 sm:space-y-2">
              <Label htmlFor="jobUrl" className="text-xs sm:text-sm font-medium flex items-center gap-1.5 sm:gap-2">
                <Link2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0 text-muted-foreground" />
                {t("modal_jobUrl_label")}
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
                type="url"
                className={`h-9 sm:h-10 ${errors.jobUrl ? "border-red-500" : ""}`}
              />
              {errors.jobUrl && (
                <p className="text-[10px] sm:text-xs text-red-500">
                  {errors.jobUrl.message}
                </p>
              )}
            </div>

            {/* Location */}
            <div className="space-y-1.5 sm:space-y-2">
              <Label htmlFor="location" className="text-xs sm:text-sm font-medium flex items-center gap-1.5 sm:gap-2">
                <MapPin className="w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0 text-muted-foreground" />
                {t("modal_location_label")}
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
                className={`h-9 sm:h-10 ${errors.location ? "border-red-500" : ""}`}
              />
              {errors.location && (
                <p className="text-[10px] sm:text-xs text-red-500">
                  {errors.location.message}
                </p>
              )}
            </div>

            {/* Notes */}
            <div className="space-y-1.5 sm:space-y-2">
              <Label htmlFor="notes" className="text-xs sm:text-sm font-medium flex items-center gap-1.5 sm:gap-2">
                <FileText className="w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0 text-muted-foreground" />
                {t("modal_notes_label")}
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
                className={`min-h-[80px] sm:min-h-[100px] max-h-[150px] resize-none text-sm ${errors.notes ? "border-red-500" : ""}`}
              />
              {errors.notes && (
                <p className="text-[10px] sm:text-xs text-red-500">
                  {errors.notes.message}
                </p>
              )}
            </div>

            {/* Resume Attachment */}
            {selectedJob?.resume && (
              <div className="w-full p-3 sm:p-4 border border-border bg-muted/30 rounded-lg flex items-center justify-between gap-3 group hover:border-primary/50 transition-colors">
                <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
                  <div className="flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 bg-red-50 dark:bg-red-950/30 rounded-lg flex items-center justify-center">
                    <img src="/pdf.png" className="w-5 h-5 sm:w-6 sm:h-6" alt="PDF" />
                  </div>
                  <span className="text-xs sm:text-sm font-medium truncate">
                    {selectedJob?.resume?.title}
                  </span>
                </div>
                <a
                  download
                  href={selectedJob?.resume.resumeUrl}
                  className="flex-shrink-0 p-2 hover:bg-primary/10 rounded-md transition-colors"
                >
                  <Download className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
                </a>
              </div>
            )}
          </div>

          {/* Footer - Fixed at bottom */}
          <div className="flex flex-col-reverse sm:flex-row justify-end gap-2 sm:gap-3 pt-4 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="h-9 sm:h-10 text-xs sm:text-sm w-full sm:w-32"
            >
              {t("modal_buttons_cancel")}
            </Button>
            <Button 
              disabled={!isDirty || isSubmitting} 
              type="submit" 
              className="h-9 sm:h-10 text-xs sm:text-sm w-full sm:w-32"
            >
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