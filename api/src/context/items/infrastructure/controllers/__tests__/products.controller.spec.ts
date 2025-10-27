import { CreateProductDto } from '@context/items/application/dtos/create-product.dto';
import { UpdateProductDto } from '@context/items/application/dtos/update-product.dto';
import { CreateProductUseCase } from '@context/items/application/use-cases/create-product.usecase';
import { DeleteProductUseCase } from '@context/items/application/use-cases/delete-product.usecase';
import { GetAllProductsUseCase } from '@context/items/application/use-cases/get-all-products.usecase';
import { GetProductUseCase } from '@context/items/application/use-cases/get-product.usecase';
import { SearchProductsUseCase } from '@context/items/application/use-cases/search-products.usecase';
import { UpdateProductUseCase } from '@context/items/application/use-cases/update-product.usecase';
import { Product } from '@context/items/domain/entities/product.entity';
import { Test, TestingModule } from '@nestjs/testing';
import { ProductsController } from '../products.controller';

describe('ProductsController', () => {
  let controller: ProductsController;
  let createProductUseCase: jest.Mocked<CreateProductUseCase>;
  let getProductUseCase: jest.Mocked<GetProductUseCase>;
  let getAllProductsUseCase: jest.Mocked<GetAllProductsUseCase>;
  let updateProductUseCase: jest.Mocked<UpdateProductUseCase>;
  let deleteProductUseCase: jest.Mocked<DeleteProductUseCase>;
  let searchProductsUseCase: jest.Mocked<SearchProductsUseCase>;

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

  const mockProducts = [mockProduct];

  beforeEach(async () => {
    const mockCreateProductUseCase = {
      execute: jest.fn(),
    };

    const mockGetProductUseCase = {
      execute: jest.fn(),
    };

    const mockGetAllProductsUseCase = {
      execute: jest.fn(),
    };

    const mockUpdateProductUseCase = {
      execute: jest.fn(),
    };

    const mockDeleteProductUseCase = {
      execute: jest.fn(),
    };

    const mockSearchProductsUseCase = {
      execute: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductsController],
      providers: [
        { provide: CreateProductUseCase, useValue: mockCreateProductUseCase },
        { provide: GetProductUseCase, useValue: mockGetProductUseCase },
        { provide: GetAllProductsUseCase, useValue: mockGetAllProductsUseCase },
        { provide: UpdateProductUseCase, useValue: mockUpdateProductUseCase },
        { provide: DeleteProductUseCase, useValue: mockDeleteProductUseCase },
        { provide: SearchProductsUseCase, useValue: mockSearchProductsUseCase },
      ],
    }).compile();

    controller = module.get<ProductsController>(ProductsController);
    createProductUseCase = module.get(CreateProductUseCase);
    getProductUseCase = module.get(GetProductUseCase);
    getAllProductsUseCase = module.get(GetAllProductsUseCase);
    updateProductUseCase = module.get(UpdateProductUseCase);
    deleteProductUseCase = module.get(DeleteProductUseCase);
    searchProductsUseCase = module.get(SearchProductsUseCase);
  });

  it('debería estar definido', () => {
    expect(controller).toBeDefined();
  });

  describe('createProduct', () => {
    it('debería crear un producto', async () => {
      const createProductDto: CreateProductDto = {
        name: 'Producto de Prueba',
        unitPrice: 99.99,
      };

      createProductUseCase.execute.mockResolvedValue(mockProduct);

      const result = await controller.createProduct(createProductDto);

      expect(createProductUseCase.execute).toHaveBeenCalledWith(createProductDto);
      expect(result).toEqual(mockProduct);
    });
  });

  describe('getProducts', () => {
    it('debería retornar todos los productos cuando no hay búsqueda', async () => {
      getAllProductsUseCase.execute.mockResolvedValue(mockProducts);

      const result = await controller.getProducts();

      expect(getAllProductsUseCase.execute).toHaveBeenCalled();
      expect(result).toEqual(mockProducts);
    });

    it('debería buscar productos cuando se proporciona término de búsqueda', async () => {
      const searchTerm = 'prueba';
      searchProductsUseCase.execute.mockResolvedValue(mockProducts);

      const result = await controller.getProducts(searchTerm);

      expect(searchProductsUseCase.execute).toHaveBeenCalledWith(searchTerm);
      expect(result).toEqual(mockProducts);
    });
  });

  describe('getProduct', () => {
    it('debería retornar un producto por ID', async () => {
      getProductUseCase.execute.mockResolvedValue(mockProduct);

      const result = await controller.getProduct('product-1');

      expect(getProductUseCase.execute).toHaveBeenCalledWith('product-1');
      expect(result).toEqual(mockProduct);
    });
  });

  describe('updateProduct', () => {
    it('debería actualizar un producto', async () => {
      const updateProductDto: UpdateProductDto = {
        name: 'Producto Actualizado',
        unitPrice: 149.99,
      };

      const updatedProduct = new Product(
        'product-1',
        'Producto Actualizado',
        'https://example.com/image.jpg',
        'Descripción del producto',
        1,
        149.99,
        new Date('2023-01-01'),
        new Date('2023-01-02'),
      );

      updateProductUseCase.execute.mockResolvedValue(updatedProduct);

      const result = await controller.updateProduct('product-1', updateProductDto);

      expect(updateProductUseCase.execute).toHaveBeenCalledWith('product-1', updateProductDto);
      expect(result).toEqual(updatedProduct);
    });
  });

  describe('deleteProduct', () => {
    it('debería eliminar un producto', async () => {
      deleteProductUseCase.execute.mockResolvedValue(undefined);

      await controller.deleteProduct('product-1');

      expect(deleteProductUseCase.execute).toHaveBeenCalledWith('product-1');
    });
  });
});
