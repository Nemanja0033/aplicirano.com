import { Button } from "@/src/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card";
import { getStatsInsightsColor } from "@/helpers";
import { ArrowRight, BotIcon, ChartBar, ScrollText, User, Database } from "lucide-react";
import { useTranslations } from "next-intl";
import Link from "next/link";

// *TODO* Add two card sections: Profile stats (api credits & info), Usage stats plan usage, jobs limit, ai chat limits

export default function Home() {
  // const { user, token } = useAuthContext();
  // const { data: jobs, isLoading: isJobsLoading, isPending } = useQuery({
  //   queryKey: ['jobs'],
  //   queryFn: () => fetchJobs(token),
  //   staleTime: 60 * 5000,
  //   enabled: !!token
  // });

  // const endDate = formatISO(new Date(), { representation: "date" })
  // const startDate = formatISO(subDays(new Date(), 90), { representation: "date" })
  // const { data: stats, isLoading } = useStats(token, startDate, endDate);

  // const [statsInsight, setStatsInsight] = useState("");

  // useEffect(() => {
  //   if(stats){
  //     setStatsInsight(`${stats?.totalApplies} Total Applies`)
  //   };
  //   const interval = setInterval(() => {
  //     setStatsInsight((prev) => {
  //       if (prev.includes("Applies")) {
  //         return `${stats?.totalRejected.length} Total Rejections`;
  //       }
  //       if (prev.includes("Rejections")) {
  //         return `${stats?.totalInterviews.length} Total Interviews`;
  //       }
  //       if(prev.includes("Interviews")){
  //         return `${stats?.totalApplies} Total Applies`;
  //       }

  //       return prev
  //     });
  //   }, 4000);

  //   return () => clearInterval(interval);
  // }, [stats]);

  // const { handleSignIn } = useAuth();

  // if(isJobsLoading){
  //   return <Loader type="NORMAL" />
  // }

  // if(!token){
  //   return(
  //     <div className="w-full h-screen flex justify-center items-center">
  //       <div className="grid gap-2">
  //         {/* <span className="text-4xl font-semibold text-primary">Please Sign In To Continue</span> */}
  //         <img src="auth-anim.svg" className="w-96" alt="" />
  //         <Button onClick={handleSignIn} className="p-7">Sign In With Google</Button>
  //       </div>
  //     </div>
  //   )
  // }

  const t = useTranslations('HomePage');

  const pageContent = [
    {
      title: t("jobs_title"),
      img: "/stats.png",
      cta: t("jobs_cta"),
      url: "dashboard/jobs",
      insight: t("jobs_insight"),
      color: "text-primary",
      description: t("jobs_description"),
      icon: ScrollText,
    },
    {
      title: t("stats_title"),
      img: "/jobs.png",
      cta: t("stats_cta"),
      url: "dashboard/stats",
      insight: t("stats_insight"),
      color: "text-green-300",
      description: t("stats_description"),
      icon: ChartBar,
    },
    {
      title: t("ai_title"),
      img: "/ai.png",
      cta: t("ai_cta"),
      url: "dashboard/chatbot",
      insight: t("ai_insight"),
      color: "text-yellow-300",
      description: t("ai_description"),
      icon: BotIcon,
    },
    {
      title: t("profiles_title"),
      cta: t("profiles_cta"),
      insight: t("profiles_insight"),
      description: t("profiles_description"),
      color: "text-blue-500",
      icon: User,
      url: "dashboard/profile"
    },
    {
      url: "dashboard/resume",
      title: t("resume_title"),
      cta: t("resume_cta"),
      insight: t("resume_insight"),
      description: t("resume_description"),
      color: "text-orange-500",
      icon: Database
    }
  ];

  return (
    <main className="w-full h-full flex justify-center items-center">
      <div className="w-full md:w-6xl h-fit grid p-3 gap-5 justify-center">
        <section className='flex bg-white dark:bg-background dark:border shadow-md p-5 rounded-lg w-full justify-between'>
          <div className="grid p-1">
            <h1 className="font-bold text-2xl">{t("title")}</h1>
            <p className="text-muted-foreground text-sm">{t("subtitle")}</p>
          </div>
        </section>

        <div className="gap-5 grid md:grid-cols-3 sm:grid-cols-2">
          {pageContent.map((c) => (
            <Card className="dark:border-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <c.icon strokeWidth={1} className={`${c.color}`} /> {c.title}
                </CardTitle>
                <CardDescription>{c.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <span
                  key={c.insight}
                  className={`text-xl font-semibold ${c.color}`}
                >
                  <span className="text-2xl">{c.insight}</span>
                </span>
              </CardContent>
              <CardFooter>
                <Link href={c.url}>
                  <Button>
                    {c.cta} <ArrowRight />
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </main>
  );
}