import { AddCartItemDto } from '@context/cart/application/dtos/add-cart-item.dto';
import { CartItem } from '@context/cart/domain/entities/cart-item.entity';
import { Cart } from '@context/cart/domain/entities/cart.entity';
import { CartNotFoundException } from '@context/cart/domain/exceptions/cart-not-found.exception';
import { ICartRepository } from '@context/cart/domain/repositories/cart.repository.port';
import { Test, TestingModule } from '@nestjs/testing';
import { ItemType } from '@prisma/client';
import { AddOrIncrementCartItemUseCase } from '../add-or-increment-cart-item.usecase';

describe('AddOrIncrementCartItemUseCase', () => {
  let useCase: AddOrIncrementCartItemUseCase;
  let cartRepository: jest.Mocked<ICartRepository>;

  const mockCartItem = new CartItem(
    'item-1',
    ItemType.PRODUCT,
    2,
    10.99,
    'Producto de Prueba',
    'product-1',
    undefined,
  );

  const mockCart = new Cart(
    'cart-1',
    new Date('2023-01-01'),
    new Date('2023-01-01'),
    [mockCartItem],
  );

  const mockEmptyCart = new Cart(
    'cart-1',
    new Date('2023-01-01'),
    new Date('2023-01-01'),
    [],
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
        AddOrIncrementCartItemUseCase,
        { provide: 'CartRepositoryPort', useValue: mockCartRepository },
      ],
    }).compile();

    useCase = module.get<AddOrIncrementCartItemUseCase>(AddOrIncrementCartItemUseCase);
    cartRepository = module.get('CartRepositoryPort');
  });

  it('debería estar definido', () => {
    expect(useCase).toBeDefined();
  });

  it('debería agregar un item a un carrito vacío', async () => {
    const addItemDto: AddCartItemDto = {
      itemType: ItemType.PRODUCT,
      productId: 'product-1',
      quantity: 2,
    };

    cartRepository.findById.mockResolvedValueOnce(mockEmptyCart);
    cartRepository.addItem.mockResolvedValue(undefined);
    cartRepository.findById.mockResolvedValueOnce(mockCart);

    const result = await useCase.execute('cart-1', addItemDto);

    expect(cartRepository.findById).toHaveBeenCalledWith('cart-1');
    expect(cartRepository.addItem).toHaveBeenCalledWith(
      'cart-1',
      ItemType.PRODUCT,
      'product-1',
      undefined,
      2,
    );
    expect(result).toEqual(mockCart);
  });

  it('debería incrementar la cantidad si el item ya existe (lógica en repositorio)', async () => {
    const addItemDto: AddCartItemDto = {
      itemType: ItemType.PRODUCT,
      productId: 'product-1',
      quantity: 1,
    };

    const updatedCartItem = new CartItem(
      'item-1',
      ItemType.PRODUCT,
      3, // Cantidad incrementada
      10.99,
      'Producto de Prueba',
      'product-1',
      undefined,
    );

    const updatedCart = new Cart(
      'cart-1',
      new Date('2023-01-01'),
      new Date('2023-01-01'),
      [updatedCartItem],
    );

    cartRepository.findById.mockResolvedValueOnce(mockCart);
    cartRepository.addItem.mockResolvedValue(undefined);
    cartRepository.findById.mockResolvedValueOnce(updatedCart);

    const result = await useCase.execute('cart-1', addItemDto);

    expect(cartRepository.addItem).toHaveBeenCalledWith(
      'cart-1',
      ItemType.PRODUCT,
      'product-1',
      undefined,
      1,
    );
    expect(result).toEqual(updatedCart);
  });

  it('debería lanzar CartNotFoundException cuando el carrito no existe', async () => {
    const addItemDto: AddCartItemDto = {
      itemType: ItemType.PRODUCT,
      productId: 'product-1',
      quantity: 2,
    };

    cartRepository.findById.mockResolvedValue(null);

    await expect(useCase.execute('carrito-inexistente', addItemDto)).rejects.toThrow(
      CartNotFoundException,
    );

    expect(cartRepository.addItem).not.toHaveBeenCalled();
  });

  it('debería manejar items de eventos', async () => {
    const addItemDto: AddCartItemDto = {
      itemType: ItemType.EVENT,
      eventId: 'event-1',
      quantity: 1,
    };

    cartRepository.findById.mockResolvedValueOnce(mockEmptyCart);
    cartRepository.addItem.mockResolvedValue(undefined);
    cartRepository.findById.mockResolvedValueOnce(mockCart);

    await useCase.execute('cart-1', addItemDto);

    expect(cartRepository.addItem).toHaveBeenCalledWith(
      'cart-1',
      ItemType.EVENT,
      undefined,
      'event-1',
      1,
    );
  });
});
