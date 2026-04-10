"use client";
import {
  Table,
  TableBody,
  TableCaption,
  TableHead,
  TableHeader,
  TableRow,
} from "@/src/components/ui/table";
import { useEffect, useRef, useState } from "react";
import { useIsMobile } from "@/src/hooks/use-mobile";
import { toast } from "sonner";
import { ChevronsUpDown, Loader2, ScrollText } from "lucide-react";
import { useTranslations } from "next-intl";
import EditJobModal from "./EditJobModal";
import JobRow from "./JobRow";
import TablePagination from "./TablePagination";
import JobsTableToolbar from "./JobsTableToolbar";
import { Job } from "../types";
import { useFilters } from "@/src/features/jobs/jobs-display/hooks/useFilters";
import { useSelectRows } from "../hooks/useSelectRows";
import ManuelJobImport from "../../jobs-import/components/ManuelJobImport";
import { motion } from "framer-motion";
import DeleteJobModal from "./DeleteJobModal";
import { deleteRecords } from "../services/batch-actions-service";
import { useCurrentUser } from "@/src/features/user/hooks/useCurrentUser";
import { useAuthContext } from "@/src/context/AuthProvider";
import { useQueryClient } from "@tanstack/react-query";

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
  const {
    setIsStatusChanged,
    setSortBy,
    filteredData: jobsToDisplay,
    isStatusChanged,
    sortBy,
  } = useFilters(jobs, "JOBS");

  const {
    checkAllRows,
    checkSingleRow,
    checkRowsWithStatus,
    resetRows,
    selectedRows,
    selectedRowsWithStatus,
  } = useSelectRows();
  const { token } = useAuthContext();
  const queryClient = useQueryClient();

  const t = useTranslations("JobsTable");
  const isMobile = useIsMobile();
  const tableRef = useRef<any>(null);

  const [isTableReady, setIsTableReady] = useState(false);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [isSmoothActivated, setIsSmoothActivated] = useState(true);
  const [isEditJobModalOpen, setIsEditJobModalOpen] = useState(false);
  const [isDeleteJobModalOpen, setIsDeleteJobModalOpen] = useState(false);
  const [isJobDeleting, setIsJobDeleting] = useState(false);

  const pageCount = Math.max(1, Math.ceil(total / pageSize));

  useEffect(() => {
    if (tableRef.current) {
      setIsTableReady(true);
    }
  }, []);

  useEffect(() => {
    if (currentUser?.jobsLimit === 0) {
      toast.warning(t("limit_reached"));
    }
  }, [currentUser]);

  // util func to automaticly toggle smooth mode, disabling when need and enable when needed.
  function toggleSmoothMode() {
    setIsSmoothActivated(false);
    setTimeout(() => {
      setIsSmoothActivated(true);
    }, 300);
  }

  function goToPage(p: number) {
    // Disable when user switching beetween pages to prevent UI tweak
    toggleSmoothMode();
    const next = Math.max(1, Math.min(pageCount, p));
    if (next !== page) setPage(next);
    setTimeout(() => setIsSmoothActivated(true), 300);
  }

  function handleOpenEditJobModal(job: Job) {
    setSelectedJob(job);
    setIsEditJobModalOpen(true);
  }

  function handleOpenDeleteJobModal(job: Job) {
    setSelectedJob(job);
    setIsDeleteJobModalOpen(true);
  }

  async function handleDeleteJob(jobId: string) {
    try {
      setIsJobDeleting(true);
      await deleteRecords([jobId], token as string);
      toast.success("Deleted");
      setIsDeleteJobModalOpen(false);
      queryClient.invalidateQueries({ queryKey: ["jobs"] });
      queryClient.invalidateQueries({ queryKey: ["me"] });
    } catch (err) {
      toast.error("Error");
    }
    finally{
      setIsJobDeleting(false);
    }
  }

  return (
    <main className="w-full md:py-4 md:px-8">
      <JobsTableToolbar
        query={query}
        setQuery={setQuery}
        setStatus={setStatus}
        isStatusChanged={isStatusChanged}
        setIsStatusChanged={setIsStatusChanged}
        selectedProfile={selectedProfile}
        setSelectedProfile={setSelectedProfile}
        currentUser={currentUser}
        selectedResume={selectedResume}
        setSelectedResume={setSelectedResume}
        resumes={resumes}
        isTableReady={isTableReady}
        selectedRows={selectedRows}
        resetRows={resetRows}
        selectedRowsWithStatus={selectedRowsWithStatus}
        tableRef={tableRef}
        toggleSmoothMode={toggleSmoothMode}
      />

      {jobsToDisplay.length === 0 && !isLoading ? (
        <div className="w-full h-[60vh] flex justify-center items-center">
          <div className="grid gap-2 place-items-center">
            <ScrollText
              className="font-bold"
              width={20}
              height={20}
              strokeWidth={1}
            />
            <h4 className="font-bold">{t("no_applications")}</h4>
            <p className="text-muted-foreground">{t("no_applications_body")}</p>
            <ManuelJobImport
              resumes={resumes}
              currentUser={currentUser}
              isDisabled={selectedRows.length > 0}
            />
          </div>
        </div>
      ) : (
        <div ref={tableRef} className="bg-white dark:bg-background">
          {isLoading ? (
            <div className="w-full h-[50vh] flex items-center justify-center">
              <Loader2 className="animate-spin" />
            </div>
          ) : (
            <motion.div
              key={"table"}
              layout={isSmoothActivated ? true : false}
              transition={{ duration: 0.3 }}
            >
              <Table>
                <TableCaption>{t("table_caption")}</TableCaption>
                <TableHeader>
                  <TableRow data-html2canvas-ignore>
                    <TableHead className="text-muted-foreground flex items-center gap-2">
                      <input
                        className="cursor-pointer h-[18px] w-[18px] rounded-[12px]"
                        aria-label="select row for action"
                        data-html2canvas-ignore
                        checked={
                          selectedRows.length >= jobs.length && jobs.length > 0
                        }
                        onChange={(e) => checkAllRows(e, jobs)}
                        type="checkbox"
                      />
                      {t("table_columns_company")}
                    </TableHead>
                    {!isMobile ? (
                      <TableHead className="text-muted-foreground cursor-pointer">
                        <span
                          onClick={() =>
                            sortBy === "DATE_ASC"
                              ? setSortBy("DATE_DESC")
                              : setSortBy("DATE_ASC")
                          }
                          className="flex items-center gap-1"
                        >
                          {t("table_columns_appliedAt")}
                          <ChevronsUpDown size={16} />
                        </span>
                      </TableHead>
                    ) : null}
                    <TableHead className="text-muted-foreground cursor-pointer">
                      <span className="flex items-center gap-1">
                        {t("table_columns_status")}
                      </span>
                    </TableHead>
                    <TableHead className="max-sm:hidden text-muted-foreground cursor-pointer">
                      <span className="flex items-center gap-1">
                        {t("table_columns_position")}
                      </span>
                    </TableHead>
                    <TableHead className="max-sm:hidden text-muted-foreground cursor-pointer">
                      <span className="flex items-center gap-1">
                        {t("table_columns_location")}
                      </span>
                    </TableHead>
                    <TableHead></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {jobsToDisplay.map((job: Job, i: number) => (
                    <JobRow
                      key={job.id}
                      index={i}
                      job={job}
                      selectedRows={selectedRows}
                      checkSingleRow={checkSingleRow}
                      handleOpenModal={handleOpenEditJobModal}
                      handleOpenDeleteJobModal={handleOpenDeleteJobModal}
                      isMobile={isMobile}
                      setIsStatusChanged={setIsStatusChanged}
                      checkRowsWithStatus={checkRowsWithStatus}
                    />
                  ))}
                </TableBody>
                <TablePagination
                  total={total}
                  page={page}
                  pageCount={pageCount}
                  goToPage={goToPage}
                  isLoading={isLoading}
                />
              </Table>
            </motion.div>
          )}
        </div>
      )}

      {/* Modals */}
      <EditJobModal
        selectedJob={selectedJob}
        isOpen={isEditJobModalOpen}
        onOpenChange={setIsEditJobModalOpen}
      />

      <DeleteJobModal
        isOpen={isDeleteJobModalOpen}
        onOpenChange={setIsDeleteJobModalOpen}
        selectedJob={selectedJob!}
        onConfirm={() => handleDeleteJob(selectedJob?.id as string)}
        isDeleting={isJobDeleting}
      />
    </main>
  );
}
