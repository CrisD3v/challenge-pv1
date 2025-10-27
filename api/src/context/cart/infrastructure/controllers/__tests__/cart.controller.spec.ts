import { AddCartItemDto } from '@context/cart/application/dtos/add-cart-item.dto';
import { UpdateQuantityDto } from '@context/cart/application/dtos/update-quantity.dto';
import { AddCartItemUseCase } from '@context/cart/application/use-cases/add-cart-items.usecase';
import { AddOrIncrementCartItemUseCase } from '@context/cart/application/use-cases/add-or-increment-cart-item.usecase';
import { ClearCartUseCase } from '@context/cart/application/use-cases/clear-cart.usecase';
import { CreateCartUseCase } from '@context/cart/application/use-cases/create-cart.usecase';
import { DecrementCartItemUseCase } from '@context/cart/application/use-cases/decrement-cart-item.usecase';
import { GetAllCartsUseCase } from '@context/cart/application/use-cases/get-all-carts.usecase';
import { GetCartUseCase } from '@context/cart/application/use-cases/get-cart-item.usecase';
import { UpdateCartItemQuantityUseCase } from '@context/cart/application/use-cases/update-cart-item-quantity.usecase';
import { CartItem } from '@context/cart/domain/entities/cart-item.entity';
import { Cart } from '@context/cart/domain/entities/cart.entity';
import { CartController } from '@context/cart/infrastructure/controllers/cart.controller';
import { Test, TestingModule } from '@nestjs/testing';
import { ItemType } from '@prisma/client';

describe('CartController', () => {
  let controller: CartController;
  let createCartUseCase: jest.Mocked<CreateCartUseCase>;
  let addCartItemUseCase: jest.Mocked<AddCartItemUseCase>;
  let getCartUseCase: jest.Mocked<GetCartUseCase>;
  let updateCartItemQuantityUseCase: jest.Mocked<UpdateCartItemQuantityUseCase>;
  let clearCartUseCase: jest.Mocked<ClearCartUseCase>;
  let getAllCartsUseCase: jest.Mocked<GetAllCartsUseCase>;

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
    const mockCreateCartUseCase = {
      execute: jest.fn(),
    };

    const mockAddCartItemUseCase = {
      execute: jest.fn(),
    };

    const mockGetCartUseCase = {
      execute: jest.fn(),
    };

    const mockUpdateCartItemQuantityUseCase = {
      execute: jest.fn(),
    };

    const mockClearCartUseCase = {
      execute: jest.fn(),
    };

    const mockGetAllCartsUseCase = {
      execute: jest.fn(),
    };

    const mockAddOrIncrementCartItemUseCase = {
      execute: jest.fn(),
    };

    const mockDecrementCartItemUseCase = {
      execute: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [CartController],
      providers: [
        { provide: CreateCartUseCase, useValue: mockCreateCartUseCase },
        { provide: AddCartItemUseCase, useValue: mockAddCartItemUseCase },
        { provide: GetCartUseCase, useValue: mockGetCartUseCase },
        {
          provide: UpdateCartItemQuantityUseCase,
          useValue: mockUpdateCartItemQuantityUseCase,
        },
        { provide: ClearCartUseCase, useValue: mockClearCartUseCase },
        { provide: GetAllCartsUseCase, useValue: mockGetAllCartsUseCase },
        { provide: AddOrIncrementCartItemUseCase, useValue: mockAddOrIncrementCartItemUseCase },
        { provide: DecrementCartItemUseCase, useValue: mockDecrementCartItemUseCase },
      ],
    }).compile();

    controller = module.get<CartController>(CartController);
    createCartUseCase = module.get(CreateCartUseCase);
    addCartItemUseCase = module.get(AddCartItemUseCase);
    getCartUseCase = module.get(GetCartUseCase);
    updateCartItemQuantityUseCase = module.get(UpdateCartItemQuantityUseCase);
    clearCartUseCase = module.get(ClearCartUseCase);
    getAllCartsUseCase = module.get(GetAllCartsUseCase);
    addOrIncrementCartItemUseCase = module.get(AddOrIncrementCartItemUseCase);
    decrementCartItemUseCase = module.get(DecrementCartItemUseCase);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('createCart', () => {
    it('should create a new cart', async () => {
      createCartUseCase.execute.mockResolvedValue(mockCart);

      const result = await controller.createCart();

      expect(createCartUseCase.execute).toHaveBeenCalled();
      expect(result).toEqual(mockCart);
    });
  });

  describe('getAllCarts', () => {
    it('should return all carts', async () => {
      const mockCarts = [mockCart, mockCartWithItems];
      getAllCartsUseCase.execute.mockResolvedValue(mockCarts);

      const result = await controller.getAllCarts();

      expect(getAllCartsUseCase.execute).toHaveBeenCalled();
      expect(result).toEqual(mockCarts);
    });
  });

  describe('getCart', () => {
    it('should return a cart by id', async () => {
      getCartUseCase.execute.mockResolvedValue(mockCartWithItems);

      const result = await controller.getCart('cart-1');

      expect(getCartUseCase.execute).toHaveBeenCalledWith('cart-1');
      expect(result).toEqual(mockCartWithItems);
    });
  });

  describe('addItem', () => {
    it('should add an item to the cart', async () => {
      const addItemDto: AddCartItemDto = {
        itemType: ItemType.PRODUCT,
        productId: 'product-1',
        quantity: 2,
      };

      addCartItemUseCase.execute.mockResolvedValue(mockCartWithItems);

      const result = await controller.addItem('cart-1', addItemDto);

      expect(addCartItemUseCase.execute).toHaveBeenCalledWith(
        'cart-1',
        addItemDto,
      );
      expect(result).toEqual(mockCartWithItems);
    });
  });

  describe('updateQuantity', () => {
    it('should update item quantity in the cart', async () => {
      const updateQuantityDto: UpdateQuantityDto = { quantity: 5 };
      const updatedCart = new Cart(
        'cart-1',
        new Date('2023-01-01'),
        new Date('2023-01-01'),
        [new CartItem('item-1', ItemType.PRODUCT, 5, 10.99, 'Test Product')],
      );

      updateCartItemQuantityUseCase.execute.mockResolvedValue(updatedCart);

      const result = await controller.updateQuantity(
        'cart-1',
        'item-1',
        updateQuantityDto,
      );

      expect(updateCartItemQuantityUseCase.execute).toHaveBeenCalledWith(
        'cart-1',
        'item-1',
        5,
      );
      expect(result).toEqual(updatedCart);
    });
  });

  describe('clearCart', () => {
    it('should clear all items from the cart', async () => {
      clearCartUseCase.execute.mockResolvedValue(undefined);

      await controller.clearCart('cart-1');

      expect(clearCartUseCase.execute).toHaveBeenCalledWith('cart-1');
    });
  });
});
