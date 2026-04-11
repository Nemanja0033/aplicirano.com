import { db } from "@/src/app/lib/db";
import { NextResponse } from "next/server";

export async function PATCH(req: Request) {
    try{
        const body = await req.json();
        const { jobId, priority } = body;

        if(!jobId || !priority){
            return NextResponse.json({error: "All fields are required"}, { status: 400 });
        }

        const job = await db.job.findUnique({
            where: {
                id: jobId
            }
        });

        await db.job.update({
            where: {
                id: job?.id
            },
            data: {
                priority
            }
        });

        return NextResponse.json({succes: true}, {status: 200})
    }
    catch(err){
        console.error(err);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 })
    }
}