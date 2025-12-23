"use client"
import { JobsTable } from "@/features/jobs/jobs-display/components/JobsTable";
import Loader from "@/components/Loader";
import { useQuery } from "@tanstack/react-query";
import { fetchJobs } from "@/features/jobs/jobs-display/services/jobs-display-service";
import { useFirebaseUser } from "@/hooks/useFirebaseUser";
import { useIsMobile } from "@/hooks/use-mobile";

export default function Home() {
  const { user, token, loading: isUserLoading } = useFirebaseUser();
  const { data, isLoading, isPending } = useQuery({
    queryKey: ['jobs', user?.email],
    queryFn: () => fetchJobs(token),
    staleTime: 60 * 5000,
    enabled: !!token
  });
  const isMobile = useIsMobile();

  if(isLoading || isUserLoading){
    return <Loader type="NORMAL" />
  }

  if(!token){
    return(
      <div className="w-full h-[60vh] flex justify-center items-center">
          <span className="text-gray-400 text-2xl font-semibold">Sign In To Start importing jobs</span>
      </div>
    )
  }

  // if(isMobile){
  //   return(
  //     <div className="w-full h-screen flex justify-center items-center">
  //       <h1 className="text-gray-400 text-2xl font-semibold">Please use desktop version for best experience</h1>
  //     </div>
  //   )
  // }

  return (
    <main className="w-full h-screen flex justify-center items-start overflow-auto">
      <div className="md:w-6xl p-3 w-full grid place-items-center gap-5">
        <JobsTable isLoading={isLoading} jobs={data.jobs ?? []} />
      </div>
    </main>
  );
}
