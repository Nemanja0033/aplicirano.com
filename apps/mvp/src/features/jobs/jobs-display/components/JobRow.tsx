"use client";

import { TableCell, TableRow } from "@/src/components/ui/table";
import { getBadgeLightColor } from "@/helpers";
import { Job } from "../types";
import { useTranslations } from "next-intl";

interface JobRowProps {
  job: Job;
  index: number;
  selectedRows: string[];
  checkSingleRow: (e: any, id: string) => void;
  handleOpenModal: (job: Job) => void;
  isMobile: boolean;
  setIsStatusChanged: (changed: boolean) => void;
  checkRowsWithStatus: (data: { id: string; status: any }) => void;
}

export default function JobRow({
  job,
  index,
  selectedRows,
  checkSingleRow,
  handleOpenModal,
  isMobile,
  setIsStatusChanged,
  checkRowsWithStatus,
}: JobRowProps) {
  const t = useTranslations("JobsTable");

  return (
    <TableRow
      onDoubleClick={() => handleOpenModal(job)}
      onTouchStart={() => handleOpenModal(job)}
      className={`h-[48px] rounded-b-[0.7px] ${index % 2 === 0 ? "bg-white" : "bg-[#F6F6F6]"} ${
        selectedRows.includes(job.id) ? "" : ""
      }`}
    >
      <TableCell className="">
        <input
          className="cursor-pointer h-[18px] w-[18px] rounded-[12px]"
          aria-label="select job for action"
          data-html2canvas-ignore
          value={job.id}
          checked={selectedRows.includes(job.id)}
          onChange={(e) => checkSingleRow(e, job.id)}
          type="checkbox"
        />{" "}
        {job.title}
      </TableCell>
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
              status: e.target.value,
            });
          }}
          className={`cursor-pointer text-[13px] font-medium w-fit p-1 rounded-[6px] dark:opacity-65 ${getBadgeLightColor(
            job.status
          )} bg-accent`}
          defaultValue={job.status}
          name={`status-${job.id}`}
        >
          <option value={job.status}>
            {t(`status_${job.status.toLowerCase()}`)}
          </option>
          {job.status === "APPLIED" || job.status === "INTERVIEW" ? (
            <>
              <option value="REJECTED">{t("status_rejected")}</option>
              <option value="INTERVIEW">{t("status_interview")}</option>
              <option value="OFFER">{t("status_offer")}</option>
            </>
          ) : null}
        </select>
      </TableCell>
      <TableCell>
        {job.position ?? 'Unknown'}
      </TableCell>
      <TableCell>
        {job.location ?? 'Unknown'}
      </TableCell>
    </TableRow>
  );
}
