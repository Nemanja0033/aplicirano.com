"use client";

import { useState } from "react";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
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
import { ScrollText, Building2, Briefcase, DollarSign, MapPin, Link2, Calendar as CalendarIcon, FileText } from "lucide-react";

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
  setSelectedProfile,
  setSelectedResume,
  resumes,
}: {
  resumes: any;
  setSelectedResume: any;
  setSelectedProfile: any;
  selectedResume: any;
  selectedProfile: any;
  isDisabled: boolean;
  currentUser: any;
}) => {
  const t = useTranslations("JobImport");
  const t2 = useTranslations("JobsTable");
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [date, setDate] = useState<Date | undefined>(new Date());
  const { token } = useFirebaseUser();
  const { openModal } = usePurchaseModal();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<JobImportForm>({ 
    mode: "onSubmit",
    defaultValues: {
      company: "",
      position: "",
      jobUrl: "",
      salary: undefined,
      location: "",
      notes: "",
    }
  });

  const handleSubmitJob = async (data: JobImportForm) => {
    try {
      const jobObject = { ...data, appliedAt: date };
      await postSingleJob(jobObject, token, selectedProfile, selectedResume);
      queryClient.invalidateQueries({ queryKey: ["jobs"] });
      queryClient.invalidateQueries({ queryKey: ["me"] });
      queryClient.invalidateQueries({ queryKey: ["stats"] });
      setIsModalOpen(false);
      reset();
      setDate(new Date());
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
              className="gap-2"
            >
              <Building2 className="w-4 h-4" />
              {t("add_button")}
            </Button>
          </span>
        </TooltipTrigger>

        {isOutOfCredits && (
          <TooltipContent>{t("tooltip_out_of_credits")}</TooltipContent>
        )}
      </Tooltip>

      <AlertDialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <AlertDialogContent className="md:min-w-7xl md:w-[95vw] min-w-xs max-h-[90vh] overflow-hidden flex flex-col">
          <AlertDialogHeader className="space-y-2">
            <AlertDialogTitle className="text-2xl font-semibold">
              {t("modal_title")}
            </AlertDialogTitle>
          </AlertDialogHeader>

          <form onSubmit={handleSubmit(handleSubmitJob)} className="flex flex-col flex-1 overflow-hidden">
            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto px-1">
              <div className="grid lg:grid-cols-[1fr_340px] gap-8">
                {/* LEFT SIDE - FORM FIELDS */}
                <div className="space-y-6">
                  {/* Company - REQUIRED */}
                  <div className="space-y-2">
                    <Label htmlFor="company" className="text-sm font-medium flex items-center gap-2">
                      <Building2 className="w-4 h-4" />
                      {t("form_company_label")}
                    </Label>
                    <Input
                      id="company"
                      placeholder={t("form_company_label").replace("*", "")}
                      {...register("company", {
                        required: t("form_company_error_required"),
                        minLength: {
                          value: 2,
                          message: t("form_company_error_minLength")
                        },
                        maxLength: {
                          value: 35,
                          message: t("form_company_error_maxLength")
                        }
                      })}
                      className={errors.company ? "border-red-500" : ""}
                    />
                    {errors.company && (
                      <p className="text-xs text-red-500">
                        {errors.company.message}
                      </p>
                    )}
                  </div>

                  {/* Position + Salary Row */}
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="position" className="text-sm font-medium flex items-center gap-2">
                        <Briefcase className="w-4 h-4" />
                        {t("form_position_label")}
                      </Label>
                      <Input
                        id="position"
                        placeholder={t("form_position_label").replace("*", "")}
                        {...register("position", {
                          minLength: {
                            value: 2,
                            message: t("form_position_error_minLength")
                          },
                          maxLength: {
                            value: 35,
                            message: t("form_position_error_maxLength")
                          }
                        })}
                        className={errors.position ? "border-red-500" : ""}
                      />
                      {errors.position && (
                        <p className="text-xs text-red-500">
                          {errors.position.message}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="salary" className="text-sm font-medium flex items-center gap-2">
                        <DollarSign className="w-4 h-4" />
                        {t("form_salary_label")}
                      </Label>
                      <Input
                        id="salary"
                        type="number"
                        placeholder={t("form_salary_label").replace("*", "")}
                        {...register("salary", {
                          valueAsNumber: true,
                          min: {
                            value: 50,
                            message: t("form_salary_error_min")
                          },
                          max: {
                            value: 30000,
                            message: t("form_salary_error_max")
                          }
                        })}
                        className={errors.salary ? "border-red-500" : ""}
                      />
                      {errors.salary && (
                        <p className="text-xs text-red-500">
                          {errors.salary.message}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Job URL */}
                  <div className="space-y-2">
                    <Label htmlFor="jobUrl" className="text-sm font-medium flex items-center gap-2">
                      <Link2 className="w-4 h-4" />
                      {t("form_jobUrl_label")}
                    </Label>
                    <Input
                      id="jobUrl"
                      type="url"
                      placeholder={t("form_jobUrl_label").replace("*", "")}
                      {...register("jobUrl", {
                        minLength: {
                          value: 10,
                          message: t("form_jobUrl_error_minLength")
                        },
                        maxLength: {
                          value: 500,
                          message: t("form_jobUrl_error_maxLength")
                        }
                      })}
                      className={errors.jobUrl ? "border-red-500" : ""}
                    />
                    {errors.jobUrl && (
                      <p className="text-xs text-red-500">
                        {errors.jobUrl.message}
                      </p>
                    )}
                  </div>

                  {/* Location */}
                  <div className="space-y-2">
                    <Label htmlFor="location" className="text-sm font-medium flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      {t("form_location_label")}
                    </Label>
                    <Input
                      id="location"
                      placeholder={t("form_location_label").replace("*", "")}
                      {...register("location", {
                        maxLength: {
                          value: 100,
                          message: t("form_location_error_maxLength")
                        }
                      })}
                      className={errors.location ? "border-red-500" : ""}
                    />
                    {errors.location && (
                      <p className="text-xs text-red-500">
                        {errors.location.message}
                      </p>
                    )}
                  </div>

                  {/* Notes */}
                  <div className="space-y-2">
                    <Label htmlFor="notes" className="text-sm font-medium flex items-center gap-2">
                      <FileText className="w-4 h-4" />
                      {t("form_notes_label")}
                    </Label>
                    <Textarea
                      id="notes"
                      placeholder={t("form_notes_label").replace("*", "")}
                      {...register("notes", {
                        maxLength: {
                          value: 500,
                          message: t("form_notes_error_maxLength")
                        }
                      })}
                      className={`min-h-[120px] resize-none ${errors.notes ? "border-red-500" : ""}`}
                    />
                    {errors.notes && (
                      <p className="text-xs text-red-500">
                        {errors.notes.message}
                      </p>
                    )}
                  </div>
                </div>

                {/* RIGHT SIDE - DATE, PROFILE & RESUME */}
                <div className="space-y-6 lg:border-l lg:pl-8">
                  {/* Applied Date */}
                  <div className="space-y-3">
                    <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide flex items-center gap-2">
                      <CalendarIcon className="w-4 h-4" />
                      {t("form_appliedAt_label")}
                    </h3>
                    <div className="border rounded-lg shadow-sm bg-card">
                      <Calendar
                        mode="single"
                        selected={date}
                        onSelect={setDate}
                        captionLayout="dropdown"
                        className="rounded-lg w-full"
                      />
                    </div>
                  </div>

                  {/* Profile Selection */}
                  <div className="space-y-3">
                    <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                      {t2("profiles_label")}
                    </h3>
                    <div className="space-y-2">
                      <Button
                        type="button"
                        onClick={() => setSelectedProfile(null)}
                        variant={selectedProfile === null ? "default" : "outline"}
                        className="w-full justify-start"
                      >
                        {t2("profiles_general")}
                      </Button>
                      {currentUser.profiles.map((p: any) => (
                        <Button
                          type="button"
                          key={p.id}
                          onClick={() => setSelectedProfile(p.id)}
                          variant={selectedProfile === p.id ? "default" : "outline"}
                          className="w-full justify-start"
                        >
                          {p.name}
                        </Button>
                      ))}
                    </div>
                  </div>

                  {/* Resume Selection */}
                  <div className="space-y-3">
                    <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                      {t2("resumes_label")}
                    </h3>
                    <div className="space-y-2">
                      <Button
                        type="button"
                        onClick={() => setSelectedResume(null)}
                        variant={selectedResume === null ? "default" : "outline"}
                        className="w-full justify-start gap-2"
                      >
                        <ScrollText className="w-4 h-4" />
                        {t2("resumes_general")}
                      </Button>
                      {resumes?.map((r: any) => (
                        <Button
                          type="button"
                          key={r.id}
                          onClick={() => setSelectedResume(r.id)}
                          variant={selectedResume === r.id ? "default" : "outline"}
                          className="w-full justify-start gap-2"
                        >
                          <ScrollText className="w-4 h-4" />
                          <span className="truncate">{r.title}</span>
                        </Button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer - Fixed at bottom */}
            <div className="flex justify-end gap-3 pt-6 border-t mt-6">
              <AlertDialogCancel disabled={isSubmitting}>
                {t("form_cancel")}
              </AlertDialogCancel>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? t("form_submit_submitting") : t("form_submit")}
              </Button>
            </div>
          </form>
        </AlertDialogContent>
      </AlertDialog>
    </TooltipProvider>
  );
};

export default ManuelJobImport;