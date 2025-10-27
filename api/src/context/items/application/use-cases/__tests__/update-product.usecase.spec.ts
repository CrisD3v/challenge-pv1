import { UpdateProductDto } from '@context/items/application/dtos/update-product.dto';
import { Product } from '@context/items/domain/entities/product.entity';
import { InvalidItemDataException } from '@context/items/domain/exceptions/invalid-item-data.exception';
import { ProductNotFoundException } from '@context/items/domain/exceptions/product-not-found.exception';
import { IProductRepository } from '@context/items/domain/repositories/product.repository.port';
import { Test, TestingModule } from '@nestjs/testing';
import { UpdateProductUseCase } from '../update-product.usecase';

describe('UpdateProductUseCase', () => {
  let useCase: UpdateProductUseCase;
  let productRepository: jest.Mocked<IProductRepository>;

  const mockProduct = new Product(
    'product-1',
    'Producto Original',
    'https://example.com/image.jpg',
    'Descripción original',
    1,
    99.99,
    new Date('2023-01-01'),
    new Date('2023-01-01'),
  );

  const mockUpdatedProduct = new Product(
    'product-1',
    'Producto Actualizado',
    'https://example.com/new-image.jpg',
    'Descripción actualizada',
    2,
    149.99,
    new Date('2023-01-01'),
    new Date('2023-01-02'),
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
        UpdateProductUseCase,
        { provide: 'ProductRepositoryPort', useValue: mockProductRepository },
      ],
    }).compile();

    useCase = module.get<UpdateProductUseCase>(UpdateProductUseCase);
    productRepository = module.get('ProductRepositoryPort');
  });

  it('debería estar definido', () => {
    expect(useCase).toBeDefined();
  });

  it('debería actualizar un producto exitosamente', async () => {
    const updateProductDto: UpdateProductDto = {
      name: 'Producto Actualizado',
      unitPrice: 149.99,
    };

    productRepository.findById.mockResolvedValue(mockProduct);
    productRepository.update.mockResolvedValue(mockUpdatedProduct);

    const result = await useCase.execute('product-1', updateProductDto);

    expect(productRepository.findById).toHaveBeenCalledWith('product-1');
    expect(productRepository.update).toHaveBeenCalledWith(
      'product-1',
      'Producto Actualizado',
      undefined,
      undefined,
      undefined,
      149.99,
    );
    expect(result).toEqual(mockUpdatedProduct);
  });

  it('debería lanzar ProductNotFoundException cuando el producto no existe', async () => {
    const updateProductDto: UpdateProductDto = {
      name: 'Producto Actualizado',
    };

    productRepository.findById.mockResolvedValue(null);

    await expect(useCase.execute('producto-inexistente', updateProductDto)).rejects.toThrow(
      ProductNotFoundException,
    );

    expect(productRepository.update).not.toHaveBeenCalled();
  });

  it('debería lanzar excepción si el nombre está vacío', async () => {
    const updateProductDto: UpdateProductDto = {
      name: '',
    };

    productRepository.findById.mockResolvedValue(mockProduct);

    await expect(useCase.execute('product-1', updateProductDto)).rejects.toThrow(
      InvalidItemDataException,
    );

    expect(productRepository.update).not.toHaveBeenCalled();
  });

  it('debería lanzar excepción si el precio es negativo', async () => {
    const updateProductDto: UpdateProductDto = {
      unitPrice: -10,
    };

    productRepository.findById.mockResolvedValue(mockProduct);

    await expect(useCase.execute('product-1', updateProductDto)).rejects.toThrow(
      InvalidItemDataException,
    );

    expect(productRepository.update).not.toHaveBeenCalled();
  });

  it('debería lanzar excepción si la unidad es menor a 1', async () => {
    const updateProductDto: UpdateProductDto = {
      unit: 0,
    };

    productRepository.findById.mockResolvedValue(mockProduct);

    await expect(useCase.execute('product-1', updateProductDto)).rejects.toThrow(
      InvalidItemDataException,
    );

    expect(productRepository.update).not.toHaveBeenCalled();
  });

  it('debería recortar espacios en blanco del nombre', async () => {
    const updateProductDto: UpdateProductDto = {
      name: '  Producto con Espacios  ',
    };

    productRepository.findById.mockResolvedValue(mockProduct);
    productRepository.update.mockResolvedValue(mockUpdatedProduct);

    await useCase.execute('product-1', updateProductDto);

    expect(productRepository.update).toHaveBeenCalledWith(
      'product-1',
      'Producto con Espacios',
      undefined,
      undefined,
      undefined,
      undefined,
    );
  });
});
