import { db } from "@/src/app/lib/db";
import { admin } from "@/src/app/lib/firebaseAdmin";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    // 1. Authorization header
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return NextResponse.json({ error: "Missing Authorization header" }, { status: 401 });
    }

    const token = authHeader.split(" ")[1];
    if (!token) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    // 2. Verify Firebase token and get user data
    const decoded = await admin.auth().verifyIdToken(token);
    const userData = await admin.auth().getUser(decoded.uid)

    const firebaseUid = decoded.uid;

    // 3. Check if user exists
    let user = await db.user.findUnique({
      where: { firebaseUid },
    });

    // 4. Create if missing
    if (!user) {
      user = await db.user.create({
        data: {
          firebaseUid,
          email: (userData.email as string),
          username: userData.displayName as string,
          isUserAcceptedTerms: true
        },
      });
    }

    return NextResponse.json({ user });
  } catch (err) {
    console.error("Auth sync error:", err);
    return NextResponse.json({ error: "Failed to sync user" }, { status: 500 });
  }
}
