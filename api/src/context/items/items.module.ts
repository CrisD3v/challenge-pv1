import { Module } from '@nestjs/common';
import { PrismaService } from '@prisma/prisma.service';

// Controladores
import { EventsController } from '@context/items/infrastructure/controllers/events.controller';
import { ProductsController } from '@context/items/infrastructure/controllers/products.controller';

// Repositorios
import { PrismaEventRepository } from '@context/items/infrastructure/repositories/prisma-event.repository';
import { PrismaProductRepository } from '@context/items/infrastructure/repositories/prisma-product.repository';

// Casos de uso de productos
import { CreateProductUseCase } from '@context/items/application/use-cases/create-product.usecase';
import { DeleteProductUseCase } from '@context/items/application/use-cases/delete-product.usecase';
import { GetAllProductsUseCase } from '@context/items/application/use-cases/get-all-products.usecase';
import { GetProductUseCase } from '@context/items/application/use-cases/get-product.usecase';
import { SearchProductsUseCase } from '@context/items/application/use-cases/search-products.usecase';
import { UpdateProductUseCase } from '@context/items/application/use-cases/update-product.usecase';

// Casos de uso de eventos
import { CreateEventUseCase } from '@context/items/application/use-cases/create-event.usecase';
import { DeleteEventUseCase } from '@context/items/application/use-cases/delete-event.usecase';
import { GetAllEventsUseCase } from '@context/items/application/use-cases/get-all-events.usecase';
import { GetEventUseCase } from '@context/items/application/use-cases/get-event.usecase';
import { SearchEventsUseCase } from '@context/items/application/use-cases/search-events.usecase';
import { UpdateEventUseCase } from '@context/items/application/use-cases/update-event.usecase';

/**
 * Módulo principal del contexto de items
 * Configura la inyección de dependencias siguiendo los principios de arquitectura hexagonal
 */
@Module({
  controllers: [ProductsController, EventsController],
  providers: [
    // Servicios de infraestructura
    PrismaService,

    // Repositorios concretos
    PrismaProductRepository,
    PrismaEventRepository,

    // Casos de uso de productos
    CreateProductUseCase,
    GetProductUseCase,
    GetAllProductsUseCase,
    UpdateProductUseCase,
    DeleteProductUseCase,
    SearchProductsUseCase,

    // Casos de uso de eventos
    CreateEventUseCase,
    GetEventUseCase,
    GetAllEventsUseCase,
    UpdateEventUseCase,
    DeleteEventUseCase,
    SearchEventsUseCase,

    // Inyección de dependencias - Puertos apuntando a adaptadores
    { provide: 'ProductRepositoryPort', useExisting: PrismaProductRepository },
    { provide: 'EventRepositoryPort', useExisting: PrismaEventRepository },
  ],
  exports: [
    // Exportar casos de uso para uso en otros módulos si es necesario
    CreateProductUseCase,
    GetProductUseCase,
    GetAllProductsUseCase,
    UpdateProductUseCase,
    DeleteProductUseCase,
    SearchProductsUseCase,
    CreateEventUseCase,
    GetEventUseCase,
    GetAllEventsUseCase,
    UpdateEventUseCase,
    DeleteEventUseCase,
    SearchEventsUseCase,
  ],
})
export class ItemsModule { }
