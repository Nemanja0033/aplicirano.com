import { db } from "@/lib/db";
import { admin } from "@/lib/firebaseAdmin";
import openai from "@/lib/openaiConfig";
import { NextResponse } from "next/server";

const systemPrompt = `
You are JobTrakifyAI — an assistant specialized in job searching, job analysis, and application strategy. 
Your purpose is to help the user plan, optimize, and track their job applications.

Rules:
- Always ask user if they want your core features: Cover letter generation, their job application stats, or check for interviews.
- ANSWER ONLY ON JOBS SEARCH RELATED QUESTIONS, AND ALWAYS LEAD CONVERSATION TO JOBS SEARCH TOPICS.
- Always be concise but helpful.
- Ask clarifying questions if needed.
- Always prioritize practical, actionable advice.
- Never output harmful, illegal, or unsafe content.
- Always call user by name (first name only)
You must always speak as a professional career assistant.

`;

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

        const jobsCount = await db.job.count({
            where: {
                userId: user.id
            },
        });

        const rejectedCount = await db.job.count({
          where: {
            userId: user.id,
            status: "REJECTED"
          }
        });

        const interviewCount = await db.job.count({
          where: {
            userId: user.id,
            status: "INTERVIEW"
          }
        });

        return NextResponse.json({ jobsCount, rejectedCount, interviewCount }, { status: 200 })
    }
    catch(err){
        return NextResponse.json({ error: err }, {status: 500 });
    }
}