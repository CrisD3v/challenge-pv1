import { Module } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { HealthCheckUseCase } from './application/use-cases/health-check.usecase';
import { HealthController } from './infrastructure/controllers/health.controller';
import { PrismaHealthService } from './infrastructure/services/prisma-health.service';

/**
 * Módulo HealthModule - Configuración de inyección de dependencias para el contexto de salud
 *
 * Este módulo de NestJS configura y organiza todas las dependencias necesarias para
 * el funcionamiento del contexto de verificación de salud del sistema. Implementa
 * una arquitectura limpia con separación clara de responsabilidades y el patrón
 * Puerto-Adaptador para facilitar el testing y la extensibilidad.
 *
 * Arquitectura implementada:
 * - Controlador: Capa de presentación (endpoint HTTP /health)
 * - Caso de uso: Capa de aplicación (orquestación de verificaciones)
 * - Servicio: Capa de infraestructura (verificación específica con Prisma)
 * - Puerto: Abstracción para inversión de dependencias
 *
 * Características principales:
 * - Configuración mínima y enfocada
 * - Implementación del patrón Puerto-Adaptador
 * - Inyección de dependencias clara y explícita
 * - Fácil extensión para nuevos tipos de verificaciones
 *
 * Propósito del contexto:
 * - Proporcionar endpoint estándar de health check
 * - Verificar conectividad de componentes críticos
 * - Facilitar monitoreo y diagnóstico del sistema
 * - Soportar estrategias de despliegue y load balancing
 */
@Module({
  /**
   * Controladores registrados en este módulo
   *
   * HealthController expone el endpoint GET /health para verificaciones
   * de salud del sistema, compatible con estándares de monitoreo.
   */
  controllers: [HealthController],

  /**
   * Proveedores de servicios y dependencias
   *
   * Configuración de inyección de dependencias que incluye:
   * - Servicios de infraestructura (PrismaService)
   * - Implementaciones de servicios de salud (PrismaHealthService)
   * - Casos de uso de aplicación (HealthCheckUseCase)
   * - Configuración de puertos para inversión de dependencias
   */
  providers: [
    /**
     * PrismaService - Servicio de acceso a base de datos
     *
     * Proporciona la conexión y operaciones de base de datos necesarias
     * para que PrismaHealthService pueda verificar la conectividad.
     */
    PrismaService,

    /**
     * PrismaHealthService - Implementación concreta de verificación de salud
     *
     * Implementa HealthServicePort usando Prisma ORM para verificar
     * el estado de la base de datos mediante consultas simples.
     */
    PrismaHealthService,

    /**
     * HealthCheckUseCase - Caso de uso de aplicación
     *
     * Orquesta las verificaciones de salud del sistema, actuando como
     * intermediario entre el controlador y los servicios de dominio.
     */
    HealthCheckUseCase,

    /**
     * Configuración del puerto para inversión de dependencias
     *
     * Esta configuración permite que HealthCheckUseCase dependa de la
     * abstracción HealthServicePort en lugar de la implementación concreta
     * PrismaHealthService. Esto facilita:
     *
     * - Testing con implementaciones mock
     * - Cambio de implementaciones sin afectar la lógica de aplicación
     * - Extensión para múltiples tipos de verificaciones
     * - Cumplimiento del principio de inversión de dependencias
     *
     * Patrón implementado: Puerto-Adaptador (Hexagonal Architecture)
     */
    { provide: 'HealthServicePort', useExisting: PrismaHealthService },
  ],
})
export class HealthModule { }
