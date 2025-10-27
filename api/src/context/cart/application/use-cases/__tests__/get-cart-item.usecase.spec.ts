import { CartItem } from '@context/cart/domain/entities/cart-item.entity';
import { Cart } from '@context/cart/domain/entities/cart.entity';
import { CartNotFoundException } from '@context/cart/domain/exceptions/cart-not-found.exception';
import type { ICartRepository } from '@context/cart/domain/repositories/cart.repository.port';
import { Test, TestingModule } from '@nestjs/testing';
import { ItemType } from '@prisma/client';
import { GetCartUseCase } from '@context/cart/application/use-cases/get-cart-item.usecase';

describe('GetCartUseCase', () => {
  let useCase: GetCartUseCase;
  let cartRepository: jest.Mocked<ICartRepository>;

  const mockCartItem = new CartItem(
    'item-1',
    ItemType.PRODUCT,
    2,
    10.99,
    'Test Product'
  );

  const mockCart = new Cart(
    'cart-1',
    new Date('2023-01-01'),
    new Date('2023-01-01'),
    [mockCartItem]
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
        GetCartUseCase,
        { provide: 'CartRepositoryPort', useValue: mockCartRepository },
      ],
    }).compile();

    useCase = module.get<GetCartUseCase>(GetCartUseCase);
    cartRepository = module.get('CartRepositoryPort');
  });

  it('should be defined', () => {
    expect(useCase).toBeDefined();
  });

  it('should return a cart by id', async () => {
    cartRepository.findById.mockResolvedValue(mockCart);

    const result = await useCase.execute('cart-1');

    expect(cartRepository.findById).toHaveBeenCalledWith('cart-1');
    expect(result).toEqual(mockCart);
  });

  it('should throw CartNotFoundException when cart does not exist', async () => {
    cartRepository.findById.mockResolvedValue(null);

    await expect(useCase.execute('non-existent-cart'))
      .rejects
      .toThrow(CartNotFoundException);

    expect(cartRepository.findById).toHaveBeenCalledWith('non-existent-cart');
  });

  it('should return cart with calculated total', async () => {
    cartRepository.findById.mockResolvedValue(mockCart);

    const result = await useCase.execute('cart-1');

    expect(result.total()).toBe(21.98); // 2 * 10.99
  });
});
