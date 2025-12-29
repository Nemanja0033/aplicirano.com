import { Injectable } from "@nestjs/common";
import { Job } from "@prisma/client";
import { startOfDay, endOfDay } from "date-fns";
import { JobCreateInput, JobCreateManyInput } from "generated/prisma/models";
import { PrismaService } from "src/infrastrucutre/database/prisma.service";

@Injectable()
export class JobApplicationsRepository {
    constructor(private readonly db: PrismaService){}

    async getAll(userId: string): Promise<Job[]> {
        return this.db.job.findMany({
            where: { userId },
            orderBy: { appliedAt: "desc" }
        });
    }

    // Find all user jobs with interview status
    async getInterviewJobs(userId: string): Promise<Job[]> {
        return this.db.job.findMany({
            where: {
                userId,
                status: "INTERVIEW"
            }
        })
    }

    async getJobsByDateRange(userId: string, start: string, end: string): Promise<Job[]> {
        return this.db.job.findMany({
            where: {
                userId,
                appliedAt: {
                    gte: startOfDay(start),
                    lte: endOfDay(end)
                }
            },
        })
    }

    async batchInsert(jobs: JobCreateManyInput[]): Promise<number> {
        const result = await this.db.job.createMany({ 
            data: jobs,
        });

        return result.count;
    }

    async insertSingle(job: JobCreateInput) : Promise<Job> {
        return this.db.job.create({
            data: job
        });

    }
}