import { useState, useMemo } from "react";

export function useFilters(data: any[], type: "JOBS" | "EMAIL") {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("");
  const [isStatusChanged, setIsStatusChanged] = useState(false);
  const [sortBy, setSortBy] = useState<"DATE_ASC" | "DATE_DESC" | null>(null);

  function changeStatus(status: string) {
    setStatus(status);
    setIsStatusChanged(true);
  }

  const filteredData = useMemo(() => {
    if (type !== "JOBS") return data;

    let result = data.filter((job: any) => {
      const matchesQuery = query
        ? job.title.toLowerCase().includes(query.toLowerCase())
        : true;

      const matchesStatus = status
        ? job.status.toLowerCase() === status.toLowerCase()
        : true;

      return matchesQuery && matchesStatus;
    });

    if (sortBy === "DATE_ASC") {
      result = [...result].sort(
        (a, b) => new Date(a.appliedAt).getTime() - new Date(b.appliedAt).getTime()
      );
    } else if (sortBy === "DATE_DESC") {
      result = [...result].sort(
        (a, b) => new Date(b.appliedAt).getTime() - new Date(a.appliedAt).getTime()
      );
    }

    return result;
  }, [data, query, status, sortBy, type]);

  return {
    query,
    status,
    isStatusChanged,
    filteredData,
    sortBy,
    setQuery,
    setIsStatusChanged,
    setSortBy,
    changeStatus,
  };
}
