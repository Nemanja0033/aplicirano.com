export interface StatsData {
    totalApplies: number;
    totalInterviews: Job[];
    totalRejected: Job[];
    appliesPerDay: any;
    averageAppliesPerDay: number;
    activeDays: string[];
    interviewsPercentage: number
}