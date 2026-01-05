import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getStatsInsightsColor } from "@/helpers";
import { ArrowRight, BotIcon, ChartBar, ScrollText } from "lucide-react";

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

  const pageContent = [
    {
      title: "Prijave za posao",
      img: "/stats.png",
      cta: "Dodaj prijavu",
      url: "/jobs",
      insight: "Uvezi prijave iz CSV ili TXT fajla i uštedi vreme.",
      color: "text-primary",
      description:
        "Sve tvoje prijave na jednom mestu. Dodaj, uvezi, ažuriraj statuse i ostani organizovan tokom celog procesa",
      icon: ScrollText,
    },
    {
      title: "Statistika",
      img: "/jobs.png",
      cta: "See Insights",
      url: "/stats",
      insight: "Prati svoj proces efikasno",
      color: "text-green-300",
      description: "Pregled rezultata tvog traženja posla. Vidi koliko prijava si poslao, gde dobijaš odgovore i koliko proces zaista traje.",
      icon: ChartBar,
    },
    {
      title: "JobTrack Ai",
      img: "/ai.png",
      cta: "Isprobaj AI asistenta",
      url: "/chatbot",
      insight: `Vas pomocnik u potrazi za posao`,
      color: "text-yellow-300",
      description: "Tvoj AI asistent za traženje posla. Postavljaj pitanja o svojim prijavama, pripremaj cover lettere, unapredi CV i planiraj sledeće korake.",
      icon: BotIcon,
    },
  ];
  return (
    <main className="w-full h-full flex justify-center items-center">
      <div className="w-full md:w-6xl h-fit grid p-3 gap-5 justify-center">
        <section className='flex bg-white shadow-md dark:border-[#151046] dark:border-2 dark:bg-gradient-to-b from-[#100c28] to-[#010216] p-5 rounded-lg w-full justify-between'>
          <div className="grid p-1">
            <h1 className="font-bold text-2xl">Aplicirano</h1>
            <p className="text-muted-foreground text-sm">Sve prijave, statistika i pametni alati na jednom mestu.</p>
          </div>
        </section>

        <div className="gap-5 grid md:grid-cols-3">
          {pageContent.map((c) => (
            <Card className="dark:border-[#151046] dark:border-2 dark:bg-gradient-to-b from-[#100c28] to-[#010216]">
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
                <a href={c.url}>
                  <Button>
                    {c.cta} <ArrowRight />
                  </Button>
                </a>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </main>
  );
}
