import { Controller, Get, Query } from '@nestjs/common';
import { JobApplicationStatsService } from './job-application-stats.service';
import { StatsQueryDto } from './dto/stats-query.dto';
import { User } from 'src/application/common/decorators/user.decorator';

@Controller('stats')
export class JobApplicationStatsController {
  constructor(private readonly jobApplicationStatsService: JobApplicationStatsService) {}

  @Get()
  async getJobApplicationStats(@Query() statsQuery: StatsQueryDto, @User() user: { id: string}){
    console.log("statsQuery", statsQuery);
    return await this.jobApplicationStatsService.getJobApplicationStats(statsQuery, user);
  }
}
