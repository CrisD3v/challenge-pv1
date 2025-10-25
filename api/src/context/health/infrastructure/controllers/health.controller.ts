import { Controller, Get } from '@nestjs/common';
import { HealthCheckUseCase } from '@context/health/application/use-cases/health-check.usecase';
import { HealthStatus } from '@context/health/domain/services/health.service';

@Controller('health')
export class HealthController {
  constructor(private readonly healthCheckUseCase: HealthCheckUseCase) {}

  @Get()
  async check(): Promise<HealthStatus> {
    return this.healthCheckUseCase.execute();
  }
}
