import { Cart } from '@context/cart/domain/entities/cart.entity';
import { CartNotFoundException } from '@context/cart/domain/exceptions/cart-not-found.exception';
import type { ICartRepository } from '@context/cart/domain/repositories/cart.repository.port';
import { Inject, Injectable } from '@nestjs/common';

/**
 * Caso de Uso DecrementCartItemUseCase - Decrementar cantidad de elementos en el carrito
 *
 * Este caso de uso implementa la lógica de negocio para decrementar la cantidad de un
 * elemento específico en el carrito. Una característica importante es la eliminación
 * automática del elemento cuando su cantidad llega a cero o menos.
 *
 * Reglas de negocio implementadas:
 * - Verificación de existencia del carrito y elemento
 * - Decremento automático de cantidad en 1 unidad
 * - Eliminación automática cuando la cantidad llega a 0 o menos
 * - Manejo de errores con excepciones específicas del dominio
 *
 * Flujo de ejecución:
 * 1. Verificar que el carrito existe
 * 2. Verificar que el elemento existe en el carrito
 * 3. Calcular nueva cantidad (cantidad actual - 1)
 * 4. Actualizar cantidad o eliminar elemento según corresponda
 * 5. Retornar el carrito actualizado
 *
 * Características:
 * - Operación atómica (completa o falla completamente)
 * - Eliminación automática inteligente
 * - Validación de existencia de entidades
 * - Manejo robusto de errores
 */
@Injectable()
export class DecrementCartItemUseCase {
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
   * Ejecuta el decremento de cantidad de un elemento en el carrito
   *
   * Esta operación implementa la lógica de negocio para decrementar elementos:
   *
   * - Reduce la cantidad del elemento en 1 unidad
   * - Si la nueva cantidad es 0 o menos: elimina el elemento automáticamente
   * - Si la nueva cantidad es mayor a 0: actualiza la cantidad
   * - Valida que tanto el carrito como el elemento existan
   *
   * Comportamientos específicos:
   * - Cantidad 3 → Cantidad 2 (actualización normal)
   * - Cantidad 1 → Eliminación del elemento (cantidad llegaría a 0)
   * - Elemento inexistente → Error
   * - Carrito inexistente → CartNotFoundException
   *
   * @param cartId - Identificador único del carrito
   * @param itemId - Identificador único del elemento dentro del carrito
   * @returns Promise que resuelve al carrito actualizado
   * @throws CartNotFoundException si el carrito especificado no existe
   * @throws Error si el elemento especificado no existe en el carrito
   *
   * @example
   * // Decrementar elemento con cantidad > 1
   * const cart1 = await useCase.execute('cart-123', 'item-456');
   * // Si el elemento tenía cantidad 3, ahora tendrá cantidad 2
   *
   * // Decrementar elemento con cantidad = 1
   * const cart2 = await useCase.execute('cart-123', 'item-789');
   * // El elemento se elimina completamente del carrito
   *
   * // Intentar decrementar elemento inexistente
   * try {
   *   await useCase.execute('cart-123', 'item-inexistente');
   * } catch (error) {
   *   console.log(error.message); // "Item not found in cart"
   * }
   */
  async execute(cartId: string, itemId: string): Promise<Cart> {
    // Verificar que el carrito existe antes de proceder
    const cart = await this.cartRepository.findById(cartId);
    if (!cart) {
      throw new CartNotFoundException(cartId);
    }

    // Buscar el elemento específico en el carrito
    const item = cart.items.find(item => item.id === itemId);
    if (!item) {
      throw new Error('Item not found in cart');
    }

    // Calcular nueva cantidad (decrementar en 1)
    const newQuantity = item.quantity - 1;

    // Delegar la actualización al repositorio
    // El método updateQuantity implementa la lógica de:
    // - Actualizar cantidad si newQuantity > 0
    // - Eliminar elemento si newQuantity <= 0
    await this.cartRepository.updateQuantity(cartId, itemId, newQuantity);

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
