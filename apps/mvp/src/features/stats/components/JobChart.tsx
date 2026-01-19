import React, { useEffect } from "react";
import { StatsData } from "../types";
import { Card, CardTitle, CardContent } from "@/src/components/ui/card";
import { Bar, Pie } from "react-chartjs-2";
import {
  BarElement,
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";
import { useTranslations } from "next-intl";
import { Button } from "@/src/components/ui/button";
import LockedOverlay from "./LockedOverlay";

ChartJS.register(
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  ArcElement
);

const JobChart = ({
  data,
  isPro,
}: {
  data: any | undefined;
  isPro: boolean;
}) => {
  const t = useTranslations("StatsPage");

  const positionData = {
    labels: Object.keys(data?.appliesByPosition ?? {}),
    datasets: [
      {
        label: t("chart_positions"),
        data: Object.values(data?.appliesByPosition ?? {}),
        backgroundColor: "#6366F1",
        borderRadius: 6,
      },
    ],
  };

  const locationData = {
    labels: Object.keys(data?.appliesByLocation ?? {}),
    datasets: [
      {
        label: t("chart_locations"),
        data: Object.values(data?.appliesByLocation ?? {}),
        backgroundColor: [
          "#F97316",
          "#10B981",
          "#3B82F6",
          "#EF4444",
          "#FBBF24",
        ],
      },
    ],
  };

  const salaryData = {
    labels: Object.keys(data?.appliesBySalaryRange ?? {}),
    datasets: [
      {
        label: t("chart_salary"),
        data: Object.values(data?.appliesBySalaryRange ?? {}),
        backgroundColor: ["#22D3EE", "#A78BFA", "#F87171"],
      },
    ],
  };

  const appliesPerDayData = {
    labels: Object.keys(data?.appliesPerDay ?? {}),
    datasets: [
      {
        label: t("chart_appliesPerDay"),
        data: Object.values(data?.appliesPerDay ?? {}),
        backgroundColor: "#677fed",
        borderRadius: 8,
        maxBarThickness: 60,
      },
    ],
  };

  useEffect(() => {
    console.log("USER FORM CHILD", isPro)
  }, [isPro])

  return (
    <div className="grid gap-6">
      {/* Freemium chart: prijave po danu */}
      <Card className="w-full h-auto dark:border-[#151046] dark:border-2 bg-white dark:bg-gradient-to-b from-[#100c28] to-[#010216]">
        <CardTitle className="px-4 pt-4 text-gray-800 dark:text-[#E6E9F2]">
          {t("chart_appliesPerDay_title")}
        </CardTitle>
        <CardContent className="h-72">
          <Bar
            data={appliesPerDayData}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              plugins: { legend: { display: false } },
            }}
          />
        </CardContent>
      </Card>

      {/* Premium charts */}
      <section className="grid md:grid-cols-3 gap-6">
        {[
          {
            title: t("chart_positions_title"),
            chart: (
              <Bar
                data={positionData}
                options={{
                  indexAxis: "y",
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: { legend: { display: false } },
                }}
              />
            ),
          },
          {
            title: t("chart_locations_title"),
            chart: (
              <Pie
                data={locationData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: { legend: { position: "bottom" } },
                }}
              />
            ),
          },
          {
            title: t("chart_salary_title"),
            chart: (
              <Pie
                data={salaryData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: { legend: { position: "bottom" } },
                }}
              />
            ),
          },
        ].map((item, idx) => (
          <Card
            key={idx}
            className="relative p-4 dark:border-[#151046] dark:border-2 bg-white dark:bg-gradient-to-b from-[#100c28] to-[#010216]"
          >
            <CardTitle className="text-gray-800 dark:text-[#E6E9F2]">
              {item.title}
            </CardTitle>
            <CardContent className="h-64">{item.chart}</CardContent>
            {!isPro && <LockedOverlay />}
          </Card>
        ))}
      </section>
    </div>
  );
};

export default JobChart;
