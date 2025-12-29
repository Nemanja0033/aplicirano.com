import { Module } from '@nestjs/common';
import { JobApplicationStatsService } from './job-application-stats.service';
import { JobApplicationStatsController } from './job-application-stats.controller';
import { JobApplicationStatsRepository } from './repositories/job-application-stats.repository';

@Module({
  controllers: [JobApplicationStatsController],
  providers: [JobApplicationStatsService, JobApplicationStatsRepository],
})
export class JobApplicationStatsModule {}
