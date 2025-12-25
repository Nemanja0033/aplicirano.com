import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  ConflictException,
  NotFoundException,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';

@Catch(Prisma.PrismaClientKnownRequestError)
export class PrismaExceptionFilter implements ExceptionFilter {
  catch(exception: Prisma.PrismaClientKnownRequestError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();

    switch (exception.code) {
      case 'P2002':
        throw new ConflictException('Unique constraint violation');
      case 'P2003':
        throw new BadRequestException('Foreign key constraint failed');
      case 'P2025':
        throw new NotFoundException('Record not found');
      default:
        throw new InternalServerErrorException('Database error');
    }
  }
}
