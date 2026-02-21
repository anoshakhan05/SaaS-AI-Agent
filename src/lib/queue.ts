import { Queue, QueueEvents } from 'bullmq';
import redis from './redis';

// Define queue names
export const QUEUES = {
    LEAD_DISCOVERY: 'lead-discovery',
    LEAD_ANALYSIS: 'lead-analysis',
    SEQUENCE_GENERATION: 'sequence-generation',
    QUEUE_SENDS: 'queue-sends',
    EMAIL_SENDER: 'email-sender',
    REPLY_SYNC: 'reply-sync',
} as const;

// Types
export interface DiscoveryJobData {
    campaignId: string;
    source: 'google' | 'yelp' | 'csv';
    query?: string;
    csvData?: string;
}

export interface AnalysisJobData {
    leadId: string;
}

export interface SequenceJobData {
    leadId: string;
    campaignId: string;
}

export interface QueueSendsJobData {
    campaignId: string;
}

export interface SendEmailJobData {
    outboundEmailId: string;
}

export interface SyncRepliesJobData {
    workspaceId: string;
}

// Queue instances
export const leadDiscoveryQueue = new Queue<DiscoveryJobData>(QUEUES.LEAD_DISCOVERY, { connection: redis as any });
export const leadAnalysisQueue = new Queue<AnalysisJobData>(QUEUES.LEAD_ANALYSIS, { connection: redis as any });
export const sequenceGenerationQueue = new Queue<SequenceJobData>(QUEUES.SEQUENCE_GENERATION, { connection: redis as any });
export const queueSendsQueue = new Queue<QueueSendsJobData>(QUEUES.QUEUE_SENDS, { connection: redis as any });
export const emailSenderQueue = new Queue<SendEmailJobData>(QUEUES.EMAIL_SENDER, { connection: redis as any });
export const replySyncQueue = new Queue<SyncRepliesJobData>(QUEUES.REPLY_SYNC, { connection: redis as any });

// Queue Events
export const leadDiscoveryEvents = new QueueEvents(QUEUES.LEAD_DISCOVERY, { connection: redis as any });
export const leadAnalysisEvents = new QueueEvents(QUEUES.LEAD_ANALYSIS, { connection: redis as any });
export const sequenceGenerationEvents = new QueueEvents(QUEUES.SEQUENCE_GENERATION, { connection: redis as any });
export const queueSendsEvents = new QueueEvents(QUEUES.QUEUE_SENDS, { connection: redis as any });
export const emailSenderEvents = new QueueEvents(QUEUES.EMAIL_SENDER, { connection: redis as any });
export const replySyncEvents = new QueueEvents(QUEUES.REPLY_SYNC, { connection: redis as any });
