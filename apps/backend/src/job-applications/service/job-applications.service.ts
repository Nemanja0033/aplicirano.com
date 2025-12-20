import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { JobApplicationsRepository } from '../repositories/job-application.repository';

@Injectable()
export class JobApplicationsService {
  constructor(
    private readonly repo: JobApplicationsRepository,
  ) {}

  async getMockJobs(){
    return await this.repo.getMockJobs();
  }

  async getJobs(userUid: string) {
    const user = await this.repo.findUserByFirebaseUid(userUid);

    if(!user){
      throw new ForbiddenException("User not found");
    }

    return await this.repo.getAll(user.id);
  }
}
