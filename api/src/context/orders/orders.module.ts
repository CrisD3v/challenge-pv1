import { Module } from '@nestjs/common';
import { PrismaService } from '@prisma/prisma.service';

// Controladores
import { OrdersController } from '@context/orders/infrastructure/controllers/orders.controller';

// Repositorios
import { PrismaOrderRepository } from '@context/orders/infrastructure/repositories/prisma-order.repository';

// Casos de uso
import { CancelOrderUseCase } from '@context/orders/application/use-cases/cancel-order.usecase';
import { CreateOrderUseCase } from '@context/orders/application/use-cases/create-order.usecase';
import { GetAllOrdersUseCase } from '@context/orders/application/use-cases/get-all-orders.usecase';
import { GetOrderStatsUseCase } from '@context/orders/application/use-cases/get-order-stats.usecase';
import { GetOrderUseCase } from '@context/orders/application/use-cases/get-order.usecase';
import { GetOrdersByStatusUseCase } from '@context/orders/application/use-cases/get-orders-by-status.usecase';
import { UpdateOrderStatusUseCase } from '@context/orders/application/use-cases/update-order-status.usecase';

/**
 * Módulo principal del contexto de órdenes
 * Configura la inyección de dependencias siguiendo los principios de arquitectura hexagonal
 */
@Module({
  controllers: [OrdersController],
  providers: [
    // Servicios de infraestructura
    PrismaService,

    // Repositorios concretos
    PrismaOrderRepository,

    // Casos de uso
    CreateOrderUseCase,
    GetOrderUseCase,
    GetAllOrdersUseCase,
    UpdateOrderStatusUseCase,
    CancelOrderUseCase,
    GetOrdersByStatusUseCase,
    GetOrderStatsUseCase,

    // Inyección de dependencias - Puertos apuntando a adaptadores
    { provide: 'OrderRepositoryPort', useExisting: PrismaOrderRepository },
  ],
  exports: [
    // Exportar casos de uso para uso en otros módulos si es necesario
    CreateOrderUseCase,
    GetOrderUseCase,
    GetAllOrdersUseCase,
    UpdateOrderStatusUseCase,
    CancelOrderUseCase,
    GetOrdersByStatusUseCase,
    GetOrderStatsUseCase,
  ],
})
export class OrdersModule { }
