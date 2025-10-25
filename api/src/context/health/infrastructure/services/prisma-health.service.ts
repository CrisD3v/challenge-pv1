import { Injectable } from '@nestjs/common';
import { PrismaService } from '@prisma/prisma.service';
import {
  HealthServicePort,
  HealthStatus,
} from '@context/health/domain/services/health.service';

@Injectable()
export class PrismaHealthService implements HealthServicePort {
  constructor(private readonly prisma: PrismaService) {}

  async checkHealth(): Promise<HealthStatus> {
    try {
      await this.prisma.$queryRawUnsafe('SELECT 1');
      return {
        status: 'ok',
        database: 'connected',
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      return {
        status: 'error',
        database: 'disconnected',
        timestamp: new Date().toISOString(),
      };
    }
  }
}
