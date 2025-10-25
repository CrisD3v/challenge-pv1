export interface HealthStatus {
  status: 'ok' | 'error';
  database: 'connected' | 'disconnected';
  timestamp: string;
}

export abstract class HealthServicePort {
  abstract checkHealth(): Promise<HealthStatus>;
}
