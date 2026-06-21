import mongoose from 'mongoose';
import { Job, IJob } from '../models/job.model';

class JobRepository {
    findActiveExpired(): Promise<(IJob & { _id: mongoose.Types.ObjectId })[]> {
        return Job.find({
            status: 'active',
            expiresAt: { $lte: new Date() },
        }).lean();
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
