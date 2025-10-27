import { ItemType } from '@prisma/client';

/**
 * Entidad CartItem - Representa un elemento individual dentro de un carrito de compras
 *
 * Esta entidad encapsula la lógica de negocio relacionada con los elementos del carrito,
 * incluyendo el cálculo de subtotales y la comparación entre elementos.
 *
 * Características principales:
 * - Soporte polimórfico para productos y eventos
 * - Cálculo automático de subtotales
 * - Comparación inteligente entre elementos
 * - Inmutabilidad de propiedades (readonly)
 */
export class CartItem {
  /**
   * Constructor de CartItem
   *
   * @param id - Identificador único del elemento en el carrito
   * @param itemType - Tipo de elemento: 'PRODUCT' o 'EVENT'
   * @param quantity - Cantidad del elemento en el carrito
   * @param unitPrice - Precio unitario del elemento
   * @param name - Nombre descriptivo del elemento
   * @param productId - ID del producto (requerido si itemType es 'PRODUCT')
   * @param eventId - ID del evento (requerido si itemType es 'EVENT')
   */
  constructor(
    public readonly id: string,
    public readonly itemType: ItemType,
    public readonly quantity: number,
    public readonly unitPrice: number,
    public readonly name: string,
    public readonly productId?: string,
    public readonly eventId?: string,
  ) { }

  /**
   * Calcula el subtotal del elemento (precio unitario × cantidad)
   *
   * @returns Subtotal calculado con precisión decimal
   *
   * @example
   * const item = new CartItem('1', 'PRODUCT', 3, 10.50, 'Producto A');
   * console.log(item.subtotal()); // 31.50
   */
  subtotal(): number {
    return this.unitPrice * this.quantity;
  }

  /**
   * Obtiene el ID del item (productId o eventId según el tipo)
   *
   * Esta función facilita el acceso al ID correspondiente según el tipo de elemento,
   * evitando la necesidad de verificar manualmente el tipo en el código cliente.
   *
   * @returns ID del producto o evento, undefined si no está definido
   *
   * @example
   * const productItem = new CartItem('1', 'PRODUCT', 1, 10, 'Producto', 'prod-123');
   * console.log(productItem.getItemId()); // 'prod-123'
   *
   * const eventItem = new CartItem('2', 'EVENT', 1, 50, 'Evento', undefined, 'event-456');
   * console.log(eventItem.getItemId()); // 'event-456'
   */
  getItemId(): string | undefined {
    return this.itemType === 'PRODUCT' ? this.productId : this.eventId;
  }

  /**
   * Verifica si este item es el mismo que otro (mismo tipo y mismo producto/evento)
   *
   * Esta función implementa la lógica de comparación de elementos del carrito,
   * considerando que dos elementos son iguales si:
   * 1. Tienen el mismo tipo (PRODUCT o EVENT)
   * 2. Tienen el mismo ID de producto/evento
   * 3. Ambos tienen IDs válidos (no undefined)
   *
   * @param other - Otro CartItem a comparar
   * @returns true si son el mismo item, false en caso contrario
   *
   * @example
   * const item1 = new CartItem('1', 'PRODUCT', 2, 10, 'Producto A', 'prod-123');
   * const item2 = new CartItem('2', 'PRODUCT', 1, 10, 'Producto A', 'prod-123');
   * const item3 = new CartItem('3', 'EVENT', 1, 50, 'Evento B', undefined, 'event-456');
   *
   * console.log(item1.isSameAs(item2)); // true (mismo producto)
   * console.log(item1.isSameAs(item3)); // false (diferentes tipos)
   */
  isSameAs(other: CartItem): boolean {
    // Verificar que ambos elementos sean del mismo tipo
    if (this.itemType !== other.itemType) {
      return false;
    }

    // Obtener los IDs correspondientes según el tipo
    const thisItemId = this.getItemId();
    const otherItemId = other.getItemId();

    // Comparar IDs y asegurar que ambos sean válidos
    return thisItemId === otherItemId && thisItemId !== undefined;
  }
}
