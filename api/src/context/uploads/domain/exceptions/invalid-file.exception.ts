/**
 * Excepción lanzada cuando un archivo es inválido
 */
export class InvalidFileException extends Error {
  constructor(message: string) {
    super(`Archivo inválido: ${message}`);
    this.name = 'InvalidFileException';
  }
}
