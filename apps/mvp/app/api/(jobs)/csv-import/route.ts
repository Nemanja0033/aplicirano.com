import { db } from "@/lib/db";
import { admin } from "@/lib/firebaseAdmin";
import { NextResponse } from "next/server";
import { parse } from "csv-parse/sync";

export async function POST(req: Request){
    try{
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
      const userData = await admin.auth().getUser(decoded.uid);

      const user = await db.user.findUnique({
        where: { firebaseUid: userData.uid }
      });

      if(!user){
        return NextResponse.json({ error: "No user found" }, { status: 404 });
      }

      // File parse

      const formData = await req.formData();
      const file = formData.get("csv-file") as File;

      if (!file) {
        return NextResponse.json({ error: "No file received" }, { status: 400 });
      }

      const MAX_SIZE = 1 * 1024 * 1024;

      if (file.size > MAX_SIZE) {
        return NextResponse.json(
          { error: "File too large. Maximum allowed size is 1MB." },
          { status: 413 }
        );
      }

      const rawText = await file.text();
      const rows: any = parse(rawText, { columns: true, skip_empty_lines: true });

      if (rows.length === 0) {
        return NextResponse.json({ error: "CSV file is empty or contains no valid rows." }, { status: 400 });
      }

      const MAX_ROWS = 1000;

      if (rows.length > MAX_ROWS) {
        return NextResponse.json({ error: `Too many rows in the file. Maximum allowed is ${MAX_ROWS}.` }, { status: 400 });
      }

      for (const row of rows) {
        const { title } = row;

        await db.job.create({
            data: {
                userId: user.id,
                title: title
            }
        })
      }

      return NextResponse.json({ succes: true }, { status: 201 });
    }
    catch(err){
        console.error("Upload error:", err);
        return NextResponse.json({ error: err }, { status: 500 });
    }
}