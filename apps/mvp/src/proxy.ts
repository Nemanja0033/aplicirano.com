import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import createMiddleware from "next-intl/middleware";
import { routing } from "../src/i18n/routing";
import { getRateLimiter } from "./app/lib/rateLimiter";

// 1. Next-intl middleware
const intlMiddleware = createMiddleware(routing);

export default async function middleware(req: NextRequest) {
  const pathname = req.nextUrl.pathname;

  // 2. Rate limit samo za API rute
  if (pathname.startsWith("/api")) {
    const rateLimiter = getRateLimiter();
    const ip = req.headers.get("x-forwarded-for") ?? "anonymous";
    const { success } = await rateLimiter.limit(ip);

    if (!success) {
      return NextResponse.json(
        { error: "Rate limit exceeded" },
        { status: 429 }
      );
    }

    // ⬅️ Vrati normalno API rutu, ne intlMiddleware
    return NextResponse.next();
  }

  // 3. Sve ostalo ide kroz intl middleware
  return intlMiddleware(req);
}

// 4. Matcher mora da pokrije i API i intl rute
export const config = {
  matcher: [
    "/((?!trpc|_next|_vercel|.*\\..*).*)", // sve osim statičkih fajlova
    "/api/:path*", // sve API rute
  ],
};
