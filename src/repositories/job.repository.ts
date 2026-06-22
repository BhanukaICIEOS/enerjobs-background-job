import mongoose from 'mongoose';
import { Job, IJob } from '../models/job.model';

function startOfToday(): Date {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
}

class JobRepository {
    findActiveExpired(): Promise<IJob[]> {
        return Job.find({
            status: 'active',
            expiresAt: { $lte: new Date() },
        }).lean();
    }

    findActiveExpiringIn7Days(): Promise<IJob[]> {
        const today = startOfToday();
        const in7Days = new Date(today); in7Days.setDate(in7Days.getDate() + 7);
        const in8Days = new Date(today); in8Days.setDate(in8Days.getDate() + 8);

        // Dedup: skip if a reminder was already sent for this job
        return Job.find({
            status: 'active',
            expiresAt: { $gte: in7Days, $lt: in8Days },
            $or: [
                { reminderSentAt: { $exists: false } },
                { reminderSentAt: null },
            ],
        }).lean();
    }

    async markReminderSent(id: mongoose.Types.ObjectId): Promise<void> {
        await Job.updateOne({ _id: id }, { $set: { reminderSentAt: new Date() } });
    }

    async bulkMarkExpired(ids: mongoose.Types.ObjectId[]): Promise<number> {
        const result = await Job.updateMany(
            { _id: { $in: ids } },
            { $set: { status: 'expired' } }
        );
        return result.modifiedCount;
    }
}

export const jobRepository = new JobRepository();
