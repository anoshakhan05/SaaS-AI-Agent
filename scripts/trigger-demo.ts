import { leadDiscoveryQueue } from '../src/lib/queue';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function triggerDemo() {
    console.log('🚀 Starting LeadPilot Demo Trigger...');

    // 1. Ensure we have a workspace and campaign
    const workspaceId = 'clp_admin_workspace';
    const campaign = await prisma.campaign.upsert({
        where: { id: 'demo_campaign_1' },
        update: {},
        create: {
            id: 'demo_campaign_1',
            workspaceId,
            name: 'Test Outreach - Dental Lahore',
            status: 'ACTIVE'
        }
    });

    // 2. Add sequence steps
    await prisma.emailSequenceStep.upsert({
        where: { id: 'demo_step_1' },
        update: {},
        create: {
            id: 'demo_step_1',
            campaignId: campaign.id,
            stepNumber: 1,
            subject: 'Quick question for {{company_name}}',
            body: 'Hi, I saw {{website_url}} and noticed some SEO issues...'
        }
    });

    // 3. Trigger Discovery
    console.log('📥 Triggering Lead Discovery for "Dentists in Lahore"...');
    await leadDiscoveryQueue.add('discover-leads', {
        campaignId: campaign.id,
        source: 'google',
        query: 'Dentists in Lahore'
    });

    console.log('✅ Demo triggered! Steps to follow:');
    console.log('1. Discovery worker will create leads.');
    console.log('2. Analysis worker will score them via OpenAI.');
    console.log('3. Sequence worker will generate drafts.');
    console.log('4. Email sender worker will "send" them (mocked).');
    console.log('\nRun "npm run worker" to watch the logs.');
}

triggerDemo()
    .catch(err => console.error(err))
    .finally(() => prisma.$disconnect());
