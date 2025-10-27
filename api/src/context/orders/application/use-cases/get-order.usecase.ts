import { Order } from '@context/orders/domain/entities/order.entity';
import { OrderNotFoundException } from '@context/orders/domain/exceptions/order-not-found.exception';
import type { IOrderRepository } from '@context/orders/domain/repositories/order.repository.port';
import { Inject, Injectable } from '@nestjs/common';

/**
 * Caso de uso para obtener una orden por ID
 * Orquesta la lógica de negocio para la consulta de órdenes
 */
@Injectable()
export class GetOrderUseCase {
  constructor(
    @Inject('OrderRepositoryPort')
    private readonly orderRepository: IOrderRepository,
  ) { }

  /**
   * Ejecuta la búsqueda de una orden por ID
   * @param id - ID de la orden a buscar
   * @returns Orden encontrada
   * @throws OrderNotFoundException si la orden no existe
   */
  async execute(id: string): Promise<Order> {
    const order = await this.orderRepository.findById(id);

    if (!order) {
      throw new OrderNotFoundException(id);
    }

    return order;
  }
}
