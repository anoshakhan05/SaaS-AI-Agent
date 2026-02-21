import crypto from "crypto";
import { cookies, headers } from "next/headers";
import { PrismaClient } from "@prisma/client";

export const prisma = new PrismaClient();

export function sha256(input: string) {
    return crypto.createHash("sha256").update(input).digest("hex");
}

export function randomToken(bytes = 32) {
    return crypto.randomBytes(bytes).toString("hex");
}

export async function getClientMeta() {
    const h = await headers();
    const ip = h.get("x-forwarded-for")?.split(",")[0]?.trim() ?? null;
    const userAgent = h.get("user-agent") ?? null;
    return { ip, userAgent };
}

export async function setSessionCookie(sessionToken: string, days: number) {
    const c = await cookies();
    c.set("lp_session", sessionToken, {
        httpOnly: true,
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
        path: "/",
        maxAge: days * 24 * 60 * 60,
    });
}

export async function clearSessionCookie() {
    const c = await cookies();
    c.set("lp_session", "", {
        httpOnly: true,
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
        path: "/",
        maxAge: 0,
    });
}

export async function requireUser() {
    // Bypass authentication: Always return the first user for demo purposes
    const user = await prisma.user.findFirst();
    return user;
}
