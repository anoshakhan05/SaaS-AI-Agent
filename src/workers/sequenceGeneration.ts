import { Job } from 'bullmq';
import { SequenceJobData } from '../lib/queue';
import { PrismaClient } from '@prisma/client';
import OpenAI from 'openai';
import { logJobStart, logJobCompletion, logJobFailure } from '../lib/logger';

const prisma = new PrismaClient();
const openai = new OpenAI();

export async function processSequenceGeneration(job: Job<SequenceJobData>) {
    console.log(`[Sequence Gen] Crafting emails for lead ${job.data.leadId}`);
    const log = await logJobStart(`Sequence Gen: ${job.data.leadId}`);

    try {
        const lead = await prisma.lead.findUnique({
            where: { id: job.data.leadId },
            include: { score: true }
        });

        if (!lead || !lead.score) throw new Error('Lead or score not found');

        const systemPrompt = `You write short, professional cold emails to dental clinics. You must be respectful, non-spammy, and compliant. Keep messages under 120 words. Avoid exaggerated claims. Output JSON only.`;

        const userPrompt = `Sender identity:
sender_name: "Anosha Waseem"
sender_email: "codewithanosha@gmail.com"
services: "Web development, conversion-focused redesign, local SEO, Google Business optimization"
primary_cta: "Would you be open to a quick 10-minute call this week?"
unsubscribe_line: "If you'd prefer I don't reach out again, reply 'unsubscribe' and I won't contact you further."

Lead context:
company_name: ${lead.companyName}
website_url: ${lead.websiteUrl}
city: ${lead.address || "your city"}
personalization_hook: ${Array.isArray(lead.score.personalizationHooks) ? lead.score.personalizationHooks[0] : ""}
offer_angle: ${lead.score.offerAngle || ""}
top_issue: ${Array.isArray(lead.score.topIssues) ? lead.score.topIssues[0] : ""}

Write:
Email 1 subject + body
Follow-up 1 (2 days later)
Follow-up 2 (5 days later)

Return JSON:
{
"email1": {"subject": "...", "body": "..."},
"followup1": {"subject": "...", "body": "...", "delay_days": 2},
"followup2": {"subject": "...", "body": "...", "delay_days": 5}
}

Constraints:
Body: 70-120 words max
Include unsubscribe_line at end
Mention website_url only once
Use a clear, single CTA question`;

        console.log(`[Sequence Generation] Requesting email sequence from OpenAI for ${lead.companyName}`);
        let responseText = '';
        try {
            const completion = await openai.chat.completions.create({
                model: "gpt-4o-mini",
                messages: [
                    { role: "system", content: systemPrompt },
                    { role: "user", content: userPrompt }
                ],
                response_format: { type: "json_object" }
            });

            responseText = completion.choices[0].message.content || '{}';
        } catch (err) {
            console.error('OpenAI Error:', err);
            throw err;
        }

        const result = JSON.parse(responseText);

        // Instead of assigning emails immediately, we would create EmailSequenceSteps and let queueSends handle it,
        // or just directly schedule OutboundEmails.
        const now = new Date();

        const emailsToCreate = [
            {
                subject: result.email1?.subject || `Website for ${lead.companyName}`,
                body: result.email1?.body || `Hi there,\n\nWe would love to work with you.\n\nThanks,\nAnosha`,
                delayDays: 0,
                stepNumber: 1
            },
            {
                subject: result.followup1?.subject || `Following up with ${lead.companyName}`,
                body: result.followup1?.body || `Just following up.\n\nThanks,\nAnosha`,
                delayDays: result.followup1?.delay_days || 2,
                stepNumber: 2
            },
            {
                subject: result.followup2?.subject || `Checking in one last time`,
                body: result.followup2?.body || `Checking in again.\n\nThanks,\nAnosha`,
                delayDays: result.followup2?.delay_days || 5,
                stepNumber: 3
            }
        ];

        for (const item of emailsToCreate) {
            const scheduledAt = new Date(now.getTime() + item.delayDays * 24 * 60 * 60 * 1000);
            // You could also create sequence steps for the campaign if needed,
            // but building the scheduled outbound emails directly is easier for the demo.
            await prisma.outboundEmail.create({
                data: {
                    workspaceId: lead.workspaceId,
                    campaignId: job.data.campaignId,
                    leadId: lead.id,
                    subject: item.subject,
                    body: item.body,
                    status: 'QUEUED',
                    scheduledAt,
                    toEmail: lead.email || '',
                    fromEmail: 'codewithanosha@gmail.com', // fallback
                }
            });
        }

        await logJobCompletion(log.id, { stepsCreated: 3 });
        return { success: true };
    } catch (err: any) {
        console.error('Sequence Generation Error:', err);
        await logJobFailure(log.id, err.message);
        throw err;
    }
}
