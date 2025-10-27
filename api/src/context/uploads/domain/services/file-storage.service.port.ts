/**
 * Puerto (interfaz) para el servicio de almacenamiento de archivos
 * Define el contrato para guardar y eliminar archivos físicamente
 */
export interface IFileStorageService {
  /**
   * Guarda un archivo en el sistema de almacenamiento
   * @param file - Buffer del archivo
   * @param fileName - Nombre del archivo
   * @param mimeType - Tipo MIME del archivo
   * @returns Información del archivo guardado
   */
  saveFile(
    file: Buffer,
    fileName: string,
    mimeType: string,
  ): Promise<{
    fileName: string;
    path: string;
    url: string;
  }>;

  /**
   * Elimina un archivo del sistema de almacenamiento
   * @param filePath - Ruta del archivo a eliminar
   */
  deleteFile(filePath: string): Promise<void>;

  /**
   * Verifica si un archivo existe
   * @param filePath - Ruta del archivo
   * @returns true si el archivo existe
   */
  fileExists(filePath: string): Promise<boolean>;

  /**
   * Genera un nombre único para el archivo
   * @param originalName - Nombre original del archivo
   * @returns Nombre único generado
   */
  generateUniqueFileName(originalName: string): string;
}
