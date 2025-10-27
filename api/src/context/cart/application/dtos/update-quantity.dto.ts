import { IsInt, Min } from 'class-validator';

/**
 * DTO UpdateQuantityDto - Objeto de transferencia de datos para actualizar cantidades
 *
 * Este DTO define la estructura y validaciones necesarias para actualizar la cantidad
 * de un elemento específico en el carrito de compras. Se utiliza en operaciones donde
 * el usuario desea modificar la cantidad de un producto o evento ya existente en el carrito.
 *
 * Características principales:
 * - Validación automática de tipo de dato (entero)
 * - Validación de cantidad mínima
 * - Mensajes de error en inglés para la API
 * - Estructura simple y enfocada en una sola responsabilidad
 *
 * Casos de uso típicos:
 * - Incrementar cantidad de un producto en el carrito
 * - Decrementar cantidad de un elemento
 * - Establecer una cantidad específica para un elemento
 *
 * Nota: Si se necesita eliminar un elemento completamente, se debe usar
 * la operación de eliminación específica en lugar de establecer cantidad a 0.
 */
export class UpdateQuantityDto {
  /**
   * Nueva cantidad para el elemento del carrito
   *
   * Debe ser un número entero positivo mayor o igual a 1.
   * Para eliminar un elemento, usar la operación de eliminación específica.
   *
   * @example 5 - Establecer la cantidad a 5 unidades
   */
  @IsInt({ message: 'quantity must be an integer' })
  @Min(1, { message: 'quantity must be at least 1' })
  quantity: number;
}
