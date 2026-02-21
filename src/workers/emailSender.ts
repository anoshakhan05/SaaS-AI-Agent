import { Job } from 'bullmq';
import { SendEmailJobData } from '../lib/queue';
import { PrismaClient } from '@prisma/client';
import { checkCompliance } from '../lib/compliance';
import { logJobStart, logJobCompletion, logJobFailure } from '../lib/logger';

const prisma = new PrismaClient();

export async function processEmailSender(job: Job<SendEmailJobData>) {
    console.log(`[Email Sender] Processing email ${job.data.outboundEmailId}`);
    const log = await logJobStart(`Email Sender: ${job.data.outboundEmailId}`);

    try {
        const email = await prisma.outboundEmail.findUnique({
            where: { id: job.data.outboundEmailId },
            include: { lead: true }
        });

        if (!email) throw new Error('Email not found');
        if (email.status === 'SENT') {
            await logJobCompletion(log.id, { skipped: true, reason: 'Already sent' });
            return { skipped: true, reason: 'Already sent' };
        }

        // Compliance check
        const compliance = await checkCompliance(email.lead.workspaceId, email.leadId);
        if (!compliance.allowed) {
            console.warn(`[Email Sender] Compliance rejection: ${compliance.reason}`);
            await prisma.outboundEmail.update({
                where: { id: email.id },
                data: { status: 'FAILED' }
            });
            await logJobCompletion(log.id, { success: false, reason: compliance.reason });
            return { success: false, reason: compliance.reason };
        }

        // Mock Gmail Send
        console.log(`[Email Sender] MOCK SEND: Subject: ${email.subject} to ${email.lead.email}`);

        await prisma.outboundEmail.update({
            where: { id: email.id },
            data: {
                status: 'SENT',
                sentAt: new Date()
            }
        });

        await logJobCompletion(log.id, { success: true });
        return { success: true };
    } catch (err: any) {
        console.error('Email Sender Error:', err);
        await logJobFailure(log.id, err.message);
        throw err;
    }
}
