/**
 * Excepción CartItemNotFoundException - Se lanza cuando no se encuentra un elemento del carrito
 *
 * Esta excepción específica del dominio se utiliza para indicar que se intentó
 * acceder a un elemento específico dentro de un carrito que no existe.
 * Proporciona información contextual sobre qué elemento específico no fue encontrado.
 *
 * Casos de uso típicos:
 * - Actualización de cantidad de un elemento inexistente
 * - Eliminación de elementos que ya no están en el carrito
 * - Operaciones sobre elementos con IDs inválidos
 *
 * @extends Error - Extiende la clase Error nativa de JavaScript
 */
export class CartItemNotFoundException extends Error {
  /**
   * Constructor de CartItemNotFoundException
   *
   * @param itemId - ID del elemento del carrito que no fue encontrado
   *
   * @example
   * // En una operación de actualización de cantidad
   * const item = cart.items.find(item => item.id === 'invalid-item-id');
   * if (!item) {
   *   throw new CartItemNotFoundException('invalid-item-id');
   * }
   *
   * // Resultado: Error con mensaje "Cart item with id invalid-item-id not found"
   */
  constructor(itemId: string) {
    // Llamar al constructor padre con un mensaje descriptivo
    super(`Cart item with id ${itemId} not found`);

    // Establecer el nombre de la excepción para facilitar la identificación
    this.name = 'CartItemNotFoundException';
  }
}
