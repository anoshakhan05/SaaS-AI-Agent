import { Job } from 'bullmq';
import { DiscoveryJobData } from '../lib/queue';
import { PrismaClient } from '@prisma/client';
import { logJobStart, logJobCompletion, logJobFailure } from '../lib/logger';

const prisma = new PrismaClient();

export async function processLeadDiscovery(job: Job<DiscoveryJobData>) {
    console.log(`[Lead Discovery] Starting discovery for source: ${job.data.source}`);
    const log = await logJobStart(`Lead Discovery: ${job.data.source}`);

    try {
        // Dummy logic: Create 5 mock leads
        const mockLeads = [
            { domain: 'drsmith.local', companyName: 'Dr. Smith Dental', websiteUrl: 'http://drsmith.local' },
            { domain: 'cleansmiles.local', companyName: 'Clean Smiles', websiteUrl: 'http://cleansmiles.local' },
            { domain: 'dentalleader.local', companyName: 'Dental Leader', websiteUrl: 'http://dentalleader.local' },
            { domain: 'brightteeth.local', companyName: 'Bright Teeth', websiteUrl: 'http://brightteeth.local' },
            { domain: 'smiledesign.local', companyName: 'Smile Design', websiteUrl: 'http://smiledesign.local' },
        ];

        for (const mock of mockLeads) {
            await prisma.lead.upsert({
                where: {
                    workspaceId_domain: {
                        workspaceId: 'clp_admin_workspace', // demo ID from seed
                        domain: mock.domain
                    }
                },
                update: {},
                create: {
                    workspaceId: 'clp_admin_workspace',
                    campaignId: job.data.campaignId,
                    domain: mock.domain,
                    companyName: mock.companyName,
                    websiteUrl: mock.websiteUrl,
                    source: job.data.source.toUpperCase(),
                    status: 'NEW'
                }
            });
        }

        await logJobCompletion(log.id, { created: mockLeads.length });
        return { success: true, count: mockLeads.length };
    } catch (err: any) {
        console.error('Lead Discovery Error:', err);
        await logJobFailure(log.id, err.message);
        throw err;
    }
}
