import type { IOrderRepository } from '@context/orders/domain/repositories/order.repository.port';
import { Inject, Injectable } from '@nestjs/common';

/**
 * Caso de uso para obtener estadísticas de órdenes
 * Orquesta la lógica de negocio para la consulta de estadísticas
 */
@Injectable()
export class GetOrderStatsUseCase {
  constructor(
    @Inject('OrderRepositoryPort')
    private readonly orderRepository: IOrderRepository,
  ) { }

  /**
   * Ejecuta la obtención de estadísticas de órdenes
   * @returns Estadísticas de órdenes por estado
   */
  async execute(): Promise<{
    total: number;
    pending: number;
    processing: number;
    completed: number;
    cancelled: number;
  }> {
    return this.orderRepository.getOrderStats();
  }
}
