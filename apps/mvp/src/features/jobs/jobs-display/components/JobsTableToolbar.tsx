"use client";

import { Button } from "@/src/components/ui/button";
import JobFilters from './FiltersToolbars'; 
import ManuelJobImport from "../../jobs-import/components/ManuelJobImport";
import { FileImportForm } from "../../jobs-import/components/ImportForm";
import ExportToPdf from "@/src/features/pdf-export/components/ExportToPdf";
import UpdateJobStatusButtons from "./UpdateJobStatusButtons";
import UpdateJobsStatus from "./UpdateJobsStatus";
import { useTranslations } from "next-intl";
import { AnimatePresence } from "framer-motion";

interface JobsTableToolbarProps {
  query: string | null;
  setQuery: any;
  setStatus: any;
  isStatusChanged: boolean;
  setIsStatusChanged: (changed: boolean) => void;
  selectedProfile: any;
  setSelectedProfile: any;
  currentUser: any;
  selectedResume: any;
  setSelectedResume: any;
  resumes: any;
  isTableReady: boolean;
  selectedRows: string[];
  resetRows: () => void;
  selectedRowsWithStatus: any[];
  tableRef: any;
  toggleSmoothMode: any
}

export default function JobsTableToolbar({
  query,
  setQuery,
  setStatus,
  isStatusChanged,
  setIsStatusChanged,
  selectedProfile,
  setSelectedProfile,
  currentUser,
  selectedResume,
  setSelectedResume,
  resumes,
  isTableReady,
  selectedRows,
  resetRows,
  selectedRowsWithStatus,
  tableRef,
  toggleSmoothMode
}: JobsTableToolbarProps) {
  const t = useTranslations("JobsTable");

  return (
    <section className="md:w-full w-fit grid gap-5 bg-white dark:bg-sidebar">
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

      {/* Resumes */}
      {/* <div className="grid gap-2 w-full border-b pb-3">
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
      </div> */}

      <div
        className={`md:flex grid gap-5 md:gap-0 mt-2 items-center w-full md:justify-end`}
      >
        <div className="grid gap-2 w-full">
          {/* <span className="text-sm text-muted-foreground">
            {t("profiles_label")}
          </span> */}
          <div className="flex gap-3 items-center">
            <Button
              onClick={() => {setSelectedProfile(null); toggleSmoothMode();}}
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
                onClick={() => {setSelectedProfile(p.id); toggleSmoothMode()}}
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
        {/* {isTableReady && ( */}
        <div className="flex">
          {selectedRows.length === 0 && !isStatusChanged && (
            <div className="flex gap-2">
              {/* <FileImportForm
                  selectedResume={selectedResume}
                  selectedProfile={selectedProfile}
                  currentUser={currentUser}
                  type="TXT"
                  isDisabled={selectedRows.length > 0}
                /> */}

              <ExportToPdf
                isDisabled={selectedRows.length > 0}
                elementRef={tableRef.current}
              />
              <FileImportForm
                selectedResume={selectedResume}
                selectedProfile={selectedProfile}
                currentUser={currentUser}
                isDisabled={selectedRows.length > 0}
              />

              <ManuelJobImport
                currentUser={currentUser}
                resumes={resumes}
                isDisabled={selectedRows.length > 0}
              />
              {/* <ImportGuideModal /> */}
            </div>
          )}
        </div>
        {/* )} */}
      </div>

      {/* TODO isStatusChanged is bad for this conditional render, consider some other state */}
      <div className="mb-5">
        {isStatusChanged && (
          <UpdateJobsStatus
            setIsStatusChanged={setIsStatusChanged}
            selectedRowsWithStatus={selectedRowsWithStatus}
          />
        )}

        {selectedRows.length > 0 && !isStatusChanged && (
          <UpdateJobStatusButtons
            setIsStatusChanged={setIsStatusChanged}
            resetRows={resetRows}
            selectedRows={selectedRows}
          />
        )}
      </div>
    </section>
  );
}
