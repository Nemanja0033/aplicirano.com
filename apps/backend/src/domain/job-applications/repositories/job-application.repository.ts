import { Injectable } from "@nestjs/common";
import { Job, User } from "@prisma/client";
import { JobCreateInput, JobCreateManyInput } from "generated/prisma/models";
import { PrismaService } from "src/infrastrucutre/database/prisma.service";

@Injectable()
export class JobApplicationsRepository {
    constructor(private readonly db: PrismaService){}

    async getMockJobs(): Promise<any> {
        return this.db.job.findMany()
    }

    async getAll(userId: string): Promise<Job[]> {
        return this.db.job.findMany({
            where: { userId },
            orderBy: { appliedAt: "desc" }
        });
    }

    // TODO check if possible to apply Type from ORM?
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