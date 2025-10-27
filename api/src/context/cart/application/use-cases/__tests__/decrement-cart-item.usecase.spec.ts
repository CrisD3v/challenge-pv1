import { CartItem } from '@context/cart/domain/entities/cart-item.entity';
import { Cart } from '@context/cart/domain/entities/cart.entity';
import { CartNotFoundException } from '@context/cart/domain/exceptions/cart-not-found.exception';
import { ICartRepository } from '@context/cart/domain/repositories/cart.repository.port';
import { Test, TestingModule } from '@nestjs/testing';
import { ItemType } from '@prisma/client';
import { DecrementCartItemUseCase } from '../decrement-cart-item.usecase';

describe('DecrementCartItemUseCase', () => {
  let useCase: DecrementCartItemUseCase;
  let cartRepository: jest.Mocked<ICartRepository>;

  const mockCartItem = new CartItem(
    'item-1',
    ItemType.PRODUCT,
    3,
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
        DecrementCartItemUseCase,
        { provide: 'CartRepositoryPort', useValue: mockCartRepository },
      ],
    }).compile();

    useCase = module.get<DecrementCartItemUseCase>(DecrementCartItemUseCase);
    cartRepository = module.get('CartRepositoryPort');
  });

  it('debería estar definido', () => {
    expect(useCase).toBeDefined();
  });

  it('debería decrementar la cantidad de un item', async () => {
    const decrementedCartItem = new CartItem(
      'item-1',
      ItemType.PRODUCT,
      2, // Cantidad decrementada
      10.99,
      'Producto de Prueba',
      'product-1',
      undefined,
    );

    const updatedCart = new Cart(
      'cart-1',
      new Date('2023-01-01'),
      new Date('2023-01-01'),
      [decrementedCartItem],
    );

    cartRepository.findById.mockResolvedValueOnce(mockCart);
    cartRepository.updateQuantity.mockResolvedValue(undefined);
    cartRepository.findById.mockResolvedValueOnce(updatedCart);

    const result = await useCase.execute('cart-1', 'item-1');

    expect(cartRepository.findById).toHaveBeenCalledWith('cart-1');
    expect(cartRepository.updateQuantity).toHaveBeenCalledWith('cart-1', 'item-1', 2);
    expect(result).toEqual(updatedCart);
  });

  it('debería eliminar el item cuando la cantidad llega a 0', async () => {
    const singleQuantityItem = new CartItem(
      'item-1',
      ItemType.PRODUCT,
      1, // Solo 1 item
      10.99,
      'Producto de Prueba',
      'product-1',
      undefined,
    );

    const cartWithSingleItem = new Cart(
      'cart-1',
      new Date('2023-01-01'),
      new Date('2023-01-01'),
      [singleQuantityItem],
    );

    const emptyCart = new Cart(
      'cart-1',
      new Date('2023-01-01'),
      new Date('2023-01-01'),
      [], // Sin items después de eliminar
    );

    cartRepository.findById.mockResolvedValueOnce(cartWithSingleItem);
    cartRepository.updateQuantity.mockResolvedValue(undefined);
    cartRepository.findById.mockResolvedValueOnce(emptyCart);

    const result = await useCase.execute('cart-1', 'item-1');

    expect(cartRepository.updateQuantity).toHaveBeenCalledWith('cart-1', 'item-1', 0);
    expect(result).toEqual(emptyCart);
  });

  it('debería lanzar CartNotFoundException cuando el carrito no existe', async () => {
    cartRepository.findById.mockResolvedValue(null);

    await expect(useCase.execute('carrito-inexistente', 'item-1')).rejects.toThrow(
      CartNotFoundException,
    );

    expect(cartRepository.updateQuantity).not.toHaveBeenCalled();
  });

  it('debería lanzar error cuando el item no existe en el carrito', async () => {
    cartRepository.findById.mockResolvedValue(mockCart);

    await expect(useCase.execute('cart-1', 'item-inexistente')).rejects.toThrow(
      'Item not found in cart',
    );

    expect(cartRepository.updateQuantity).not.toHaveBeenCalled();
  });

  it('debería manejar items con cantidad mayor a 1', async () => {
    const multipleQuantityItem = new CartItem(
      'item-1',
      ItemType.PRODUCT,
      5,
      10.99,
      'Producto de Prueba',
      'product-1',
      undefined,
    );

    const cartWithMultipleItems = new Cart(
      'cart-1',
      new Date('2023-01-01'),
      new Date('2023-01-01'),
      [multipleQuantityItem],
    );

    const decrementedCartItem = new CartItem(
      'item-1',
      ItemType.PRODUCT,
      4,
      10.99,
      'Producto de Prueba',
      'product-1',
      undefined,
    );

    const updatedCart = new Cart(
      'cart-1',
      new Date('2023-01-01'),
      new Date('2023-01-01'),
      [decrementedCartItem],
    );

    cartRepository.findById.mockResolvedValueOnce(cartWithMultipleItems);
    cartRepository.updateQuantity.mockResolvedValue(undefined);
    cartRepository.findById.mockResolvedValueOnce(updatedCart);

    const result = await useCase.execute('cart-1', 'item-1');

    expect(cartRepository.updateQuantity).toHaveBeenCalledWith('cart-1', 'item-1', 4);
    expect(result).toEqual(updatedCart);
  });
});
