import { CreateOrderDto } from '@context/orders/application/dtos/create-order.dto';
import { Order } from '@context/orders/domain/entities/order.entity';
import { InvalidOrderDataException } from '@context/orders/domain/exceptions/invalid-order-data.exception';
import type { IOrderRepository } from '@context/orders/domain/repositories/order.repository.port';
import { Inject, Injectable } from '@nestjs/common';

/**
 * Caso de uso para crear una nueva orden
 * Orquesta la lógica de negocio para la creación de órdenes
 */
@Injectable()
export class CreateOrderUseCase {
  constructor(
    @Inject('OrderRepositoryPort')
    private readonly orderRepository: IOrderRepository,
  ) { }

  /**
   * Ejecuta la creación de una nueva orden
   * @param dto - Datos de la orden a crear
   * @returns Orden creada
   * @throws InvalidOrderDataException si los datos son inválidos
   */
  async execute(dto: CreateOrderDto): Promise<Order> {
    // Validar que la orden tenga items
    if (!dto.items || dto.items.length === 0) {
      throw new InvalidOrderDataException('La orden debe tener al menos un item');
    }

    // Validar cada item
    for (const item of dto.items) {
      // Validar que el item tenga el ID correspondiente según su tipo
      if (item.itemType === 'PRODUCT' && !item.productId) {
        throw new InvalidOrderDataException('Los items de tipo PRODUCT deben tener productId');
      }

      if (item.itemType === 'EVENT' && !item.eventId) {
        throw new InvalidOrderDataException('Los items de tipo EVENT deben tener eventId');
      }

      // Validar que no tenga ambos IDs
      if (item.productId && item.eventId) {
        throw new InvalidOrderDataException('Un item no puede tener tanto productId como eventId');
      }

      // Validar cantidad
      if (item.quantity <= 0) {
        throw new InvalidOrderDataException('La cantidad debe ser mayor a 0');
      }

      // Validar precio
      if (item.unitPrice < 0) {
        throw new InvalidOrderDataException('El precio unitario no puede ser negativo');
      }
    }

    // Crear la orden usando el repositorio
    return this.orderRepository.create(dto.items);
  }
}
