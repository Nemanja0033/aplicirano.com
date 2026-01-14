"use client";
import Loader from "@/components/Loader";
import { useAuthContext } from "@/context/AuthProvider";
import { JobsTable } from "@/features/jobs/jobs-display/components/JobsTable";
import { fetchCurrentUserData } from "@/features/user/service/user-service";
import { useDebounce } from "@/hooks/useDebounce";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

export default function JobsPage() {
  const { token } = useAuthContext();
  const queryClient = useQueryClient();
  
  const [page, setPage] = useState<number>(1);
  const PAGE_SIZE = 20;
  const [selectedProfile, setSelectedProfile] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string | null>(null);
  const debouncedSearchQuery = useDebounce(searchQuery, 500);
  const [status, setStatus] = useState<string>("");

  const {
    data: jobsResponse,
    isLoading,
    isFetching,
  } = useQuery({
    queryKey: ["jobs", page, selectedProfile, debouncedSearchQuery, status],
    queryFn: async () => {
      if (!token) return { jobs: [], total: 0 };
      const res = await fetch(`/api/jobs?page=${page}&limit=${PAGE_SIZE}&profile=${selectedProfile}&query=${searchQuery}&status=${status}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!res.ok) {
        throw new Error("Failed to fetch jobs");
      }
      return (await res.json()) as { jobs: any[]; total: number };
    },
    staleTime: 60 * 5000,
    enabled: !!token,
  });

  const { data: currentUserData, isLoading: isUserLoading } = useQuery({
    queryKey: ["me"],
    queryFn: () => fetchCurrentUserData(token as any),
    enabled: !!token,
  });

  if (isUserLoading) {
    return <Loader type="NORMAL" />;
  }

  if (!token) {
    return (
      <div className="w-full h-[60vh] flex justify-center items-center">
        <span className="text-gray-400 text-2xl font-semibold">
          Sign In To Start importing jobs
        </span>
      </div>
    );
  }

  return (
    <main className="w-full h-screen flex justify-center items-start overflow-auto">
      <div className="md:w-6xl p-3 w-full grid place-items-center gap-5">
        <JobsTable
          currentUser={currentUserData}
          isLoading={isFetching}
          jobs={jobsResponse?.jobs ?? []}
          total={jobsResponse?.total ?? 0}
          page={page}
          setPage={setPage}
          pageSize={PAGE_SIZE}
          selectedProfile={selectedProfile}
          setSelectedProfile={setSelectedProfile}
          query={searchQuery}
          setStatus={setStatus}
          setQuery={setSearchQuery}
        />
      </div>
    </main>
  );
}
