import { NextResponse } from "next/server";
import { prisma, sha256 } from "@/lib/auth";
import { cookies } from "next/headers";

export async function POST() {
    const sessionToken = (await cookies()).get("lp_session")?.value;
    if (sessionToken) {
        await prisma.session
            .deleteMany({ where: { tokenHash: sha256(sessionToken) } })
            .catch(() => null); // ignore if already gone
    }

    const res = NextResponse.json({ ok: true });
    res.cookies.set("lp_session", "", { httpOnly: true, path: "/", maxAge: 0 });
    return res;
}
