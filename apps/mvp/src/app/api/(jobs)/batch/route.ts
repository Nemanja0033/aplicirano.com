import { db } from "@/src/app/lib/db";
import { admin } from "@/src/app/lib/firebaseAdmin";
import { NextResponse } from "next/server";

export async function PATCH(req: Request) {
  try {
    const body = await req.json();
    const { recordIds, status } = body;
    const allowedValues = ["REJECTED", "INTERVIEW", "OFFER"];

    if (!recordIds || recordIds.length < 1) {
      return NextResponse.json(
        { error: "Record IDs not found" },
        { status: 400 }
      );
    }

    if (!allowedValues.includes(status)) {
      return NextResponse.json(
        { error: "Invalid status value" },
        { status: 400 }
      );
    }

    for (const id of recordIds) {
      await db.job.update({
        where: { id },
        data: { status, updatedAt: new Date() },
      });
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (err) {
    console.error("PATCH error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: Request) {
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

  const user = await db.user.findUnique({
    where: {
      firebaseUid: userData.uid
    }
  });

  if(!user){
    return NextResponse.json({ error: "User not registered "} , { status: 401 });
  }

  try {
    const { recordsIds } = await req.json();

    if (recordsIds.length === 0 || !recordsIds) {
      return NextResponse.json(
        { error: "No records to delete" },
        { status: 200 }
      );
    }

    let deletedRecords = 0;

    for (const id of recordsIds) {
      if (id !== undefined) {
        await db.job.delete({
          where: { id },
        });
        deletedRecords++;
      }
    }

    const retriveJobsCredits = await db.user.update({
      where: {
        id: user.id
      },
      data: {
        jobsLimit: {
          increment: deletedRecords
        }
      }
    });

    return NextResponse.json({ success: true, retrivedJobCredits: retriveJobsCredits, deletedRecords }, { status: 200 });
  } catch (err) {
    return NextResponse.json({ error: err }, { status: 500 });
  }
}
