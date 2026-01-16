import { db } from "@/src/app/lib/db";
import { admin } from "@/src/app/lib/firebaseAdmin";
import openai from "@/src/app/lib/openaiConfig";
import { endOfDay, startOfDay } from "date-fns";
import { NextResponse } from "next/server";

// *This is need to be refactored, but soon i will migrate whole backend to other technology.

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

    const decoded = await admin.auth().verifyIdToken(token);
    const userData = await admin.auth().getUser(decoded.uid)

    const { message } = await req.json();

    if (!message) {
      return NextResponse.json(
        { error: "Missing 'message' field" },
        { status: 400 }
      );
    }

    const user = await db.user.findUnique({
        where: { firebaseUid: userData.uid }
    })

    if(!user){
      return NextResponse.json({ error: "User not registered" }, { status: 401 });
    }

    if(user.apiCredits === 0){
      return NextResponse.json({ error: "You reached a ai chatbot limit" }, { status: 400 })
    }

    const jobs = await db.job.findMany({
      where: { 
        userId: user?.id,
        status: "INTERVIEW"
       }
    })

    const currentDate = new Date();
    const pastWeekDate = new Date(currentDate);
    pastWeekDate.setDate(currentDate.getDate() - 30);

    const start = pastWeekDate.toISOString().split('T')[0];
    const end = currentDate.toISOString().split('T')[0];

    const jobToAnalyze = await db.job.findMany({
      where: {
        userId: user?.id,
        appliedAt: {
            gte: startOfDay(start),
            lte: endOfDay(end)
        }
    },
    })

    const seriazliedJobsInterviews = JSON.stringify(jobs, null, 2);
    const serializedJobToAnalyze = JSON.stringify(jobToAnalyze, null, 2);

    const response = await openai.chat.completions.create({
      model: "gpt-4.1-mini",
      messages: [
        { 
            role: "system", 
            content: `Here is the user's personal data to always consider:

            User Data:
            - Name: ${user?.username}
            - Interview Calls ${seriazliedJobsInterviews}
            - Analyze this recent jobs and send statistics or relative info user want ${serializedJobToAnalyze}

            Always use this data when generating answers.
            ${systemPrompt}` 
        },
        { role: "user", content: message },
      ],
      temperature: 0.9,      
      max_tokens: 300,       
      top_p: 0.9,             
      presence_penalty: 0.1,
      frequency_penalty: 0.1,
    });

    const answer = response.choices[0].message;

    const userApiCredits = await db.user.update({
      where: {
        id: user?.id
      },
      data: {
        apiCredits: {
          decrement: 1
        }
      }
    })

    return NextResponse.json({ message: answer.content, userApiCredits });
  } catch (error: any) {
    console.error("Chat API Error:", error);
    return NextResponse.json(
      { error: "Server error", detail: error.message },
      { status: 500 }
    );
  }
}
