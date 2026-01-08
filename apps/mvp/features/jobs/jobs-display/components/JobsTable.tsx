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
} from "@/components/ui/table";
import { useEffect, useRef, useState } from "react";
import JobFilters from "@/features/jobs/job-filters/components/FiltersToolbars";
import { Job } from "../types";
import { useFilters } from "@/features/jobs/job-filters/hooks/useFilters";
import ExportToPdf from "@/features/pdf-export/components/ExportToPdf";
import UpdateJobStatusButtons from "./UpdateJobStatusButtons";
import { useSelectRows } from "../hooks/useSelectRows";
import { FileImportForm } from "../../jobs-import/components/ImportForm";
import ManuelJobImport from "../../jobs-import/components/ManuelJobImport";
import ImportGuideModal from "../../jobs-import/components/ImportGuideModal";
import { getBadgeLightColor } from "@/helpers";
import { useIsMobile } from "@/hooks/use-mobile";
import UpdateJobsStatus from "./UpdateJobsStatus";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

interface JobsTableProps {
  jobs: Job[];
  total: number;
  page: number;
  setPage: (p: number) => void;
  pageSize: number;
  currentUser: any;
  isLoading?: boolean;
}

export function JobsTable({
  jobs,
  total,
  page,
  setPage,
  pageSize,
  currentUser,
  isLoading = false,
}: JobsTableProps) {
  const [isTableReady, setIsTableReady] = useState(false);
  const {
    filteredData: jobsToDisplay,
    isStatusChanged,
    query,
    setQuery,
    changeStatus,
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

  return (
    <main className="w-full">
      <section className="md:w-full dark:border-[#151046] dark:border-2 dark:bg-gradient-to-b from-[#100c28] to-[#010216] w-fit grid gap-5 p-5 rounded-lg shadow-md bg-white dark:bg-sidebar">
        <div className="grid gap-1 w-full border-b py-3">
          <h1 className="font-bold text-2xl">Applied Jobs</h1>
          <p className="text-muted-foreground text-sm">
            Manage and track all your job applications in one place
          </p>
        </div>

        <div className="flex items-center w-full justify-between">
          <JobFilters
            filterType="JOBS"
            changeStatus={changeStatus}
            searchTerm={query}
            isDisabled={isStatusChanged}
            handleSearch={(e: any) => setQuery(e.target.value)}
          />
        </div>

        <div className="flex w-full justify-start">
          {isTableReady && (
            <div className="flex">
              {selectedRows.length === 0 && !isStatusChanged && (
                <div className="flex gap-2">
                  <ManuelJobImport
                    currentUser={currentUser}
                    isDisabled={selectedRows.length > 0}
                  />
                  <FileImportForm
                    currentUser={currentUser}
                    type="TXT"
                    isDisabled={selectedRows.length > 0}
                  />
                  <FileImportForm
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

      <div className="mt-5 dark:bg-gradient-to-b from-[#100c28] to-[#010216] dark:border-[#151046] dark:border-2 bg-white shadow-md p-5 rounded-lg shadow-md">
        <Table ref={tableRef}>
          <TableCaption>A list of your recent job applications.</TableCaption>
          <TableHeader>
            <TableRow data-html2canvas-ignore>
              <TableHead>
                <input
                  aria-label="select row for action"
                  data-html2canvas-ignore
                  checked={
                    selectedRows.length === jobs.length && jobs.length > 0
                  }
                  onChange={(e) => checkAllRows(e, jobs)}
                  type="checkbox"
                />
              </TableHead>
              <TableHead className="w-[100px] flex items-center gap-2 font-bold">
                Company
              </TableHead>
              {!isMobile ? (
                <TableHead className="font-bold">Applied At</TableHead>
              ) : null}
              <TableHead className="font-bold">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {jobsToDisplay.map((job: Job) => (
              <TableRow
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
                    className={`cursor-pointer text-[13px] font-medium w-28 p-1 rounded-2xl dark:opacity-75 ${getBadgeLightColor(
                      job.status
                    )} bg-accent`}
                    defaultValue={job.status}
                    name={`status-${job.id}`}
                  >
                    <option value={job.status}>• {job.status}</option>
                    {job.status === "APPLIED" || job.status === "INTERVIEW" ? (
                      <>
                        <option value="REJECTED">REJECTED</option>
                        <option value="INTERVIEW">INTERVIEW</option>
                        <option value={"OFFER"}>OFFER</option>
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
                  <span className="font-medium">Total {total}</span>

                  <div className="flex items-center gap-2">
                    <Button
                      size={"sm"}
                      onClick={() => goToPage(page - 1)}
                      disabled={page <= 1 || isLoading}
                    >
                      Prev
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
                          return <span key="dots-start">...</span>;
                        }
                        if (p === pageCount - 1 && page < pageCount - 3) {
                          return <span key="dots-end">...</span>;
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
                              ? "bg-primary text-white"
                              : "border bg-primary/30"
                          }`}
                          disabled={isLoading}
                        >
                          {p}
                        </Button>
                      );
                    })}

                    <Button
                      size={"sm"}
                      onClick={() => goToPage(page + 1)}
                      disabled={page >= pageCount || isLoading}
                    >
                      Next
                    </Button>
                  </div>
                </div>
              </TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      </div>
    </main>
  );
}
