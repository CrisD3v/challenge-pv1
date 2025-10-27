import { Product } from '@context/items/domain/entities/product.entity';
import { ProductNotFoundException } from '@context/items/domain/exceptions/product-not-found.exception';
import type { IProductRepository } from '@context/items/domain/repositories/product.repository.port';
import { Inject, Injectable } from '@nestjs/common';

/**
 * Caso de uso para obtener un producto por ID
 * Orquesta la lógica de negocio para la consulta de productos
 */
@Injectable()
export class GetProductUseCase {
  constructor(
    @Inject('ProductRepositoryPort')
    private readonly productRepository: IProductRepository,
  ) { }

  /**
   * Ejecuta la búsqueda de un producto por ID
   * @param id - ID del producto a buscar
   * @returns Producto encontrado
   * @throws ProductNotFoundException si el producto no existe
   */
  async execute(id: string): Promise<Product> {
    const product = await this.productRepository.findById(id);

    if (!product) {
      throw new ProductNotFoundException(id);
    }

    return product;
  }
}
