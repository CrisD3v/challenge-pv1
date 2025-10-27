import { AddCartItemDto } from '@context/cart/application/dtos/add-cart-item.dto';
import { CartItem } from '@context/cart/domain/entities/cart-item.entity';
import { Cart } from '@context/cart/domain/entities/cart.entity';
import { CartNotFoundException } from '@context/cart/domain/exceptions/cart-not-found.exception';
import type { ICartRepository } from '@context/cart/domain/repositories/cart.repository.port';
import { Test, TestingModule } from '@nestjs/testing';
import { ItemType } from '@prisma/client';
import { AddCartItemUseCase } from '@context/cart/application/use-cases/add-cart-items.usecase';

describe('AddCartItemUseCase', () => {
  let useCase: AddCartItemUseCase;
  let cartRepository: jest.Mocked<ICartRepository>;

  const mockCart = new Cart(
    'cart-1',
    new Date('2023-01-01'),
    new Date('2023-01-01'),
    [],
  );

  const mockCartItem = new CartItem(
    'item-1',
    ItemType.PRODUCT,
    2,
    10.99,
    'Test Product',
  );

  const mockCartWithItems = new Cart(
    'cart-1',
    new Date('2023-01-01'),
    new Date('2023-01-01'),
    [mockCartItem],
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
        AddCartItemUseCase,
        { provide: 'CartRepositoryPort', useValue: mockCartRepository },
      ],
    }).compile();

    useCase = module.get<AddCartItemUseCase>(AddCartItemUseCase);
    cartRepository = module.get('CartRepositoryPort');
  });

  it('should be defined', () => {
    expect(useCase).toBeDefined();
  });

  it('should add an item to an existing cart', async () => {
    const addItemDto: AddCartItemDto = {
      itemType: ItemType.PRODUCT,
      productId: 'product-1',
      quantity: 2,
    };

    cartRepository.findById.mockResolvedValueOnce(mockCart);
    cartRepository.addItem.mockResolvedValue(undefined);
    cartRepository.findById.mockResolvedValueOnce(mockCartWithItems);

    const result = await useCase.execute('cart-1', addItemDto);

    expect(cartRepository.findById).toHaveBeenCalledWith('cart-1');
    expect(cartRepository.addItem).toHaveBeenCalledWith(
      'cart-1',
      ItemType.PRODUCT,
      'product-1',
      undefined,
      2,
    );
    expect(result).toEqual(mockCartWithItems);
  });

  it('should throw CartNotFoundException when cart does not exist', async () => {
    const addItemDto: AddCartItemDto = {
      itemType: ItemType.PRODUCT,
      productId: 'product-1',
      quantity: 2,
    };

    cartRepository.findById.mockResolvedValue(null);

    await expect(
      useCase.execute('non-existent-cart', addItemDto),
    ).rejects.toThrow(CartNotFoundException);

    expect(cartRepository.findById).toHaveBeenCalledWith('non-existent-cart');
    expect(cartRepository.addItem).not.toHaveBeenCalled();
  });

  it('should add an event item to cart', async () => {
    const addItemDto: AddCartItemDto = {
      itemType: ItemType.EVENT,
      eventId: 'event-1',
      quantity: 1,
    };

    cartRepository.findById.mockResolvedValueOnce(mockCart);
    cartRepository.addItem.mockResolvedValue(undefined);
    cartRepository.findById.mockResolvedValueOnce(mockCartWithItems);

    const result = await useCase.execute('cart-1', addItemDto);

    expect(cartRepository.addItem).toHaveBeenCalledWith(
      'cart-1',
      ItemType.EVENT,
      undefined,
      'event-1',
      1,
    );
    expect(result).toEqual(mockCartWithItems);
  });
});
