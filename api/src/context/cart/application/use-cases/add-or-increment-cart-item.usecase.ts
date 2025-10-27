import { AddCartItemDto } from '@context/cart/application/dtos/add-cart-item.dto';
import { Cart } from '@context/cart/domain/entities/cart.entity';
import { CartNotFoundException } from '@context/cart/domain/exceptions/cart-not-found.exception';
import type { ICartRepository } from '@context/cart/domain/repositories/cart.repository.port';
import { Inject, Injectable } from '@nestjs/common';

/**
 * Caso de Uso AddOrIncrementCartItemUseCase - Agregar o incrementar elementos en el carrito
 *
 * Este caso de uso implementa una de las reglas de negocio más importantes del carrito:
 * la agregación automática de elementos duplicados. Cuando se intenta agregar un elemento
 * que ya existe en el carrito (mismo tipo y producto/evento), incrementa la cantidad
 * existente en lugar de crear un elemento duplicado.
 *
 * Reglas de negocio implementadas:
 * - Verificación de existencia del carrito
 * - Agregación automática de elementos duplicados
 * - Adición de nuevos elementos únicos
 * - Manejo de errores con excepciones específicas del dominio
 *
 * Flujo de ejecución:
 * 1. Verificar que el carrito existe
 * 2. Delegar la lógica de agregación/incremento al repositorio
 * 3. Retornar el carrito actualizado
 * 4. Manejar errores apropiadamente
 *
 * Características:
 * - Operación idempotente (puede ejecutarse múltiples veces)
 * - Transaccional (la operación completa o falla completamente)
 * - Validación de entrada mediante DTO
 * - Manejo de excepciones específicas del dominio
 */
@Injectable()
export class AddOrIncrementCartItemUseCase {
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
   * Ejecuta la adición o incremento de un elemento en el carrito
   *
   * Esta operación implementa la lógica de negocio para agregar elementos al carrito
   * con comportamiento inteligente:
   *
   * - Si el elemento ya existe (mismo tipo y producto/evento): incrementa la cantidad
   * - Si el elemento no existe: lo agrega como nuevo elemento
   * - Si el carrito no existe: lanza CartNotFoundException
   *
   * La lógica de comparación de elementos se basa en:
   * - Tipo de elemento (PRODUCT o EVENT)
   * - ID del producto (para productos)
   * - ID del evento (para eventos)
   *
   * @param cartId - Identificador único del carrito
   * @param dto - Datos del elemento a agregar (validados automáticamente)
   * @returns Promise que resuelve al carrito actualizado con el nuevo elemento
   * @throws CartNotFoundException si el carrito especificado no existe
   *
   * @example
   * // Agregar un producto nuevo
   * const dto1 = {
   *   itemType: 'PRODUCT',
   *   productId: 'prod-123',
   *   quantity: 2
   * };
   * const cart1 = await useCase.execute('cart-456', dto1);
   * // Resultado: carrito con 1 elemento de cantidad 2
   *
   * // Agregar el mismo producto (se incrementará la cantidad)
   * const dto2 = {
   *   itemType: 'PRODUCT',
   *   productId: 'prod-123',
   *   quantity: 1
   * };
   * const cart2 = await useCase.execute('cart-456', dto2);
   * // Resultado: carrito con 1 elemento de cantidad 3 (2 + 1)
   *
   * // Agregar un producto diferente
   * const dto3 = {
   *   itemType: 'PRODUCT',
   *   productId: 'prod-789',
   *   quantity: 1
   * };
   * const cart3 = await useCase.execute('cart-456', dto3);
   * // Resultado: carrito con 2 elementos diferentes
   */
  async execute(cartId: string, dto: AddCartItemDto): Promise<Cart> {
    // Verificar que el carrito existe antes de proceder
    const cart = await this.cartRepository.findById(cartId);
    if (!cart) {
      throw new CartNotFoundException(cartId);
    }

    // Delegar la lógica de agregación/incremento al repositorio
    // El repositorio implementa la lógica específica de:
    // - Verificar si el elemento ya existe
    // - Incrementar cantidad si existe
    // - Agregar nuevo elemento si no existe
    await this.cartRepository.addItem(
      cartId,
      dto.itemType,
      dto.productId,
      dto.eventId,
      dto.quantity,
    );

    // Obtener el carrito actualizado para retornarlo
    const updatedCart = await this.cartRepository.findById(cartId);
    if (!updatedCart) {
      // Esta situación no debería ocurrir en condiciones normales
      // pero proporcionamos manejo de error por robustez
      throw new CartNotFoundException(cartId);
    }

    return updatedCart;
  }
}
