import { CreateProductDto } from '@context/items/application/dtos/create-product.dto';
import { UpdateProductDto } from '@context/items/application/dtos/update-product.dto';
import { CreateProductUseCase } from '@context/items/application/use-cases/create-product.usecase';
import { DeleteProductUseCase } from '@context/items/application/use-cases/delete-product.usecase';
import { GetAllProductsUseCase } from '@context/items/application/use-cases/get-all-products.usecase';
import { GetProductUseCase } from '@context/items/application/use-cases/get-product.usecase';
import { SearchProductsUseCase } from '@context/items/application/use-cases/search-products.usecase';
import { UpdateProductUseCase } from '@context/items/application/use-cases/update-product.usecase';
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';

/**
 * Controlador REST para la gestión de productos
 * Maneja las peticiones HTTP y delega la lógica de negocio a los casos de uso
 */
@Controller('products')
export class ProductsController {
  constructor(
    private readonly createProductUseCase: CreateProductUseCase,
    private readonly getProductUseCase: GetProductUseCase,
    private readonly getAllProductsUseCase: GetAllProductsUseCase,
    private readonly updateProductUseCase: UpdateProductUseCase,
    private readonly deleteProductUseCase: DeleteProductUseCase,
    private readonly searchProductsUseCase: SearchProductsUseCase,
  ) { }

  /**
   * Crea un nuevo producto
   * @param dto - Datos del producto a crear
   * @returns Producto creado
   */
  @Post()
  async createProduct(@Body() dto: CreateProductDto) {
    return this.createProductUseCase.execute(dto);
  }

  /**
   * Obtiene todos los productos o busca por nombre si se proporciona query
   * @param search - Término de búsqueda opcional
   * @returns Lista de productos
   */
  @Get()
  async getProducts(@Query('search') search?: string) {
    if (search) {
      return this.searchProductsUseCase.execute(search);
    }
    return this.getAllProductsUseCase.execute();
  }

  /**
   * Obtiene un producto por su ID
   * @param id - ID del producto
   * @returns Producto encontrado
   */
  @Get(':id')
  async getProduct(@Param('id') id: string) {
    return this.getProductUseCase.execute(id);
  }

  /**
   * Actualiza un producto existente
   * @param id - ID del producto a actualizar
   * @param dto - Datos a actualizar
   * @returns Producto actualizado
   */
  @Put(':id')
  async updateProduct(@Param('id') id: string, @Body() dto: UpdateProductDto) {
    return this.updateProductUseCase.execute(id, dto);
  }

  /**
   * Elimina un producto
   * @param id - ID del producto a eliminar
   */
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteProduct(@Param('id') id: string) {
    await this.deleteProductUseCase.execute(id);
  }
}
