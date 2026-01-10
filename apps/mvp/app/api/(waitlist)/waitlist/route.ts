import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(req: Request){
    try{
        const body = await req.json();
        const { waitlist_email_sendedr } = body;

        if(!waitlist_email_sendedr){
            return NextResponse.json({ error: "Email is required" }, { status: 400 });
        }

        const emailExist = await db.waitlistEmail.findUnique({
            where: {
                email: waitlist_email_sendedr
            }
        });

        if(emailExist){
            return NextResponse.json({ error: "Email is already on the waitlist!"}, { status: 400 });
        }

        const addToWaitlist = await db.waitlistEmail.create({
            data: {
                email: waitlist_email_sendedr
            }
        });

        return NextResponse.json({ succes: true }, { status: 200 });
    }
    catch(err){
        console.error(err);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}