/**
 * Excepción lanzada cuando los datos del item son inválidos
 */
export class InvalidItemDataException extends Error {
  constructor(message: string) {
    super(`Datos de item inválidos: ${message}`);
    this.name = 'InvalidItemDataException';
  }
}
