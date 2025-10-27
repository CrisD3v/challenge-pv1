import { Order, OrderStatus } from '@context/orders/domain/entities/order.entity';
import { InvalidOrderStatusException } from '@context/orders/domain/exceptions/invalid-order-status.exception';
import { OrderNotFoundException } from '@context/orders/domain/exceptions/order-not-found.exception';
import type { IOrderRepository } from '@context/orders/domain/repositories/order.repository.port';
import { Inject, Injectable } from '@nestjs/common';

/**
 * Caso de uso para cancelar una orden
 * Orquesta la lógica de negocio para la cancelación de órdenes
 */
@Injectable()
export class CancelOrderUseCase {
  constructor(
    @Inject('OrderRepositoryPort')
    private readonly orderRepository: IOrderRepository,
  ) { }

  /**
   * Ejecuta la cancelación de una orden
   * @param id - ID de la orden a cancelar
   * @returns Orden cancelada
   * @throws OrderNotFoundException si la orden no existe
   * @throws InvalidOrderStatusException si la orden no puede ser cancelada
   */
  async execute(id: string): Promise<Order> {
    // Verificar que la orden existe
    const existingOrder = await this.orderRepository.findById(id);
    if (!existingOrder) {
      throw new OrderNotFoundException(id);
    }

    // Verificar que la orden puede ser cancelada
    if (!existingOrder.canBeCancelled()) {
      throw new InvalidOrderStatusException(
        existingOrder.status,
        'cancelar'
      );
    }

    // Cancelar la orden
    return this.orderRepository.updateStatus(id, OrderStatus.CANCELLED);
  }
}
