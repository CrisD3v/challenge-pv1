import { Cart } from '@context/cart/domain/entities/cart.entity';
import type { ICartRepository } from '@context/cart/domain/repositories/cart.repository.port';
import { Test, TestingModule } from '@nestjs/testing';
import { CreateCartUseCase } from '@context/cart/application/use-cases/create-cart.usecase';

describe('CreateCartUseCase', () => {
  let useCase: CreateCartUseCase;
  let cartRepository: jest.Mocked<ICartRepository>;

  const mockCart = new Cart(
    'cart-1',
    new Date('2023-01-01'),
    new Date('2023-01-01'),
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
        CreateCartUseCase,
        { provide: 'CartRepositoryPort', useValue: mockCartRepository },
      ],
    }).compile();

    useCase = module.get<CreateCartUseCase>(CreateCartUseCase);
    cartRepository = module.get('CartRepositoryPort');
  });

  it('should be defined', () => {
    expect(useCase).toBeDefined();
  });

  it('should create a new cart', async () => {
    cartRepository.create.mockResolvedValue(mockCart);

    const result = await useCase.execute();

    expect(cartRepository.create).toHaveBeenCalled();
    expect(result).toEqual(mockCart);
  });
});
