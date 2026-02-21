import { Job } from 'bullmq';
import { SyncRepliesJobData } from '../lib/queue';

export async function processReplySync(job: Job<SyncRepliesJobData>) {
    console.log(`[Reply Sync] Syncing replies for workspace ${job.data.workspaceId}`);

    // TODO: Implement Gmail API Read-Only inbox sync here

    return { success: true, count: 0 };
}
