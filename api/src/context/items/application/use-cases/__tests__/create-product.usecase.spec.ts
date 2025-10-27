import { CreateProductDto } from '@context/items/application/dtos/create-product.dto';
import { Product } from '@context/items/domain/entities/product.entity';
import { InvalidItemDataException } from '@context/items/domain/exceptions/invalid-item-data.exception';
import { IProductRepository } from '@context/items/domain/repositories/product.repository.port';
import { Test, TestingModule } from '@nestjs/testing';
import { CreateProductUseCase } from '../create-product.usecase';

describe('CreateProductUseCase', () => {
  let useCase: CreateProductUseCase;
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
        CreateProductUseCase,
        { provide: 'ProductRepositoryPort', useValue: mockProductRepository },
      ],
    }).compile();

    useCase = module.get<CreateProductUseCase>(CreateProductUseCase);
    productRepository = module.get('ProductRepositoryPort');
  });

  it('debería estar definido', () => {
    expect(useCase).toBeDefined();
  });

  it('debería crear un producto exitosamente', async () => {
    const createProductDto: CreateProductDto = {
      name: 'Producto de Prueba',
      thumbnail: 'https://example.com/image.jpg',
      description: 'Descripción del producto',
      unit: 1,
      unitPrice: 99.99,
    };

    productRepository.create.mockResolvedValue(mockProduct);

    const result = await useCase.execute(createProductDto);

    expect(productRepository.create).toHaveBeenCalledWith(
      'Producto de Prueba',
      'https://example.com/image.jpg',
      'Descripción del producto',
      1,
      99.99,
    );
    expect(result).toEqual(mockProduct);
  });

  it('debería crear un producto con valores por defecto', async () => {
    const createProductDto: CreateProductDto = {
      name: 'Producto Básico',
    };

    productRepository.create.mockResolvedValue(mockProduct);

    await useCase.execute(createProductDto);

    expect(productRepository.create).toHaveBeenCalledWith(
      'Producto Básico',
      undefined,
      undefined,
      1,
      0,
    );
  });

  it('debería lanzar excepción si el nombre está vacío', async () => {
    const createProductDto: CreateProductDto = {
      name: '',
    };

    await expect(useCase.execute(createProductDto)).rejects.toThrow(
      InvalidItemDataException,
    );
    expect(productRepository.create).not.toHaveBeenCalled();
  });

  it('debería lanzar excepción si el precio es negativo', async () => {
    const createProductDto: CreateProductDto = {
      name: 'Producto de Prueba',
      unitPrice: -10,
    };

    await expect(useCase.execute(createProductDto)).rejects.toThrow(
      InvalidItemDataException,
    );
    expect(productRepository.create).not.toHaveBeenCalled();
  });

  it('debería lanzar excepción si la unidad es menor a 1', async () => {
    const createProductDto: CreateProductDto = {
      name: 'Producto de Prueba',
      unit: 0,
    };

    await expect(useCase.execute(createProductDto)).rejects.toThrow(
      InvalidItemDataException,
    );
    expect(productRepository.create).not.toHaveBeenCalled();
  });

  it('debería recortar espacios en blanco del nombre', async () => {
    const createProductDto: CreateProductDto = {
      name: '  Producto con Espacios  ',
    };

    productRepository.create.mockResolvedValue(mockProduct);

    await useCase.execute(createProductDto);

    expect(productRepository.create).toHaveBeenCalledWith(
      'Producto con Espacios',
      undefined,
      undefined,
      1,
      0,
    );
  });
});
