import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { FirebaseModule } from './firebase/firebase.module';
import { PrismaModule } from './database/prisma.module';
import { JobApplicationsModule } from './job-applications/job-applications.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, 
    }),
    FirebaseModule,
    PrismaModule,
    JobApplicationsModule
  ],
})
export class AppModule {}
