import { db } from "@/src/app/lib/db";
import { admin } from "@/src/app/lib/firebaseAdmin";
import { NextResponse } from "next/server";

// This is messy need to be refactored
export async function POST(req: Request){
    try{
        const body = await req.json();
        const { company, jobUrl, location, position, salary, appliedAt, notes } = body.data;
        const profileId = body.profileId;
        const resumeId = body.resumeId;

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

        if(user.jobsLimit === 0){
          return NextResponse.json({ errro: "Jobs limt reached"}, { status: 400 });
        }

        if(!company){
            return NextResponse.json({ error: "Company name is required! "}, { status: 400 });
        }

        const _newJob = await db.job.create({
            data: {
                title: company,
                userId: user.id,
                appliedAt: appliedAt,
                salarly: salary === "" ? null : Number(salary),
                jobUrl,
                position: position === "" ? null : position,
                location: location === "" ? null : location,
                notes,
                profileId: profileId,
                resumeId: resumeId
            }
        });

        const decrementJobsCredit = await db.user.update({
          where: {
            id: user.id
          },
          data: {
            jobsLimit: {
              decrement: 1
            }
          }
        });

        return NextResponse.json({ succes: true, jobCreditsLeft: decrementJobsCredit.jobsLimit }, { status: 201 });
    }
    catch(err){
        console.error(err)
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}

export async function PATCH(req: Request){
  try{
    const body = await req.json();
    const jobId = body.jobId;
    const { company, jobUrl, location, position, salary, notes } = body.data;

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

    const _updateJob = await db.job.update({
      where:{
        id: jobId
      },
      data: {
        title: company,
        jobUrl,
        location,
        position,
        salarly: salary === "" ? null : Number(salary),
        notes
      }
    });

    return NextResponse.json({ updated: true }, { status: 201 });
  }
  catch(err){
    console.error(err);
    return NextResponse.json({ error: "Internal server error " }, { status: 500 });
  }
}