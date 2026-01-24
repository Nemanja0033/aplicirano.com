import { db } from "@/src/app/lib/db";
import { admin } from "@/src/app/lib/firebaseAdmin";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const authHeader = req.headers.get("Authorization");
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

    const user = await db.user.findUnique({
      where: { firebaseUid: userData.uid },
    });

    if (!user) {
      return NextResponse.json(
        { error: "User dont exist!" },
        { status: 404 }
      );
    }

    const variantId = "1242079";

    const res = await fetch("https://api.lemonsqueezy.com/v1/checkouts", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.LEMON_API_KEY}`,
        "Content-Type": "application/vnd.api+json",
        Accept: "application/vnd.api+json",
      },
      body: JSON.stringify({
        data: {
          type: "checkouts",
          attributes: {
            checkout_data: {
              custom: {
                userId: user.id,
              },
            },
          },
          relationships: {
            store: {
              data: {
                type: "stores",
                id: process.env.LEMON_STORE_ID
              }
            },
            variant: {
              data: {
                type: "variants",
                id: variantId,
              },
            },
          },
        },
      }),
    });

    const json = await res.json();

    if (!res.ok) {
      console.error("Lemon error:", json);
      return NextResponse.json(
        { error: "Lemon error", details: json },
        { status: 400 }
      );
    }

    return NextResponse.json({
      url: json.data.attributes.url,
    });

  } catch (err: any) {
    console.error("CHECKOUT ERROR:", err);
    return NextResponse.json(
      { error: "Internal server error", message: err.message },
      { status: 500 }
    );
  }
}
