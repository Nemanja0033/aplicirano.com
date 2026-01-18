import { db } from "@/src/app/lib/db";
import { admin } from "@/src/app/lib/firebaseAdmin";
import { NextResponse } from "next/server";
import { parse } from "csv-parse/sync";

// ======================================================
// POST endpoint - Upload jobs from CSV file
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

    // --- Find user in DB ---
    const user = await db.user.findUnique({
      where: { firebaseUid: userData.uid },
    });

    if (!user) {
      return NextResponse.json({ error: "No user found" }, { status: 404 });
    }

    // --- Check user job limit ---
    if (user.jobsLimit === 0) {
      return NextResponse.json(
        { error: "Jobs limit reached" },
        { status: 400 }
      );
    }

    // ======================================================
    // File handling and validation
    // ======================================================
    const formData = await req.formData();
    const file = formData.get("csv-file") as File;
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

    // --- Parse CSV content ---
    const rawText = await file.text();
    const rows: any = parse(rawText, {
      columns: true,
      skip_empty_lines: true,
    });

    if (rows.length === 0) {
      return NextResponse.json(
        { error: "CSV file is empty or contains no valid rows." },
        { status: 400 }
      );
    }

    // --- Max rows validation ---
    const MAX_ROWS = 1000;
    if (rows.length > MAX_ROWS) {
      return NextResponse.json(
        { error: `Too many rows in the file. Maximum allowed is ${MAX_ROWS}.` },
        { status: 400 }
      );
    }

    // ======================================================
    // Insert jobs into DB respecting jobsLimit
    // ======================================================
    let jobsInserted = 0;
    let creditsLeft = user.jobsLimit;

    const restData =
      profileId && profileId.trim().length > 0 && profileId !== "null"
        ? { profileId: profileId }
        : {};

    for (const row of rows) {
      if (creditsLeft <= 0) break; // stop if no credits left

      const { title } = row;

      await db.job.create({
        data: {
          userId: user.id,
          title: title,
          ...restData,
        },
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
        userJobsLimitLeft: userJobsLimit,
        jobsInserted,
        skipped: rows.length - jobsInserted, // koliko je preskočeno
      },
      { status: 201 }
    );
  } catch (err) {
    // --- Error handling ---
    console.error("Upload error:", err);
    return NextResponse.json({ error: err }, { status: 500 });
  }
}
