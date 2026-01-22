import { db } from "@/src/app/lib/db";
import { admin } from "@/src/app/lib/firebaseAdmin";
import { endOfDay, format, startOfDay, differenceInDays } from "date-fns";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    // --- Authorization header check ---
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return NextResponse.json(
        { error: "Missing Authorization header" },
        { status: 401 }
      );
    }

    const token = authHeader.split(" ")[1];
    if (!token) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    const decoded = await admin.auth().verifyIdToken(token);
    const userData = await admin.auth().getUser(decoded.uid);

    const user = await db.user.findUnique({
      where: { firebaseUid: userData.uid },
    });

    if (!user) {
      return NextResponse.json({ error: "User dont exist!" }, { status: 404 });
    }

    const { searchParams } = new URL(req.url);
    const start = searchParams.get("start");
    const end = searchParams.get("end");

    if (!start || !end) {
      return NextResponse.json({ error: "Missing date range" }, { status: 400 });
    }

    const jobs = await db.job.findMany({
      where: {
        userId: user.id,
        appliedAt: {
          gte: startOfDay(new Date(start)),
          lte: endOfDay(new Date(end)),
        },
      },
      orderBy: { appliedAt: "asc" },
      include: {
        resume: { select: { title: true } },
        profile: { select: { name: true } },
      },
    });

    if (jobs.length === 0) {
      return NextResponse.json(
        {
          totalApplies: 0,
          totalInterviews: 0,
          totalRejected: 0,
          averageAppliesPerDay: 0,
          appliesPerDay: {},
          activeDays: [],
          interviewsPercentage: 0,
          appliesByPosition: {},
          appliesByLocation: {},
          appliesBySalaryRange: {},
          appliesByProfile: {},
          appliesByResume: {},
          avgResponseTime: 0,
          avgDaysToInterview: 0,
          avgDaysToRejection: 0,
        },
        { status: 200 }
      );
    }

    // osnovne metrike
    const totalApplies = jobs.length;
    const totalRejected = jobs.filter((j) => j.status === "REJECTED");
    const totalInterviews = jobs.filter((j) => j.status === "INTERVIEW");

    // aktivni dani
    const allAppliedDates: Date[] = [];
    allAppliedDates.push(jobs[0].appliedAt);
    for (let i = 1; i < jobs.length; i++) {
      if (
        jobs[i].appliedAt.toISOString().split("T")[0] !==
        jobs[i - 1].appliedAt.toISOString().split("T")[0]
      ) {
        allAppliedDates.push(jobs[i].appliedAt);
      }
    }

    const averageAppliesPerDay = Math.floor(totalApplies / allAppliedDates.length);

    const activeDays = allAppliedDates.map((d) => format(d, "yyyy-MM-dd"));
    const interviewsPercentage =
      totalApplies > 0
        ? Math.floor((totalInterviews.length / totalApplies) * 100)
        : 0;

    // Freemium plan gets only applies per day graph    
    const appliesPerDay: Record<string, number> = {};
    for (const day of allAppliedDates) {
      const jobsOnDay = jobs.filter(
        (j) => j.appliedAt.toISOString().split("T")[0] === day.toISOString().split("T")[0]
      );
      appliesPerDay[format(day, "yyyy-MM-dd")] = jobsOnDay.length;
    }

    if(!user.isProUSer){
      return NextResponse.json({ appliesPerDay, totalApplies, totalRejected, totalInterviews }, { status: 200 })
    }

    // dodatne metrike
    const appliesByPosition: Record<string, number> = {Unknown: 0};
    const appliesByLocation: Record<string, number> = {Unknown: 0};
    const appliesBySalaryRange: Record<string, number> = { "<1000": 0, "1000-2000": 0, ">2000": 0 };
    const appliesByProfile: Record<string, number> = {};
    const appliesByResume: Record<string, number> = {};

    // prosecno vreme odgovora na prijavu
    let avgInterviewResponse = 0;
    let interviewWaiting = 0;
    
    let avgRejectionResponse = 0;
    let rejectionWaiting = 0;

    let avgResponseTime = 0;
    let waitingDays = 0;
    for (const job of jobs ) {
      const appliedAt = job.appliedAt;
      const updatedAt = job.updatedAt;

      const gapDays = (updatedAt.getTime() - appliedAt.getTime()) / (1000 * 60 * 60 * 24);
      job.status === "INTERVIEW" ? interviewWaiting+= gapDays : job.status === "REJECTED" ? rejectionWaiting+= gapDays : waitingDays+= gapDays
    };

    // 1. General res time, 2. Interview res time, 3. rejection res time
    avgResponseTime = Math.floor((waitingDays ?? 0) / totalApplies);
    avgInterviewResponse = Math.floor((interviewWaiting ?? 0)) / totalInterviews.length;
    avgRejectionResponse = Math.floor((rejectionWaiting ?? 0)) / totalRejected.length;

    for (const job of jobs) {
      // pozicija
      if (job.position) {
        appliesByPosition[job.position] = (appliesByPosition[job.position] || 0) + 1;
      }
      else{
        appliesByPosition["Unknown"]++; 
      }
      // lokacija
      if (job.location) {
        appliesByLocation[job.location] = (appliesByLocation[job.location] || 0) + 1;
      }
      else{
        appliesByLocation["Unknown"]++;
      }
      // plata
      if (job.salarly) {
        if (job.salarly < 1000) appliesBySalaryRange["<1000"]++;
        else if (job.salarly <= 2000) appliesBySalaryRange["1000-2000"]++;
        else appliesBySalaryRange[">2000"]++;
      }
      // profil
      if (job.profile?.name) {
        appliesByProfile[job.profile.name] = (appliesByProfile[job.profile.name] || 0) + 1;
      } else {
        appliesByProfile["General"] = (appliesByProfile["General"] || 0) + 1;
      }
      // resume
      if (job.resume?.title) {
        appliesByResume[job.resume.title] = (appliesByResume[job.resume.title] || 0) + 1;
      }
    }

    return NextResponse.json(
      {
        totalApplies,
        totalInterviews,
        totalRejected,
        averageAppliesPerDay,
        appliesPerDay,
        activeDays,
        interviewsPercentage,
        appliesByPosition,
        appliesByLocation,
        appliesBySalaryRange,
        appliesByProfile,
        appliesByResume,
        avgResponseTime,
        avgRejectionResponse,
        avgInterviewResponse
      },
      { status: 200 }
    );
  } catch (err) {
    console.error("GET /api/statistics error:", err);
    return NextResponse.json({ error: err }, { status: 500 });
  }
}