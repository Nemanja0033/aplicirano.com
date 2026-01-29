import { db } from "@/src/app/lib/db";
import { admin } from "@/src/app/lib/firebaseAdmin";
import { ai } from "@/src/app/lib/geminiConfig";
import openai from "@/src/app/lib/openaiConfig";
import { endOfDay, startOfDay } from "date-fns";
import { NextResponse } from "next/server";

// ==================
// TYPES
// ==================
type ChatMessage = {
  role: "user" | "assistant";
  content: string;
};

// ==================
// SYSTEM PROMPT
// ==================
const systemPrompt = `
You are JobTrakifyAI — an assistant specialized in job searching, job analysis, and application strategy. 
Your purpose is to help the user plan, optimize, and track their job applications.
`;

export async function POST(req: Request) {
  try {
    // ==================
    // AUTH
    // ==================
    const authHeader = req.headers.get("Authorization");
    const localeHeader = req.headers.get("x-locale") || req.headers.get("accept-language") || "sr";

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

    const decoded = await admin.auth().verifyIdToken(token);
    const userData = await admin.auth().getUser(decoded.uid);

    // ==================
    // BODY
    // ==================
    const { prompt, resumeContent } = await req.json();
    console.log("PROMPT", prompt)

    if (!prompt) {
      return NextResponse.json(
        { error: "Missing or invalid 'prompt' field" },
        { status: 400 }
      );
    }

    // ==================
    // USER
    // ==================
    const user = await db.user.findUnique({
      where: { firebaseUid: userData.uid },
    });

    if (!user) {
      return NextResponse.json(
        { error: "User not registered" },
        { status: 401 }
      );
    }

    if (user.apiCredits === 0) {
      return NextResponse.json(
        { error: "You reached an AI chatbot limit" },
        { status: 400 }
      );
    }

    // ==================
    // RESUME CHECK SCENARIO
    // ==================

    if(resumeContent){
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `Oceni CV korisnika i odgovori mu detaljno, ponasaj se kao ATS skener:
        
          Korisnicki podaci:
          - Ime: ${user.username}
          - CV: ${resumeContent}

          Jezik: ${localeHeader}
          `,
      });
  
      const answer = response.text;
  
      // ==================
      // CREDITS
      // ==================
      await db.user.update({
        where: { id: user.id },
        data: {
          apiCredits: {
            decrement: 1,
          },
        },
      });

      return NextResponse.json({
        message: answer,
      });
    }

    // ==================
    // JOB DATA
    // ==================
    const interviews = await db.job.findMany({
      where: {
        userId: user.id,
        status: "INTERVIEW",
      },
    });

    const currentDate = new Date();
    const pastDate = new Date(currentDate);
    pastDate.setDate(currentDate.getDate() - 30);

    const jobToAnalyze = await db.job.findMany({
      where: {
        userId: user.id,
        // appliedAt: {
        //   gte: startOfDay(pastDate),
        //   lte: endOfDay(currentDate),
        // },
      },
    });

    const serializedInterviews = JSON.stringify(interviews, null, 2);
    const serializedJobs = JSON.stringify(jobToAnalyze, null, 2);

    // ==================
    // GEMINI CALL
    // ==================
    console.log("JOBS LENGTH",serializedJobs.length)
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Here is the user's personal data you MUST always consider:

        User Data:
        - Name: ${user.username}
        - Interview Calls: ${serializedInterviews}
        - Recent jobs for analysis: ${serializedJobs}
        - Language for communication: ${localeHeader}
        - User prompt: ${prompt}

        IMPORTANT:
        - Do not introduce yourself every time.
        - Give on-point responeses
        - Do not boring and asking user for further comunication
        - Always follow the ongoing conversation context.
        ${systemPrompt}`,
    });

    const answer = response.text;

    // ==================
    // CREDITS
    // ==================
    await db.user.update({
      where: { id: user.id },
      data: {
        apiCredits: {
          decrement: 1,
        },
      },
    });

    return NextResponse.json({
      message: answer,
    });
  } catch (error: any) {
    console.error("Chat API Error:", error);
    return NextResponse.json(
      { error: "Server error", detail: error.message },
      { status: 500 }
    );
  }
}
