import { db } from "@/lib/db";
import { admin } from "@/lib/firebaseAdmin";
import { NextResponse } from "next/server";

// ======================================================
// NOTE: This messy code is ok only in beta version,
// future scaling will require migrating whole backend
// to another technology.
// ======================================================

// ======================================================
// GET endpoint - Fetch jobs for authenticated user with pagination
// ======================================================
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

    // --- Extract token ---
    const token = authHeader.split(" ")[1];
    if (!token) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    // --- Verify token and get user data ---
    const decoded = await admin.auth().verifyIdToken(token);
    const userData = await admin.auth().getUser(decoded.uid);

    // --- Find user in DB ---
    const user = await db.user.findUnique({
      where: { firebaseUid: userData.uid },
    });

    if (!user) {
      return NextResponse.json({ error: "User dont exist!" }, { status: 404 });
    }

    // --- Parse pagination params ---
    const url = new URL(req.url);
    const pageParam = url.searchParams.get("page");
    const limitParam = url.searchParams.get("limit");
    const selectedProfile = url.searchParams.get("profile");


    const page = Math.max(1, Number(pageParam ?? 1));
    const limit = Math.min(100, Math.max(1, Number(limitParam ?? 20))); // cap limit to 100

    const skip = (page - 1) * limit;

    console.log("PROFILE", selectedProfile)
    // Workaround fix for issue when querying the jobs with null profile
    if(!selectedProfile || selectedProfile === "null"){
      const [total, jobs] = await Promise.all([
        db.job.count({ where: { userId: user.id } }),
        db.job.findMany({
          where: {
            userId: user.id,
          },
          orderBy: { appliedAt: "desc" },
          skip,
          take: limit,
        }),
      ]);

      console.log("JOBS FORM WORKAROUND", jobs)
      
      // --- Return paginated jobs and total ---
      return NextResponse.json({ jobs, total }, { status: 200 });
    }

    // --- Fetch total count and paginated jobs for user ---
    const [total, jobs] = await Promise.all([
      db.job.count({ where: { userId: user.id, profileId: selectedProfile } }),
      db.job.findMany({
        where: {
          userId: user.id,
          profileId: selectedProfile 
        },
        orderBy: { appliedAt: "desc" },
        skip,
        take: limit,
      }),
    ]);

    // --- Return paginated jobs and total ---
    return NextResponse.json({ jobs, total }, { status: 200 });
  } catch (err) {
    console.error("GET /api/jobs error:", err);
    return NextResponse.json({ error: err }, { status: 500 });
  }
}


// ======================================================
// POST endpoint - Upload jobs from TXT file
// ======================================================
export async function POST(req: Request) {
  try {
    // --- Authorization header check ---
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return NextResponse.json(
        { error: "Missing Authorization header" },
        { status: 401 }
      );
    }

    // --- Extract token ---
    const token = authHeader.split(" ")[1];
    if (!token) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    // --- Verify token and get user data ---
    const decoded = await admin.auth().verifyIdToken(token);
    const userData = await admin.auth().getUser(decoded.uid);

    // --- Get uploaded file ---
    const formData = await req.formData();
    const file = formData.get("text") as File;
    const profileId = formData.get("profileId") as string;

    if (!file) {
      return NextResponse.json({ error: "No file received" }, { status: 400 });
    }

    // --- File size validation ---
    const MAX_SIZE = 1 * 1024 * 1024; // 1MB
    if (file.size > MAX_SIZE) {
      return NextResponse.json(
        { error: "File too large. Maximum allowed size is 1MB." },
        { status: 413 }
      );
    }

    // --- File format validation ---
    const allowedMime = ["text/plain"];
    const allowedExtensions = [".txt"];
    const fileName = file.name.toLowerCase();
    const isValidMime = allowedMime.includes(file.type);
    const isValidExt = allowedExtensions.some((ext) => fileName.endsWith(ext));

    if (!isValidMime || !isValidExt) {
      return NextResponse.json(
        { error: "Invalid file format. Only .txt files are allowed." },
        { status: 400 }
      );
    }

    // --- Find user in DB ---
    const user = await db.user.findUnique({
      where: { firebaseUid: userData.uid },
    });

    if (!user) {
      return NextResponse.json({ error: "No user found" }, { status: 404 });
    }

    // --- Check for jobs limit ---
    if (user.jobsLimit === 0) {
      return NextResponse.json(
        { error: "Jobs limit reached" },
        { status: 400 }
      );
    }

    // --- Parse file content and validate ---
    const text = await file.text();
    const jobs = text
      .split("-")
      .map((title) => title.trim())
      .filter((title) => title.length > 0 && title.length < 30);

    if (jobs.length > 50) {
      return NextResponse.json(
        { error: "Title limit is 50 per upload!" },
        { status: 400 }
      );
    }

    // ======================================================
    // Insert jobs respecting jobsLimit
    // ======================================================
    let jobsInserted = 0;
    let creditsLeft = user.jobsLimit;

    for (const title of jobs) {
      if (creditsLeft <= 0) break;

      await db.job.create({
        data: { title, status: "APPLIED", userId: user.id, profileId: profileId },
      });

      jobsInserted++;
      creditsLeft--;
    }

    // --- Update user job limit ---
    let userJobsLimit = user.jobsLimit;
    if (jobsInserted > 0) {
      const updatedUser = await db.user.update({
        where: { id: user.id },
        data: {
          jobsLimit: {
            decrement: jobsInserted,
          },
        },
      });

      userJobsLimit = updatedUser.jobsLimit;
    }

    // --- Return success response ---
    return NextResponse.json(
      {
        success: true,
        jobsInserted,
        skipped: jobs.length - jobsInserted,
        jobsLimit: userJobsLimit,
      },
      { status: 201 }
    );
  } catch (err) {
    // --- Error handling ---
    console.error("Upload error:", err);
    return NextResponse.json({ error: err }, { status: 500 });
  }
}