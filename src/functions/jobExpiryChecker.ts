import { app, InvocationContext, Timer } from "@azure/functions";
import { connectToDatabase } from "../db/connection";
import { jobExpiryService } from "../services/jobExpiry.service";

export async function jobExpiryChecker(_myTimer: Timer, context: InvocationContext): Promise<void> {
    await connectToDatabase();
    const count = await jobExpiryService.processExpiredJobs();
    context.log(`jobExpiryChecker: marked ${count} job(s) as expired`);
}

app.timer('jobExpiryChecker', {
    schedule: '0 0 0 * * *',
    handler: jobExpiryChecker
});
