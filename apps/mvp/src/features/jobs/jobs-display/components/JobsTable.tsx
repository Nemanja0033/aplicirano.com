"use client";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/src/components/ui/table";
import { useEffect, useRef, useState } from "react";
import { useIsMobile } from "@/src/hooks/use-mobile";
import UpdateJobsStatus from "./UpdateJobsStatus";
import { toast } from "sonner";
import { Button } from "@/src/components/ui/button";
import { Loader2 } from "lucide-react";
import { useAuthContext } from "@/src/context/AuthProvider";
import { useTranslations } from "next-intl";
import EditJobModal from "./EditJobModal";
import JobRow from "./JobRow";
import TablePagination from "./TablePagination";
import JobsTableToolbar from "./JobsTableToolbar";
import { Job } from "../types";
import { useFilters } from "@/src/features/jobs/job-filters/hooks/useFilters";
import { useSelectRows } from "../hooks/useSelectRows";

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
  const [isTableReady, setIsTableReady] = useState(false);
  const {
    filteredData: jobsToDisplay,
    isStatusChanged,
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

  useEffect(() => {
    if (tableRef.current) {
      setIsTableReady(true);
    }
  }, []);

  useEffect(() => {
    if (currentUser?.jobsLimit === 0) {
      toast.warning(
        "You have reached your job application limit. Please upgrade to Pro to continue."
      );
    }
  }, [currentUser]);

  const pageCount = Math.max(1, Math.ceil(total / pageSize));

  function goToPage(p: number) {
    const next = Math.max(1, Math.min(pageCount, p));
    if (next !== page) setPage(next);
  }

  function handleOpenModal(job: any) {
    setSelectedJob(job);
    setIsJobModalOpen(true);
  }

  const t = useTranslations("JobsTable");

  return (
    <main className="w-full">
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
      />

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
                <JobRow
                  key={job.id}
                  job={job}
                  selectedRows={selectedRows}
                  checkSingleRow={checkSingleRow}
                  handleOpenModal={handleOpenModal}
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
        )}
      </div>

      <EditJobModal
        selectedJob={selectedJob}
        isOpen={isJobModalOpen}
        onOpenChange={setIsJobModalOpen}
      />
    </main>
  );
}
