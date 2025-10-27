import { CartItem } from '@context/cart/domain/entities/cart-item.entity';
import { Cart } from '@context/cart/domain/entities/cart.entity';
import type { ICartRepository } from '@context/cart/domain/repositories/cart.repository.port';
import { Test, TestingModule } from '@nestjs/testing';
import { ItemType } from '@prisma/client';
import { GetAllCartsUseCase } from '@context/cart/application/use-cases/get-all-carts.usecase';

describe('GetAllCartsUseCase', () => {
  let useCase: GetAllCartsUseCase;
  let cartRepository: jest.Mocked<ICartRepository>;

  const mockCartItem = new CartItem(
    'item-1',
    ItemType.PRODUCT,
    2,
    10.99,
    'Test Product'
  );

  const mockCart1 = new Cart(
    'cart-1',
    new Date('2023-01-01'),
    new Date('2023-01-01'),
    [mockCartItem]
  );

  const mockCart2 = new Cart(
    'cart-2',
    new Date('2023-01-02'),
    new Date('2023-01-02'),
    []
  );

  beforeEach(async () => {
    const mockCartRepository = {
      create: jest.fn(),
      findById: jest.fn(),
      updateQuantity: jest.fn(),
      addItem: jest.fn(),
      clear: jest.fn(),
      getAllCarts: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GetAllCartsUseCase,
        { provide: 'CartRepositoryPort', useValue: mockCartRepository },
      ],
    }).compile();

    useCase = module.get<GetAllCartsUseCase>(GetAllCartsUseCase);
    cartRepository = module.get('CartRepositoryPort');
  });

  it('should be defined', () => {
    expect(useCase).toBeDefined();
  });

  it('should return all carts', async () => {
    const mockCarts = [mockCart1, mockCart2];
    cartRepository.getAllCarts.mockResolvedValue(mockCarts);

    const result = await useCase.execute();

    expect(cartRepository.getAllCarts).toHaveBeenCalled();
    expect(result).toEqual(mockCarts);
  });

  it('should return empty array when no carts exist', async () => {
    cartRepository.getAllCarts.mockResolvedValue([]);

    const result = await useCase.execute();

    expect(cartRepository.getAllCarts).toHaveBeenCalled();
    expect(result).toEqual([]);
  });
});
