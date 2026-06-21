import { QueueServiceClient } from '@azure/storage-queue';

const QUEUE_NAMES = {
    subscription: 'subscription-queue',
} as const;

export type SubscriptionQueueMessage =
    | { type: 'renewal_reminder';   companyId: string; renewalDate: string }
    | { type: 'expiry_notification'; companyId: string };

let client: QueueServiceClient | null = null;

function getClient(): QueueServiceClient {
    if (!client) {
        const connectionString = process.env.AzureWebJobsStorage;
        if (!connectionString) throw new Error('AzureWebJobsStorage environment variable is not set');
        client = QueueServiceClient.fromConnectionString(connectionString);
    }
    return client;
}

async function sendMessage(queueName: string, message: object): Promise<void> {
    const queueClient = getClient().getQueueClient(queueName);
    await queueClient.createIfNotExists();
    const encoded = Buffer.from(JSON.stringify(message)).toString('base64');
    await queueClient.sendMessage(encoded);
}

export const queueService = {
    sendSubscriptionMessage: (message: SubscriptionQueueMessage) =>
        sendMessage(QUEUE_NAMES.subscription, message),
};
