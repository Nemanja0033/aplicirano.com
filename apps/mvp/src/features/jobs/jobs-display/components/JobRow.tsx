"use client";

import { TableCell, TableRow } from "@/src/components/ui/table";
import { getBadgeLightColor } from "@/helpers";
import { Job } from "../types";
import { useTranslations } from "next-intl";
import { Edit2, EllipsisVertical, Trash } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/src/components/ui/dropdown-menu";

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
      className={`h-[48px] rounded-b-[0.7px] ${index % 2 === 0 ? "bg-white dark:bg-background" : "bg-[#F6F6F6] dark:bg-accent"} ${
        selectedRows.includes(job.id) ? "" : ""
      }`}
    >
      <TableCell className="">
        <div className="flex items-center gap-3">
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
        </div>
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
          className={`cursor-pointer text-[13px] font-medium w-30 p-1 rounded-[6px] dark:opacity-65 ${getBadgeLightColor(
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
      <TableCell>{job.position ?? t("unknown")}</TableCell>
      <TableCell>{job.location ?? t("unknown")}</TableCell>
      <TableCell>
        <DropdownMenu>
          <DropdownMenuTrigger>
            <button className="text-muted-foreground cursor-pointer">
              <EllipsisVertical size={16} />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => handleOpenModal(job)} className="cursor-pointer"><Edit2 /> Edit application</DropdownMenuItem>
            {/* <DropdownMenuItem className="cursor-pointer"><Trash /> Delete application</DropdownMenuItem> */}
          </DropdownMenuContent>
        </DropdownMenu>
      </TableCell>
    </TableRow>
  );
}
