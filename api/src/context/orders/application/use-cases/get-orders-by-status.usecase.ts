import { Order, OrderStatus } from '@context/orders/domain/entities/order.entity';
import type { IOrderRepository } from '@context/orders/domain/repositories/order.repository.port';
import { Inject, Injectable } from '@nestjs/common';

/**
 * Caso de uso para obtener órdenes por estado
 * Orquesta la lógica de negocio para la consulta de órdenes filtradas por estado
 */
@Injectable()
export class GetOrdersByStatusUseCase {
  constructor(
    @Inject('OrderRepositoryPort')
    private readonly orderRepository: IOrderRepository,
  ) { }

  /**
   * Ejecuta la búsqueda de órdenes por estado
   * @param status - Estado de las órdenes a buscar
   * @returns Lista de órdenes con el estado especificado
   */
  async execute(status: OrderStatus): Promise<Order[]> {
    return this.orderRepository.findByStatus(status);
  }
}
