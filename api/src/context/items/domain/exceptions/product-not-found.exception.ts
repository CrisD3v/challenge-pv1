/**
 * Excepción lanzada cuando no se encuentra un producto
 */
export class ProductNotFoundException extends Error {
  constructor(productId: string) {
    super(`Producto con ID ${productId} no encontrado`);
    this.name = 'ProductNotFoundException';
  }
}
