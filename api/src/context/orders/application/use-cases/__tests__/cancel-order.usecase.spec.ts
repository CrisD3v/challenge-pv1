import { ItemType, OrderItem } from '@context/orders/domain/entities/order-item.entity';
import { Order, OrderStatus } from '@context/orders/domain/entities/order.entity';
import { InvalidOrderStatusException } from '@context/orders/domain/exceptions/invalid-order-status.exception';
import { OrderNotFoundException } from '@context/orders/domain/exceptions/order-not-found.exception';
import { IOrderRepository } from '@context/orders/domain/repositories/order.repository.port';
import { Test, TestingModule } from '@nestjs/testing';
import { CancelOrderUseCase } from '../cancel-order.usecase';

describe('CancelOrderUseCase', () => {
  let useCase: CancelOrderUseCase;
  let orderRepository: jest.Mocked<IOrderRepository>;

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

  const mockPendingOrder = new Order(
    'order-1',
    [mockOrderItem],
    199.98,
    OrderStatus.PENDING,
    new Date('2023-01-01'),
    new Date('2023-01-01'),
  );

  const mockProcessingOrder = new Order(
    'order-1',
    [mockOrderItem],
    199.98,
    OrderStatus.PROCESSING,
    new Date('2023-01-01'),
    new Date('2023-01-01'),
  );

  const mockCompletedOrder = new Order(
    'order-1',
    [mockOrderItem],
    199.98,
    OrderStatus.COMPLETED,
    new Date('2023-01-01'),
    new Date('2023-01-01'),
  );

  const mockCancelledOrder = new Order(
    'order-1',
    [mockOrderItem],
    199.98,
    OrderStatus.CANCELLED,
    new Date('2023-01-01'),
    new Date('2023-01-01'),
  );

  beforeEach(async () => {
    const mockOrderRepository = {
      findById: jest.fn(),
      findAll: jest.fn(),
      findByStatus: jest.fn(),
      findByDateRange: jest.fn(),
      create: jest.fn(),
      updateStatus: jest.fn(),
      updateTotal: jest.fn(),
      delete: jest.fn(),
      getOrderStats: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CancelOrderUseCase,
        { provide: 'OrderRepositoryPort', useValue: mockOrderRepository },
      ],
    }).compile();

    useCase = module.get<CancelOrderUseCase>(CancelOrderUseCase);
    orderRepository = module.get('OrderRepositoryPort');
  });

  it('debería estar definido', () => {
    expect(useCase).toBeDefined();
  });

  it('debería cancelar una orden PENDING', async () => {
    orderRepository.findById.mockResolvedValue(mockPendingOrder);
    orderRepository.updateStatus.mockResolvedValue(mockCancelledOrder);

    const result = await useCase.execute('order-1');

    expect(orderRepository.findById).toHaveBeenCalledWith('order-1');
    expect(orderRepository.updateStatus).toHaveBeenCalledWith('order-1', OrderStatus.CANCELLED);
    expect(result).toEqual(mockCancelledOrder);
  });

  it('debería cancelar una orden PROCESSING', async () => {
    orderRepository.findById.mockResolvedValue(mockProcessingOrder);
    orderRepository.updateStatus.mockResolvedValue(mockCancelledOrder);

    const result = await useCase.execute('order-1');

    expect(orderRepository.findById).toHaveBeenCalledWith('order-1');
    expect(orderRepository.updateStatus).toHaveBeenCalledWith('order-1', OrderStatus.CANCELLED);
    expect(result).toEqual(mockCancelledOrder);
  });

  it('debería lanzar OrderNotFoundException cuando la orden no existe', async () => {
    orderRepository.findById.mockResolvedValue(null);

    await expect(useCase.execute('orden-inexistente')).rejects.toThrow(
      OrderNotFoundException,
    );

    expect(orderRepository.updateStatus).not.toHaveBeenCalled();
  });

  it('debería lanzar InvalidOrderStatusException para orden COMPLETED', async () => {
    orderRepository.findById.mockResolvedValue(mockCompletedOrder);

    await expect(useCase.execute('order-1')).rejects.toThrow(
      InvalidOrderStatusException,
    );

    expect(orderRepository.updateStatus).not.toHaveBeenCalled();
  });

  it('debería lanzar InvalidOrderStatusException para orden ya CANCELLED', async () => {
    orderRepository.findById.mockResolvedValue(mockCancelledOrder);

    await expect(useCase.execute('order-1')).rejects.toThrow(
      InvalidOrderStatusException,
    );

    expect(orderRepository.updateStatus).not.toHaveBeenCalled();
  });
});
