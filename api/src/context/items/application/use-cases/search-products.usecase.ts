import { Product } from '@context/items/domain/entities/product.entity';
import type { IProductRepository } from '@context/items/domain/repositories/product.repository.port';
import { Inject, Injectable } from '@nestjs/common';

/**
 * Caso de uso para buscar productos por nombre
 * Orquesta la lógica de negocio para la búsqueda de productos
 */
@Injectable()
export class SearchProductsUseCase {
  constructor(
    @Inject('ProductRepositoryPort')
    private readonly productRepository: IProductRepository,
  ) { }

  /**
   * Ejecuta la búsqueda de productos por nombre
   * @param name - Nombre o parte del nombre a buscar
   * @returns Lista de productos que coinciden con la búsqueda
   */
  async execute(name: string): Promise<Product[]> {
    // Si no se proporciona nombre, retornar lista vacía
    if (!name || name.trim().length === 0) {
      return [];
    }

    return this.productRepository.findByName(name.trim());
  }
}
