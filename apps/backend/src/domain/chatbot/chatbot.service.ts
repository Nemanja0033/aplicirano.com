import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { UserRepository } from '../users/repositories/user.repository';
import { JobApplicationsRepository } from '../job-applications/repositories/job-application.repository';
import OpenAI from 'openai';
import { SendMessageDto } from './dto/send-message.dto';

@Injectable()
export class ChatbotService {
    constructor(
        private readonly userRepo: UserRepository,
        private readonly jobRepo: JobApplicationsRepository,
        @Inject('OPENAI_CLIENT') private readonly openai: OpenAI
    ){}

    async sendOpenaiResponse(message: string, userId: string){
        if(!message){
            throw new BadRequestException("Missing Message!");
        }

        const user = await this.userRepo.findUserById(userId);

        const currentDate = new Date();
        const pastWeekDate = new Date(currentDate);
        pastWeekDate.setDate(currentDate.getDate() - 30);

        const start = pastWeekDate.toISOString().split('T')[0];
        const end = currentDate.toISOString().split('T')[0];

        const interviewJobs = await this.jobRepo.getInterviewJobs(userId);
        const jobToAnalyze = await this.jobRepo.getJobsByDateRange(userId, start, end);

        const seriazliedJobsInterviews = JSON.stringify(interviewJobs, null, 2);
        const serializedJobToAnalyze = JSON.stringify(jobToAnalyze, null, 2);

        const systemPrompt = process.env.SYSTEM_PROMPT;

        const response  = await this.openai.chat.completions.create({
            model: "gpt-4.1-mini",
            messages: [
              { 
                  role: "system", 
                  content: `Here is the user's personal data to always consider:
      
                  User Data:
                  - Name: ${user?.username}
                  - Interview Calls ${seriazliedJobsInterviews}
                  - Analyze this recent jobs and send statistics or relative info user want ${serializedJobToAnalyze}
      
                  Always use this data when generating answers.
                  ${systemPrompt}` 
              },
              { role: "user", content: message },
            ],
            temperature: 0.9,      
            max_tokens: 300,       
            top_p: 0.9,             
            presence_penalty: 0.1,
            frequency_penalty: 0.1,
        });

        const answer = response.choices[0].message;

        return answer.content;
    }
}
