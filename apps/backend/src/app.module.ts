import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './infrastrucutre/database/prisma.module';
import { JobApplicationsModule } from './domain/job-applications/job-applications.module';
import { UsersModule } from './domain/users/users.module';
import { FirebaseModule } from './infrastrucutre/firebase/firebase.module';
import { AuthGuard } from './application/common/guards/firebase-auth.guard';
import { PrismaExceptionFilter } from './application/common/filters/prisma-exception.filter';
import { JobApplicationsRepository } from './domain/job-applications/repositories/job-application.repository';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    FirebaseModule,
    PrismaModule,
    JobApplicationsModule,
    UsersModule,
  ],
  providers: [
    JobApplicationsRepository,
    AuthGuard,
    PrismaExceptionFilter,
  ],
  exports: [
    AuthGuard,
    PrismaExceptionFilter,
  ],
})
export class AppModule {}
