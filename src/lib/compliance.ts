import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function checkCompliance(workspaceId: string, leadId: string) {
    // Check if lead is in suppression list
    const lead = await prisma.lead.findUnique({ where: { id: leadId } });
    if (!lead) return { allowed: false, reason: 'Lead not found' };

    // @ts-ignore - workspaceId added to schema but client generation is pending in this env
    const suppression = await prisma.suppressionList.findFirst({
        where: {
            // @ts-ignore
            workspaceId,
            email: lead.email || undefined
        }
    });

    if (suppression) return { allowed: false, reason: 'Lead is in suppression list' };

    // Check daily cap (mocking workspace settings lookup)
    // In a real app, this would be a field in the Workspace model
    const dailyCap = 50;

    const sentToday = await prisma.outboundEmail.count({
        where: {
            lead: { workspaceId },
            sentAt: {
                gte: new Date(new Date().setHours(0, 0, 0, 0))
            }
        }
    });

    if (sentToday >= dailyCap) {
        return { allowed: false, reason: 'Daily sending cap reached' };
    }

    return { allowed: true };
}

export function appendUnsubscribe(body: string, unsubscribeLine: string) {
    if (body.includes(unsubscribeLine)) return body;
    return `${body}\n\n--\n${unsubscribeLine}`;
}
