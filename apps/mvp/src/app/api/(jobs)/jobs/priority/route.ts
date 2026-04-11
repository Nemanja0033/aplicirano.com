import { db } from "@/src/app/lib/db";
import { NextResponse } from "next/server";

export async function PATCH(req: Request) {
  try {
    const body = await req.json();
    const { jobId, priority } = body;

    if(!jobId || priority === undefined){
        return NextResponse.json({error: "All fields are required"}, { status: 400 });
    }

    await db.job.update({
      where: {
        id: jobId,
      },
      data: {
        priority: priority,
      },
    });

    return NextResponse.json({ succes: true }, { status: 200 });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: err },
      { status: 500 }
    );
  }
}
