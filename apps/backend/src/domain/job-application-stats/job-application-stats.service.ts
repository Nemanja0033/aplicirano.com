import { BadRequestException, Injectable } from '@nestjs/common';
import { StatsQueryDto } from './dto/stats-query.dto';
import { format } from 'date-fns';
import { JobApplicationStatsRepository } from './repositories/job-application-stats.repository';

@Injectable()
export class JobApplicationStatsService {
    constructor(private readonly jobrepo: JobApplicationStatsRepository){}

    async getJobApplicationStats(statsQuery: StatsQueryDto, user: { id: string }){
        const { start, end } = statsQuery;

        if(!start || !end){
            throw new BadRequestException("Missing date range");
        }

        const jobs = await this.jobrepo.getAllJobsByDateRange(start, end, user.id);

        if (jobs.length === 0) {
            return  {
                totalApplies: 0,
                totalInterviews: [],
                totalRejected: [],
                averageAppliesPerDay: 0,
                appliesPerDay: {},
                activeDays: [],
                interviewsPercentage: 0,
              }
        }

        const allAppliedDates = [jobs[0].appliedAt];

        // iterate through jobs and take one date for one day
        for (let i = 1; i < jobs.length; i++) {
            if (jobs[i].appliedAt.toISOString().split('T')[0] !== jobs[i - 1].appliedAt.toISOString().split('T')[0]) {
                allAppliedDates.push(jobs[i].appliedAt);
            }
        }

          // Data that will be send to client 
        //  1. Total Applies amount
        //  2. Total Rejected amount
        //  3. Total Interviews amount 
        //  4. All applying days (dates)
        //  5. Average applies per day
        //  6. Number of applies on each day
        //  7. All active days.
        //  8. Percentage of interview calls
        
        const totalApplies = jobs.length;
        const totalRejected = jobs.filter((job) => job.status === "REJECTED");
        const totalInterviews = jobs.filter((job) => job.status === "INTERVIEW");
        const totalApplyingDays = allAppliedDates;
        const averageAppliesPerDay = Math.floor(totalApplies / allAppliedDates.length);
        const activeDays = allAppliedDates;
        const interviewsPercentage = totalApplies > 0 ? Math.floor((totalInterviews.length / totalApplies) * 100) : 0;

        // Calculate the amount of applies for each applying day.
        const appliesPerDay: Record<string, number> = {};
        for(let i = 0; i < totalApplyingDays.length; i++){
            const jobsAppliedOnSameDate = jobs.filter((job) => job.appliedAt.toISOString().split('T')[0] === totalApplyingDays[i].toISOString().split('T')[0])
            appliesPerDay[format(totalApplyingDays[i], 'yyyy-MM-dd')] = jobsAppliedOnSameDate.length;
        }

        return {
            totalApplies,
            totalRejected,
            totalInterviews,
            totalApplyingDays,
            averageAppliesPerDay,
            activeDays,
            appliesPerDay,
            interviewsPercentage
        }

    }
}
