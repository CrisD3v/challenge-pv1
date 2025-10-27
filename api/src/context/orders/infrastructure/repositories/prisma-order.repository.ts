import { ItemType, OrderItem } from '@context/orders/domain/entities/order-item.entity';
import { Order, OrderStatus } from '@context/orders/domain/entities/order.entity';
import { IOrderRepository } from '@context/orders/domain/repositories/order.repository.port';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '@prisma/prisma.service';

/**
 * Implementación del repositorio de órdenes usando Prisma
 * Adaptador que conecta el dominio con la base de datos
 */
@Injectable()
export class PrismaOrderRepository implements IOrderRepository {
  constructor(private readonly prisma: PrismaService) { }

  /**
   * Busca una orden por su ID
   * @param id - ID de la orden
   * @returns Orden encontrada o null si no existe
   */
  async findById(id: string): Promise<Order | null> {
    const order = await this.prisma.order.findUnique({
      where: { id },
      include: {
        items: true,
      },
    });

    if (!order) return null;

    return this.mapToOrderEntity(order);
  }

  /**
   * Obtiene todas las órdenes
   * @returns Lista de todas las órdenes
   */
  async findAll(): Promise<Order[]> {
    const orders = await this.prisma.order.findMany({
      include: {
        items: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    return orders.map(order => this.mapToOrderEntity(order));
  }

  /**
   * Busca órdenes por estado
   * @param status - Estado de las órdenes a buscar
   * @returns Lista de órdenes con el estado especificado
   */
  async findByStatus(status: OrderStatus): Promise<Order[]> {
    const orders = await this.prisma.order.findMany({
      where: { status: status as any },
      include: {
        items: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    return orders.map(order => this.mapToOrderEntity(order));
  }

  /**
   * Busca órdenes por rango de fechas
   * @param startDate - Fecha de inicio
   * @param endDate - Fecha de fin
   * @returns Lista de órdenes en el rango de fechas
   */
  async findByDateRange(startDate: Date, endDate: Date): Promise<Order[]> {
    const orders = await this.prisma.order.findMany({
      where: {
        createdAt: {
          gte: startDate,
          lte: endDate,
        },
      },
      include: {
        items: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    return orders.map(order => this.mapToOrderEntity(order));
  }

  /**
   * Crea una nueva orden
   * @param items - Items de la orden
   * @returns Orden creada
   */
  async create(items: {
    itemType: string;
    productId?: string;
    eventId?: string;
    quantity: number;
    unitPrice: number;
  }[]): Promise<Order> {
    // Calcular el total
    const total = items.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0);

    // Crear la orden con sus items
    const order = await this.prisma.order.create({
      data: {
        total,
        status: 'PENDING',
        items: {
          create: items.map(item => ({
            itemType: item.itemType as any,
            productId: item.productId,
            eventId: item.eventId,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
          })),
        },
      },
      include: {
        items: true,
      },
    });

    return this.mapToOrderEntity(order);
  }

  /**
   * Actualiza el estado de una orden
   * @param id - ID de la orden
   * @param status - Nuevo estado
   * @returns Orden actualizada
   */
  async updateStatus(id: string, status: OrderStatus): Promise<Order> {
    const order = await this.prisma.order.update({
      where: { id },
      data: { status: status as any },
      include: {
        items: true,
      },
    });

    return this.mapToOrderEntity(order);
  }

  /**
   * Actualiza el total de una orden
   * @param id - ID de la orden
   * @param total - Nuevo total
   * @returns Orden actualizada
   */
  async updateTotal(id: string, total: number): Promise<Order> {
    const order = await this.prisma.order.update({
      where: { id },
      data: { total },
      include: {
        items: true,
      },
    });

    return this.mapToOrderEntity(order);
  }

  /**
   * Elimina una orden
   * @param id - ID de la orden a eliminar
   */
  async delete(id: string): Promise<void> {
    await this.prisma.order.delete({
      where: { id },
    });
  }

  /**
   * Obtiene estadísticas de órdenes
   * @returns Estadísticas de órdenes por estado
   */
  async getOrderStats(): Promise<{
    total: number;
    pending: number;
    processing: number;
    completed: number;
    cancelled: number;
  }> {
    const stats = await this.prisma.order.groupBy({
      by: ['status'],
      _count: {
        id: true,
      },
    });

    const result = {
      total: 0,
      pending: 0,
      processing: 0,
      completed: 0,
      cancelled: 0,
    };

    stats.forEach(stat => {
      const count = stat._count.id;
      result.total += count;

      switch (stat.status) {
        case 'PENDING':
          result.pending = count;
          break;
        case 'PROCESSING':
          result.processing = count;
          break;
        case 'COMPLETED':
          result.completed = count;
          break;
        case 'CANCELLED':
          result.cancelled = count;
          break;
      }
    });

    return result;
  }

  /**
   * Mapea un objeto de Prisma a una entidad Order
   * @param orderData - Datos de la orden desde Prisma
   * @returns Entidad Order
   */
  private mapToOrderEntity(orderData: any): Order {
    const items = orderData.items.map((item: any) =>
      new OrderItem(
        item.id,
        item.orderId,
        item.itemType as ItemType,
        item.productId,
        item.eventId,
        item.quantity,
        item.unitPrice,
        item.createdAt,
      )
    );

    return new Order(
      orderData.id,
      items,
      orderData.total,
      orderData.status as OrderStatus,
      orderData.createdAt,
      orderData.updatedAt,
    );
  }
}
