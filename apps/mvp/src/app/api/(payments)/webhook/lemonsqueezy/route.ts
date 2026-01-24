import { db } from "@/src/app/lib/db";
import crypto from "crypto";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.text();
    const signature = req.headers.get("x-signature");

    if (!signature) {
      return new NextResponse("Missing signature", { status: 401 });
    }

    const hash = crypto
      .createHmac("sha256", 'necacar003')
      .update(body)
      .digest("hex");

    if (hash !== signature) {
      return new NextResponse("Invalid signature", { status: 401 });
    }

    const event = JSON.parse(body);

    if (event.meta.event_name === "order_created") {
      // ✅ JEDINO ISPRAVNO MESTO
      const userId = event.meta.custom_data?.userId;

      console.log("USER ID FROM LEMON:", userId);

      if (!userId) {
        console.error("❌ userId missing in webhook");
        return NextResponse.json({ ok: false });
      }

      await db.user.update({
        where: { id: userId },
        data: {
          isProUSer: true,
          jobsLimit: 15000,
          apiCredits: 100,
          profileLimit: 10,
          resumeLimit: 30
        },
      });

      console.log("✅ PRO activated for user:", userId);
    }

    return NextResponse.json({ received: true });
  } catch (err) {
    console.error("WEBHOOK ERROR:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
