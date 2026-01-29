import { db } from "@/src/app/lib/db";
import { admin } from "@/src/app/lib/firebaseAdmin";
import { supabaseStorage } from "@/src/app/lib/supabaseServer";
import { NextResponse } from "next/server";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_MIME = ["application/pdf"];

export async function POST(req: Request) {
  try {
    // --- Auth header ---
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

    // --- Verify Firebase token ---
    const decoded = await admin.auth().verifyIdToken(token);

    const user = await db.user.findUnique({
      where: { firebaseUid: decoded.uid },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    if (user.resumeLimit === 0) {
      return NextResponse.json(
        { error: "Resumes limit reached" },
        { status: 400 }
      );
    }

    // --- Parse multipart form ---
    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const cvContent = formData.get("resume_content");
    const title = formData.get("title");
    const selectedProfile = formData.get("profile");

    if (!file || !title) {
      return NextResponse.json(
        { error: "No file or title provided" },
        { status: 400 }
      );
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: "File size exceeds 5MB" },
        { status: 400 }
      );
    }

    // --- File path ---
    const filePath = `users/${user.id}/${title}.pdf`;
    const arrayBuffer = await file.arrayBuffer();

    const { error: uploadError } = await supabaseStorage.storage
      .from("resumes")
      .upload(filePath, arrayBuffer, {
        contentType: "application/pdf",
        upsert: true,
      });

    if (uploadError) {
      console.error(uploadError);
      return NextResponse.json({ error: "Upload failed" }, { status: 500 });
    }

    // --- Public URL ---
    const { data } = supabaseStorage.storage
      .from("resumes")
      .getPublicUrl(filePath);

    if (!selectedProfile || selectedProfile === "null") {
      await db.resume.create({
        data: {
          userId: user.id,
          title: title as string,
          resumeUrl: data.publicUrl,
          fileSize: String(file.size),
          resumeContent: cvContent as string
        },
      });

      // Decrement resume credit
      const resumeCredits = await db.user.update({
        where: {
          id: user.id,
        },
        data: {
          resumeLimit: {
            decrement: 1,
          },
        },
      });

      return NextResponse.json(
        { created: true, publicUrl: data.publicUrl, resumeCredits },
        { status: 201 }
      );
    }

    await db.resume.create({
      data: {
        userId: user.id,
        title: title as string,
        profileId: selectedProfile as string,
        resumeUrl: data.publicUrl,
        fileSize: String(file.size),
      },
    });

    // Decrement resume credit
    const resumeCredits = await db.user.update({
      where: {
        id: user.id,
      },
      data: {
        resumeLimit: {
          decrement: 1,
        },
      },
    });

    return NextResponse.json(
      { created: true, publicUrl: data.publicUrl, resumeCredits },
      { status: 201 }
    );
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function GET(req: Request) {
  try {
    // --- Auth header ---
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

    // --- Verify Firebase token ---
    const decoded = await admin.auth().verifyIdToken(token);

    const user = await db.user.findUnique({
      where: { firebaseUid: decoded.uid },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const url = new URL(req.url);
    const profile = url.searchParams.get("profile");

    if (!profile || profile === "null") {
      const resumes = await db.resume.findMany({
        where: {
          userId: user.id,
        },
      });

      return NextResponse.json(resumes, { status: 200 });
    }

    const resumes = await db.resume.findMany({
      where: {
        profileId: profile,
      },
    });

    return NextResponse.json(resumes, { status: 200 });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: Request) {
  try {
    // --- Auth header ---
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

    // --- Verify Firebase token ---
    const decoded = await admin.auth().verifyIdToken(token);

    const user = await db.user.findUnique({
      where: { firebaseUid: decoded.uid },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const body = await req.json();
    const { cvToDeleteId } = body;

    await db.resume.delete({
      where: {
        id: cvToDeleteId
      }
    });

    return NextResponse.json({ succes: true }, { status: 200 });
  } catch (err) {
    return NextResponse.json({ error: "Internal server error "}, { status: 500 });
  }
}
