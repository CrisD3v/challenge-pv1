import { ProductNotFoundException } from '@context/items/domain/exceptions/product-not-found.exception';
import type { IProductRepository } from '@context/items/domain/repositories/product.repository.port';
import { Inject, Injectable } from '@nestjs/common';

/**
 * Caso de uso para eliminar un producto
 * Orquesta la lógica de negocio para la eliminación de productos
 */
@Injectable()
export class DeleteProductUseCase {
  constructor(
    @Inject('ProductRepositoryPort')
    private readonly productRepository: IProductRepository,
  ) { }

  /**
   * Ejecuta la eliminación de un producto
   * @param id - ID del producto a eliminar
   * @throws ProductNotFoundException si el producto no existe
   */
  async execute(id: string): Promise<void> {
    // Verificar que el producto existe antes de eliminarlo
    const existingProduct = await this.productRepository.findById(id);
    if (!existingProduct) {
      throw new ProductNotFoundException(id);
    }

    // Eliminar el producto
    await this.productRepository.delete(id);
  }
}
