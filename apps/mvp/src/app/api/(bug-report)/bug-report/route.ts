import { NextResponse } from "next/server";
import { admin } from "@/src/app/lib/firebaseAdmin";
import { db } from "@/src/app/lib/db";

export async function POST(req: Request) {
  try {
    // =====================
    // AUTH
    // =====================
    const authHeader = req.headers.get("Authorization");

    if (!authHeader) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const token = authHeader.split(" ")[1];
    if (!token) {
      return NextResponse.json(
        { error: "Invalid token" },
        { status: 401 }
      );
    }

    const decoded = await admin.auth().verifyIdToken(token);

    const user = await db.user.findUnique({
        where: {
            firebaseUid: decoded.uid
        }
    });

    if(!user){
        return NextResponse.json({ error: "User not found!" }, { status: 404 });
    }

    // =====================
    // BODY
    // =====================
    const { bugType, bugDescription } = await req.json();

    if (!bugType || !bugDescription || bugDescription.length < 10) {
      return NextResponse.json(
        { error: "Invalid data" },
        { status: 400 }
      );
    }

    // =====================
    // SAVE BUG REPORTA
    // =====================
    await db.bugReport.create({
      data: {
        type: `${bugType.toUpperCase()}`,
        reportedBy: user.email ,
        bugDescription: bugDescription
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("BUG REPORT ERROR:", error);
    return NextResponse.json(
      { error: "Server error" },
      { status: 500 }
    );
  }
}