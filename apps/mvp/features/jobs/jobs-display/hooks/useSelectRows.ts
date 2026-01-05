import { Job } from "@prisma/client";
import { useState } from "react";

export function useSelectRows() {
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const [selectedRowsWithStatus, setSelectedRowsWithStatus] = useState<{
    id: string;
    status: "INTERVIEW" | "APPLIED" | "REJECTED";
  }[]>([]);

  const checkAllRows = (e: any, jobs: Job[]) => {
    if (e.target.checked) {
      setSelectedRows(jobs.map((j) => j.id));
    } else {
      setSelectedRows([]);
    }
  };

  const checkSingleRow = (e: any, id: string) => {
    if (e.target.checked) {
      setSelectedRows((prev) => [...prev, id]);
    } else {
      setSelectedRows((prev) => prev.filter((rowId) => rowId !== id));
    }
  };

  const checkRowsWithStatus = (rowWithStatus: { id: string, status: "INTERVIEW" | "APPLIED" | "REJECTED" }) => {
    setSelectedRowsWithStatus((prev) => {
      const withoutCurrent = prev.filter((row) => row.id !== rowWithStatus.id);
  
      return [...withoutCurrent, rowWithStatus];
    });
  };

  return {
    checkAllRows,
    checkSingleRow,
    checkRowsWithStatus,
    selectedRows,
    selectedRowsWithStatus
  };
}
