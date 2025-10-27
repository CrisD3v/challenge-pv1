import { CreateOrderDto } from '@context/orders/application/dtos/create-order.dto';
import { ItemType, OrderItem } from '@context/orders/domain/entities/order-item.entity';
import { Order, OrderStatus } from '@context/orders/domain/entities/order.entity';
import { InvalidOrderDataException } from '@context/orders/domain/exceptions/invalid-order-data.exception';
import { IOrderRepository } from '@context/orders/domain/repositories/order.repository.port';
import { Test, TestingModule } from '@nestjs/testing';
import { CreateOrderUseCase } from '../create-order.usecase';

describe('CreateOrderUseCase', () => {
  let useCase: CreateOrderUseCase;
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

  const mockOrder = new Order(
    'order-1',
    [mockOrderItem],
    199.98,
    OrderStatus.PENDING,
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
        CreateOrderUseCase,
        { provide: 'OrderRepositoryPort', useValue: mockOrderRepository },
      ],
    }).compile();

    useCase = module.get<CreateOrderUseCase>(CreateOrderUseCase);
    orderRepository = module.get('OrderRepositoryPort');
  });

  it('debería estar definido', () => {
    expect(useCase).toBeDefined();
  });

  it('debería crear una orden exitosamente', async () => {
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

    orderRepository.create.mockResolvedValue(mockOrder);

    const result = await useCase.execute(createOrderDto);

    expect(orderRepository.create).toHaveBeenCalledWith(createOrderDto.items);
    expect(result).toEqual(mockOrder);
  });

  it('debería crear una orden con múltiples items', async () => {
    const createOrderDto: CreateOrderDto = {
      items: [
        {
          itemType: 'PRODUCT',
          productId: 'product-1',
          quantity: 2,
          unitPrice: 99.99,
        },
        {
          itemType: 'EVENT',
          eventId: 'event-1',
          quantity: 1,
          unitPrice: 50.00,
        },
      ],
    };

    orderRepository.create.mockResolvedValue(mockOrder);

    await useCase.execute(createOrderDto);

    expect(orderRepository.create).toHaveBeenCalledWith(createOrderDto.items);
  });

  it('debería lanzar excepción si no hay items', async () => {
    const createOrderDto: CreateOrderDto = {
      items: [],
    };

    await expect(useCase.execute(createOrderDto)).rejects.toThrow(InvalidOrderDataException);
    expect(orderRepository.create).not.toHaveBeenCalled();
  });

  it('debería lanzar excepción si item PRODUCT no tiene productId', async () => {
    const createOrderDto: CreateOrderDto = {
      items: [
        {
          itemType: 'PRODUCT',
          quantity: 2,
          unitPrice: 99.99,
        } as any,
      ],
    };

    await expect(useCase.execute(createOrderDto)).rejects.toThrow(InvalidOrderDataException);
    expect(orderRepository.create).not.toHaveBeenCalled();
  });

  it('debería lanzar excepción si item EVENT no tiene eventId', async () => {
    const createOrderDto: CreateOrderDto = {
      items: [
        {
          itemType: 'EVENT',
          quantity: 1,
          unitPrice: 50.00,
        } as any,
      ],
    };

    await expect(useCase.execute(createOrderDto)).rejects.toThrow(InvalidOrderDataException);
    expect(orderRepository.create).not.toHaveBeenCalled();
  });

  it('debería lanzar excepción si item tiene tanto productId como eventId', async () => {
    const createOrderDto: CreateOrderDto = {
      items: [
        {
          itemType: 'PRODUCT',
          productId: 'product-1',
          eventId: 'event-1',
          quantity: 1,
          unitPrice: 50.00,
        },
      ],
    };

    await expect(useCase.execute(createOrderDto)).rejects.toThrow(InvalidOrderDataException);
    expect(orderRepository.create).not.toHaveBeenCalled();
  });

  it('debería lanzar excepción si la cantidad es 0 o negativa', async () => {
    const createOrderDto: CreateOrderDto = {
      items: [
        {
          itemType: 'PRODUCT',
          productId: 'product-1',
          quantity: 0,
          unitPrice: 99.99,
        },
      ],
    };

    await expect(useCase.execute(createOrderDto)).rejects.toThrow(InvalidOrderDataException);
    expect(orderRepository.create).not.toHaveBeenCalled();
  });

  it('debería lanzar excepción si el precio es negativo', async () => {
    const createOrderDto: CreateOrderDto = {
      items: [
        {
          itemType: 'PRODUCT',
          productId: 'product-1',
          quantity: 1,
          unitPrice: -10,
        },
      ],
    };

    await expect(useCase.execute(createOrderDto)).rejects.toThrow(InvalidOrderDataException);
    expect(orderRepository.create).not.toHaveBeenCalled();
  });
});
