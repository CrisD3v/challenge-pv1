import { CreateOrderDto } from '@context/orders/application/dtos/create-order.dto';
import { UpdateOrderStatusDto } from '@context/orders/application/dtos/update-order-status.dto';
import { CancelOrderUseCase } from '@context/orders/application/use-cases/cancel-order.usecase';
import { CreateOrderUseCase } from '@context/orders/application/use-cases/create-order.usecase';
import { GetAllOrdersUseCase } from '@context/orders/application/use-cases/get-all-orders.usecase';
import { GetOrderStatsUseCase } from '@context/orders/application/use-cases/get-order-stats.usecase';
import { GetOrderUseCase } from '@context/orders/application/use-cases/get-order.usecase';
import { GetOrdersByStatusUseCase } from '@context/orders/application/use-cases/get-orders-by-status.usecase';
import { UpdateOrderStatusUseCase } from '@context/orders/application/use-cases/update-order-status.usecase';
import { OrderStatus } from '@context/orders/domain/entities/order.entity';
import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Query
} from '@nestjs/common';

/**
 * Controlador REST para la gestión de órdenes
 * Maneja las peticiones HTTP y delega la lógica de negocio a los casos de uso
 */
@Controller('orders')
export class OrdersController {
  constructor(
    private readonly createOrderUseCase: CreateOrderUseCase,
    private readonly getOrderUseCase: GetOrderUseCase,
    private readonly getAllOrdersUseCase: GetAllOrdersUseCase,
    private readonly updateOrderStatusUseCase: UpdateOrderStatusUseCase,
    private readonly cancelOrderUseCase: CancelOrderUseCase,
    private readonly getOrdersByStatusUseCase: GetOrdersByStatusUseCase,
    private readonly getOrderStatsUseCase: GetOrderStatsUseCase,
  ) { }

  /**
   * Crea una nueva orden
   * @param dto - Datos de la orden a crear
   * @returns Orden creada
   */
  @Post()
  async createOrder(@Body() dto: CreateOrderDto) {
    return this.createOrderUseCase.execute(dto);
  }

  /**
   * Obtiene todas las órdenes o filtra por estado
   * @param status - Estado opcional para filtrar
   * @returns Lista de órdenes
   */
  @Get()
  async getOrders(@Query('status') status?: string) {
    if (status && Object.values(OrderStatus).includes(status as OrderStatus)) {
      return this.getOrdersByStatusUseCase.execute(status as OrderStatus);
    }
    return this.getAllOrdersUseCase.execute();
  }

  /**
   * Obtiene estadísticas de órdenes
   * @returns Estadísticas de órdenes por estado
   */
  @Get('stats')
  async getOrderStats() {
    return this.getOrderStatsUseCase.execute();
  }

  /**
   * Obtiene una orden por su ID
   * @param id - ID de la orden
   * @returns Orden encontrada
   */
  @Get(':id')
  async getOrder(@Param('id') id: string) {
    return this.getOrderUseCase.execute(id);
  }

  /**
   * Actualiza el estado de una orden
   * @param id - ID de la orden a actualizar
   * @param dto - Nuevo estado
   * @returns Orden actualizada
   */
  @Put(':id/status')
  async updateOrderStatus(@Param('id') id: string, @Body() dto: UpdateOrderStatusDto) {
    return this.updateOrderStatusUseCase.execute(id, dto);
  }

  /**
   * Cancela una orden
   * @param id - ID de la orden a cancelar
   * @returns Orden cancelada
   */
  @Put(':id/cancel')
  async cancelOrder(@Param('id') id: string) {
    return this.cancelOrderUseCase.execute(id);
  }
}
