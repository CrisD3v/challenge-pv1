import { Cart } from '@context/cart/domain/entities/cart.entity';
import type { ICartRepository } from '@context/cart/domain/repositories/cart.repository.port';
import { Inject, Injectable } from '@nestjs/common';

/**
 * Caso de Uso CreateCartUseCase - Crear un nuevo carrito de compras
 *
 * Este caso de uso encapsula la lógica de negocio para crear un nuevo carrito
 * de compras vacío. Siguiendo los principios de Clean Architecture, orquesta
 * las operaciones necesarias sin depender de detalles de implementación.
 *
 * Responsabilidades:
 * - Coordinar la creación de un nuevo carrito
 * - Delegar la persistencia al repositorio
 * - Retornar el carrito recién creado
 *
 * Características:
 * - Operación simple sin validaciones complejas
 * - Inyección de dependencias mediante puerto (interface)
 * - Retorna una entidad del dominio
 * - Operación asíncrona
 */
@Injectable()
export class CreateCartUseCase {
  /**
   * Constructor del caso de uso
   *
   * @param cartRepository - Repositorio de carritos inyectado mediante el puerto
   */
  constructor(
    @Inject('CartRepositoryPort')
    private readonly cartRepository: ICartRepository,
  ) { }

  /**
   * Ejecuta la creación de un nuevo carrito
   *
   * Esta operación crea un carrito vacío listo para recibir elementos.
   * El carrito se inicializa con timestamps de creación y actualización,
   * un ID único, y una lista vacía de elementos.
   *
   * @returns Promise que resuelve al carrito recién creado
   *
   * @example
   * const createCartUseCase = new CreateCartUseCase(cartRepository);
   * const newCart = await createCartUseCase.execute();
   *
   * console.log(`Nuevo carrito creado con ID: ${newCart.id}`);
   * console.log(`Elementos en el carrito: ${newCart.items.length}`); // 0
   * console.log(`Total del carrito: ${newCart.total()}`); // 0
   */
  async execute(): Promise<Cart> {
    // Delegar la creación al repositorio
    return this.cartRepository.create();
  }
}
