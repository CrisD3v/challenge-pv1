import { CreateOrderDto } from '@context/orders/application/dtos/create-order.dto';
import { UpdateOrderStatusDto } from '@context/orders/application/dtos/update-order-status.dto';
import { CancelOrderUseCase } from '@context/orders/application/use-cases/cancel-order.usecase';
import { CreateOrderUseCase } from '@context/orders/application/use-cases/create-order.usecase';
import { GetAllOrdersUseCase } from '@context/orders/application/use-cases/get-all-orders.usecase';
import { GetOrderStatsUseCase } from '@context/orders/application/use-cases/get-order-stats.usecase';
import { GetOrderUseCase } from '@context/orders/application/use-cases/get-order.usecase';
import { GetOrdersByStatusUseCase } from '@context/orders/application/use-cases/get-orders-by-status.usecase';
import { UpdateOrderStatusUseCase } from '@context/orders/application/use-cases/update-order-status.usecase';
import { ItemType, OrderItem } from '@context/orders/domain/entities/order-item.entity';
import { Order, OrderStatus } from '@context/orders/domain/entities/order.entity';
import { Test, TestingModule } from '@nestjs/testing';
import { OrdersController } from '../orders.controller';

describe('OrdersController', () => {
  let controller: OrdersController;
  let createOrderUseCase: jest.Mocked<CreateOrderUseCase>;
  let getOrderUseCase: jest.Mocked<GetOrderUseCase>;
  let getAllOrdersUseCase: jest.Mocked<GetAllOrdersUseCase>;
  let updateOrderStatusUseCase: jest.Mocked<UpdateOrderStatusUseCase>;
  let cancelOrderUseCase: jest.Mocked<CancelOrderUseCase>;
  let getOrdersByStatusUseCase: jest.Mocked<GetOrdersByStatusUseCase>;
  let getOrderStatsUseCase: jest.Mocked<GetOrderStatsUseCase>;

  const mockOrderItem = new OrderItem(
    'item-1',
    'order-1',
    ItemType.PRODUCT,
    'product-1',
    null,
    2,
    99.99,
    new Date('2023-01-01'),
  );

  const mockOrder = new Order(
    'order-1',
    [mockOrderItem],
    199.98,
    OrderStatus.PENDING,
    new Date('2023-01-01'),
    new Date('2023-01-01'),
  );

  const mockOrders = [mockOrder];

  const mockStats = {
    total: 10,
    pending: 3,
    processing: 2,
    completed: 4,
    cancelled: 1,
  };

  beforeEach(async () => {
    const mockCreateOrderUseCase = {
      execute: jest.fn(),
    };

    const mockGetOrderUseCase = {
      execute: jest.fn(),
    };

    const mockGetAllOrdersUseCase = {
      execute: jest.fn(),
    };

    const mockUpdateOrderStatusUseCase = {
      execute: jest.fn(),
    };

    const mockCancelOrderUseCase = {
      execute: jest.fn(),
    };

    const mockGetOrdersByStatusUseCase = {
      execute: jest.fn(),
    };

    const mockGetOrderStatsUseCase = {
      execute: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [OrdersController],
      providers: [
        { provide: CreateOrderUseCase, useValue: mockCreateOrderUseCase },
        { provide: GetOrderUseCase, useValue: mockGetOrderUseCase },
        { provide: GetAllOrdersUseCase, useValue: mockGetAllOrdersUseCase },
        { provide: UpdateOrderStatusUseCase, useValue: mockUpdateOrderStatusUseCase },
        { provide: CancelOrderUseCase, useValue: mockCancelOrderUseCase },
        { provide: GetOrdersByStatusUseCase, useValue: mockGetOrdersByStatusUseCase },
        { provide: GetOrderStatsUseCase, useValue: mockGetOrderStatsUseCase },
      ],
    }).compile();

    controller = module.get<OrdersController>(OrdersController);
    createOrderUseCase = module.get(CreateOrderUseCase);
    getOrderUseCase = module.get(GetOrderUseCase);
    getAllOrdersUseCase = module.get(GetAllOrdersUseCase);
    updateOrderStatusUseCase = module.get(UpdateOrderStatusUseCase);
    cancelOrderUseCase = module.get(CancelOrderUseCase);
    getOrdersByStatusUseCase = module.get(GetOrdersByStatusUseCase);
    getOrderStatsUseCase = module.get(GetOrderStatsUseCase);
  });

  it('debería estar definido', () => {
    expect(controller).toBeDefined();
  });

  describe('createOrder', () => {
    it('debería crear una orden', async () => {
      const createOrderDto: CreateOrderDto = {
        items: [
          {
            itemType: 'PRODUCT',
            productId: 'product-1',
            quantity: 2,
            unitPrice: 99.99,
          },
        ],
      };

      createOrderUseCase.execute.mockResolvedValue(mockOrder);

      const result = await controller.createOrder(createOrderDto);

      expect(createOrderUseCase.execute).toHaveBeenCalledWith(createOrderDto);
      expect(result).toEqual(mockOrder);
    });
  });

  describe('getOrders', () => {
    it('debería retornar todas las órdenes cuando no hay filtro de estado', async () => {
      getAllOrdersUseCase.execute.mockResolvedValue(mockOrders);

      const result = await controller.getOrders();

      expect(getAllOrdersUseCase.execute).toHaveBeenCalled();
      expect(result).toEqual(mockOrders);
    });

    it('debería filtrar órdenes por estado cuando se proporciona', async () => {
      getOrdersByStatusUseCase.execute.mockResolvedValue(mockOrders);

      const result = await controller.getOrders('PENDING');

      expect(getOrdersByStatusUseCase.execute).toHaveBeenCalledWith(OrderStatus.PENDING);
      expect(result).toEqual(mockOrders);
    });

    it('debería retornar todas las órdenes si el estado no es válido', async () => {
      getAllOrdersUseCase.execute.mockResolvedValue(mockOrders);

      const result = await controller.getOrders('INVALID_STATUS');

      expect(getAllOrdersUseCase.execute).toHaveBeenCalled();
      expect(result).toEqual(mockOrders);
    });
  });

  describe('getOrderStats', () => {
    it('debería retornar estadísticas de órdenes', async () => {
      getOrderStatsUseCase.execute.mockResolvedValue(mockStats);

      const result = await controller.getOrderStats();

      expect(getOrderStatsUseCase.execute).toHaveBeenCalled();
      expect(result).toEqual(mockStats);
    });
  });

  describe('getOrder', () => {
    it('debería retornar una orden por ID', async () => {
      getOrderUseCase.execute.mockResolvedValue(mockOrder);

      const result = await controller.getOrder('order-1');

      expect(getOrderUseCase.execute).toHaveBeenCalledWith('order-1');
      expect(result).toEqual(mockOrder);
    });
  });

  describe('updateOrderStatus', () => {
    it('debería actualizar el estado de una orden', async () => {
      const updateStatusDto: UpdateOrderStatusDto = { status: 'PROCESSING' };
      const updatedOrder = new Order(
        'order-1',
        [mockOrderItem],
        199.98,
        OrderStatus.PROCESSING,
        new Date('2023-01-01'),
        new Date('2023-01-01'),
      );

      updateOrderStatusUseCase.execute.mockResolvedValue(updatedOrder);

      const result = await controller.updateOrderStatus('order-1', updateStatusDto);

      expect(updateOrderStatusUseCase.execute).toHaveBeenCalledWith('order-1', updateStatusDto);
      expect(result).toEqual(updatedOrder);
    });
  });

  describe('cancelOrder', () => {
    it('debería cancelar una orden', async () => {
      const cancelledOrder = new Order(
        'order-1',
        [mockOrderItem],
        199.98,
        OrderStatus.CANCELLED,
        new Date('2023-01-01'),
        new Date('2023-01-01'),
      );

      cancelOrderUseCase.execute.mockResolvedValue(cancelledOrder);

      const result = await controller.cancelOrder('order-1');

      expect(cancelOrderUseCase.execute).toHaveBeenCalledWith('order-1');
      expect(result).toEqual(cancelledOrder);
    });
  });
});
