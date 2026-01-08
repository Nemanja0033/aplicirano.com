import { db } from "@/lib/db";
import { admin } from "@/lib/firebaseAdmin";
import { NextResponse } from "next/server";

export async function GET(req: Request){
  try{
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
        firebaseUid: userData.uid,
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: "User not registered" },
        { status: 401 }
      );
    };

    const profiles = await db.profile.findMany({
      where: {
        userId: user.id
      }
    });

    return NextResponse.json(profiles, { status: 200 });
  }
  catch(err){
    return NextResponse.json({ error: "Intrenal server error" }, { status: 500 });
  }
}

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

    const user = await db.user.findUnique({
      where: {
        firebaseUid: userData.uid,
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: "User not registered" },
        { status: 401 }
      );
    };

    const body = await req.json();
    const { name } = body;

    if(!name){
        return NextResponse.json({error: "Name is missing" }, { status: 400 });
    }

    if(name.length > 35){
        return NextResponse.json({ error: "Name is to long "}, { status: 400 });
    }

    const createProfile = await db.profile.create({
        data: {
            name,
            userId: user.id
        }
    });

    return NextResponse.json({ succes: true }, { status: 200 });
  } catch (err) {
    return NextResponse
  }
}
