import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
    const { pathname } = req.nextUrl;

    /* 
    if (pathname.startsWith("/app")) {
        const hasSession = req.cookies.get("lp_session")?.value;
        if (!hasSession) return NextResponse.redirect(new URL("/login", req.url));
    }
    */

    // Protect internal worker endpoints
    if (pathname === "/api/inbox/sync" || pathname === "/api/outreach/send") {
        const secret = req.headers.get("x-cron-secret");
        if (secret !== process.env.CRON_SECRET) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/app/:path*", "/api/inbox/sync", "/api/outreach/send"],
};
