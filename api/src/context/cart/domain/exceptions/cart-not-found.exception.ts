/**
 * Excepción CartNotFoundException - Se lanza cuando no se encuentra un carrito
 *
 * Esta excepción específica del dominio se utiliza para indicar que se intentó
 * acceder a un carrito que no existe en el sistema. Proporciona información
 * contextual sobre qué carrito específico no fue encontrado.
 *
 * Casos de uso típicos:
 * - Búsqueda de carrito por ID inexistente
 * - Operaciones sobre carritos que fueron eliminados
 * - Acceso a carritos con IDs malformados o inválidos
 *
 * @extends Error - Extiende la clase Error nativa de JavaScript
 */
export class CartNotFoundException extends Error {
  /**
   * Constructor de CartNotFoundException
   *
   * @param cartId - ID del carrito que no fue encontrado
   *
   * @example
   * // En un caso de uso o repositorio
   * const cart = await this.cartRepository.findById('invalid-id');
   * if (!cart) {
   *   throw new CartNotFoundException('invalid-id');
   * }
   *
   * // Resultado: Error con mensaje "Cart with id invalid-id not found"
   */
  constructor(cartId: string) {
    // Llamar al constructor padre con un mensaje descriptivo
    super(`Cart with id ${cartId} not found`);

    // Establecer el nombre de la excepción para facilitar la identificación
    this.name = 'CartNotFoundException';
  }
}
