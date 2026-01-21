"use client";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/src/components/ui/table";
import { useEffect, useMemo, useRef, useState } from "react";
import JobFilters from "@/src/features/jobs/job-filters/components/FiltersToolbars";
import { Job } from "../types";
import { useFilters } from "@/src/features/jobs/job-filters/hooks/useFilters";
import ExportToPdf from "@/src/features/pdf-export/components/ExportToPdf";
import UpdateJobStatusButtons from "./UpdateJobStatusButtons";
import { useSelectRows } from "../hooks/useSelectRows";
import { FileImportForm } from "../../jobs-import/components/ImportForm";
import ManuelJobImport, {
  JobImportForm,
} from "../../jobs-import/components/ManuelJobImport";
import ImportGuideModal from "../../jobs-import/components/ImportGuideModal";
import { getBadgeLightColor } from "@/helpers";
import { useIsMobile } from "@/src/hooks/use-mobile";
import UpdateJobsStatus from "./UpdateJobsStatus";
import { toast } from "sonner";
import { Button } from "@/src/components/ui/button";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/src/components/ui/alert-dialog";
import { Label } from "@/src/components/ui/label";
import { Input } from "@/src/components/ui/input";
import { useForm } from "react-hook-form";
import { AlertDialogDescription } from "@radix-ui/react-alert-dialog";
import { Calendar, Download, Loader2, ScrollText } from "lucide-react";
import { updateSingleJob } from "../../jobs-import/services/job-import-service";
import { useQueryClient } from "@tanstack/react-query";
import { useAuthContext } from "@/src/context/AuthProvider";
import { Textarea } from "@/src/components/ui/textarea";
import { useTranslations } from "next-intl";

interface JobsTableProps {
  jobs: Job[];
  total: number;
  page: number;
  setPage: (p: number) => void;
  pageSize: number;
  currentUser: any;
  isLoading?: boolean;
  setSelectedProfile: any;
  selectedProfile: any;
  query: string | null;
  setQuery: any;
  setStatus: any;
  resumes: any;
  setSelectedResume: any;
  selectedResume: any;
}

export function JobsTable({
  jobs,
  total,
  page,
  setPage,
  pageSize,
  currentUser,
  isLoading = false,
  selectedProfile,
  setSelectedProfile,
  query,
  setQuery,
  setStatus,
  resumes,
  selectedResume,
  setSelectedResume,
}: JobsTableProps) {
  const { token } = useAuthContext();
  const queryClient = useQueryClient();
  const [isTableReady, setIsTableReady] = useState(false);
  const {
    filteredData: jobsToDisplay,
    isStatusChanged,
    // query,
    // setQuery,
    // changeStatus,
    setIsStatusChanged,
  } = useFilters(jobs, "JOBS");
  const {
    checkAllRows,
    checkSingleRow,
    checkRowsWithStatus,
    resetRows,
    selectedRows,
    selectedRowsWithStatus,
  } = useSelectRows();
  const isMobile = useIsMobile();
  const tableRef = useRef<any>(null);
  const [selectedJob, setSelectedJob] = useState<any | null>(null);
  const [isJobModalOpen, setIsJobModalOpen] = useState(false);
  const searchDebounceRef = useRef<any | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting, isDirty, dirtyFields },
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

  useEffect(() => {
    if (tableRef.current) {
      setIsTableReady(true);
      console.log("user", currentUser);
    }
  }, []);

  useEffect(() => {
    if (currentUser?.jobsLimit === 0) {
      toast.warning(
        "You have reached your job application limit. Please upgrade to Pro to continue."
      );
    }
  }, [currentUser]);

  useEffect(() => {
    console.log("selected rows", selectedRows);
  }, [selectedRows]);

  const pageCount = Math.max(1, Math.ceil(total / pageSize));

  function goToPage(p: number) {
    const next = Math.max(1, Math.min(pageCount, p));
    if (next !== page) setPage(next);
  }

  function handleOpenModal(job: any) {
    setSelectedJob(job);
    setIsJobModalOpen(true);
  }

  async function handleUpdateJob(data: JobImportForm) {
    console.log("DIRTY FIELDS", dirtyFields);
    if (!isDirty) {
      console.log("NOTHING FOR UPDATE");
      setIsJobModalOpen(false);
      return;
    }

    try {
      await updateSingleJob(data, selectedJob?.id, token);
      queryClient.invalidateQueries({ queryKey: ["jobs"] });
      queryClient.invalidateQueries({ queryKey: ["stats"] });
      setIsJobModalOpen(false);
    } catch (err) {
      toast.error("Something went wrong");
    }
  }

  const t = useTranslations("JobsTable");

  return (
    <main className="w-full">
      <section className="md:w-full dark:border-[#151046] dark:border-2 dark:bg-gradient-to-b from-[#100c28] to-[#010216] w-fit grid gap-5 p-5 rounded-lg shadow-md bg-white dark:bg-sidebar">
        <div className="grid gap-1 w-full border-b py-3">
          <h1 className="font-bold text-2xl">{t("title")}</h1>
          <p className="text-muted-foreground text-sm">{t("subtitle")}</p>
        </div>

        <div className="flex items-center w-full justify-between">
          <JobFilters
            filterType="JOBS"
            changeStatus={setStatus}
            searchTerm={query as any}
            isDisabled={isStatusChanged}
            handleSearch={(e) => setQuery(e.target.value)}
          />
        </div>

        <div className="grid gap-2 w-full border-b py-3">
          <span className="text-sm text-muted-foreground">
            {t("profiles_label")}
          </span>
          <div className="flex gap-3 items-center">
            <Button
              onClick={() => setSelectedProfile(null)}
              className={`${
                selectedProfile !== null
                  ? "text-primary bg-transparent hover:text-white"
                  : "text-white bg-primary"
              } border-2 border-primary`}
            >
              {t("profiles_general")}
            </Button>
            {currentUser.profiles.map((p: any) => (
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

        <div className="grid gap-2 w-full border-b pb-3">
          <span className="text-sm text-muted-foreground">
            {t("resumes_label")}
          </span>
          <div className="flex gap-3 items-center">
            <Button
              onClick={() => setSelectedResume(null)}
              className={`${
                selectedResume !== null
                  ? "text-primary bg-transparent hover:text-white"
                  : "text-white bg-primary"
              } border-2 border-primary`}
            >
              {t("resumes_general")}
            </Button>
            {resumes?.map((r: any) => (
              <Button
                key={r.id}
                onClick={() => setSelectedResume(r.id)}
                className={`${
                  selectedResume === r.id
                    ? "text-white bg-primary hover:text-white"
                    : "text-primary bg-transparent hover:bg-primary hover:text-white"
                } border-2 border-primary`}
              >
                <ScrollText />
                {r.title}
              </Button>
            ))}
          </div>
        </div>

        <div className="flex w-full justify-start">
          {isTableReady && (
            <div className="flex">
              {selectedRows.length === 0 && !isStatusChanged && (
                <div className="flex gap-2">
                  <ManuelJobImport
                    selectedResume={selectedResume}
                    selectedProfile={selectedProfile}
                    currentUser={currentUser}
                    isDisabled={selectedRows.length > 0}
                  />
                  <FileImportForm
                    selectedResume={selectedResume}
                    selectedProfile={selectedProfile}
                    currentUser={currentUser}
                    type="TXT"
                    isDisabled={selectedRows.length > 0}
                  />
                  <FileImportForm
                    selectedResume={selectedResume}
                    selectedProfile={selectedProfile}
                    currentUser={currentUser}
                    type="CSV"
                    isDisabled={selectedRows.length > 0}
                  />
                  <ExportToPdf
                    isDisabled={selectedRows.length > 0}
                    elementRef={tableRef.current}
                  />
                  <ImportGuideModal />
                </div>
              )}

              {selectedRows.length > 0 && !isStatusChanged && (
                <UpdateJobStatusButtons
                  resetRows={resetRows}
                  selectedRows={selectedRows}
                />
              )}

              {isStatusChanged && (
                <UpdateJobsStatus
                  setIsStatusChanged={setIsStatusChanged}
                  selectedRowsWithStatus={selectedRowsWithStatus}
                />
              )}
            </div>
          )}
        </div>
      </section>

      <div
        ref={tableRef}
        className="mt-5 dark:bg-gradient-to-b from-[#100c28] to-[#010216] dark:border-[#151046] dark:border-2 bg-white shadow-md p-5 rounded-lg shadow-md"
      >
        {isLoading ? (
          <div className="w-full h-[50vh] flex items-center justify-center">
            <Loader2 className="animate-spin" />
          </div>
        ) : (
          <Table>
            <TableCaption>{t("table_caption")}</TableCaption>
            <TableHeader>
              <TableRow data-html2canvas-ignore>
                <TableHead>
                  <input
                    aria-label="select row for action"
                    data-html2canvas-ignore
                    checked={
                      selectedRows.length >= jobs.length && jobs.length > 0
                    }
                    onChange={(e) => checkAllRows(e, jobs)}
                    type="checkbox"
                  />
                </TableHead>
                <TableHead className="w-[100px] flex items-center gap-2 font-bold">
                  {t("table_columns_company")}
                </TableHead>
                {!isMobile ? (
                  <TableHead className="font-bold">
                    {t("table_columns_appliedAt")}
                  </TableHead>
                ) : null}
                <TableHead className="font-bold">
                  {t("table_columns_status")}
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {jobsToDisplay.map((job: Job) => (
                <TableRow
                  onDoubleClick={() => handleOpenModal(job)}
                  className={`${
                    selectedRows.includes(job.id)
                      ? "dark:bg-gradient-to-b from-[#100c28] to-[#010216]"
                      : ""
                  }`}
                  key={job.id}
                >
                  <TableCell>
                    <input
                      aria-label="select job for action"
                      data-html2canvas-ignore
                      value={job.id}
                      checked={selectedRows.includes(job.id)}
                      onChange={(e) => checkSingleRow(e, job.id)}
                      type="checkbox"
                    />
                  </TableCell>
                  <TableCell className="font-medium">{job.title}</TableCell>
                  <TableCell className="font-medium md:flex hidden">
                    {new Date(job.appliedAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="dark:text-black">
                    <input type="hidden" name="ids" value={job.id} />
                    <select
                      aria-label="change the status of job"
                      onChange={(e) => {
                        setIsStatusChanged(true);
                        checkRowsWithStatus({
                          id: job.id,
                          status: e.target.value as any,
                        });
                      }}
                      className={`cursor-pointer text-[13px] font-medium w-33 p-1 rounded-2xl dark:opacity-65 ${getBadgeLightColor(
                        job.status
                      )} bg-accent`}
                      defaultValue={job.status}
                      name={`status-${job.id}`}
                    >
                      <option value={job.status}>
                        • {t(`status_${job.status.toLowerCase()}`)}
                      </option>
                      {job.status === "APPLIED" ||
                      job.status === "INTERVIEW" ? (
                        <>
                          <option value="REJECTED">
                            {t("status_rejected")}
                          </option>
                          <option value="INTERVIEW">
                            {t("status_interview")}
                          </option>
                          <option value="OFFER">{t("status_offer")}</option>
                        </>
                      ) : null}
                    </select>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
            <TableFooter data-html2canvas-ignore>
              <TableRow>
                <TableCell colSpan={5}>
                  <div className="flex items-center justify-between">
                    <span className="font-medium">
                      {t("pagination_total")} {total}
                    </span>

                    <div className="flex items-center gap-2">
                      <Button
                        variant={'outline'}
                        size={"sm"}
                        onClick={() => goToPage(page - 1)}
                        disabled={page <= 1 || isLoading}
                      >
                        {t("pagination_prev")}
                      </Button>

                      {Array.from({ length: pageCount }).map((_, idx) => {
                        const p = idx + 1;
                        if (pageCount > 7) {
                          if (
                            p === 1 ||
                            p === pageCount ||
                            (p >= page - 2 && p <= page + 2)
                          ) {
                            return (
                              <Button
                                key={p}
                                onClick={() => goToPage(p)}
                                disabled={isLoading}
                              >
                                {p}
                              </Button>
                            );
                          }
                          if (p === 2 && page > 4) {
                            return (
                              <span key="dots-start">
                                {t("pagination_dotsStart")}
                              </span>
                            );
                          }
                          if (p === pageCount - 1 && page < pageCount - 3) {
                            return (
                              <span key="dots-end">
                                {t("pagination_dotsEnd")}
                              </span>
                            );
                          }
                          return null;
                        }

                        return (
                          <Button
                            key={p}
                            size={"sm"}
                            onClick={() => goToPage(p)}
                            className={`px-3 md:flex hidden py-1 rounded ${
                              p === page
                                ? "bg-primary text-white rounded-lg"
                                : "border bg-gray-300/30 hover:text-white text-primary rounded-lg"
                            }`}
                            disabled={isLoading}
                          >
                            {p}
                          </Button>
                        );
                      })}

                      <Button
                        variant={'outline'}
                        size={"sm"}
                        onClick={() => goToPage(page + 1)}
                        disabled={page >= pageCount || isLoading}
                      >
                        {t("pagination_next")}
                      </Button>
                    </div>
                  </div>
                </TableCell>
              </TableRow>
            </TableFooter>
          </Table>
        )}
      </div>

      <AlertDialog
        key={selectedJob?.id}
        onOpenChange={setIsJobModalOpen}
        open={isJobModalOpen}
      >
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
            <AlertDialogDescription>
              <span className="text-xs text-gray-400 font-normal flex gap-1 items-center">
                <Calendar size={16} strokeWidth={2} />{" "}
                {new Date(selectedJob?.appliedAt).toLocaleDateString()}
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

            <div className="grid grid-cols-2 gap-2 mt-3">
              <Button type="button" onClick={() => setIsJobModalOpen(false)}>
                {t("modal_buttons_cancel")}
              </Button>
              <Button disabled={!isDirty} type="submit">
                {isSubmitting
                  ? t("modal_buttons_submitting")
                  : t("modal_buttons_save")}
              </Button>
            </div>
          </form>
        </AlertDialogContent>
      </AlertDialog>
    </main>
  );
}
