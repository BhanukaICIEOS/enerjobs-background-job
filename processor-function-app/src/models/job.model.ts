import mongoose, { Schema } from 'mongoose';

export type JobStatus = 'active' | 'expired' | 'draft' | 'closed';

export interface IJob {
    title: string;
    description: string;
    status: JobStatus;
    expiresAt: Date;
    postedAt: Date;
    companyId: mongoose.Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
}

const jobSchema = new Schema<IJob>(
    {
        title:       { type: String, required: true },
        description: { type: String, required: true },
        status:      { type: String, enum: ['active', 'expired', 'draft', 'closed'], default: 'draft' },
        expiresAt:   { type: Date, required: true },
        postedAt:    { type: Date, default: Date.now },
        companyId:   { type: Schema.Types.ObjectId, ref: 'Company', required: true },
    },
    { timestamps: true }
);

export const Job = mongoose.model<IJob>('Job', jobSchema);
