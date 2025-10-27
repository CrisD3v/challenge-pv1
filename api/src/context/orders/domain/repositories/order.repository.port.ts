import { Order, OrderStatus } from '@context/orders/domain/entities/order.entity';

/**
 * Puerto (interfaz) para el repositorio de órdenes
 * Define el contrato que debe implementar cualquier adaptador de persistencia
 */
export interface IOrderRepository {
  /**
   * Busca una orden por su ID
   * @param id - ID de la orden
   * @returns Orden encontrada o null si no existe
   */
  findById(id: string): Promise<Order | null>;

  /**
   * Obtiene todas las órdenes
   * @returns Lista de todas las órdenes
   */
  findAll(): Promise<Order[]>;

  /**
   * Busca órdenes por estado
   * @param status - Estado de las órdenes a buscar
   * @returns Lista de órdenes con el estado especificado
   */
  findByStatus(status: OrderStatus): Promise<Order[]>;

  /**
   * Busca órdenes por rango de fechas
   * @param startDate - Fecha de inicio
   * @param endDate - Fecha de fin
   * @returns Lista de órdenes en el rango de fechas
   */
  findByDateRange(startDate: Date, endDate: Date): Promise<Order[]>;

  /**
   * Crea una nueva orden
   * @param items - Items de la orden
   * @returns Orden creada
   */
  create(items: {
    itemType: string;
    productId?: string;
    eventId?: string;
    quantity: number;
    unitPrice: number;
  }[]): Promise<Order>;

  /**
   * Actualiza el estado de una orden
   * @param id - ID de la orden
   * @param status - Nuevo estado
   * @returns Orden actualizada
   */
  updateStatus(id: string, status: OrderStatus): Promise<Order>;

  /**
   * Actualiza el total de una orden
   * @param id - ID de la orden
   * @param total - Nuevo total
   * @returns Orden actualizada
   */
  updateTotal(id: string, total: number): Promise<Order>;

  /**
   * Elimina una orden
   * @param id - ID de la orden a eliminar
   */
  delete(id: string): Promise<void>;

  /**
   * Obtiene estadísticas de órdenes
   * @returns Estadísticas de órdenes por estado
   */
  getOrderStats(): Promise<{
    total: number;
    pending: number;
    processing: number;
    completed: number;
    cancelled: number;
  }>;
}
