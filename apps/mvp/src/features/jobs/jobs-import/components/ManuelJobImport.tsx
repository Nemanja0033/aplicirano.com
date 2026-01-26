"use client";
import { useState } from "react";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/src/components/ui/alert-dialog";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { Calendar } from "@/src/components/ui/calendar";
import { useForm } from "react-hook-form";
import { Label } from "@/src/components/ui/label";
import { postSingleJob } from "../services/job-import-service";
import { useFirebaseUser } from "@/src/hooks/useFirebaseUser";
import { useQueryClient } from "@tanstack/react-query";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider,
} from "@/src/components/ui/tooltip";
import { Textarea } from "@/src/components/ui/textarea";
import { useTranslations } from "next-intl";

export interface JobImportForm {
  company: string;
  appliedAt: Date;
  position: string;
  jobUrl: string;
  salary: number;
  location: string;
  notes: string;
}

const ManuelJobImport = ({
  isDisabled,
  currentUser,
  selectedProfile,
  selectedResume
}: {
  selectedResume: any
  selectedProfile: any;
  isDisabled: boolean;
  currentUser: any;
}) => {
  const t = useTranslations("JobImport");
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [date, setDate] = useState<Date | undefined>(new Date());
  const { token } = useFirebaseUser();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<JobImportForm>({ mode: "onSubmit" });

  const handleSubmitJob = async (data: JobImportForm) => {
    try {
      const jobObject = { ...data, appliedAt: date };
      await postSingleJob(jobObject, token, selectedProfile, selectedResume );
      queryClient.invalidateQueries({ queryKey: ["jobs"] });
      queryClient.invalidateQueries({ queryKey: ["me"] });
      queryClient.invalidateQueries({ queryKey: ["stats"]});
      setIsModalOpen(false);
    } catch (err) {
      console.error(err);
    }
  };

  const isOutOfCredits = isDisabled || currentUser.jobsLimit === 0;

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <span>
            <Button
              type="button"
              disabled={isOutOfCredits}
              onClick={() => setIsModalOpen(true)}
            >
              {t("add_button")}
            </Button>
          </span>
        </TooltipTrigger>
        {isOutOfCredits && (
          <TooltipContent className="bg-background text-black dark:text-white">
            {t("tooltip_out_of_credits")}
          </TooltipContent>
        )}
      </Tooltip>

      <AlertDialog onOpenChange={setIsModalOpen} open={isModalOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t("modal_title")}</AlertDialogTitle>
          </AlertDialogHeader>
          <form onSubmit={handleSubmit(handleSubmitJob)} className="grid gap-2">
            <div className="grid gap-2 overflow-auto h-[200px]">
              {/* Company */}
              <div className="grid gap-1">
                <Label htmlFor="company" className="text-xs dark:text-gray-400">
                  {t("form_company_label")}{" "}
                  <span className="text-xs text-primary">
                    {t("form_company_required")}
                  </span>
                </Label>
                <Input
                  {...register("company", {
                    required: {
                      value: true,
                      message: t("form_company_error_required"),
                    },
                    minLength: {
                      value: 2,
                      message: t("form_company_error_minLength"),
                    },
                    maxLength: {
                      value: 35,
                      message: t("form_company_error_maxLength"),
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

              {/* Position */}
              <div className="grid gap-1">
                <Label
                  htmlFor="position"
                  className="text-xs dark:text-gray-400"
                >
                  {t("form_position_label")}
                </Label>
                <Input
                  {...register("position", {
                    minLength: {
                      value: 2,
                      message: t("form_position_error_minLength"),
                    },
                    maxLength: {
                      value: 35,
                      message: t("form_position_error_maxLength"),
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

              {/* Salary */}
              <div className="grid gap-1">
                <Label htmlFor="salary" className="text-xs dark:text-gray-400">
                  {t("form_salary_label")}
                </Label>
                <Input
                  {...register("salary", {
                    min: {
                      value: 50,
                      message: t("form_salary_error_min"),
                    },
                    max: {
                      value: 30000,
                      message: t("form_salary_error_max"),
                    },
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

              {/* Job URL */}
              <div className="grid gap-1">
                <Label htmlFor="jobUrl" className="text-xs dark:text-gray-400">
                  {t("form_jobUrl_label")}
                </Label>
                <Input
                  {...register("jobUrl", {
                    minLength: {
                      value: 2,
                      message: t("form_jobUrl_error_minLength"),
                    },
                    maxLength: {
                      value: 250,
                      message: t("form_jobUrl_error_maxLength"),
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

              {/* Location */}
              <div className="grid gap-1">
                <Label
                  htmlFor="location"
                  className="text-xs dark:text-gray-400"
                >
                  {t("form_location_label")}
                </Label>
                <Input
                  {...register("location", {
                    maxLength: {
                      value: 250,
                      message: t("form_location_error_maxLength"),
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

              {/* Notes */}
              <div className="grid gap-1">
                <Label htmlFor="notes" className="text-xs dark:text-gray-400">
                  {t("form_notes_label")}
                </Label>
                <Textarea
                  {...register("notes", {
                    maxLength: {
                      value: 500,
                      message: t("form_notes_error_maxLength"),
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
            </div>

            {/* Applied At */}
            <Label htmlFor="appliedAt" className="text-xs dark:text-gray-400">
              {t("form_appliedAt_label")}
            </Label>
            <Calendar
              id="appliedAt"
              mode="single"
              selected={date}
              onSelect={setDate}
              className="rounded-md w-full border shadow-sm"
              captionLayout="dropdown"
            />

            {/* Buttons */}
            <div className="flex gap-2 mt-2 w-full justify-end">
              <AlertDialogCancel className="cursor-pointer">
                {t("form_cancel")}
              </AlertDialogCancel>
              <Button disabled={isSubmitting} type="submit">
                {isSubmitting ? t("form_submit_submitting") : t("form_submit")}
              </Button>
            </div>
          </form>
          <AlertDialogFooter></AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </TooltipProvider>
  );
};

export default ManuelJobImport;
