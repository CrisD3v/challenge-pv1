import { CreateProductDto } from '@context/items/application/dtos/create-product.dto';
import { Product } from '@context/items/domain/entities/product.entity';
import { InvalidItemDataException } from '@context/items/domain/exceptions/invalid-item-data.exception';
import type { IProductRepository } from '@context/items/domain/repositories/product.repository.port';
import { Inject, Injectable } from '@nestjs/common';

/**
 * Caso de uso para crear un nuevo producto
 * Orquesta la lógica de negocio para la creación de productos
 */
@Injectable()
export class CreateProductUseCase {
  constructor(
    @Inject('ProductRepositoryPort')
    private readonly productRepository: IProductRepository,
  ) { }

  /**
   * Ejecuta la creación de un nuevo producto
   * @param dto - Datos del producto a crear
   * @returns Producto creado
   * @throws InvalidItemDataException si los datos son inválidos
   */
  async execute(dto: CreateProductDto): Promise<Product> {
    // Validar que el nombre no esté vacío
    if (!dto.name || dto.name.trim().length === 0) {
      throw new InvalidItemDataException('El nombre del producto es requerido');
    }

    // Validar que el precio sea válido si se proporciona
    if (dto.unitPrice !== undefined && dto.unitPrice < 0) {
      throw new InvalidItemDataException('El precio unitario no puede ser negativo');
    }

    // Validar que la unidad sea válida si se proporciona
    if (dto.unit !== undefined && dto.unit < 1) {
      throw new InvalidItemDataException('La unidad debe ser mayor a 0');
    }

    // Crear el producto usando el repositorio
    return this.productRepository.create(
      dto.name.trim(),
      dto.thumbnail,
      dto.description,
      dto.unit || 1,
      dto.unitPrice || 0,
    );
  }
}
