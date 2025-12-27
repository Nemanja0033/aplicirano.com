import { Module } from '@nestjs/common';
import { ChatbotService } from './chatbot.service';
import { ChatbotController } from './chatbot.controller';
import { UsersModule } from '../users/users.module';
import { JobApplicationsModule } from '../job-applications/job-applications.module';
import { OpenAiModule } from 'src/infrastrucutre/openai/openai.module';

@Module({
  imports: [UsersModule, JobApplicationsModule, OpenAiModule],
  controllers: [ChatbotController],
  providers: [ChatbotService],
})
export class ChatbotModule {}
