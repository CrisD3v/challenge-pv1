import { ItemType } from '@prisma/client';
import { IsEnum, IsInt, IsOptional, IsString, Min } from 'class-validator';

/**
 * DTO AddCartItemDto - Objeto de transferencia de datos para agregar elementos al carrito
 *
 * Este DTO define la estructura y validaciones necesarias para agregar un elemento
 * al carrito de compras. Incluye validaciones automáticas usando class-validator
 * para asegurar la integridad de los datos de entrada.
 *
 * Características principales:
 * - Validación automática de tipos de datos
 * - Soporte polimórfico para productos y eventos
 * - Mensajes de error en inglés para la API
 * - Validación de cantidad mínima
 *
 * Reglas de validación:
 * - itemType debe ser 'PRODUCT' o 'EVENT'
 * - productId es requerido solo para productos
 * - eventId es requerido solo para eventos
 * - quantity debe ser un entero mayor o igual a 1
 */
export class AddCartItemDto {
  /**
   * Tipo de elemento a agregar al carrito
   *
   * @example 'PRODUCT' | 'EVENT'
   */
  @IsEnum(ItemType, { message: 'itemType must be PRODUCT or EVENT' })
  itemType: ItemType;

  /**
   * ID del producto (requerido solo si itemType es 'PRODUCT')
   *
   * @example 'prod-123-abc'
   */
  @IsOptional()
  @IsString({ message: 'productId must be a string' })
  productId?: string;

  /**
   * ID del evento (requerido solo si itemType es 'EVENT')
   *
   * @example 'event-456-def'
   */
  @IsOptional()
  @IsString({ message: 'eventId must be a string' })
  eventId?: string;

  /**
   * Cantidad del elemento a agregar
   *
   * Debe ser un número entero positivo mayor o igual a 1.
   *
   * @example 3
   */
  @IsInt({ message: 'quantity must be an integer' })
  @Min(1, { message: 'quantity must be at least 1' })
  quantity: number;
}
