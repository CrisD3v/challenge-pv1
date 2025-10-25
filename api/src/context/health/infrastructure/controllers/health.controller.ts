import { HealthCheckUseCase } from '@context/health/application/use-cases/health-check.usecase';
import { HealthStatus } from '@context/health/domain/services/health.service';
import { Controller, Get } from '@nestjs/common';

/**
 * Controlador HealthController - Endpoint HTTP para verificación de salud del sistema
 *
 * Este controlador implementa la capa de presentación para el contexto de health,
 * exponiendo un endpoint RESTful que permite a sistemas externos (load balancers,
 * monitores, herramientas de despliegue) verificar el estado de salud de la aplicación.
 *
 * Características principales:
 * - Endpoint simple y estándar para health checks
 * - Respuesta estructurada y consistente
 * - Integración con casos de uso de aplicación
 * - Compatible con estándares de monitoreo
 *
 * Casos de uso típicos:
 * - Load balancers verificando disponibilidad de instancias
 * - Sistemas de monitoreo (Prometheus, Grafana, etc.)
 * - Herramientas de CI/CD verificando despliegues exitosos
 * - Diagnóstico manual de problemas del sistema
 * - Verificaciones automáticas de infraestructura
 *
 * Estándares implementados:
 * - Endpoint en ruta /health (convención estándar)
 * - Método GET (operación idempotente y segura)
 * - Respuesta JSON estructurada
 * - Códigos de estado HTTP apropiados
 */
@Controller('health')
export class HealthController {
  /**
   * Constructor del controlador
   *
   * @param healthCheckUseCase - Caso de uso para verificación de salud del sistema
   */
  constructor(private readonly healthCheckUseCase: HealthCheckUseCase) { }

  /**
   * Endpoint para verificación del estado de salud del sistema
   *
   * Este endpoint proporciona información en tiempo real sobre el estado
   * del sistema y sus componentes críticos. Es el punto de entrada principal
   * para todas las verificaciones de salud externas.
   *
   * Características del endpoint:
   * - Ruta: GET /health
   * - Operación rápida (típicamente < 100ms)
   * - Respuesta estructurada y consistente
   * - Sin autenticación requerida (público para monitoreo)
   * - Idempotente y sin efectos secundarios
   *
   * Códigos de respuesta HTTP:
   * - 200 OK: Sistema funcionando correctamente
   * - 500 Internal Server Error: Sistema con problemas críticos
   *
   * @returns Promise que resuelve al estado actual completo del sistema
   *
   * @example
   * // Solicitud
   * GET /health
   *
   * // Respuesta exitosa (200 OK)
   * {
   *   "status": "ok",
   *   "database": "connected",
   *   "timestamp": "2023-01-01T12:00:00.000Z"
   * }
   *
   * // Respuesta con problemas (200 OK con status: error)
   * {
   *   "status": "error",
   *   "database": "disconnected",
   *   "timestamp": "2023-01-01T12:00:00.000Z"
   * }
   *
   * // Uso con curl
   * curl -X GET http://localhost:3000/health
   *
   * // Uso en scripts de monitoreo
   * const response = await fetch('/health');
   * const health = await response.json();
   * if (health.status === 'ok') {
   *   console.log('Sistema saludable');
   * } else {
   *   console.error('Sistema con problemas');
   * }
   */
  @Get()
  async check(): Promise<HealthStatus> {
    // Delegar la verificación al caso de uso de aplicación
    // El caso de uso orquesta las verificaciones necesarias
    // y retorna un estado consolidado del sistema
    return this.healthCheckUseCase.execute();
  }
}
