import { Module } from '@nestjs/common';
import { JobApplicationsController } from './controllers/job-applications.controller';
import { JobApplicationsService } from './services/job-applications.service';
import { JobApplicationsRepository } from './repositories/job-application.repository';

@Module({
  controllers: [JobApplicationsController],
  providers: [JobApplicationsService, JobApplicationsRepository],
  exports: [JobApplicationsRepository]
})
export class JobApplicationsModule {}
