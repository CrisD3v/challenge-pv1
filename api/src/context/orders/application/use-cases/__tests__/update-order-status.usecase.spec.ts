import { UpdateOrderStatusDto } from '@context/orders/application/dtos/update-order-status.dto';
import { ItemType, OrderItem } from '@context/orders/domain/entities/order-item.entity';
import { Order, OrderStatus } from '@context/orders/domain/entities/order.entity';
import { InvalidOrderStatusException } from '@context/orders/domain/exceptions/invalid-order-status.exception';
import { OrderNotFoundException } from '@context/orders/domain/exceptions/order-not-found.exception';
import { IOrderRepository } from '@context/orders/domain/repositories/order.repository.port';
import { Test, TestingModule } from '@nestjs/testing';
import { UpdateOrderStatusUseCase } from '../update-order-status.usecase';

describe('UpdateOrderStatusUseCase', () => {
  let useCase: UpdateOrderStatusUseCase;
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
        UpdateOrderStatusUseCase,
        { provide: 'OrderRepositoryPort', useValue: mockOrderRepository },
      ],
    }).compile();

    useCase = module.get<UpdateOrderStatusUseCase>(UpdateOrderStatusUseCase);
    orderRepository = module.get('OrderRepositoryPort');
  });

  it('debería estar definido', () => {
    expect(useCase).toBeDefined();
  });

  it('debería actualizar el estado de PENDING a PROCESSING', async () => {
    const updateDto: UpdateOrderStatusDto = { status: 'PROCESSING' };

    orderRepository.findById.mockResolvedValue(mockPendingOrder);
    orderRepository.updateStatus.mockResolvedValue(mockProcessingOrder);

    const result = await useCase.execute('order-1', updateDto);

    expect(orderRepository.findById).toHaveBeenCalledWith('order-1');
    expect(orderRepository.updateStatus).toHaveBeenCalledWith('order-1', OrderStatus.PROCESSING);
    expect(result).toEqual(mockProcessingOrder);
  });

  it('debería actualizar el estado de PROCESSING a COMPLETED', async () => {
    const updateDto: UpdateOrderStatusDto = { status: 'COMPLETED' };

    orderRepository.findById.mockResolvedValue(mockProcessingOrder);
    orderRepository.updateStatus.mockResolvedValue(mockCompletedOrder);

    const result = await useCase.execute('order-1', updateDto);

    expect(orderRepository.updateStatus).toHaveBeenCalledWith('order-1', OrderStatus.COMPLETED);
    expect(result).toEqual(mockCompletedOrder);
  });

  it('debería permitir mantener el mismo estado', async () => {
    const updateDto: UpdateOrderStatusDto = { status: 'PENDING' };

    orderRepository.findById.mockResolvedValue(mockPendingOrder);
    orderRepository.updateStatus.mockResolvedValue(mockPendingOrder);

    const result = await useCase.execute('order-1', updateDto);

    expect(orderRepository.updateStatus).toHaveBeenCalledWith('order-1', OrderStatus.PENDING);
    expect(result).toEqual(mockPendingOrder);
  });

  it('debería lanzar OrderNotFoundException cuando la orden no existe', async () => {
    const updateDto: UpdateOrderStatusDto = { status: 'PROCESSING' };

    orderRepository.findById.mockResolvedValue(null);

    await expect(useCase.execute('orden-inexistente', updateDto)).rejects.toThrow(
      OrderNotFoundException,
    );

    expect(orderRepository.updateStatus).not.toHaveBeenCalled();
  });

  it('debería lanzar InvalidOrderStatusException para transición inválida', async () => {
    const updateDto: UpdateOrderStatusDto = { status: 'PROCESSING' };

    orderRepository.findById.mockResolvedValue(mockCompletedOrder);

    await expect(useCase.execute('order-1', updateDto)).rejects.toThrow(
      InvalidOrderStatusException,
    );

    expect(orderRepository.updateStatus).not.toHaveBeenCalled();
  });

  it('debería lanzar excepción al intentar cambiar desde COMPLETED', async () => {
    const updateDto: UpdateOrderStatusDto = { status: 'CANCELLED' };

    orderRepository.findById.mockResolvedValue(mockCompletedOrder);

    await expect(useCase.execute('order-1', updateDto)).rejects.toThrow(
      InvalidOrderStatusException,
    );
  });

  it('debería permitir cancelar desde PENDING', async () => {
    const updateDto: UpdateOrderStatusDto = { status: 'CANCELLED' };
    const mockCancelledOrder = new Order(
      'order-1',
      [mockOrderItem],
      199.98,
      OrderStatus.CANCELLED,
      new Date('2023-01-01'),
      new Date('2023-01-01'),
    );

    orderRepository.findById.mockResolvedValue(mockPendingOrder);
    orderRepository.updateStatus.mockResolvedValue(mockCancelledOrder);

    const result = await useCase.execute('order-1', updateDto);

    expect(orderRepository.updateStatus).toHaveBeenCalledWith('order-1', OrderStatus.CANCELLED);
    expect(result).toEqual(mockCancelledOrder);
  });

  it('debería permitir cancelar desde PROCESSING', async () => {
    const updateDto: UpdateOrderStatusDto = { status: 'CANCELLED' };
    const mockCancelledOrder = new Order(
      'order-1',
      [mockOrderItem],
      199.98,
      OrderStatus.CANCELLED,
      new Date('2023-01-01'),
      new Date('2023-01-01'),
    );

    orderRepository.findById.mockResolvedValue(mockProcessingOrder);
    orderRepository.updateStatus.mockResolvedValue(mockCancelledOrder);

    const result = await useCase.execute('order-1', updateDto);

    expect(orderRepository.updateStatus).toHaveBeenCalledWith('order-1', OrderStatus.CANCELLED);
    expect(result).toEqual(mockCancelledOrder);
  });
});
