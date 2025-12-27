import { BadRequestException, ForbiddenException, Injectable } from '@nestjs/common';
import { JobApplicationsRepository } from '../repositories/job-application.repository';

@Injectable()
export class JobApplicationsService {
  constructor(
    private readonly repo: JobApplicationsRepository,
  ) {}

  async getJobs(userId: string) {
    return await this.repo.getAll(userId);
  }

  async uploadJobsFromFile(file: Express.Multer.File, userId: string){
    const parsedText = file.buffer.toString("utf-8");

    const splitedTitles = parsedText
    .split("-")
    .map((title) => title.trim());

    const invalidJobs = splitedTitles.filter((title) => title.length === 0 && title.length >= 30);
    const validJobs = splitedTitles.filter((title) => title.length > 0 && title.length < 30);
    
    if(validJobs.length > 50){
      throw new BadRequestException("Maximum 50 jobs per upload!");
    }

    const mappedJobs = validJobs.map((job) => ({ title: job, status: "APPLIED", userId }));
    console.log("@MAPPED JOBS", mappedJobs)

    // this returns count of inserted jobs (50max)
    const succesfullyInserted = await this.repo.batchInsert(mappedJobs);

    return {
      succesfullyInserted,
      failedToInsert: invalidJobs.length
    }
  }
}
