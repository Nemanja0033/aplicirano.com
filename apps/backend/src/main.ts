import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { AuthGuard } from './application/common/guards/firebase-auth.guard';
import { PrismaExceptionFilter } from './application/common/filters/prisma-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: '*',
  })
  
  app.useGlobalGuards(app.get(AuthGuard));
  app.useGlobalFilters(app.get(PrismaExceptionFilter))
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
