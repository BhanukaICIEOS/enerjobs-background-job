import { app, InvocationContext, Timer } from "@azure/functions";
import { connectToDatabase } from "../db/connection";

export async function promotionChecker(_myTimer: Timer, context: InvocationContext): Promise<void> {
    await connectToDatabase();
    context.log('promotionChecker: connected to DB, running promotion logic...');

    // TODO: add your mongoose queries here
}

app.timer('promotionChecker', {
    schedule: '0 0 0 * * *',
    handler: promotionChecker
});
