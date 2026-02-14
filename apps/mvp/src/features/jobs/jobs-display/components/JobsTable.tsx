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
import { toast } from "sonner";
import { ChevronsUpDown, Loader2, ScrollText } from "lucide-react";
import { useAuthContext } from "@/src/context/AuthProvider";
import { useTranslations } from "next-intl";
import EditJobModal from "./EditJobModal";
import JobRow from "./JobRow";
import TablePagination from "./TablePagination";
import JobsTableToolbar from "./JobsTableToolbar";
import { Job } from "../types";
import { useFilters } from "@/src/features/jobs/job-filters/hooks/useFilters";
import { useSelectRows } from "../hooks/useSelectRows";
import ManuelJobImport from "../../jobs-import/components/ManuelJobImport";
import { useCurrentUser } from "@/src/features/user/hooks/useCurrentUser";

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
    sortBy,
    setSortBy,
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

  // implement jobs calculation from
  const { currentUserData } = useCurrentUser();

  useEffect(() => {
    if (tableRef.current) {
      setIsTableReady(true);
    }
  }, []);

  useEffect(() => {
    if (currentUser?.jobsLimit === 0) {
      toast.warning(
        t("limit_reached")
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
            <p className="text-muted-foreground">
              {t("no_applications_body")}
            </p>
            <ManuelJobImport
              selectedResume={selectedResume}
              selectedProfile={selectedProfile}
              currentUser={currentUser}
              isDisabled={selectedRows.length > 0}
            />
          </div>
        </div>
      ) : (
        <div
          ref={tableRef}
          className="bg-white dark:bg-background"
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
                  <TableHead className="text-muted-foreground cursor-pointer">
                    <span className="flex items-center gap-1">
                      {t("table_columns_position")}
                    </span>
                  </TableHead>
                  <TableHead className="text-muted-foreground cursor-pointer">
                    <span className="flex items-center gap-1">
                      {t("table_columns_location")}
                    </span>
                  </TableHead>
                  <TableHead>
                    
                  </TableHead>
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
      )}

      <EditJobModal
        selectedJob={selectedJob}
        isOpen={isJobModalOpen}
        onOpenChange={setIsJobModalOpen}
      />
    </main>
  );
}
