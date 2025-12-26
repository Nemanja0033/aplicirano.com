import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { UserRepository } from './repositories/user.repository';
import { PrismaModule } from 'src/infrastrucutre/database/prisma.module';
import { PrismaService } from 'src/infrastrucutre/database/prisma.service';

@Module({
  controllers: [UsersController],
  providers: [UsersService, UserRepository],
  exports: [UserRepository]
})
export class UsersModule {}
