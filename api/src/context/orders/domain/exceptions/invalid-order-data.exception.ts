/**
 * Excepción lanzada cuando los datos de la orden son inválidos
 */
export class InvalidOrderDataException extends Error {
  constructor(message: string) {
    super(`Datos de orden inválidos: ${message}`);
    this.name = 'InvalidOrderDataException';
  }
}
