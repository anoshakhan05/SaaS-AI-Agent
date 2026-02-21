import { Job } from 'bullmq';
import { QueueSendsJobData, emailSenderQueue } from '../lib/queue';
import { PrismaClient } from '@prisma/client';
import { logJobStart, logJobCompletion, logJobFailure } from '../lib/logger';

const prisma = new PrismaClient();

export async function processQueueSends(job: Job<QueueSendsJobData>) {
    console.log(`[Queue Sends] Processing campaign ${job.data.campaignId}`);
    const log = await logJobStart(`Queue Sends: ${job.data.campaignId}`);

    try {
        const campaign = await prisma.campaign.findUnique({
            where: { id: job.data.campaignId },
            include: {
                leads: { where: { status: 'QUALIFIED' } },
                sequenceSteps: true
            }
        });

        if (!campaign) throw new Error('Campaign not found');

        // Find all QUEUED emails for this campaign's leads that are supposed to be sent
        const pendingEmails = await prisma.outboundEmail.findMany({
            where: {
                lead: {
                    campaignId: campaign.id,
                    status: 'QUALIFIED'
                },
                status: 'QUEUED'
            },
            take: 20
        });

        let queuedCount = 0;
        for (const email of pendingEmails) {
            console.log(`[Queue Sends] Queueing email ${email.id} for lead ${email.leadId}`);
            await emailSenderQueue.add('send-email', { outboundEmailId: email.id });
            queuedCount++;
        }

        await logJobCompletion(log.id, { emailsQueued: queuedCount });
        return { success: true, count: queuedCount };
    } catch (err: any) {
        console.error('Queue Sends Error:', err);
        await logJobFailure(log.id, err.message);
        throw err;
    }
}
