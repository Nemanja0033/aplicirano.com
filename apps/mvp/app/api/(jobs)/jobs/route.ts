import { db } from "@/lib/db";
import { admin } from "@/lib/firebaseAdmin";
import { NextResponse } from "next/server";

// This messy code is ok only in beta version, future scaling will require migrating whole backend to another technology.
export async function GET(req: Request){
    try{
        const authHeader = req.headers.get("Authorization");
        if (!authHeader) {
          return NextResponse.json({ error: "Missing Authorization header" }, { status: 401 });
        }

        const token = authHeader.split(" ")[1];
        if (!token) {
          return NextResponse.json({ error: "Invalid token" }, { status: 401 });
        }

        const decoded = await admin.auth().verifyIdToken(token);
        const userData = await admin.auth().getUser(decoded.uid)
        
        const user = await db.user.findUnique({
          where: { firebaseUid: userData.uid }
        });

        if(!user){
          return NextResponse.json({ error: "User dont exist!"}, { status: 404 });
        }

        const jobs = await db.job.findMany({
          where: { userId: user.id },
          orderBy: { appliedAt: "desc"}
        });

        return NextResponse.json(jobs, { status: 200});
    }
    catch(err){
        return NextResponse.json({ error: err }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
      const authHeader = req.headers.get("Authorization");
      
      if (!authHeader) {
        return NextResponse.json({ error: "Missing Authorization header" }, { status: 401 });
      }

      const token = authHeader.split(" ")[1];

      if (!token) {
        return NextResponse.json({ error: "Invalid token" }, { status: 401 });
      }
      // ** Get user data and uid
      const decoded = await admin.auth().verifyIdToken(token);
      const userData = await admin.auth().getUser(decoded.uid)

      const formData = await req.formData();
      const file = formData.get("text") as File;
  
      if (!file) {
        return NextResponse.json({ error: "No file received" }, { status: 400 });
      }

      // ** Check file size 
      const MAX_SIZE = 1 * 1024 * 1024; // 1MB

      if (file.size > MAX_SIZE) {
        return NextResponse.json(
          { error: "File too large. Maximum allowed size is 1MB." },
          { status: 413 }
        );
      }

      // ** Check file format
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

      const user = await db.user.findUnique({
        where: { firebaseUid: userData.uid }
      });

      if(!user){
        return NextResponse.json({ error: "No user found" }, { status: 404 });
      }
  
      // ** Safe parse and store jobs data.
      // ** Validate length manualy
      const text = await file.text();
      const jobs = text
        .split("-")
        .map((title) => title.trim())
        .filter((title) => title.length > 0 && title.length < 30);
      
      if(jobs.length > 50){
        return NextResponse.json({ error: "Title limts is 50 per upload!" }, { status: 400 });
      }
  
      await Promise.all(
        jobs.map((title) =>
          db.job.create({ data: { title, status: "APPLIED", userId: user.id  } })
        )
      );
  
      return NextResponse.json({ succes: true }, { status: 201 });
    } catch (err) {
      console.error("Upload error:", err);
      return NextResponse.json({ error: err }, { status: 500 });
    }
}