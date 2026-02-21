import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function logJobStart(jobName: string) {
    return await prisma.jobRunLog.create({
        data: {
            jobName,
            status: 'STARTED',
            startedAt: new Date()
        }
    });
}

export async function logJobCompletion(logId: string, result: any) {
    return await prisma.jobRunLog.update({
        where: { id: logId },
        data: {
            status: 'COMPLETED',
            result: result ? JSON.stringify(result) : null,
            completedAt: new Date()
        }
    });
}

export async function logJobFailure(logId: string, error: string) {
    return await prisma.jobRunLog.update({
        where: { id: logId },
        data: {
            status: 'FAILED',
            error,
            completedAt: new Date()
        }
    });
}
