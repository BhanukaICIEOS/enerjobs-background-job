import mongoose from 'mongoose';
import { jobRepository } from '../repositories/job.repository';

class JobExpiryService {
    async processExpiredJobs(): Promise<number> {
        const expiredJobs = await jobRepository.findActiveExpired();

        if (expiredJobs.length === 0) return 0;

        const ids = expiredJobs.map(job => job._id as mongoose.Types.ObjectId);
        const updatedCount = await jobRepository.bulkMarkExpired(ids);

        return updatedCount;
    }
}

export const jobExpiryService = new JobExpiryService();
