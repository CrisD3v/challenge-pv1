import { Product } from '@context/items/domain/entities/product.entity';
import { ProductNotFoundException } from '@context/items/domain/exceptions/product-not-found.exception';
import { IProductRepository } from '@context/items/domain/repositories/product.repository.port';
import { Test, TestingModule } from '@nestjs/testing';
import { GetProductUseCase } from '../get-product.usecase';

describe('GetProductUseCase', () => {
  let useCase: GetProductUseCase;
  let productRepository: jest.Mocked<IProductRepository>;

  const mockProduct = new Product(
    'product-1',
    'Producto de Prueba',
    'https://example.com/image.jpg',
    'Descripción del producto',
    1,
    99.99,
    new Date('2023-01-01'),
    new Date('2023-01-01'),
  );

  beforeEach(async () => {
    const mockProductRepository = {
      findById: jest.fn(),
      findAll: jest.fn(),
      findByName: jest.fn(),
      findAvailable: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GetProductUseCase,
        { provide: 'ProductRepositoryPort', useValue: mockProductRepository },
      ],
    }).compile();

    useCase = module.get<GetProductUseCase>(GetProductUseCase);
    productRepository = module.get('ProductRepositoryPort');
  });

  it('debería estar definido', () => {
    expect(useCase).toBeDefined();
  });

  it('debería retornar un producto por ID', async () => {
    productRepository.findById.mockResolvedValue(mockProduct);

    const result = await useCase.execute('product-1');

    expect(productRepository.findById).toHaveBeenCalledWith('product-1');
    expect(result).toEqual(mockProduct);
  });

  it('debería lanzar ProductNotFoundException cuando el producto no existe', async () => {
    productRepository.findById.mockResolvedValue(null);

    await expect(useCase.execute('producto-inexistente')).rejects.toThrow(
      ProductNotFoundException,
    );

    expect(productRepository.findById).toHaveBeenCalledWith('producto-inexistente');
  });
});
