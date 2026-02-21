import { NextResponse } from "next/server";
import { prisma, randomToken, sha256, getClientMeta } from "@/lib/auth";
import { sendEmail } from "@/lib/mailer";

export async function POST(req: Request) {
    const { email } = await req.json().catch(() => ({}));

    const adminEmail = process.env.ADMIN_EMAIL?.toLowerCase();
    if (!adminEmail) return NextResponse.json({ error: "Missing ADMIN_EMAIL" }, { status: 500 });

    if (!email || String(email).toLowerCase() !== adminEmail) {
        // Don't reveal whether email is allowed
        return NextResponse.json({ ok: true });
    }

    // Ensure user exists
    await prisma.user.upsert({
        where: { email: adminEmail },
        update: {},
        create: { email: adminEmail, name: "Anosha Waseem" },
    });

    const rawToken = randomToken(32);
    const tokenHash = sha256(rawToken);

    const minutes = Number(process.env.MAGICLINK_MINUTES ?? "15");
    const expiresAt = new Date(Date.now() + minutes * 60 * 1000);

    const { ip, userAgent } = getClientMeta();

    await prisma.magicLinkToken.create({
        data: { userEmail: adminEmail, tokenHash, expiresAt, ip, userAgent },
    });

    const appUrl = process.env.APP_URL ?? "http://localhost:3000";
    const verifyUrl = `${appUrl}/verify?token=${rawToken}`;

    await sendEmail({
        to: adminEmail,
        subject: "Your LeadPilot login link",
        html: `
      <div style="font-family:system-ui,Segoe UI,Roboto,Arial">
        <h2>Login to LeadPilot</h2>
        <p>Click the button below to sign in. This link expires in ${minutes} minutes.</p>
        <p><a href="${verifyUrl}" style="display:inline-block;padding:10px 14px;border-radius:10px;background:#4f46e5;color:#fff;text-decoration:none">Sign in</a></p>
        <p style="color:#64748b;font-size:12px">If you didn't request this, you can ignore this email.</p>
      </div>
    `,
    });

    return NextResponse.json({ ok: true });
}
