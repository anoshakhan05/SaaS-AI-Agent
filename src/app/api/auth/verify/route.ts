import { NextResponse } from "next/server";
import { prisma, sha256, randomToken } from "@/lib/auth";

export async function GET(req: Request) {
    const url = new URL(req.url);
    const token = url.searchParams.get("token");

    if (!token) return NextResponse.redirect(new URL("/login?error=missing_token", url));

    const tokenHash = sha256(token);

    const record = await prisma.magicLinkToken.findUnique({
        where: { tokenHash },
    });

    if (!record) return NextResponse.redirect(new URL("/login?error=invalid", url));
    if (record.usedAt) return NextResponse.redirect(new URL("/login?error=used", url));
    if (record.expiresAt < new Date()) return NextResponse.redirect(new URL("/login?error=expired", url));

    const adminEmail = process.env.ADMIN_EMAIL?.toLowerCase();
    if (!adminEmail || record.userEmail.toLowerCase() !== adminEmail) {
        return NextResponse.redirect(new URL("/login?error=not_allowed", url));
    }

    const user = await prisma.user.upsert({
        where: { email: adminEmail },
        update: {},
        create: { email: adminEmail, name: "Anosha Waseem" },
    });

    // Mark token as used
    await prisma.magicLinkToken.update({
        where: { tokenHash },
        data: { usedAt: new Date() },
    });

    // Create session
    const rawSession = randomToken(32);
    const sessionHash = sha256(rawSession);

    const days = Number(process.env.SESSION_DAYS ?? "30");
    const expiresAt = new Date(Date.now() + days * 24 * 60 * 60 * 1000);

    await prisma.session.create({
        data: { userId: user.id, tokenHash: sessionHash, expiresAt },
    });

    const res = NextResponse.redirect(new URL("/app/dashboard", url));
    res.cookies.set("lp_session", rawSession, {
        httpOnly: true,
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
        path: "/",
        maxAge: days * 24 * 60 * 60,
    });

    return res;
}
