import { Product } from '@context/items/domain/entities/product.entity';
import type { IProductRepository } from '@context/items/domain/repositories/product.repository.port';
import { Inject, Injectable } from '@nestjs/common';

/**
 * Caso de uso para obtener todos los productos
 * Orquesta la lógica de negocio para la consulta de todos los productos
 */
@Injectable()
export class GetAllProductsUseCase {
  constructor(
    @Inject('ProductRepositoryPort')
    private readonly productRepository: IProductRepository,
  ) { }

  /**
   * Ejecuta la búsqueda de todos los productos
   * @returns Lista de todos los productos
   */
  async execute(): Promise<Product[]> {
    return this.productRepository.findAll();
  }
}
