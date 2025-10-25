import { Module } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { HealthCheckUseCase } from './application/use-cases/health-check.usecase';
import { HealthController } from './infrastructure/controllers/health.controller';
import { PrismaHealthService } from './infrastructure/services/prisma-health.service';

@Module({
  controllers: [HealthController],
  providers: [
    PrismaService,
    PrismaHealthService,
    HealthCheckUseCase,
    { provide: 'HealthServicePort', useExisting: PrismaHealthService },
  ],
})
export class HealthModule {}
