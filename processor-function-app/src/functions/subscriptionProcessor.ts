import { app, InvocationContext } from "@azure/functions";
import { connectToDatabase } from "../db/connection";
import { emailService } from "../services/email.service";

type SubscriptionQueueMessage =
    | { type: 'renewal_reminder'; companyId: string; renewalDate: string }
    | { type: 'expiry_notification'; companyId: string };

export async function subscriptionProcessor(message: unknown, context: InvocationContext): Promise<void> {
    await connectToDatabase();
    context.log('subscriptionProcessor: received queue message', message);

    let payload: SubscriptionQueueMessage;

    try {
        payload = (typeof message === 'string' ? JSON.parse(message) : message) as SubscriptionQueueMessage;
    } catch {
        context.error('subscriptionProcessor: failed to parse queue message');
        return;
    }

    // TODO: look up the company email from DB instead of using a placeholder
    const companyEmail = process.env.DEFAULT_RECIPIENT_EMAIL ?? 'admin@example.com';

    switch (payload.type) {
        case 'renewal_reminder':
            await emailService.sendRenewalReminder(companyEmail, payload.companyId, payload.renewalDate);
            context.log(`subscriptionProcessor: sent renewal reminder email for company ${payload.companyId}`);
            break;

        case 'expiry_notification':
            await emailService.sendExpiryNotification(companyEmail, payload.companyId);
            context.log(`subscriptionProcessor: sent expiry notification email for company ${payload.companyId}`);
            break;

        default:
            context.warn('subscriptionProcessor: unknown message type', (payload as any).type);
    }
}

app.storageQueue('subscriptionProcessor', {
    queueName: 'subscription-queue',
    connection: 'AzureWebJobsStorage',
    handler: subscriptionProcessor,
});
