import { Controller, Get, Post, Req, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { AuthGuard } from 'src/firebase/firebase-auth.guard';
import { UploadFileInterceptor } from '../interceptors/upload-file.interceptor';
import { JobApplicationsService } from '../service/job-applications.service';
import { User } from 'src/common/decorators/user.decorator';

@Controller('jobs')
@UseGuards(AuthGuard)
// @UseInterceptors(UploadFileInterceptor())

export class JobApplicationsController {
    constructor (private readonly jobService: JobApplicationsService) {}
    
    @Get()
    async getJobs(@User() user: { uid: string }) {
        return this.jobService.getJobs(user.uid) 
    }

    @Post('batch')
    @UseInterceptors(UploadFileInterceptor())
    async batchUploadJobs(@UploadedFile() file, @User() user: { uid: string }){
        
    }
}
