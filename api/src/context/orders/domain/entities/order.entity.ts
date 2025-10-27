import { OrderItem } from './order-item.entity';

/**
 * Enum para los estados de la orden
 */
export enum OrderStatus {
  PENDING = 'PENDING',
  PROCESSING = 'PROCESSING',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
}

/**
 * Entidad de dominio que representa una orden
 * Contiene la lógica de negocio relacionada con órdenes
 */
export class Order {
  constructor(
    public readonly id: string,
    public readonly items: OrderItem[],
    public readonly total: number,
    public readonly status: OrderStatus,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
  ) { }

  /**
   * Calcula el total de la orden basado en sus items
   * @returns Total calculado de la orden
   */
  calculateTotal(): number {
    return this.items.reduce((sum, item) => sum + item.getSubtotal(), 0);
  }

  /**
   * Verifica si la orden puede ser cancelada
   * @returns true si la orden puede ser cancelada
   */
  canBeCancelled(): boolean {
    return this.status === OrderStatus.PENDING || this.status === OrderStatus.PROCESSING;
  }

  /**
   * Verifica si la orden puede ser procesada
   * @returns true si la orden puede ser procesada
   */
  canBeProcessed(): boolean {
    return this.status === OrderStatus.PENDING;
  }

  /**
   * Verifica si la orden puede ser completada
   * @returns true si la orden puede ser completada
   */
  canBeCompleted(): boolean {
    return this.status === OrderStatus.PROCESSING;
  }

  /**
   * Verifica si la orden está pendiente
   * @returns true si la orden está pendiente
   */
  isPending(): boolean {
    return this.status === OrderStatus.PENDING;
  }

  /**
   * Verifica si la orden está en proceso
   * @returns true si la orden está en proceso
   */
  isProcessing(): boolean {
    return this.status === OrderStatus.PROCESSING;
  }

  /**
   * Verifica si la orden está completada
   * @returns true si la orden está completada
   */
  isCompleted(): boolean {
    return this.status === OrderStatus.COMPLETED;
  }

  /**
   * Verifica si la orden está cancelada
   * @returns true si la orden está cancelada
   */
  isCancelled(): boolean {
    return this.status === OrderStatus.CANCELLED;
  }

  /**
   * Obtiene la cantidad total de items en la orden
   * @returns Cantidad total de items
   */
  getTotalItems(): number {
    return this.items.reduce((sum, item) => sum + item.quantity, 0);
  }

  /**
   * Verifica si la orden tiene items
   * @returns true si la orden tiene items
   */
  hasItems(): boolean {
    return this.items.length > 0;
  }

  /**
   * Obtiene un resumen de la orden
   * @returns Objeto con información resumida de la orden
   */
  getSummary(): {
    id: string;
    status: OrderStatus;
    total: number;
    totalItems: number;
    itemsCount: number;
    createdAt: Date;
  } {
    return {
      id: this.id,
      status: this.status,
      total: this.total,
      totalItems: this.getTotalItems(),
      itemsCount: this.items.length,
      createdAt: this.createdAt,
    };
  }

  /**
   * Verifica si el total calculado coincide con el total almacenado
   * @returns true si los totales coinciden
   */
  isTotalValid(): boolean {
    const calculatedTotal = this.calculateTotal();
    // Usar una pequeña tolerancia para comparaciones de punto flotante
    return Math.abs(this.total - calculatedTotal) < 0.01;
  }
}
