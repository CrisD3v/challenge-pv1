import { AddCartItemDto } from '@context/cart/application/dtos/add-cart-item.dto';
import { UpdateQuantityDto } from '@context/cart/application/dtos/update-quantity.dto';
import { AddCartItemUseCase } from '@context/cart/application/use-cases/add-cart-items.usecase';
import { AddOrIncrementCartItemUseCase } from '@context/cart/application/use-cases/add-or-increment-cart-item.usecase';
import { ClearCartUseCase } from '@context/cart/application/use-cases/clear-cart.usecase';
import { CreateCartUseCase } from '@context/cart/application/use-cases/create-cart.usecase';
import { DecrementCartItemUseCase } from '@context/cart/application/use-cases/decrement-cart-item.usecase';
import { GetAllCartsUseCase } from '@context/cart/application/use-cases/get-all-carts.usecase';
import { GetCartUseCase } from '@context/cart/application/use-cases/get-cart-item.usecase';
import { UpdateCartItemQuantityUseCase } from '@context/cart/application/use-cases/update-cart-item-quantity.usecase';
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
} from '@nestjs/common';

/**
 * Controlador CartController - Punto de entrada HTTP para operaciones de carrito
 *
 * Este controlador implementa la capa de presentación para el contexto de carrito,
 * exponiendo endpoints RESTful que permiten a los clientes interactuar con el
 * sistema de carritos de compras. Siguiendo los principios de Clean Architecture,
 * actúa como un adaptador que traduce las peticiones HTTP a llamadas de casos de uso.
 *
 * Características principales:
 * - API RESTful completa para gestión de carritos
 * - Validación automática de entrada mediante DTOs
 * - Inyección de dependencias de casos de uso
 * - Manejo de códigos de estado HTTP apropiados
 * - Separación clara de responsabilidades
 *
 * Endpoints disponibles:
 * - POST /cart - Crear nuevo carrito
 * - GET /cart - Obtener todos los carritos
 * - GET /cart/:cartId - Obtener carrito específico
 * - POST /cart/:cartId/items - Agregar elemento básico
 * - POST /cart/:cartId/items/add-or-increment - Agregar con lógica inteligente
 * - PUT /cart/:cartId/items/:itemId/quantity - Actualizar cantidad específica
 * - PUT /cart/:cartId/items/:itemId/decrement - Decrementar cantidad
 * - DELETE /cart/:cartId/items - Limpiar carrito
 *
 * Reglas de negocio expuestas:
 * - Agregación automática de elementos duplicados
 * - Eliminación automática cuando cantidad llega a 0
 * - Validación de entrada mediante DTOs
 * - Manejo de errores con códigos HTTP apropiados
 */
@Controller('cart')
export class CartController {
  /**
   * Constructor del controlador
   *
   * Inyecta todos los casos de uso necesarios para las operaciones del carrito.
   * Cada caso de uso encapsula una operación específica de negocio.
   *
   * @param createCartUseCase - Caso de uso para crear carritos
   * @param addCartItemUseCase - Caso de uso para agregar elementos básico
   * @param getCartUseCase - Caso de uso para obtener carrito por ID
   * @param updateCartItemQuantityUseCase - Caso de uso para actualizar cantidades
   * @param clearCartUseCase - Caso de uso para limpiar carritos
   * @param getAllCartsUseCase - Caso de uso para obtener todos los carritos
   * @param addOrIncrementCartItemUseCase - Caso de uso para agregar con lógica inteligente
   * @param decrementCartItemUseCase - Caso de uso para decrementar cantidades
   */
  constructor(
    private readonly createCartUseCase: CreateCartUseCase,
    private readonly addCartItemUseCase: AddCartItemUseCase,
    private readonly getCartUseCase: GetCartUseCase,
    private readonly updateCartItemQuantityUseCase: UpdateCartItemQuantityUseCase,
    private readonly clearCartUseCase: ClearCartUseCase,
    private readonly getAllCartsUseCase: GetAllCartsUseCase,
    private readonly addOrIncrementCartItemUseCase: AddOrIncrementCartItemUseCase,
    private readonly decrementCartItemUseCase: DecrementCartItemUseCase,
  ) { }

  /**
   * Crear un nuevo carrito vacío
   *
   * @returns Carrito recién creado con ID único y lista de elementos vacía
   *
   * @example
   * POST /cart
   * Response: {
   *   "id": "cart-123-abc",
   *   "createdAt": "2023-01-01T00:00:00.000Z",
   *   "updatedAt": "2023-01-01T00:00:00.000Z",
   *   "items": []
   * }
   */
  @Post()
  async createCart() {
    return this.createCartUseCase.execute();
  }

  /**
   * Obtener todos los carritos del sistema
   *
   * @returns Array con todos los carritos existentes
   *
   * @example
   * GET /cart
   * Response: [
   *   {
   *     "id": "cart-123",
   *     "items": [...],
   *     "createdAt": "...",
   *     "updatedAt": "..."
   *   }
   * ]
   */
  @Get()
  async getAllCarts() {
    return this.getAllCartsUseCase.execute();
  }

  /**
   * Obtener un carrito específico por su ID
   *
   * @param cartId - Identificador único del carrito
   * @returns Carrito con todos sus elementos y totales calculados
   *
   * @example
   * GET /cart/cart-123
   * Response: {
   *   "id": "cart-123",
   *   "items": [
   *     {
   *       "id": "item-456",
   *       "itemType": "PRODUCT",
   *       "quantity": 2,
   *       "unitPrice": 10.50,
   *       "name": "Producto A"
   *     }
   *   ],
   *   "total": 21.00
   * }
   */
  @Get(':cartId')
  async getCart(@Param('cartId') cartId: string) {
    return this.getCartUseCase.execute(cartId);
  }

  /**
   * Agregar un elemento al carrito (método básico)
   *
   * Este endpoint agrega elementos sin lógica de agregación automática.
   * Para comportamiento inteligente, usar el endpoint add-or-increment.
   *
   * @param cartId - ID del carrito al que agregar el elemento
   * @param dto - Datos del elemento a agregar (validados automáticamente)
   * @returns Carrito actualizado con el nuevo elemento
   *
   * @example
   * POST /cart/cart-123/items
   * Body: {
   *   "itemType": "PRODUCT",
   *   "productId": "prod-456",
   *   "quantity": 2
   * }
   */
  @Post(':cartId/items')
  async addItem(@Param('cartId') cartId: string, @Body() dto: AddCartItemDto) {
    return this.addCartItemUseCase.execute(cartId, dto);
  }

  /**
   * Actualizar la cantidad específica de un elemento
   *
   * Establece una cantidad exacta para un elemento existente.
   * Si la cantidad es 0, elimina el elemento del carrito.
   *
   * @param cartId - ID del carrito
   * @param itemId - ID del elemento dentro del carrito
   * @param dto - Nueva cantidad (validada automáticamente)
   * @returns Carrito actualizado
   *
   * @example
   * PUT /cart/cart-123/items/item-456/quantity
   * Body: { "quantity": 5 }
   */
  @Put(':cartId/items/:itemId/quantity')
  async updateQuantity(
    @Param('cartId') cartId: string,
    @Param('itemId') itemId: string,
    @Body() dto: UpdateQuantityDto,
  ) {
    return this.updateCartItemQuantityUseCase.execute(
      cartId,
      itemId,
      dto.quantity,
    );
  }

  /**
   * Limpiar completamente un carrito
   *
   * Elimina todos los elementos del carrito, dejándolo vacío.
   * Retorna código 204 (No Content) para indicar éxito sin contenido.
   *
   * @param cartId - ID del carrito a limpiar
   *
   * @example
   * DELETE /cart/cart-123/items
   * Response: 204 No Content
   */
  @Delete(':cartId/items')
  @HttpCode(HttpStatus.NO_CONTENT)
  async clearCart(@Param('cartId') cartId: string) {
    await this.clearCartUseCase.execute(cartId);
  }

  /**
   * Agregar elemento con lógica inteligente de agregación
   *
   * Implementa la regla de negocio principal: si el mismo elemento ya existe
   * en el carrito (mismo tipo y producto/evento), incrementa su cantidad en
   * lugar de crear un elemento duplicado.
   *
   * @param cartId - ID del carrito
   * @param dto - Datos del elemento a agregar (validados automáticamente)
   * @returns Carrito actualizado con el elemento agregado o incrementado
   *
   * @example
   * POST /cart/cart-123/items/add-or-increment
   * Body: {
   *   "itemType": "PRODUCT",
   *   "productId": "prod-456",
   *   "quantity": 1
   * }
   *
   * // Si el producto ya existe con cantidad 2, el resultado será cantidad 3
   * // Si el producto no existe, se agrega como nuevo elemento
   */
  @Post(':cartId/items/add-or-increment')
  async addOrIncrementItem(@Param('cartId') cartId: string, @Body() dto: AddCartItemDto) {
    return this.addOrIncrementCartItemUseCase.execute(cartId, dto);
  }

  /**
   * Decrementar la cantidad de un elemento específico
   *
   * Implementa la regla de negocio de decremento inteligente: reduce la cantidad
   * en 1 unidad y elimina automáticamente el elemento si la cantidad llega a 0.
   *
   * @param cartId - ID del carrito
   * @param itemId - ID del elemento a decrementar
   * @returns Carrito actualizado (con elemento decrementado o eliminado)
   *
   * @example
   * PUT /cart/cart-123/items/item-456/decrement
   *
   * // Si el elemento tenía cantidad 3, ahora tendrá cantidad 2
   * // Si el elemento tenía cantidad 1, será eliminado del carrito
   */
  @Put(':cartId/items/:itemId/decrement')
  async decrementItem(@Param('cartId') cartId: string, @Param('itemId') itemId: string) {
    return this.decrementCartItemUseCase.execute(cartId, itemId);
  }
}
