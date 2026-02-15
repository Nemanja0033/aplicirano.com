import { Card, CardTitle, CardContent } from "@/src/components/ui/card";
import { FileText, Mic, X, CalendarCheck, Calendar1 } from "lucide-react";
import AnimatedNumber from "./AnimatedStats";
import { useTranslations } from "next-intl";
// Pretpostavljam da ćeš importovati LockedOverlay
import LockedOverlay from "./LockedOverlay";

const JobStatsGrid = ({
  data,
  isPro,
}: {
  data: any | undefined;
  isPro: boolean;
}) => {
  const t = useTranslations("StatsPage");

  return (
    <div className="grid gap-6 w-full p-5">
      <section className="grid w-full md:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-3">
        {/* Osnovne metrike - dostupne svima */}
        <Card className="relative grid place-items-center">
          <CardTitle className="flex items-center gap-2 text-primary">
            <FileText strokeWidth={1} /> {t("grid_totalApplied")}
          </CardTitle>
          <CardContent>
            <AnimatedNumber value={data?.totalApplies ?? 0} />
          </CardContent>
        </Card>

        <Card className="relative grid place-items-center">
          <CardTitle className="flex gap-2 items-center text-[#FB7185]">
            <X strokeWidth={1} /> {t("grid_totalRejections")}
          </CardTitle>
          <CardContent>
            <AnimatedNumber value={data?.totalRejected?.length ?? 0} />
          </CardContent>
        </Card>

        <Card className="relative grid place-items-center">
          <CardTitle className="flex gap-2 items-center text-[#98de51]">
            <Mic strokeWidth={1} /> {t("grid_totalInterviews")}
          </CardTitle>
          <CardContent>
            <AnimatedNumber value={data?.totalInterviews?.length ?? 0} />
          </CardContent>
        </Card>

        {/* Premium metrike - zaključane ako nije Pro */}
        {/* <Card className="relative grid place-items-center">
          <CardTitle className="flex gap-2 items-center text-[#237cb4]">
            <Calendar1 strokeWidth={1} /> {t("grid_avg_response_time")}
          </CardTitle>
          <CardContent>
            <AnimatedNumber value={data?.avgResponseTime ?? 0} /> /d
          </CardContent>
          {!isPro && <LockedOverlay />}
        </Card> */}

        <Card className="relative grid place-items-center">
          <CardTitle className="flex gap-2 items-center text-[#fa1f1b]">
            <Calendar1 strokeWidth={1} /> {t("grid_avg_rejection_response")}
          </CardTitle>
          <CardContent>
            <AnimatedNumber value={data?.avgRejectionResponse ?? 0} /> /d
          </CardContent>
          {!isPro && <LockedOverlay />}
        </Card>

        <Card className="relative grid place-items-center">
          <CardTitle className="flex gap-2 items-center text-[#75f399]">
            <Calendar1 strokeWidth={1} /> {t("grid_avg_interview_response")}
          </CardTitle>
          <CardContent>
            <AnimatedNumber value={data?.avgInterviewResponse ?? 0} /> /d
          </CardContent>
          {!isPro && <LockedOverlay />}
        </Card>

        <Card className="relative grid place-items-center">
          <CardTitle className="flex gap-2 items-center text-[#FBBF24]">
            <Calendar1 strokeWidth={1} /> {t("grid_totalActiveDays")}
          </CardTitle>
          <CardContent>
            <AnimatedNumber value={data?.activeDays?.length ?? 0} />
          </CardContent>
          {!isPro && <LockedOverlay />}
        </Card>

        <Card className="relative grid place-items-center">
          <CardTitle className="flex gap-2 items-center text-[#10B981]">
            <CalendarCheck strokeWidth={1} /> {t("grid_averageApplies")}
          </CardTitle>
          <CardContent>
            <AnimatedNumber value={data?.averageAppliesPerDay ?? 0} />
            <span className="font-normal text-lg">
              {t("grid_averageApplies_suffix")}
            </span>
          </CardContent>
          {!isPro && <LockedOverlay />}
        </Card>

        <Card className="relative grid place-items-center">
          <CardTitle className="flex gap-2 items-center text-[#71f66a]">
            {t("grid_interviewsRate")}
          </CardTitle>
          <CardContent>
            <AnimatedNumber value={data?.interviewsPercentage ?? 0} /> %
          </CardContent>
          {!isPro && <LockedOverlay />}
        </Card>
      </section>
    </div>
  );
};

export default JobStatsGrid;
