import { Job } from "@prisma/client";
import { useState } from "react";

export function useSelectRows() {
  const [selectedRows, setSelectedRows] = useState<any[]>([]);
  const [selectedRowsWithStatus, setSelectedRowsWithStatus] = useState<
    {
      id: string;
      status: "INTERVIEW" | "APPLIED" | "REJECTED";
    }[]
  >([]);

  const checkAllRows = (e: any, jobs: Job[]) => {
    if (e.target.checked) {
      // dodaj sve job.id sa ove strane, ali pazi da ne dupliraš
      setSelectedRows((prev) => {
        const newIds = jobs.map((j) => j.id);
        return [...new Set([...prev, ...newIds])];
      });
    } else {
      // ukloni samo job.id sa ove strane, ostali ostaju
      setSelectedRows((prev) =>
        prev.filter((id) => !jobs.some((job) => job.id === id))
      );
    }
  };

  const checkSingleRow = (e: any, id: string) => {
    if (e.target.checked) {
      setSelectedRows((prev) => [...prev, id]);
    } else {
      setSelectedRows((prev) => prev.filter((rowId) => rowId !== id));
    }
  };

  const checkRowsWithStatus = (rowWithStatus: {
    id: string;
    status: "INTERVIEW" | "APPLIED" | "REJECTED";
  }) => {
    setSelectedRowsWithStatus((prev) => {
      const withoutCurrent = prev.filter((row) => row.id !== rowWithStatus.id);

      return [...withoutCurrent, rowWithStatus];
    });
  };

  const resetRows = () => {
    setSelectedRows([]);
  };

  return {
    checkAllRows,
    checkSingleRow,
    checkRowsWithStatus,
    resetRows,
    selectedRows,
    selectedRowsWithStatus,
  };
}
