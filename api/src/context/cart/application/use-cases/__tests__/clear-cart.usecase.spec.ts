import { CartItem } from '@context/cart/domain/entities/cart-item.entity';
import { Cart } from '@context/cart/domain/entities/cart.entity';
import { CartNotFoundException } from '@context/cart/domain/exceptions/cart-not-found.exception';
import type { ICartRepository } from '@context/cart/domain/repositories/cart.repository.port';
import { Test, TestingModule } from '@nestjs/testing';
import { ItemType } from '@prisma/client';
import { ClearCartUseCase } from '@context/cart/application/use-cases/clear-cart.usecase';

describe('ClearCartUseCase', () => {
  let useCase: ClearCartUseCase;
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
        ClearCartUseCase,
        { provide: 'CartRepositoryPort', useValue: mockCartRepository },
      ],
    }).compile();

    useCase = module.get<ClearCartUseCase>(ClearCartUseCase);
    cartRepository = module.get('CartRepositoryPort');
  });

  it('should be defined', () => {
    expect(useCase).toBeDefined();
  });

  it('should clear all items from cart', async () => {
    cartRepository.findById.mockResolvedValue(mockCart);
    cartRepository.clear.mockResolvedValue(undefined);

    await useCase.execute('cart-1');

    expect(cartRepository.findById).toHaveBeenCalledWith('cart-1');
    expect(cartRepository.clear).toHaveBeenCalledWith('cart-1');
  });

  it('should throw CartNotFoundException when cart does not exist', async () => {
    cartRepository.findById.mockResolvedValue(null);

    await expect(useCase.execute('non-existent-cart'))
      .rejects
      .toThrow(CartNotFoundException);

    expect(cartRepository.findById).toHaveBeenCalledWith('non-existent-cart');
    expect(cartRepository.clear).not.toHaveBeenCalled();
  });
});
