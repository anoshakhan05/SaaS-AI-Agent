import { Worker } from 'bullmq';
import redis from '../lib/redis';
import { QUEUES } from '../lib/queue';

// Import job processors (we'll implement these next)
import { processLeadDiscovery } from './leadDiscovery';
import { processLeadAnalysis } from './leadAnalysis';
import { processSequenceGeneration } from './sequenceGeneration';
import { processQueueSends } from './queueSends';
import { processEmailSender } from './emailSender';
import { processReplySync } from './replySync';

console.log('Starting BullMQ Workers...');

export const discoveryWorker = new Worker(QUEUES.LEAD_DISCOVERY, processLeadDiscovery, { connection: redis as any });
export const analysisWorker = new Worker(QUEUES.LEAD_ANALYSIS, processLeadAnalysis, { connection: redis as any });
export const sequenceWorker = new Worker(QUEUES.SEQUENCE_GENERATION, processSequenceGeneration, { connection: redis as any, concurrency: 5 });
export const queueSendsWorker = new Worker(QUEUES.QUEUE_SENDS, processQueueSends, { connection: redis as any });
export const emailWorker = new Worker(QUEUES.EMAIL_SENDER, processEmailSender, { connection: redis as any, concurrency: 10 });
export const replyWorker = new Worker(QUEUES.REPLY_SYNC, processReplySync, { connection: redis as any });

const workers = [discoveryWorker, analysisWorker, sequenceWorker, queueSendsWorker, emailWorker, replyWorker];

workers.forEach(worker => {
    worker.on('completed', job => {
        console.log(`${worker.name} job ${job.id} has completed!`);
    });

    worker.on('failed', (job, err) => {
        console.error(`${worker.name} job ${job?.id} has failed with ${err.message}`);
    });
});

process.on('SIGTERM', async () => {
    console.log('Shutting down workers...');
    await Promise.all(workers.map(w => w.close()));
    process.exit(0);
});
