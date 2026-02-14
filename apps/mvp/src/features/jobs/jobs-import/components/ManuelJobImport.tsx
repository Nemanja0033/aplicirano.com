"use client";

import { useState } from "react";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
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
import { usePurchaseModal } from "@/src/store/purchase-store";

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
  selectedResume,
}: {
  selectedResume: any;
  selectedProfile: any;
  isDisabled: boolean;
  currentUser: any;
}) => {
  const t = useTranslations("JobImport");
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [date, setDate] = useState<Date | undefined>(new Date());
  const { token } = useFirebaseUser();
  const { openModal } = usePurchaseModal();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<JobImportForm>({ mode: "onSubmit" });

  const handleSubmitJob = async (data: JobImportForm) => {
    try {
      const jobObject = { ...data, appliedAt: date };
      await postSingleJob(jobObject, token, selectedProfile, selectedResume);
      queryClient.invalidateQueries({ queryKey: ["jobs"] });
      queryClient.invalidateQueries({ queryKey: ["me"] });
      queryClient.invalidateQueries({ queryKey: ["stats"] });
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
              onClick={() => {
                if (isOutOfCredits) {
                  openModal();
                  return;
                }
                setIsModalOpen(true);
              }}
            >
              {t("add_button")}
            </Button>
          </span>
        </TooltipTrigger>

        {isOutOfCredits && (
          <TooltipContent>
            {t("tooltip_out_of_credits")}
          </TooltipContent>
        )}
      </Tooltip>

      <AlertDialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <AlertDialogContent className="min-w-3xl w-full">
          <AlertDialogHeader>
            <AlertDialogTitle>{t("modal_title")}</AlertDialogTitle>
          </AlertDialogHeader>

          <form
            onSubmit={handleSubmit(handleSubmitJob)}
            className="mt-4"
          >
            {/* Scrollable body */}
            <div className="grid md:grid-cols-[1fr_300px] gap-6 max-h-[75vh] overflow-y-auto pr-2">
              
              {/* LEFT SIDE - FORM */}
              <div className="space-y-4">
                
                {/* Company */}
                <div>
                  <Label className="text-xs dark:text-gray-400">
                    {t("form_company_label")}
                  </Label>
                  <Input {...register("company")} />
                  {errors.company && (
                    <p className="text-xs text-red-500">
                      {errors.company.message}
                    </p>
                  )}
                </div>

                {/* Position + Salary */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-xs dark:text-gray-400">
                      {t("form_position_label")}
                    </Label>
                    <Input {...register("position")} />
                  </div>

                  <div>
                    <Label className="text-xs dark:text-gray-400">
                      {t("form_salary_label")}
                    </Label>
                    <Input type="number" {...register("salary")} />
                  </div>
                </div>

                {/* URL */}
                <div>
                  <Label className="text-xs dark:text-gray-400">
                    {t("form_jobUrl_label")}
                  </Label>
                  <Input {...register("jobUrl")} />
                </div>

                {/* Location */}
                <div>
                  <Label className="text-xs dark:text-gray-400">
                    {t("form_location_label")}
                  </Label>
                  <Input {...register("location")} />
                </div>

                {/* Notes */}
                <div>
                  <Label className="text-xs dark:text-gray-400">
                    {t("form_notes_label")}
                  </Label>
                  <Textarea
                    {...register("notes")}
                    className="min-h-[100px] max-h-[200px]"
                  />
                </div>
              </div>

              {/* RIGHT SIDE - CALENDAR */}
              <div className="hidden md:flex flex-col">
                <Label className="text-xs dark:text-gray-400 mb-2">
                  {t("form_appliedAt_label")}
                </Label>
                <div className="border rounded-md p-2 shadow-sm w-[280px]">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    captionLayout="dropdown"
                  />
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="flex justify-end gap-3 mt-6">
              <AlertDialogCancel>
                {t("form_cancel")}
              </AlertDialogCancel>
              <Button type="submit">
                {isSubmitting
                  ? t("form_submit_submitting")
                  : t("form_submit")}
              </Button>
            </div>
          </form>
        </AlertDialogContent>
      </AlertDialog>
    </TooltipProvider>
  );
};

export default ManuelJobImport;
