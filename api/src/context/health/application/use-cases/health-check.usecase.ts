import {
  HealthServicePort,
  HealthStatus,
} from '@/context/health/domain/services/health.service';
import { Inject, Injectable } from '@nestjs/common';

/**
 * Caso de Uso HealthCheckUseCase - Verificación del estado de salud del sistema
 *
 * Este caso de uso encapsula la lógica de aplicación para verificar el estado
 * de salud del sistema y sus componentes críticos. Actúa como orquestador
 * entre la capa de presentación (controladores) y los servicios de dominio
 * que realizan las verificaciones específicas.
 *
 * Responsabilidades:
 * - Coordinar la verificación de salud del sistema
 * - Delegar las verificaciones específicas al servicio de dominio
 * - Proporcionar una interfaz simple para la capa de presentación
 * - Mantener la separación de responsabilidades arquitectónicas
 *
 * Características:
 * - Operación simple sin lógica de negocio compleja
 * - Inyección de dependencias mediante puerto (abstracción)
 * - Retorna estado estructurado del sistema
 * - Operación asíncrona para no bloquear el sistema
 *
 * Casos de uso típicos:
 * - Endpoints de health check para load balancers
 * - Monitoreo automático de sistemas
 * - Diagnóstico manual de problemas
 * - Verificaciones de despliegue (deployment health checks)
 */
@Injectable()
export class HealthCheckUseCase {
  /**
   * Constructor del caso de uso
   *
   * @param healthService - Servicio de verificación de salud inyectado mediante puerto
   *                       Permite diferentes implementaciones (Prisma, MongoDB, etc.)
   */
  constructor(
    @Inject('HealthServicePort')
    private readonly healthService: HealthServicePort,
  ) { }

  /**
   * Ejecuta la verificación completa del estado de salud del sistema
   *
   * Esta operación coordina la verificación de todos los componentes críticos
   * del sistema, delegando las verificaciones específicas al servicio de dominio
   * configurado. El resultado proporciona una visión integral del estado del sistema.
   *
   * Flujo de ejecución:
   * 1. Delegar verificación al servicio de dominio
   * 2. El servicio verifica componentes críticos (base de datos, etc.)
   * 3. Retornar estado consolidado con timestamp
   *
   * @returns Promise que resuelve al estado actual completo del sistema
   *
   * @example
   * const healthCheckUseCase = new HealthCheckUseCase(healthService);
   * const status = await healthCheckUseCase.execute();
   *
   * console.log(`Sistema: ${status.status}`);
   * console.log(`Base de datos: ${status.database}`);
   * console.log(`Verificado en: ${status.timestamp}`);
   *
   * // Ejemplo de respuesta:
   * // {
   * //   "status": "ok",
   * //   "database": "connected",
   * //   "timestamp": "2023-01-01T12:00:00.000Z"
   * // }
   */
  async execute(): Promise<HealthStatus> {
    // Delegar la verificación completa al servicio de dominio
    // El servicio implementa la lógica específica de verificación
    // según la tecnología utilizada (Prisma, MongoDB, etc.)
    return this.healthService.checkHealth();
  }
}
