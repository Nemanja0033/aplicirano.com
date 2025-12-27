import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './infrastrucutre/database/prisma.module';
import { JobApplicationsModule } from './domain/job-applications/job-applications.module';
import { UsersModule } from './domain/users/users.module';
import { FirebaseModule } from './infrastrucutre/firebase/firebase.module';
import { AuthGuard } from './application/common/guards/firebase-auth.guard';
import { PrismaExceptionFilter } from './application/common/filters/prisma-exception.filter';
import { JobApplicationStatsModule } from './domain/job-application-stats/job-application-stats.module';
import { ChatbotModule } from './domain/chatbot/chatbot.module';
import { OpenAiModule } from './infrastrucutre/openai/openai.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    FirebaseModule,
    PrismaModule,
    JobApplicationsModule,
    UsersModule,
    JobApplicationStatsModule,
    ChatbotModule,
    OpenAiModule,
  ],
  providers: [
    UsersModule,
    AuthGuard,
    PrismaExceptionFilter,
  ],
  exports: [
    AuthGuard,
    PrismaExceptionFilter,
  ],
})
export class AppModule {}
