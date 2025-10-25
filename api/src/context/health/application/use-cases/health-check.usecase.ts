import { Inject, Injectable } from '@nestjs/common';
import {
  HealthServicePort,
  HealthStatus,
} from '@/context/health/domain/services/health.service';

@Injectable()
export class HealthCheckUseCase {
  constructor(
    @Inject('HealthServicePort')
    private readonly healthService: HealthServicePort,
  ) {}

  async execute(): Promise<HealthStatus> {
    return this.healthService.checkHealth();
  }
}
