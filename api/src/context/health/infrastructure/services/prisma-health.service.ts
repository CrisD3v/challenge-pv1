import {
  HealthServicePort,
  HealthStatus,
} from '@context/health/domain/services/health.service';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '@prisma/prisma.service';

/**
 * Servicio PrismaHealthService - Implementación de verificación de salud usando Prisma ORM
 *
 * Esta implementación concreta del puerto HealthServicePort proporciona verificación
 * de salud específica para sistemas que utilizan Prisma como ORM para acceso a datos.
 * Verifica la conectividad y disponibilidad de la base de datos mediante una consulta
 * simple y eficiente.
 *
 * Características de la implementación:
 * - Verificación rápida mediante consulta SELECT 1
 * - Manejo robusto de errores de conectividad
 * - Timestamps precisos en formato ISO 8601
 * - Inyección de dependencias de PrismaService
 * - Implementación del patrón Puerto-Adaptador
 *
 * Ventajas de esta implementación:
 * - Consulta mínima que no afecta el rendimiento
 * - Compatible con múltiples tipos de base de datos (PostgreSQL, MySQL, SQLite, etc.)
 * - Manejo de errores transparente y consistente
 * - Fácil testing mediante mocking de PrismaService
 *
 * Casos de uso típicos:
 * - Health checks para aplicaciones web con Prisma
 * - Monitoreo de conectividad de base de datos
 * - Verificaciones de despliegue en producción
 * - Diagnóstico de problemas de infraestructura
 */
@Injectable()
export class PrismaHealthService implements HealthServicePort {
  /**
   * Constructor del servicio
   *
   * @param prisma - Instancia del servicio Prisma para acceso a la base de datos
   */
  constructor(private readonly prisma: PrismaService) { }

  /**
   * Verifica el estado de salud del sistema usando Prisma ORM
   *
   * Esta implementación realiza una verificación completa del estado del sistema:
   *
   * 1. **Verificación de base de datos**: Ejecuta una consulta simple (SELECT 1)
   *    para verificar que la conexión esté activa y la base de datos responda
   *
   * 2. **Manejo de errores**: Captura cualquier error de conectividad o
   *    configuración y retorna un estado de error apropiado
   *
   * 3. **Timestamp preciso**: Genera un timestamp ISO 8601 del momento exacto
   *    de la verificación para trazabilidad
   *
   * La consulta SELECT 1 es una práctica estándar para health checks porque:
   * - Es extremadamente rápida (no accede a tablas reales)
   * - Verifica la conectividad completa al servidor de base de datos
   * - Es compatible con todos los motores de base de datos
   * - Tiene impacto mínimo en el rendimiento del sistema
   *
   * @returns Promise que resuelve al estado actual del sistema
   *
   * @example
   * // Estado exitoso
   * {
   *   "status": "ok",
   *   "database": "connected",
   *   "timestamp": "2023-01-01T12:00:00.000Z"
   * }
   *
   * // Estado con error
   * {
   *   "status": "error",
   *   "database": "disconnected",
   *   "timestamp": "2023-01-01T12:00:00.000Z"
   * }
   */
  async checkHealth(): Promise<HealthStatus> {
    try {
      // Ejecutar consulta simple para verificar conectividad
      // SELECT 1 es una consulta estándar que:
      // - No requiere acceso a tablas específicas
      // - Verifica que la conexión esté activa
      // - Es extremadamente rápida
      // - Es compatible con todos los motores de BD
      await this.prisma.$queryRawUnsafe('SELECT 1');

      // Si la consulta es exitosa, el sistema está funcionando correctamente
      return {
        status: 'ok',
        database: 'connected',
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      // Si hay cualquier error (conectividad, configuración, etc.),
      // retornar estado de error con información del problema
      return {
        status: 'error',
        database: 'disconnected',
        timestamp: new Date().toISOString(),
      };
    }
  }
}
