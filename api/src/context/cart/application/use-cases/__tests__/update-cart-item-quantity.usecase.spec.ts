import { CartItem } from '@context/cart/domain/entities/cart-item.entity';
import { Cart } from '@context/cart/domain/entities/cart.entity';
import { CartNotFoundException } from '@context/cart/domain/exceptions/cart-not-found.exception';
import type { ICartRepository } from '@context/cart/domain/repositories/cart.repository.port';
import { Test, TestingModule } from '@nestjs/testing';
import { ItemType } from '@prisma/client';
import { UpdateCartItemQuantityUseCase } from '@context/cart/application/use-cases/update-cart-item-quantity.usecase';

describe('UpdateCartItemQuantityUseCase', () => {
  let useCase: UpdateCartItemQuantityUseCase;
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

  const mockUpdatedCartItem = new CartItem(
    'item-1',
    ItemType.PRODUCT,
    5,
    10.99,
    'Test Product'
  );

  const mockUpdatedCart = new Cart(
    'cart-1',
    new Date('2023-01-01'),
    new Date('2023-01-01'),
    [mockUpdatedCartItem]
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
        UpdateCartItemQuantityUseCase,
        { provide: 'CartRepositoryPort', useValue: mockCartRepository },
      ],
    }).compile();

    useCase = module.get<UpdateCartItemQuantityUseCase>(UpdateCartItemQuantityUseCase);
    cartRepository = module.get('CartRepositoryPort');
  });

  it('should be defined', () => {
    expect(useCase).toBeDefined();
  });

  it('should update item quantity in cart', async () => {
    cartRepository.findById.mockResolvedValueOnce(mockCart);
    cartRepository.updateQuantity.mockResolvedValue(undefined);
    cartRepository.findById.mockResolvedValueOnce(mockUpdatedCart);

    const result = await useCase.execute('cart-1', 'item-1', 5);

    expect(cartRepository.findById).toHaveBeenCalledWith('cart-1');
    expect(cartRepository.updateQuantity).toHaveBeenCalledWith('cart-1', 'item-1', 5);
    expect(result).toEqual(mockUpdatedCart);
  });

  it('should throw CartNotFoundException when cart does not exist', async () => {
    cartRepository.findById.mockResolvedValue(null);

    await expect(useCase.execute('non-existent-cart', 'item-1', 5))
      .rejects
      .toThrow(CartNotFoundException);

    expect(cartRepository.findById).toHaveBeenCalledWith('non-existent-cart');
    expect(cartRepository.updateQuantity).not.toHaveBeenCalled();
  });

  it('should remove item when quantity is 0', async () => {
    const emptyCart = new Cart(
      'cart-1',
      new Date('2023-01-01'),
      new Date('2023-01-01'),
      []
    );

    cartRepository.findById.mockResolvedValueOnce(mockCart);
    cartRepository.updateQuantity.mockResolvedValue(undefined);
    cartRepository.findById.mockResolvedValueOnce(emptyCart);

    const result = await useCase.execute('cart-1', 'item-1', 0);

    expect(cartRepository.updateQuantity).toHaveBeenCalledWith('cart-1', 'item-1', 0);
    expect(result).toEqual(emptyCart);
  });
});
