/**
 * Excepción lanzada cuando se intenta realizar una operación con un estado de orden inválido
 */
export class InvalidOrderStatusException extends Error {
  constructor(currentStatus: string, operation: string) {
    super(`No se puede ${operation} una orden con estado ${currentStatus}`);
    this.name = 'InvalidOrderStatusException';
  }
}
