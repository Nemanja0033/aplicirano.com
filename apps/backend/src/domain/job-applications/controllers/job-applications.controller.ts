import { Controller, Get, Post, Req, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { UploadFileInterceptor } from '../../../application/common/interceptors/upload-file.interceptor';
import { JobApplicationsService } from '../services/job-applications.service';
import { User } from 'src/application/common/decorators/user.decorator';

@Controller('jobs')
export class JobApplicationsController {
    constructor (private readonly jobService: JobApplicationsService) {}
    
    @Get()
    async getJobs(@User() user: { id: string }) {
        return this.jobService.getJobs(user.id) 
    }

    @Post('batch')
    @UseInterceptors(UploadFileInterceptor())
    async uploadJobsFromFile(@UploadedFile() file, @User() user: { id: string }){
        return this.jobService.uploadJobsFromFile(file, user.id)
    }
}
