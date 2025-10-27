/**
 * Excepción lanzada cuando no se encuentra un archivo
 */
export class FileNotFoundException extends Error {
  constructor(fileId: string) {
    super(`Archivo con ID ${fileId} no encontrado`);
    this.name = 'FileNotFoundException';
  }
}
