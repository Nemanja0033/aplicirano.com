// JobChart.tsx
import  { useEffect } from "react";
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
import LockedOverlay from "./LockedOverlay";

ChartJS.register(
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  ArcElement
);

// Mock data koji se prikazuje i kad nije pro
const mockStatsData = {
  appliesByPosition: {
    "Frontend Developer": 12,
    "Backend Developer": 8,
    "Full-Stack Engineer": 15,
    "UI/UX Designer": 6,
    "Data Scientist": 5,
  },
  appliesByLocation: {
    Belgrade: 20,
    "Novi Sad": 10,
    Remote: 15,
    Niš: 5,
    Kragujevac: 3,
  },
  appliesBySalaryRange: {
    "€500-1000": 12,
    "€1000-2000": 18,
    "€2000+": 8,
  },
  appliesPerDay: {
    "2026-01-15": 5,
    "2026-01-16": 8,
    "2026-01-17": 3,
    "2026-01-18": 10,
    "2026-01-19": 7,
    "2026-01-20": 4,
  },
};

const JobChart = ({
  data,
  isPro,
}: {
  data?: any;
  isPro: boolean;
}) => {
  const t = useTranslations("StatsPage");

  // Ako nije pro, koristi mock data
  const chartData = isPro ? data : mockStatsData;
  const appliesPerDayDataRaw = data;

  const positionData = {
    labels: Object.keys(chartData?.appliesByPosition ?? {}),
    datasets: [
      {
        label: t("chart_positions"),
        data: Object.values(chartData?.appliesByPosition ?? {}),
        backgroundColor: "#6366F1",
        borderRadius: 6,
      },
    ],
  };

  const locationData = {
    labels: Object.keys(chartData?.appliesByLocation ?? {}),
    datasets: [
      {
        label: t("chart_locations"),
        data: Object.values(chartData?.appliesByLocation ?? {}),
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
    labels: Object.keys(chartData?.appliesBySalaryRange ?? {}),
    datasets: [
      {
        label: t("chart_salary"),
        data: Object.values(chartData?.appliesBySalaryRange ?? {}),
        backgroundColor: ["#22D3EE", "#A78BFA", "#F87171"],
      },
    ],
  };

  const appliesPerDayData = {
    labels: Object.keys(appliesPerDayDataRaw?.appliesPerDay ?? {}),
    datasets: [
      {
        label: t("chart_appliesPerDay"),
        data: Object.values(appliesPerDayDataRaw?.appliesPerDay ?? {}),
        backgroundColor: "#677fed",
        borderRadius: 8,
        maxBarThickness: 60,
      },
    ],
  };

  useEffect(() => {
    console.log("USER FORM CHILD", isPro);
  }, [isPro]);

  return (
    <div className="grid gap-6 w-full p-5">
      {/* Freemium chart: prijave po danu */}
      <Card className="w-full h-auto bg-white dark:bg-background">
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
            className="relative p-4 dark:border-2 bg-white dark:bg-background"
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
