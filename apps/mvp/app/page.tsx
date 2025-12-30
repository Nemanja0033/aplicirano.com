"use client"
import Loader from "@/components/Loader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useAuth } from "@/features/auth/hooks/useAuth";
import { fetchJobs } from "@/features/jobs/jobs-display/services/jobs-display-service";
import { getStatsInsightsColor } from "@/helpers";
import { useIsMobile } from "@/hooks/use-mobile";
import { useFirebaseUser } from "@/hooks/useFirebaseUser";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { ArrowRight, BotIcon, ChartBar, ScrollText } from "lucide-react"
import Link from "next/link";
import { useEffect, useState } from "react";

export default function Home() {
  const { user, token, loading: isUserLoading } = useFirebaseUser();
  const { data: jobs, isLoading: isJobsLoading } = useQuery({
    queryKey: ['jobs', user?.email],
    queryFn: async () => {
      const res = await fetch('api/home', {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
    const data = await res.json();
    return data
    },
    staleTime: 60 * 5000,
    enabled: !!token
  });
  const isMobile = useIsMobile();
  const [statsInsight, setStatsInsight] = useState("");

  useEffect(() => {
    if(jobs){
      console.log("DATA", jobs)
      setStatsInsight(`${jobs.jobsCount} Total Applies`)
    };

    const interval = setInterval(() => {
      setStatsInsight((prev) => {
        if (prev.includes("Applies")) {
          return `${jobs.rejectedCount} Total Rejections`;
        }
        if (prev.includes("Rejections")) {
          return `${jobs.interviewCount} Total Interviews`;
        }
        if(prev.includes("Interviews")){
          return `${jobs.jobsCount} Total Applies`;
        }

        return prev
      });
    }, 4000);
  
    return () => clearInterval(interval);
  }, [jobs]);

  const { handleSignIn } = useAuth();
  
  if(isJobsLoading || isUserLoading){
    return <Loader type="NORMAL" />
  }

  if(!token){
    return(
      <div className="w-full h-[60vh] flex justify-center items-center">
        <div className="grid gap-2">
          <span className="text-gray-400 text-2xl font-semibold">Please Sign In To Continue</span>
          <Button onClick={handleSignIn} className="animate-pulse">Sign In With Google</Button>
        </div>
      </div>
    )
  }

  const pageContent = [
    { title: "Jobs List", url: '/jobs', insight: `${jobs.jobsCount} Tracked Jobs`, description: "Import, export your applied jobs, sort and update everything in one place.", icon: ScrollText },
    { title: "Statistics", url: "/stats", insight: statsInsight, description: "Explore the statistics of your applied jobs, have insight into numbers, dates, and calculations.", icon: ChartBar },
    { title: "JobTrack Ai", url: "/chatbot", insight: `JobTrakify AI boosts job wins! Need help?`, description: "Chat with our AI assistant, ask about your active applications, prepare cover letters, resumes and more.", icon: BotIcon }
  ]
  return (
  <main className="w-full h-screen flex justify-center">
    <div className="w-md:w-6xl p-3 items-start overflow-auto">
    {pageContent.map((c) => (
      <Card className="md:w-[1200px] mb-3 h-auto">
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
          <Link href={c.url}>
            <Button>Explore more <ArrowRight /></Button>
          </Link>
        </CardFooter>
      </Card>
    ))}
    </div>
  </main>
 )
}
