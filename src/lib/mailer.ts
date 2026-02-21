type SendArgs = { to: string; subject: string; html: string };

export async function sendEmail({ to, subject, html }: SendArgs) {
    if (process.env.RESEND_API_KEY) {
        // @ts-ignore — resend is an optional peer dependency
        const { Resend } = await import("resend");
        const resend = new Resend(process.env.RESEND_API_KEY);
        await resend.emails.send({
            from: process.env.SMTP_FROM ?? "LeadPilot <no-reply@leadpilot.local>",
            to,
            subject,
            html,
        });
        return;
    }

    const host = process.env.SMTP_HOST;
    const user = process.env.SMTP_USER;
    const pass = process.env.SMTP_PASS;
    const from = process.env.SMTP_FROM;

    if (host && user && pass && from) {
        // @ts-ignore — nodemailer is an optional peer dependency
        const nodemailer = await import("nodemailer");
        const transporter = nodemailer.createTransport({
            host,
            port: Number(process.env.SMTP_PORT ?? "587"),
            secure: false,
            auth: { user, pass },
        });
        await transporter.sendMail({ from, to, subject, html });
        return;
    }

    // Dev fallback — print magic link to console
    console.log("\n──────────────────────────────────────────────────────");
    console.log("📧  [DEV] No email provider configured. Magic link:");
    console.log(`   To: ${to}`);
    console.log(`   Subject: ${subject}`);
    const linkMatch = html.match(/href="([^"]+)"/);
    if (linkMatch) console.log(`   Link: ${linkMatch[1]}`);
    console.log("──────────────────────────────────────────────────────\n");
}
