// @ts-nocheck
/* prisma/seed.ts
   Run: npx prisma db seed
*/

import { PrismaClient } from "@prisma/client";
import crypto from "crypto";

const prisma = new PrismaClient();

// ---- helpers ----
function slugify(input: string) {
    return input
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)+/g, "");
}

function randInt(min: number, max: number) {
    // inclusive
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function pick<T>(arr: T[]) {
    return arr[randInt(0, arr.length - 1)];
}

function nowMinusDays(days: number) {
    const d = new Date();
    d.setDate(d.getDate() - days);
    return d;
}

function fakeDomain(company: string, city: string) {
    const base = slugify(`${company}-${city}`)
        .replace(/-dental-|-dentistry-|-clinic-/g, "-")
        .slice(0, 42);
    return `${base}.com`;
}

function businessEmail(domain: string) {
    const localParts = ["info", "hello", "contact", "appointments", "office"];
    return `${pick(localParts)}@${domain}`;
}

function seedIssues() {
    const all = [
        "No clear primary CTA above the fold",
        "Online booking not visible on mobile",
        "Weak local SEO signals (title/H1/location)",
        "Missing dedicated service pages (implants/whitening/emergency)",
        "No testimonials or reviews section",
        "Slow load hints (unoptimized images)",
        "Header phone number not prominent",
        "No lead capture offer for new patients",
        "Inconsistent address formatting (NAP)",
        "No tracking signals (GA/Pixel) detected",
    ];
    const count = randInt(2, 4);
    const shuffled = [...all].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, count);
}

function scoreFromIssues(issues: string[]) {
    // Conservative scoring: more issues => higher “need” but still cap by plausibility
    // Score represents likelihood they need web/SEO + can benefit.
    let score = 55;
    for (const issue of issues) score += 6;
    score += randInt(-6, 8);
    return Math.max(35, Math.min(92, score));
}

function tierFromScore(score: number) {
    if (score >= 80) return "A";
    if (score >= 60) return "B";
    return "C";
}

function offerAngleFromIssues(issues: string[]) {
    if (issues.some((x) => x.toLowerCase().includes("booking"))) return "Online booking + new patient funnel";
    if (issues.some((x) => x.toLowerCase().includes("local seo") || x.toLowerCase().includes("nap"))) return "Local SEO + Google Business optimization";
    if (issues.some((x) => x.toLowerCase().includes("slow") || x.toLowerCase().includes("mobile"))) return "Speed + mobile performance";
    return "Website redesign for conversions";
}

function personalizationHooks(company: string, city: string, issues: string[]) {
    const hooks = [
        `I was reviewing your site for ${company} and noticed ${issues[0].toLowerCase()}.`,
        `If most of your patients come from ${city}, improving local intent pages can increase calls without extra ad spend.`,
        `Many clinics lose bookings when the CTA isn’t visible on mobile—especially for “new patient” traffic.`,
        `A simple new-patient offer section and clearer booking path can lift conversions quickly.`,
    ];
    return [pick(hooks), pick(hooks)].filter((v, i, a) => a.indexOf(v) === i);
}

// ---- main ----
async function main() {
    // If your schema has different field names, update these mappings.

    const senderEmail = "codewithanosha@gmail.com";
    const workspaceName = "LeadPilot Workspace";
    const timezone = "Asia/Karachi";

    // 1) Create workspace
    const workspace = await prisma.workspace.upsert({
        where: { slug: "leadpilot" },
        update: {},
        create: {
            name: workspaceName,
            slug: "leadpilot",
            timezone,
        },
    });

    // 2) Create admin user
    const user = await prisma.user.upsert({
        where: { email: senderEmail },
        update: { workspaceId: workspace.id },
        create: {
            email: senderEmail,
            name: "Anosha Waseem",
            role: "ADMIN",
            workspaceId: workspace.id,
        },
    });

    // 3) Email templates
    const templateA = await prisma.emailTemplate.upsert({
        where: { workspaceId_name: { workspaceId: workspace.id, name: "Dentists - Local SEO" } },
        update: {},
        create: {
            workspaceId: workspace.id,
            name: "Dentists - Local SEO",
            subject: "{{company_name}} in {{city}} – quick local SEO idea",
            body:
                "Hi {{first_name}},\n\nI was reviewing {{website_url}} and noticed {{pain_point}}. For dental clinics, small improvements to local SEO and your Google Business profile often increase calls and booking requests without increasing ad spend.\n\nIf you’d like, I can send a short 3-point audit tailored to {{company_name}}. Would you be open to a quick 10-minute call this week?\n\nIf you’d prefer I don’t reach out again, reply ‘unsubscribe’ and I won’t contact you further.\n— Anosha Waseem",
        },
    });

    const templateB = await prisma.emailTemplate.upsert({
        where: { workspaceId_name: { workspaceId: workspace.id, name: "Dentists - Booking Funnel" } },
        update: {},
        create: {
            workspaceId: workspace.id,
            name: "Dentists - Booking Funnel",
            subject: "Quick booking improvement for {{company_name}}",
            body:
                "Hi {{first_name}},\n\nI took a look at {{website_url}} and noticed {{pain_point}}. Many clinics lose new patients when the booking path isn’t clear on mobile or the CTA isn’t visible above the fold.\n\nI help dental clinics improve the booking flow and build a simple “new patient” landing page that converts. Would a quick 10-minute call this week work?\n\nIf you’d prefer I don’t reach out again, reply ‘unsubscribe’ and I won’t contact you further.\n— Anosha Waseem",
        },
    });

    // 4) Campaigns
    const campaign1 = await prisma.campaign.upsert({
        where: { workspaceId_slug: { workspaceId: workspace.id, slug: "dentists-local-seo" } },
        update: {},
        create: {
            workspaceId: workspace.id,
            name: "Dentists – Local SEO Audit",
            slug: "dentists-local-seo",
            niche: "Dentists",
            location: "English-speaking markets",
            status: "DRAFT",
            scoreThreshold: 60,
            dailyCap: 30,
            sendWindowStart: "10:00",
            sendWindowEnd: "17:00",
            weekdaysOnly: true,
            templateId: templateA.id,
        },
    });

    const campaign2 = await prisma.campaign.upsert({
        where: { workspaceId_slug: { workspaceId: workspace.id, slug: "dentists-booking-funnel" } },
        update: {},
        create: {
            workspaceId: workspace.id,
            name: "Dentists – Booking Funnel",
            slug: "dentists-booking-funnel",
            niche: "Dentists",
            location: "English-speaking markets",
            status: "DRAFT",
            scoreThreshold: 60,
            dailyCap: 30,
            sendWindowStart: "10:00",
            sendWindowEnd: "17:00",
            weekdaysOnly: true,
            templateId: templateB.id,
        },
    });

    // 5) Email sequence steps
    const ensureSequence = async (campaignId: string, baseTemplate: any) => {
        const existing = await prisma.emailSequenceStep.findMany({ where: { campaignId } });
        if (existing.length > 0) return;

        await prisma.emailSequenceStep.createMany({
            data: [
                {
                    campaignId,
                    stepNumber: 1,
                    delayDays: 0,
                    subject: baseTemplate.subject,
                    body: baseTemplate.body,
                },
                {
                    campaignId,
                    stepNumber: 2,
                    delayDays: 2,
                    subject: "Quick follow-up for {{company_name}}",
                    body:
                        "Hi {{first_name}},\n\nJust following up—happy to share a quick 3-point audit for {{company_name}} based on {{website_url}}.\n\nWould a short 10-minute call this week be convenient?\n\nIf you’d prefer I don’t reach out again, reply ‘unsubscribe’ and I won’t contact you further.\n— Anosha Waseem",
                },
                {
                    campaignId,
                    stepNumber: 3,
                    delayDays: 5,
                    subject: "Last note, {{company_name}}",
                    body:
                        "Hi {{first_name}},\n\nLast note from me. If improving local visibility and bookings is a priority this quarter, I can send a short audit with practical fixes you can implement quickly.\n\nShould I send it over?\n\nIf you’d prefer I don’t reach out again, reply ‘unsubscribe’ and I won’t contact you further.\n— Anosha Waseem",
                },
            ],
        });
    };

    await ensureSequence(campaign1.id, templateA);
    await ensureSequence(campaign2.id, templateB);

    // 6) Leads (30 dentists)
    const cities = ["Austin", "Toronto", "London", "Chicago", "Sydney", "Vancouver", "Manchester", "Dallas", "Birmingham", "Melbourne"];
    const clinicNames = ["Bright Smile Dental", "Oakwood Dentistry", "Riverstone Dental Care", "Sunset Family Dentistry", "Northside Dental Clinic", "Cedar Grove Dental", "Lakeside Smiles", "Parkview Dental Studio", "Maple Leaf Dental", "BlueSky Dental", "Elite Dental & Implants", "Gentle Care Dentistry", "Prime Dental Center", "Harmony Dental", "CityView Dental"];
    const firstNames = ["Sarah", "John", "Ayesha", "Michael", "Emma", "David", "Olivia", "Daniel", "Sophia", "James"];

    for (let i = 0; i < 30; i++) {
        const companyName = `${pick(clinicNames)} ${randInt(1, 99)}`;
        const city = pick(cities);
        const country = pick(["USA", "Canada", "UK", "Australia"]);
        const domain = fakeDomain(companyName, city);
        const websiteUrl = `https://${domain}`;
        const email = businessEmail(domain);
        const firstName = pick(firstNames);

        const lead = await prisma.lead.upsert({
            where: { workspaceId_domain: { workspaceId: workspace.id, domain } },
            update: {
                companyName,
                websiteUrl,
                city,
                country,
                email,
                contactFirstName: firstName,
            },
            create: {
                workspaceId: workspace.id,
                companyName,
                domain,
                websiteUrl,
                city,
                country,
                email,
                contactFirstName: firstName,
                status: "NEW",
                source: "seed",
            },
        });

        // Score
        const issues = seedIssues();
        const score = scoreFromIssues(issues);
        const tier = tierFromScore(score);
        const offerAngle = offerAngleFromIssues(issues);
        const hooks = personalizationHooks(companyName, city, issues);

        await prisma.leadScore.upsert({
            where: { leadId: lead.id },
            update: {
                score,
                tier,
                reasons: JSON.stringify(issues.map((x) => `Detected: ${x}`)),
                topIssues: JSON.stringify(issues),
                offerAngle,
                personalizationHooks: JSON.stringify(hooks),
                safeClaimsOnly: true,
            },
            create: {
                leadId: lead.id,
                score,
                tier,
                reasons: JSON.stringify(issues.map((x) => `Detected: ${x}`)),
                topIssues: JSON.stringify(issues),
                offerAngle,
                personalizationHooks: JSON.stringify(hooks),
                safeClaimsOnly: true,
            },
        });

        // Assign to campaign
        const campaignId = offerAngle === "Online booking + new patient funnel" ? campaign2.id : campaign1.id;
        await prisma.campaignLead.upsert({
            where: { campaignId_leadId: { campaignId, leadId: lead.id } },
            update: {},
            create: { campaignId, leadId: lead.id },
        });

        // Outbound Email
        const status = pick(["QUEUED", "SENT", "SENT", "SENT", "FAILED"]);
        const sentAt = status === "SENT" ? nowMinusDays(randInt(1, 12)) : null;
        const subject = subjectFor(offerAngle, companyName, city);
        const painPoint = issues[0];
        const body = `Hi ${firstName},\n\n${hooks[0]} I noticed ${painPoint.toLowerCase()}.\n\nIf you’d like, I can share a short 3-point audit tailored to ${companyName}. Would you be open to a quick 10-minute call this week?\n\nIf you’d prefer I don’t reach out again, reply ‘unsubscribe’ and I won’t contact you further.\n— Anosha Waseem`;

        const threadId = crypto.randomBytes(10).toString("hex");

        const outbound = await prisma.outboundEmail.create({
            data: {
                workspaceId: workspace.id,
                campaignId,
                leadId: lead.id,
                toEmail: email,
                fromEmail: senderEmail,
                subject,
                body,
                status,
                provider: "GMAIL",
                providerMessageId: status === "SENT" ? `seed-msg-${crypto.randomBytes(6).toString("hex")}` : null,
                threadId: status === "SENT" ? `seed-thread-${threadId}` : null,
                queuedAt: nowMinusDays(randInt(1, 12)),
                sentAt,
            },
        });

        // Replies
        if (status === "SENT" && Math.random() < 0.2) {
            const replyText = pick(["Thanks for reaching out. Can you send the audit?", "We’re interested. What would pricing look like?", "Please email details. We’re reviewing vendors this month.", "Not right now, but check back next quarter."]);
            await prisma.inboundReply.create({
                data: {
                    workspaceId: workspace.id,
                    leadId: lead.id,
                    outboundEmailId: outbound.id,
                    fromEmail: email,
                    subject: `Re: ${subject}`,
                    snippet: replyText,
                    threadId: outbound.threadId ?? `seed-thread-${threadId}`,
                    receivedAt: nowMinusDays(randInt(0, 10)),
                },
            });
            await prisma.lead.update({
                where: { id: lead.id },
                data: { status: "REPLIED" },
            });
        } else if (status === "SENT") {
            await prisma.lead.update({
                where: { id: lead.id },
                data: { status: "CONTACTED" },
            });
        }
    }

    // Suppression
    await prisma.suppressionList.upsert({
        where: { workspaceId_domain: { workspaceId: workspace.id, domain: "example-opt-out.com" } },
        update: {},
        create: { workspaceId: workspace.id, domain: "example-opt-out.com", reason: "Seed opt-out" }
    });

    console.log("Seed complete.");
}

function subjectFor(angle: string, company: string, city: string) {
    if (angle === "Online booking + new patient funnel") return `Quick booking improvement for ${company}`;
    return `${company} in ${city} – quick local SEO idea`;
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
