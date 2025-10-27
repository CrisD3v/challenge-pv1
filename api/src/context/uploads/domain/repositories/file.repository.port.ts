import { UploadedFile } from '@context/uploads/domain/entities/uploaded-file.entity';

/**
 * Puerto (interfaz) para el repositorio de archivos
 * Define el contrato que debe implementar cualquier adaptador de persistencia
 */
export interface IFileRepository {
  /**
   * Busca un archivo por su ID
   * @param id - ID del archivo
   * @returns Archivo encontrado o null si no existe
   */
  findById(id: string): Promise<UploadedFile | null>;

  /**
   * Obtiene todos los archivos
   * @returns Lista de todos los archivos
   */
  findAll(): Promise<UploadedFile[]>;

  /**
   * Busca archivos por tipo MIME
   * @param mimeType - Tipo MIME a buscar
   * @returns Lista de archivos que coinciden con el tipo
   */
  findByMimeType(mimeType: string): Promise<UploadedFile[]>;

  /**
   * Obtiene solo archivos de imagen
   * @returns Lista de archivos de imagen
   */
  findImages(): Promise<UploadedFile[]>;

  /**
   * Guarda información de un archivo subido
   * @param originalName - Nombre original del archivo
   * @param fileName - Nombre del archivo en el servidor
   * @param mimeType - Tipo MIME del archivo
   * @param size - Tamaño del archivo en bytes
   * @param path - Ruta del archivo en el servidor
   * @param url - URL pública del archivo
   * @returns Archivo guardado
   */
  save(
    originalName: string,
    fileName: string,
    mimeType: string,
    size: number,
    path: string,
    url: string,
  ): Promise<UploadedFile>;

  /**
   * Elimina un archivo del registro
   * @param id - ID del archivo a eliminar
   */
  delete(id: string): Promise<void>;
}
