import { Job } from 'bullmq';
import { AnalysisJobData, sequenceGenerationQueue } from '../lib/queue';
import { PrismaClient } from '@prisma/client';
import OpenAI from 'openai';
import { logJobStart, logJobCompletion, logJobFailure } from '../lib/logger';

const prisma = new PrismaClient();
const openai = new OpenAI();

export async function processLeadAnalysis(job: Job<AnalysisJobData>) {
    console.log(`[Lead Analysis] Analyzing lead ${job.data.leadId}`);
    const log = await logJobStart(`Lead Analysis: ${job.data.leadId}`);

    try {
        const lead = await prisma.lead.findUnique({ where: { id: job.data.leadId } });
        if (!lead) throw new Error('Lead not found');

        if (!lead.websiteUrl) {
            console.log(`[Lead Analysis] Lead ${lead.id} has no website URL, skipping analysis.`);
            await logJobCompletion(log.id, { success: false, reason: 'No website URL' });
            return { success: false, reason: 'No website URL' };
        }

        // Simulate scraping
        const websiteObservations = {
            page_title: `${lead.companyName} | Premium Dental Services`,
            meta_description: "Expert dental care for the whole family.",
            h1: "Welcome to Our Clinic",
            ctas_found: 2,
            booking_found: false,
            services_found: ["Implants", "Cleaning", "Whitening"],
            pages_found: ["/about", "/services", "/contact"],
            performance_hints: "Mobile speed is low (LCP 4.2s)",
            design_hints: "Outdated layout, not mobile-first"
        };

        const systemPrompt = `You are a B2B lead qualification expert for dental clinics. You must be accurate, conservative, and avoid making claims you cannot infer from the website content provided. Output must be valid JSON only.`;

        const userPrompt = `Lead data:
company_name: ${lead.companyName}
website_url: ${lead.websiteUrl}

Website observations (from scraper):
page_title: ${websiteObservations.page_title}
meta_description: ${websiteObservations.meta_description}
h1: ${websiteObservations.h1}
ctas_found: ${websiteObservations.ctas_found}
booking_found: ${websiteObservations.booking_found}
phone_found: ${lead.phone || 'none'}
address_found: ${lead.address || 'none'}
services_found: ${websiteObservations.services_found}
pages_found: ${websiteObservations.pages_found}
performance_hints: ${websiteObservations.performance_hints}
design_hints: ${websiteObservations.design_hints}

Task:
Score this lead 0–100 for "likelihood they need a website/SEO improvement and can afford help."
Provide the top 3 problems you can reasonably infer.
Provide the best offer angle for outreach (choose one):
"Website redesign for conversions"
"Local SEO + Google Business optimization"
"Online booking + new patient funnel"
"Speed + mobile performance"
Provide 2 personalization hooks referencing evidence above.

Return JSON with keys:
{
"score": number,
"tier": "A"|"B"|"C",
"reasons": string[],
"top_issues": string[],
"offer_angle": string,
"personalization_hooks": string[],
"safe_claims_only": true
}`;

        console.log(`[Lead Analysis] Requesting score from OpenAI for ${lead.companyName}`);
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

        await prisma.leadScore.upsert({
            where: { leadId: lead.id },
            update: {
                score: result.score || 0,
                tier: result.tier || 'C',
                reasons: JSON.stringify(result.reasons || []),
                topIssues: JSON.stringify(result.top_issues || []),
                offerAngle: result.offer_angle || 'Website redesign for conversions',
                personalizationHooks: JSON.stringify(result.personalization_hooks || []),
            },
            create: {
                leadId: lead.id,
                score: result.score || 0,
                tier: result.tier || 'C',
                reasons: JSON.stringify(result.reasons || []),
                topIssues: JSON.stringify(result.top_issues || []),
                offerAngle: result.offer_angle || 'Website redesign for conversions',
                personalizationHooks: JSON.stringify(result.personalization_hooks || []),
            }
        });

        if (result.score >= 50) {
            await prisma.lead.update({
                where: { id: lead.id },
                data: { status: 'QUALIFIED' }
            });
            console.log(`[Lead Analysis] Lead ${lead.companyName} qualified! Adding to sequence generation.`);
            await sequenceGenerationQueue.add('generate-sequence', {
                leadId: lead.id,
                campaignId: job.data.campaignId
            });
        } else {
            await prisma.lead.update({
                where: { id: lead.id },
                data: { status: 'DISQUALIFIED' }
            });
        }

        await logJobCompletion(log.id, result);
        return { success: true, qualified: result.score >= 50 };
    } catch (err: any) {
        console.error('Lead Analysis Error:', err);
        await logJobFailure(log.id, err.message);
        throw err;
    }
}
