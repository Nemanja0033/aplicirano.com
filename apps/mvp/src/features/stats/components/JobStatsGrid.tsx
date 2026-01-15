import React from 'react';
import { Card, CardTitle, CardContent } from '@/src/components/ui/card';
import { FileText, Mic, X, CalendarCheck, Calendar1 } from 'lucide-react';
import { StatsData } from '../types';
import { motion } from 'framer-motion';
import AnimatedNumber from './AnimatedStats';
import { useTranslations } from 'next-intl';

const JobStatsGrid = ({ data }: { data: StatsData | undefined }) => {
  const t = useTranslations("StatsPage");
  return (
    <section className="grid w-full lg:grid-cols-5 gap-3">
  <Card className="grid place-items-center dark:border-[#151046] dark:border-2 dark:bg-gradient-to-b from-[#100c28] to-[#010216] dark:text-[#E6E9F2]">
    <CardTitle className="flex items-center gap-2">
      <FileText strokeWidth={1} /> {t("grid_totalApplied")}
    </CardTitle>
    <CardContent>
      <AnimatedNumber value={data?.totalApplies ?? 0} />
    </CardContent>
  </Card>

  <Card className="grid place-items-center dark:border-[#151046] dark:border-2 dark:bg-gradient-to-b from-[#100c28] to-[#010216] dark:text-[#E6E9F2]">
    <CardTitle className="flex gap-2 items-center text-[#FBBF24]">
      <Calendar1 strokeWidth={1} /> {t("grid_totalActiveDays")}
    </CardTitle>
    <CardContent>
      <AnimatedNumber value={data?.activeDays.length ?? 0} />
    </CardContent>
  </Card>

  <Card className="grid place-items-center dark:border-[#151046] dark:border-2 dark:bg-gradient-to-b from-[#100c28] to-[#010216] dark:text-[#E6E9F2]">
    <CardTitle className="flex gap-2 items-center text-[#c751de]">
      <Mic strokeWidth={1} /> {t("grid_totalInterviews")}
    </CardTitle>
    <CardContent>
      <AnimatedNumber value={data?.totalInterviews.length ?? 0} />
    </CardContent>
  </Card>

  <Card className="grid place-items-center dark:border-[#151046] dark:border-2 dark:bg-gradient-to-b from-[#100c28] to-[#010216] dark:text-[#E6E9F2]">
    <CardTitle className="flex gap-2 items-center text-[#FB7185]">
      <X strokeWidth={1} /> {t("grid_totalRejections")}
    </CardTitle>
    <CardContent>
      <AnimatedNumber value={data?.totalRejected.length ?? 0} />
    </CardContent>
  </Card>

  <Card className="grid place-items-center dark:border-[#151046] dark:border-2 dark:bg-gradient-to-b from-[#100c28] to-[#010216] dark:text-[#E6E9F2]">
    <CardTitle className="flex gap-2 items-center text-[#10B981]">
      <CalendarCheck strokeWidth={1} /> {t("grid_averageApplies")}
    </CardTitle>
    <CardContent>
      <AnimatedNumber value={data?.averageAppliesPerDay ?? 0} />
      <span className="font-normal text-lg"> {t("grid_averageApplies_suffix")}</span>
    </CardContent>
  </Card>

  <Card className="grid place-items-center dark:border-[#151046] dark:border-2 dark:bg-gradient-to-b from-[#100c28] to-[#010216] dark:text-[#E6E9F2]">
    <CardTitle className="flex gap-2 items-center text-[#F97316]">
      {t("grid_interviewsRate")}
    </CardTitle>
    <CardContent>
      <AnimatedNumber value={data?.interviewsPercentage ?? 0} /> %
    </CardContent>
  </Card>
</section>

  );
};

export default JobStatsGrid;
