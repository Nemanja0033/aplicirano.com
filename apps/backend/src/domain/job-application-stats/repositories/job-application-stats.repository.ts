import { Injectable } from "@nestjs/common";
import { endOfDay, startOfDay } from "date-fns";
import { PrismaService } from "src/infrastrucutre/database/prisma.service";

@Injectable()
export class JobApplicationStatsRepository {
    constructor(private readonly db: PrismaService){}

    async getAllJobsByDateRange(start: string, end: string, userId: string){
        return this.db.job.findMany({
            where: {
                userId,
                appliedAt: {
                    gte: startOfDay(start),
                    lte: endOfDay(end)
                },
            },
            orderBy: {
                appliedAt: "asc"
            }
        })
    }
}