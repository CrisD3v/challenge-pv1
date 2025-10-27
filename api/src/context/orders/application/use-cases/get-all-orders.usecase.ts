import { Order } from '@context/orders/domain/entities/order.entity';
import type { IOrderRepository } from '@context/orders/domain/repositories/order.repository.port';
import { Inject, Injectable } from '@nestjs/common';

/**
 * Caso de uso para obtener todas las órdenes
 * Orquesta la lógica de negocio para la consulta de todas las órdenes
 */
@Injectable()
export class GetAllOrdersUseCase {
  constructor(
    @Inject('OrderRepositoryPort')
    private readonly orderRepository: IOrderRepository,
  ) { }

  /**
   * Ejecuta la búsqueda de todas las órdenes
   * @returns Lista de todas las órdenes
   */
  async execute(): Promise<Order[]> {
    return this.orderRepository.findAll();
  }
}
