import { app, InvocationContext, Timer } from "@azure/functions";
import { connectToDatabase } from "../db/connection";

export async function refreshChecker(_myTimer: Timer, context: InvocationContext): Promise<void> {
    await connectToDatabase();
    context.log('refreshChecker: connected to DB, running refresh logic...');

    // TODO: add your mongoose queries here
}

app.timer('refreshChecker', {
    schedule: '0 0 0 * * *',
    handler: refreshChecker
});
