import { UpdateProductDto } from '@context/items/application/dtos/update-product.dto';
import { Product } from '@context/items/domain/entities/product.entity';
import { InvalidItemDataException } from '@context/items/domain/exceptions/invalid-item-data.exception';
import { ProductNotFoundException } from '@context/items/domain/exceptions/product-not-found.exception';
import type { IProductRepository } from '@context/items/domain/repositories/product.repository.port';
import { Inject, Injectable } from '@nestjs/common';

/**
 * Caso de uso para actualizar un producto existente
 * Orquesta la lógica de negocio para la actualización de productos
 */
@Injectable()
export class UpdateProductUseCase {
  constructor(
    @Inject('ProductRepositoryPort')
    private readonly productRepository: IProductRepository,
  ) { }

  /**
   * Ejecuta la actualización de un producto
   * @param id - ID del producto a actualizar
   * @param dto - Datos a actualizar
   * @returns Producto actualizado
   * @throws ProductNotFoundException si el producto no existe
   * @throws InvalidItemDataException si los datos son inválidos
   */
  async execute(id: string, dto: UpdateProductDto): Promise<Product> {
    // Verificar que el producto existe
    const existingProduct = await this.productRepository.findById(id);
    if (!existingProduct) {
      throw new ProductNotFoundException(id);
    }

    // Validar datos si se proporcionan
    if (dto.name !== undefined && dto.name.trim().length === 0) {
      throw new InvalidItemDataException('El nombre del producto no puede estar vacío');
    }

    if (dto.unitPrice !== undefined && dto.unitPrice < 0) {
      throw new InvalidItemDataException('El precio unitario no puede ser negativo');
    }

    if (dto.unit !== undefined && dto.unit < 1) {
      throw new InvalidItemDataException('La unidad debe ser mayor a 0');
    }

    // Actualizar el producto
    return this.productRepository.update(
      id,
      dto.name?.trim(),
      dto.thumbnail,
      dto.description,
      dto.unit,
      dto.unitPrice,
    );
  }
}
