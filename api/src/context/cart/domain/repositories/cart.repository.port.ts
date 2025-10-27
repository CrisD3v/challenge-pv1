import { Cart } from '@context/cart/domain/entities/cart.entity';

/**
 * Puerto ICartRepository - Interfaz que define el contrato para el repositorio de carritos
 *
 * Este puerto (interface) define las operaciones de persistencia necesarias para
 * la gestión de carritos de compras. Siguiendo el principio de inversión de dependencias,
 * la capa de dominio define qué operaciones necesita, mientras que la capa de
 * infraestructura proporciona la implementación específica.
 *
 * Características del puerto:
 * - Define operaciones CRUD básicas para carritos
 * - Incluye operaciones específicas del dominio (addItem, updateQuantity, clear)
 * - Todas las operaciones son asíncronas (Promise-based)
 * - Abstrae los detalles de implementación de persistencia
 *
 * Implementaciones típicas:
 * - PrismaCartRepository (base de datos SQL)
 * - MongoCartRepository (base de datos NoSQL)
 * - InMemoryCartRepository (testing)
 */
export interface ICartRepository {
  /**
   * Busca un carrito por su ID
   *
   * @param cartId - Identificador único del carrito
   * @returns Promise que resuelve al carrito encontrado o null si no existe
   *
   * @example
   * const cart = await cartRepository.findById('cart-123');
   * if (cart) {
   *   console.log(`Carrito encontrado con ${cart.items.length} elementos`);
   * } else {
   *   console.log('Carrito no encontrado');
   * }
   */
  findById(cartId: string): Promise<Cart | null>;

  /**
   * Crea un nuevo carrito vacío
   *
   * @returns Promise que resuelve al carrito recién creado
   *
   * @example
   * const newCart = await cartRepository.create();
   * console.log(`Nuevo carrito creado con ID: ${newCart.id}`);
   */
  create(): Promise<Cart>;

  /**
   * Actualiza la cantidad de un elemento específico en el carrito
   *
   * Esta operación puede resultar en la eliminación del elemento si la cantidad es 0.
   *
   * @param cartId - ID del carrito a actualizar
   * @param itemId - ID del elemento dentro del carrito
   * @param quantity - Nueva cantidad (0 elimina el elemento)
   * @returns Promise que resuelve cuando la operación se completa
   *
   * @example
   * // Actualizar cantidad a 5
   * await cartRepository.updateQuantity('cart-123', 'item-456', 5);
   *
   * // Eliminar elemento (cantidad 0)
   * await cartRepository.updateQuantity('cart-123', 'item-456', 0);
   */
  updateQuantity(cartId: string, itemId: string, quantity: number): Promise<void>;

  /**
   * Agrega un nuevo elemento al carrito
   *
   * Si el elemento ya existe (mismo tipo y producto/evento), debe incrementar la cantidad.
   *
   * @param cartId - ID del carrito al que agregar el elemento
   * @param itemType - Tipo de elemento ('PRODUCT' o 'EVENT')
   * @param productId - ID del producto (requerido si itemType es 'PRODUCT')
   * @param eventId - ID del evento (requerido si itemType es 'EVENT')
   * @param quantity - Cantidad a agregar (por defecto 1)
   * @returns Promise que resuelve cuando la operación se completa
   *
   * @example
   * // Agregar producto
   * await cartRepository.addItem('cart-123', 'PRODUCT', 'prod-456', undefined, 2);
   *
   * // Agregar evento
   * await cartRepository.addItem('cart-123', 'EVENT', undefined, 'event-789', 1);
   */
  addItem(cartId: string, itemType: string, productId?: string, eventId?: string, quantity?: number): Promise<void>;

  /**
   * Limpia completamente un carrito eliminando todos sus elementos
   *
   * @param cartId - ID del carrito a limpiar
   * @returns Promise que resuelve cuando la operación se completa
   *
   * @example
   * await cartRepository.clear('cart-123');
   * console.log('Carrito limpiado completamente');
   */
  clear(cartId: string): Promise<void>;

  /**
   * Obtiene todos los carritos del sistema
   *
   * Esta operación puede ser costosa en sistemas con muchos carritos.
   * Considerar implementar paginación en implementaciones reales.
   *
   * @returns Promise que resuelve a un array con todos los carritos
   *
   * @example
   * const allCarts = await cartRepository.getAllCarts();
   * console.log(`Total de carritos en el sistema: ${allCarts.length}`);
   */
  getAllCarts(): Promise<Cart[]>;
}
