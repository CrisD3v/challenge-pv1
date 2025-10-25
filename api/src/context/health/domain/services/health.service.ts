/**
 * Interfaz HealthStatus - Representa el estado de salud del sistema
 *
 * Esta interfaz define la estructura de datos que describe el estado actual
 * del sistema y sus componentes críticos. Se utiliza para monitoreo,
 * diagnóstico y verificación de la disponibilidad del servicio.
 *
 * Propósitos principales:
 * - Monitoreo de salud del sistema en tiempo real
 * - Diagnóstico de problemas de conectividad
 * - Verificación de disponibilidad para load balancers
 * - Alertas automáticas en caso de fallos
 */
export interface HealthStatus {
  /**
   * Estado general del sistema
   *
   * - 'ok': Sistema funcionando correctamente
   * - 'error': Sistema con problemas críticos
   */
  status: 'ok' | 'error';

  /**
   * Estado de la conexión a la base de datos
   *
   * - 'connected': Base de datos accesible y respondiendo
   * - 'disconnected': Base de datos no accesible o con problemas
   */
  database: 'connected' | 'disconnected';

  /**
   * Timestamp del momento en que se realizó la verificación
   *
   * Formato ISO 8601 para compatibilidad internacional
   *
   * @example "2023-01-01T12:00:00.000Z"
   */
  timestamp: string;
}

/**
 * Puerto HealthServicePort - Abstracción para servicios de verificación de salud
 *
 * Este puerto define el contrato que deben implementar los servicios concretos
 * de verificación de salud del sistema. Siguiendo el principio de inversión
 * de dependencias, permite que la capa de aplicación dependa de una abstracción
 * en lugar de implementaciones específicas.
 *
 * Implementaciones típicas:
 * - PrismaHealthService: Verificación usando Prisma ORM
 * - MongoHealthService: Verificación para bases de datos MongoDB
 * - RedisHealthService: Verificación para cache Redis
 * - CompositeHealthService: Verificación de múltiples servicios
 *
 * Características del puerto:
 * - Operación asíncrona para no bloquear el hilo principal
 * - Retorna estado estructurado y consistente
 * - Abstrae detalles de implementación específicos
 * - Facilita testing con implementaciones mock
 */
export abstract class HealthServicePort {
  /**
   * Verifica el estado de salud del sistema y sus componentes
   *
   * Esta operación debe ser rápida y eficiente, ya que típicamente
   * se ejecuta con frecuencia por sistemas de monitoreo externos.
   *
   * Responsabilidades de la implementación:
   * - Verificar conectividad a servicios críticos
   * - Evaluar el estado general del sistema
   * - Generar timestamp preciso de la verificación
   * - Manejar errores de forma robusta
   *
   * @returns Promise que resuelve al estado actual del sistema
   *
   * @example
   * const healthService = new PrismaHealthService(prisma);
   * const status = await healthService.checkHealth();
   *
   * if (status.status === 'ok') {
   *   console.log('Sistema funcionando correctamente');
   * } else {
   *   console.error('Sistema con problemas:', status);
   * }
   */
  abstract checkHealth(): Promise<HealthStatus>;
}
