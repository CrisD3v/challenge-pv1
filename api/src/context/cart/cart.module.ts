import { AddCartItemUseCase } from '@context/cart/application/use-cases/add-cart-items.usecase';
import { AddOrIncrementCartItemUseCase } from '@context/cart/application/use-cases/add-or-increment-cart-item.usecase';
import { ClearCartUseCase } from '@context/cart/application/use-cases/clear-cart.usecase';
import { CreateCartUseCase } from '@context/cart/application/use-cases/create-cart.usecase';
import { DecrementCartItemUseCase } from '@context/cart/application/use-cases/decrement-cart-item.usecase';
import { GetAllCartsUseCase } from '@context/cart/application/use-cases/get-all-carts.usecase';
import { GetCartUseCase } from '@context/cart/application/use-cases/get-cart-item.usecase';
import { UpdateCartItemQuantityUseCase } from '@context/cart/application/use-cases/update-cart-item-quantity.usecase';
import { CartController } from '@context/cart/infrastructure/controllers/cart.controller';
import { PrismaCartRepository } from '@context/cart/infrastructure/repositories/prisma-cart.repository';
import { Module } from '@nestjs/common';
import { PrismaService } from '@prisma/prisma.service';

/**
 * Módulo CartModule - Configuración de inyección de dependencias para el contexto de carrito
 *
 * Este módulo de NestJS configura y organiza todas las dependencias necesarias para
 * el funcionamiento del contexto de carrito de compras. Implementa el patrón de
 * inyección de dependencias y la inversión de control, permitiendo que las capas
 * superiores dependan de abstracciones en lugar de implementaciones concretas.
 *
 * Arquitectura implementada:
 * - Controladores: Capa de presentación (HTTP endpoints)
 * - Casos de uso: Capa de aplicación (lógica de negocio)
 * - Repositorios: Capa de infraestructura (persistencia)
 * - Puertos: Interfaces que definen contratos entre capas
 *
 * Características principales:
 * - Configuración completa de inyección de dependencias
 * - Implementación del patrón Puerto-Adaptador
 * - Exportación de casos de uso para reutilización
 * - Separación clara de responsabilidades por capas
 *
 * Dependencias configuradas:
 * - PrismaService: Servicio de base de datos
 * - PrismaCartRepository: Implementación concreta del repositorio
 * - CartRepositoryPort: Puerto (interface) para inversión de dependencias
 * - Casos de uso: Lógica de aplicación encapsulada
 * - CartController: Endpoints HTTP RESTful
 */
@Module({
  /**
   * Controladores registrados en este módulo
   *
   * Los controladores actúan como la capa de presentación, exponiendo
   * endpoints HTTP que traducen las peticiones web a llamadas de casos de uso.
   */
  controllers: [CartController],

  /**
   * Proveedores de servicios y dependencias
   *
   * Configuración de inyección de dependencias que incluye:
   * - Servicios de infraestructura (PrismaService)
   * - Implementaciones de repositorios (PrismaCartRepository)
   * - Casos de uso de aplicación (todos los use cases)
   * - Configuración de puertos para inversión de dependencias
   */
  providers: [
    // Servicio de base de datos Prisma
    PrismaService,

    // Implementación concreta del repositorio de carritos
    PrismaCartRepository,

    // Casos de uso de aplicación - Encapsulan la lógica de negocio
    CreateCartUseCase,              // Crear nuevos carritos
    AddCartItemUseCase,             // Agregar elementos básico
    GetCartUseCase,                 // Obtener carrito por ID
    UpdateCartItemQuantityUseCase,  // Actualizar cantidades específicas
    ClearCartUseCase,               // Limpiar carritos completamente
    GetAllCartsUseCase,             // Obtener todos los carritos
    AddOrIncrementCartItemUseCase,  // Agregar con lógica inteligente
    DecrementCartItemUseCase,       // Decrementar cantidades

    /**
     * Configuración del puerto para inversión de dependencias
     *
     * Esta configuración permite que los casos de uso dependan de la interfaz
     * ICartRepository (puerto) en lugar de la implementación concreta
     * PrismaCartRepository. Esto facilita el testing y permite cambiar
     * implementaciones sin afectar la lógica de negocio.
     *
     * Patrón implementado: Puerto-Adaptador (Hexagonal Architecture)
     */
    { provide: 'CartRepositoryPort', useExisting: PrismaCartRepository },
  ],

  /**
   * Servicios exportados para uso en otros módulos
   *
   * Los casos de uso exportados pueden ser inyectados en otros contextos
   * o módulos que necesiten interactuar con la funcionalidad del carrito.
   * Esto permite la composición de funcionalidades entre diferentes contextos.
   *
   * Casos de uso típicos de reutilización:
   * - Módulo de órdenes: necesita acceso a carritos para crear órdenes
   * - Módulo de reportes: necesita estadísticas de carritos
   * - Módulo de notificaciones: necesita información de carritos abandonados
   */
  exports: [
    CreateCartUseCase,
    AddCartItemUseCase,
    GetCartUseCase,
    UpdateCartItemQuantityUseCase,
    ClearCartUseCase,
    GetAllCartsUseCase,
    AddOrIncrementCartItemUseCase,
    DecrementCartItemUseCase,
  ],
})
export class CartModule { }
