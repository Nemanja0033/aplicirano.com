"use client";
import { formatISO, subDays } from "date-fns";
import { useStats } from "@/src/features/stats/hooks/useStats";
import { useState } from "react";
import Loader from "@/src/components/Loader";
import JobChart from "@/src/features/stats/components/JobChart";
import JobStatsGrid from "@/src/features/stats/components/JobStatsGrid";
import StatsNav from "@/src/features/stats/components/StatsNav";
import { useFirebaseUser } from "@/src/hooks/useFirebaseUser";
import { useIsMobile } from "@/src/hooks/use-mobile";

const ranges = {
  "7d": 7,
  "30d": 30,
  "90d": 90,
} as const;

export default function StatsPage() {
  const { token, loading: isUserLoading } = useFirebaseUser();
  const [range, setRange] = useState<keyof typeof ranges>("90d");
  const endDate = formatISO(new Date(), { representation: "date" });
  const startDate = formatISO(subDays(new Date(), ranges[range]), {
    representation: "date",
  });
  const { data, isLoading } = useStats(token, startDate, endDate);
  const isMobile = useIsMobile();

  if (isLoading || isUserLoading) {
    return <Loader type="NORMAL" />;
  }

  if (!token) {
    return (
      <div className="w-full h-[60vh] flex justify-center items-center">
        <span className="text-gray-400 text-2xl font-semibold">
          Sign in to see you recent application statistics.
        </span>
      </div>
    );
  }

  // if(isMobile){
  //     return(
  //       <div className="w-full h-screen flex justify-center items-center">
  //         <h1 className="text-gray-400 text-2xl font-semibold">Please use desktop version for best experience</h1>
  //       </div>
  //     )
  // }

  // useEffect(() => {
  //   if (!token) {
  //     location.href = "auth";
  //   }
  // }, []);

  return (
    <main className="w-full h-full flex justify-center items-center">
      <section className="md:w-6xl p-3 w-xs grid place-items-center gap-5">
        <StatsNav
          onChange={(e) => setRange(e.target.value as keyof typeof ranges)}
          range={range}
        />
        <JobChart data={data} />
        <JobStatsGrid data={data} />
      </section>
    </main>
  );
}
function useEffect(arg0: () => void, arg1: never[]) {
    throw new Error("Function not implemented.");
}

