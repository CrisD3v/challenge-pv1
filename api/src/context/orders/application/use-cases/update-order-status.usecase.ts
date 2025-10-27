import { UpdateOrderStatusDto } from '@context/orders/application/dtos/update-order-status.dto';
import { Order, OrderStatus } from '@context/orders/domain/entities/order.entity';
import { InvalidOrderStatusException } from '@context/orders/domain/exceptions/invalid-order-status.exception';
import { OrderNotFoundException } from '@context/orders/domain/exceptions/order-not-found.exception';
import type { IOrderRepository } from '@context/orders/domain/repositories/order.repository.port';
import { Inject, Injectable } from '@nestjs/common';

/**
 * Caso de uso para actualizar el estado de una orden
 * Orquesta la lógica de negocio para el cambio de estado de órdenes
 */
@Injectable()
export class UpdateOrderStatusUseCase {
  constructor(
    @Inject('OrderRepositoryPort')
    private readonly orderRepository: IOrderRepository,
  ) { }

  /**
   * Ejecuta la actualización del estado de una orden
   * @param id - ID de la orden a actualizar
   * @param dto - Nuevo estado
   * @returns Orden actualizada
   * @throws OrderNotFoundException si la orden no existe
   * @throws InvalidOrderStatusException si el cambio de estado no es válido
   */
  async execute(id: string, dto: UpdateOrderStatusDto): Promise<Order> {
    // Verificar que la orden existe
    const existingOrder = await this.orderRepository.findById(id);
    if (!existingOrder) {
      throw new OrderNotFoundException(id);
    }

    const newStatus = dto.status as OrderStatus;
    const currentStatus = existingOrder.status;

    // Validar transiciones de estado válidas
    this.validateStatusTransition(currentStatus, newStatus);

    // Actualizar el estado
    return this.orderRepository.updateStatus(id, newStatus);
  }

  /**
   * Valida si la transición de estado es válida
   * @param currentStatus - Estado actual
   * @param newStatus - Nuevo estado
   * @throws InvalidOrderStatusException si la transición no es válida
   */
  private validateStatusTransition(currentStatus: OrderStatus, newStatus: OrderStatus): void {
    // Si el estado es el mismo, no hay problema
    if (currentStatus === newStatus) {
      return;
    }

    // Definir transiciones válidas
    const validTransitions: Record<OrderStatus, OrderStatus[]> = {
      [OrderStatus.PENDING]: [OrderStatus.PROCESSING, OrderStatus.CANCELLED],
      [OrderStatus.PROCESSING]: [OrderStatus.COMPLETED, OrderStatus.CANCELLED],
      [OrderStatus.COMPLETED]: [], // No se puede cambiar desde completado
      [OrderStatus.CANCELLED]: [], // No se puede cambiar desde cancelado
    };

    const allowedTransitions = validTransitions[currentStatus];

    if (!allowedTransitions.includes(newStatus)) {
      throw new InvalidOrderStatusException(
        currentStatus,
        `cambiar a estado ${newStatus}`
      );
    }
  }
}
