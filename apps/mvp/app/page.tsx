"use client"
import Loader from "@/components/Loader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useAuthContext } from "@/context/AuthProvider";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { fetchJobs } from "@/features/jobs/jobs-display/services/jobs-display-service";
import { useStats } from "@/features/stats/hooks/useStats";
import { getStatsInsightsColor } from "@/helpers";
import { useQuery } from "@tanstack/react-query";
import { formatISO, subDays } from "date-fns";
import { motion } from "framer-motion";
import { ArrowRight, BotIcon, ChartBar, ScrollText } from "lucide-react"
import { useEffect, useState } from "react";

export default function Home() {
  const { user, token } = useAuthContext();
  const { data: jobs, isLoading: isJobsLoading, isPending } = useQuery({
    queryKey: ['jobs'],
    queryFn: () => fetchJobs(token),
    staleTime: 60 * 5000,
    enabled: !!token
  });

  const endDate = formatISO(new Date(), { representation: "date" })
  const startDate = formatISO(subDays(new Date(), 90), { representation: "date" })
  const { data: stats, isLoading } = useStats(token, startDate, endDate);

  const [statsInsight, setStatsInsight] = useState("");

  useEffect(() => {
    if(stats){
      setStatsInsight(`${stats?.totalApplies} Total Applies`)
    };
    const interval = setInterval(() => {
      setStatsInsight((prev) => {
        if (prev.includes("Applies")) {
          return `${stats?.totalRejected.length} Total Rejections`;
        }
        if (prev.includes("Rejections")) {
          return `${stats?.totalInterviews.length} Total Interviews`;
        }
        if(prev.includes("Interviews")){
          return `${stats?.totalApplies} Total Applies`;
        }

        return prev
      });
    }, 4000);
  
    return () => clearInterval(interval);
  }, [stats]);

  const { handleSignIn } = useAuth();
  
  if(isJobsLoading){
    return <Loader type="NORMAL" />
  }

  if(!token){
    return(
      <div className="w-full h-screen flex justify-center items-center">
        <div className="grid gap-2">
          {/* <span className="text-4xl font-semibold text-primary">Please Sign In To Continue</span> */}
          <img src="auth-anim.svg" className="w-96" alt="" />
          <Button onClick={handleSignIn} className="p-7">Sign In With Google</Button>
        </div>
      </div>
    )
  }

  const pageContent = [
    { title: "Jobs List", img: '/stats.png', cta: "Add Jobs", url: '/jobs', insight: `${jobs?.length} Tracked Jobs`, description: "Import, export your applied jobs, sort and update everything in one place.", icon: ScrollText },
    { title: "Statistics", img: "/jobs.png", cta: "See Insights", url: "/stats", insight: statsInsight, description: "Explore the statistics of your applied jobs, have insight into numbers, dates, and calculations.", icon: ChartBar },
    { title: "JobTrack Ai", img: "/ai.png", cta: "Try Ai Assistant", url: "/chatbot", insight: `JobTrakify AI boosts job wins! Need help?`, description: "Chat with our AI assistant, ask about your active applications, prepare cover letters, resumes and more.", icon: BotIcon }
  ]
  return (
  <main className="w-full h-1/2 flex justify-center">
    <div className="w-md:w-6xl p-3 gap-5 grid grid-cols-2">
    {pageContent.map((c) => (
      <Card className="dark:border-[#151046] dark:border-2 dark:bg-gradient-to-b from-[#100c28] to-[#010216] mb-3">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg"><c.icon strokeWidth={1} className="text-primary" /> {c.title}</CardTitle>
          <CardDescription>
            {c.description}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <motion.span key={c.insight} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1 }} className={`text-xl font-semibold ${getStatsInsightsColor(c.insight)}`}><span className="text-2xl" style={{ textShadow: "0 0 10px rgba(59,130,246,0.7)" }}>{c.insight}</span></motion.span>
        </CardContent>
        <CardFooter>
          <a href={c.url}>
            <Button>{c.cta} <ArrowRight /></Button>
          </a>
        </CardFooter>
      </Card>
    ))}
    </div>
  </main>
 )
}
