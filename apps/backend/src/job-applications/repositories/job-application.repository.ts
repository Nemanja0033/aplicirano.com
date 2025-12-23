import { Injectable } from "@nestjs/common";
import { Job, User } from "@prisma/client";
import { PrismaService } from "src/database/prisma.service";

interface JobType {
    title: string;
    userId: string;
    status: string
}

@Injectable()
export class JobApplicationsRepository {
    constructor(private readonly db: PrismaService){}

    async getMockJobs(): Promise<any> {
        return this.db.job.findMany()
    }

    async getAll(userId: string): Promise<Job[]> {
        return this.db.job.findMany({
            where: {
                userId
            }
        });
    }

    async batchInsert(jobs: JobType[]): Promise<number> {
        const result = await this.db.job.createMany({ 
            data: jobs,
        });

        return result.count;
    }

    async insertSingle(job: JobType) : Promise<Job> {
        return this.db.job.create({
            data: job
        });

    }

    // Just for now, query for user here
    async findUserByFirebaseUid(uid: string) : Promise<User | null> {
        return this.db.user.findUnique({
            where: { firebaseUid: uid }
        });
    }
}