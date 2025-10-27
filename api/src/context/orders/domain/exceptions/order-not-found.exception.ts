/**
 * Excepción lanzada cuando no se encuentra una orden
 */
export class OrderNotFoundException extends Error {
  constructor(orderId: string) {
    super(`Orden con ID ${orderId} no encontrada`);
    this.name = 'OrderNotFoundException';
  }
}
