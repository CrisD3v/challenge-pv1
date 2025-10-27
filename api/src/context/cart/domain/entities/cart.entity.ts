import { CartItem } from './cart-item.entity';

/**
 * Entidad Cart - Representa un carrito de compras completo
 *
 * Esta entidad agregada encapsula toda la lógica de negocio relacionada con la gestión
 * del carrito de compras, incluyendo la adición de elementos, cálculo de totales,
 * y manejo de cantidades.
 *
 * Características principales:
 * - Agregación automática de elementos duplicados
 * - Cálculo dinámico de totales
 * - Gestión inteligente de cantidades (eliminación automática en 0)
 * - Operaciones de limpieza completa del carrito
 *
 * Reglas de negocio implementadas:
 * - Los elementos del mismo tipo y producto/evento se agregan automáticamente
 * - Los elementos con cantidad 0 o negativa se eliminan automáticamente
 * - El total se calcula en tiempo real basado en los subtotales de cada elemento
 */
export class Cart {
  /**
   * Constructor de Cart
   *
   * @param id - Identificador único del carrito
   * @param createdAt - Fecha de creación del carrito
   * @param updatedAt - Fecha de última actualización del carrito
   * @param items - Array de elementos en el carrito (por defecto vacío)
   */
  constructor(
    public readonly id: string,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
    public readonly items: CartItem[] = [],
  ) { }

  /**
   * Calcula el total del carrito sumando todos los subtotales de los elementos
   *
   * @returns Total del carrito con precisión decimal
   *
   * @example
   * const cart = new Cart('cart-1', new Date(), new Date(), [
   *   new CartItem('1', 'PRODUCT', 2, 10.50, 'Producto A'),
   *   new CartItem('2', 'EVENT', 1, 25.00, 'Evento B')
   * ]);
   * console.log(cart.total()); // 46.00 (21.00 + 25.00)
   */
  total(): number {
    return this.items.reduce((sum, item) => sum + item.subtotal(), 0);
  }

  /**
   * Agrega un elemento al carrito con lógica de agregación automática
   *
   * Si ya existe un elemento del mismo tipo y producto/evento en el carrito,
   * se incrementa la cantidad del elemento existente. Si no existe, se agrega
   * como un nuevo elemento.
   *
   * Esta función implementa una de las reglas de negocio más importantes:
   * la agregación automática de elementos duplicados.
   *
   * @param item - Elemento a agregar al carrito
   *
   * @example
   * const cart = new Cart('cart-1', new Date(), new Date());
   *
   * // Agregar primer elemento
   * cart.addItem(new CartItem('1', 'PRODUCT', 2, 10.00, 'Producto A', 'prod-123'));
   * console.log(cart.items.length); // 1
   * console.log(cart.items[0].quantity); // 2
   *
   * // Agregar el mismo producto (se agregará a la cantidad existente)
   * cart.addItem(new CartItem('2', 'PRODUCT', 1, 10.00, 'Producto A', 'prod-123'));
   * console.log(cart.items.length); // 1 (no se crea nuevo elemento)
   * console.log(cart.items[0].quantity); // 3 (2 + 1)
   */
  addItem(item: CartItem): void {
    // Buscar si ya existe un item del mismo tipo y con el mismo producto/evento
    const existingItemIndex = this.items.findIndex(
      (existingItem) => existingItem.isSameAs(item)
    );

    if (existingItemIndex >= 0) {
      // Incrementar cantidad si el item ya existe
      const existingItem = this.items[existingItemIndex];
      const updatedItem = new CartItem(
        existingItem.id,
        existingItem.itemType,
        existingItem.quantity + item.quantity, // Sumar las cantidades
        existingItem.unitPrice,
        existingItem.name,
        existingItem.productId,
        existingItem.eventId
      );
      this.items[existingItemIndex] = updatedItem;
    } else {
      // Agregar nuevo item si no existe
      this.items.push(item);
    }
  }

  /**
   * Actualiza la cantidad de un elemento específico en el carrito
   *
   * Esta función implementa la lógica de actualización de cantidades con
   * eliminación automática cuando la cantidad es 0 o negativa.
   *
   * Comportamientos:
   * - Si quantity > 0: actualiza la cantidad del elemento
   * - Si quantity <= 0: elimina el elemento del carrito
   * - Si el elemento no existe: lanza una excepción
   *
   * @param itemId - ID del elemento a actualizar
   * @param quantity - Nueva cantidad (si es <= 0, elimina el elemento)
   * @throws Error si el elemento no se encuentra en el carrito
   *
   * @example
   * const cart = new Cart('cart-1', new Date(), new Date(), [
   *   new CartItem('item-1', 'PRODUCT', 3, 10.00, 'Producto A')
   * ]);
   *
   * // Actualizar cantidad
   * cart.updateItemQuantity('item-1', 5);
   * console.log(cart.items[0].quantity); // 5
   *
   * // Eliminar elemento (cantidad 0)
   * cart.updateItemQuantity('item-1', 0);
   * console.log(cart.items.length); // 0 (elemento eliminado)
   */
  updateItemQuantity(itemId: string, quantity: number): void {
    const itemIndex = this.items.findIndex(item => item.id === itemId);
    if (itemIndex === -1) {
      throw new Error('Item not found in cart');
    }

    if (quantity <= 0) {
      // Eliminar item si la cantidad es 0 o negativa
      this.items.splice(itemIndex, 1);
    } else {
      // Actualizar cantidad del item creando una nueva instancia (inmutabilidad)
      const item = this.items[itemIndex];
      this.items[itemIndex] = new CartItem(
        item.id,
        item.itemType,
        quantity,
        item.unitPrice,
        item.name,
        item.productId,
        item.eventId
      );
    }
  }

  /**
   * Limpia completamente el carrito eliminando todos los elementos
   *
   * Esta operación es irreversible y elimina todos los elementos del carrito,
   * dejándolo en un estado vacío.
   *
   * @example
   * const cart = new Cart('cart-1', new Date(), new Date(), [
   *   new CartItem('1', 'PRODUCT', 2, 10.00, 'Producto A'),
   *   new CartItem('2', 'EVENT', 1, 25.00, 'Evento B')
   * ]);
   *
   * console.log(cart.items.length); // 2
   * cart.clear();
   * console.log(cart.items.length); // 0
   * console.log(cart.total()); // 0
   */
  clear(): void {
    this.items.length = 0;
  }
}
